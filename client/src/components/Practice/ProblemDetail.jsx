import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import './Practice.css';

const ProblemDetail = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState(null);

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
    setResults(null);
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
      setResults(data);
    } catch (error) {
      console.error('Error running code:', error);
      setResults({ success: false, error: 'Failed to run code' });
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
        <div className="problem-title-header">
          <h1>{problem.title}</h1>
          {problem.isSolved && (
            <span className="solved-check" title="Solved" style={{ fontSize: '2rem' }}>✓</span>
          )}
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

        {/* Submission History */}
        {problem.userSubmissions && problem.userSubmissions.length > 0 && (
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
        {/* Editor Controls */}
        <div className="editor-controls">
          <div className="language-selector">
            {Object.entries(languageMap).map(([lang, { label }]) => (
              <button
                key={lang}
                className={`language-tab ${language === lang ? 'active' : ''}`}
                onClick={() => setLanguage(lang)}
                disabled={problem.supportedLanguages && !problem.supportedLanguages.includes(lang)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="editor-actions">
            <button
              className="btn-run"
              onClick={handleRun}
              disabled={running || submitting || !code.trim()}
            >
              {running ? (
                <>
                  <span className="loading-spinner"></span> Running...
                </>
              ) : (
                <>▶ Run Code</>
              )}
            </button>
            <button
              className="btn-submit"
              onClick={handleSubmit}
              disabled={running || submitting || !code.trim()}
            >
              {submitting ? (
                <>
                  <span className="loading-spinner"></span> Submitting...
                </>
              ) : (
                <>✓ Submit</>
              )}
            </button>
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

        {/* Results Panel */}
        {results && (
          <div className="results-panel">
            <h3 className={results.success ? 'result-success' : 'result-error'}>
              {results.success ? '✅ Success!' : '❌ Failed'}
            </h3>
            
            <p style={{ marginBottom: '1rem', fontWeight: 600 }}>
              {results.message || (results.success ? 'All test cases passed!' : 'Some test cases failed')}
            </p>

            {results.testResults && results.testResults.length > 0 && (
              <div>
                <div style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                  {results.passedTests}/{results.totalTests} test cases passed
                </div>
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
                      <div><strong>Input:</strong></div>
                      <pre>{test.input}</pre>
                      <div><strong>Expected:</strong></div>
                      <pre>{test.expectedOutput}</pre>
                      <div><strong>Your Output:</strong></div>
                      <pre>{test.actualOutput || 'N/A'}</pre>
                      {test.error && (
                        <>
                          <div><strong>Error:</strong></div>
                          <pre style={{ color: '#ef4444' }}>{test.error}</pre>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {results.output && !results.testResults && (
              <div className="test-case-result passed">
                <div className="test-case-header">Output</div>
                <div className="test-case-details">
                  <pre>{results.output}</pre>
                </div>
              </div>
            )}

            {results.error && !results.testResults && (
              <div className="test-case-result failed">
                <div className="test-case-header">Error</div>
                <div className="test-case-details">
                  <pre>{results.error}</pre>
                </div>
              </div>
            )}

            {results.executionTime && (
              <div style={{ marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                ⏱️ Execution time: {results.executionTime}ms
              </div>
            )}
          </div>
        )}

        {/* Back Link */}
        <Link to="/practice/problems" style={{ display: 'inline-block', marginTop: '1rem', color: '#667eea', textDecoration: 'none', fontWeight: 600 }}>
          ← Back to Problems
        </Link>
      </div>
    </div>
  );
};

export default ProblemDetail;
