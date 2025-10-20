const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Question = require('../models/Question');
const StreakQuestion = require('../models/StreakQuestion');
const isAdmin = require('../middleware/isAdmin');

// Bulk import questions (admin only)
router.post('/bulk-import', isAdmin, async (req, res) => {
  try {
    let questionsToImport;
    
    console.log('📥 Bulk import request received');
    console.log('Request body type:', Array.isArray(req.body) ? 'Array' : typeof req.body);
    console.log('Has questions property:', !!req.body.questions);
    
    // Check if the JSON follows the expected structure
    if (req.body.questions && Array.isArray(req.body.questions)) {
      questionsToImport = req.body.questions;
      console.log(`✅ Found ${questionsToImport.length} questions in req.body.questions`);
    } else if (Array.isArray(req.body)) {
      questionsToImport = req.body;
      console.log(`✅ Found ${questionsToImport.length} questions in req.body array`);
    } else {
      console.error('❌ Invalid format:', req.body);
      return res.status(400).json({ 
        message: 'Invalid format. JSON should either be an array of questions or have a "questions" array property'
      });
    }

  const importedQuestions = [];
  const errors = [];

    // Insert without transactions for broader MongoDB compatibility
    for (let i = 0; i < questionsToImport.length; i++) {
      const question = questionsToImport[i];
      console.log(`\n📝 Processing question ${i + 1}/${questionsToImport.length}: "${question.title}"`);
      
      try {
        // Check for duplicate titles
        const existingQuestion = await Question.findOne({ title: question.title });
        if (existingQuestion) {
          const msg = `Question "${question.title}" already exists`;
          console.log(`⚠️ ${msg}`);
          errors.push(msg);
          continue;
        }

        const newQuestion = new Question(question);
        await newQuestion.save();
        importedQuestions.push(newQuestion);
        console.log(`✅ Imported: "${question.title}"`);
      } catch (error) {
        const msg = `Error importing question at index ${i}: ${error.message}`;
        console.error(`❌ ${msg}`);
        errors.push(msg);
      }
    }

    // Auto-publish to streak if we have at least 5 questions
    let streakPublished = false;
    if (importedQuestions.length >= 5) {
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Check if today's questions already exist
        const existingToday = await StreakQuestion.findOne({ activeDate: today });
        
        if (!existingToday) {
          // Map first 5 questions to levels (easy -> level 1-2, medium -> 3-4, hard -> 5)
          const levelMapping = {
            'easy': [1, 2],
            'medium': [3, 4],
            'hard': [5]
          };

          let levelIndex = 1;
          const streakQuestions = [];

          for (let i = 0; i < Math.min(5, importedQuestions.length); i++) {
            const q = importedQuestions[i];
            const levelName = StreakQuestion.getLevelName(levelIndex);

            const streakQ = new StreakQuestion({
              level: levelIndex,
              levelName: levelName,
              title: q.title,
              description: q.description,
              constraints: q.constraints || '',
              hints: q.hints || [],
              starterCode: q.starterCode || '// Write your code here...',
              testCases: q.testCases,
              activeDate: today
            });

            await streakQ.save();
            streakQuestions.push(streakQ);
            levelIndex++;
          }

          streakPublished = true;
          console.log(`✅ Auto-published ${streakQuestions.length} questions to today's streak`);
        }
      } catch (streakError) {
        console.error('Error auto-publishing to streak:', streakError);
        // Don't fail the import if streak publishing fails
      }
    }

    const statusCode = importedQuestions.length > 0 ? 201 : 400;
    res.status(statusCode).json({
      message: importedQuestions.length > 0 ? 'Questions imported successfully' : 'Failed to import questions',
      questions: importedQuestions,
      streakPublished,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Error importing questions:', error);
    res.status(500).json({ message: 'Error importing questions', error: error.message });
  }
});

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

// Clear all questions (admin only) - Use with caution!
router.delete('/clear-all', isAdmin, async (req, res) => {
  try {
    const result = await Question.deleteMany({});
    console.log(`🗑️ Cleared ${result.deletedCount} questions from database`);
    res.json({ 
      message: `Successfully deleted ${result.deletedCount} questions`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error clearing questions:', error);
    res.status(500).json({ message: 'Error clearing questions' });
  }
});

module.exports = router;