const mongoose = require('mongoose');

const practiceProblemSchema = new mongoose.Schema({
    topic: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['beginner', 'medium', 'advanced'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    starterCode: {
        type: String,
        default: '// Write your code here'
    },
    testCases: [{
        input: [mongoose.Schema.Types.Mixed],
        expectedOutput: mongoose.Schema.Types.Mixed,
        explanation: String
    }],
    constraints: [String],
    hints: [String],
    examples: [{
        input: String,
        output: String,
        explanation: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('PracticeProblem', practiceProblemSchema);
