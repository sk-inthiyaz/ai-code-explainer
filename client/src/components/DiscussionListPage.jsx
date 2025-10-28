import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import './DiscussionListPage.css';

const DiscussionListPage = () => {
  const navigate = useNavigate();
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    language: 'all',
    topic: 'all',
    sort: 'recent',
    search: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    pages: 0
  });

  const languages = ['all', 'Java', 'Python', 'C++', 'JavaScript', 'General'];
  const topics = [
    'all',
    'Data Structures',
    'Algorithms',
    'Object-Oriented Programming',
    'Databases',
    'Web Development',
    'System Design',
    'Debugging',
    'Best Practices',
    'Other'
  ];
  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'mostViewed', label: 'Most Viewed' },
    { value: 'mostCommented', label: 'Most Commented' }
  ];

  useEffect(() => {
    fetchDiscussions();
  }, [filters, pagination.page]);

  const fetchDiscussions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/discussions`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          language: filters.language,
          topic: filters.topic,
          sort: filters.sort,
          search: filters.search,
          page: pagination.page,
          limit: 20
        }
      });

      setDiscussions(response.data.discussions);
      setPagination(prev => ({
        ...prev,
        total: response.data.pagination.total,
        pages: response.data.pagination.pages
      }));
    } catch (error) {
      console.error('Error fetching discussions:', error);
      toast.error('Failed to load discussions');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDiscussions();
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const created = new Date(date);
    const diffMs = now - created;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return created.toLocaleDateString();
  };

  const getLanguageColor = (language) => {
    const colors = {
      Java: '#f89820',
      Python: '#3776ab',
      'C++': '#00599c',
      JavaScript: '#f7df1e',
      General: '#6c757d'
    };
    return colors[language] || '#6c757d';
  };

  return (
    <div className="discussion-list-container">
      {/* Header */}
      <div className="discussion-header">
        <div className="header-content">
          <h1>💬 Discussions</h1>
          <p>Join the community! Ask questions, share knowledge, and help others learn</p>
        </div>
        <button className="create-discussion-btn" onClick={() => navigate('/discussions/new')}>
          <span>+</span> New Discussion
        </button>
      </div>

      {/* Filters */}
      <div className="discussion-filters">
        <div className="filter-group">
          <label>Language:</label>
          <select
            value={filters.language}
            onChange={(e) => handleFilterChange('language', e.target.value)}
          >
            {languages.map(lang => (
              <option key={lang} value={lang}>{lang === 'all' ? 'All Languages' : lang}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Topic:</label>
          <select
            value={filters.topic}
            onChange={(e) => handleFilterChange('topic', e.target.value)}
          >
            {topics.map(topic => (
              <option key={topic} value={topic}>{topic === 'all' ? 'All Topics' : topic}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Sort by:</label>
          <select
            value={filters.sort}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search discussions..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          />
          <button type="submit">🔍</button>
        </form>
      </div>

      {/* Discussion List */}
      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading discussions...</p>
        </div>
      ) : discussions.length === 0 ? (
        <div className="no-discussions">
          <h3>No discussions found</h3>
          <p>Be the first to start a discussion!</p>
          <button onClick={() => navigate('/discussions/new')}>Create Discussion</button>
        </div>
      ) : (
        <>
          <div className="discussions-grid">
            {discussions.map(discussion => (
              <div
                key={discussion._id}
                className="discussion-card"
                onClick={() => navigate(`/discussions/${discussion._id}`)}
              >
                <div className="discussion-card-header">
                  <div className="discussion-meta">
                    <span
                      className="language-badge"
                      style={{ backgroundColor: getLanguageColor(discussion.language) }}
                    >
                      {discussion.language}
                    </span>
                    {discussion.isPinned && <span className="pinned-badge">📌 Pinned</span>}
                    {discussion.isSolved && <span className="solved-badge">✓ Solved</span>}
                  </div>
                  <span className="time-ago">{formatTimeAgo(discussion.createdAt)}</span>
                </div>

                <h3 className="discussion-title">{discussion.title}</h3>

                <p className="discussion-excerpt">
                  {discussion.content.substring(0, 150)}
                  {discussion.content.length > 150 ? '...' : ''}
                </p>

                {discussion.tags && discussion.tags.length > 0 && (
                  <div className="discussion-tags">
                    {discussion.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="tag">#{tag}</span>
                    ))}
                  </div>
                )}

                <div className="discussion-card-footer">
                  <div className="author-info">
                    <div className="author-avatar">
                      {discussion.author?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="author-name">{discussion.author?.name}</span>
                  </div>

                  <div className="discussion-stats">
                    <span className="stat">
                      <span className="stat-icon">👍</span>
                      {discussion.votes}
                    </span>
                    <span className="stat">
                      <span className="stat-icon">💬</span>
                      {discussion.commentCount}
                    </span>
                    <span className="stat">
                      <span className="stat-icon">👁️</span>
                      {discussion.views}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
              >
                Previous
              </button>
              <span className="page-info">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === pagination.pages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DiscussionListPage;
