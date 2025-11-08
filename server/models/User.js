const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    default: ''
  },
  country: {
    type: String,
    default: ''
  },
  college: {
    type: String,
    default: ''
  },
  age: {
    type: Number,
    default: null
  },
  avatarUrl: {
    type: String,
    default: ''
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  streak: {
    currentStreak: {
      type: Number,
      default: 0
    },
    longestStreak: {
      type: Number,
      default: 0
    },
    lastQuestionDate: {
      type: Date,
      default: null
    }
  },
  level: {
    type: Number,
    default: 1,
    min: 1,
    max: 5
  },
  badges: [{
    type: {
      type: String,
      enum: ['bronze', 'silver', 'gold', 'diamond']
    },
    name: String,
    earnedAt: {
      type: Date,
      default: Date.now
    }
  }],
  completedQuestions: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StreakQuestion'
    },
    completedAt: {
      type: Date,
      default: Date.now
    },
    difficulty: String,
    language: {
      type: String,
      enum: ['javascript', 'python', 'java', 'cpp'],
      default: 'javascript'
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'users'
});

// Add method to update streak
userSchema.methods.updateStreak = async function(date) {
  const today = new Date(date);
  today.setHours(0, 0, 0, 0);

  const lastDate = this.streak.lastQuestionDate;
  if (lastDate) {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (lastDate.getTime() === yesterday.getTime()) {
      // Continued streak
      this.streak.currentStreak += 1;
    } else if (lastDate.getTime() < yesterday.getTime()) {
      // Broke streak
      this.streak.currentStreak = 1;
    }
    // If same day, don't update streak
  } else {
    // First streak
    this.streak.currentStreak = 1;
  }

  // Update longest streak if needed
  if (this.streak.currentStreak > this.streak.longestStreak) {
    this.streak.longestStreak = this.streak.currentStreak;
  }

  this.streak.lastQuestionDate = today;
  
  // Check and update level based on streak
  if (this.streak.currentStreak >= 28) this.level = 5;
  else if (this.streak.currentStreak >= 21) this.level = 4;
  else if (this.streak.currentStreak >= 14) this.level = 3;
  else if (this.streak.currentStreak >= 7) this.level = 2;

  // Award badges based on streak
  if (this.streak.currentStreak >= 28 && !this.hasBadge('diamond')) {
    this.badges.push({ type: 'diamond', name: 'Pro Coder' });
  } else if (this.streak.currentStreak >= 21 && !this.hasBadge('gold')) {
    this.badges.push({ type: 'gold', name: 'Gold Streak' });
  } else if (this.streak.currentStreak >= 14 && !this.hasBadge('silver')) {
    this.badges.push({ type: 'silver', name: 'Silver Streak' });
  } else if (this.streak.currentStreak >= 7 && !this.hasBadge('bronze')) {
    this.badges.push({ type: 'bronze', name: 'Bronze Streak' });
  }

  await this.save();
};

// Helper method to check if user has a badge
userSchema.methods.hasBadge = function(type) {
  return this.badges.some(badge => badge.type === type);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
