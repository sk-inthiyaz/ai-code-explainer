const mongoose = require('mongoose');

const practiceSubmissionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    problemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PracticeProblem',
        required: true,
        index: true
    },
    code: {
        type: String,
        required: true
    },
    language: {
        type: String,
        enum: ['javascript', 'python', 'java', 'cpp'],
        required: true
    },
    status: {
        type: String,
        enum: ['accepted', 'wrong_answer', 'runtime_error', 'time_limit_exceeded', 'compilation_error'],
        required: true
    },
    testResults: [{
        input: String,
        expectedOutput: String,
        actualOutput: String,
        passed: Boolean,
        error: String
    }],
    executionTime: {
        type: Number, // in milliseconds
        default: 0
    },
    submittedAt: {
        type: Date,
        default: Date.now,
        index: true
    }
});

// Compound index for efficient queries
practiceSubmissionSchema.index({ userId: 1, problemId: 1, status: 1 });
practiceSubmissionSchema.index({ userId: 1, submittedAt: -1 });

module.exports = mongoose.model('PracticeSubmission', practiceSubmissionSchema);
