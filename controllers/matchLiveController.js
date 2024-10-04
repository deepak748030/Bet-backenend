const axios = require('axios');
const ScoreCard = require('../models/scorecardModel'); // Import the ScoreCard model
const fetchDataFromAPI = require('../utils/apiUtils');
const { updateFinishedMatches } = require('./matchFinish');

// Function to get live matches and their scorecards directly from the database
// Function to get live matches and their scorecards directly from the database
const getLiveMatchesAndScorecards = async (req, res) => {
    try {
        // Fetch live matches list from API
        const liveMatchesResponse = await fetchDataFromAPI('https://cricket-live-line1.p.rapidapi.com/liveMatches');
        const liveMatches = liveMatchesResponse.data;
        updateFinishedMatches()

        // Handle case where no live matches are found
        if (!liveMatches || liveMatches.length === 0) {
            // Update all matches in the database to 'endmatch' if no live matches are found
            await ScoreCard.updateMany({ status: 'live' }, { status: 'endmatch' });
            return res.status(404).json({ message: 'No live matches found' });
        }

        // Extract match IDs from live matches
        const currentMatchIds = liveMatches.map(match => match.match_id);

        // Fetch scorecards for each live match
        const matchDetailsPromises = liveMatches.map(async (match) => {
            const matchId = match.match_id;
            // console.log(matchId)

            try {
                // Fetch scorecard for each match from the live scorecard API
                let scorecardResponse = await fetchDataFromAPI(`https://cricket-live-line1.p.rapidapi.com/match/${matchId}/scorecard`);
                let scorecard = scorecardResponse.data?.scorecard || null;

                // If scorecard is null, fallback to recentMatches API
                if (!scorecard) {
                    const recentMatchesResponse = await fetchDataFromAPI('https://cricket-live-line1.p.rapidapi.com/recentMatches');
                    const recentMatches = recentMatchesResponse.data;
                    console.log('recent hit....')
                    // Find the match in recentMatches data
                    const recentMatch = recentMatches.find(recentMatch => recentMatch.match_id === matchId);
                    if (recentMatch) {
                        // Jo match id se  Bno to Bo ab ENd  Ho gao  Ab ka kr hai ke jo data save hego cricket matches mai bbinbe hm dekh hai joki bhi match id jo recentMatch.match_id Binki isMatchFinished true ho je 
                        scorecard = recentMatch.scorecard || null; // Use scorecard from recentMatches if available
                        console.log(recentMatch.scorecard)
                        // MatchId ,Finished Status true ,WithTeaamId
                        // Sbse phle check result mai taem_a name hjai ya team_b ko name hai ya short name dono kho check krke hm bam me se team_id jo rhegi winner ki id 
                        //J akho request mai bhej de or data base mai check kr hai ke ja matchId se jo win team konne selecte kri 
                    }
                }

                const matchStatus = 'live';

                // Update or insert into MongoDB
                const existingMatch = await ScoreCard.findOne({ matchId });
                if (existingMatch) {
                    existingMatch.scorecard = scorecard; // Update scorecard (never null from recentMatches)
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

        // Update all matches that are not currently live to 'endmatch'
        await ScoreCard.updateMany({ matchId: { $nin: currentMatchIds }, status: 'live' }, { status: 'endmatch' });

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
            // No live matches, mark all existing 'live' matches as 'endmatch'
            await ScoreCard.updateMany({ status: 'live' }, { status: 'endmatch' });
            console.log('No live matches to update');
            return;
        }

        // Extract current match IDs from the live matches
        const currentMatchIds = liveMatches.map(match => match.match_id);

        // Update scorecards for current live matches
        const matchDetailsPromises = currentMatchIds.map(async (matchId) => {
            try {
                // Fetch scorecard from the live scorecard API
                let scorecardResponse = await fetchDataFromAPI(`https://cricket-live-line1.p.rapidapi.com/match/${matchId}/scorecard`);
                let scorecard = scorecardResponse.data?.scorecard || null;

                // If scorecard is null, fallback to recentMatches API
                if (!scorecard) {
                    const recentMatchesResponse = await fetchDataFromAPI('https://cricket-live-line1.p.rapidapi.com/recentMatches');
                    const recentMatches = recentMatchesResponse.data;

                    // Find the match in recentMatches data
                    const recentMatch = recentMatches.find(recentMatch => recentMatch.match_id === matchId);
                    if (recentMatch) {
                        scorecard = recentMatch.scorecard || null; // Use recentMatches scorecard if available
                    }
                }

                const matchStatus = 'live';

                const existingMatch = await ScoreCard.findOne({ matchId });
                if (existingMatch) {
                    existingMatch.scorecard = scorecard; // Update with valid scorecard
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
        await Promise.all(matchDetailsPromises);

        // Mark all matches not in the live matches list as 'endmatch'
        await ScoreCard.updateMany({ matchId: { $nin: currentMatchIds }, status: 'live' }, { status: 'endmatch' });

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
