import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import './SolvePage.css';

const SolvePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [questionData, setQuestionData] = useState(location.state || null);
  const [language, setLanguage] = useState('JavaScript');
  const [code, setCode] = useState('// Write your code here...');
  const [loading, setLoading] = useState(false);
  const [runResults, setRunResults] = useState(null);
  const [submitResults, setSubmitResults] = useState(null);
  const [activeTab, setActiveTab] = useState('testcases'); // testcases or results

  useEffect(() => {
    // If page is refreshed, fetch question again from API
    if (!questionData) {
      fetchToday();
    }
  }, []);

  const fetchToday = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/streak/today', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setQuestionData(data);
      }
    } catch (e) {
      console.error('Failed to fetch today question');
      toast.error('Failed to load question');
    }
  };

  const handleRun = async () => {
    if (!questionData?.question?._id) return;
    setLoading(true);
    setActiveTab('results');
    setSubmitResults(null); // Clear previous submit results
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/streak/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          questionId: questionData.question._id, 
          code, 
          language 
        })
      });
      const data = await res.json();
      setRunResults(data);

      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (e) {
      toast.error('Failed to run code');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!questionData?.question?._id) return;
    setLoading(true);
    setActiveTab('results');
    setRunResults(null); // Clear previous run results
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/streak/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          questionId: questionData.question._id, 
          code, 
          language 
        })
      });
      const data = await res.json();
      setSubmitResults(data);

      if (data.success) {
        toast.success(data.message);
        setTimeout(() => navigate('/streak'), 2000);
      } else {
        toast.error(data.message);
      }
    } catch (e) {
      toast.error('Submission failed');
    } finally {
      setLoading(false);
    }
  };

  if (!questionData?.question) {
    return <div className="solve-page"><p>Loading question...</p></div>;
  }

  const { question } = questionData;
  const publicTestCases = question.testCases?.filter(tc => !tc.isHidden) || [];

  return (
    <div className="solve-page">
      <button className="back-btn" onClick={() => navigate('/streak')}>← Back</button>
      
      <div className="solve-container">
        {/* Left Panel - Problem Description & Test Cases */}
        <div className="problem-panel">
          <div className="problem-header">
            <h2>{question.title}</h2>
            <span className={`difficulty-badge ${question.levelName?.toLowerCase() || 'easy'}`}>
              {question.levelName || 'Easy'}
            </span>
          </div>

          <div className="problem-content">
            <div className="problem-section">
              <h3>Description</h3>
              <p>{question.description}</p>
            </div>

            {question.examples && question.examples.length > 0 && (
              <div className="problem-section">
                <h3>Examples</h3>
                {question.examples.map((example, idx) => (
                  <div key={idx} className="example-box">
                    <strong>Example {idx + 1}:</strong>
                    <pre>{example}</pre>
                  </div>
                ))}
              </div>
            )}

            {question.constraints && (
              <div className="problem-section">
                <h3>Constraints</h3>
                {typeof question.constraints === 'string' ? (
                  <pre className="constraints">{question.constraints}</pre>
                ) : Array.isArray(question.constraints) ? (
                  <ul>
                    {question.constraints.map((c, idx) => (
                      <li key={idx}>{c}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            )}
          </div>

          {/* Tabs for Test Cases & Results */}
          <div className="test-tabs">
            <button
              className={`tab-btn ${activeTab === 'testcases' ? 'active' : ''}`}
              onClick={() => setActiveTab('testcases')}
            >
              Test Cases
            </button>
            <button
              className={`tab-btn ${activeTab === 'results' ? 'active' : ''}`}
              onClick={() => setActiveTab('results')}
            >
              Test Results
            </button>
          </div>

          {/* Test Cases Panel */}
          {activeTab === 'testcases' && (
            <div className="test-cases-panel">
              <h3>Public Test Cases</h3>
              {publicTestCases.length > 0 ? (
                publicTestCases.map((tc, idx) => (
                  <div key={idx} className="test-case">
                    <strong>Test Case {idx + 1}</strong>
                    <div className="test-case-content">
                      <div>
                        <strong>Input:</strong>
                        <pre>{tc.input}</pre>
                      </div>
                      <div>
                        <strong>Expected Output:</strong>
                        <pre>{tc.expectedOutput}</pre>
                      </div>
                      {tc.explanation && (
                        <div>
                          <strong>Explanation:</strong>
                          <p>{tc.explanation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-data">No public test cases available.</p>
              )}
            </div>
          )}

          {/* Results Panel */}
          {activeTab === 'results' && (
            <div className="results-panel">
              {/* Run Results */}
              {runResults && (
                <div className={`result-summary ${runResults.success ? 'success' : 'error'}`}>
                  <div className="result-header">
                    <h3>{runResults.success ? '✓ ' : '✗ '}{runResults.message}</h3>
                    <p className="result-count">
                      {runResults.passedCount}/{runResults.totalCount} test cases passed
                    </p>
                  </div>
                  
                  {runResults.firstFailedCase && (
                    <div className="failed-case-detail">
                      <h4>❌ Test Case {runResults.firstFailedCase.testCase} Failed</h4>
                      <div className="failed-case-grid">
                        <div className="failed-item">
                          <strong>Input:</strong>
                          <pre>{runResults.firstFailedCase.input}</pre>
                        </div>
                        <div className="failed-item">
                          <strong>Expected:</strong>
                          <pre className="expected">{runResults.firstFailedCase.expectedOutput}</pre>
                        </div>
                        <div className="failed-item">
                          <strong>Got:</strong>
                          <pre className="wrong">{runResults.firstFailedCase.actualOutput}</pre>
                        </div>
                      </div>
                    </div>
                  )}

                  {runResults.success && (
                    <div className="success-message">
                      <p>All public test cases passed! Ready to submit?</p>
                    </div>
                  )}
                </div>
              )}

              {/* Submit Results */}
              {submitResults && (
                <div className={`result-summary ${submitResults.success ? 'success' : 'error'}`}>
                  <div className="result-header">
                    <h3>{submitResults.success ? '✓ ' : '✗ '}{submitResults.message}</h3>
                    <p className="result-count">
                      {submitResults.passedCount}/{submitResults.totalCount} test cases passed
                    </p>
                  </div>
                  
                  {submitResults.firstFailedCase && (
                    <div className="failed-case-detail">
                      <h4>
                        ❌ Test Case {submitResults.firstFailedCase.testCase}/{submitResults.totalCount} Failed
                      </h4>
                      <div className="failed-case-grid">
                        <div className="failed-item">
                          <strong>Input:</strong>
                          <pre>{submitResults.firstFailedCase.input}</pre>
                        </div>
                        <div className="failed-item">
                          <strong>Expected:</strong>
                          <pre className="expected">{submitResults.firstFailedCase.expectedOutput}</pre>
                        </div>
                        <div className="failed-item">
                          <strong>Got:</strong>
                          <pre className="wrong">{submitResults.firstFailedCase.actualOutput}</pre>
                        </div>
                      </div>
                    </div>
                  )}

                  {submitResults.success && submitResults.streakIncreased && (
                    <div className="success-message streak-info">
                      <p>🎉 Congratulations! All test cases passed!</p>
                      <p className="streak-text">
                        🔥 Current Streak: <strong>{submitResults.streak?.current}</strong> days
                        (Longest: {submitResults.streak?.longest})
                      </p>
                    </div>
                  )}
                </div>
              )}

              {!runResults && !submitResults && (
                <div className="no-results">
                  <p>Run or submit your code to see results</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Panel - Code Editor */}
        <div className="editor-panel">
          <div className="editor-header">
            <h3>Code Editor</h3>
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              className="language-selector"
            >
              <option>JavaScript</option>
              <option>Python</option>
              <option>Java</option>
              <option>C++</option>
            </select>
          </div>

          <textarea
            className="code-editor"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Write your code here..."
            spellCheck={false}
          />

          <div className="editor-actions">
            <button
              onClick={handleRun}
              disabled={loading}
              className="run-button"
            >
              {loading ? 'Running...' : '▶ Run'}
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="submit-button"
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolvePage;
