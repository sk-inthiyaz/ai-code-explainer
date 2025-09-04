import React, { useState, useRef, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Signup from "./components/Signup";
import PrivateRoute from "./components/PrivateRoute";
import ChatPage from "./components/ChatPage";
import { AuthProvider } from "./context/AuthContext";
import StartLearningMain from './components/startLearningComponent/data/StartLearningMain';
import LearnHubMainPage from './components/LearnHubMainPage';
import PracticeSelection from './components/practiceWithAI/PracticeSelection';
import PracticeLanding from './components/practiceWithAI/PracticeLanding';
import ProblemPage from './components/practiceWithAI/ProblemPage';
import AIFeedback from './components/practiceWithAI/AIFeedback';
import PracticeCodeEditor from './components/practiceWithAI/PracticeCodeEditor';
import './index.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [inputCode, setInputCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentProblem, setCurrentProblem] = useState(null);
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
      const userId = user._id || user.userId;
      const savedMessages = localStorage.getItem(`chatMessages_${userId}`);
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

  const handleExplain = async () => {
    if (!inputCode.trim()) return;

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
      setMessages(prev => [...prev, { role: "ai", content: data.explanation }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages(prev => [...prev, { role: "ai", content: "Sorry, there was an error processing your request." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <Navbar isDark={isDark} setIsDark={setIsDark} />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route 
              path="/" 
              element={
                <PrivateRoute>
                  <ChatPage 
                    messages={messages}
                    setMessages={setMessages}
                    inputCode={inputCode}
                    setInputCode={setInputCode}
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                    textareaRef={textareaRef}
                    handleExplain={handleExplain}
                  />
                </PrivateRoute>
              }
            />
            <Route path="/LearnHub" element={<LearnHubMainPage />} />
            <Route path="/learnhub/topics" element={<StartLearningMain />} />
            <Route path="/learnhub/practice" element={
              <PrivateRoute>
                <PracticeSelection />
              </PrivateRoute>
            } />
            <Route path="/learnhub/practice/landing" element={
              <PrivateRoute>
                <PracticeLanding 
                  setCurrentProblem={setCurrentProblem}
                />
              </PrivateRoute>
            } />
            <Route path="/learnhub/practice/problem" element={
              <PrivateRoute>
                <ProblemPage 
                  currentProblem={currentProblem}
                />
              </PrivateRoute>
            } />
            <Route path="/learnhub/practice/feedback" element={
              <PrivateRoute>
                <AIFeedback />
              </PrivateRoute>
            } />
            <Route path="/practice-code-editor" element={
              <PrivateRoute>
                <PracticeCodeEditor />
              </PrivateRoute>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;