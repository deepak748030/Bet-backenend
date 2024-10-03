const axios = require('axios');
const ScoreCard = require('../models/scorecardModel'); // Import the ScoreCard model
const fetchDataFromAPI = require('../utils/apiUtils');

// Function to get live matches and their scorecards directly from the database
const getLiveMatchesAndScorecards = async (req, res) => {
    try {
        // Fetch live matches list from API
        const liveMatchesResponse = await fetchDataFromAPI('https://cricket-live-line1.p.rapidapi.com/liveMatches');
        const liveMatches = liveMatchesResponse.data;

        // Handle case where no live matches are found
        if (!liveMatches || liveMatches.length === 0) {
            return res.status(404).json({ message: 'No live matches found' });
        }

        // Extract match IDs and fetch scorecards for each match
        const matchDetailsPromises = liveMatches.map(async (match) => {
            const matchId = match.match_id;

            try {
                // Fetch scorecard for each match
                let scorecardResponse = await fetchDataFromAPI(`https://cricket-live-line1.p.rapidapi.com/match/${matchId}/scorecard`);
                let scorecard = scorecardResponse.data?.scorecard || null;

                // If scorecard is null, fallback to recentMatches API
                if (!scorecard) {
                    const recentMatchesResponse = await fetchDataFromAPI('https://cricket-live-line1.p.rapidapi.com/recentMatches');
                    const recentMatches = recentMatchesResponse.data;

                    // Find the match in recentMatches data
                    const recentMatch = recentMatches.find(recentMatch => recentMatch.match_id === matchId);
                    scorecard = recentMatch ? recentMatch.scorecard || null : null;
                }

                const matchStatus = scorecard ? 'live' : 'endmatch';

                // Update or insert into MongoDB
                const existingMatch = await ScoreCard.findOne({ matchId });
                if (existingMatch) {
                    existingMatch.scorecard = scorecard;
                    existingMatch.status = matchStatus;
                    await existingMatch.save();
                } else {
                    await ScoreCard.create({ matchId, scorecard, status: matchStatus });
                }

                // Return match details
                return {
                    matchId,
                    scorecard,
                    status: matchStatus
                };
            } catch (error) {
                console.error(`Error fetching scorecard for match ID ${matchId}:`, error);
                return {
                    matchId,
                    scorecard: null,
                    status: 'live'  // Mark the match as live, even if scorecard is missing
                };
            }
        });

        // Wait for all match details to be fetched
        const matchDetails = await Promise.all(matchDetailsPromises);

        // Send the response back with all match details and scorecards
        return res.status(200).json(matchDetails);

    } catch (error) {
        console.error('Error fetching live matches:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Schedule the API hit every 15 minutes to update the database
setInterval(async () => {
    try {
        console.log('Refreshing database...');

        // Fetch live matches again
        const liveMatchesResponse = await fetchDataFromAPI('https://cricket-live-line1.p.rapidapi.com/liveMatches');
        const liveMatches = liveMatchesResponse.data;

        if (!liveMatches || liveMatches.length === 0) {
            console.log('No live matches to update');
            return;
        }

        // Fetch all live matches from the database
        const existingMatches = await ScoreCard.find({});
        const existingMatchIds = existingMatches.map(match => match.matchId);

        // Extract current match IDs from the live matches
        const currentMatchIds = liveMatches.map(match => match.match_id);

        // Check for removed match IDs
        const removedMatchIds = existingMatchIds.filter(id => !currentMatchIds.includes(id));

        // Handle removed matches and update status to 'endmatch'
        if (removedMatchIds.length > 0) {
            console.log('Removed match IDs detected:', removedMatchIds);
            const recentMatchesResponse = await fetchDataFromAPI('https://cricket-live-line1.p.rapidapi.com/recentMatches');
            const recentMatches = recentMatchesResponse.data;

            // Update scorecards and statuses for removed matches
            const removedMatchDetailsPromises = removedMatchIds.map(async (matchId) => {
                const existingMatch = await ScoreCard.findOne({ matchId });

                if (existingMatch) {
                    // If the match is no longer live, update the status to 'endmatch'
                    existingMatch.status = 'endmatch'; // Update status

                    // Check for recent match data
                    const matchData = recentMatches.find(match => match.match_id === matchId);
                    if (matchData) {
                        const scorecard = matchData.scorecard || null;
                        existingMatch.scorecard = scorecard; // Update with recent match scorecard data if available
                    } else {
                        existingMatch.scorecard = null; // No scorecard data available
                    }

                    await existingMatch.save();
                }

                return { matchId, status: 'endmatch' };
            });

            await Promise.all(removedMatchDetailsPromises);
        }

        // Update scorecards for current matches
        const matchDetailsPromises = currentMatchIds.map(async (matchId) => {
            try {
                let scorecardResponse = await fetchDataFromAPI(`https://cricket-live-line1.p.rapidapi.com/match/${matchId}/scorecard`);
                let scorecard = scorecardResponse.data?.scorecard || null;

                // If scorecard is null, fallback to recentMatches API
                if (!scorecard) {
                    const recentMatchesResponse = await fetchDataFromAPI('https://cricket-live-line1.p.rapidapi.com/recentMatches');
                    const recentMatches = recentMatchesResponse.data;

                    // Find the match in recentMatches data
                    const recentMatch = recentMatches.find(recentMatch => recentMatch.match_id === matchId);
                    scorecard = recentMatch ? recentMatch.scorecard || null : null;
                }

                const matchStatus = scorecard ? 'live' : 'endmatch';

                const existingMatch = await ScoreCard.findOne({ matchId });
                if (existingMatch) {
                    existingMatch.scorecard = scorecard;
                    existingMatch.status = matchStatus;
                    await existingMatch.save();
                } else {
                    await ScoreCard.create({ matchId, scorecard, status: matchStatus });
                }

                return { matchId, scorecard, status: matchStatus };
            } catch (error) {
                console.error(`Error fetching scorecard for match ID ${matchId}:`, error);
                return { matchId, scorecard: null, status: 'live' }; // Mark as live, even without scorecard
            }
        });

        // Wait for all current match details to be fetched
        const matchDetails = await Promise.all(matchDetailsPromises);

        console.log('Database updated');
    } catch (error) {
        console.error('Error in scheduled API hit:', error);
    }
}, 900000); // 900,000 ms = 15 minutes



// Function to get scorecard by matchId using the database
const getMatchScorecardById = async (req, res) => {
    const { matchId } = req.params; // Get matchId from the request parameters
    try {
        // Query the database to find the scorecard by matchId
        const scorecardEntry = await ScoreCard.findOne({ matchId });

        // If scorecard is found, return it
        if (scorecardEntry) {
            console.log(`Returning scorecard for match ID ${matchId}`);
            return res.status(200).json(scorecardEntry);
        }

        // If match not found in the database
        return res.status(404).json({ message: 'Match not found in database' });

    } catch (error) {
        console.error('Error fetching match scorecard:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports = { getLiveMatchesAndScorecards, getMatchScorecardById };
