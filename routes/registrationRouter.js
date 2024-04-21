const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const path = require('path');
const multer = require('multer');
const User = require('../models/registrationModel');

// Multer setup for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Specify the uploads folder
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Use the original name of the file for the filename
    }
});
const upload = multer({ storage: storage });
// Registration route
router.post('/register', upload.single('image'), async (req, res) => {
    try {
        const { name, email, mobileNumber, password } = req.body;
        const image = req.file ? req.file.filename : '';

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            name,
            email,
            mobileNumber,
            image,
            password: hashedPassword
        });
        await newUser.save();
        
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Login route
router.post('/login', upload.single('image'),async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login request:', req.body);
        const UserData = await User.findOne({ email });
        
        if (!UserData) {
            console.log('User not found');
            return res.status(404).json({ error: 'User not found' });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, UserData.password);
        if (!isPasswordValid) {
            console.log('Invalid password');
            return res.status(401).json({ error: 'Invalid password' });
        }

        console.log('Login successful');
        res.status(200).json({ message: 'Login successful', UserData });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


//get allrecords
router.get('/alluser', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {

        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
