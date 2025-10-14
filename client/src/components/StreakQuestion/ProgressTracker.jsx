import React from "react";
import "./StreakQuestion.css";

const ProgressTracker = () => {
  const streakDays = 5; // sample
  const nextLevel = "Mid";
  const badges = ["🔥 Beginner", "🏅 Consistent"];

  return (
    <div className="progress-tracker">
      <h3>📈 Your Progress</h3>
      <p>Current Streak: {streakDays} days</p>
      <p>Next Level: {nextLevel}</p>
      <div className="badges">
        {badges.map((b, i) => (
          <span key={i} className="badge">{b}</span>
        ))}
      </div>
    </div>
  );
};

export default ProgressTracker;
