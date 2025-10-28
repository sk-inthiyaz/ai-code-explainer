// src/components/startLearningComponents/StartLearningMain.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LanguageSelector from '../LanguageSelector';
import TopicSelector from '../TopicSelector';
import LearningOptions from '../LearningOptions';
import leftArrowIcon from '../../images/left-arrow (1).png';
import JavaImage from '../../images/JavaImage.png';
import PythonImage from '../../images/pythonImage.webp';
import CppImage from '../../images/C++Image.png';
import JavaScriptImage from '../../images/JavaScriptImage.png';
import './StartLearningMain.css';

const languages = ['Java', 'Python', 'C++', 'JavaScript'];

// Language display names (short versions)
const languageDisplayNames = {
  'Java': 'Java',
  'Python': 'Python',
  'C++': 'C++',
  'JavaScript': 'JS'
};

// Language images mapping
const languageImages = {
  'Java': JavaImage,
  'Python': PythonImage,
  'C++': CppImage,
  'JavaScript': JavaScriptImage
};

// Language background gradients
const languageGradients = {
  'Java': 'linear-gradient(135deg, rgba(244, 67, 54, 0.15), rgba(233, 30, 99, 0.15))',
  'Python': 'linear-gradient(135deg, rgba(33, 150, 243, 0.15), rgba(0, 188, 212, 0.15))',
  'C++': 'linear-gradient(135deg, rgba(103, 58, 183, 0.15), rgba(63, 81, 181, 0.15))',
  'JavaScript': 'linear-gradient(135deg, rgba(255, 193, 7, 0.15), rgba(255, 152, 0, 0.15))'
};

const topics = [
  { id: 'basic-syntax', name: 'Basic Syntax', icon: '📝', difficulty: 'Beginner' },
  { id: 'data-types', name: 'Data Types & Variables', icon: '🔢', difficulty: 'Beginner' },
  { id: 'operators', name: 'Operators', icon: '➕', difficulty: 'Beginner' },
  { id: 'control-flow', name: 'Control Flow', icon: '🔀', difficulty: 'Intermediate' },
  { id: 'loops', name: 'Loops', icon: '🔄', difficulty: 'Intermediate' },
  { id: 'functions', name: 'Functions', icon: '⚡', difficulty: 'Intermediate' },
  { id: 'data-structures', name: 'Data Structures', icon: '📊', difficulty: 'Advanced' },
  { id: 'input-output', name: 'Input/Output', icon: '💻', difficulty: 'Beginner' },
  { id: 'error-handling', name: 'Error Handling', icon: '🛡️', difficulty: 'Advanced' },
];

