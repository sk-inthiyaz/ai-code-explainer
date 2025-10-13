require('dotenv').config();

// Debug environment variables
console.log('[DEBUG] Environment Variables:', {
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    geminiKeyLength: process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.length : 0,
});

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const explainRoutes = require('./routes/explainRoute');
const chatHistoryRoutes = require('./routes/chatHistory');
const tutorialRoutes = require('./routes/tutorialRoutes');
const practiceRoutes = require('./routes/practiceRoutes');
const questionRoutes = require('./routes/questionRoutes');
const testApiRoute = require('./routes/testApiRoute');

const app = express();

// CORS Configuration
app.use(cors({
  origin: '*',
  credentials: true
}));

// Middleware
app.use(express.json());

// Debug logging middleware
app.use((req, res, next) => {
    console.log(`[DEBUG] ${req.method} ${req.url}`);
    console.log('[DEBUG] Request Body:', req.body);
    next();
});

// Debug: Log the MongoDB URI to check if it's loaded
console.log('MONGODB_URI:', process.env.MONGODB_URI);

const initializeAdmin = require('./utils/initAdmin');

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
})
.then(async () => {
  console.log('MongoDB connected successfully');
  console.log('Connected to database:', mongoose.connection.name);
  // Initialize admin user
  await initializeAdmin();
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  if (err.code === 'ECONNREFUSED') {
    console.error('Make sure MongoDB is running on your machine');
  }
});

// Routes
// Routes Configuration
app.use('/api/auth', authRoutes);
app.use('/api/explain', explainRoutes);
app.use('/api/chat-history', chatHistoryRoutes);
app.use('/api/tutorials', tutorialRoutes);
app.use('/api/practice', practiceRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/test', testApiRoute);

app.get('/', (req, res) => {
  res.send('API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});