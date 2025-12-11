require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');
const authRoutes = require('./routes/auth');
const meetupRoutes = require('./routes/meetups');
const userRoutes = require('./routes/users');
const reviewRoutes = require('./routes/reviews');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health endpoints
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/auth/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/', (req, res) => {
  res.json({ message: 'API running' });
});

// Mount routes WITHOUT /api prefix
app.use('/auth', authRoutes);
app.use('/meetups', reviewRoutes); // Mount reviews at /meetups/:id/reviews
app.use('/meetups', meetupRoutes);
app.use('/users', userRoutes);

app.use(errorHandler);

async function start() {
  // Try to initialize database, but don't crash if it fails
  await db.init();

  app.listen(PORT, () => {
    console.log(`\n🚀 API running on port ${PORT}`);
    console.log(`   Health: http://localhost:${PORT}/health`);
    console.log(`   Auth Health: http://localhost:${PORT}/auth/health\n`);
  });
}

start();
