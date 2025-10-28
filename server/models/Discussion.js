const mongoose = require('mongoose');

const discussionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    maxlength: 5000
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  language: {
    type: String,
    enum: ['Java', 'Python', 'C++', 'JavaScript', 'General'],
    default: 'General'
  },
  topic: {
    type: String,
    enum: ['Basic Syntax', 'Data Types', 'Operators', 'Control Flow', 'Loops', 'Functions', 'Data Structures', 'Error Handling', 'Algorithms', 'Other'],
    default: 'Other'
  },
  tags: [{
    type: String,
    trim: true
  }],
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
  views: {
    type: Number,
    default: 0
  },
  viewedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  commentCount: {
    type: Number,
    default: 0
  },
  isSolved: {
    type: Boolean,
    default: false
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  isLocked: {
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

// Indexes for better query performance
discussionSchema.index({ createdAt: -1 });
discussionSchema.index({ votes: -1 });
discussionSchema.index({ language: 1 });
discussionSchema.index({ topic: 1 });
discussionSchema.index({ author: 1 });

// Update updatedAt on save
discussionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Discussion', discussionSchema);
