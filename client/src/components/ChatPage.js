import React, { useState, useRef, useEffect } from "react";
import ChatWindow from "./ChatWindow";
import { useAuth } from "../context/AuthContext";
import "./ChatPage.css";
import Sidebar from "./Sidebar";
import { getChatTitle } from "../utils/chat";
import LearnHubMainPage from "./LearnHubMainPage"; // 👈 Import LearnHub component

function ChatPage({ isDark, toggleDarkMode }) {
  const [messages, setMessages] = useState([]);
  const [inputCode, setInputCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLearnHub, setShowLearnHub] = useState(false); // 👈 New state
  const textareaRef = useRef(null);
  const { user, loading } = useAuth();
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);

  useEffect(() => {
    const userId = user?._id || user?.userId;
    if (user && userId) {
      fetch(`http://localhost:5000/api/chat-history/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(res => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          return res.json();
        })
        .then(data => setChatHistory(Array.isArray(data) ? data : []))
        .catch((error) => {
          console.error('Error fetching chat history:', error);
          setChatHistory([]);
        });
    } else {
      setChatHistory([]);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      setMessages([{ 
        role: "ai", 
        content: `Hi there! 👋 I'm your AI coding assistant.

I can help you with anything coding-related! Just ask me to:
• Generate code (e.g., "Write a bubble sort algorithm")
• Explain code concepts
• Help with debugging
• Provide coding best practices

No need to paste code first - just ask me what you need! 💻
4. Provide best practices

Just ask me anything about coding! 🚀`
      }]);
    } else {
      setMessages([]);
    }
  }, [user]);

  const updateExistingChat = async (chatId, msgs) => {
    try {
      const response = await fetch(`http://localhost:5000/api/chat-history/${chatId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ messages: msgs })
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const updatedChat = await response.json();
      setChatHistory(prev => prev.map(chat => chat._id === chatId ? updatedChat : chat));
      return updatedChat;
    } catch (error) {
      console.error('Error updating chat:', error);
      return null;
    }
  };

  const saveChatHistory = async (msgs) => {
    const userId = user?._id || user?.userId;
    if (!userId) return;

    if (msgs.length > 1 && msgs.some(msg => msg.role === "user")) {
      const title = getChatTitle(msgs) || msgs.find(msg => msg.role === "user")?.content.slice(0, 30) + "...";

      try {
        const response = await fetch("http://localhost:5000/api/chat-history", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            userId,
            messages: msgs,
            title: title || "New Chat"
          })
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const newChat = await response.json();
        setChatHistory(prev => Array.isArray(prev) ? [newChat, ...prev] : [newChat]);
        return newChat;
      } catch (error) {
        console.error('Error saving chat:', error);
        return null;
      }
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 300)}px`;
    }
  }, [inputCode]);

  useEffect(() => {
    if (textareaRef.current) textareaRef.current.focus();
  }, [user]);

  const handleSend = async () => {
    if (!inputCode.trim()) return;
    const userMsg = { role: "user", content: inputCode };
    setMessages((prev) => [...prev, userMsg]);
    setInputCode("");
    setIsLoading(true);

    try {
      // Check if the input is a code generation request
      const generationKeywords = ['generate', 'write', 'create', 'implement', 'show me', 'give me', 'make'];
      const input = inputCode.toLowerCase();
      const isGenerationRequest = generationKeywords.some(keyword => input.includes(keyword)) || 
                                /how to|algorithm|sort|search|function/i.test(input);

      const res = await fetch("http://localhost:5000/api/explain", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ 
          code: inputCode,
          type: isGenerationRequest ? 'generate' : 'explain'
        })
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      if (!data.explanation) throw new Error("No explanation received");

      const aiMsg = { role: "ai", content: data.explanation };
      const newMessages = [...messages, userMsg, aiMsg];

      if (currentChatId) {
        updateExistingChat(currentChatId, newMessages);
      } else {
        saveChatHistory(newMessages).then(newChat => {
          if (newChat) setCurrentChatId(newChat._id);
        });
      }

      setMessages(newMessages);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [...prev, { role: "ai", content: "Something went wrong. Please try again." }]);
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

  const handleNewChat = () => {
    setCurrentChatId(null);
    setMessages([{ role: "ai", content: "This is an AI Code Explainer. Please enter code to get an explanation." }]);
    setSidebarOpen(false);
  };

  const handleSelectHistory = (item) => {
    setCurrentChatId(item._id);
    setMessages(Array.isArray(item.messages) ? item.messages : []);
    setSidebarOpen(false);
  };

  const handleOpenLearnHub = () => {
    setShowLearnHub(true); // 👈 show LearnHub
    setSidebarOpen(false);
  };

  const handleOpenAbout = () => {
    alert("AI Code Explainer helps you learn programming by explaining code. Built for students and curious minds!");
    setSidebarOpen(false);
  };

  const handleDeleteChat = async (chatId) => {
    if (!chatId || !window.confirm('Are you sure you want to delete this chat?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/chat-history/${chatId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete chat');

      setChatHistory(prev => prev.filter(chat => chat._id !== chatId));

      if (chatId === currentChatId) {
        setCurrentChatId(null);
        setMessages([{ role: "ai", content: "This is an AI Code Explainer. Please enter code to get an explanation." }]);
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
      alert('Failed to delete chat. Please try again.');
    }
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
        onDeleteChat={handleDeleteChat}
        chatHistory={chatHistory}
      />
      <main className="chatpage-main">
        {showLearnHub ? (
          <LearnHubMainPage onClose={() => setShowLearnHub(false)} />
        ) : (
          <>
            <div className="heading-container">
              <h1 className="chatpage-title-fixed">
                AI Coding Assistant <span role="img" aria-label="robot">🤖</span>
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
          </>
        )}
      </main>
    </div>
  );
}

export default ChatPage;
