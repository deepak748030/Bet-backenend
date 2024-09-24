const axios = require('axios');
const NodeCache = require('node-cache');
const fetchDataFromAPI = require('../utils/apiUtils');

// Initialize cache (TTL 15 minutes, i.e., 900 seconds)
const cache = new NodeCache({ stdTTL: 900 });

// Function to get live matches and their scorecards
const getLiveMatchesAndScorecards = async (req, res) => {
    try {
        // Check if cached data exists
        const cachedData = cache.get('liveMatchesAndScorecards');
        if (cachedData) {
            // Send cached response
            console.log('Returning cached live matches data');
            return res.status(200).json(cachedData);
        }

        // First API call: Fetch list of live matches
        const liveMatches = await fetchDataFromAPI('https://cricket-live-line1.p.rapidapi.com/liveMatches');

        // Extract match IDs from live matches and fetch scorecards for each match
        const matchDetailsPromises = liveMatches.data.map(async (match) => {
            const matchId = match.match_id;

            // Fetch detailed scorecard for each match using matchId
            try {
                const scorecard = await fetchDataFromAPI(`https://cricket-live-line1.p.rapidapi.com/match/${matchId}/scorecard`);
                return {
                    matchId,
                    matchName: match.matchName,
                    scorecard: scorecard.data.scorecard,
                };
            } catch (error) {
                console.error(`Error fetching scorecard for match ID ${matchId}:`, error);
                return { matchId, matchName: match.matchName, error: 'Failed to fetch scorecard' };
            }
        });

        // Wait for all match details to be fetched
        const matchDetails = await Promise.all(matchDetailsPromises);

        // Cache the fetched data
        cache.set('liveMatchesAndScorecards', matchDetails);
        cache.set('scoreCardData', matchDetails); // Also cache for scorecard retrieval

        // Send the response back with all match details and scorecards
        return res.status(200).json(matchDetails);

    } catch (error) {
        console.error('Error fetching live matches:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Schedule the API hit every 15 minutes
setInterval(async () => {
    try {
        // Fetch live matches and update the cache
        console.log('Refreshing cache...');
        const liveMatches = await fetchDataFromAPI('https://cricket-live-line1.p.rapidapi.com/liveMatches');

        const matchDetailsPromises = liveMatches.data.map(async (match) => {
            const matchId = match.match_id;
            try {
                const scorecard = await fetchDataFromAPI(`https://cricket-live-line1.p.rapidapi.com/match/${matchId}/scorecard`);
                return { matchId, matchName: match.matchName, scorecard: scorecard.data.scorecard };
            } catch (error) {
                console.error(`Error fetching scorecard for match ID ${matchId}:`, error);
                return { matchId, matchName: match.matchName, error: 'Failed to fetch scorecard' };
            }
        });

        const matchDetails = await Promise.all(matchDetailsPromises);

        // Update the cache
        cache.set('liveMatchesAndScorecards', matchDetails);
        cache.set('scoreCardData', matchDetails); // Update scoreCardData cache
        console.log('Cache updated');
    } catch (error) {
        console.error('Error in scheduled API hit:', error);
    }
}, 900000); // 900,000 ms = 15 minutes


// Function to get scorecard by matchId using only cached data
const getMatchScorecardById = async (req, res) => {
    const { matchId } = req.params; // Get matchId from the request parameters
    try {
        // Get all cached scorecard data
        const allScoreCards = cache.get('scoreCardData');
        if (!allScoreCards) {
            return res.status(404).json({ message: 'No scorecards found in cache' });
        }

        // Filter scorecard by matchId
        const scorecardEntry = allScoreCards.find(sc => sc.matchId == matchId); // Use == to ensure type coercion if matchId is a string

        if (scorecardEntry) {
            console.log(`Returning cached scorecard for match ID ${matchId}`);
            return res.status(200).json(scorecardEntry);
        }

        // If match not found in cache
        return res.status(404).json({ message: 'Match not found in cache' });

    } catch (error) {
        console.error('Error fetching match scorecard:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports = { getLiveMatchesAndScorecards, getMatchScorecardById };
