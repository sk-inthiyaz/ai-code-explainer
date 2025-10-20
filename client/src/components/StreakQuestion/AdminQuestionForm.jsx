import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { addDailyQuestions } from './utils/adminAPI';
import './AdminQuestionForm.css';

const difficultyLevels = [
  { value: 'easy', label: 'Easy (Level 1)', emoji: '1️⃣' },
  { value: 'medium', label: 'Medium (Level 2)', emoji: '2️⃣' },
  { value: 'medium-easy', label: 'Medium-Easy (Level 3)', emoji: '3️⃣' },
  { value: 'hard', label: 'Hard (Level 4)', emoji: '4️⃣' },
  { value: 'mix', label: 'Mix (Level 5)', emoji: '5️⃣' }
];

const levelTabs = [
  { id: 1, name: 'Easy' },
  { id: 2, name: 'Mid' },
  { id: 3, name: 'Mid-Easy' },
  { id: 4, name: 'Hard' },
  { id: 5, name: 'Mix' },
];

const emptyQuestion = () => ({
  title: '',
  description: '',
  constraints: '',
  starterCode: '',
  hints: [''],
  testCases: [
    { input: '', expectedOutput: '', explanation: '' }
  ]
});

const AdminQuestionForm = ({ onQuestionAdded }) => {
  const [activeTab, setActiveTab] = useState(1);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0,10));
  const [questions, setQuestions] = useState({
    1: emptyQuestion(),
    2: emptyQuestion(),
    3: emptyQuestion(),
    4: emptyQuestion(),
    5: emptyQuestion(),
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setQuestions(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [field]: value
      }
    }));
  };

  const handleHintChange = (index, value) => {
    const newHints = [...questions[activeTab].hints];
    newHints[index] = value;
    setQuestions(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        hints: newHints
      }
    }));
  };

  const addHint = () => {
    setQuestions(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        hints: [...prev[activeTab].hints, '']
      }
    }));
  };

  const removeHint = (index) => {
    setQuestions(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        hints: prev[activeTab].hints.filter((_, i) => i !== index)
      }
    }));
  };

  const handleTestCaseChange = (idx, field, value) => {
    const newTC = questions[activeTab].testCases.map((tc, i) => i === idx ? { ...tc, [field]: value } : tc);
    setQuestions(prev => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], testCases: newTC }
    }));
  };

  const addTestCase = () => {
    setQuestions(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        testCases: [...prev[activeTab].testCases, { input: '', expectedOutput: '', explanation: '' }]
      }
    }));
  };

  const removeTestCase = (idx) => {
    setQuestions(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        testCases: prev[activeTab].testCases.filter((_, i) => i !== idx)
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate all 5 questions minimally
      for (let lvl = 1; lvl <= 5; lvl++) {
        const q = questions[lvl];
        if (!q.title || !q.description || !q.testCases.length) {
          throw new Error(`Please complete Level ${lvl} question fields`);
        }
      }

      const payload = {
        date,
        questions: [questions[1], questions[2], questions[3], questions[4], questions[5]]
      };

      const result = await addDailyQuestions(payload);
      onQuestionAdded?.(result.questions || []);

      // Reset
      setQuestions({ 1: emptyQuestion(), 2: emptyQuestion(), 3: emptyQuestion(), 4: emptyQuestion(), 5: emptyQuestion() });
      toast.success('Published 5 daily questions successfully');
    } catch (error) {
      setError('Failed to add question. Please try again.');
      console.error('Error adding question:', error);
      toast.error(error?.message || 'Failed to add question');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="admin-question-form" onSubmit={handleSubmit}>
      <h2>Add 5 Daily Questions (One per Level)</h2>

      <div className="form-group">
        <label htmlFor="date">Active Date</label>
        <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      <div className="tabs">
        {levelTabs.map(tab => (
          <button
            type="button"
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.id}️⃣ {tab.name}
          </button>
        ))}
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="form-group">
        <label htmlFor="title">Question Title</label>
        <input
          type="text"
          id="title"
          value={questions[activeTab].title}
          onChange={(e) => handleChange('title', e.target.value)}
          required
          placeholder="e.g., Binary Search Implementation"
        />
      </div>

      {/* Difficulty is implied by tab (level) */}

      <div className="form-group">
        <label htmlFor="description">Question Description</label>
        <textarea
          id="description"
          value={questions[activeTab].description}
          onChange={(e) => handleChange('description', e.target.value)}
          required
          placeholder="Detailed problem description with examples"
          rows="6"
        />
      </div>

      <div className="form-group">
        <label htmlFor="constraints">Constraints</label>
        <textarea
          id="constraints"
          value={questions[activeTab].constraints}
          onChange={(e) => handleChange('constraints', e.target.value)}
          placeholder="Constraints for the problem"
          rows="3"
        />
      </div>

      <div className="form-group">
        <label>Hints</label>
        {questions[activeTab].hints.map((hint, index) => (
          <div key={index} className="hint-input">
            <input
              type="text"
              value={hint}
              onChange={(e) => handleHintChange(index, e.target.value)}
              placeholder={`Hint ${index + 1}`}
            />
            {questions[activeTab].hints.length > 1 && (
              <button 
                type="button"
                onClick={() => removeHint(index)}
                className="remove-hint"
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <button 
          type="button" 
          onClick={addHint}
          className="add-hint"
        >
          + Add Hint
        </button>
      </div>

      <div className="form-group">
        <label>Test Cases</label>
        {questions[activeTab].testCases.map((tc, idx) => (
          <div key={idx} className="testcase-row">
            <input
              type="text"
              placeholder="Input"
              value={tc.input}
              onChange={(e) => handleTestCaseChange(idx, 'input', e.target.value)}
            />
            <input
              type="text"
              placeholder="Expected Output"
              value={tc.expectedOutput}
              onChange={(e) => handleTestCaseChange(idx, 'expectedOutput', e.target.value)}
            />
            <input
              type="text"
              placeholder="Explanation (optional)"
              value={tc.explanation}
              onChange={(e) => handleTestCaseChange(idx, 'explanation', e.target.value)}
            />
            {questions[activeTab].testCases.length > 1 && (
              <button type="button" className="remove-tc" onClick={() => removeTestCase(idx)}>✕</button>
            )}
          </div>
        ))}
        <button type="button" className="add-tc" onClick={addTestCase}>+ Add Test Case</button>
      </div>

      <button 
        type="submit" 
        className="submit-button"
        disabled={loading}
      >
        {loading ? 'Publishing...' : 'Publish 5 Daily Questions'}
      </button>
    </form>
  );
};

export default AdminQuestionForm;