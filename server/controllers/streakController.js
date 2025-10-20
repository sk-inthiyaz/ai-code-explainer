const StreakQuestion = require("../models/StreakQuestion");
const User = require("../models/User");
const { runCodeInDocker } = require("../utils/dockerRunner");

// ✅ Admin: Add 5 streak questions for a specific date (one per level)
const addDailyQuestions = async (req, res) => {
  try {
    const { date, questions } = req.body; // questions should be an array of 5 questions

    if (!questions || questions.length !== 5) {
      return res.status(400).json({ 
        message: "Please provide exactly 5 questions (one for each level)" 
      });
    }

    const activeDate = new Date(date || Date.now());
    activeDate.setHours(0, 0, 0, 0);

    // Create all 5 questions
    const savedQuestions = [];
    for (let i = 0; i < 5; i++) {
      const q = questions[i];
      const levelNumber = i + 1;
      const levelName = StreakQuestion.getLevelName(levelNumber);

      const newQuestion = new StreakQuestion({
        level: levelNumber,
        levelName: levelName,
        title: q.title,
        description: q.description,
        constraints: q.constraints || '',
        hints: q.hints || [],
        starterCode: q.starterCode || '// Write your code here...',
        testCases: q.testCases,
        activeDate: activeDate
      });

      const saved = await newQuestion.save();
      savedQuestions.push(saved);
    }

    res.status(201).json({
      message: "5 daily questions added successfully!",
      date: activeDate,
      questions: savedQuestions
    });
  } catch (error) {
    console.error("Error adding daily questions:", error);
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: "Questions already exist for this date and level" 
      });
    }
    res.status(500).json({ message: "Failed to add questions", error: error.message });
  }
};

// ✏️ Admin: Update a streak question by ID
const updateStreakQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      constraints,
      hints,
      starterCode,
      testCases,
      activeDate,
      levelName
    } = req.body;

    const update = {};
    if (title !== undefined) update.title = title;
    if (description !== undefined) update.description = description;
    if (constraints !== undefined) update.constraints = constraints;
    if (Array.isArray(hints)) update.hints = hints;
    if (starterCode !== undefined) update.starterCode = starterCode;
    if (Array.isArray(testCases)) update.testCases = testCases;
    if (activeDate) {
      const d = new Date(activeDate);
      d.setHours(0, 0, 0, 0);
      update.activeDate = d;
    }
    if (levelName) {
      update.levelName = levelName;
      update.level = StreakQuestion.getLevelNumber(levelName);
    }

    const updated = await StreakQuestion.findByIdAndUpdate(
      id,
      update,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json({ message: "Question updated", question: updated });
  } catch (error) {
    console.error("Error updating question:", error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "A question already exists for this date and level" });
    }
    res.status(500).json({ message: "Failed to update question", error: error.message });
  }
};

// 🗑️ Admin: Delete a streak question by ID
const deleteStreakQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await StreakQuestion.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.json({ message: "Question deleted" });
  } catch (error) {
    console.error("Error deleting question:", error);
    res.status(500).json({ message: "Failed to delete question", error: error.message });
  }
};

// ✅ Admin: Add a single streak question
const addStreakQuestion = async (req, res) => {
  try {
    const { levelName, title, description, constraints, testCases, hints, starterCode, activeDate } = req.body;

    const level = StreakQuestion.getLevelNumber(levelName);
    const date = new Date(activeDate || Date.now());
    date.setHours(0, 0, 0, 0);

    const newQuestion = new StreakQuestion({
      level,
      levelName,
      title,
      description,
      constraints: constraints || '',
      hints: hints || [],
      starterCode: starterCode || '// Write your code here...',
      testCases,
      activeDate: date
    });

    await newQuestion.save();
    res.status(201).json({
      message: "Streak question added successfully!",
      question: newQuestion,
    });
  } catch (error) {
    console.error("Error adding question:", error);
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: "A question already exists for this date and level" 
      });
    }
    res.status(500).json({ message: "Failed to add question", error: error.message });
  }
};

// 📅 Get today's question based on user's level
const getTodayQuestionForUser = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.userId;
    
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get question matching user's current level
    const question = await StreakQuestion.findOne({
      activeDate: today,
      level: user.level
    }).select('-submissions'); // Don't send other users' submissions

    if (!question) {
      return res.status(404).json({ 
        message: "No question available for your level today",
        userLevel: user.level,
        levelName: StreakQuestion.getLevelName(user.level)
      });
    }

    // Check if user already solved today
    const alreadySolved = question.solvedBy.includes(userId);

    res.json({
      question,
      userLevel: user.level,
      levelName: StreakQuestion.getLevelName(user.level),
      alreadySolved,
      currentStreak: user.streak.currentStreak,
      longestStreak: user.streak.longestStreak
    });
  } catch (error) {
    console.error("Error fetching today's question:", error);
    res.status(500).json({ message: "Failed to fetch today's question", error: error.message });
  }
};

