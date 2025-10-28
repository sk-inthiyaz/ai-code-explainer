import React from "react";
import { useNavigate } from "react-router-dom";
import "./InteractivePractice.css";
import leftArrowIcon from '../images/left-arrow (1).png';

const InteractivePractice = () => {
  const navigate = useNavigate();
  return (
    <div className="ip-container">
      <div className="ip-hero">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <button 
            className="back-button-icon" 
            onClick={() => navigate('/LearnHub')}
            title="Back to LearnHub"
            style={{
              background: 'var(--card-bg)',
              border: '2px solid var(--border-color)',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              padding: '0'
            }}
          >
            <img src={leftArrowIcon} alt="Back" style={{ width: '20px', height: '20px', filter: 'var(--icon-filter)' }} />
          </button>
          <h1 style={{ margin: 0 }}>Interactive Coding Practice</h1>
        </div>
        <p>Master coding through hands-on practice and AI-powered guidance</p>
      </div>

      <div className="ip-grid">
        <div className="ip-card" onClick={() => navigate("/practice/editor")}> 
          <div className="ip-card-header">
            <span className="ip-icon">💻</span>
            <h2>Code Editor Practice</h2>
          </div>
          <ul>
            <li>Full-featured code editor with Monaco Editor</li>
            <li>Real-time syntax highlighting</li>
            <li>Instant AI code analysis and feedback</li>
            <li>Save and submit solutions</li>
            <li>Run code execution</li>
          </ul>
          <button className="ip-btn" onClick={(e)=>{e.stopPropagation(); navigate("/practice/editor");}}>Open Editor</button>
        </div>

        <div className="ip-card" onClick={() => navigate("/practice/problems")}>
          <div className="ip-card-header">
            <span className="ip-icon">📚</span>
            <h2>Guided Practice with Problems</h2>
          </div>
          <ul>
            <li>Curated problem sets (similar to LeetCode)</li>
            <li>Progressive difficulty levels (Easy → Medium → Hard)</li>
            <li>Detailed AI explanations and hints</li>
            <li>Progress tracking and solution history</li>
          </ul>
          <button className="ip-btn" onClick={(e)=>{e.stopPropagation(); navigate("/practice/problems");}}>Browse Problems</button>
        </div>
      </div>
    </div>
  );
};

export default InteractivePractice;
