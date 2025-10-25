import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import './Practice.css';

const CodeEditorPractice = () => {
  const [code, setCode] = useState('// Start coding here...\n\nfunction example() {\n  console.log("Hello, World!");\n}\n\nexample();');
  const [language, setLanguage] = useState('javascript');
  const [customInput, setCustomInput] = useState('');
  const [output, setOutput] = useState(null);
  const [running, setRunning] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiFeedback, setAiFeedback] = useState(null);

  const languageMap = {
    javascript: { label: 'JavaScript', monacoLang: 'javascript' },
    python: { label: 'Python', monacoLang: 'python' },
    java: { label: 'Java', monacoLang: 'java' },
    cpp: { label: 'C++', monacoLang: 'cpp' }
  };

  const handleRun = async () => {
    setRunning(true);
    setOutput(null);
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
          testInput: customInput
        })
      });

      const data = await res.json();
      setOutput(data);
    } catch (error) {
      console.error('Error running code:', error);
      setOutput({ success: false, error: 'Failed to execute code' });
    } finally {
      setRunning(false);
    }
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setAiFeedback(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/practice/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ code })
      });

      const data = await res.json();
      setAiFeedback(data);
    } catch (error) {
      console.error('Error analyzing code:', error);
      setAiFeedback({ error: 'Failed to analyze code' });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="editor-practice-container">
      <div className="editor-practice-header">
        <h1>💻 Code Editor Practice</h1>
        <p>Write, run, and analyze code with AI-powered feedback</p>
      </div>

      <div className="editor-practice-main">
        {/* Left: Editor Section */}
        <div className="editor-section">
          {/* Editor Controls */}
          <div className="editor-controls">
            <div className="language-selector">
              {Object.entries(languageMap).map(([lang, { label }]) => (
                <button
                  key={lang}
                  className={`language-tab ${language === lang ? 'active' : ''}`}
                  onClick={() => setLanguage(lang)}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="editor-actions">
              <button
                className="btn-run"
                onClick={handleRun}
                disabled={running || !code.trim()}
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
                className="btn-submit"
                onClick={handleAnalyze}
                disabled={analyzing || !code.trim()}
                style={{ background: '#8b5cf6' }}
              >
                {analyzing ? (
                  <>
                    <span className="loading-spinner"></span> Analyzing...
                  </>
                ) : (
                  <>🤖 Analyze</>
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

          {/* Custom Input (optional) */}
          <div style={{ background: 'var(--card-bg)', borderRadius: '12px', padding: '1rem' }}>
            <label style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>
              Custom Input (optional)
            </label>
            <textarea
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Enter custom input for your program..."
              style={{
                width: '100%',
                minHeight: '80px',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '2px solid var(--border-color)',
                background: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                fontFamily: 'Consolas, Monaco, monospace',
                fontSize: '0.9rem',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Output */}
          {output && (
            <div className="results-panel">
              <h3 className={output.success ? 'result-success' : 'result-error'}>
                {output.success ? '✅ Success' : '❌ Error'}
              </h3>
              
              {output.output && (
                <div className="test-case-result passed">
                  <div className="test-case-header">Output</div>
                  <div className="test-case-details">
                    <pre>{output.output}</pre>
                  </div>
                </div>
              )}

              {output.error && (
                <div className="test-case-result failed">
                  <div className="test-case-header">Error</div>
                  <div className="test-case-details">
                    <pre>{output.error}</pre>
                  </div>
                </div>
              )}

              {output.executionTime && (
                <div style={{ marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  ⏱️ Execution time: {output.executionTime}ms
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: AI Feedback Panel */}
        <div>
          <div className="ai-feedback-panel">
            <h3>🤖 AI Analysis</h3>
            
            {!aiFeedback ? (
              <div className="feedback-content" style={{ textAlign: 'center', padding: '2rem' }}>
                <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🧠</p>
                <p>Click "Analyze" to get AI-powered feedback on your code's performance, complexity, and improvements.</p>
              </div>
            ) : aiFeedback.error ? (
              <div className="feedback-content">
                <p style={{ color: '#ef4444' }}>{aiFeedback.error}</p>
              </div>
            ) : (
              <div className="feedback-content">
                {/* Complexity */}
                {aiFeedback.timeComplexity && aiFeedback.spaceComplexity && (
                  <div className="complexity-badges">
                    <div className="complexity-badge">
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Time</div>
                      <div style={{ color: '#10b981' }}>{aiFeedback.timeComplexity}</div>
                    </div>
                    <div className="complexity-badge">
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Space</div>
                      <div style={{ color: '#3b82f6' }}>{aiFeedback.spaceComplexity}</div>
                    </div>
                  </div>
                )}

                {/* Explanation */}
                {aiFeedback.explanation && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>📊 Analysis</h4>
                    <p style={{ lineHeight: '1.8' }}>{aiFeedback.explanation}</p>
                  </div>
                )}

                {/* Suggestions */}
                {aiFeedback.suggestions && aiFeedback.suggestions.length > 0 && (
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>💡 Suggestions</h4>
                    <ul className="suggestions-list">
                      {aiFeedback.suggestions.map((suggestion, idx) => (
                        <li key={idx}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link 
              to="/practice/problems" 
              className="btn-submit" 
              style={{ textDecoration: 'none', textAlign: 'center', padding: '0.75rem' }}
            >
              📚 Browse Practice Problems
            </Link>
            <Link 
              to="/practice/dashboard" 
              className="btn-run" 
              style={{ textDecoration: 'none', textAlign: 'center', padding: '0.75rem', background: '#667eea', color: 'white' }}
            >
              📊 View My Progress
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditorPractice;
