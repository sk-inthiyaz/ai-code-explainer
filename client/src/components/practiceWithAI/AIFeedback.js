import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaCode, FaLightbulb, FaBolt, FaChartLine, FaClock } from 'react-icons/fa';
import './AIFeedback.css';

const analyzeSolution = (code) => {
  // This is a placeholder for the actual code analysis
  // In a real implementation, this would be much more sophisticated
  const analysis = {
    timeComplexity: {
      found: 'O(n)',
      explanation: 'The solution uses a single loop through the array',
    },
    spaceComplexity: {
      found: 'O(1)',
      explanation: 'The solution uses only a constant amount of extra space',
    },
    codeQuality: {
      score: 90,
      feedback: [
        'Good use of meaningful variable names',
        'Clear and concise logic',
        'Proper error handling could be added'
      ]
    },
    improvements: [
      {
        type: 'optimization',
        description: 'Consider using array destructuring for cleaner code',
        example: 'const [first, ...rest] = array;'
      },
      {
        type: 'readability',
        description: 'Add comments explaining the key steps',
        example: '// Calculate running sum up to current index'
      }
    ],
    alternativeSolutions: [
      {
        description: 'Using reduce method',
        code: 'const sum = arr.reduce((acc, curr) => acc + curr, 0);',
        pros: ['More functional approach', 'Concise'],
        cons: ['Might be less readable for beginners']
      }
    ]
  };

  return analysis;
};

const calculateScore = (results, analysis) => {
  let correctness = results.filter(r => r.passed).length / results.length * 100;
  let efficiency = analysis.codeQuality.score;
  let readability = analysis.codeQuality.score;

  return {
    overall: Math.round((correctness + efficiency + readability) / 3),
    correctness: Math.round(correctness),
    efficiency: Math.round(efficiency),
    readability: Math.round(readability)
  };
};

const AIFeedback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [scores, setScores] = useState(null);

  useEffect(() => {
    if (!location.state?.code) {
      navigate('/learnhub/practice');
      return;
    }

    // Analyze the code and calculate scores
    const codeAnalysis = analyzeSolution(location.state.code);
    setAnalysis(codeAnalysis);
    setScores(calculateScore(location.state.results, codeAnalysis));
  }, [location.state, navigate]);

  const handleNext = () => {
    navigate('/learnhub/practice');
  };

  const handleRetry = () => {
    navigate(-1);
  };

  if (!analysis || !scores) {
    return <div>Loading analysis...</div>;
  }

  return (
    <div className="feedback-page">
      <div className="feedback-header">
        <h1 className="feedback-title">
          <FaCheckCircle /> Excellent Work!
        </h1>
        <p className="feedback-subtitle">
          Here's a detailed analysis of your solution
        </p>
        <div className="feedback-metadata">
          <span className="metadata-item">
            <FaCode /> Problem: {location.state.problem}
          </span>
          <span className="metadata-item">
            <FaBolt /> Difficulty: {location.state.difficulty}
          </span>
          <span className="metadata-item">
            <FaClock /> Topic: {location.state.topic}
          </span>
        </div>
      </div>

      <div className="score-section">
        <h2 className="score-title">Performance Summary</h2>
        <div className="score-display">
          <div className="score-item">
            <div className="score-value">{scores.overall}%</div>
            <div className="score-label">Overall Score</div>
          </div>
          <div className="score-item">
            <div className="score-value">{scores.correctness}%</div>
            <div className="score-label">Correctness</div>
          </div>
          <div className="score-item">
            <div className="score-value">{scores.efficiency}%</div>
            <div className="score-label">Efficiency</div>
          </div>
          <div className="score-item">
            <div className="score-value">{scores.readability}%</div>
            <div className="score-label">Readability</div>
          </div>
        </div>
      </div>

      <div className="feedback-content">
        <div className="feedback-section">
          <h3 className="section-title">
            <FaBolt /> Complexity Analysis
          </h3>
          <ul className="feedback-list">
            <li className="feedback-item">
              Time Complexity: {analysis.timeComplexity.found}
              <div className="improvement-suggestion">
                {analysis.timeComplexity.explanation}
              </div>
            </li>
            <li className="feedback-item">
              Space Complexity: {analysis.spaceComplexity.found}
              <div className="improvement-suggestion">
                {analysis.spaceComplexity.explanation}
              </div>
            </li>
          </ul>
        </div>

        <div className="feedback-section">
          <h3 className="section-title">
            <FaLightbulb /> Code Quality Feedback
          </h3>
          <ul className="feedback-list">
            {analysis.codeQuality.feedback.map((feedback, index) => (
              <li key={index} className="feedback-item">
                {feedback}
              </li>
            ))}
          </ul>
        </div>

        <div className="feedback-section">
          <h3 className="section-title">
            <FaChartLine /> Suggested Improvements
          </h3>
          <ul className="feedback-list">
            {analysis.improvements.map((improvement, index) => (
              <li key={index} className="feedback-item">
                {improvement.description}
                <pre className="code-block">
                  {improvement.example}
                </pre>
              </li>
            ))}
          </ul>
        </div>

        <div className="feedback-section">
          <h3 className="section-title">
            <FaCode /> Alternative Approaches
          </h3>
          {analysis.alternativeSolutions.map((solution, index) => (
            <div key={index}>
              <p>{solution.description}</p>
              <pre className="code-block">
                {solution.code}
              </pre>
              <div className="improvement-suggestion">
                <strong>Pros:</strong> {solution.pros.join(', ')}
                <br />
                <strong>Cons:</strong> {solution.cons.join(', ')}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="action-buttons">
        <button className="next-btn" onClick={handleNext}>
          Practice Another Problem <span>→</span>
        </button>
        <button className="retry-btn" onClick={handleRetry}>
          Try Again
        </button>
      </div>
    </div>
  );
};

export default AIFeedback;
