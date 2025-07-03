import React, { useState, useRef, useEffect } from "react";
import ChatWindow from "./ChatWindow";
import { useAuth } from "../context/AuthContext";
import "./ChatPage.css";

function ChatPage({ isDark, toggleDarkMode }) {
  const [messages, setMessages] = useState([]);
  const [inputCode, setInputCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef(null);
  const { user, loading } = useAuth();

  useEffect(() => {
    setMessages([]);
    if (user) {
      const savedMessages = localStorage.getItem(`chatMessages_${user.userId}`);
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      } else {
        setMessages([{ role: "ai", content: "This is an AI Code Explainer. Please enter code to get an explanation." }]);
      }
    } else {
      setMessages([]);
    }
  }, [user]);

  useEffect(() => {
    if (user && messages.length > 0) {
      localStorage.setItem(`chatMessages_${user.userId}`, JSON.stringify(messages));
    }
  }, [messages, user]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 300)}px`;
    }
  }, [inputCode]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [user]);

  const handleSend = async () => {
    if (!inputCode.trim()) return;
    const userMsg = { role: "user", content: inputCode };
    setMessages((prev) => [...prev, userMsg]);
    setInputCode("");
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/explain", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ code: inputCode })
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      if (!data.explanation) throw new Error("No explanation received");
      const aiMsg = { role: "ai", content: data.explanation };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error("Error:", error);
      const errorMsg = { role: "ai", content: "Something went wrong. Please try again." };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`chatpage-root${isDark ? " dark" : ""}`}>  
      <main className="chatpage-main">
        {/* Heading below nav bar, centered, bold, with emoji */}
        <div className="heading-container">
          <h1 className="chatpage-title-fixed">
            AI Code Explainer <span role="img" aria-label="robot">🤖</span>
          </h1>
        </div>
        <div className="chat-wrapper chat-wrapper-fixed">
          <section className="chatpage-chatwindow chat-box chat-box-fixed">
            <ChatWindow messages={messages} isLoading={isLoading} isDark={isDark} />
          </section>
          <form className="input-box input-box-fixed" onSubmit={e => { e.preventDefault(); handleSend(); }}>
            <textarea
              ref={textareaRef}
              className="chatpage-textarea textarea-fixed"
              placeholder="Write your code or question here..."
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              onKeyDown={handleKeyPress}
              style={{ fontFamily: "monospace" }}
            />
            <button
              type="submit"
              className="chatpage-sendbtn sendbtn-fixed"
              aria-label="Send message"
            >
              Send
            </button>
          </form>
        </div>
        <div className="monitor-stand"></div>
      </main>
    </div>
  );
}

export default ChatPage;
