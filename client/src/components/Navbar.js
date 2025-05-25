import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => setIsOpen(!isOpen);
  const closeDrawer = () => setIsOpen(false);

  return (
    <>
      <nav className="bg-white dark:bg-gray-900 shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600 dark:text-white">
            Code Explainer
          </Link>

          <div className="md:hidden">
            <button onClick={toggleDrawer}>
              {isOpen ? (
                <X className="w-6 h-6 text-gray-700 dark:text-white" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700 dark:text-white" />
              )}
            </button>
          </div>

          <div className="hidden md:flex space-x-6 items-center">
            {user ? (
              <>
                <span className="text-gray-800 dark:text-white">Welcome, {user.name}</span>
                <button
                  onClick={logout}
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white">
                  Login
                </Link>
                <Link to="/signup" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-40 md:hidden"
          onClick={closeDrawer}
        ></div>
      )}
      <div
        className={`fixed top-0 right-0 w-64 h-full bg-white dark:bg-gray-900 z-50 transform transition-transform duration-300 md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 space-y-4">
          {user ? (
            <>
              <p className="text-gray-800 dark:text-white">Welcome, {user.name}</p>
              <button
                onClick={() => {
                  logout();
                  closeDrawer();
                }}
                className="block text-left w-full text-gray-600 dark:text-gray-300 hover:text-blue-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={closeDrawer}
                className="block text-gray-600 dark:text-gray-300 hover:text-blue-600"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={closeDrawer}
                className="block bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
