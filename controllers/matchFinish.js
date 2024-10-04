const axios = require('axios');
const CricketMatch = require('../models/cricketMatchModel');
const User = require('../models/userModels');
const fetchDataFromAPI = require('../utils/apiUtils');
const NodeCache = require('node-cache');

// Create a cache instance with a standard TTL of 15 minutes
const cache = new NodeCache({ stdTTL: 900 }); // 900 seconds = 15 minutes

const winFunction = async (cricketMatchId) => {
    try {
        // Logic for winFunction
        console.log(`Running win function for cricket match ID: ${cricketMatchId}`);

        // Find the match by its MongoDB _id (cricketMatchId) and populate contestId (Spot data)
        const match = await CricketMatch.findById(cricketMatchId)
            .populate('contestId'); // Populating the Spot data

        if (!match) {
            console.log(`No match found with cricket match ID: ${cricketMatchId}`);
            return;
        }

        const commissionAmount = (match?.contestId?.commission * match?.contestId?.amount) / 100;
        const userWinningBalance = (2 * match?.contestId?.amount) - commissionAmount;

        // Find the user by their userId
        const userData = await User.findById(match.userId);
        if (!userData) {
            console.log(`No user found with ID: ${match.userId}`);
            return;
        }

        console.log(`User's current winning wallet: ${userData.winningWallet}`);
        console.log(`User's winning balance from match: ${userWinningBalance}`);

        // Update the user's winningWallet by adding the winning amount
        const updatedUser = await User.findByIdAndUpdate(
            match.userId,
            { $inc: { winningWallet: userWinningBalance } }, // Increment winningWallet by userWinningBalance
            { new: true } // Return the updated user data
        );

        console.log(`User's updated winning wallet: ${updatedUser.winningWallet}`);
    } catch (error) {
        console.error('Error in winFunction:', error);
    }
};

// Function to update isMatchFinished status and result
const updateFinishedMatches = async () => {
    try {
        console.log('Running update for finished matches...');

        // Fetch all matches where isMatchFinished is false and isBetAccepted is true
        const unfinishedMatches = await CricketMatch.find({
            isMatchFinished: false,
            isBetAccepted: true
        });
        console.log(`Unfinished matches found: ${unfinishedMatches.length}`);

        // Check if recent matches are in cache
        let recentMatches = cache.get('recentMatches');

        // If cache is empty, fetch recent matches from API
        if (!recentMatches) {
            console.log('Fetching recent matches from API...');
            const recentMatchesResponse = await fetchDataFromAPI('https://cricket-live-line1.p.rapidapi.com/recentMatches');
            recentMatches = recentMatchesResponse.data || [];
            // Store fetched data in cache
            cache.set('recentMatches', recentMatches);
            console.log(`Recent matches cached: ${recentMatches.length}`);
        }

        // Prepare arrays for batch updates
        const matchesToUpdate = [];
        const resultsToUpdate = {}; // To hold matchId to result mapping

        // Iterate over unfinished matches and compare them with recentMatches API data
        for (const match of unfinishedMatches) {
            const cricketMatchId = match._id; // Get the MongoDB _id
            const matchId = match.matchId;
            const selectedTeam = match.selectedTeam.name; // Get the selected team's name

            // Find corresponding match from recentMatches using matchId
            const recentMatch = recentMatches.find(recent => recent.match_id === matchId);

            // If match found and status indicates it has ended, update isMatchFinished
            if (recentMatch) {
                console.log(`Checking match ID: ${matchId}`);

                if (recentMatch.match_status === 'Finished') {
                    console.log(`Match ID ${matchId} is finished.`);

                    // Update the isMatchFinished field
                    matchesToUpdate.push(cricketMatchId);  // Collect cricketMatchId for batch update

                    // Extract the winning team from the result string
                    const resultString = recentMatch.result; // e.g., "Saint Lucia Kings won by 15 runs (DLS Method)"
                    const winningTeamMatch = resultString.match(/(.*) won/);

                    const winningTeam = winningTeamMatch ? winningTeamMatch[1].trim() : null;

                    // Determine the result based on selected team and recent match result
                    const result = (winningTeam === selectedTeam) ? 'win' : 'loose';
                    console.log(winningTeam, selectedTeam);
                    resultsToUpdate[cricketMatchId] = result; // Map cricketMatchId to result
                }
            }
        }

        // Perform batch update for matches to set isMatchFinished to true and update the result
        if (matchesToUpdate.length > 0) {
            console.log(`Updating matches with IDs: ${matchesToUpdate}`);

            // Prepare updates
            const updatePromises = matchesToUpdate.map(cricketMatchId => {
                return CricketMatch.updateOne(
                    { _id: cricketMatchId }, // Match ID (_id) to update
                    {
                        $set: {
                            isMatchFinished: true,
                            result: resultsToUpdate[cricketMatchId] // Set result for the specific match
                        }
                    }
                ).then(() => {
                    // Call winFunction only if the result is "win"
                    if (resultsToUpdate[cricketMatchId] === 'win') {
                        winFunction(cricketMatchId); // Use cricketMatchId here
                    }
                });
            });

            await Promise.all(updatePromises);
            console.log(`${matchesToUpdate.length} matches updated to finished with results.`);
        } else {
            console.log('No matches to update.');
        }

    } catch (error) {
        console.error('Error updating finished matches:', error);
    }
};

// Function to schedule the update every 15 minutes
const scheduleMatchUpdate = () => {
    setInterval(async () => {
        console.log('Checking for finished matches...');
        await updateFinishedMatches();
        // Cache is managed automatically by node-cache with TTL
    }, 900000);  // 900,000 ms = 15 minutes
};

// Start the scheduled update process
scheduleMatchUpdate();

module.exports = {
    updateFinishedMatches,
    scheduleMatchUpdate
};
