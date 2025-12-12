import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  getCurrentUser,
  getAuthToken,
  logout,
  getMeetupById,
  registerForMeetup,
  unregisterFromMeetup,
  getUserMeetups,
  getReviews,
  addReview
} from '../services/api';

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
    if (id) {
      fetchMeetup();
      checkRegistration();
      fetchReviewsData();
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

  const checkRegistration = async () => {
    try {
      const meetups = await getUserMeetups();
      if (Array.isArray(meetups)) {
        setIsRegistered(meetups.some(m => m.id === parseInt(id)));
      } else {
        setIsRegistered(false);
      }
    } catch (error) {
      console.error('Error checking registration:', error);
    }
  };

  const handleRegister = async () => {
    setRegistering(true);
    setMessage('');

    try {
      await registerForMeetup(id);
      setMessage('Successfully registered!');
      setIsRegistered(true);
      fetchMeetup();
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
      setIsRegistered(false);
      fetchMeetup();
    } catch (error) {
      setMessage(error.message || 'Error unregistering from meetup');
    } finally {
      setRegistering(false);
    }
  };

  const fetchReviewsData = async () => {
    try {
      const data = await getReviews(id);
      setReviews(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      await addReview(id, { rating, comment });
      setMessage('Review submitted successfully!');
      setComment('');
      setRating(5);
      fetchReviewsData();
    } catch (error) {
      setMessage(error.message || 'Failed to submit review');
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
    // navbar style removed in favor of CSS class
    logo: {
      fontSize: '24px',
      fontWeight: 'bold',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      textDecoration: 'none'
    },
    // userInfo style removed in favor of CSS class
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
