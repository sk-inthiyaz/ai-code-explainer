import React, { useState, useRef, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Signup from "./components/Signup";
import PrivateRoute from "./components/PrivateRoute";
import ChatPage from "./components/ChatPage";
import { AuthProvider } from "./context/AuthContext";
import './index.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [inputCode, setInputCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef(null);

  // Dark mode state centralized here
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    document.body.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  // Load messages from local storage on component mount or when user changes
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      const savedMessages = localStorage.getItem(`chatMessages_${user.userId}`);
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      } else {
        // Optional: Set an initial message if no history exists
        setMessages([{ role: "ai", content: "This is an AI Code Explainer. Please enter code to get an explanation." }]);
      }
    } else {
      // Clear messages if user logs out
      setMessages([]);
    }
  }, []);

  // Save messages to local storage whenever messages state changes
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && messages.length > 0) {
      localStorage.setItem(`chatMessages_${user.userId}`, JSON.stringify(messages));
    }
  }, [messages]);

  // Function to adjust textarea height
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 300)}px`; // Max height of 300px
    }
  };

  // Adjust height when input changes
  useEffect(() => {
    adjustTextareaHeight();
  }, [inputCode]);

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

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      if (!data.explanation) {
        throw new Error("No explanation received from server");
      }

      const aiMsg = { role: "ai", content: data.explanation };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
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

  const toggleDarkMode = () => {
    setIsDark((prev) => !prev);
  };

  return (
    <AuthProvider>
      <Router>
        <div className={`min-h-screen flex flex-col${isDark ? ' dark' : ''}`}>
          <Navbar isDark={isDark} toggleDarkMode={toggleDarkMode} />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route 
              path="/" 
              element={
                <PrivateRoute>
                  <ChatPage isDark={isDark} toggleDarkMode={toggleDarkMode} />
                </PrivateRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
