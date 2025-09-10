import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRandomProblems } from './data/problemsDatabase';
import { FaCode, FaLightbulb, FaRobot, FaChartLine } from 'react-icons/fa';
import './PracticeLanding.css';

const languages = [
  { 
    id: 'c', 
    name: 'C', 
    icon: '�',
    description: 'Master the fundamentals with C programming',
    color: '#00599C'
  },
  { 
    id: 'java', 
    name: 'Java', 
    icon: '☕',
    description: 'Object-oriented programming with Java',
    color: '#ED8B00'
  }
];

const topics = [
  { id: 'arrays', title: 'Arrays', icon: '�', description: 'Master array manipulation and algorithms' },
  { id: 'strings', title: 'Strings', icon: '�', description: 'Learn string operations and patterns' },
  { id: 'loops', title: 'Loops', icon: '🔄', description: 'Practice iterative problem solving' }
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

const PracticeLanding = ({ 
  setCurrentProblem
}) => {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);

  const handleLanguageSelect = (languageId) => {
    setSelectedLanguage(languageId);
    // Reset topic and difficulty when language changes
    setSelectedTopic(null);
    setSelectedDifficulty(null);
  };

  const handleTopicSelect = (topicId) => {
    setSelectedTopic(topicId);
    // Reset difficulty when topic changes
    setSelectedDifficulty(null);
  };

  const handleDifficultySelect = (difficultyId) => {
    setSelectedDifficulty(difficultyId);
  };

  const handleGenerateProblems = async () => {
    if (!selectedLanguage || !selectedTopic || !selectedDifficulty) {
      alert('Please select language, topic, and difficulty level');
      return;
    }

    try {
      console.log('[DEBUG] Generating problems for:', { selectedLanguage, selectedTopic, selectedDifficulty });
      const problems = getRandomProblems(selectedLanguage, selectedTopic, selectedDifficulty, 5);
      
      if (!problems || problems.length === 0) {
        console.error('[DEBUG] No problems found:', problems);
        alert('No problems found for this combination. Please try different selections.');
        return;
      }

      console.log('[DEBUG] Setting problems and navigating:', problems);
      setCurrentProblem(problems);
      
      // Navigate to problems page
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

      <div className="practice-sections">
        {/* Language Selection */}
        <div className="section-container">
          <h2 className="section-title">Choose a Language</h2>
          <div className="languages-grid">
            {languages.map((language) => (
              <div
                key={language.id}
                className={`language-card ${selectedLanguage === language.id ? 'selected' : ''}`}
                onClick={() => handleLanguageSelect(language.id)}
                style={{ '--accent-color': language.color }}
              >
                <div className="language-content">
                  <span className="language-icon">{language.icon}</span>
                  <h3>{language.name}</h3>
                  <p>{language.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Topic Selection - Only show if language is selected */}
        {selectedLanguage && (
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
        )}

        {/* Difficulty Selection - Only show if topic is selected */}
        {selectedLanguage && selectedTopic && (
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
        )}

        {/* Generate Problems Button - Only show if all selections are made */}
        {selectedLanguage && selectedTopic && selectedDifficulty && (
          <div className="section-container">
            <button
              className="generate-btn"
              onClick={handleGenerateProblems}
            >
              Start Practice - Get 5 Problems
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PracticeLanding;