import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCurrentUser, getAuthToken, logout } from '../services/api';

function MeetupDetail() {
  const [meetup, setMeetup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [message, setMessage] = useState('');
  const { id } = useParams();
  const user = getCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMeetup();
  }, [id]);

  const fetchMeetup = async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
      const response = await fetch(`${API_URL}/meetups/${id}`);
      const data = await response.json();
      setMeetup(data);
    } catch (error) {
      console.error('Error fetching meetup:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setRegistering(true);
    setMessage('');
    
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
      const token = getAuthToken();
      
      const response = await fetch(`${API_URL}/meetups/${id}/register`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Successfully registered!');
        fetchMeetup();
      } else {
        setMessage(data.error || 'Registration failed');
      }
    } catch (error) {
      setMessage('Error registering for meetup');
    } finally {
      setRegistering(false);
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
      maxWidth: '900px',
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
      maxWidth: '900px',
      margin: '0 auto',
      background: 'white',
      borderRadius: '16px',
      padding: '40px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    },
    backLink: {
      display: 'inline-block',
      color: '#667eea',
      textDecoration: 'none',
      marginBottom: '20px',
      fontSize: '14px',
      fontWeight: '600'
    },
    title: {
      fontSize: '32px',
      fontWeight: 'bold',
      marginBottom: '16px',
      color: '#1a202c'
    },
    meta: {
      display: 'flex',
      gap: '20px',
      marginBottom: '24px',
      fontSize: '14px',
      color: '#718096',
      flexWrap: 'wrap'
    },
    description: {
      fontSize: '16px',
      lineHeight: '1.6',
      color: '#4a5568',
      marginBottom: '24px'
    },
    infoBox: {
      background: '#f7fafc',
      padding: '20px',
      borderRadius: '12px',
      marginBottom: '24px'
    },
    infoRow: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '12px',
      fontSize: '14px'
    },
    registerButton: {
      width: '100%',
      padding: '16px',
      fontSize: '16px',
      fontWeight: '600',
      color: 'white',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      marginTop: '20px'
    },
    message: {
      padding: '12px',
      borderRadius: '8px',
      marginTop: '16px',
      textAlign: 'center',
      fontWeight: '600'
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.content}>
          <p style={{ textAlign: 'center' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!meetup) {
    return (
      <div style={styles.container}>
        <div style={styles.content}>
          <p style={{ textAlign: 'center' }}>Meetup not found</p>
        </div>
      </div>
    );
  }

  const isFull = meetup.registered_count >= meetup.capacity;

  return (
    <div style={styles.container}>
      <div style={styles.navbar}>
        <Link to="/" style={styles.logo}>Meetup App</Link>
        <div style={styles.userInfo}>
          <span style={{ fontWeight: '600', color: '#1a202c' }}>Hi, {user.username}!</span>
          <button onClick={handleLogout} style={styles.button}>Logout</button>
        </div>
      </div>

      <div style={styles.content}>
        <Link to="/meetups" style={styles.backLink}>← Back to Meetups</Link>
        
        <h1 style={styles.title}>{meetup.title}</h1>
        
        <div style={styles.meta}>
          <span>📅 {new Date(meetup.date).toLocaleDateString()} at {new Date(meetup.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          <span>📍 {meetup.location}</span>
          <span>🏷️ {meetup.category}</span>
          <span>👤 Hosted by {meetup.host_name}</span>
        </div>

        <p style={styles.description}>{meetup.description}</p>

        <div style={styles.infoBox}>
          <div style={styles.infoRow}>
            <span style={{ fontWeight: '600', color: '#1a202c' }}>Capacity:</span>
            <span>{meetup.registered_count} / {meetup.capacity} spots filled</span>
          </div>
          <div style={styles.infoRow}>
            <span style={{ fontWeight: '600', color: '#1a202c' }}>Status:</span>
            <span style={{ color: isFull ? '#e53e3e' : '#38a169' }}>
              {isFull ? 'Full' : 'Spots Available'}
            </span>
          </div>
        </div>

        <button 
          onClick={handleRegister} 
          disabled={registering || isFull}
          style={{
            ...styles.registerButton,
            opacity: registering || isFull ? 0.5 : 1,
            cursor: registering || isFull ? 'not-allowed' : 'pointer'
          }}
        >
          {registering ? 'Registering...' : isFull ? 'Meetup Full' : 'Register for Meetup'}
        </button>

        {message && (
          <div style={{
            ...styles.message,
            background: message.includes('Success') ? '#c6f6d5' : '#fed7d7',
            color: message.includes('Success') ? '#22543d' : '#c53030'
          }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default MeetupDetail;
