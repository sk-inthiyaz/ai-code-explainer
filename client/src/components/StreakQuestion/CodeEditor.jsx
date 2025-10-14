import React, { useState } from "react";
import "./StreakQuestion.css";

const CodeEditor = ({ onSubmit, loading }) => {
  const [code, setCode] = useState("// write your code here...");

  const handleSubmit = () => {
    if (code.trim() === "") return alert("Write some code first!");
    onSubmit(code);
  };

  return (
    <div className="code-editor">
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        spellCheck="false"
      />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Running..." : "Run Code"}
      </button>
    </div>
  );
};

export default CodeEditor;
