import React from 'react';
import './LanguageSelector.css';

const languages = ['Java', 'Python', 'C++', 'JavaScript'];

const LanguageSelector = ({ onSelect }) => {
  return (
    <div className="language-selector">
      <h2>Select a Language</h2>
      <div className="language-buttons">
        {languages.map((lang) => (
          <button key={lang} onClick={() => onSelect(lang)}>
            {lang}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;
