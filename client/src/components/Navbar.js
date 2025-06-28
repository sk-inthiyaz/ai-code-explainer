import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const toggleDarkMode = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
    document.body.classList.toggle("dark", newMode);
  };

  return (
    <nav className={`navbar-root${isDark ? " dark" : ""}`}>
      <div className="navbar-inner">
        <span className="navbar-title">AI Code Explainer</span>
        <div className="navbar-desktop-menu">
          {user ? (
            <>
              <span className="navbar-welcome">Welcome, {user.name}</span>
              <button onClick={logout} className="navbar-logout-btn">
                Logout
              </button>
            </>
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
        </div>
        <button
          className="navbar-darkmode-btn"
          onClick={toggleDarkMode}
          aria-label="Toggle dark mode"
        >
          {isDark ? "☀️" : "🌙"}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