// 🏃 Run code against PUBLIC test cases only (like LeetCode "Run" button)
const runCode = async (req, res) => {
  try {
    const { questionId, code } = req.body;
    const userId = req.user?._id || req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const question = await StreakQuestion.findById(questionId);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Filter ONLY public test cases (isHidden = false)
    const publicTestCases = question.testCases.filter(tc => !tc.isHidden);

    if (publicTestCases.length === 0) {
      return res.status(400).json({ message: "No public test cases available" });
    }

    // Run only public test cases using Docker
    let passed = 0;
    let failed = 0;
    const testResults = [];
    let firstFailedCase = null;

    for (let index = 0; index < publicTestCases.length; index++) {
      const testCase = publicTestCases[index];
      try {
        const { stdout, stderr, exitCode } = await runCodeInDocker(code, req.body.language?.toLowerCase() || 'javascript', testCase.input);
        const actualOutput = stdout || stderr;
        const passedTest = (actualOutput.trim() === String(testCase.expectedOutput).trim());
        const result = {
          testCase: index + 1,
          passed: passedTest,
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput,
          explanation: testCase.explanation
        };
        testResults.push(result);
        if (passedTest) {
          passed++;
        } else {
          failed++;
          if (!firstFailedCase) {
            firstFailedCase = result;
          }
        }
      } catch (err) {
        failed++;
        const result = {
          testCase: index + 1,
          passed: false,
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: err.message,
          explanation: testCase.explanation
        };
        testResults.push(result);
        if (!firstFailedCase) {
          firstFailedCase = result;
        }
      }
    }

    const totalPublicCases = publicTestCases.length;

    if (failed === 0) {
      return res.json({
        success: true,
        message: `✓ All ${totalPublicCases} public test cases passed!`,
        passedCount: passed,
        totalCount: totalPublicCases,
        testResults
      });
    } else {
      return res.json({
        success: false,
        message: `✗ ${passed}/${totalPublicCases} public test cases passed`,
        passedCount: passed,
        totalCount: totalPublicCases,
        testResults,
        firstFailedCase
      });
    }
  } catch (error) {
    console.error("Error running code:", error);
    res.status(500).json({ message: "Failed to run code", error: error.message });
  }
};

// 🚀 Submit solution and update streak
const submitSolution = async (req, res) => {
  try {
    const { questionId, code } = req.body;
    const userId = req.user?._id || req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const user = await User.findById(userId);
    const question = await StreakQuestion.findById(questionId);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Check if user already solved this question today
    const alreadySolved = question.solvedBy.includes(userId);
    if (alreadySolved) {
      return res.status(400).json({ 
        message: "You've already solved today's question!",
        streak: user.streak.currentStreak
      });
    }

    // Run ALL test cases (public + hidden) and track detailed results
    let passed = 0;
    let failed = 0;
    const testResults = [];
    let firstFailedCase = null;

    for (let index = 0; index < question.testCases.length; index++) {
      const testCase = question.testCases[index];
      try {
        const { stdout, stderr, exitCode } = await runCodeInDocker(code, req.body.language?.toLowerCase() || 'javascript', testCase.input);
        const actualOutput = stdout || stderr;
        const passedTest = (actualOutput.trim() === String(testCase.expectedOutput).trim());
        const result = {
          testCase: index + 1,
          passed: passedTest,
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput,
          isPublic: !testCase.isHidden
        };
        testResults.push(result);
        if (passedTest) {
          passed++;
        } else {
          failed++;
          if (!firstFailedCase) {
            firstFailedCase = result;
          }
        }
      } catch (err) {
        failed++;
        const result = {
          testCase: index + 1,
          passed: false,
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: err.message,
          isPublic: !testCase.isHidden
        };
        testResults.push(result);
        if (!firstFailedCase) {
          firstFailedCase = result;
        }
      }
    }

    const status = failed === 0 ? 'passed' : (passed > 0 ? 'partial' : 'failed');
    const totalCases = question.testCases.length;

    // Record submission
    question.submissions.push({
      userId,
      code,
      status,
      submittedAt: new Date()
    });

    // If passed ALL cases, update streak and add to solvedBy
    if (status === 'passed') {
      question.solvedBy.push(userId);
      await question.save();

      // Update user streak
      await user.updateStreak(new Date());

      // Add to completed questions
      user.completedQuestions.push({
        questionId: question._id,
        difficulty: question.levelName,
        completedAt: new Date()
      });

      await user.save();

      return res.json({
        success: true,
        message: `🎉 Accepted! All ${totalCases} test cases passed!`,
        status: 'passed',
        passedCount: passed,
        totalCount: totalCases,
        testResults,
        streak: {
          current: user.streak.currentStreak,
          longest: user.streak.longestStreak
        },
        level: user.level,
        levelName: StreakQuestion.getLevelName(user.level),
        badges: user.badges,
        streakIncreased: true
      });
    } else {
      await question.save();
      return res.json({
        success: false,
        message: `❌ Wrong Answer - ${passed}/${totalCases} test cases passed`,
        status,
        passedCount: passed,
        totalCount: totalCases,
        firstFailedCase, // Show the specific failed test case
        streak: {
          current: user.streak.currentStreak,
          longest: user.streak.longestStreak
        }
      });
    }
  } catch (error) {
    console.error("Error submitting solution:", error);
    res.status(500).json({ message: "Failed to submit solution", error: error.message });
  }
};

