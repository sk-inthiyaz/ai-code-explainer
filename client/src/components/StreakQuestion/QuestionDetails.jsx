import React, { useState } from "react";
import "./QuestionDetails.css";

const QuestionDetails = () => {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");

  const runCode = () => {
    setOutput("✅ All test cases passed!");
  };

  return (
    <div className="question-details">
      <h2>Reverse a String</h2>
      <p><strong>Description:</strong> Write a function to reverse a string.</p>
      <p><strong>Example:</strong></p>
      <pre>
{`Input: "hello"
Output: "olleh"`}
      </pre>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Write your code here..."
      />
      <div className="btn-group">
        <button onClick={runCode}>Run</button>
        <button onClick={() => alert("Submitted!")}>Submit</button>
      </div>
      <div className="output-box">{output}</div>
    </div>
  );
};

export default QuestionDetails;
