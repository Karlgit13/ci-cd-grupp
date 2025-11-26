cat > meetupRoutes.js << 'EOF'
const express = require('express');
const db = require('./db');
const { authRequired } = require('./authMiddleware');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { search, category, dateFrom, dateTo } = req.query;
    
    let query = `
      SELECT m.*, 
        u.name as organizer_name,
        COUNT(DISTINCT r.id) as registered_count,
        COALESCE(AVG(rv.rating), 0) as avg_rating
      FROM meetups m
      LEFT JOIN users u ON m.created_by = u.id
      LEFT JOIN registrations r ON m.id = r.meetup_id
      LEFT JOIN reviews rv ON m.id = rv.meetup_id
      WHERE m.start_time > NOW()
    `;
    
    const params = [];
    let paramIndex = 1;
    
    if (search) {
      query += ` AND (m.title ILIKE $${paramIndex} OR m.description ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }
    
    if (category) {
      query += ` AND m.category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }
    
    if (dateFrom) {
      query += ` AND m.start_time >= $${paramIndex}`;
      params.push(dateFrom);
      paramIndex++;
    }
    
    if (dateTo) {
      query += ` AND m.start_time <= $${paramIndex}`;
      params.push(dateTo);
      paramIndex++;
    }
    
    query += ` GROUP BY m.id, u.name ORDER BY m.start_time ASC`;
    
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const meetupResult = await db.query(`
      SELECT m.*, 
        u.name as organizer_name,
        COUNT(DISTINCT r.id) as registered_count,
        COALESCE(AVG(rv.rating), 0) as avg_rating
      FROM meetups m
      LEFT JOIN users u ON m.created_by = u.id
      LEFT JOIN registrations r ON m.id = r.meetup_id
      LEFT JOIN reviews rv ON m.id = rv.meetup_id
      WHERE m.id = $1
      GROUP BY m.id, u.name
    `, [id]);
    
    if (meetupResult.rows.length === 0) {
      return res.status(404).json({ error: 'Meetup not found' });
    }
    
    res.json(meetupResult.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', authRequired, async (req, res) => {
  try {
    const { title, description, location, category, start_time, capacity } = req.body;
    
    if (!title || !location || !start_time) {
      return res.status(400).json({ error: 'Title, location and start_time are required' });
    }
    
    const result = await db.query(`
      INSERT INTO meetups (title, description, location, category, start_time, capacity, created_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [title, description, location, category, start_time, capacity || 50, req.user.id]);
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:id/register', authRequired, async (req, res) => {
  try {
    const { id } = req.params;
    
    const meetupResult = await db.query(`
      SELECT m.capacity, COUNT(r.id) as registered_count
      FROM meetups m
      LEFT JOIN registrations r ON m.id = r.meetup_id
      WHERE m.id = $1
      GROUP BY m.id
    `, [id]);
    
    if (meetupResult.rows.length === 0) {
      return res.status(404).json({ error: 'Meetup not found' });
    }
    
    const meetup = meetupResult.rows[0];
    if (parseInt(meetup.registered_count) >= meetup.capacity) {
      return res.status(400).json({ error: 'Meetup is full' });
    }
    
    const result = await db.query(`
      INSERT INTO registrations (user_id, meetup_id)
      VALUES ($1, $2)
      RETURNING *
    `, [req.user.id, id]);
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Already registered' });
    }
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id/register', authRequired, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.query(`
      DELETE FROM registrations
      WHERE user_id = $1 AND meetup_id = $2
      RETURNING *
    `, [req.user.id, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Registration not found' });
    }
    
    res.json({ message: 'Unregistered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id/reviews', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.query(`
      SELECT r.*, u.name as user_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.meetup_id = $1
      ORDER BY r.created_at DESC
    `, [id]);
    
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:id/reviews', authRequired, async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    
    const result = await db.query(`
      INSERT INTO reviews (user_id, meetup_id, rating, comment)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [req.user.id, id, rating, comment]);
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Already reviewed' });
    }
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

