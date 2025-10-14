import React from "react";
import "./StreakQuestion.css";

const QuestionDisplay = ({ question }) => {
  return (
    <div className="question-display">
      <h2>{question.title}</h2>
      <p className="desc">{question.description}</p>

      <div className="example-box">
        <strong>Example:</strong>
        <pre>{question.example}</pre>
      </div>

      <div className="constraints">
        <strong>Constraints:</strong>
        <pre>{question.constraints}</pre>
      </div>
    </div>
  );
};

export default QuestionDisplay;
