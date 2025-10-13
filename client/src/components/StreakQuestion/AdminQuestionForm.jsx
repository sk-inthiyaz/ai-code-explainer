import React, { useState } from 'react';
import { addQuestion } from './utils/adminAPI';
import './AdminQuestionForm.css';

const difficultyLevels = [
  { value: 'easy', label: 'Easy (Level 1)', emoji: '1️⃣' },
  { value: 'medium', label: 'Medium (Level 2)', emoji: '2️⃣' },
  { value: 'medium-easy', label: 'Medium-Easy (Level 3)', emoji: '3️⃣' },
  { value: 'hard', label: 'Hard (Level 4)', emoji: '4️⃣' },
  { value: 'mix', label: 'Mix (Level 5)', emoji: '5️⃣' }
];

const AdminQuestionForm = ({ onQuestionAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'easy',
    sampleInput: '',
    sampleOutput: '',
    testCases: [],
    hints: [''],
    solution: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleHintChange = (index, value) => {
    const newHints = [...formData.hints];
    newHints[index] = value;
    setFormData(prev => ({
      ...prev,
      hints: newHints
    }));
  };

  const addHint = () => {
    setFormData(prev => ({
      ...prev,
      hints: [...prev.hints, '']
    }));
  };

  const removeHint = (index) => {
    setFormData(prev => ({
      ...prev,
      hints: prev.hints.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const newQuestion = await addQuestion(formData);
      onQuestionAdded(newQuestion);
      // Reset form
      setFormData({
        title: '',
        description: '',
        difficulty: 'easy',
        sampleInput: '',
        sampleOutput: '',
        testCases: [],
        hints: [''],
        solution: ''
      });
    } catch (error) {
      setError('Failed to add question. Please try again.');
      console.error('Error adding question:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="admin-question-form" onSubmit={handleSubmit}>
      <h2>Add New Daily Question</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="form-group">
        <label htmlFor="title">Question Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="e.g., Binary Search Implementation"
        />
      </div>

      <div className="form-group">
        <label htmlFor="difficulty">Difficulty Level</label>
        <select
          id="difficulty"
          name="difficulty"
          value={formData.difficulty}
          onChange={handleChange}
          required
        >
          {difficultyLevels.map(level => (
            <option key={level.value} value={level.value}>
              {level.emoji} {level.label}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="description">Question Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          placeholder="Detailed problem description with examples"
          rows="6"
        />
      </div>

      <div className="form-group">
        <label htmlFor="sampleInput">Sample Input</label>
        <textarea
          id="sampleInput"
          name="sampleInput"
          value={formData.sampleInput}
          onChange={handleChange}
          placeholder="Example input format"
          rows="2"
        />
      </div>

      <div className="form-group">
        <label htmlFor="sampleOutput">Sample Output</label>
        <textarea
          id="sampleOutput"
          name="sampleOutput"
          value={formData.sampleOutput}
          onChange={handleChange}
          placeholder="Expected output format"
          rows="2"
        />
      </div>

      <div className="form-group">
        <label>Hints</label>
        {formData.hints.map((hint, index) => (
          <div key={index} className="hint-input">
            <input
              type="text"
              value={hint}
              onChange={(e) => handleHintChange(index, e.target.value)}
              placeholder={`Hint ${index + 1}`}
            />
            {formData.hints.length > 1 && (
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
        <label htmlFor="solution">Solution</label>
        <textarea
          id="solution"
          name="solution"
          value={formData.solution}
          onChange={handleChange}
          placeholder="Provide a complete solution with explanations"
          rows="8"
          required
        />
      </div>

      <button 
        type="submit" 
        className="submit-button"
        disabled={loading}
      >
        {loading ? 'Adding Question...' : 'Add Question'}
      </button>
    </form>
  );
};

export default AdminQuestionForm;