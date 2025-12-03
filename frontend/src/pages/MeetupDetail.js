import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCurrentUser, getAuthToken, logout } from '../services/api';

function MeetupDetail() {
  const [meetup, setMeetup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');
  const { id } = useParams();
  const user = getCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMeetup();
    checkRegistration();
    fetchReviews();
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

  const checkRegistration = async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/users/me/meetups`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const meetups = await response.json();
      setIsRegistered(meetups.some(m => m.id === parseInt(id)));
    } catch (error) {
      console.error('Error checking registration:', error);
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
        setIsRegistered(true);
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

  const handleUnregister = async () => {
    if (!window.confirm('Are you sure you want to unregister from this meetup?')) {
      return;
    }

    setRegistering(true);
    setMessage('');
    
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
      const token = getAuthToken();
      
      const response = await fetch(`${API_URL}/meetups/${id}/register`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Successfully unregistered!');
        setIsRegistered(false);
        fetchMeetup();
      } else {
        setMessage(data.error || 'Unregistration failed');
      }
    } catch (error) {
      setMessage('Error unregistering from meetup');
    } finally {
      setRegistering(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
      const response = await fetch(`${API_URL}/meetups/${id}/reviews`);
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
      const token = getAuthToken();
      
      const response = await fetch(`${API_URL}/meetups/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rating, comment })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Review submitted successfully!');
        setComment('');
        setRating(5);
        fetchReviews();
      } else {
        setMessage(data.error || 'Failed to submit review');
      }
    } catch (error) {
      setMessage('Error submitting review');
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
    },
    reviewSection: {
      marginTop: '40px',
      paddingTop: '40px',
      borderTop: '2px solid #e2e8f0'
    },
    reviewForm: {
      background: '#f7fafc',
      padding: '24px',
      borderRadius: '12px',
      marginBottom: '30px'
    },
    reviewCard: {
      background: '#f7fafc',
      padding: '20px',
      borderRadius: '12px',
      marginBottom: '16px'
    },
    stars: {
      color: '#f6ad55',
      fontSize: '18px',
      marginBottom: '8px'
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

        {isRegistered ? (
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

        <div style={styles.reviewSection}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', color: '#1a202c' }}>
            Reviews ({reviews.length})
          </h2>

          {meetup && new Date(meetup.date) < new Date() && isRegistered && (
            <div style={styles.reviewForm}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: '#1a202c' }}>
                Leave a Review
              </h3>
              <form onSubmit={handleSubmitReview}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#4a5568' }}>
                    Rating
                  </label>
                  <select 
                    value={rating} 
                    onChange={(e) => setRating(parseInt(e.target.value))}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '2px solid #e2e8f0' }}
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ - Excellent</option>
                    <option value={4}>⭐⭐⭐⭐ - Good</option>
                    <option value={3}>⭐⭐⭐ - Average</option>
                    <option value={2}>⭐⭐ - Poor</option>
                    <option value={1}>⭐ - Terrible</option>
                  </select>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#4a5568' }}>
                    Comment
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    required
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '2px solid #e2e8f0', fontFamily: 'inherit' }}
                  />
                </div>
                <button type="submit" style={{ ...styles.button, width: 'auto' }}>
                  Submit Review
                </button>
              </form>
            </div>
          )}

          {reviews.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#718096', padding: '20px' }}>No reviews yet</p>
          ) : (
            reviews.map(review => (
              <div key={review.id} style={styles.reviewCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontWeight: '600', color: '#1a202c' }}>{review.username}</span>
                  <span style={styles.stars}>{'⭐'.repeat(review.rating)}</span>
                </div>
                <p style={{ color: '#4a5568', lineHeight: '1.6' }}>{review.comment}</p>
                <p style={{ fontSize: '12px', color: '#a0aec0', marginTop: '8px' }}>
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default MeetupDetail;
