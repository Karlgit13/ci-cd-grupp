require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const meetupRoutes = require('./routes/meetups');
const userRoutes = require('./routes/users');
const reviewRoutes = require('./routes/reviews');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// 1. ABSOLUTE FIRST: MANUAL CORS HEADERS
// This ensures headers are present even if later middleware fails
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  // Handle preflight immediately and stop processing
  if (req.method === 'OPTIONS') {
    return res.status(200).send();
  }

  next();
});

// 2. Request Logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// 3. Json Body Parser
app.use(express.json());

// 4. Routes
app.get('/', (req, res) => {
  res.json({ message: 'API running', timestamp: new Date().toISOString() });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', env: process.env.NODE_ENV });
});

app.use('/api/auth', authRoutes);
app.use('/api/meetups', meetupRoutes);
app.use('/api/users', userRoutes);
app.use('/api/meetups', reviewRoutes);

// 5. Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  // Ensure CORS headers on error too (though middleware above should cover it)
  res.header('Access-Control-Allow-Origin', '*');
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
