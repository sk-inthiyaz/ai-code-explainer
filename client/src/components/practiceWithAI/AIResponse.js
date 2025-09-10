import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const AIResponse = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { code, problem } = location.state || {};

  // Mock AI feedback - in a real app, this would come from your AI service
  const feedback = {
    overallScore: 85,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    feedback: [
      'Good use of the hash map approach for optimal time complexity',
      'Variable names are clear and descriptive',
      'Consider adding input validation for edge cases',
      'The solution handles the main test cases correctly'
    ],
    suggestions: [
      {
        title: 'Input Validation',
        code: `// Add input validation at the start
if (!nums || nums.length < 2) {
    return [];
}`,
      },
      {
        title: 'Error Handling',
        code: `// Consider adding error handling for invalid inputs
try {
    // Your solution code here
} catch (error) {
    console.error('Error processing input:', error);
    return [];
}`,
      }
    ]
  };

  const handleTryAgain = () => {
    navigate(-1); // Go back to the problem page
  };

  const handleNextProblem = () => {
    navigate('/practice'); // Go back to practice landing to select a new problem
  };

  return (
    <div className="ai-response">
      <h2>AI Feedback for {problem}</h2>
      
      <div className="score-section">
        <h3>Overall Score: {feedback.overallScore}%</h3>
        <div className="complexity-info">
          <p><strong>Time Complexity:</strong> {feedback.timeComplexity}</p>
          <p><strong>Space Complexity:</strong> {feedback.spaceComplexity}</p>
        </div>
      </div>

      <div className="feedback-section">
        <h3>Code Review Feedback</h3>
        {feedback.feedback.map((item, index) => (
          <div key={index} className="feedback-item">
            {item}
          </div>
        ))}
      </div>

      <div className="suggestions-section">
        <h3>Suggestions for Improvement</h3>
        {feedback.suggestions.map((suggestion, index) => (
          <div key={index} className="suggestion-item">
            <h4>{suggestion.title}</h4>
            <pre className="code-suggestion">
              {suggestion.code}
            </pre>
          </div>
        ))}
      </div>

      <div className="action-buttons">
        <button className="try-again-btn" onClick={handleTryAgain}>
          Try Again
        </button>
        <button className="next-problem-btn" onClick={handleNextProblem}>
          Next Problem
        </button>
      </div>
    </div>
  );
};

export default AIResponse;
