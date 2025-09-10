import React from 'react';
import './TopicSelector.css';

const topics = [
  'Basic Syntax',
  'Data Types & Variables',
  'Operators',
  'Control Flow',
  'Loops',
  'Functions',
  'Data Structures',
  'Input/Output',
  'Error Handling ✅',
];

const TopicSelector = ({ selectedLanguage, onSelect }) => {
  return (
    <div className="topic-selector">
      <h2>{selectedLanguage} Topics</h2>
      <div className="topic-buttons">
        {topics.map((topic) => (
          <button key={topic} onClick={() => onSelect(topic)}>
            {topic}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TopicSelector;
