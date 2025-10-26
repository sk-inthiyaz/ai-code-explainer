import React from "react";
import ProgressTracker from "../StreakQuestion/ProgressTracker";

const ProgressTrackerPage = () => {
  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 16 }}>Your Progress</h2>
      <ProgressTracker />
    </div>
  );
};

export default ProgressTrackerPage;
