const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');  // Import the CORS middleware
const connectDB = require('./config/db'); // Database connection
const morgan = require('morgan');

dotenv.config(); // Load environment variables

const app = express();

// Connect to the database
connectDB();

// Enable CORS for all routes
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

// Middleware to parse incoming requests
app.use(express.json());
app.use(morgan('dev'))

// Home route
app.get('/', (req, res) => {
    res.send('Hello from the server!');
});

// Use the user routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/transaction', require('./routes/transactionRoutes'));
app.use('/api/match', require('./routes/matchRoutes'));
app.use('/api', require('./routes/liveMatchRoutes'));
app.use('/api/banner', require('./routes/bannerRoutes'));

//bookie or FX Routes
app.use('/api/mx/users', require('./bookie/mxroute/mxUserRoutes'));
app.use('/api/mx/spots', require('./bookie/mxroute/mxSpotRoutes'));
app.use('/api/mx/cricketmatch', require('./bookie/mxroute/mxCricketMatchRoute'));
app.use('/api/mx/transaction', require('./bookie/mxroute/mxTransactionRoute'));
app.use('/api/mx', require('./bookie/mxroute/localMatchRoute'));
app.use('/api/mx', require('./bookie/mxroute/bookieRoute'));



// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
