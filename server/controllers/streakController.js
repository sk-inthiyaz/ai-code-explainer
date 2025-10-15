// const mongoose = require("mongoose");
// const StreakQuestion = require("../models/StreakQuestion");
// const streakQuestionSchema = new mongoose.Schema({
//   level: {
//     type: String,
//     enum: ["Easy", "Mid", "Mid-Easy", "Hard", "Mix"],
//     required: true,
//   },
//   title: { type: String, required: true },
//   description: { type: String, required: true },
//   constraints: { type: String },
//   testCases: [
//     {
//       input: String,
//       output: String,
//     },
//   ],
//   date: {
//     type: Date,
//     default: Date.now,
//   },
// });
// // ✅ Admin: Add a new streak question
// exports.addStreakQuestion = async (req, res) => {
//   try {
//     const { level, title, description, constraints, testCases } = req.body;

//     const newQuestion = new StreakQuestion({
//       level,
//       title,
//       description,
//       constraints,
//       testCases,
//     });

//     await newQuestion.save();
//     res.status(201).json({ message: "Streak question added successfully!", newQuestion });
//   } catch (error) {
//     console.error("Error adding question:", error);
//     res.status(500).json({ message: "Failed to add question", error });
//   }
// };

// module.exports = mongoose.model("StreakQuestion", streakQuestionSchema);


const StreakQuestion = require("../models/StreakQuestion");

// ✅ Admin: Add a new streak question
const addStreakQuestion = async (req, res) => {
  try {
    const { level, title, description, constraints, testCases } = req.body;

    const newQuestion = new StreakQuestion({
      level,
      title,
      description,
      constraints,
      testCases,
    });

    await newQuestion.save();
    res.status(201).json({
      message: "Streak question added successfully!",
      newQuestion,
    });
  } catch (error) {
    console.error("Error adding question:", error);
    res.status(500).json({ message: "Failed to add question", error });
  }
};

// 📅 Get today’s question
const getTodayQuestion = async (req, res) => {
  try {
    const question = await StreakQuestion.findOne().sort({ date: -1 });
    res.json(question);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch today's question", error });
  }
};

// 📋 Get all streak questions
const getAllStreakQuestions = async (req, res) => {
  try {
    const questions = await StreakQuestion.find().sort({ date: -1 });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch questions", error });
  }
};

module.exports = {
  addStreakQuestion,
  getTodayQuestion,
  getAllStreakQuestions,
};
