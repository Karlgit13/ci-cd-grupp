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

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px' }}>
      {user ? (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
            <h2>Welcome, {user.username}!</h2>
            <button onClick={handleLogout} style={{ padding: '8px 16px' }}>
              Logout
            </button>
          </div>
          <h3>Meetups</h3>
          <p>Meetup list coming soon...</p>
        </div>
      ) : (
        <div>
          <h2>Welcome to Meetup App</h2>
          <p>Please <Link to="/login">login</Link> or <Link to="/register">register</Link> to continue.</p>
        </div>
      )}
    </div>
  );
}

export default Home;

