const express = require('express');
const router = express.Router();
const { addQuestion, getQuestions, deleteQuestion } = require('../controllers/adminController');

// Add new question
router.post('/add-question', addQuestion);

// Fetch all questions
router.get('/get-questions', getQuestions);

// Delete a question
router.delete('/delete-question/:id', deleteQuestion);

module.exports = router;
