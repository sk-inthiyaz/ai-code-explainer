import React, { useState } from 'react';
import { deleteQuestion } from './utils/adminAPI';
import './QuestionList.css';

const QuestionList = ({ questions, onQuestionDeleted }) => {
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDelete = async (questionId) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      setLoading(true);
      try {
        await deleteQuestion(questionId);
        onQuestionDeleted();
      } catch (error) {
        console.error('Error deleting question:', error);
        alert('Failed to delete question. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const getDifficultyEmoji = (difficulty) => {
    const emojis = {
      'easy': '1️⃣',
      'medium': '2️⃣',
      'medium-easy': '3️⃣',
      'hard': '4️⃣',
      'mix': '5️⃣'
    };
    return emojis[difficulty?.toLowerCase?.()] || '❓';
  };

  return (
    <div className="question-list">
      <h2>Daily Questions</h2>
      {questions.length === 0 ? (
        <p className="no-questions">No questions available.</p>
      ) : (
        questions.map((question) => (
          <div 
            key={question._id} 
            className={`question-card ${expandedQuestion === question._id ? 'expanded' : ''}`}
          >
            <div className="question-header">
              <div className="question-info">
                <span className="difficulty-badge">
                  {getDifficultyEmoji(question.difficulty)} {question.difficulty ? question.difficulty.toUpperCase() : 'N/A'}
                </span>
                <h3>{question.title}</h3>
              </div>
              <div className="question-actions">
                <button 
                  className="expand-button"
                  onClick={() => setExpandedQuestion(
                    expandedQuestion === question._id ? null : question._id
                  )}
                >
                  {expandedQuestion === question._id ? '−' : '+'}
                </button>
                <button 
                  className="delete-button"
                  onClick={() => handleDelete(question._id)}
                  disabled={loading}
                >
                  🗑️
                </button>
              </div>
            </div>

            {expandedQuestion === question._id && (
              <div className="question-details">
                <div className="detail-section">
                  <h4>Description</h4>
                  <p>{question.description}</p>
                </div>

                {question.sampleInput && (
                  <div className="detail-section">
                    <h4>Sample Input</h4>
                    <pre>{question.sampleInput}</pre>
                  </div>
                )}

                {question.sampleOutput && (
                  <div className="detail-section">
                    <h4>Sample Output</h4>
                    <pre>{question.sampleOutput}</pre>
                  </div>
                )}

                {question.hints && question.hints.length > 0 && (
                  <div className="detail-section">
                    <h4>Hints</h4>
                    <ul>
                      {question.hints.map((hint, index) => (
                        <li key={index}>{hint}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="detail-section">
                  <h4>Solution</h4>
                  <pre className="solution-code">{question.solution}</pre>
                </div>

                <div className="detail-section meta-info">
                  <p>Created: {new Date(question.createdAt).toLocaleDateString()}</p>
                  <p>Last Updated: {new Date(question.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default QuestionList;