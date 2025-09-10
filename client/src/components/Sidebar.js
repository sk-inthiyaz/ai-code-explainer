import React from "react";
import { FiMenu, FiMessageSquare, FiBookOpen, FiInfo, FiPlus, FiTrash2 } from "react-icons/fi";
import "./Sidebar.css";
import { Link } from 'react-router-dom';

const Sidebar = ({ onNewChat, onSelectHistory, onOpenLearnHub, onOpenAbout, onDeleteChat, chatHistory, isOpen, setIsOpen }) => {
  const safeChatHistory = Array.isArray(chatHistory) ? chatHistory : [];

  const handleDeleteChat = (e, chatId) => {
    e.stopPropagation(); // Prevent triggering the chat selection
    onDeleteChat(chatId);
  };

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
                <FiMessageSquare className="sidebar-icon" /> 
                <span className="chat-title">{item.title || `Chat ${idx + 1}`}</span>
                <button 
                  className="delete-chat-btn"
                  onClick={(e) => handleDeleteChat(e, item._id)}
                  aria-label="Delete chat"
                >
                  <FiTrash2 />
                </button>
              </li>
            ))
          ) : (
            <li className="sidebar-menu-item sidebar-empty">No history yet</li>
          )}
          <li className="sidebar-menu-item">
            <Link to="/LearnHub" style={{ display: 'flex', alignItems: 'center', width: '100%', textDecoration: 'none', color: 'inherit' }}>
              <FiBookOpen className="sidebar-icon" /> LearnHub
            </Link>
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
