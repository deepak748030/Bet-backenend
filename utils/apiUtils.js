const axios = require('axios');
// d6a439bb1fmshd0b9d1b5a439a28p123e97jsn3b9786fc696b
// b55e882438msh8961edaac57a08dp13336fjsn4e5a967292f7
// Function to make an API request (API utility function)
const fetchDataFromAPI = async (endpoint) => {
    const options = {
        method: 'GET',
        url: endpoint,
        headers: {
            'x-rapidapi-key': 'd6a439bb1fmshd0b9d1b5a439a28p123e97jsn3b9786fc696b', // Your real API key
            'x-rapidapi-host': 'cricket-live-line1.p.rapidapi.com', // Host for the cricket API
        },
    };

    try {
        const response = await axios.request(options);
        return response.data;
    } catch (error) {
        console.error(`Error fetching data from API: ${error}`);
        throw new Error('API request failed');
    }
};

module.exports = fetchDataFromAPI;
