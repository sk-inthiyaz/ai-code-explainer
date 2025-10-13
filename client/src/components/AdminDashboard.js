import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    title: '',
    description: '',
    difficulty: 'easy',
    category: 'javascript',
    testCases: [{ input: '', expectedOutput: '' }]
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/practice/questions');
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewQuestion(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTestCaseChange = (index, field, value) => {
    setNewQuestion(prev => {
      const updatedTestCases = [...prev.testCases];
      updatedTestCases[index] = {
        ...updatedTestCases[index],
        [field]: value
      };
      return {
        ...prev,
        testCases: updatedTestCases
      };
    });
  };

  const addTestCase = () => {
    setNewQuestion(prev => ({
      ...prev,
      testCases: [...prev.testCases, { input: '', expectedOutput: '' }]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isEditing 
        ? `http://localhost:5000/api/practice/questions/${editingId}`
        : 'http://localhost:5000/api/practice/questions';
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newQuestion)
      });

      if (!response.ok) {
        throw new Error('Failed to save question');
      }

      fetchQuestions();
      resetForm();
    } catch (error) {
      console.error('Error saving question:', error);
    }
  };

  const handleEdit = (question) => {
    setNewQuestion(question);
    setIsEditing(true);
    setEditingId(question._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/practice/questions/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete question');
      }

      fetchQuestions();
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  const resetForm = () => {
    setNewQuestion({
      title: '',
      description: '',
      difficulty: 'easy',
      category: 'javascript',
      testCases: [{ input: '', expectedOutput: '' }]
    });
    setIsEditing(false);
    setEditingId(null);
  };

  return (
    <div className="admin-dashboard">
      <h1 className="admin-dashboard-title">Admin Dashboard</h1>
      
      <div className="admin-dashboard-content">
        <section className="question-form-section">
          <h2>{isEditing ? 'Edit Question' : 'Add New Question'}</h2>
          <form onSubmit={handleSubmit} className="question-form">
            <div className="form-group">
              <label htmlFor="title">Title:</label>
              <input
                type="text"
                id="title"
                name="title"
                value={newQuestion.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                name="description"
                value={newQuestion.description}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="difficulty">Difficulty:</label>
                <select
                  id="difficulty"
                  name="difficulty"
                  value={newQuestion.difficulty}
                  onChange={handleInputChange}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="category">Category:</label>
                <select
                  id="category"
                  name="category"
                  value={newQuestion.category}
                  onChange={handleInputChange}
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                </select>
              </div>
            </div>

            <div className="test-cases-section">
              <h3>Test Cases</h3>
              {newQuestion.testCases.map((testCase, index) => (
                <div key={index} className="test-case">
                  <div className="form-group">
                    <label htmlFor={`input-${index}`}>Input:</label>
                    <input
                      type="text"
                      id={`input-${index}`}
                      value={testCase.input}
                      onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor={`output-${index}`}>Expected Output:</label>
                    <input
                      type="text"
                      id={`output-${index}`}
                      value={testCase.expectedOutput}
                      onChange={(e) => handleTestCaseChange(index, 'expectedOutput', e.target.value)}
                    />
                  </div>
                </div>
              ))}
              <button type="button" onClick={addTestCase} className="add-test-case-btn">
                Add Test Case
              </button>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn">
                {isEditing ? 'Update Question' : 'Add Question'}
              </button>
              {isEditing && (
                <button type="button" onClick={resetForm} className="cancel-btn">
                  Cancel
                </button>
              )}
            </div>
          </form>
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
                  <span className="category">{question.category}</span>
                </div>
                <p>{question.description}</p>
                <div className="question-actions">
                  <button onClick={() => handleEdit(question)} className="edit-btn">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(question._id)} className="delete-btn">
                    Delete
                  </button>
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