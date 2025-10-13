const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const isAdmin = require('../middleware/isAdmin');

// Get all questions
router.get('/questions', async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 });
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ message: 'Error fetching questions' });
  }
});

// Get a specific question
router.get('/questions/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json(question);
  } catch (error) {
    console.error('Error fetching question:', error);
    res.status(500).json({ message: 'Error fetching question' });
  }
});

// Create a new question (admin only)
router.post('/questions', isAdmin, async (req, res) => {
  try {
    const { title, description, difficulty, category, testCases } = req.body;

    // Validate required fields
    if (!title || !description || !difficulty || !category || !testCases) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if question with same title exists
    const existingQuestion = await Question.findOne({ title });
    if (existingQuestion) {
      return res.status(400).json({ message: 'A question with this title already exists' });
    }

    const question = new Question({
      title,
      description,
      difficulty,
      category,
      testCases
    });

    await question.save();
    res.status(201).json(question);
  } catch (error) {
    console.error('Error creating question:', error);
    res.status(500).json({ message: 'Error creating question' });
  }
});

// Update a question (admin only)
router.put('/questions/:id', isAdmin, async (req, res) => {
  try {
    const { title, description, difficulty, category, testCases } = req.body;

    // Validate required fields
    if (!title || !description || !difficulty || !category || !testCases) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if another question has the same title
    const existingQuestion = await Question.findOne({ 
      title, 
      _id: { $ne: req.params.id } 
    });
    if (existingQuestion) {
      return res.status(400).json({ message: 'Another question with this title already exists' });
    }

    const question = await Question.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        difficulty,
        category,
        testCases,
        updatedAt: Date.now()
      },
      { new: true }
    );

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.json(question);
  } catch (error) {
    console.error('Error updating question:', error);
    res.status(500).json({ message: 'Error updating question' });
  }
});

// Delete a question (admin only)
router.delete('/questions/:id', isAdmin, async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({ message: 'Error deleting question' });
  }
});

module.exports = router;