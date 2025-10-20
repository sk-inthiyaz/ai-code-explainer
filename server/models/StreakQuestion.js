const mongoose = require('mongoose');

const streakQuestionSchema = new mongoose.Schema({
  // Level mapping: 1=Easy, 2=Mid, 3=Mid-Easy, 4=Hard, 5=Mix
  level: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    enum: [1, 2, 3, 4, 5]
  },
  levelName: {
    type: String,
    required: true,
    enum: ['Easy', 'Mid', 'Mid-Easy', 'Hard', 'Mix']
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  constraints: {
    type: String,
    required: false
  },
  hints: [{
    type: String
  }],
  starterCode: {
    type: String,
    default: '// Write your code here...'
  },
  testCases: [{
    input: {
      type: String,
      required: true
    },
    expectedOutput: {
      type: String,
      required: true
    },
    explanation: String,
    isHidden: {
      type: Boolean,
      default: false
    }
  }],
  // Date for which this question is active (stored as YYYY-MM-DD)
  activeDate: {
    type: Date,
    required: true,
    index: true
  },
  submissions: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    code: String,
    status: {
      type: String,
      enum: ['passed', 'failed', 'partial'],
      required: true
    },
    submittedAt: {
      type: Date,
      default: Date.now
    }
  }],
  solvedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Compound index: ensure only ONE question per level per day
streakQuestionSchema.index({ activeDate: 1, level: 1 }, { unique: true });

// Helper method to get level number from name
streakQuestionSchema.statics.getLevelNumber = function(levelName) {
  const levelMap = {
    'Easy': 1,
    'Mid': 2,
    'Mid-Easy': 3,
    'Hard': 4,
    'Mix': 5
  };
  return levelMap[levelName] || 1;
};

// Helper method to get level name from number
streakQuestionSchema.statics.getLevelName = function(levelNumber) {
  const nameMap = {
    1: 'Easy',
    2: 'Mid',
    3: 'Mid-Easy',
    4: 'Hard',
    5: 'Mix'
  };
  return nameMap[levelNumber] || 'Easy';
};

module.exports = mongoose.model('StreakQuestion', streakQuestionSchema);
