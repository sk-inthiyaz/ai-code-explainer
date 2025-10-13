const mongoose = require('mongoose');

const streakQuestionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['easy', 'medium', 'medium-easy', 'hard', 'mix'],
    default: 'easy'
  },
  description: {
    type: String,
    required: true
  },
  sampleInput: {
    type: String,
    required: false
  },
  sampleOutput: {
    type: String,
    required: false
  },
  hints: [{
    type: String,
    required: false
  }],
  solution: {
    type: String,
    required: true
  },
  testCases: [{
    input: String,
    expectedOutput: String,
    isHidden: {
      type: Boolean,
      default: false
    }
  }],
  submissions: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    submittedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['passed', 'failed', 'partial'],
      required: true
    },
    code: String
  }],
  activeDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  difficultyLevel: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    default: 1
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
streakQuestionSchema.index({ activeDate: 1 });
streakQuestionSchema.index({ difficulty: 1 });
streakQuestionSchema.index({ difficultyLevel: 1 });

module.exports = mongoose.model('StreakQuestion', streakQuestionSchema);