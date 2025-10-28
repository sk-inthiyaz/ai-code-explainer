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
const { auth } = require('../middleware/auth');

// ===================================
// DISCUSSION ROUTES
// ===================================

// Get all discussions (with filters)
router.get('/', auth, getDiscussions);

// Get user's own discussions
router.get('/my-discussions', auth, getUserDiscussions);

// Get single discussion
router.get('/:id', auth, getDiscussionById);

// Create new discussion
router.post('/', auth, createDiscussion);

// Update discussion
router.put('/:id', auth, updateDiscussion);

// Delete discussion
router.delete('/:id', auth, deleteDiscussion);

// Vote on discussion
router.post('/:id/vote', auth, voteDiscussion);

// Mark as solved
router.put('/:id/solved', auth, markAsSolved);

// ===================================
// COMMENT ROUTES
// ===================================

// Add comment
router.post('/:discussionId/comments', auth, addComment);

// Vote on comment
router.post('/comments/:id/vote', auth, voteComment);

// Delete comment
router.delete('/comments/:id', auth, deleteComment);

module.exports = router;
