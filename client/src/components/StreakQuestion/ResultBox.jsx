import React from "react";
import "./StreakQuestion.css";

const ResultBox = ({ result }) => {
  return (
    <div className="result-box">
      <h3>Results:</h3>
      <p>Status: {result.passedAll ? "✅ Passed" : "❌ Failed"}</p>
      <pre>{result.output}</pre>
    </div>
  );
};

export default ResultBox;
