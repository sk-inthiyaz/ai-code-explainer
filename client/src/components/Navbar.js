import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = ({ isDark, toggleDarkMode }) => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar-root">
      <div className="navbar-inner">
        <span className="navbar-title">Code Explainer</span>
        <div className="navbar-right-group">
          {user && (
            <>
              <Link to="/practice-code-editor" className="navbar-practice-link">
                🚀 Practice Arena
              </Link>
              <span className="navbar-welcome">Welcome, {user.name}</span>
            </>
          )}
          {user ? (
            <button onClick={logout} className="navbar-logout-btn">
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="navbar-link">
                Login
              </Link>
              <Link to="/signup" className="navbar-signup-btn">
                Sign Up
              </Link>
            </>
          )}
          <button
            className="navbar-darkmode-btn"
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
          >
            {isDark ? "☀️" : "🌙"}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
