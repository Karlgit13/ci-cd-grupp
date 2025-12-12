const pool = require('../db');

const addReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    // 1. Validation
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    if (!comment || comment.trim() === '') {
      return res.status(400).json({ error: 'Comment is required' });
    }

    // 2. Check if user attended (isRegistered AND past date)
    const checkQuery = `
      SELECT m.date,
      EXISTS(SELECT 1 FROM registrations WHERE meetup_id = m.id AND user_id = $2) as "isRegistered"
      FROM meetups m
      WHERE m.id = $1
    `;

    const checkResult = await pool.query(checkQuery, [id, userId]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Meetup not found' });
    }

    const { date, isRegistered } = checkResult.rows[0];
    const isPast = new Date(date) < new Date();
    const hasAttended = isRegistered && isPast;

    if (!hasAttended) {
      return res.status(403).json({ error: 'You can only review meetups you attended' });
    }

    // 3. UPSERT Review
    const result = await pool.query(
      `INSERT INTO reviews (user_id, meetup_id, rating, comment, created_at)
       VALUES ($1, $2, $3, $4, NOW())
       ON CONFLICT (user_id, meetup_id)
       DO UPDATE SET rating = $3, comment = $4, created_at = NOW()
       RETURNING *`,
      [userId, id, rating, comment]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error in addReview:', error);
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
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  addReview,
  getReviews
};
