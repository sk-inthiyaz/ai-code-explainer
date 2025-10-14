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

import React, { useState } from "react";
import "./QuestionDescription.css";
import "./CodeEditor.css";

const StreakPage = () => {
  const [language, setLanguage] = useState("JavaScript");
  const [code, setCode] = useState("// Write your code here...");
  const [output, setOutput] = useState("");

  const question = {
    title: "Two Sum",
    description: `Given an array of integers nums and an integer target, 
find the indices of the two numbers such that they add up to target.`,
    example: `
Example 1:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].

Example 2:
Input: nums = [3,2,4], target = 6
Output: [1,2]
    `,
    constraints: `
Constraints:
- 2 <= nums.length <= 10^4
- -10^9 <= nums[i] <= 10^9
- -10^9 <= target <= 10^9
- Only one valid answer exists.
    `,
  };

  const handleRun = () => {
    setOutput("✅ Code executed successfully!\nOutput: [0, 1]");
  };

  const handleSubmit = () => {
    setOutput("🎯 All test cases passed! You earned +1 streak 🔥");
  };

  return (
    <div className="streak-question-container">
      {/* LEFT SIDE: QUESTION */}
      <div className="question-left">
        <h2 className="question-title">{question.title}</h2>
        <p className="question-description">{question.description}</p>
        <pre className="question-example">{question.example}</pre>
        <pre className="question-constraints">{question.constraints}</pre>
      </div>

      {/* RIGHT SIDE: CODE EDITOR */}
      <div className="question-right">
        <div className="editor-header">
          <h3>Code Editor 💻</h3>
          <select
            className="language-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option>JavaScript</option>
            <option>Python</option>
            <option>Java</option>
            <option>C++</option>
          </select>
        </div>

        <textarea
          className="code-editor"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck="false"
        ></textarea>

        <div className="editor-buttons">
          <button className="run-btn" onClick={handleRun}>
            Run Code
          </button>
          <button className="submit-btn" onClick={handleSubmit}>
            Submit
          </button>
        </div>

        <div className="editor-output">
          <h4>Console Output:</h4>
          <pre>{output}</pre>
        </div>
      </div>
    </div>
  );
};

export default StreakPage;
