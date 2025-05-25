import React, { useState } from "react";
import ChatWindow from "./components/ChatWindow";
import { FaMicrophone, FaVideo, FaArrowUp } from "react-icons/fa";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [inputCode, setInputCode] = useState("");

  const handleSend = async () => {
    if (!inputCode.trim()) return;

    const userMsg = { role: "user", content: inputCode };

    const res = await fetch("http://localhost:5000/api/explain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: inputCode }),
    });
    const data = await res.json();

    const aiMsg = { role: "ai", content: data.explanation };
    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setInputCode("");
  };

  return (
    <div className="app">
      <h1>AI Code Explainer 🤖</h1>
      <div className="chat-window">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            <div className="bubble">{msg.content}</div>
          </div>
        ))}
      </div>
      <div className="input-area">
        <textarea
          rows="1"
          placeholder="Write your code or question here..."
          value={inputCode}
          onChange={(e) => setInputCode(e.target.value)}
        ></textarea>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default App;
