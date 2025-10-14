import React from 'react';
import { useNavigate } from 'react-router-dom';
import { generateProblems } from './services/aiService';
import { FaCode, FaLightbulb, FaRobot, FaChartLine } from 'react-icons/fa';
import './PracticeLanding.css';

const topics = [
  { id: 'arrays', title: 'Arrays', icon: '📊', description: 'Master array manipulation and algorithms' },
  { id: 'strings', title: 'Strings', icon: '📝', description: 'Learn string operations and patterns' },
  { id: 'loops', title: 'Loops', icon: '🔄', description: 'Practice iterative problem solving' },
  { id: 'recursion', title: 'Recursion', icon: '🔁', description: 'Understand recursive algorithms' },
  { id: 'sorting', title: 'Sorting', icon: '📶', description: 'Implement various sorting algorithms' },
  { id: 'trees', title: 'Trees', icon: '🌳', description: 'Work with tree data structures' },
];

const difficulties = [
  { 
    id: 'beginner', 
    title: 'Beginner', 
    color: '#4CAF50',
    description: 'Perfect for those just starting their coding journey'
  },
  { 
    id: 'medium', 
    title: 'Medium', 
    color: '#FF9800',
    description: 'Challenge yourself with intermediate concepts'
  },
  { 
    id: 'advanced', 
    title: 'Advanced', 
    color: '#F44336',
    description: 'Test your skills with complex problems'
  },
];

const features = [
  {
    icon: <FaRobot />,
    title: 'AI-Powered Feedback',
    description: 'Get instant, personalized feedback on your code from our advanced AI system'
  },
  {
    icon: <FaCode />,
    title: 'Real-World Problems',
    description: 'Practice with carefully curated problems that mirror real coding scenarios'
  },
  {
    icon: <FaLightbulb />,
    title: 'Learning Insights',
    description: 'Gain deep insights into different approaches and best practices'
  },
  {
    icon: <FaChartLine />,
    title: 'Track Progress',
    description: 'Monitor your improvement with detailed performance analytics'
  }
];

const PracticeLanding = ({ 
  selectedTopic,
  selectedDifficulty,
  setSelectedTopic, 
  setSelectedDifficulty,
  setCurrentProblem
}) => {
  const navigate = useNavigate();

  const handleTopicSelect = (topicId) => {
    setSelectedTopic(topicId);
  };

  const handleDifficultySelect = (difficultyId) => {
    setSelectedDifficulty(difficultyId);
  };

  const handleGenerateProblems = async () => {
    if (!selectedTopic || !selectedDifficulty) {
      alert('Please select both a topic and difficulty level');
      return;
    }

    try {
      console.log('[DEBUG] Generating problems for:', { selectedTopic, selectedDifficulty });
      const problems = await generateProblems(selectedTopic, selectedDifficulty);
      
      if (!problems || !Array.isArray(problems) || problems.length === 0) {
        console.error('[DEBUG] No problems received:', problems);
        alert('No problems were generated. Please try again.');
        return;
      }

      console.log('[DEBUG] Setting problems and navigating:', problems);
      setCurrentProblem(problems);
      
      // Add a small delay to ensure state is updated before navigation
      setTimeout(() => {
        navigate('/learnhub/practice/problem');
      }, 100);
      
    } catch (error) {
      console.error('[DEBUG] Error in handleGenerateProblems:', error);
      alert(`Failed to generate problems: ${error.message}`);
    }
  };

  return (
    <div className="practice-landing">
      <header className="practice-header">
        <h1>Practice with AI</h1>
        <p>Enhance your coding skills with interactive problems and AI-powered feedback</p>
      </header>

      {/* Features Section */}
      <div className="feature-grid">
        {features.map((feature, index) => (
          <div key={index} className="feature-card">
            <div className="feature-icon">
              {feature.icon}
            </div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="practice-sections">
        <div className="section-container">
          <h2 className="section-title">Choose Your Topic</h2>
          <div className="topics-grid">
            {topics.map((topic) => (
              <div
                key={topic.id}
                className={`topic-card ${selectedTopic === topic.id ? 'selected' : ''}`}
                onClick={() => handleTopicSelect(topic.id)}
              >
                <div className="topic-content">
                  <span className="topic-icon">{topic.icon}</span>
                  <h3>{topic.title}</h3>
                  <p>{topic.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="section-container">
          <h2 className="section-title">Select Difficulty Level</h2>
          <div className="difficulty-buttons">
            {difficulties.map((diff) => (
              <button
                key={diff.id}
                className={`difficulty-btn ${selectedDifficulty === diff.id ? 'selected' : ''}`}
                onClick={() => handleDifficultySelect(diff.id)}
                style={{ '--accent-color': diff.color }}
              >
                <span className="difficulty-icon">
                  {diff.id === 'beginner' ? '🌱' : diff.id === 'medium' ? '🚀' : '⭐'}
                </span>
                <span className="difficulty-content">
                  <span className="difficulty-title">{diff.title}</span>
                  <span className="difficulty-description">{diff.description}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Generate Problems Button */}
        <div className="section-container">
          <button
            className="generate-btn"
            onClick={handleGenerateProblems}
            disabled={!selectedTopic || !selectedDifficulty}
          >
            Generate Problems
          </button>
        </div>
      </div>
    </div>
  );
};

export default PracticeLanding;