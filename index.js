const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const app = express();

//routes
const userRoutes = require('./routes/userRoutes');

const PORT = process.env.PORT || 3001;
const connectDB = require('./config/db');
connectDB()

// Middleware to parse incoming requests
app.use(express.json());

// Use the user routes
app.use('/api/users', userRoutes);



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});