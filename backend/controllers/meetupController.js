const pool = require('../config/db');

const getAllMeetups = async (req, res) => {
  try {
    const { search } = req.query;
    
    let query = `SELECT m.*, u.username as host_name,
       (SELECT COUNT(*) FROM registrations WHERE meetup_id = m.id) as registered_count
       FROM meetups m
       JOIN users u ON m.host_id = u.id
       WHERE m.date >= NOW()`;
    
    const params = [];
    
    if (search) {
      query += ` AND (m.title ILIKE $1 OR m.description ILIKE $1)`;
      params.push(`%${search}%`);
    }
    
    query += ` ORDER BY m.date ASC`;
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getMeetupById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT m.*, u.username as host_name,
       (SELECT COUNT(*) FROM registrations WHERE meetup_id = m.id) as registered_count
       FROM meetups m
       JOIN users u ON m.host_id = u.id
       WHERE m.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Meetup not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const createMeetup = async (req, res) => {
  try {
    const { title, description, date, location, category, capacity } = req.body;
    const hostId = req.user.id;

    const result = await pool.query(
      `INSERT INTO meetups (title, description, date, location, category, capacity, host_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [title, description, date, location, category, capacity, hostId]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const registerForMeetup = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const meetup = await pool.query(
      `SELECT m.*, (SELECT COUNT(*) FROM registrations WHERE meetup_id = m.id) as registered_count
       FROM meetups m WHERE m.id = $1`,
      [id]
    );

    if (meetup.rows.length === 0) {
      return res.status(404).json({ error: 'Meetup not found' });
    }

    if (meetup.rows[0].registered_count >= meetup.rows[0].capacity) {
      return res.status(400).json({ error: 'Meetup is full' });
    }

    const existing = await pool.query(
      'SELECT * FROM registrations WHERE user_id = $1 AND meetup_id = $2',
      [userId, id]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Already registered' });
    }

    await pool.query(
      'INSERT INTO registrations (user_id, meetup_id) VALUES ($1, $2)',
      [userId, id]
    );

    res.json({ message: 'Registration successful' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const unregisterFromMeetup = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const registration = await pool.query(
      'SELECT * FROM registrations WHERE user_id = $1 AND meetup_id = $2',
      [userId, id]
    );

    if (registration.rows.length === 0) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    await pool.query(
      'DELETE FROM registrations WHERE user_id = $1 AND meetup_id = $2',
      [userId, id]
    );

    res.json({ message: 'Unregistered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getAllMeetups,
  getMeetupById,
  createMeetup,
  registerForMeetup,
  unregisterFromMeetup
};

