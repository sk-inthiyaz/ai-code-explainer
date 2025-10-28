const Discussion = require('../models/Discussion');
const Comment = require('../models/Comment');
const User = require('../models/User');

// ===================================
// DISCUSSION ROUTES
// ===================================

// Get all discussions with filters
const getDiscussions = async (req, res) => {
  try {
    const { language, topic, sort = 'recent', search, page = 1, limit = 20 } = req.query;

    const query = {};
    if (language && language !== 'all') query.language = language;
    if (topic && topic !== 'all') query.topic = topic;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    let sortOption = {};
    switch (sort) {
      case 'popular':
        sortOption = { votes: -1, createdAt: -1 };
        break;
      case 'mostViewed':
        sortOption = { views: -1, createdAt: -1 };
        break;
      case 'mostCommented':
        sortOption = { commentCount: -1, createdAt: -1 };
        break;
      case 'recent':
      default:
        sortOption = { isPinned: -1, createdAt: -1 };
    }

    const skip = (page - 1) * limit;

    const discussions = await Discussion.find(query)
      .populate('author', 'name email')
      .sort(sortOption)
      .limit(parseInt(limit))
      .skip(skip)
      .lean();

    const total = await Discussion.countDocuments(query);

    res.json({
      discussions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching discussions:', error);
    res.status(500).json({ message: 'Failed to fetch discussions', error: error.message });
  }
};

// Get single discussion with comments
const getDiscussionById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id || req.user?.userId;

    const discussion = await Discussion.findById(id)
      .populate('author', 'name email');

    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    // Increment views if user hasn't viewed before
    if (userId && !discussion.viewedBy.includes(userId)) {
      discussion.views += 1;
      discussion.viewedBy.push(userId);
      await discussion.save();
    }

    // Get comments for this discussion
    const comments = await Comment.find({ discussionId: id, parentCommentId: null })
      .populate('author', 'name email')
      .sort({ votes: -1, createdAt: 1 })
      .lean();

    // Get replies for each comment
    for (let comment of comments) {
      const replies = await Comment.find({ parentCommentId: comment._id })
        .populate('author', 'name email')
        .sort({ createdAt: 1 })
        .lean();
      comment.replies = replies;
    }

    res.json({
      discussion,
      comments
    });
  } catch (error) {
    console.error('Error fetching discussion:', error);
    res.status(500).json({ message: 'Failed to fetch discussion', error: error.message });
  }
};

// Create new discussion
const createDiscussion = async (req, res) => {
  try {
    const { title, content, language, topic, tags } = req.body;
    const userId = req.user?._id || req.user?.userId;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const discussion = new Discussion({
      title,
      content,
      author: userId,
      language: language || 'General',
      topic: topic || 'Other',
      tags: tags || []
    });

    await discussion.save();

    const populatedDiscussion = await Discussion.findById(discussion._id)
      .populate('author', 'name email');

    res.status(201).json({
      message: 'Discussion created successfully',
      discussion: populatedDiscussion
    });
  } catch (error) {
    console.error('Error creating discussion:', error);
    res.status(500).json({ message: 'Failed to create discussion', error: error.message });
  }
};

// Update discussion
const updateDiscussion = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, language, topic, tags } = req.body;
    const userId = req.user?._id || req.user?.userId;

    const discussion = await Discussion.findById(id);

    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    // Check if user is author
    if (discussion.author.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'You can only edit your own discussions' });
    }

    if (title) discussion.title = title;
    if (content) discussion.content = content;
    if (language) discussion.language = language;
    if (topic) discussion.topic = topic;
    if (tags) discussion.tags = tags;

    await discussion.save();

    const updatedDiscussion = await Discussion.findById(id)
      .populate('author', 'name email');

    res.json({
      message: 'Discussion updated successfully',
      discussion: updatedDiscussion
    });
  } catch (error) {
    console.error('Error updating discussion:', error);
    res.status(500).json({ message: 'Failed to update discussion', error: error.message });
  }
};

// Delete discussion
const deleteDiscussion = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id || req.user?.userId;
    const isAdmin = req.user?.isAdmin;

    const discussion = await Discussion.findById(id);

    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    // Check if user is author or admin
    if (discussion.author.toString() !== userId.toString() && !isAdmin) {
      return res.status(403).json({ message: 'Unauthorized to delete this discussion' });
    }

    // Delete all comments associated with this discussion
    await Comment.deleteMany({ discussionId: id });

    await Discussion.findByIdAndDelete(id);

    res.json({ message: 'Discussion deleted successfully' });
  } catch (error) {
    console.error('Error deleting discussion:', error);
    res.status(500).json({ message: 'Failed to delete discussion', error: error.message });
  }
};

