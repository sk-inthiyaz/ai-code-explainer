import React from "react";
import "./UserStreakQuestionCard.css";

const UserStreakQuestionCard = ({ onStart }) => {
  return (
    <div className="streak-card">
      <h2>🧩 Today’s Challenge</h2>
      <p><strong>Title:</strong> Reverse a String</p>
      <p><strong>Difficulty:</strong> Easy</p>
      <p>Solve this question to maintain your streak 🔥</p>
      <button onClick={onStart}>Start Solving 🚀</button>
    </div>
  );
};

export default UserStreakQuestionCard;
