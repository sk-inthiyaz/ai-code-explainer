import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-gray-800">Code Explainer</span>
            </Link>
          </div>          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-gray-600">Welcome, {user.name}</span>
                <button
                  onClick={logout}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-gray-900">Login</Link>
                <Link to="/signup" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
