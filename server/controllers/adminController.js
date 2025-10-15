import StreakQuestion from "../models/StreakQuestion.js";

// ➕ Add Question
export const addQuestion = async (req, res) => {
  try {
    const question = await StreakQuestion.create(req.body);
    res.status(201).json(question);
  } catch (error) {
    res.status(400).json({ message: "Error adding question", error });
  }
};

// 📜 Get All Questions
export const getQuestions = async (req, res) => {
  try {
    const questions = await StreakQuestion.find().sort({ date: -1 });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch questions", error });
  }
};

// 🗑️ Delete Question
export const deleteQuestion = async (req, res) => {
  try {
    const question = await StreakQuestion.findByIdAndDelete(req.params.id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.json({ message: "Question deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting question", error });
  }
};
