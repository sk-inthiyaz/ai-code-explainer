import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PracticeSelection.css';

const PracticeSelection = () => {
  const navigate = useNavigate();

  const practiceOptions = [
    {
      id: 'editor',
      title: 'Practice on Code Editor',
      description: 'Write and test your code in our feature-rich editor with real-time AI feedback',
      icon: '⌨️',
      features: [
        'Full-featured code editor',
        'Real-time syntax highlighting',
        'Instant AI code analysis',
        'Save your solutions'
      ],
      action: () => navigate('/learnhub/practice/editor')
    },
    {
      id: 'guided',
      title: 'Practice with Guidance',
      description: 'Step-by-step guided practice with structured problems and comprehensive feedback',
      icon: '🎯',
      features: [
        'Curated problem sets',
        'Progressive difficulty levels',
        'Detailed explanations',
        'Track your progress'
      ],
      action: () => navigate('/learnhub/practice/landing')
    }
  ];

  return (
    <div className="practice-selection">
      <header className="selection-header">
        <h1>Choose Your Practice Mode</h1>
        <p>Select the practice mode that best suits your learning style</p>
      </header>

      <div className="practice-options">
        {practiceOptions.map((option) => (
          <div key={option.id} className="practice-option-card" onClick={option.action}>
            <div className="option-icon">{option.icon}</div>
            <h2>{option.title}</h2>
            <p>{option.description}</p>
            <div className="features-list">
              {option.features.map((feature, index) => (
                <div key={index} className="feature-item">
                  <span className="feature-bullet">•</span>
                  {feature}
                </div>
              ))}
            </div>
            <button className="start-button">Get Started</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PracticeSelection;
