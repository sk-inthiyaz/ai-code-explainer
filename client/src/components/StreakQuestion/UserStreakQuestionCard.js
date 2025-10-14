import React from "react";
import { useNavigate } from "react-router-dom";
import "./StreakQuestion.css";

const UserStreakQuestionCard = () => {
  const navigate = useNavigate();

  return (
    <div className="streak-card" onClick={() => navigate("/streak")}>
      <div className="streak-card-content">
        <h3>🔥 Streak Question</h3>
        <p>
          Solve 1 question per day to boost your coding streak and earn badges 🏅
        </p>
        <button className="streak-btn">Start Now</button>
      </div>
    </div>
  );
};

export default UserStreakQuestionCard;
