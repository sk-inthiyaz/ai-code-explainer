const express = require("express");
const router = express.Router();
const {
  addDailyQuestions,
  addStreakQuestion,
  getTodayQuestionForUser,
  runCode,
  submitSolution,
  getAllStreakQuestions,
  getUserStreakStats,
  getLeaderboard,
  getAdminStats,
  updateStreakQuestion,
  deleteStreakQuestion
} = require("../controllers/streakController");
const { auth } = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

// ============================================
// 🛡️ ADMIN ROUTES (Protected)
// ============================================

// Add 5 daily questions at once (one per level)
router.post("/admin/daily", isAdmin, addDailyQuestions);

// Add a single streak question
router.post("/admin/add", isAdmin, addStreakQuestion);

// Get all questions (with optional date filter)
router.get("/admin/questions", isAdmin, getAllStreakQuestions);

// Delete all questions for a specific date
router.delete("/admin/questions", isAdmin, async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ message: 'Date query parameter is required (YYYY-MM-DD)' });
    }
    const StreakQuestion = require('../models/StreakQuestion');
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    const result = await StreakQuestion.deleteMany({ activeDate: targetDate });
    res.json({ message: `Deleted ${result.deletedCount} streak questions for ${date}`, deletedCount: result.deletedCount });
  } catch (error) {
    console.error('Error deleting streak questions:', error);
    res.status(500).json({ message: 'Failed to delete streak questions', error: error.message });
  }
});

// Get admin dashboard stats
router.get("/admin/stats", isAdmin, getAdminStats);

// Update a question by id
router.put("/admin/questions/:id", isAdmin, updateStreakQuestion);

// Delete a question by id
router.delete("/admin/questions/:id", isAdmin, deleteStreakQuestion);

// ============================================
// 👤 USER ROUTES (Protected)
// ============================================

// Get today's question based on user's level
router.get("/today", auth, getTodayQuestionForUser);

// Run code against public test cases only
router.post("/run", auth, runCode);

// Submit solution for a question (all test cases)
router.post("/submit", auth, submitSolution);

// Get current user's streak stats
router.get("/stats", auth, getUserStreakStats);

// Get specific user's streak stats (can be used for profile viewing)
router.get("/stats/:userId", auth, getUserStreakStats);

// ============================================
// 🌐 PUBLIC ROUTES
// ============================================

// Get leaderboard (top 50 users by streak)
router.get("/leaderboard", getLeaderboard);

module.exports = router;
