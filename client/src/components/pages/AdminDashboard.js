import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [questions, setQuestions] = useState([]);
  const [jsonPreview, setJsonPreview] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/questions/questions', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setError('Failed to load questions');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const json = JSON.parse(text);
      
      // Validate JSON structure
      if (!json.questions || !Array.isArray(json.questions)) {
        throw new Error('JSON must contain a questions array');
      }

      // Validate each question
      json.questions.forEach((question, index) => {
        if (!question.title || !question.description || 
            !question.difficulty || !Array.isArray(question.testCases)) {
          throw new Error(`Invalid question format at index ${index}`);
        }
      });

      setJsonPreview(json);
      setError(null);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      setError(error.message);
      setJsonPreview(null);
    }
  };

  const handleJsonImport = async () => {
    if (!jsonPreview) return;

    try {
      const response = await fetch('http://localhost:5000/api/questions/bulk-import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ questions: jsonPreview })
      });

      if (!response.ok) {
        throw new Error('Failed to import questions');
      }

      const result = await response.json();
      setQuestions(prev => [...prev, ...result]);
      setJsonPreview(null);
      setError(null);
      alert('Questions imported successfully!');
    } catch (error) {
      console.error('Error importing questions:', error);
      setError('Failed to import questions: ' + error.message);
    }
  };

  return (
    <div className="admin-dashboard">
      <h1 className="admin-dashboard-title">Admin Dashboard</h1>
      
      <div className="admin-dashboard-content">
        <section className="question-import-section">
          <h2>Import Questions</h2>
          <div className="import-options">
            <div className="file-upload-container">
              <h3>Upload JSON File</h3>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="file-input"
              />
              <p className="helper-text">Upload a JSON file containing questions and test cases</p>
              <p className="format-note">Note: Questions can be solved in any programming language</p>
              
              <pre className="json-format-example">
{`{
  "questions": [
    {
      "title": "Question Title",
      "description": "Problem description...",
      "difficulty": "easy",
      "testCases": [
        {
          "input": "Sample input",
          "expectedOutput": "Expected output"
        }
      ]
    }
  ]
}`}
              </pre>
            </div>
            <div className="json-preview">
              {jsonPreview && (
                <>
                  <h4>Preview:</h4>
                  <pre>{JSON.stringify(jsonPreview, null, 2)}</pre>
                  <button 
                    onClick={handleJsonImport}
                    className="import-btn"
                  >
                    Import Questions
                  </button>
                </>
              )}
              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="questions-list-section">
          <h2>Existing Questions</h2>
          <div className="questions-list">
            {questions.map(question => (
              <div key={question._id} className="question-card">
                <h3>{question.title}</h3>
                <div className="question-meta">
                  <span className={`difficulty ${question.difficulty}`}>
                    {question.difficulty}
                  </span>
                </div>
                <p>{question.description}</p>
                <div className="test-cases">
                  <strong>Test Cases:</strong>
                  {question.testCases.map((testCase, index) => (
                    <div key={index} className="test-case">
                      <div>Input: {testCase.input}</div>
                      <div>Expected: {testCase.expectedOutput}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;