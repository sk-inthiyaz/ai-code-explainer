import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { 
  FaPlay, 
  FaCode, 
  FaLightbulb, 
  FaMagic, 
  FaSave, 
  FaDownload, 
  FaShareAlt,
  FaCog,
  FaExpand,
  FaCompress,
  FaRocket,
  FaBrain,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle
} from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';
import './PracticeCodeEditor.css';
import { analyzeCode } from './services/aiService';

const PracticeCodeEditor = () => {
  const [code, setCode] = useState(`// Welcome to the AI-Powered Code Practice Arena!
// Write and test your code with real-time AI feedback

function fibonacci(n) {
  // Your code here
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`);
  
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('practiceLanguage') || 'javascript';
  });
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('practiceTheme') || 'vs-dark';
  });
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [performanceMetrics, setPerformanceMetrics] = useState(null);
  const editorRef = useRef(null);

  const languages = [
    { id: 'javascript', name: 'JavaScript', icon: '🟨' },
    { id: 'python', name: 'Python', icon: '🐍' },
    { id: 'java', name: 'Java', icon: '☕' },
    { id: 'cpp', name: 'C++', icon: '⚡' },
    { id: 'typescript', name: 'TypeScript', icon: '🔷' },
    { id: 'go', name: 'Go', icon: '🐹' },
    { id: 'rust', name: 'Rust', icon: '🦀' },
    { id: 'csharp', name: 'C#', icon: '🔵' }
  ];

  const themes = [
    { id: 'vs-dark', name: 'Dark Theme', icon: '🌙' },
    { id: 'light', name: 'Light Theme', icon: '☀️' },
    { id: 'hc-black', name: 'High Contrast', icon: '⚫' }
  ];

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('practiceLanguage', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('practiceTheme', theme);
  }, [theme]);

  // Load saved code on component mount
  useEffect(() => {
    const savedCode = localStorage.getItem('practiceCode');
    if (savedCode) {
      try {
        const codeData = JSON.parse(savedCode);
        setCode(codeData.code);
        if (codeData.language) {
          setLanguage(codeData.language);
        }
      } catch (error) {
        console.error('Error loading saved code:', error);
      }
    }
  }, []);

  // Language-specific code templates
  const getLanguageTemplate = (lang) => {
    const templates = {
      javascript: `// Welcome to the AI-Powered Code Practice Arena!
// Write and test your code with real-time AI feedback

function fibonacci(n) {
  // Your code here
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`,
      
      python: `# Welcome to the AI-Powered Code Practice Arena!
# Write and test your code with real-time AI feedback

def fibonacci(n):
    """Calculate the nth Fibonacci number"""
    # Your code here
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

print(fibonacci(10))`,
      
      java: `// Welcome to the AI-Powered Code Practice Arena!
// Write and test your code with real-time AI feedback

public class Main {
    public static int fibonacci(int n) {
        // Your code here
        if (n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
    
    public static void main(String[] args) {
        System.out.println(fibonacci(10));
    }
}`,
      
      cpp: `// Welcome to the AI-Powered Code Practice Arena!
// Write and test your code with real-time AI feedback

#include <iostream>
using namespace std;

int fibonacci(int n) {
    // Your code here
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

int main() {
    cout << fibonacci(10) << endl;
    return 0;
}`,
      
      python: `# Welcome to the AI-Powered Code Practice Arena!
# Write and test your code with real-time AI feedback

def fibonacci(n: int) -> int:
    """Calculate the nth Fibonacci number"""
    # Your code here
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

print(fibonacci(10))`
    };
    
    return templates[lang] || templates.javascript;
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    // Only change code template if current code is empty or default
    const currentCode = editorRef.current?.getValue() || code;
    const isDefaultCode = currentCode.includes('Welcome to the AI-Powered Code Practice Arena');
    
    if (isDefaultCode || currentCode.trim() === '') {
      setCode(getLanguageTemplate(newLanguage));
    }
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // Configure editor for better experience
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      handleRunCode();
    });
    
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyA, () => {
      handleAnalyzeCode();
    });
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput('');
    
    try {
      const currentCode = editorRef.current.getValue();
      
      // Simulate code execution with loading
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock execution results
      const executionResult = {
        success: true,
        output: 'Code executed successfully!\n55\nExecution completed in 0.045ms',
        warnings: [],
        errors: []
      };

      setOutput(executionResult.output);
      
      // Generate performance metrics
      setPerformanceMetrics({
        executionTime: '0.045ms',
        memoryUsage: '2.3MB',
        cycleComplexity: 'O(2^n)',
        linesOfCode: currentCode.split('\n').length
      });

    } catch (error) {
      setOutput(`❌ Error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleAnalyzeCode = async () => {
    setIsAnalyzing(true);
    
    try {
      const currentCode = editorRef.current.getValue();
      
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockAnalysis = {
        timeComplexity: 'O(2^n) - Exponential',
        spaceComplexity: 'O(n) - Linear due to recursion stack',
        codeQuality: 'Good',
        optimizationScore: 65,
        suggestions: [
          'Consider using dynamic programming to optimize the fibonacci function',
          'Add input validation to handle negative numbers',
          'Consider using iterative approach for better performance'
        ],
        explanation: 'This is a classic recursive implementation of the Fibonacci sequence. While correct, it has exponential time complexity due to repeated calculations.',
        improvements: [
          'Use memoization to cache results',
          'Implement iterative solution',
          'Add error handling'
        ]
      };
      
      setAnalysis(mockAnalysis);
      
      // Generate AI suggestions
      setAiSuggestions([
        {
          type: 'optimization',
          title: 'Performance Improvement',
          description: 'Use memoization to reduce time complexity from O(2^n) to O(n)',
          priority: 'high'
        },
        {
          type: 'best-practice',
          title: 'Code Quality',
          description: 'Add input validation and error handling',
          priority: 'medium'
        },
        {
          type: 'feature',
          title: 'Enhancement',
          description: 'Consider adding unit tests for better reliability',
          priority: 'low'
        }
      ]);
      
    } catch (error) {
      setAnalysis({
        error: 'Failed to analyze code. Please try again.'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveCode = () => {
    const codeData = {
      code: editorRef.current.getValue(),
      language,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('practiceCode', JSON.stringify(codeData));
    // Show success notification (you can implement a toast here)
    alert('Code saved successfully!');
  };

  const handleDownloadCode = () => {
    const currentCode = editorRef.current.getValue();
    const blob = new Blob([currentCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${language === 'javascript' ? 'js' : language}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShareCode = () => {
    const currentCode = editorRef.current.getValue();
    navigator.clipboard.writeText(currentCode);
    alert('Code copied to clipboard!');
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const getSuggestionIcon = (type) => {
    switch (type) {
      case 'optimization': return <FaRocket className="text-orange-500" />;
      case 'best-practice': return <FaCheckCircle className="text-green-500" />;
      case 'feature': return <FaLightbulb className="text-blue-500" />;
      default: return <FaInfoCircle className="text-gray-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-blue-500 bg-blue-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  return (
    <div className={`practice-code-editor ${isFullscreen ? 'fullscreen' : ''}`}>
      {/* Header */}
      <div className="editor-header">
        <div className="header-title">
          <HiSparkles className="text-2xl text-purple-500" />
          <h1>AI Code Practice Arena</h1>
          <span className="subtitle">Write and test your code with real-time AI feedback</span>
        </div>
        
        <div className="header-actions">
          <button 
            className="action-btn settings-btn"
            onClick={() => setShowSettings(!showSettings)}
          >
            <FaCog />
          </button>
          <button 
            className="action-btn fullscreen-btn"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? <FaCompress /> : <FaExpand />}
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="settings-panel">
          <div className="settings-section">
            <label>Language:</label>
            <select 
              value={language} 
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="settings-select"
            >
              {languages.map(lang => (
                <option key={lang.id} value={lang.id}>
                  {lang.icon} {lang.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="settings-section">
            <label>Theme:</label>
            <select 
              value={theme} 
              onChange={(e) => setTheme(e.target.value)}
              className="settings-select"
            >
              {themes.map(t => (
                <option key={t.id} value={t.id}>
                  {t.icon} {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="editor-content">
        {/* Left Panel - Editor */}
        <div className="editor-panel">
          <div className="editor-toolbar">
            <div className="toolbar-left">
              <span className="file-indicator">
                📄 main.{language === 'javascript' ? 'js' : language}
              </span>
              <select 
                value={language} 
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="language-selector"
                title="Select Programming Language"
              >
                {languages.map(lang => (
                  <option key={lang.id} value={lang.id}>
                    {lang.icon} {lang.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="toolbar-right">
              <button 
                className="toolbar-btn save-btn"
                onClick={handleSaveCode}
                title="Save Code (Ctrl+S)"
              >
                <FaSave />
              </button>
              <button 
                className="toolbar-btn download-btn"
                onClick={handleDownloadCode}
                title="Download Code"
              >
                <FaDownload />
              </button>
              <button 
                className="toolbar-btn share-btn"
                onClick={handleShareCode}
                title="Share Code"
              >
                <FaShareAlt />
              </button>
            </div>
          </div>

          <div className="editor-wrapper">
            <Editor
              height="100%"
              defaultLanguage="javascript"
              language={language}
              theme={theme}
              value={code}
              onChange={(value) => setCode(value)}
              onMount={handleEditorDidMount}
              options={{
                fontSize: 14,
                fontFamily: 'Fira Code, Monaco, Consolas, monospace',
                fontLigatures: true,
                minimap: { enabled: true },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                lineNumbers: 'on',
                folding: true,
                bracketPairColorization: { enabled: true },
                formatOnType: true,
                formatOnPaste: true,
                tabSize: 2,
                wordWrap: 'on',
                smoothScrolling: true,
                cursorBlinking: 'smooth',
                renderLineHighlight: 'all',
                roundedSelection: false,
                suggest: {
                  showWords: false
                }
              }}
            />
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button 
              className="primary-btn run-btn"
              onClick={handleRunCode}
              disabled={isRunning}
            >
              <FaPlay />
              {isRunning ? 'Running...' : 'Run Code'}
              <span className="shortcut">Ctrl+Enter</span>
            </button>
            
            <button 
              className="secondary-btn analyze-btn"
              onClick={handleAnalyzeCode}
              disabled={isAnalyzing}
            >
              <FaBrain />
              {isAnalyzing ? 'Analyzing...' : 'AI Analysis'}
              <span className="shortcut">Ctrl+Shift+A</span>
            </button>
          </div>
        </div>

        {/* Right Panel - Output & Analysis */}
        <div className="results-panel">
          {/* Output Section */}
          <div className="output-section">
            <div className="section-header">
              <FaCode className="section-icon" />
              <h3>Output</h3>
              {performanceMetrics && (
                <div className="performance-indicator">
                  ⚡ {performanceMetrics.executionTime}
                </div>
              )}
            </div>
            
            <div className="output-content">
              {isRunning ? (
                <div className="loading-output">
                  <div className="loading-spinner"></div>
                  <span>Executing code...</span>
                </div>
              ) : (
                <pre className="output-text">
                  {output || 'Click "Run Code" to see output'}
                </pre>
              )}
            </div>

            {/* Performance Metrics */}
            {performanceMetrics && (
              <div className="performance-metrics">
                <div className="metric">
                  <span>Time:</span> {performanceMetrics.executionTime}
                </div>
                <div className="metric">
                  <span>Memory:</span> {performanceMetrics.memoryUsage}
                </div>
                <div className="metric">
                  <span>Lines:</span> {performanceMetrics.linesOfCode}
                </div>
              </div>
            )}
          </div>

          {/* AI Analysis Section */}
          {analysis && (
            <div className="analysis-section">
              <div className="section-header">
                <FaBrain className="section-icon" />
                <h3>AI Analysis</h3>
                <div className="analysis-score">
                  Score: {analysis.optimizationScore || 'N/A'}/100
                </div>
              </div>

              {analysis.error ? (
                <div className="analysis-error">
                  <FaExclamationTriangle />
                  {analysis.error}
                </div>
              ) : (
                <div className="analysis-content">
                  <div className="complexity-info">
                    <div className="complexity-item">
                      <label>Time Complexity:</label>
                      <span className="complexity-value">{analysis.timeComplexity}</span>
                    </div>
                    <div className="complexity-item">
                      <label>Space Complexity:</label>
                      <span className="complexity-value">{analysis.spaceComplexity}</span>
                    </div>
                  </div>

                  {analysis.explanation && (
                    <div className="explanation">
                      <h4>🔍 Code Explanation</h4>
                      <p>{analysis.explanation}</p>
                    </div>
                  )}

                  {analysis.suggestions && analysis.suggestions.length > 0 && (
                    <div className="suggestions">
                      <h4>💡 Optimization Suggestions</h4>
                      <ul>
                        {analysis.suggestions.map((suggestion, index) => (
                          <li key={index}>{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* AI Suggestions Section */}
          {aiSuggestions.length > 0 && (
            <div className="ai-suggestions-section">
              <div className="section-header">
                <HiSparkles className="section-icon" />
                <h3>Smart Suggestions</h3>
              </div>
              
              <div className="suggestions-list">
                {aiSuggestions.map((suggestion, index) => (
                  <div 
                    key={index} 
                    className={`suggestion-card ${getPriorityColor(suggestion.priority)}`}
                  >
                    <div className="suggestion-header">
                      {getSuggestionIcon(suggestion.type)}
                      <span className="suggestion-title">{suggestion.title}</span>
                      <span className={`priority-badge priority-${suggestion.priority}`}>
                        {suggestion.priority}
                      </span>
                    </div>
                    <p className="suggestion-description">{suggestion.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="editor-footer">
        <div className="footer-info">
          <span>🚀 Powered by AI</span>
          <span>•</span>
          <span>Real-time feedback</span>
          <span>•</span>
          <span>Smart suggestions</span>
        </div>
        
        <div className="footer-stats">
          <span>Language: {languages.find(l => l.id === language)?.name}</span>
          <span>•</span>
          <span>Theme: {themes.find(t => t.id === theme)?.name}</span>
        </div>
      </div>
    </div>
  );
};

export default PracticeCodeEditor;
