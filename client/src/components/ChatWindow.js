import React from "react";
import "./ChatWindow.css";

function formatExplanation(content) {
  if (!content) return null;
  if (content.trim() === "This is an AI Code Explainer. Please enter code to get an explanation.") {
    return <div>{content}</div>;
  }
  const lines = content.split('\n').filter(line => line.trim() !== "");
  const languageLine = lines.find(line => line.startsWith("Language:"));
  const bullets = lines.filter(line => line.startsWith("*"));

  // Extract code lines and explanations
  const codeLines = [];
  const explanations = [];
  bullets.forEach(bullet => {
    const match = bullet.match(/`([^`]+)`:\s*(.*)/);
    if (match) {
      codeLines.push(match[1]);
      explanations.push(match[2]);
    }
  });

  return (
    <div>
      {languageLine && (
        <div className="language-label">{languageLine.replace("Language:", "").trim()}</div>
      )}
      {codeLines.length > 0 && (
        <div className="code-block">
          {codeLines.map((cl, idx) => (
            <div key={idx}>{cl}</div>
          ))}
        </div>
      )}
      <ul style={{ paddingLeft: "20px" }}>
        {explanations.map((exp, idx) => (
          <li key={idx} style={{ marginBottom: "6px" }}>
            {exp}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ChatWindow({ messages }) {
  return (
    <div className="chat-window">
      {messages.map((msg, idx) => (
        <div
          key={idx}
          className={`message ${msg.role === "user" ? "user" : "ai"}`}
        >
          {msg.role === "ai" ? formatExplanation(msg.content) : msg.content}
        </div>
      ))}
    </div>
  );
}

export default ChatWindow;