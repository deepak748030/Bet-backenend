const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');  // Import the CORS middleware
const connectDB = require('./config/db'); // Database connection

dotenv.config(); // Load environment variables

const app = express();

// Connect to the database
connectDB();

// Enable CORS for all routes
app.use(cors({
    origin: '*'
}));

// Middleware to parse incoming requests
app.use(express.json());

// Home route
app.get('/', (req, res) => {
    res.send('Hello from the server!');
});

// Use the user routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/transaction', require('./routes/transactionRoutes'));

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
