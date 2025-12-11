import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getCurrentUser, logout, createMeetup } from '../services/api';

function CreateMeetup() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('tech');
  const [capacity, setCapacity] = useState(10);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const user = getCurrentUser();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const datetime = `${date}T${time}`;

      await createMeetup({
        title,
        description,
        date: datetime,
        location,
        category,
        capacity: parseInt(capacity)
      });

      navigate('/meetups');
    } catch (err) {
      setError(err.message || 'Error creating meetup');
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
      maxWidth: '900px',
      margin: '0 auto',
      background: 'white',
      borderRadius: '16px',
      padding: '40px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    },
    title: {
      fontSize: '32px',
      fontWeight: 'bold',
      marginBottom: '30px',
      color: '#1a202c'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column'
    },
    label: {
      marginBottom: '8px',
      fontWeight: '600',
      color: '#4a5568',
      fontSize: '14px'
    },
    input: {
      padding: '12px 16px',
      fontSize: '16px',
      border: '2px solid #e2e8f0',
      borderRadius: '8px',
      outline: 'none'
    },
    textarea: {
      padding: '12px 16px',
      fontSize: '16px',
      border: '2px solid #e2e8f0',
      borderRadius: '8px',
      outline: 'none',
      fontFamily: 'inherit',
      minHeight: '120px'
    },
    submitButton: {
      width: '100%',
      padding: '16px',
      fontSize: '16px',
      fontWeight: '600',
      color: 'white',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      marginTop: '10px'
    },
    error: {
      background: '#fed7d7',
      color: '#c53030',
      padding: '12px',
      borderRadius: '8px',
      fontSize: '14px'
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

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
        <h1 style={styles.title}>Create New Meetup</h1>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={styles.input}
              placeholder="Enter meetup title"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              style={styles.textarea}
              placeholder="Describe your meetup"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                min={new Date().toISOString().split('T')[0]}
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              style={styles.input}
              placeholder="Where will the meetup take place?"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={styles.input}
              >
                <option value="tech">Tech</option>
                <option value="business">Business</option>
                <option value="health">Health</option>
                <option value="sports">Sports</option>
                <option value="art">Art</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Capacity</label>
              <input
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                required
                min="1"
                style={styles.input}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.submitButton,
              opacity: loading ? 0.5 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Creating...' : 'Create Meetup'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateMeetup;

