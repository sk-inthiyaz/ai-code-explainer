import React, { useState, useRef, useEffect } from "react";
import ChatWindow from "./ChatWindow";
import { useAuth } from "../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";

function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [inputCode, setInputCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef(null);

  const { user, loading } = useAuth();

  useEffect(() => {
    if (user) {
      const savedMessages = localStorage.getItem(`chatMessages_${user.userId}`);
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      } else {
        setMessages([
          { role: "ai", content: "👋 Hi! I'm a code explainer bot. Please paste your code to get an explanation." },
        ]);
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

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 300)}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputCode]);

  const handleSend = async () => {
    if (!inputCode.trim() || isLoading) return;

    const userMsg = { role: "user", content: inputCode };
    setMessages((prev) => [...prev, userMsg]);
    setInputCode("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/explain", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ code: inputCode }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data?.error || `HTTP error! status: ${res.status}`);
      }

      if (!data.explanation) {
        throw new Error("No explanation received from server");
      }

      const aiMsg = { role: "ai", content: data.explanation };
      setMessages((prev) => [...prev, aiMsg]);

      if (data.explanation.includes("👋 Hi! I'm a code explainer bot")) {
        toast("Please paste a valid code snippet for explanation.", { icon: "ℹ️" });
      }
    } catch (error) {
      console.error("Error fetching AI response:", error);
      toast.error("Something went wrong. Please try again.");
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
    <div className="flex flex-col items-center flex-grow bg-gradient-to-br from-blue-50 to-purple-50">
      <Toaster position="top-center" />
      <h1 className="text-2xl font-bold text-gray-800 mt-6 heading">AI Code Explainer 🤖</h1>
      <div className="w-full max-w-3xl flex-grow mt-4">
        <ChatWindow messages={messages} isLoading={isLoading} />
      </div>
      <div className="w-full max-w-3xl fixed bottom-4 px-4">
        <div className="flex items-start bg-white shadow-md rounded-lg p-4">
          <textarea
            ref={textareaRef}
            className="flex-grow border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px] max-h-[300px] resize-none overflow-y-auto"
            placeholder="Paste your code here to get an explanation..."
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isLoading}
          />
          <button
            className={`ml-4 px-4 py-2 rounded-lg self-end ${
              isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
            } text-white`}
            onClick={handleSend}
            disabled={isLoading}
          >
            {isLoading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
