const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const explainRoutes = require('./routes/explainRoute');

dotenv.config();
const app = express();

// CORS Configuration
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Middleware
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

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

app.get('/', (req, res) => {
  res.send('API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});