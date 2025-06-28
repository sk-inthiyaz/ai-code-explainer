import React, { useState, useRef, useEffect } from "react";
import ChatWindow from "./ChatWindow";
import { useAuth } from "../context/AuthContext";
import "./ChatPage.css";

function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [inputCode, setInputCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef(null);
  const { user, loading } = useAuth();
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

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

  const toggleDarkMode = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  const handleSend = async () => {
    if (!inputCode.trim()) return;
    const userMsg = { role: "user", content: inputCode };
    setMessages((prev) => [...prev, userMsg]);
    setInputCode("");
    setIsLoading(true);
    try {
      const res = await fetch("http://192.168.138.2:5000/api/explain", {
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
      <header className="chatpage-header">
        <h1 className="chatpage-title">AI Code Explainer</h1>
        <button
          onClick={toggleDarkMode}
          className="chatpage-darkmode-btn"
          aria-label="Toggle dark mode"
        >
          {isDark ? "☀️" : "🌙"}
        </button>
      </header>
      <main className="chatpage-main">
        <section className="chatpage-chatwindow">
          <ChatWindow messages={messages} isLoading={isLoading} isDark={isDark} />
        </section>
        <form className="chatpage-inputbar" onSubmit={e => { e.preventDefault(); handleSend(); }}>
          <textarea
            ref={textareaRef}
            className="chatpage-textarea"
            placeholder="Write your code or question..."
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            onKeyDown={handleKeyPress}
            style={{ fontFamily: "monospace" }}
          />
          <button
            type="submit"
            className="chatpage-sendbtn"
            aria-label="Send message"
          >
            <span className="desktop">Send</span>
            <span className="mobile">➤</span>
          </button>
        </form>
      </main>
    </div>
  );
}

export default ChatPage;
