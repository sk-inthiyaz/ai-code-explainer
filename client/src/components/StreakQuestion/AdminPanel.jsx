import React, { useState, useEffect } from 'react';
import AdminQuestionForm from './AdminQuestionForm';
import QuestionList from './QuestionList';
import { fetchQuestions } from './utils/adminAPI';
import './AdminPanel.css';

const AdminPanel = () => {
  const [questions, setQuestions] = useState([]);
  const [activeTab, setActiveTab] = useState('list'); // 'list' or 'add'
  const [stats, setStats] = useState({
    totalQuestions: 0,
    activeUsers: 0,
    longestStreak: 0
  });

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const data = await fetchQuestions();
      setQuestions(data);
      // Update stats
      setStats(prevStats => ({
        ...prevStats,
        totalQuestions: data.length
      }));
    } catch (error) {
      console.error('Error loading questions:', error);
    }
  };

  const handleQuestionAdded = (newQuestion) => {
    setQuestions(prev => [newQuestion, ...prev]);
    setActiveTab('list');
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Daily Streak Questions Admin</h1>
        <div className="stats-panel">
          <div className="stat-card">
            <h3>Total Questions</h3>
            <p>{stats.totalQuestions}</p>
          </div>
          <div className="stat-card">
            <h3>Active Users</h3>
            <p>{stats.activeUsers}</p>
          </div>
          <div className="stat-card">
            <h3>Longest Streak</h3>
            <p>{stats.longestStreak} days</p>
          </div>
        </div>
      </div>

      <div className="admin-tabs">
        <button 
          className={`tab-button ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          Question List
        </button>
        <button 
          className={`tab-button ${activeTab === 'add' ? 'active' : ''}`}
          onClick={() => setActiveTab('add')}
        >
          Add Question
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'list' ? (
          <QuestionList 
            questions={questions}
            onQuestionDeleted={loadQuestions}
          />
        ) : (
          <AdminQuestionForm onQuestionAdded={handleQuestionAdded} />
        )}
      </div>
    </div>
  );
};

export default AdminPanel;