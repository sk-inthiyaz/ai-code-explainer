const express = require('express');
const ChatHistory = require('../models/ChatHistory');
const router = express.Router();

// Get all chat histories for a user
router.get('/:userId', async (req, res) => {
  try {
    const histories = await ChatHistory.find({ userId: req.params.userId }).sort({ created: -1 });
    res.json(histories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save a new chat history
router.post('/', async (req, res) => {
  try {
    console.log('POST /api/chat-history body:', req.body);
    const { userId, messages, title } = req.body;

    // Input validation
    if (!userId || !Array.isArray(messages) || messages.length === 0 || !title) {
      console.error('Validation error:', { userId, messages, title });
      return res.status(400).json({ error: 'userId, messages (array, not empty), and title are required.' });
    }

    // Optional: Check that at least one user and one ai message exist
    const hasUserMsg = messages.some(msg => msg.role === 'user');
    const hasAiMsg = messages.some(msg => msg.role === 'ai');
    if (!hasUserMsg || !hasAiMsg) {
      console.error('Validation error: missing user or ai message', messages);
      return res.status(400).json({ error: 'Chat history must include at least one user and one ai message.' });
    }

    const chat = new ChatHistory({ userId, messages, title });
    await chat.save();
    res.status(201).json(chat);
  } catch (error) {
    console.error('Error saving chat history:', error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
});

// Optionally: update a chat history (e.g., add messages)
router.put('/:id', async (req, res) => {
  try {
    const chat = await ChatHistory.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Optionally: delete a chat history
router.delete('/:id', async (req, res) => {
  try {
    await ChatHistory.findByIdAndDelete(req.params.id);
    res.json({ message: 'Chat history deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
