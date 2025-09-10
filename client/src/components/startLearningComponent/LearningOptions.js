import React, { useState } from 'react';
import './LearningOptions.css';
import WatchTutorials from './data/WatchTutorials';
import ErrorBoundary from '../ErrorBoundary';

const LearningOptions = ({ language, topic }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  
  // Function to generate a more specific GFG URL based on language and topic
  const getGFGUrl = (language, topic) => {
    // Remove spaces and special characters from topic
    const formattedTopic = topic.toLowerCase().replace(/[&]/g, 'and').replace(/[^a-zA-Z0-9]/g, '-');
    const formattedLang = language.toLowerCase();
    
    // Map topics to their GFG URL patterns
    const topicMap = {
      'basic syntax': `${formattedLang}-basics`,
      'data types & variables': `${formattedLang}-data-types`,
      'operators': `${formattedLang}-operators`,
      'control flow': `${formattedLang}-control-flow`,
      'loops': `${formattedLang}-loops`,
      'functions': `${formattedLang}-functions`,
      'data structures': `${formattedLang}-data-structures`,
      'input/output': `${formattedLang}-input-output`,
      'error handling': `${formattedLang}-exception-handling`,
    };

    // Get the specific URL path or fallback to search
    const specificPath = topicMap[topic.toLowerCase()];
    if (specificPath) {
      return `https://www.geeksforgeeks.org/${specificPath}/`;
    }
    
    // Fallback to search if no specific mapping exists
    const query = `${language} ${topic}`;
    return `https://www.geeksforgeeks.org/search?q=${encodeURIComponent(query)}`;
  };

  const gfgLink = getGFGUrl(language, topic);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  if (selectedOption === 'watch') {
    return (
      <ErrorBoundary>
        <WatchTutorials language={language} topic={topic} />
      </ErrorBoundary>
    );
  }

  if (selectedOption === 'learn') {
    window.open(gfgLink, '_blank', 'noopener,noreferrer');
    setSelectedOption(null);
  }

  return (
    <div className="learning-options">
      <h2>How would you like to learn {language} - {topic}?</h2>
      <div className="tutorial-buttons">
        <button 
          className="watch-btn" 
          onClick={() => handleOptionSelect('watch')}
        >
          📺 Watch Video Tutorials
        </button>
        <button 
          className="learn-btn"
          onClick={() => handleOptionSelect('learn')}
        >
          📚 Learn with GeeksforGeeks
        </button>
      </div>
    </div>
  );
};

export default LearningOptions;
