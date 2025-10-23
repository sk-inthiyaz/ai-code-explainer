const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => require('crypto').randomUUID()
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StreakQuestion',
    required: true,
    index: true
  },
  language: {
    type: String,
    required: true,
    enum: ['javascript', 'python', 'java', 'cpp']
  },
  status: {
    type: String,
    required: true,
    enum: ['accepted', 'rejected'],
    index: true
  },
  runtimeMs: {
    type: Number,
    default: null
  },
  storageKey: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Compound index for efficient queries: user's accepted submissions for a problem, sorted desc
submissionSchema.index({ userId: 1, problemId: 1, createdAt: -1 });
submissionSchema.index({ userId: 1, status: 1, createdAt: -1 });

const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission;
