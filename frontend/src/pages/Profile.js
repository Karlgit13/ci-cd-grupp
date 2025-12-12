import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser, getAuthToken, logout } from '../services/api';
import { API_URL } from '../config/apiConfig';

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
      // API_URL imported from config
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
    // ... we will use classes mostly
  };

  if (!user) return null;

  return (
    <div style={{ minHeight: '100vh', padding: '20px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="navbar glass" style={{ maxWidth: '1200px', margin: '0 auto 30px' }}>
        <Link to="/meetups" style={{ fontSize: '24px', fontWeight: 'bold', background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textDecoration: 'none' }}>Meetup App</Link>
        <div className="nav-links">
          <Link to="/meetups" className="btn-primary" style={{ textDecoration: 'none', fontSize: '14px' }}>Meetups</Link>
          <button onClick={handleLogout} className="btn-primary" style={{ fontSize: '14px' }}>Logout</button>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="glass" style={{ padding: '40px', borderRadius: '24px', marginBottom: '30px', textAlign: 'center' }}>
          <div style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)', borderRadius: '50%', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', color: 'white', fontWeight: 'bold' }}>
            {user.username.charAt(0).toUpperCase()}
          </div>
          <h1 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '8px', color: 'var(--text)' }}>
            {user.username}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>{user.email}</p>
        </div>

        <div className="glass" style={{ padding: '30px', borderRadius: '24px', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', color: 'var(--text)' }}>Upcoming Meetups</h2>
          {loading ? (
            <p style={{ textAlign: 'center', padding: '20px', color: 'var(--text-secondary)' }}>Loading...</p>
          ) : upcomingMeetups.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>No upcoming meetups</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {upcomingMeetups.map(meetup => (
                <Link key={meetup.id} to={`/meetups/${meetup.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '20px', transition: 'transform 0.2s', border: '1px solid rgba(255,255,255,0.1)' }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: 'var(--secondary)' }}>{meetup.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '6px' }}>
                      📅 {new Date(meetup.date).toLocaleDateString()} at {new Date(meetup.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '6px' }}>📍 {meetup.location}</p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                      👥 {meetup.registered_count}/{meetup.capacity} joined
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="glass" style={{ padding: '30px', borderRadius: '24px', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', color: 'var(--text)' }}>Past Meetups</h2>
          {loading ? (
            <p style={{ textAlign: 'center', padding: '20px', color: 'var(--text-secondary)' }}>Loading...</p>
          ) : pastMeetups.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>No past meetups</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {pastMeetups.map(meetup => (
                <Link key={meetup.id} to={`/meetups/${meetup.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '20px', transition: 'transform 0.2s', border: '1px solid rgba(255,255,255,0.1)' }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: 'var(--secondary)' }}>{meetup.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '6px' }}>
                      📅 {new Date(meetup.date).toLocaleDateString()}
                    </p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>📍 {meetup.location}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;

