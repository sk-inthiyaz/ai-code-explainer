const express = require('express');
const router = express.Router();
const {
  getDiscussions,
  getDiscussionById,
  createDiscussion,
  updateDiscussion,
  deleteDiscussion,
  voteDiscussion,
  markAsSolved,
  addComment,
  voteComment,
  deleteComment,
  getUserDiscussions
} = require('../controllers/discussionController');
const authenticateToken = require('../middleware/auth');

// ===================================
// DISCUSSION ROUTES
// ===================================

// Get all discussions (with filters)
router.get('/', authenticateToken, getDiscussions);

// Get user's own discussions
router.get('/my-discussions', authenticateToken, getUserDiscussions);

// Get single discussion
router.get('/:id', authenticateToken, getDiscussionById);

// Create new discussion
router.post('/', authenticateToken, createDiscussion);

// Update discussion
router.put('/:id', authenticateToken, updateDiscussion);

// Delete discussion
router.delete('/:id', authenticateToken, deleteDiscussion);

// Vote on discussion
router.post('/:id/vote', authenticateToken, voteDiscussion);

// Mark as solved
router.put('/:id/solved', authenticateToken, markAsSolved);

// ===================================
// COMMENT ROUTES
// ===================================

// Add comment
router.post('/:discussionId/comments', authenticateToken, addComment);

// Vote on comment
router.post('/comments/:id/vote', authenticateToken, voteComment);

// Delete comment
router.delete('/comments/:id', authenticateToken, deleteComment);

module.exports = router;
