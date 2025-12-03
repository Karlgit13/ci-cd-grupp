import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../services/api';

function Home() {
  const user = getCurrentUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const styles = {
    container: {
      minHeight: '100vh',
      padding: '20px'
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
      backgroundClip: 'text'
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px'
    },
    username: {
      fontWeight: '600',
      color: '#1a202c'
    },
    button: {
      padding: '10px 20px',
      fontSize: '14px',
      fontWeight: '600',
      color: 'white',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'transform 0.2s'
    },
    content: {
      maxWidth: '1200px',
      margin: '0 auto',
      background: 'white',
      borderRadius: '16px',
      padding: '40px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    },
    welcome: {
      textAlign: 'center',
      padding: '60px 20px'
    },
    title: {
      fontSize: '36px',
      fontWeight: 'bold',
      marginBottom: '16px',
      color: '#1a202c'
    },
    subtitle: {
      fontSize: '18px',
      color: '#718096',
      marginBottom: '30px'
    },
    linkButton: {
      display: 'inline-block',
      padding: '12px 30px',
      margin: '0 10px',
      fontSize: '16px',
      fontWeight: '600',
      color: 'white',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      textDecoration: 'none',
      borderRadius: '8px',
      transition: 'transform 0.2s'
    },
    meetupsTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '20px',
      color: '#1a202c'
    },
    placeholder: {
      textAlign: 'center',
      padding: '60px 20px',
      color: '#718096',
      fontSize: '16px'
    }
  };

  return (
    <div style={styles.container}>
      {user ? (
        <>
          <div style={styles.navbar}>
            <div style={styles.logo}>Meetup App</div>
            <div style={styles.userInfo}>
              <span style={styles.username}>Hi, {user.username}!</span>
              <button onClick={handleLogout} style={styles.button}>
                Logout
              </button>
            </div>
          </div>
          <div style={styles.content}>
            <h3 style={styles.meetupsTitle}>Upcoming Meetups</h3>
            <div style={styles.placeholder}>
              <p>🎯 Meetup list coming soon...</p>
            </div>
          </div>
        </>
      ) : (
        <div style={styles.content}>
          <div style={styles.welcome}>
            <h1 style={styles.title}>Welcome to Meetup App</h1>
            <p style={styles.subtitle}>Discover and join amazing meetups in your area</p>
            <div>
              <Link to="/login" style={styles.linkButton}>Login</Link>
              <Link to="/register" style={styles.linkButton}>Register</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;

