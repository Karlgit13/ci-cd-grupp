const pool = require('../config/db');

const addReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const meetup = await pool.query(
      'SELECT * FROM meetups WHERE id = $1 AND date < NOW()',
      [id]
    );

    if (meetup.rows.length === 0) {
      return res.status(400).json({ error: 'Can only review past meetups' });
    }

    const attendance = await pool.query(
      'SELECT * FROM registrations WHERE user_id = $1 AND meetup_id = $2',
      [userId, id]
    );

    if (attendance.rows.length === 0) {
      return res.status(400).json({ error: 'Can only review meetups you attended' });
    }

    const existing = await pool.query(
      'SELECT * FROM reviews WHERE user_id = $1 AND meetup_id = $2',
      [userId, id]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Already reviewed this meetup' });
    }

    const result = await pool.query(
      'INSERT INTO reviews (user_id, meetup_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, id, rating, comment]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getReviews = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT r.*, u.username
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.meetup_id = $1
       ORDER BY r.created_at DESC`,
      [id]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  addReview,
  getReviews
};

