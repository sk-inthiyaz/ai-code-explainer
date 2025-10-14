import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { FaPlay, FaCode, FaLightbulb, FaMagic } from 'react-icons/fa';
import './CodeEditor.css';
import { analyzeCode } from './services/aiService';

const CodeEditor = () => {
  const [code, setCode] = useState('// Write your code here...');
  const [language, setLanguage] = useState('javascript');
  const [theme, setTheme] = useState('vs-dark');
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const editorRef = useRef(null);

  const languages = [
    { id: 'javascript', name: 'JavaScript' },
    { id: 'python', name: 'Python' },
    { id: 'java', name: 'Java' },
    { id: 'cpp', name: 'C++' }
  ];

  const themes = [
    { id: 'vs-dark', name: 'Dark' },
    { id: 'light', name: 'Light' },
    { id: 'hc-black', name: 'High Contrast' }
  ];

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    try {
      // For now, we'll just simulate code execution
      const currentCode = editorRef.current.getValue();
      setOutput('Code execution feature coming soon...');

      // In the future, implement actual code execution here
      // You could send the code to a backend service that runs it in a sandbox

    } catch (error) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleAnalyzeCode = async () => {
    setIsAnalyzing(true);
    try {
      const currentCode = editorRef.current.getValue();
      const result = await analyzeCode(currentCode);
      setAnalysis(result);
    } catch (error) {
      setAnalysis({
        error: 'Failed to analyze code. Please try again.'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="code-editor-container">
      <div className="editor-toolbar">
        <div className="toolbar-section">
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            className="select-input"
          >
            {languages.map(lang => (
              <option key={lang.id} value={lang.id}>{lang.name}</option>
            ))}
          </select>
          <select 
            value={theme} 
            onChange={(e) => setTheme(e.target.value)}
            className="select-input"
          >
            {themes.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
        <div className="toolbar-section">
          <button 
            className="toolbar-button run-button"
            onClick={handleRunCode}
            disabled={isRunning}
          >
            <FaPlay /> Run Code
          </button>
          <button 
            className="toolbar-button analyze-button"
            onClick={handleAnalyzeCode}
            disabled={isAnalyzing}
          >
            <FaMagic /> Analyze Code
          </button>
        </div>
      </div>

      <div className="editor-main">
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
              minimap: { enabled: true },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              lineNumbers: 'on',
              folding: true,
              bracketPairColorization: true,
              formatOnType: true,
              formatOnPaste: true,
              tabSize: 2,
            }}
          />
        </div>

        <div className="output-panel">
          <div className="output-section">
            <h3><FaCode /> Output</h3>
            <pre className="output-content">
              {isRunning ? 'Running code...' : output || 'No output yet'}
            </pre>
          </div>

          {analysis && (
            <div className="analysis-section">
              <h3><FaLightbulb /> Analysis</h3>
              <div className="analysis-content">
                {analysis.error ? (
                  <div className="analysis-error">{analysis.error}</div>
                ) : (
                  <>
                    <div className="analysis-item">
                      <strong>Time Complexity:</strong> {analysis.timeComplexity}
                    </div>
                    <div className="analysis-item">
                      <strong>Space Complexity:</strong> {analysis.spaceComplexity}
                    </div>
                    {analysis.suggestions && analysis.suggestions.length > 0 && (
                      <div className="analysis-item">
                        <strong>Suggestions:</strong>
                        <ul>
                          {analysis.suggestions.map((suggestion, index) => (
                            <li key={index}>{suggestion}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {analysis.explanation && (
                      <div className="analysis-item">
                        <strong>Explanation:</strong>
                        <p>{analysis.explanation}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
