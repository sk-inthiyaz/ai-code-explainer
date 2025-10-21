import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './StreakPage.css';

const StreakHistory = () => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async (p = 1) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/streak/history?page=${p}&pageSize=${pageSize}` , {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setItems(data.items || []);
        setPage(data.page || 1);
        setTotalPages(data.totalPages || 1);
      } else {
        setError(data.message || 'Failed to load');
      }
    } catch (e) {
      setError('Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(1); }, []);

  return (
    <div className="streak-page" style={{ padding: 24 }}>
      <div className="streak-header">
        <h1>🗂️ Solved History</h1>
        <Link to="/streak" className="leaderboard-link">Back to Streak →</Link>
      </div>

      <div className="sidebar-card" style={{ maxWidth: 920 }}>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : items.length === 0 ? (
          <p>No solved questions yet.</p>
        ) : (
          <ul className="solved-list">
            {items.map((item, idx) => (
              <li key={idx} className="solved-item">
                <span className="dot" />
                <div className="solved-info">
                  <div className="title-row">
                    <span className="title">{item.questionId?.title || 'Question'}</span>
                    <span className={`badge ${String(item.difficulty || '').toLowerCase()}`}>{item.difficulty || 'Level'}</span>
                  </div>
                  <div className="meta">{new Date(item.completedAt).toLocaleString()}</div>
                </div>
                {item.questionId?._id && (
                  <Link className="view-link" to={{ pathname: '/streak/solve' }} state={{ question: item.questionId }}>View</Link>
                )}
              </li>
            ))}
          </ul>
        )}

        <div className="pager" style={{ display: 'flex', gap: 12, marginTop: 16 }}>
          <button disabled={page <= 1} onClick={() => load(page - 1)}>Prev</button>
          <span>Page {page} / {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => load(page + 1)}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default StreakHistory;
