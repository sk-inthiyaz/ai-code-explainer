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

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
// Routes Configuration
app.use('/api/auth', authRoutes);
app.use('/api/explain', explainRoutes);
app.use('/api/chat-history', chatHistoryRoutes);
app.use('/api/tutorials', tutorialRoutes);
app.use('/api/practice', practiceRoutes);
app.use('/api/test', testApiRoute);

app.get('/', (req, res) => {
  res.send('API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});