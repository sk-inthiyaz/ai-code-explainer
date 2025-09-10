// src/components/startLearningComponents/StartLearningMain.js
import React, { useState } from 'react';
import LanguageSelector from '../LanguageSelector';
import TopicSelector from '../TopicSelector';
import LearningOptions from '../LearningOptions';

const StartLearningMain = () => {
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);

  return (
    <div style={{ padding: '2rem' }}>
      <LanguageSelector onSelect={setSelectedLanguage} />
      {selectedLanguage && (
        <TopicSelector 
          selectedLanguage={selectedLanguage}
          onSelect={setSelectedTopic}
        />
      )}
      {selectedLanguage && selectedTopic && (
        <LearningOptions
          language={selectedLanguage}
          topic={selectedTopic}
        />
      )}
    </div>
  );
};

export default StartLearningMain;
