import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      style={{
        padding: '8px 16px',
        borderRadius: '4px',
        border: 'none',
        backgroundColor: 'var(--background-secondary)',
        color: 'var(--text-primary)',
        cursor: 'pointer'
      }}
    >
      {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
    </button>
  );
};
