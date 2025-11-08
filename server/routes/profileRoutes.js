const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, getUserProfileById } = require('../controllers/profileController');
const { auth } = require('../middleware/auth');

// Get current user's profile with stats
router.get('/me', auth, getUserProfile);

// Update current user's profile
router.put('/me', auth, updateUserProfile);

// Get another user's profile by ID
router.get('/user/:userId', auth, getUserProfileById);

module.exports = router;
