const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Signup route
router.post('/signup', async (req, res) => {
  try {
    console.log('Signup request received:', req.body);
    const { email, password, name } = req.body;

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    console.log('Existing user check:', existingUser);

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      email,
      password: hashedPassword,
      name
    });

    await user.save();
    console.log('New user created:', user._id);

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

// Create initial admin account
router.post('/create-admin', async (req, res) => {
  try {
    const { adminSecret, email, password, name } = req.body;

    // Verify admin secret key
    if (adminSecret !== process.env.ADMIN_SECRET_KEY) {
      return res.status(403).json({ message: 'Invalid admin secret key' });
    }

    const existingAdmin = await User.findOne({ email, isAdmin: true });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin account already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = new User({
      email,
      password: hashedPassword,
      name,
      isAdmin: true
    });

    await admin.save();
    res.status(201).json({ message: 'Admin account created successfully' });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({ message: 'Server error during admin creation' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    console.log('Login request received:', req.body);
    const { email, password, isAdmin } = req.body;

    // Find user and check if they match the requested login type
    const user = await User.findOne({ email });
    console.log('User found:', !!user);

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Validate admin access
    if (isAdmin && !user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized for admin access' });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token with user info and admin status
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email,
        isAdmin: user.isAdmin
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' } // Longer expiration for admin sessions
    );
    
    // Include _id in the response
    const userData = {
      _id: user._id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin // Add isAdmin to response
    };
    
    console.log('Login successful:', {
      userId: user._id,
      email: user.email,
      isAdmin: user.isAdmin
    });
    res.json({ token, user: userData });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Verify token route
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid token' });
      }

      const user = await User.findById(decoded.userId).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({ user });
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({ message: 'Server error during token verification' });
  }
});

module.exports = router;
