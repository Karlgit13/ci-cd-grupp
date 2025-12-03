import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../services/api';

function Meetups() {
  const [meetups, setMeetups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const user = getCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMeetups();
  }, []);

  const fetchMeetups = async (search = '') => {
    try {
      setLoading(true);
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
      const url = search ? `${API_URL}/meetups?search=${encodeURIComponent(search)}` : `${API_URL}/meetups`;
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
    fetchMeetups(searchQuery);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const styles = {
    container: {
      minHeight: '100vh',
      padding: '20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    navbar: {
      background: 'white',
      borderRadius: '16px',
      padding: '20px 30px',
      marginBottom: '30px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      maxWidth: '1200px',
      margin: '0 auto 30px'
    },
    logo: {
      fontSize: '24px',
      fontWeight: 'bold',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px'
    },
    button: {
      padding: '10px 20px',
      fontSize: '14px',
      fontWeight: '600',
      color: 'white',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer'
    },
    content: {
      maxWidth: '1200px',
      margin: '0 auto'
    },
    title: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: 'white',
      marginBottom: '30px',
      textAlign: 'center'
    },
    searchContainer: {
      maxWidth: '600px',
      margin: '0 auto 30px'
    },
    searchForm: {
      display: 'flex',
      gap: '12px'
    },
    searchInput: {
      flex: 1,
      padding: '14px 20px',
      fontSize: '16px',
      border: 'none',
      borderRadius: '12px',
      outline: 'none'
    },
    searchButton: {
      padding: '14px 30px',
      fontSize: '16px',
      fontWeight: '600',
      color: 'white',
      background: 'white',
      color: '#667eea',
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
      gap: '24px'
    },
    card: {
      background: 'white',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s',
      cursor: 'pointer'
    },
    cardTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      marginBottom: '8px',
      color: '#1a202c'
    },
    cardDate: {
      fontSize: '14px',
      color: '#667eea',
      marginBottom: '12px'
    },
    cardDescription: {
      fontSize: '14px',
      color: '#718096',
      marginBottom: '16px',
      lineHeight: '1.5'
    },
    cardFooter: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: '16px',
      borderTop: '1px solid #e2e8f0'
    },
    category: {
      fontSize: '12px',
      padding: '4px 12px',
      background: '#f7fafc',
      borderRadius: '12px',
      color: '#4a5568'
    },
    capacity: {
      fontSize: '14px',
      color: '#718096'
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div style={styles.container}>
      <div style={styles.navbar}>
        <Link to="/meetups" style={{ textDecoration: 'none' }}>
          <div style={styles.logo}>Meetup App</div>
        </Link>
        <div style={styles.userInfo}>
          <Link to="/profile" style={{ color: '#1a202c', textDecoration: 'none', fontWeight: '600', fontSize: '14px' }}>
            Profile
          </Link>
          <span style={{ fontWeight: '600', color: '#1a202c' }}>Hi, {user.username}!</span>
          <button onClick={handleLogout} style={styles.button}>Logout</button>
        </div>
      </div>

      <div style={styles.content}>
        <h1 style={styles.title}>Upcoming Meetups</h1>
        
        <div style={styles.searchContainer}>
          <form onSubmit={handleSearch} style={styles.searchForm}>
            <input
              type="text"
              placeholder="Search meetups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
            <button type="submit" style={styles.searchButton}>
              Search
            </button>
          </form>
        </div>
        
        {loading ? (
          <p style={{ textAlign: 'center', color: 'white' }}>Loading...</p>
        ) : meetups.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'white' }}>No meetups found</p>
        ) : (
          <div style={styles.grid}>
            {meetups.map(meetup => (
              <Link 
                key={meetup.id} 
                to={`/meetups/${meetup.id}`}
                style={{ textDecoration: 'none' }}
              >
                <div style={styles.card}>
                  <h3 style={styles.cardTitle}>{meetup.title}</h3>
                  <p style={styles.cardDate}>
                    📅 {new Date(meetup.date).toLocaleDateString()} at {new Date(meetup.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p style={styles.cardDescription}>
                    {meetup.description?.substring(0, 100)}
                    {meetup.description?.length > 100 ? '...' : ''}
                  </p>
                  <p style={{ fontSize: '14px', color: '#718096', marginBottom: '8px' }}>
                    📍 {meetup.location}
                  </p>
                  <div style={styles.cardFooter}>
                    <span style={styles.category}>{meetup.category}</span>
                    <span style={styles.capacity}>
                      {meetup.registered_count}/{meetup.capacity} joined
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Meetups;
