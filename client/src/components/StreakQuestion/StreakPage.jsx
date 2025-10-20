// import React, { useState, useEffect } from "react";
// import QuestionDisplay from "./QuestionDisplay";
// import CodeEditor from "./CodeEditor";
// import ResultBox from "./ResultBox";
// import ProgressTracker from "./ProgressTracker";
// import { fetchTodayQuestion, submitAnswer } from "./utils/questionAPI";
// import "./StreakQuestion.css";

// const StreakPage = () => {
//   const [question, setQuestion] = useState(null);
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [userLevel, setUserLevel] = useState("easy"); // can come from user profile later

//   useEffect(() => {
//     const loadQuestion = async () => {
//       const q = await fetchTodayQuestion(userLevel);
//       setQuestion(q);
//     };
//     loadQuestion();
//   }, [userLevel]);

//   const handleSubmit = async (code) => {
//     setLoading(true);
//     const res = await submitAnswer(code, question);
//     setResult(res);
//     setLoading(false);
//   };

//   if (!question) return <p className="loading">Loading today’s question...</p>;

//   return (
//     <div className="streak-page">
//       <ProgressTracker />
//       <QuestionDisplay question={question} />
//       <CodeEditor onSubmit={handleSubmit} loading={loading} />
//       {result && <ResultBox result={result} />}
//     </div>
//   );
// };

// export default StreakPage;

// import React, { useState } from "react";
// import UserStreakQuestionCard from "./UserStreakQuestionCard";
// import StreakStatusCard from "./StreakStatusCard";
// import QuestionDetails from "./QuestionDetails";
// import "./StreakPage.css";

// const StreakPage = () => {
//   const [showQuestion, setShowQuestion] = useState(false);

//   return (
//     <div className="streak-page">
//       <h1>🔥 Daily Streak Challenge</h1>
//       <StreakStatusCard />
//       {!showQuestion ? (
//         <UserStreakQuestionCard onStart={() => setShowQuestion(true)} />
//       ) : (
//         <QuestionDetails />
//       )}
//     </div>
//   );
// };

// export default StreakPage;

import React from "react";
import { Link } from "react-router-dom";
import StreakStatusCard from "./StreakStatusCard";
import UserStreakQuestionCard from "./UserStreakQuestionCard";
import Leaderboard from "./Leaderboard";
import "./StreakPage.css";

const StreakPage = () => {
  return (
    <div className="streak-page">
      <div className="streak-header">
        <div>
          <h1>🔥 Daily Streak Challenge</h1>
          <p>Solve today’s problem, keep your streak alive, and climb the leaderboard.</p>
        </div>
        <Link to="/streak/leaderboard" className="leaderboard-link">Full Leaderboard →</Link>
      </div>
      <div className="streak-grid">
        <div className="main-column">
          <StreakStatusCard />
          <UserStreakQuestionCard />
        </div>
        <aside className="sidebar-column">
          <div className="sidebar-card">
            <h3>🏆 Today’s Top Streakers</h3>
            <Leaderboard embedMode={true} />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default StreakPage;
