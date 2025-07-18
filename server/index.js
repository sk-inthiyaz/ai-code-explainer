require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const explainRoutes = require('./routes/explainRoute');
const chatHistoryRoutes = require('./routes/chatHistory');

const app = express();

// CORS Configuration
app.use(cors({
  origin: '*',
  credentials: true
}));

// Middleware
app.use(express.json());

// Debug: Log the MongoDB URI to check if it's loaded
console.log('MONGODB_URI:', process.env.MONGODB_URI);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// User routes
app.post('/api/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    // Add your user creation logic here
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/', explainRoutes);
app.use('/api/chat-history', chatHistoryRoutes);

app.get('/', (req, res) => {
  res.send('API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});