// 📋 Get all streak questions (admin)
const getAllStreakQuestions = async (req, res) => {
  try {
    const { date } = req.query;
    let filter = {};

    if (date) {
      const queryDate = new Date(date);
      queryDate.setHours(0, 0, 0, 0);
      filter.activeDate = queryDate;
    }

    const questions = await StreakQuestion.find(filter)
      .sort({ activeDate: -1, level: 1 })
      .populate('solvedBy', 'name email');

    res.json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ message: "Failed to fetch questions", error: error.message });
  }
};

// 📊 Get user streak stats
const getUserStreakStats = async (req, res) => {
  try {
    const userId = req.params.userId || req.user?._id || req.user?.userId;

    const user = await User.findById(userId)
      .populate('completedQuestions.questionId', 'title levelName activeDate');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      name: user.name,
      email: user.email,
      streak: {
        current: user.streak.currentStreak,
        longest: user.streak.longestStreak,
        lastQuestionDate: user.streak.lastQuestionDate
      },
      level: user.level,
      levelName: StreakQuestion.getLevelName(user.level),
      badges: user.badges,
      completedQuestions: user.completedQuestions,
      totalSolved: user.completedQuestions.length
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({ message: "Failed to fetch user stats", error: error.message });
  }
};

// 📈 Get leaderboard
const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find({ 'streak.currentStreak': { $gt: 0 } })
      .select('name email streak.currentStreak streak.longestStreak level badges')
      .sort({ 'streak.currentStreak': -1, 'streak.longestStreak': -1 })
      .limit(50);

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      name: user.name,
      currentStreak: user.streak.currentStreak,
      longestStreak: user.streak.longestStreak,
      level: user.level,
      levelName: StreakQuestion.getLevelName(user.level),
      badges: user.badges.length
    }));

    res.json(leaderboard);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ message: "Failed to fetch leaderboard", error: error.message });
  }
};

// 📊 Admin stats dashboard
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ 'streak.currentStreak': { $gt: 0 } });
    const totalQuestions = await StreakQuestion.countDocuments();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayQuestions = await StreakQuestion.countDocuments({ activeDate: today });

    const topStreaker = await User.findOne()
      .sort({ 'streak.currentStreak': -1 })
      .select('name streak.currentStreak');

    const questionsByLevel = await StreakQuestion.aggregate([
      { $group: { 
        _id: '$levelName', 
        count: { $sum: 1 } 
      }}
    ]);

    const usersByLevel = await User.aggregate([
      { $group: { 
        _id: '$level', 
        count: { $sum: 1 } 
      }}
    ]);

    res.json({
      totalUsers,
      activeUsers,
      totalQuestions,
      todayQuestions,
      topStreaker: topStreaker ? {
        name: topStreaker.name,
        streak: topStreaker.streak.currentStreak
      } : null,
      questionsByLevel,
      usersByLevel
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ message: "Failed to fetch stats", error: error.message });
  }
};

module.exports = {
  addDailyQuestions,
  addStreakQuestion,
  getTodayQuestionForUser,
  runCode,
  submitSolution,
  getAllStreakQuestions,
  getUserStreakStats,
  getLeaderboard,
  getAdminStats,
  updateStreakQuestion,
  deleteStreakQuestion
};
