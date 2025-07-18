import React, { useState } from "react";
import { FiMenu, FiMessageSquare, FiBookOpen, FiInfo, FiPlus } from "react-icons/fi";
import "./Sidebar.css";

const Sidebar = ({ onNewChat, onSelectHistory, onOpenLearnHub, onOpenAbout, chatHistory, isOpen, setIsOpen }) => {
  const safeChatHistory = Array.isArray(chatHistory) ? chatHistory : [];
  return (
    <>
      <button className="sidebar-hamburger" onClick={() => setIsOpen(!isOpen)} aria-label="Open menu">
        <FiMenu size={28} />
      </button>
      <nav className={`sidebar-root${isOpen ? " open" : ""}`}>
        <div className="sidebar-header">
          <span className="sidebar-title">AI Code Explainer</span>
        </div>
        <ul className="sidebar-menu">
          <li onClick={onNewChat} className="sidebar-menu-item">
            <FiPlus className="sidebar-icon" /> New Chat
          </li>
          <li className="sidebar-menu-label">History</li>
          {safeChatHistory.length > 0 ? (
            safeChatHistory.map((item, idx) => (
              <li key={idx} onClick={() => onSelectHistory(item)} className="sidebar-menu-item">
                <FiMessageSquare className="sidebar-icon" /> {item.title || `Chat ${idx + 1}`}
              </li>
            ))
          ) : (
            <li className="sidebar-menu-item sidebar-empty">No history yet</li>
          )}
          <li onClick={onOpenLearnHub} className="sidebar-menu-item">
            <FiBookOpen className="sidebar-icon" /> LearnHub
          </li>
          <li onClick={onOpenAbout} className="sidebar-menu-item">
            <FiInfo className="sidebar-icon" /> About
          </li>
        </ul>
      </nav>
      {isOpen && <div className="sidebar-backdrop" onClick={() => setIsOpen(false)}></div>}
    </>
  );
};

export default Sidebar;
