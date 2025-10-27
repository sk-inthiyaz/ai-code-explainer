import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const adminCards = [
    {
      id: 1,
      title: 'Practice Problems',
      description: 'Manage practice problems, add new questions, edit existing ones',
      icon: '📝',
      path: '/admin/dashboard/practice-problems',
      color: '#10b981'
    },
    {
      id: 2,
      title: 'Streak Problems',
      description: 'Manage daily streak questions, view stats, and user progress',
      icon: '🔥',
      path: '/admin/dashboard/streak',
      color: '#f59e0b'
    }
  ];

  return (
    <div className="admin-dashboard-container">
      <div className="admin-dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Manage your platform content and settings</p>
      </div>

      <div className="admin-cards-grid">
        {adminCards.map((card) => (
          <div
            key={card.id}
            className="admin-card"
            onClick={() => navigate(card.path)}
            style={{ '--card-color': card.color }}
          >
            <div className="admin-card-icon">{card.icon}</div>
            <h2 className="admin-card-title">{card.title}</h2>
            <p className="admin-card-description">{card.description}</p>
            <button className="admin-card-button">
              Manage →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
