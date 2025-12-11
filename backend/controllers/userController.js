const db = require('../db');

const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await db.query(
      'SELECT id, username, email, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getUserMeetups = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await db.query(
      `SELECT m.*, u.username as host_name,
       (SELECT COUNT(*) FROM registrations WHERE meetup_id = m.id) as registered_count,
       r.registered_at
       FROM registrations r
       JOIN meetups m ON r.meetup_id = m.id
       JOIN users u ON m.host_id = u.id
       WHERE r.user_id = $1 AND m.date >= NOW()
       ORDER BY m.date ASC`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getUserPastMeetups = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await db.query(
      `SELECT m.*, u.username as host_name,
       (SELECT COUNT(*) FROM registrations WHERE meetup_id = m.id) as registered_count,
       r.registered_at
       FROM registrations r
       JOIN meetups m ON r.meetup_id = m.id
       JOIN users u ON m.host_id = u.id
       WHERE r.user_id = $1 AND m.date < NOW()
       ORDER BY m.date DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getUserProfile,
  getUserMeetups,
  getUserPastMeetups
};

