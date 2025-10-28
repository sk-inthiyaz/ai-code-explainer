const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    maxlength: 2000
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  discussionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Discussion',
    required: true
  },
  parentCommentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  },
  votes: {
    type: Number,
    default: 0
  },
  upvotedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  downvotedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isAccepted: {
    type: Boolean,
    default: false
  },
  isEdited: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes
commentSchema.index({ discussionId: 1, createdAt: 1 });
commentSchema.index({ author: 1 });
commentSchema.index({ parentCommentId: 1 });

// Update updatedAt on save
commentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Comment', commentSchema);
