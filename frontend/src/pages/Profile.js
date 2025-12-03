import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser, getAuthToken, logout } from '../services/api';

function Profile() {
  const [upcomingMeetups, setUpcomingMeetups] = useState([]);
  const [pastMeetups, setPastMeetups] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = getCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchUserMeetups();
  }, [user, navigate]);

  const fetchUserMeetups = async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
      const token = getAuthToken();
      
      const [upcomingRes, pastRes] = await Promise.all([
        fetch(`${API_URL}/users/me/meetups`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_URL}/users/me/past-meetups`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const upcoming = await upcomingRes.json();
      const past = await pastRes.json();
      
      setUpcomingMeetups(upcoming);
      setPastMeetups(past);
    } catch (error) {
      console.error('Error fetching user meetups:', error);
    } finally {
      setLoading(false);
    }
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
      WebkitTextFillColor: 'transparent',
      textDecoration: 'none'
    },
    navLinks: {
      display: 'flex',
      gap: '20px',
      alignItems: 'center'
    },
    navLink: {
      color: '#1a202c',
      textDecoration: 'none',
      fontWeight: '600',
      fontSize: '14px'
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
    profileHeader: {
      background: 'white',
      borderRadius: '16px',
      padding: '30px',
      marginBottom: '30px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    },
    section: {
      background: 'white',
      borderRadius: '16px',
      padding: '30px',
      marginBottom: '30px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    },
    sectionTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '20px',
      color: '#1a202c'
    },
    meetupCard: {
      padding: '20px',
      background: '#f7fafc',
      borderRadius: '12px',
      marginBottom: '16px'
    },
    meetupTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '8px',
      color: '#1a202c'
    },
    meetupInfo: {
      fontSize: '14px',
      color: '#718096',
      marginBottom: '4px'
    },
    empty: {
      textAlign: 'center',
      padding: '40px',
      color: '#718096'
    }
  };

  if (!user) return null;

  return (
    <div style={styles.container}>
      <div style={styles.navbar}>
        <Link to="/meetups" style={styles.logo}>Meetup App</Link>
        <div style={styles.navLinks}>
          <Link to="/meetups" style={styles.navLink}>Meetups</Link>
          <Link to="/profile" style={styles.navLink}>Profile</Link>
          <span style={{ fontWeight: '600', color: '#1a202c' }}>{user.username}</span>
          <button onClick={handleLogout} style={styles.button}>Logout</button>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.profileHeader}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px', color: '#1a202c' }}>
            {user.username}
          </h1>
          <p style={{ color: '#718096' }}>{user.email}</p>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Upcoming Meetups</h2>
          {loading ? (
            <p style={styles.empty}>Loading...</p>
          ) : upcomingMeetups.length === 0 ? (
            <p style={styles.empty}>No upcoming meetups</p>
          ) : (
            upcomingMeetups.map(meetup => (
              <Link key={meetup.id} to={`/meetups/${meetup.id}`} style={{ textDecoration: 'none' }}>
                <div style={styles.meetupCard}>
                  <h3 style={styles.meetupTitle}>{meetup.title}</h3>
                  <p style={styles.meetupInfo}>
                    📅 {new Date(meetup.date).toLocaleDateString()} at {new Date(meetup.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p style={styles.meetupInfo}>📍 {meetup.location}</p>
                  <p style={styles.meetupInfo}>
                    {meetup.registered_count}/{meetup.capacity} joined
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Past Meetups</h2>
          {loading ? (
            <p style={styles.empty}>Loading...</p>
          ) : pastMeetups.length === 0 ? (
            <p style={styles.empty}>No past meetups</p>
          ) : (
            pastMeetups.map(meetup => (
              <Link key={meetup.id} to={`/meetups/${meetup.id}`} style={{ textDecoration: 'none' }}>
                <div style={styles.meetupCard}>
                  <h3 style={styles.meetupTitle}>{meetup.title}</h3>
                  <p style={styles.meetupInfo}>
                    📅 {new Date(meetup.date).toLocaleDateString()}
                  </p>
                  <p style={styles.meetupInfo}>📍 {meetup.location}</p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;

