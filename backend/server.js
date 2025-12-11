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

// 1. ABSOLUTE FIRST: MANUAL CORS HEADERS for AWS Lambda
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  if (req.method === 'OPTIONS') {
    return res.status(200).send();
  }
  next();
});

app.use(cors());
app.use(express.json());


// Logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
=======
dev
// Global health
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get('/', (req, res) => {
  res.json({ message: 'API running' });
});


app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', platform: 'aws-lambda' });
});

// Mount routes WITH /api prefix again
app.use('/api/auth', authRoutes);
app.use('/api/meetups', meetupRoutes);
app.use('/api/users', userRoutes);
app.use('/api/meetups', reviewRoutes);
=======
start();
=======
// --- HEALTH CHECKS (Must be top level) ---
console.log('Registering health routes...');

app.get("/health", (req, res) => {
  console.log('Health check called!');
  res.json({ status: "ok", service: "backend" });
});

app.get("/auth/health", (req, res) => {
  console.log('Auth check called!');
  res.json({ status: "ok", service: "backend-auth" });
});
// -----------------------------------------

app.get('/', (req, res) => {
  res.send('API is running');
});

// Mounted routes
app.use('/auth', authRoutes);
app.use('/meetups', meetupRoutes);
app.use('/users', userRoutes);
app.use('/meetups', reviewRoutes);


app.use(errorHandler);

app.listen(PORT, () => {

  console.log(`Server started on port ${PORT}`);
});
=======
  console.log(`Server running on port ${PORT}`);
});


