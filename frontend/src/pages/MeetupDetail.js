import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  getCurrentUser,
  logout,
  getMeetupById,
  registerForMeetup,
  unregisterFromMeetup,
} from '../services/api';
import Reviews from '../components/Reviews';

function MeetupDetail() {
  const [meetup, setMeetup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [message, setMessage] = useState('');
  const { id } = useParams();
  const user = getCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchMeetup();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchMeetup = async () => {
    try {
      const data = await getMeetupById(id);
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
      await registerForMeetup(id);
      setMessage('Successfully registered!');
      fetchMeetup(); // Update counts and status from backend
    } catch (error) {
      setMessage(error.message || 'Error registering for meetup');
    } finally {
      setRegistering(false);
    }
  };

  const handleUnregister = async () => {
    if (!window.confirm('Are you sure you want to unregister from this meetup?')) {
      return;
    }

    setRegistering(true);
    setMessage('');

    try {
      await unregisterFromMeetup(id);
      setMessage('Successfully unregistered!');
      fetchMeetup(); // Update counts and status from backend
    } catch (error) {
      setMessage(error.message || 'Error unregistering from meetup');
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
    logo: {
      fontSize: '24px',
      fontWeight: 'bold',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      textDecoration: 'none'
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

  // Use values directly from backend
  const { registeredCount, capacity, isRegistered, hasAttended, date } = meetup;
  const isFull = registeredCount >= capacity;
  const isPast = new Date(date) < new Date();

  return (
    <div style={styles.container}>
      <div className="navbar" style={{ background: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', maxWidth: '900px', margin: '0 auto 30px' }}>
        <Link to="/" style={styles.logo}>Meetup App</Link>
        <div className="nav-links">
          <Link to="/meetups" className="btn-primary" style={{ textDecoration: 'none', fontSize: '14px' }}>Back</Link>
          <span style={{ fontWeight: '600', color: '#1a202c' }}>Hi, {user.username}!</span>
          <button
            onClick={handleLogout}
            style={{
              background: 'transparent',
              border: '1px solid #718096',
              color: '#718096',
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div style={styles.content}>
        <Link to="/meetups" style={styles.backLink}>← Back to Meetups</Link>

        <h1 style={styles.title}>{meetup.title}</h1>

        <div style={styles.meta}>
          <span>📅 {new Date(date).toLocaleDateString()} at {new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          <span>📍 {meetup.location}</span>
          <span>🏷️ {meetup.category}</span>
          <span>👤 Hosted by {meetup.host_name}</span>
        </div>

        <p style={styles.description}>{meetup.description}</p>

        <div style={styles.infoBox}>
          <div style={styles.infoRow}>
            <span style={{ fontWeight: '600', color: '#1a202c' }}>Registration Status:</span>
            <span>{registeredCount}/{capacity} joined</span>
          </div>
          {/* Status color indicator based on fullness */}
          <div style={{
            height: '6px',
            background: '#e2e8f0',
            borderRadius: '3px',
            overflow: 'hidden',
            marginTop: '8px'
          }}>
            <div style={{
              width: `${Math.min((registeredCount / capacity) * 100, 100)}%`,
              background: isFull ? '#e53e3e' : '#48bb78',
              height: '100%'
            }} />
          </div>
        </div>

        {/* Action Button */}
        {!isPast && (
          isRegistered ? (
            <button
              onClick={handleUnregister}
              disabled={registering}
              style={{
                ...styles.registerButton,
                background: '#e53e3e',
                opacity: registering ? 0.5 : 1,
                cursor: registering ? 'not-allowed' : 'pointer'
              }}
            >
              {registering ? 'Processing...' : 'Unregister from Meetup'}
            </button>
          ) : (
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
          )
        )}

        {/* Past Event Message */}
        {isPast && (
          <div style={{
            padding: '16px',
            background: '#edf2f7',
            borderRadius: '8px',
            marginTop: '20px',
            textAlign: 'center',
            color: '#4a5568',
            fontStyle: 'italic'
          }}>
            This event has already taken place.
          </div>
        )}

        {message && (
          <div style={{
            ...styles.message,
            background: message.includes('Success') ? '#c6f6d5' : '#fed7d7',
            color: message.includes('Success') ? '#22543d' : '#c53030'
          }}>
            {message}
          </div>
        )}

        {/* Reviews Section - Always visible, but form is conditional */}
        <Reviews
          meetupId={id}
          isAttended={hasAttended}
          isPast={isPast}
        />
      </div>
    </div>
  );
}

export default MeetupDetail;