// Vote on discussion
const voteDiscussion = async (req, res) => {
  try {
    const { id } = req.params;
    const { voteType } = req.body; // 'upvote' or 'downvote'
    const userId = req.user?._id || req.user?.userId;

    const discussion = await Discussion.findById(id);

    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    const hasUpvoted = discussion.upvotedBy.includes(userId);
    const hasDownvoted = discussion.downvotedBy.includes(userId);

    if (voteType === 'upvote') {
      if (hasUpvoted) {
        // Remove upvote
        discussion.upvotedBy = discussion.upvotedBy.filter(id => id.toString() !== userId.toString());
        discussion.votes -= 1;
      } else {
        // Add upvote
        if (hasDownvoted) {
          discussion.downvotedBy = discussion.downvotedBy.filter(id => id.toString() !== userId.toString());
          discussion.votes += 1;
        }
        discussion.upvotedBy.push(userId);
        discussion.votes += 1;
      }
    } else if (voteType === 'downvote') {
      if (hasDownvoted) {
        // Remove downvote
        discussion.downvotedBy = discussion.downvotedBy.filter(id => id.toString() !== userId.toString());
        discussion.votes += 1;
      } else {
        // Add downvote
        if (hasUpvoted) {
          discussion.upvotedBy = discussion.upvotedBy.filter(id => id.toString() !== userId.toString());
          discussion.votes -= 1;
        }
        discussion.downvotedBy.push(userId);
        discussion.votes -= 1;
      }
    }

    await discussion.save();

    res.json({
      message: 'Vote recorded',
      votes: discussion.votes,
      hasUpvoted: discussion.upvotedBy.includes(userId),
      hasDownvoted: discussion.downvotedBy.includes(userId)
    });
  } catch (error) {
    console.error('Error voting on discussion:', error);
    res.status(500).json({ message: 'Failed to vote', error: error.message });
  }
};

// Mark discussion as solved
const markAsSolved = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id || req.user?.userId;

    const discussion = await Discussion.findById(id);

    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    // Only author can mark as solved
    if (discussion.author.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Only the author can mark as solved' });
    }

    discussion.isSolved = !discussion.isSolved;
    await discussion.save();

    res.json({
      message: discussion.isSolved ? 'Marked as solved' : 'Marked as unsolved',
      isSolved: discussion.isSolved
    });
  } catch (error) {
    console.error('Error marking discussion:', error);
    res.status(500).json({ message: 'Failed to update status', error: error.message });
  }
};

// ===================================
// COMMENT ROUTES
// ===================================

// Add comment to discussion
const addComment = async (req, res) => {
  try {
    const { discussionId } = req.params;
    const { content, parentCommentId } = req.body;
    const userId = req.user?._id || req.user?.userId;

    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    if (discussion.isLocked) {
      return res.status(403).json({ message: 'This discussion is locked' });
    }

    const comment = new Comment({
      content,
      author: userId,
      discussionId,
      parentCommentId: parentCommentId || null
    });

    await comment.save();

    // Update comment count
    if (!parentCommentId) {
      discussion.commentCount += 1;
      await discussion.save();
    }

    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'name email');

    res.status(201).json({
      message: 'Comment added successfully',
      comment: populatedComment
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Failed to add comment', error: error.message });
  }
};

// Vote on comment
const voteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { voteType } = req.body;
    const userId = req.user?._id || req.user?.userId;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const hasUpvoted = comment.upvotedBy.includes(userId);
    const hasDownvoted = comment.downvotedBy.includes(userId);

    if (voteType === 'upvote') {
      if (hasUpvoted) {
        comment.upvotedBy = comment.upvotedBy.filter(id => id.toString() !== userId.toString());
        comment.votes -= 1;
      } else {
        if (hasDownvoted) {
          comment.downvotedBy = comment.downvotedBy.filter(id => id.toString() !== userId.toString());
          comment.votes += 1;
        }
        comment.upvotedBy.push(userId);
        comment.votes += 1;
      }
    } else if (voteType === 'downvote') {
      if (hasDownvoted) {
        comment.downvotedBy = comment.downvotedBy.filter(id => id.toString() !== userId.toString());
        comment.votes += 1;
      } else {
        if (hasUpvoted) {
          comment.upvotedBy = comment.upvotedBy.filter(id => id.toString() !== userId.toString());
          comment.votes -= 1;
        }
        comment.downvotedBy.push(userId);
        comment.votes -= 1;
      }
    }

    await comment.save();

    res.json({
      message: 'Vote recorded',
      votes: comment.votes,
      hasUpvoted: comment.upvotedBy.includes(userId),
      hasDownvoted: comment.downvotedBy.includes(userId)
    });
  } catch (error) {
    console.error('Error voting on comment:', error);
    res.status(500).json({ message: 'Failed to vote', error: error.message });
  }
};

// Delete comment
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id || req.user?.userId;
    const isAdmin = req.user?.isAdmin;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.author.toString() !== userId.toString() && !isAdmin) {
      return res.status(403).json({ message: 'Unauthorized to delete this comment' });
    }

    // Delete replies
    await Comment.deleteMany({ parentCommentId: id });

    // Update comment count if it's a top-level comment
    if (!comment.parentCommentId) {
      await Discussion.findByIdAndUpdate(comment.discussionId, { $inc: { commentCount: -1 } });
    }

    await Comment.findByIdAndDelete(id);

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Failed to delete comment', error: error.message });
  }
};

// Get user's discussions
const getUserDiscussions = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.userId;
    
    const discussions = await Discussion.find({ author: userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    res.json({ discussions });
  } catch (error) {
    console.error('Error fetching user discussions:', error);
    res.status(500).json({ message: 'Failed to fetch discussions', error: error.message });
  }
};

module.exports = {
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
};
