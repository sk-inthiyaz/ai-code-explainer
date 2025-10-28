import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import './Practice.css';
import leftArrowIcon from '../images/left-arrow (1).png';

const ProblemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState(null);
  const [activeDescriptionTab, setActiveDescriptionTab] = useState('description'); // 'description' or 'submissions'
  const [submissionHistory, setSubmissionHistory] = useState([]);
  const [activeTestCaseTab, setActiveTestCaseTab] = useState(0); // Index of active test case
  const [runResults, setRunResults] = useState(null); // Results from Run Code (public test cases)
  const [isTestCasesCollapsed, setIsTestCasesCollapsed] = useState(false); // For collapse button

  const languageMap = {
    javascript: { label: 'JavaScript', monacoLang: 'javascript' },
    python: { label: 'Python', monacoLang: 'python' },
    java: { label: 'Java', monacoLang: 'java' },
    cpp: { label: 'C++', monacoLang: 'cpp' }
  };

  useEffect(() => {
    fetchProblem();
  }, [id]);

  useEffect(() => {
    // Update starter code when language changes
    if (problem && problem.codeTemplate) {
      setCode(problem.codeTemplate[language] || '// Write your code here');
    }
  }, [language, problem]);

  const fetchProblem = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/practice/problems/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setProblem(data);
        setCode(data.codeTemplate?.[language] || '// Write your code here');
      } else {
        console.error('Failed to fetch problem');
      }
    } catch (error) {
      console.error('Error fetching problem:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRun = async () => {
    setRunning(true);
    setRunResults(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/practice/editor/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          code,
          language,
          problemId: id
        })
      });

      const data = await res.json();
      setRunResults(data); // Store run results separately for test case display
    } catch (error) {
      console.error('Error running code:', error);
      setRunResults({ success: false, error: 'Failed to run code' });
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setResults(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/practice/problems/${id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ code, language })
      });

      const data = await res.json();
      setResults(data);
      
      // Add to submission history
      setSubmissionHistory(prev => [{
        ...data,
        timestamp: new Date().toISOString(),
        language: language
      }, ...prev]);
      
      // Auto-switch to Submissions tab
      setActiveDescriptionTab('submissions');

      // Refresh problem to update solved status
      if (data.success) {
        setTimeout(fetchProblem, 500);
      }
    } catch (error) {
      console.error('Error submitting solution:', error);
      setResults({ success: false, message: 'Failed to submit solution' });
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleBackClick = () => {
    navigate('/practice/problems');
  };

  // Handler functions for toolbar icons
  const handleResetCode = () => {
    if (problem && problem.codeTemplate) {
      setCode(problem.codeTemplate[language] || '// Write your code here');
    }
  };

  const handleSettings = () => {
    // Toggle editor settings (font size, theme, etc.)
    alert('Settings panel coming soon!');
  };

  if (loading) {
    return (
      <div className="practice-container" style={{ textAlign: 'center', paddingTop: '3rem' }}>
        <div className="loading-spinner" style={{ margin: '0 auto', width: '40px', height: '40px' }}></div>
        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Loading problem...</p>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="practice-container" style={{ textAlign: 'center', paddingTop: '3rem' }}>
        <h2>Problem not found</h2>
        <Link to="/practice/problems" className="btn-submit" style={{ marginTop: '1rem', display: 'inline-block', textDecoration: 'none' }}>
          Back to Problems
        </Link>
      </div>
    );
  }

  return (
    <div className="problem-detail-container">
      {/* Left Panel - Problem Description */}
      <div className="problem-description-panel">
        {/* Back Button Header */}
        <div className="problem-detail-header">
          <button 
            className="back-button-icon" 
            onClick={handleBackClick}
            title="Back to Problems"
          >
            <img src={leftArrowIcon} alt="Back" />
          </button>
          <div className="problem-title-header">
            <h1>{problem.title}</h1>
            {problem.isSolved && (
              <span className="solved-check" title="Solved" style={{ fontSize: '2rem' }}>✓</span>
            )}
          </div>
        </div>

        {/* Tabs: Description / Submissions */}
        <div className="problem-tabs-container">
          <div className="problem-tabs">
            <button
              className={`problem-tab ${activeDescriptionTab === 'description' ? 'active' : ''}`}
              onClick={() => setActiveDescriptionTab('description')}
            >
              📋 Description
            </button>
            <button
              className={`problem-tab ${activeDescriptionTab === 'submissions' ? 'active' : ''}`}
              onClick={() => setActiveDescriptionTab('submissions')}
            >
              ✓ Submissions {submissionHistory.length > 0 && <span className="tab-badge">{submissionHistory.length}</span>}
            </button>
          </div>
          <div className="tab-underline"></div>
        </div>

        <div className="problem-meta">
          <div className="meta-item">
            <span className="meta-label">Difficulty</span>
            <span className={`difficulty-badge ${problem.difficulty}`}>
              {problem.difficulty}
            </span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Topic</span>
            <span className="meta-value">{problem.topic}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Acceptance</span>
            <span className="meta-value">{problem.acceptanceRate || 0}%</span>
          </div>
        </div>

        {/* TAB CONTENT */}
        <div className="tab-content-container">
          {/* DESCRIPTION TAB */}
          {activeDescriptionTab === 'description' && (
            <div className="tab-content description-content">
              <div className="problem-description">
                <p style={{ whiteSpace: 'pre-wrap' }}>{problem.description}</p>
              </div>

              {/* Examples */}
              {problem.examples && problem.examples.length > 0 && (
                <div className="problem-section">
                  <h3>📝 Examples</h3>
                  {problem.examples.map((example, idx) => (
                    <div key={idx} className="example-box">
                      <div><strong>Input:</strong> {example.input}</div>
                      <div><strong>Output:</strong> {example.output}</div>
                      {example.explanation && (
                        <div><strong>Explanation:</strong> {example.explanation}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Test Cases (Public Only) */}
              {problem.testCases && problem.testCases.filter(tc => !tc.isHidden).length > 0 && (
                <div className="problem-section">
                  <h3>🧪 Test Cases</h3>
                  {problem.testCases
                    .filter(tc => !tc.isHidden)
                    .map((testCase, idx) => (
                      <div key={idx} className="example-box">
                        <div><strong>Input:</strong> {testCase.input}</div>
                        <div><strong>Expected Output:</strong> {testCase.expectedOutput}</div>
                        {testCase.explanation && (
                          <div><strong>Explanation:</strong> {testCase.explanation}</div>
                        )}
                      </div>
                    ))}
                </div>
              )}

              {/* Constraints */}
              {problem.constraints && problem.constraints.length > 0 && (
                <div className="problem-section">
                  <h3>⚠️ Constraints</h3>
                  <ul className="constraints-list">
                    {problem.constraints.map((constraint, idx) => (
                      <li key={idx}>{constraint}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Hints */}
              {problem.hints && problem.hints.length > 0 && (
                <div className="problem-section">
                  <h3>💡 Hints</h3>
                  <ul className="hints-list">
                    {problem.hints.map((hint, idx) => (
                      <li key={idx}>{hint}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* SUBMISSIONS TAB */}
          {activeDescriptionTab === 'submissions' && (
            <div className="tab-content submissions-content">
              {results && (
                <div className={`submission-result ${results.success ? 'accepted' : 'rejected'}`}>
                  <div className="submission-header">
                    <div className="submission-status">
                      {results.success ? (
                        <>
                          <div className="status-icon success">✓</div>
                          <div>
                            <h4>Accepted</h4>
                            <p>Your solution passed all test cases!</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="status-icon failed">✗</div>
                          <div>
                            <h4>Not Accepted</h4>
                            <p>{results.message || 'Some test cases failed'}</p>
                          </div>
                        </>
                      )}
                    </div>
                    {results.executionTime && (
                      <div className="submission-metrics">
                        <div className="metric">
                          <span className="metric-label">Runtime:</span>
                          <span className="metric-value">{results.executionTime}ms</span>
                        </div>
                        {results.memoryUsage && (
                          <div className="metric">
                            <span className="metric-label">Memory:</span>
                            <span className="metric-value">{results.memoryUsage}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Test Results */}
                  {results.testResults && results.testResults.length > 0 && (
                    <div className="test-results-section">
                      <div className="test-summary">
                        <span className="test-count">
                          {results.passedTests}/{results.totalTests} test cases passed
                        </span>
                      </div>
                      <div className="test-results-list">
                        {results.testResults.map((test, idx) => (
                          <div
                            key={idx}
                            className={`test-case-result ${test.passed ? 'passed' : 'failed'}`}
                          >
                            <div className="test-case-header">
                              <span>Test Case {idx + 1}</span>
                              <span>{test.passed ? '✓ Passed' : '✗ Failed'}</span>
                            </div>
                            <div className="test-case-details">
                              <div className="detail-row">
                                <strong>Input:</strong>
                                <pre>{test.input}</pre>
                              </div>
                              <div className="detail-row">
                                <strong>Expected:</strong>
                                <pre>{test.expectedOutput}</pre>
                              </div>
                              <div className="detail-row">
                                <strong>Your Output:</strong>
                                <pre>{test.actualOutput || 'N/A'}</pre>
                              </div>
                              {test.error && (
                                <div className="detail-row error">
                                  <strong>Error:</strong>
                                  <pre>{test.error}</pre>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {submissionHistory.length > 0 && !results && (
                <div className="submission-history">
                  <h4>Recent Submissions</h4>
                  {submissionHistory.map((sub, idx) => (
                    <div key={idx} className={`history-item ${sub.success ? 'accepted' : 'rejected'}`}>
                      <span className="history-status">{sub.success ? '✓ Accepted' : '✗ Failed'}</span>
                      <span className="history-language">{sub.language}</span>
                      <span className="history-time">
                        {new Date(sub.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {!results && submissionHistory.length === 0 && (
                <div className="empty-submissions">
                  <div className="empty-icon">📨</div>
                  <p>No submissions yet</p>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Submit your solution to see results here
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* OLD SUBMISSION HISTORY (keep for reference) */}
        {problem.userSubmissions && problem.userSubmissions.length > 0 && false && (
          <div className="problem-section">
            <h3>📊 Your Submissions</h3>
            <div style={{ fontSize: '0.9rem' }}>
              {problem.userSubmissions.slice(0, 5).map((sub, idx) => (
                <div key={idx} style={{ padding: '0.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>
                    <span className={`difficulty-badge ${sub.status === 'accepted' ? 'Easy' : 'Hard'}`} style={{ fontSize: '0.7rem' }}>
                      {sub.status}
                    </span>
                    <span style={{ marginLeft: '0.5rem', color: 'var(--text-secondary)' }}>
                      {sub.language}
                    </span>
                  </span>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    {new Date(sub.submittedAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Panel - Code Editor */}
      <div className="code-editor-panel">
        {/* Code Header with Run/Submit Buttons (Left Side) */}
        <div className="code-header">
          <div className="code-header-left">
            <button
              className="btn-run-header"
              onClick={handleRun}
              disabled={running || submitting || !code.trim()}
            >
              {running ? (
                <>
                  <span className="loading-spinner"></span> Running...
                </>
              ) : (
                <>▶ Run</>
              )}
            </button>
            <button
              className="btn-submit-header"
              onClick={handleSubmit}
              disabled={running || submitting || !code.trim()}
            >
              {submitting ? (
                <>
                  <span className="loading-spinner"></span> Submitting...
                </>
              ) : (
                <>Submit</>
              )}
            </button>
          </div>

          <div className="code-header-actions">
            <button 
              className="icon-btn" 
              title={isTestCasesCollapsed ? "Show Test Cases" : "Hide Test Cases"}
              onClick={() => setIsTestCasesCollapsed(!isTestCasesCollapsed)}
            >
              <span>{isTestCasesCollapsed ? '∨' : '∧'}</span>
            </button>
          </div>
        </div>

        {/* Language Selector Row */}
        <div className="editor-toolbar">
          <div className="language-dropdown-container">
            <select 
              className="language-dropdown"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              {Object.entries(languageMap).map(([lang, { label }]) => (
                <option 
                  key={lang} 
                  value={lang}
                  disabled={problem.supportedLanguages && !problem.supportedLanguages.includes(lang)}
                >
                  {label}
                </option>
              ))}
            </select>
            <span className="auto-indicator">🔒 Auto</span>
          </div>

          <div className="editor-toolbar-icons">
            <button className="icon-btn" title="Menu" onClick={() => alert('Menu coming soon!')}>☰</button>
            <button className="icon-btn" title="Bookmark Problem" onClick={() => alert('Bookmark feature coming soon!')}>🔖</button>
            <button className="icon-btn" title="Settings" onClick={handleSettings}>⚙</button>
            <button className="icon-btn" title="Reset Code" onClick={handleResetCode}>↶</button>
          </div>
        </div>

        {/* Monaco Editor */}
        <div className="monaco-editor-container">
          <Editor
            height="100%"
            language={languageMap[language].monacoLang}
            value={code}
            onChange={(value) => setCode(value || '')}
            theme={
              document.documentElement.getAttribute('data-theme') === 'dark'
                ? 'vs-dark'
                : 'light'
            }
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              wordWrap: 'on'
            }}
          />
        </div>

        {/* Public Test Cases Section */}
        {problem.testCases && problem.testCases.filter(tc => !tc.isHidden).length > 0 && !isTestCasesCollapsed && (
          <div className="test-cases-container">
            <div className="test-cases-tabs">
              {problem.testCases
                .filter(tc => !tc.isHidden)
                .map((testCase, idx) => (
                  <button
                    key={idx}
                    className={`test-case-tab ${activeTestCaseTab === idx ? 'active' : ''}`}
                    onClick={() => setActiveTestCaseTab(idx)}
                  >
                    Test Case {idx + 1}
                  </button>
                ))}
            </div>

            <div className="test-case-content">
              {!runResults ? (
                // Before running code
                <>
                  <div className="test-case-row">
                    <strong>🧪 Input:</strong>
                    <pre>{problem.testCases.filter(tc => !tc.isHidden)[activeTestCaseTab]?.input || 'N/A'}</pre>
                  </div>
                  <div className="test-case-row">
                    <strong>Expected Output:</strong>
                    <pre>{problem.testCases.filter(tc => !tc.isHidden)[activeTestCaseTab]?.expectedOutput || 'N/A'}</pre>
                  </div>
                </>
              ) : (
                // After running code
                <>
                  <div className="test-case-row">
                    <strong>🧪 Input:</strong>
                    <pre>{runResults.testResults?.[activeTestCaseTab]?.input || 'N/A'}</pre>
                  </div>
                  <div className="test-case-row">
                    <strong>Expected Output:</strong>
                    <pre>{runResults.testResults?.[activeTestCaseTab]?.expectedOutput || 'N/A'}</pre>
                  </div>
                  <div className="test-case-row">
                    <strong>Your Output:</strong>
                    <pre className={runResults.testResults?.[activeTestCaseTab]?.passed ? 'output-passed' : 'output-failed'}>
                      {runResults.testResults?.[activeTestCaseTab]?.actualOutput || 'No output'}{' '}
                      {runResults.testResults?.[activeTestCaseTab]?.passed ? '✅ (Passed)' : '❌ (Failed)'}
                    </pre>
                  </div>
                  {runResults.testResults?.[activeTestCaseTab]?.error && (
                    <div className="test-case-row error-row">
                      <strong>Error:</strong>
                      <pre>{runResults.testResults[activeTestCaseTab].error}</pre>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProblemDetail;
