import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../services/api';

function Meetups() {
  const [meetups, setMeetups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const user = getCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMeetups();
  }, []);

  const fetchMeetups = async () => {
    try {
      setLoading(true);
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (dateFilter) params.append('date', dateFilter);
      if (locationFilter) params.append('location', locationFilter);
      if (categoryFilter) params.append('category', categoryFilter);

      const url = params.toString() ? `${API_URL}/meetups?${params}` : `${API_URL}/meetups`;
      const response = await fetch(url);
      const data = await response.json();
      setMeetups(data);
    } catch (error) {
      console.error('Error fetching meetups:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchMeetups();
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setDateFilter('');
    setLocationFilter('');
    setCategoryFilter('');
  };

  useEffect(() => {
    if (!searchQuery && !dateFilter && !locationFilter && !categoryFilter) {
      fetchMeetups();
    }
  }, [searchQuery, dateFilter, locationFilter, categoryFilter]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="container" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <nav className="glass" style={{
        padding: '20px 30px',
        borderRadius: '16px',
        marginBottom: '40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div style={{
            fontSize: '28px',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Meetup App
          </div>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {user ? (
            <>
              <Link to="/create-meetup" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>
                Create Meetup
              </Link>
              <Link to="/profile" style={{ color: 'white', textDecoration: 'none', fontWeight: '600' }}>
                Profile
              </Link>
              <span style={{ color: 'var(--text-secondary)' }}>Hi, {user.username}</span>
              <button
                onClick={handleLogout}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--text-secondary)',
                  color: 'var(--text-secondary)',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: 'white', textDecoration: 'none', fontWeight: '600' }}>
                Login
              </Link>
              <Link to="/register" className="btn-primary" style={{ textDecoration: 'none' }}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{
          fontSize: '48px',
          fontWeight: '800',
          marginBottom: '20px',
          background: 'linear-gradient(to right, #fff, #94a3b8)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Discover Amazing Meetups
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
          Join a community of like-minded people. Find events that match your interests.
        </p>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto 50px' }}>
        <div className="glass" style={{ padding: '10px', borderRadius: '16px', display: 'flex', gap: '10px' }}>
          <form onSubmit={handleSearch} style={{ flex: 1, display: 'flex' }}>
            <input
              type="text"
              placeholder="Search for meetups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field"
              style={{ border: 'none', background: 'transparent' }}
            />
          </form>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '0 20px',
              fontWeight: '600'
            }}
          >
            Filters
          </button>
          <button onClick={handleSearch} className="btn-primary" style={{ borderRadius: '12px' }}>
            Search
          </button>
        </div>

        {showFilters && (
          <div className="glass" style={{ marginTop: '20px', padding: '20px', borderRadius: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Date</label>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Location</label>
              <input
                type="text"
                placeholder="City or venue"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="input-field"
              >
                <option value="">All Categories</option>
                <option value="tech">Tech</option>
                <option value="business">Business</option>
                <option value="health">Health</option>
                <option value="sports">Sports</option>
                <option value="art">Art</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.3)', borderRadius: '50%', borderTopColor: 'var(--primary)', animation: 'spin 1s ease-in-out infinite' }}></div>
        </div>
      ) : meetups.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
          <h2>No meetups found</h2>
          <p>Try adjusting your search criteria</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '30px'
        }}>
          {meetups.map(meetup => (
            <div key={meetup.id} className="glass" style={{
              borderRadius: '20px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.3s ease',
              cursor: 'pointer'
            }}
              onClick={() => navigate(user ? `/meetups/${meetup.id}` : '/login')}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ height: '140px', background: `linear-gradient(135deg, ${['#6366f1', '#ec4899', '#8b5cf6', '#10b981'][meetup.id % 4]} 0%, #1e293b 100%)`, position: 'relative' }}>
                <span style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  background: 'rgba(0,0,0,0.5)',
                  backdropFilter: 'blur(4px)',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  {meetup.category}
                </span>
              </div>

              <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: 'auto' }}>
                  <p style={{ color: 'var(--secondary)', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px' }}>
                    {new Date(meetup.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px', lineHeight: '1.4' }}>
                    {meetup.title}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' }}>
                    {meetup.description?.substring(0, 100)}
                    {meetup.description?.length > 100 ? '...' : ''}
                  </p>
                </div>

                <div style={{ paddingTop: '20px', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                    <span>📍</span> {meetup.location}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    {meetup.registered_count}/{meetup.capacity} going
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <style>
        {`@keyframes spin { to { transform: rotate(360deg); } }`}
      </style>
    </div>
  );
}

export default Meetups;
