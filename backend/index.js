cat > index.js << 'EOF'
const express = require('express');
const cors = require('cors');
const authRoutes = require('./authRoutes');
const meetupRoutes = require('./meetupRoutes');
const { authRequired } = require('./authMiddleware');
const db = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/meetups', meetupRoutes);

app.get('/api/users/me/registrations', authRequired, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT m.*, r.created_at as registered_at
      FROM registrations r
      JOIN meetups m ON r.meetup_id = m.id
      WHERE r.user_id = $1
      ORDER BY m.start_time ASC
    `, [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
EOF