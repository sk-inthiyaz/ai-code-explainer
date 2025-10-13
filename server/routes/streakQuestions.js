const express = require('express');
const router = express.Router();
const StreakQuestion = require('../models/StreakQuestion');
const { isAdmin } = require('../middleware/auth'); // We'll create this middleware

// Get all questions (admin only)
router.get('/', isAdmin, async (req, res) => {
  try {
    const questions = await StreakQuestion.find()
      .sort({ activeDate: -1 })
      .select('-submissions');
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// Get today's question for user based on their level
router.get('/today', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const userLevel = req.user.level || 1; // Get user's level from auth
    
    const question = await StreakQuestion.findOne({
      activeDate: today,
      difficultyLevel: { $lte: userLevel }
    }).select('-submissions -solution'); // Don't send solution to users

    if (!question) {
      return res.status(404).json({ error: 'No question available for today' });
    }

    res.json(question);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch today\'s question' });
  }
});

// Add new question (admin only)
router.post('/', isAdmin, async (req, res) => {
  try {
    const {
      title,
      difficulty,
      description,
      sampleInput,
      sampleOutput,
      hints,
      solution,
      testCases,
      activeDate,
      difficultyLevel
    } = req.body;

    const question = new StreakQuestion({
      title,
      difficulty,
      description,
      sampleInput,
      sampleOutput,
      hints,
      solution,
      testCases,
      activeDate: activeDate || new Date(),
      difficultyLevel: difficultyLevel || getDifficultyLevel(difficulty)
    });

    await question.save();
    res.status(201).json(question);
  } catch (error) {
    console.error('Error adding question:', error);
    res.status(500).json({ error: 'Failed to add question' });
  }
});

// Update question (admin only)
router.put('/:id', isAdmin, async (req, res) => {
  try {
    const question = await StreakQuestion.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
    
    res.json(question);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update question' });
  }
});

// Delete question (admin only)
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    const question = await StreakQuestion.findByIdAndDelete(req.params.id);
    
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
    
    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete question' });
  }
});

// Get question statistics (admin only)
router.get('/stats', isAdmin, async (req, res) => {
  try {
    const stats = await StreakQuestion.aggregate([
      {
        $facet: {
          totalQuestions: [{ $count: 'count' }],
          byDifficulty: [
            { $group: { _id: '$difficulty', count: { $sum: 1 } } }
          ],
          submissions: [
            { $unwind: '$submissions' },
            { $group: {
              _id: null,
              totalSubmissions: { $sum: 1 },
              passedSubmissions: {
                $sum: { $cond: [{ $eq: ['$submissions.status', 'passed'] }, 1, 0] }
              }
            }}
          ]
        }
      }
    ]);

    res.json(stats[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Submit a solution
router.post('/:id/submit', async (req, res) => {
  try {
    const { code } = req.body;
    const question = await StreakQuestion.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    // Here you would typically:
    // 1. Run the code against test cases
    // 2. Check the output
    // 3. Update user's streak if passed
    // For now, we'll just record the submission
    
    question.submissions.push({
      userId: req.user._id,
      code,
      status: 'pending' // You'll need to implement actual testing
    });

    await question.save();
    res.json({ message: 'Solution submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit solution' });
  }
});

// Helper function to map difficulty to level
function getDifficultyLevel(difficulty) {
  const levels = {
    'easy': 1,
    'medium': 2,
    'medium-easy': 3,
    'hard': 4,
    'mix': 5
  };
  return levels[difficulty] || 1;
}

module.exports = router;