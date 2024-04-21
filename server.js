const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/registrationRouter');

const app = express();
app.use(express.json());

// MongoDB connection string
const MONGODB_URI = 'mongodb://localhost:27017/user_database';

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        // Routes
        app.use('/auth', authRoutes);

        // Start the server
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(error => {
        console.error('Error connecting to MongoDB:', error);
    });
