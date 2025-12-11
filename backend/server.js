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

app.use(cors());
app.use(express.json());

// HEALTHCHECK
app.get("/auth/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get('/', (req, res) => {
  res.send('API is running');
});

// Mounted routes matching frontend expectations
app.use('/auth', authRoutes);
app.use('/meetups', meetupRoutes);
app.use('/users', userRoutes);
app.use('/meetups', reviewRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
