import React, { useState, useRef, useEffect } from "react";
import ChatWindow from "./ChatWindow";
import { useAuth } from "../context/AuthContext";

function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [inputCode, setInputCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef(null);
  const { user, loading } = useAuth();

  // 🌙 Dark mode state
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  // Load messages from local storage on mount/user change
  useEffect(() => {
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

  // Save messages
  useEffect(() => {
    if (user && messages.length > 0) {
      localStorage.setItem(`chatMessages_${user.userId}`, JSON.stringify(messages));
    }
  }, [messages, user]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 300)}px`;
    }
  }, [inputCode]);

  // Auto-focus textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [user]);

  // Toggle dark mode & persist
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
    <div className={`${isDark ? "dark" : ""} w-full min-h-screen`}>
      <div className="relative flex flex-col items-center flex-grow bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-900 dark:to-gray-800 min-h-screen transition-colors duration-300">

        
        {/* 🌙 Dark mode toggle button */}
        <button
          onClick={toggleDarkMode}
          className="absolute top-4 right-6 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-3 py-1 rounded shadow-md transition"
        >
          {isDark ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>

        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mt-6 heading">
          AI Code Explainer 🤖
        </h1>

        <div className="w-full max-w-3xl flex-grow mt-4">
          <ChatWindow messages={messages} isLoading={isLoading} />
        </div>

        <div className="w-full max-w-3xl fixed bottom-4 px-4">
          <div className="flex items-start bg-white dark:bg-gray-900 shadow-md rounded-lg p-4">
            <textarea
              ref={textareaRef}
              className="flex-grow border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px] max-h-[300px] resize-none overflow-y-auto"
              placeholder="Write your code or question here..."
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <button
              className="ml-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 self-end transition"
              onClick={handleSend}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
