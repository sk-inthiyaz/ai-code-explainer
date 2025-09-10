import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { analyzeCode } from './services/aiService';
import './ProblemPage.css';

const ProblemPage = ({ currentProblem }) => {
  const navigate = useNavigate();
  const [currentProblemIndex, setCurrentProblemIndex] = useState(() => {
    // Initialize from localStorage if available
    const savedIndex = localStorage.getItem('currentProblemIndex');
    return savedIndex ? parseInt(savedIndex) : 0;
  });
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [showOptimization, setShowOptimization] = useState(false);
  const [problemsData, setProblemsData] = useState(() => {
    // Initialize from localStorage or currentProblem
    const savedProblems = localStorage.getItem('practiceProblems');
    if (savedProblems) {
      try {
        return JSON.parse(savedProblems);
      } catch (e) {
        console.log('Error parsing saved problems:', e);
      }
    }
    return currentProblem || null;
  });

  // Update local problemsData when currentProblem prop changes
  useEffect(() => {
    if (currentProblem && Array.isArray(currentProblem) && currentProblem.length > 0) {
      setProblemsData(currentProblem);
      localStorage.setItem('practiceProblems', JSON.stringify(currentProblem));
    }
  }, [currentProblem]);

  // Save index to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('currentProblemIndex', currentProblemIndex.toString());
  }, [currentProblemIndex]);

  // Set up code when problems or index changes
  useEffect(() => {
    if (!problemsData || !Array.isArray(problemsData) || problemsData.length === 0) {
      console.log('No problems available, redirecting to practice selection');
      navigate('/learnhub/practice');
      return;
    }

    // If we have problems but invalid index, reset to first problem
    if (currentProblemIndex >= problemsData.length || currentProblemIndex < 0) {
      console.log('Invalid problem index, resetting to 0');
      setCurrentProblemIndex(0);
      return;
    }

    // If we have a valid problem, set up the code
    if (problemsData[currentProblemIndex]) {
      setCode(problemsData[currentProblemIndex].starterCode || '// Write your code here');
      setAnalysis(null);
      setShowOptimization(false);
    }
  }, [problemsData, currentProblemIndex, navigate]);

  const handleCodeChange = (value) => {
    setCode(value);
  };

  const handleNext = () => {
    if (problemsData && currentProblemIndex < problemsData.length - 1) {
      setCurrentProblemIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentProblemIndex > 0) {
      setCurrentProblemIndex(prev => prev - 1);
    }
  };

  // Extract difficulty from problem ID (e.g., 'c_array_med_1' -> 'medium')
  const getDifficultyFromId = (id) => {
    if (!id) return 'beginner';
    if (id.includes('_med_')) return 'medium';
    if (id.includes('_adv_')) return 'advanced';
    return 'beginner';
  };

  // Extract topic from problem ID (e.g., 'c_array_1' -> 'arrays')
  const extractTopicFromId = (id) => {
    if (!id) return 'arrays';
    if (id.includes('_array_')) return 'arrays';
    if (id.includes('_string_')) return 'strings';
    if (id.includes('_loop_')) return 'loops';
    return 'arrays';
  };

  const evaluateCode = async (code, testCase) => {
    // For C/Java code, we can't execute directly in browser
    // Instead, we'll simulate evaluation based on code analysis
    try {
      // Get the language from problem ID
      const language = currentProblemData?.id?.startsWith('c_') ? 'c' : 'java';
      
      if (language === 'c' || language === 'java') {
        // For compiled languages, we can't execute in browser
        // Return a simulated result based on code structure
        return await simulateCodeExecution(code, testCase, language);
      }
      
      // For JavaScript (if any), execute normally
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

  const simulateCodeExecution = async (code, testCase, language) => {
    // For now, we'll use AI analysis to determine if code is likely correct
    // In a real implementation, you'd send this to a backend code execution service
    
    // Basic checks for common patterns
    const codeLines = code.toLowerCase();
    
    // Check if code has basic structure
    if (language === 'c') {
      if (!codeLines.includes('return') && !codeLines.includes('printf')) {
        return false;
      }
    } else if (language === 'java') {
      if (!codeLines.includes('return') && !codeLines.includes('system.out')) {
        return false;
      }
    }
    
    // For demo purposes, return true if code has reasonable structure
    // In production, this would call a real code execution API
    return codeLines.includes('for') || codeLines.includes('while') || codeLines.includes('if');
  };

  // Get current problem data
  const getCurrentProblemData = () => {
    if (problemsData && problemsData[currentProblemIndex]) {
      return problemsData[currentProblemIndex];
    }
    return null;
  };

  const currentProblemData = getCurrentProblemData();
  const currentDifficulty = getDifficultyFromId(currentProblemData?.id);

  const handleRun = async () => {
    if (!currentProblemData) return;
    
    setLoading(true);
    setAnalysis(null);
    try {
      const language = currentProblemData?.id?.startsWith('c_') ? 'C' : 'Java';
      
      // For C/Java, show test case info and code structure feedback
      const testCase = currentProblemData.testCases[0];
      
      // Basic code structure validation
      const hasLogic = code.includes('for') || code.includes('while') || code.includes('if');
      const hasReturn = code.includes('return');
      const hasMainFunction = language === 'C' ? 
        code.includes('int main') : code.includes('public static void main');
      
      let feedback = `🔍 Code Analysis for ${language}:\n\n`;
      feedback += `✅ Main function: ${hasMainFunction ? 'Found' : 'Missing'}\n`;
      feedback += `✅ Logic structure: ${hasLogic ? 'Found' : 'Needs improvement'}\n`;
      feedback += `✅ Return statement: ${hasReturn ? 'Found' : 'Missing'}\n\n`;
      
      feedback += `📝 Test Case 1:\n`;
      feedback += `Input: ${JSON.stringify(testCase.input)}\n`;
      feedback += `Expected Output: ${JSON.stringify(testCase.expectedOutput)}\n`;
      feedback += `Description: ${testCase.description}\n\n`;
      
      if (hasMainFunction && hasLogic && hasReturn) {
        feedback += `🎉 Your code structure looks good! \n`;
        feedback += `💡 To verify correctness, manually trace through your algorithm with the test input.`;
      } else {
        feedback += `⚠️ Your code needs some improvements. Check the missing components above.`;
      }
      
      setOutput(feedback);
      
    } catch (error) {
      setOutput(`Error analyzing code: ${error.message}`);
    }
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!currentProblemData) return;

    setLoading(true);
    try {
      const language = currentProblemData?.id?.startsWith('c_') ? 'C' : 'Java';
      
      // For C/Java, we'll do structure validation instead of execution
      const hasLogic = code.includes('for') || code.includes('while') || code.includes('if');
      const hasReturn = code.includes('return');
      const hasMainFunction = language === 'C' ? 
        code.includes('int main') : code.includes('public static void main');
      
      // Simulate test results based on code structure
      const structureScore = (hasMainFunction ? 1 : 0) + (hasLogic ? 1 : 0) + (hasReturn ? 1 : 0);
      const allPassed = structureScore >= 2; // At least 2 out of 3 structure elements
      
      if (allPassed) {
        // Navigate to feedback page
        navigate('/learnhub/practice/feedback', { 
          state: { 
            code,
            problem: currentProblemData.title,
            topic: extractTopicFromId(currentProblemData.id),
            difficulty: getDifficultyFromId(currentProblemData.id),
            language: language,
            structureValid: true
          }
        });
      } else {
        // Show what needs to be fixed
        let feedback = `📋 Code Review for ${language}:\n\n`;
        
        currentProblemData.testCases.forEach((testCase, index) => {
          feedback += `Test Case ${index + 1}:\n`;
          feedback += `Input: ${JSON.stringify(testCase.input)}\n`;
          feedback += `Expected: ${JSON.stringify(testCase.expectedOutput)}\n`;
          feedback += `Description: ${testCase.description}\n\n`;
        });
        
        feedback += `⚠️ Code Structure Issues:\n`;
        if (!hasMainFunction) feedback += `- Missing main function\n`;
        if (!hasLogic) feedback += `- Missing logic (loops/conditions)\n`;
        if (!hasReturn) feedback += `- Missing return statement\n`;
        
        feedback += `\n💡 Fix these issues and try again!`;
        
        setOutput(feedback);
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
        <span>Problem {currentProblemIndex + 1} of {problemsData?.length || 0}</span>
        <button 
          onClick={handleNext}
          disabled={!problemsData || currentProblemIndex === problemsData.length - 1}
        >
          Next Problem
        </button>
      </div>

      <div className="problem-header">
        <h2 className="problem-title">{currentProblemData.title}</h2>
        <span className="difficulty-tag" style={{
          backgroundColor: 
            currentDifficulty === 'beginner' ? '#4CAF50' :
            currentDifficulty === 'medium' ? '#FF9800' : '#F44336'
        }}>
          {currentDifficulty ? currentDifficulty.charAt(0).toUpperCase() + currentDifficulty.slice(1) : 'Beginner'}
        </span>
      </div>

      <div className="problem-description">
        <p>{currentProblemData.description}</p>
        
        <h3>Test Cases:</h3>
        {currentProblemData.testCases && currentProblemData.testCases.slice(0, 2).map((testCase, index) => (
          <div key={index} className="example">
            <p><strong>Input:</strong> {JSON.stringify(testCase.input)}</p>
            <p><strong>Expected Output:</strong> {JSON.stringify(testCase.expectedOutput)}</p>
            {testCase.description && (
              <p><strong>Description:</strong> {testCase.description}</p>
            )}
          </div>
        ))}

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