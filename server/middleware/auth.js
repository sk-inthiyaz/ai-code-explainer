const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify token middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new Error();
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate' });
  }
};

// Admin check middleware
const isAdmin = async (req, res, next) => {
  try {
    await auth(req, res, async () => {
      if (!req.user.isAdmin) {
        return res.status(403).json({ error: 'Admin access required' });
      }
      next();
    });
  } catch (error) {
    res.status(403).json({ error: 'Admin access required' });
  }
};

module.exports = {
  auth,
  isAdmin
};