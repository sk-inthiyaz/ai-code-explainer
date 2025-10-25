const express = require('express');
const router = express.Router();
const { addQuestion, getQuestions, deleteQuestion } = require('../controllers/adminController');
const { 
	bulkUploadProblems, 
	deleteAllProblems, 
	getAllProblemsAdmin 
} = require('../controllers/practiceAdminController');
const { auth, isAdmin } = require('../middleware/auth');

// Add new question
router.post('/add-question', addQuestion);

// Fetch all questions
router.get('/get-questions', getQuestions);

// Delete a question
router.delete('/delete-question/:id', deleteQuestion);

// ===============================
// PRACTICE PROBLEMS ADMIN ROUTES
// ===============================

// Bulk upload practice problems
router.post('/practice/bulk-upload', auth, isAdmin, bulkUploadProblems);

// Get all practice problems (admin view)
router.get('/practice/problems', auth, isAdmin, getAllProblemsAdmin);

// Delete all practice problems (use with caution!)
router.delete('/practice/delete-all', auth, isAdmin, deleteAllProblems);

module.exports = router;
