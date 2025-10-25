import React from "react";
import { useNavigate } from "react-router-dom";
import "./LearnHubMainPage.css";
import UserStreakQuestionCard from "../StreakQuestion/UserStreakQuestionCard";
const LearnHubMainPage = () => {
  const navigate = useNavigate();

  const cards = [
    {
      icon: "🔰",
      title: "Start Learning",
      desc: "Explore basics like Variables, Loops, Recursion, etc.",
      link: "/learnhub/topics",
    },
    {
      icon: "�",
      title: "Practice Problems",
      desc: "Solve curated coding problems (Easy, Medium, Hard)",
      link: "/practice/problems",
    },
    {
      icon: "💻",
      title: "Code Editor Practice",
      desc: "Write and test code with AI-powered feedback",
      link: "/practice/editor",
    },
    {
      icon: "�",
      title: "My Practice Progress",
      desc: "Track solved problems and submission history",
      link: "/practice/dashboard",
    },
    {
      icon: "🐞",
      title: "Solve Streak quetion🔥",
      desc: "Master our daily quetions and win rewards and badges📛🪙",
      link: "/streak",
    },
    {
      icon: "✍️",
      title: "Code-to-Concept",
      desc: "Paste code and see what concepts it uses",
      link: "/learnhub/concepts",
    },
    {
      icon: "💬",
      title: "Ask AI Doubts",
      desc: "Type a code doubt and get an explanation",
      link: "/learnhub/askai",
    },
  ];

  return (
    <div className="learnhub-container">
  <h2 className="learnhub-title">🎓 Welcome to Coding Hub</h2>
      <div className="card-grid">
        {cards.map((card, index) => (
          <div
            key={index}
            className="learnhub-card"
            onClick={() => navigate(card.link)}
          >
            <div className="card-icon">{card.icon}</div>
            <h3>{card.title}</h3>
            <p>{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearnHubMainPage;
