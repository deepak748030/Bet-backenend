const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');  // Import the CORS middleware
dotenv.config();
const app = express();

// Import routes
const userRoutes = require('./routes/userRoutes');

// Connect to the database
const connectDB = require('./config/db');
connectDB();

// Enable CORS for all routes
app.use(cors({
    origin: '*'
}));

// Middleware to parse incoming requests
app.use(express.json());

app.get('/', (req, res) => {
    res.send('hello')
})
// Use the user routes
app.use('/api/users', userRoutes);

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
