import React, { useState, useRef, useEffect } from "react";
import ChatWindow from "./ChatWindow";
import { useAuth } from "../context/AuthContext";
import "./ChatPage.css";
import Sidebar from "./Sidebar";
import { getChatTitle } from "../utils/chat";

function ChatPage({ isDark, toggleDarkMode }) {
  const [messages, setMessages] = useState([]);
  const [inputCode, setInputCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const textareaRef = useRef(null);
  const { user, loading } = useAuth();

  // Always ensure chatHistory is an array
  const [chatHistory, setChatHistory] = useState([]);

  // Fetch chat history from backend
  useEffect(() => {
    if (user && user.userId) {
      fetch(`http://localhost:5000/api/chat-history/${user.userId}`)
        .then(res => res.json())
        .then(data => setChatHistory(Array.isArray(data) ? data : []))
        .catch(() => setChatHistory([]));
    } else {
      setChatHistory([]);
    }
  }, [user]);

  // Reset messages when user changes or starts a new chat
  useEffect(() => {
    setMessages([]);
    if (user) {
      setMessages([{ role: "ai", content: "This is an AI Code Explainer. Please enter code to get an explanation." }]);
    } else {
      setMessages([]);
    }
  }, [user]);

  // Save chat history to backend only when a new chat is started (not on every message)
  const saveChatHistory = (msgs) => {
    if (
      user &&
      msgs.length > 1 &&
      msgs[msgs.length - 1].role === "ai" &&
      msgs.some(msg => msg.role === "user")
    ) {
      const title = getChatTitle(msgs);
      fetch("http://localhost:5000/api/chat-history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.userId, messages: msgs, title })
      })
        .then(res => res.json())
        .then(newChat => {
          setChatHistory(prev => Array.isArray(prev) ? [newChat, ...prev] : [newChat]);
        })
        .catch(() => {});
    }
  };

  useEffect(() => {
    // Only save if the last message is AI and there is at least one user message
    if (
      user &&
      messages.length > 1 &&
      messages[messages.length - 1].role === "ai" &&
      messages.some(msg => msg.role === "user")
    ) {
      saveChatHistory(messages);
    }
    // eslint-disable-next-line
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
    setMessages((prev) => Array.isArray(prev) ? [...prev, userMsg] : [userMsg]);
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
      setMessages((prev) => Array.isArray(prev) ? [...prev, aiMsg] : [aiMsg]);
    } catch (error) {
      console.error("Error:", error);
      const errorMsg = { role: "ai", content: "Something went wrong. Please try again." };
      setMessages((prev) => Array.isArray(prev) ? [...prev, errorMsg] : [errorMsg]);
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

  // Sidebar menu handlers
  const handleNewChat = () => {
    // Save the current chat if it has user messages and an AI response
    if (
      user &&
      messages.length > 1 &&
      messages[messages.length - 1].role === "ai" &&
      messages.some(msg => msg.role === "user")
    ) {
      saveChatHistory(messages);
    }
    setMessages([{ role: "ai", content: "This is an AI Code Explainer. Please enter code to get an explanation." }]);
    setSidebarOpen(false);
  };
  const handleSelectHistory = (item) => {
    setMessages(Array.isArray(item.messages) ? item.messages : []);
    setSidebarOpen(false);
  };
  const handleOpenLearnHub = () => {
    alert("LearnHub coming soon! Upload PDFs and language guides here.");
    setSidebarOpen(false);
  };
  const handleOpenAbout = () => {
    alert("AI Code Explainer helps you learn programming by explaining code. Built for students and curious minds!");
    setSidebarOpen(false);
  };

  return (
    <div className="chatpage-root">
      <Sidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        onNewChat={handleNewChat}
        onSelectHistory={handleSelectHistory}
        onOpenLearnHub={handleOpenLearnHub}
        onOpenAbout={handleOpenAbout}
        chatHistory={chatHistory}
      />
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
