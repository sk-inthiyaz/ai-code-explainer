const User = require('../models/User');
const Submission = require('../models/Submission');
const PracticeSubmission = require('../models/PracticeSubmission');
const StreakQuestion = require('../models/StreakQuestion');

// Get user profile with aggregated stats
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.userId;
    
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Fetch user basic info
    const user = await User.findById(userId)
      .select('-password')
      .populate('completedQuestions.questionId', 'title levelName activeDate');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get all streak submissions
    const streakSubmissions = await Submission.find({ 
      userId,
      status: 'accepted'
    }).sort({ createdAt: 1 });

    // Get all practice submissions
    const practiceSubmissions = await PracticeSubmission.find({
      userId,
      status: 'accepted'
    }).sort({ submittedAt: 1 });

    // Calculate solved per week (last 4 weeks)
    const solvedPerWeek = calculateSolvedPerWeek(streakSubmissions, practiceSubmissions);

    // Calculate streak history (last 7 days)
    const streakHistory = calculateStreakHistory(user);

    // Calculate activity heatmap (last 140 days)
    const heatmap = await calculateActivityHeatmap(userId, streakSubmissions, practiceSubmissions);

    // Build response
    const profileData = {
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      country: user.country || '',
      college: user.college || '',
      age: user.age || null,
      joinedOn: user.createdAt,
      codingLevel: StreakQuestion.getLevelName(user.level),
      codingLevelPercent: ((user.level - 1) / 4) * 100, // Level 1-5 mapped to 0-100%
      avatarUrl: user.avatarUrl || '',
      stats: {
        solvedPerWeek,
        streakHistory,
        heatmap
      }
    };

    res.json(profileData);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ 
      message: 'Failed to fetch profile', 
      error: error.message 
    });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.userId;
    
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { name, email, phone, country, college, age, codingLevel } = req.body;
    
    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (phone !== undefined) updateFields.phone = phone;
    if (country !== undefined) updateFields.country = country;
    if (college !== undefined) updateFields.college = college;
    if (age !== undefined) updateFields.age = parseInt(age);
    if (codingLevel) {
      updateFields.level = StreakQuestion.getLevelNumber(codingLevel);
    }

    // Handle avatar upload if present
    if (req.file) {
      // You can implement file upload logic here
      // For now, we'll just store the filename
      updateFields.avatarUrl = `/uploads/avatars/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateFields,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user: {
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        country: updatedUser.country,
        college: updatedUser.college,
        age: updatedUser.age,
        avatarUrl: updatedUser.avatarUrl
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ 
      message: 'Failed to update profile', 
      error: error.message 
    });
  }
};

// Helper: Calculate solved problems per week (last 4 weeks)
function calculateSolvedPerWeek(streakSubmissions, practiceSubmissions) {
  const weeks = [
    { week: 'Week 1', solved: 0 },
    { week: 'Week 2', solved: 0 },
    { week: 'Week 3', solved: 0 },
    { week: 'Week 4', solved: 0 }
  ];

  const now = new Date();
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;

  // Count streak submissions
  streakSubmissions.forEach(sub => {
    const weekIndex = Math.floor((now - new Date(sub.createdAt)) / msPerWeek);
    if (weekIndex >= 0 && weekIndex < 4) {
      weeks[3 - weekIndex].solved++;
    }
  });

  // Count practice submissions
  practiceSubmissions.forEach(sub => {
    const weekIndex = Math.floor((now - new Date(sub.submittedAt)) / msPerWeek);
    if (weekIndex >= 0 && weekIndex < 4) {
      weeks[3 - weekIndex].solved++;
    }
  });

  return weeks;
}

// Helper: Calculate streak history (last 7 days)
function calculateStreakHistory(user) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
  
  // Create last 7 days array starting from Monday
  const history = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1) + i);
    
    // Determine streak value for this day
    let streakValue = 0;
    if (user.streak.lastQuestionDate) {
      const lastDate = new Date(user.streak.lastQuestionDate);
      if (date <= lastDate && date >= new Date(lastDate.getTime() - (user.streak.currentStreak - 1) * 24 * 60 * 60 * 1000)) {
        streakValue = Math.max(1, user.streak.currentStreak - Math.floor((lastDate - date) / (24 * 60 * 60 * 1000)));
      }
    }
    
    history.push({
      day: days[i],
      streak: streakValue
    });
  }

  return history;
}

// Helper: Calculate activity heatmap (last 140 days)
async function calculateActivityHeatmap(userId, streakSubmissions, practiceSubmissions) {
  const heatmap = [];
  const now = new Date();
  
  for (let i = 0; i < 140; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    
    // Count streak submissions for this day
    const streakCount = streakSubmissions.filter(sub => {
      const subDate = new Date(sub.createdAt);
      return subDate >= date && subDate < nextDay;
    }).length;
    
    // Count practice submissions for this day
    const practiceCount = practiceSubmissions.filter(sub => {
      const subDate = new Date(sub.submittedAt);
      return subDate >= date && subDate < nextDay;
    }).length;
    
    // For now, we don't have learning ticks tracking, so we'll use 0
    // You can add this feature later by tracking topic completions
    const learningTicks = 0;
    
    const total = learningTicks + practiceCount + streakCount;
    
    heatmap.push({
      date: date.toISOString().split('T')[0],
      count: total,
      learningTicks,
      practiceProblems: practiceCount,
      streakCompleted: streakCount > 0 ? 1 : 0
    });
  }
  
  return heatmap;
}

module.exports = {
  getUserProfile,
  updateUserProfile
};
