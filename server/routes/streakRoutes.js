const express = require("express");
const router = express.Router();
const { addStreakQuestion, getTodayQuestion, getAllStreakQuestions } = require("../controllers/streakController");

// ✅ Admin Routes
router.post("/add", addStreakQuestion);
router.get("/all", getAllStreakQuestions);

// ✅ User Routes
router.get("/today", getTodayQuestion);

module.exports = router;
