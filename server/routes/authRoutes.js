const express = require('express');
const User = require('../models/User'); // replace with your actual User model path

const router = express.Router();

router.get('/signup', (req, res) => {
    res.render('signup', { title: 'Cooking Blog - Sign Up', infoSubmitObj: '', infoErrorsObj: [] });
});

router.post('/signup', async (req, res) => {
    let infoSubmitObj = '';
    let infoErrorsObj = [];

    try {
        const { name, email, password, description } = req.body;

        // Validate user input
        if (!name || !email || !password || !description) {
            infoErrorsObj.push({ message: 'Please fill in all fields' });
            return res.render('signup', { title: 'Cooking Blog - Sign Up', infoSubmitObj, infoErrorsObj });
        }

        // Check if user already exists
        const existingUser = await User.findByEmail(email);

        if (existingUser) {
            infoErrorsObj.push({ message: 'User already exists' });
            return res.render('signup', { title: 'Cooking Blog - Sign Up', infoSubmitObj, infoErrorsObj });
        }

        // Create new user
        await User.create(name, email, password, description);

        infoSubmitObj = 'Registration successful';
    } catch (error) {
        infoErrorsObj.push({ message: error.message });
    }

    res.render('signup', { title: 'Cooking Blog - Sign Up', infoSubmitObj, infoErrorsObj });
});

router.get('/signin', (req, res) => {
    res.render('signin', { title: 'Cooking Blog - Sign In', infoSubmitObj: '', infoErrorsObj: [] });
});

router.post('/signin', async (req, res) => {
    let infoSubmitObj = '';
    let infoErrorsObj = [];

    try {
        const { email, password } = req.body;

        // Validate user input
        if (!email || !password) {
            infoErrorsObj.push({ message: 'Please fill in all fields' });
            return res.render('signin', { title: 'Cooking Blog - Sign In', infoSubmitObj, infoErrorsObj });
        }

        // Check if user exists
        const user = await User.findByEmail(email);

        if (!user) {
            infoErrorsObj.push({ message: 'User does not exist' });
            return res.render('signin', { title: 'Cooking Blog - Sign In', infoSubmitObj, infoErrorsObj });
        }

        // Check password
        const match = await User.comparePassword(password, user.hash_password);

        if (!match) {
            infoErrorsObj.push({ message: 'Incorrect password' });
            return res.render('signin', { title: 'Cooking Blog - Sign In', infoSubmitObj, infoErrorsObj });
        }

        infoSubmitObj = 'Sign in successful';
    } catch (error) {
        infoErrorsObj.push({ message: error.message });
    }

    res.render('signin', { title: 'Cooking Blog - Sign In', infoSubmitObj, infoErrorsObj });
});

module.exports = router;