const StartLearningMain = () => {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [progress, setProgress] = useState({});
  const [showStats, setShowStats] = useState(false);

  // Load progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('learningProgress');
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    if (Object.keys(progress).length > 0) {
      localStorage.setItem('learningProgress', JSON.stringify(progress));
    }
  }, [progress]);

  const getProgressKey = (lang, topic) => `${lang}-${topic}`;

  const isTopicCompleted = (lang, topicName) => {
    const key = getProgressKey(lang, topicName);
    return progress[key]?.completed || false;
  };

  const getTopicProgress = (lang, topicName) => {
    const key = getProgressKey(lang, topicName);
    return progress[key]?.watchedVideos || 0;
  };

  const markTopicComplete = (lang, topicName) => {
    const key = getProgressKey(lang, topicName);
    setProgress(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        completed: true,
        completedAt: new Date().toISOString(),
        watchedVideos: (prev[key]?.watchedVideos || 0) + 1
      }
    }));
  };

  const calculateOverallProgress = () => {
    if (!selectedLanguage) return 0;
    const totalTopics = topics.length;
    const completedTopics = topics.filter(topic => 
      isTopicCompleted(selectedLanguage, topic.name)
    ).length;
    return Math.round((completedTopics / totalTopics) * 100);
  };

  const getLanguageProgress = (lang) => {
    const totalTopics = topics.length;
    const completedTopics = topics.filter(topic => 
      isTopicCompleted(lang, topic.name)
    ).length;
    return { completed: completedTopics, total: totalTopics };
  };

  const handleLanguageSelect = (lang) => {
    setSelectedLanguage(lang);
    setSelectedTopic(null);
  };

  const handleTopicSelect = (topicName) => {
    setSelectedTopic(topicName);
  };

  const handleResetProgress = () => {
    if (window.confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      setProgress({});
      localStorage.removeItem('learningProgress');
    }
  };

  return (
    <div className="learning-main-container">
      {/* Header with Back Button */}
      <div className="learning-header">
        <div className="header-top">
          <button 
            className="back-btn-learning"
            onClick={() => navigate('/LearnHub')}
            title="Back to LearnHub"
          >
            <img src={leftArrowIcon} alt="Back" />
          </button>
          <div className="header-content">
            <h1>🔰 Start Learning</h1>
            <p>Master programming fundamentals with interactive tutorials and track your progress</p>
          </div>
          <button 
            className="stats-btn"
            onClick={() => setShowStats(!showStats)}
            title="View Statistics"
          >
            📊 Stats
          </button>
        </div>

        {/* Progress Stats Modal */}
        {showStats && (
          <div className="stats-overlay" onClick={() => setShowStats(false)}>
            <div className="stats-modal" onClick={(e) => e.stopPropagation()}>
              <div className="stats-header">
                <h2>📊 Your Learning Statistics</h2>
                <button className="close-btn" onClick={() => setShowStats(false)}>✕</button>
              </div>
              <div className="stats-content">
                {languages.map(lang => {
                  const langProgress = getLanguageProgress(lang);
                  const percentage = Math.round((langProgress.completed / langProgress.total) * 100);
                  return (
                    <div key={lang} className="lang-stat-card">
                      <div className="lang-stat-header">
                        <h3>{lang}</h3>
                        <span className="lang-stat-badge">{langProgress.completed}/{langProgress.total} Topics</span>
                      </div>
                      <div className="progress-bar-container">
                        <div className="progress-bar-fill" style={{ width: `${percentage}%` }}>
                          <span className="progress-text">{percentage}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <button className="reset-progress-btn" onClick={handleResetProgress}>
                  🔄 Reset All Progress
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Language Selection */}
      {!selectedLanguage ? (
        <div className="language-selection-modern">
          <h2>Choose Your Programming Language</h2>
          <div className="language-grid">
            {languages.map((lang) => {
              const langProgress = getLanguageProgress(lang);
              const percentage = Math.round((langProgress.completed / langProgress.total) * 100);
              return (
                <div 
                  key={lang} 
                  className="language-card"
                  onClick={() => handleLanguageSelect(lang)}
                  style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${languageImages[lang]})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                >
                  <h3>{languageDisplayNames[lang]}</h3>
                  <div className="card-progress">
                    <div className="mini-progress-bar">
                      <div className="mini-progress-fill" style={{ width: `${percentage}%` }}></div>
                    </div>
                    <span className="progress-label">{langProgress.completed}/{langProgress.total} completed</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : !selectedTopic ? (
        <div className="topic-selection-modern">
          <div className="selection-header">
            <button className="back-to-lang-btn" onClick={() => setSelectedLanguage(null)}>
              ← Back to Languages
            </button>
            <h2>{selectedLanguage} - Choose a Topic</h2>
            <div className="overall-progress">
              <span>Overall Progress: {calculateOverallProgress()}%</span>
              <div className="progress-circle">
                <svg width="60" height="60">
                  <circle cx="30" cy="30" r="25" fill="none" stroke="#e0e0e0" strokeWidth="5"/>
                  <circle 
                    cx="30" 
                    cy="30" 
                    r="25" 
                    fill="none" 
                    stroke="#667eea" 
                    strokeWidth="5"
                    strokeDasharray={`${calculateOverallProgress() * 1.57} 157`}
                    transform="rotate(-90 30 30)"
                  />
                  <text x="30" y="35" textAnchor="middle" fontSize="12" fill="#667eea" fontWeight="bold">
                    {calculateOverallProgress()}%
                  </text>
                </svg>
              </div>
            </div>
          </div>

          <div className="topics-grid">
            {topics.map((topic) => {
              const isCompleted = isTopicCompleted(selectedLanguage, topic.name);
              const videosWatched = getTopicProgress(selectedLanguage, topic.name);
              return (
                <div 
                  key={topic.id} 
                  className={`topic-card ${isCompleted ? 'completed' : ''}`}
                  onClick={() => handleTopicSelect(topic.name)}
                >
                  <div className="topic-card-header">
                    <span className="topic-icon">{topic.icon}</span>
                    {isCompleted && <span className="completed-badge">✓</span>}
                  </div>
                  <h3>{topic.name}</h3>
                  <div className="topic-meta">
                    <span className={`difficulty ${topic.difficulty.toLowerCase()}`}>
                      {topic.difficulty}
                    </span>
                    {videosWatched > 0 && (
                      <span className="videos-watched">📺 {videosWatched} watched</span>
                    )}
                  </div>
                  <button className="start-learning-btn">
                    {isCompleted ? 'Review' : 'Start Learning'} →
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="learning-content">
          <div className="content-header">
            <button className="back-to-topics-btn" onClick={() => setSelectedTopic(null)}>
              ← Back to Topics
            </button>
            <div className="topic-info">
              <h2>{selectedTopic}</h2>
              <span className="current-lang">{selectedLanguage}</span>
            </div>
            <button 
              className={`mark-complete-btn ${isTopicCompleted(selectedLanguage, selectedTopic) ? 'completed' : ''}`}
              onClick={() => markTopicComplete(selectedLanguage, selectedTopic)}
              disabled={isTopicCompleted(selectedLanguage, selectedTopic)}
            >
              {isTopicCompleted(selectedLanguage, selectedTopic) ? '✓ Completed' : '✓ Mark as Complete'}
            </button>
          </div>
          <LearningOptions
            language={selectedLanguage}
            topic={selectedTopic}
          />
        </div>
      )}
    </div>
  );
};

export default StartLearningMain;
