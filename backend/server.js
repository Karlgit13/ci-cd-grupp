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

// Basic CORS config for Lambda
app.use(cors({
  origin: '*', // Allow all origins explicitly
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type, Authorization, X-Requested-With',
  credentials: true
}));

app.use(express.json());

// Explicit OPTIONS handling for preflight
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.sendStatus(200);
});

app.get('/', (req, res) => {
  res.json({ message: 'API running' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/meetups', meetupRoutes);
app.use('/api/users', userRoutes);
app.use('/api/meetups', reviewRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
