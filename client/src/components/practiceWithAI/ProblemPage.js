import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { analyzeCode } from './services/aiService';
import { getProblem } from './data/problems';
import './ProblemPage.css';

const ProblemPage = ({ selectedTopic, selectedDifficulty, currentProblem }) => {
  const navigate = useNavigate();
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [showOptimization, setShowOptimization] = useState(false);

  useEffect(() => {
    if (!selectedTopic || !selectedDifficulty || !currentProblem || !currentProblem[currentProblemIndex]) {
      navigate('/learnhub/practice');
      return;
    }

    setCode(currentProblem[currentProblemIndex].starterCode || '// Write your code here');
    setAnalysis(null);
    setShowOptimization(false);
  }, [selectedTopic, selectedDifficulty, currentProblem, currentProblemIndex, navigate]);

  const handleCodeChange = (value) => {
    setCode(value);
  };

  const handleNext = () => {
    if (currentProblemIndex < currentProblem.length - 1) {
      setCurrentProblemIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentProblemIndex > 0) {
      setCurrentProblemIndex(prev => prev - 1);
    }
  };

  const evaluateCode = async (code, testCase) => {
    // Create a function from the code and test it
    try {
      const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
      const func = new AsyncFunction('return ' + code)();
      const result = await func(...testCase.input);
      
      // Check if arrays are equal for array results
      if (Array.isArray(result) && Array.isArray(testCase.expectedOutput)) {
        return JSON.stringify(result) === JSON.stringify(testCase.expectedOutput);
      }
      
      return result === testCase.expectedOutput;
    } catch (error) {
      throw new Error(`Test failed: ${error.message}`);
    }
  };

  const currentProblemData = currentProblem?.[currentProblemIndex];

  const handleRun = async () => {
    if (!currentProblemData) return;
    
    setLoading(true);
    setAnalysis(null);
    try {
      // Get AI analysis of the code
      const codeAnalysis = await analyzeCode(code, currentProblemData.id);
      setAnalysis(codeAnalysis);
      
      if (codeAnalysis.correctness) {
        setOutput('✅ All test cases passed!\n\nTime Complexity: ' + 
          codeAnalysis.timeComplexity + '\nSpace Complexity: ' + 
          codeAnalysis.spaceComplexity + 
          (codeAnalysis.suggestions ? '\n\n💡 Optimization available! Click "Show Optimization" to see how to improve your code.' : '')
        );
      } else {
        setOutput('❌ Some test cases failed. Please try again.');
      }
      // Test with the first test case
      const testCase = currentProblemData.testCases[0];
      const passed = await evaluateCode(code, testCase);
      
      setOutput(
        `Test Case 1:
Input: ${JSON.stringify(testCase.input)}
Expected Output: ${JSON.stringify(testCase.expectedOutput)}
Your Output: ${passed ? 'Passed ✓' : 'Failed ✗'}`
      );
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!currentProblemData) return;

    setLoading(true);
    try {
      // Test all test cases
      const results = await Promise.all(
        currentProblemData.testCases.map(async (testCase, index) => {
          try {
            const passed = await evaluateCode(code, testCase);
            return {
              testCase,
              passed,
              error: null
            };
          } catch (error) {
            return {
              testCase,
              passed: false,
              error: error.message
            };
          }
        })
      );

      const allPassed = results.every(r => r.passed);
      
      if (allPassed) {
        navigate('/learnhub/practice/feedback', { 
          state: { 
            code,
            problem: currentProblemData.title,
            topic: selectedTopic,
            difficulty: selectedDifficulty,
            results
          }
        });
      } else {
        setOutput(
          results.map((result, index) => 
            `Test Case ${index + 1}:
Input: ${JSON.stringify(result.testCase.input)}
Expected Output: ${JSON.stringify(result.testCase.expectedOutput)}
Status: ${result.passed ? 'Passed ✓' : 'Failed ✗'}
${result.error ? `Error: ${result.error}` : ''}`
          ).join('\n\n')
        );
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
    setLoading(false);
  };

  if (!currentProblemData) {
    return (
      <div className="problem-page">
        <div className="loading">Loading problem...</div>
      </div>
    );
  }

  return (
    <div className="problem-page">
      <div className="problem-navigation">
        <button 
          onClick={handlePrevious} 
          disabled={currentProblemIndex === 0}
        >
          Previous Problem
        </button>
        <span>Problem {currentProblemIndex + 1} of {currentProblem.length}</span>
        <button 
          onClick={handleNext}
          disabled={currentProblemIndex === currentProblem.length - 1}
        >
          Next Problem
        </button>
      </div>

      <div className="problem-header">
        <h2 className="problem-title">{currentProblemData.title}</h2>
        <span className="difficulty-tag" style={{
          backgroundColor: 
            selectedDifficulty === 'beginner' ? '#4CAF50' :
            selectedDifficulty === 'medium' ? '#FF9800' : '#F44336'
        }}>
          {selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1)}
        </span>
      </div>

      <div className="problem-description">
        <p>{currentProblemData.description}</p>
        
        <h3>Examples:</h3>
        {currentProblemData.examples.map((example, index) => (
          <div key={index} className="example">
            <p><strong>Input:</strong> {example.input}</p>
            <p><strong>Output:</strong> {example.output}</p>
            {example.explanation && (
              <p><strong>Explanation:</strong> {example.explanation}</p>
            )}
          </div>
        ))}

        <div className="constraints">
          <h3>Constraints:</h3>
          <ul>
            {currentProblemData.constraints.map((constraint, index) => (
              <li key={index}>{constraint}</li>
            ))}
          </ul>
        </div>

        {currentProblemData.hints && (
          <div className="hints-section">
            <h3>
              <button 
                onClick={() => setShowHints(!showHints)}
                className="hint-toggle"
              >
                💡 {showHints ? 'Hide Hints' : 'Show Hints'}
              </button>
            </h3>
            {showHints && (
              <ul className="hints-list">
                {currentProblemData.hints.map((hint, index) => (
                  <li key={index}>{hint}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <div className="code-editor">
        <Editor
          height="400px"
          defaultLanguage="javascript"
          value={code}
          onChange={handleCodeChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            automaticLayout: true,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            fontSize: 14
          }}
        />
      </div>

      <div className="output-area">
        {output && (
          <pre className="output">
            {output}
          </pre>
        )}
      </div>

      <div className="action-buttons">
        <button 
          className={`run-btn ${loading ? 'loading' : ''}`}
          onClick={handleRun}
          disabled={loading}
        >
          {loading ? 'Running...' : '▶ Run Code'}
        </button>
        <button 
          className={`submit-btn ${loading ? 'loading' : ''}`}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Submitting...' : '✓ Submit Solution'}
        </button>
      </div>
    </div>
  );
};

export default ProblemPage;