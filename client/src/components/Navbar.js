import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = ({ isDark, toggleDarkMode }) => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar-root">
      <div className="navbar-inner">
        <Link to="/LearnHub" className="navbar-title">Coding Hub</Link>
        <div className="navbar-right-group">
          {user && (
            <>
              {!user.isAdmin && (
                <Link to="/practice-code-editor" className="navbar-practice-link">
                  🚀 Practice Arena
                </Link>
              )}
              {user.isAdmin && (
                <Link to="/admin/dashboard" className="navbar-admin-link">
                  👑 Admin Dashboard
                </Link>
              )}
              <span className="navbar-welcome">
                Welcome, {user.isAdmin ? 'Admin' : user.name}
              </span>
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
