import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import './CodeEditorPractice.css';
import backArrow from '../images/left-arrow (1).png';

const CodeEditorPractice = () => {
  const navigate = useNavigate();
  const defaultCode = {
    javascript: '// JavaScript Example\nfunction greet(name) {\n  console.log("Hello, " + name + "!");\n}\n\ngreet("World");',
    python: '# Python Example\ndef greet(name):\n    print(f"Hello, {name}!")\n\ngreet("World")',
    java: '// Java Example\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
    cpp: '// C++ Example\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}'
  };
  
  const [code, setCode] = useState(defaultCode.javascript);
  const [language, setLanguage] = useState('javascript');
  // STDIN captured from the terminal panel (replaces old custom input box)
  const [stdin, setStdin] = useState('');
  const [output, setOutput] = useState(null);
  const [running, setRunning] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiFeedback, setAiFeedback] = useState(null);
  const [codeHistory, setCodeHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [enlargeMode, setEnlargeMode] = useState('normal');
  const [terminalEnlarged, setTerminalEnlarged] = useState(false);
  const [aiEnlarged, setAiEnlarged] = useState(false);

  const languageMap = {
    javascript: { label: 'JavaScript', monacoLang: 'javascript' },
    python: { label: 'Python', monacoLang: 'python' },
    java: { label: 'Java', monacoLang: 'java' },
    cpp: { label: 'C++', monacoLang: 'cpp' }
  };

  useEffect(() => {
    const saved = localStorage.getItem('codeHistory');
    if (saved) {
      setCodeHistory(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (code.trim()) {
      const newEntry = {
        id: Date.now(),
        code,
        language,
        timestamp: new Date().toLocaleString()
      };
      setCodeHistory(prev => {
        const updated = [newEntry, ...prev].slice(0, 20);
        localStorage.setItem('codeHistory', JSON.stringify(updated));
        return updated;
      });
    }
  }, []);

  const handleDownload = () => {
    const extension = { javascript: 'js', python: 'py', java: 'java', cpp: 'cpp' }[language];
    const filename = `code_${Date.now()}.${extension}`;
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(code));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleRestoreFromHistory = (item) => {
    setCode(item.code);
    setLanguage(item.language);
    setShowHistory(false);
  };

  const handleClearCode = () => {
    if (window.confirm('Are you sure you want to clear all code and reset?')) {
      setCode(defaultCode[language]);
      setStdin('');
      setOutput(null);
      setAiFeedback(null);
    }
  };

  const handleLanguageChange = (newLang) => {
    // Ask user if they want to load the template for the new language
    const shouldLoadTemplate = window.confirm(
      `Switch to ${languageMap[newLang].label}?\n\nClick OK to load the ${languageMap[newLang].label} template.\nClick Cancel to keep your current code.`
    );
    
    setLanguage(newLang);
    
    if (shouldLoadTemplate) {
      setCode(defaultCode[newLang]);
      setOutput(null); // Clear output when switching
      setAiFeedback(null); // Clear AI feedback when switching
    }
  };

  const handleRun = async () => {
    setRunning(true);
    setOutput(null);
    try {
      const token = localStorage.getItem('token');
      
      console.log('[Frontend] Running code:', {
        language,
        codeLength: code.length,
        hasStdin: !!stdin
      });

      const res = await fetch('http://localhost:5000/api/practice/editor/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          code,
          language,
          testInput: stdin
        })
      });

      const data = await res.json();
      
      console.log('[Frontend] Response:', data);
      
      // Handle both response formats: string error or object error
      if (data.error && typeof data.error === 'object') {
        setOutput({
          success: data.success,
          output: data.output || '',
          error: data.error.errorMessage || data.error.fullError || JSON.stringify(data.error),
          executionTime: data.executionTime
        });
      } else {
        setOutput(data);
      }
    } catch (error) {
      console.error('[Frontend] Error running code:', error);
      setOutput({ 
        success: false, 
        error: 'Failed to execute code: ' + error.message 
      });
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

  if (enlargeMode === 'fullscreen') {
    return (
      <div className="editor-fullscreen-wrapper">
        <button 
          className="exit-fullscreen-btn"
          onClick={() => setEnlargeMode('normal')}
          title="Exit Fullscreen (Esc)"
        >
          ✕
        </button>

        <div className="fs-controls">
          <select 
            value={language} 
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="fs-language-select"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>
        </div>

        <div className="editor-toolbar">
          <button className="toolbar-icon" onClick={handleClearCode} title="Clear Code">🗑️</button>
          <button className="toolbar-icon" onClick={handleDownload} title="Download">💾</button>
          <button className="toolbar-icon" onClick={handleRun} disabled={running} title="Run">▶</button>
          <button className="toolbar-icon" onClick={handleAnalyze} disabled={analyzing} title="Analyze">🤖</button>
          <button className="toolbar-icon" onClick={() => setEnlargeMode('normal')} title="Exit Fullscreen">⛶</button>
        </div>

        <div className="fs-editor-container">
          <Editor
            height="100%"
            language={languageMap[language].monacoLang}
            value={code}
            onChange={(value) => setCode(value || '')}
            theme={document.documentElement.getAttribute('data-theme') === 'dark' ? 'vs-dark' : 'light'}
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
      </div>
    );
  }

  if (enlargeMode === 'editor') {
    return (
      <div className="editor-enlarge-overlay">
        <div className="editor-enlarge-modal">
          <button 
            className="modal-close-btn"
            onClick={() => setEnlargeMode('normal')}
            title="Close"
          >
            ✕
          </button>

          <div className="editor-toolbar">
            <select 
              value={language} 
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="toolbar-language-select"
            >
              <option value="javascript">JS</option>
              <option value="python">PY</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
            </select>
            <button className="toolbar-icon" onClick={handleClearCode} title="Clear Code">🗑️</button>
            <button className="toolbar-icon" onClick={handleDownload} title="Download">💾</button>
            <button className="toolbar-icon" onClick={handleRun} disabled={running} title="Run">▶</button>
            <button className="toolbar-icon" onClick={handleAnalyze} disabled={analyzing} title="Analyze">🤖</button>
          </div>

          <div className="enlarge-editor-container">
            <Editor
              height="100%"
              language={languageMap[language].monacoLang}
              value={code}
              onChange={(value) => setCode(value || '')}
              theme={document.documentElement.getAttribute('data-theme') === 'dark' ? 'vs-dark' : 'light'}
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
        </div>
      </div>
    );
  }

  // Terminal Enlarged Modal
  if (terminalEnlarged) {
    return (
      <div className="editor-enlarge-overlay">
        <div className="editor-enlarge-modal">
          <button 
            className="modal-close-btn"
            onClick={() => setTerminalEnlarged(false)}
            title="Close"
          >
            ✕
          </button>

          <div className="modal-header-bar">
            <h2>🖥️ Terminal Output</h2>
          </div>

          <div className="modal-content-terminal">
            <div className="stdin-row">
              <input
                className="stdin-input"
                value={stdin}
                onChange={(e) => setStdin(e.target.value)}
                placeholder="stdin (optional, e.g., '5\n10' for multiple lines)"
              />
            </div>

            {!output ? (
              <div className="feedback-empty">
                <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏱️</p>
                <p>Run your code to see output here</p>
              </div>
            ) : (
              <div className="terminal-content-full">
                <div className={`terminal-status ${output.success ? 'status-success' : 'status-error'}`}>
                  {output.success ? '✅ Execution Successful' : '❌ Execution Failed'}
                </div>
                
                {output.output && (
                  <div className="terminal-block">
                    <div className="terminal-label">Output:</div>
                    <pre className="terminal-pre">{output.output}</pre>
                  </div>
                )}

                {output.error && (
                  <div className="terminal-block error-block">
                    <div className="terminal-label">Error:</div>
                    <pre className="terminal-pre error-pre">{typeof output.error === 'string' ? output.error : JSON.stringify(output.error, null, 2)}</pre>
                  </div>
                )}

                {output.executionTime && (
                  <div className="terminal-footer">
                    ⏱️ Execution time: <span className="highlight-time">{output.executionTime}ms</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // AI Analysis Enlarged Modal
  if (aiEnlarged) {
    return (
      <div className="editor-enlarge-overlay">
        <div className="editor-enlarge-modal">
          <button 
            className="modal-close-btn"
            onClick={() => setAiEnlarged(false)}
            title="Close"
          >
            ✕
          </button>

          <div className="modal-header-bar">
            <h2>🤖 AI Analysis</h2>
          </div>

          <div className="modal-content-ai">
            {!aiFeedback ? (
              <div className="feedback-empty">
                <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🧠</p>
                <p>Click "Analyze" to get AI-powered feedback on your code's performance, complexity, and improvements.</p>
              </div>
            ) : aiFeedback.error ? (
              <div className="feedback-content">
                <p style={{ color: '#ef4444' }}>{aiFeedback.error}</p>
              </div>
            ) : (
              <div className="feedback-content">
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

                {aiFeedback.explanation && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>📊 Analysis</h4>
                    <p style={{ lineHeight: '1.8' }}>{aiFeedback.explanation}</p>
                  </div>
                )}

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
        </div>
      </div>
    );
  }

  return (
    <div className="editor-practice-container">
      <button className="back-btn-practice" onClick={() => navigate('/practice')}>
        <img src={backArrow} alt="Back" className="back-arrow-icon" />
      </button>
      
      <div className="editor-practice-main">
        <div className="editor-section">
          <div className="editor-top-controls">
            <select 
              value={language} 
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="top-language-select"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
            </select>

            <div className="editor-toolbar">
              <button className="toolbar-icon" onClick={handleClearCode} title="Clear Code">🗑️</button>
              <button className="toolbar-icon" onClick={handleDownload} title="Download">💾</button>
              
              <div className="toolbar-enlarge">
                <button className="toolbar-icon" title="Enlarge">⛶</button>
                <div className="enlarge-submenu">
                  <button 
                    className="submenu-item"
                    onClick={() => setEnlargeMode('editor')}
                  >
                    Editor Only
                  </button>
                  <button 
                    className="submenu-item"
                    onClick={() => setEnlargeMode('fullscreen')}
                  >
                    Fullscreen
                  </button>
                </div>
              </div>
            </div>
          </div>

          {showHistory && (
            <div className="history-panel">
              <div className="history-header">
                <h3>Code History</h3>
                <button className="close-btn" onClick={() => setShowHistory(false)}>✕</button>
              </div>
              <div className="history-list">
                {codeHistory.length > 0 ? (
                  codeHistory.map((item) => (
                    <div key={item.id} className="history-item">
                      <div className="history-meta">
                        <span className="history-lang">{languageMap[item.language].label}</span>
                        <span className="history-time">{item.timestamp}</span>
                      </div>
                      <div className="history-preview">{item.code.substring(0, 60)}...</div>
                      <button className="restore-btn" onClick={() => handleRestoreFromHistory(item)}>Restore</button>
                    </div>
                  ))
                ) : (
                  <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No history yet</p>
                )}
              </div>
            </div>
          )}

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

          {/* Removed legacy custom input box; STDIN input is in Terminal panel */}

          <div className="action-buttons-enhanced">
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

        {/* Right side: Terminal Output (top) + AI Analysis (bottom) */}
        <div className="right-panel-container">
          {/* Terminal Output Panel */}
          <div className="terminal-output-panel">
            <div className="terminal-header">
              <div className="terminal-title">🖥️ Terminal</div>
              <button 
                className="terminal-enlarge-btn" 
                onClick={() => setTerminalEnlarged(true)}
                title="Enlarge Terminal"
              >
                ⛶
              </button>
            </div>
            <div className="stdin-row">
              <input
                className="stdin-input"
                value={stdin}
                onChange={(e) => setStdin(e.target.value)}
                placeholder="stdin (optional, e.g., '5\n10' for multiple lines)"
              />
            </div>

            {!output ? (
              <div className="feedback-empty">
                <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏱️</p>
                <p>Run your code to see output here</p>
              </div>
            ) : (
              <div className="terminal-content">
                <div className={`terminal-status ${output.success ? 'status-success' : 'status-error'}`}>
                  {output.success ? '✅ Execution Successful' : '❌ Execution Failed'}
                </div>
                
                {output.output && (
                  <div className="terminal-block">
                    <div className="terminal-label">Output:</div>
                    <pre className="terminal-pre">{output.output}</pre>
                  </div>
                )}

                {output.error && (
                  <div className="terminal-block error-block">
                    <div className="terminal-label">Error:</div>
                    <pre className="terminal-pre error-pre">{typeof output.error === 'string' ? output.error : JSON.stringify(output.error, null, 2)}</pre>
                  </div>
                )}

                {output.executionTime && (
                  <div className="terminal-footer">
                    ⏱️ Execution time: <span className="highlight-time">{output.executionTime}ms</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* AI Analysis Panel */}
          <div className="ai-feedback-panel">
            <div className="ai-panel-header">
              <h3>🤖 AI Analysis</h3>
              <button 
                className="ai-enlarge-btn" 
                onClick={() => setAiEnlarged(true)}
                title="Enlarge AI Analysis"
              >
                ⛶
              </button>
            </div>
            
            {!aiFeedback ? (
              <div className="feedback-empty">
                <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🧠</p>
                <p>Click "Analyze" to get AI-powered feedback on your code's performance, complexity, and improvements.</p>
              </div>
            ) : aiFeedback.error ? (
              <div className="feedback-content">
                <p style={{ color: '#ef4444' }}>{aiFeedback.error}</p>
              </div>
            ) : (
              <div className="feedback-content">
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

                {aiFeedback.explanation && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>📊 Analysis</h4>
                    <p style={{ lineHeight: '1.8' }}>{aiFeedback.explanation}</p>
                  </div>
                )}

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
          <div className="quick-links">
            <Link to="/practice/problems" className="btn-submit link-btn">📚 Browse Practice Problems</Link>
            <Link to="/practice/dashboard" className="btn-run link-btn">📊 View My Progress</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditorPractice;
