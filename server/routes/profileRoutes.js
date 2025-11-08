const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile } = require('../controllers/profileController');
const { auth } = require('../middleware/auth');

// Get current user's profile with stats
router.get('/me', auth, getUserProfile);

// Update current user's profile
router.put('/me', auth, updateUserProfile);

module.exports = router;
