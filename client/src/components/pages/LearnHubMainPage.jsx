import React from "react";
import { useNavigate } from "react-router-dom";
import "./LearnHubMainPage.css";

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
      icon: "💻",
      title: "Interactive Coding Practice",
      desc: "Master coding through hands-on practice and AI-powered guidance",
      link: "/learnhub/practice",
    },
    {
      icon: "🐞",
      title: "Solve Streak quetion🔥",
      desc: "Master our daily quetions and win rewards and badges📛🪙",
      link: "/",
    },
    {
      icon: "✍️",
      title: "Code-to-Concept",
      desc: "Paste code and see what concepts it uses",
      link: "/learnhub/concepts",
    },
    {
      icon: "📊",
      title: "Progress Tracker",
      desc: "Track topics completed and badges earned",
      link: "/learnhub/progress",
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
      <h2 className="learnhub-title">� Welcome to Coding Hub</h2>
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
