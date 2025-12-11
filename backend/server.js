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

// Standard CORS for Render Web Service
app.use(cors());
app.use(express.json());

// Health check route matching your requirement
app.get('/auth/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/', (req, res) => {
  res.json({ message: 'Meeting App Backend Running' });
});

// Mount routes without /api prefix to match simplistic frontend config
// Frontend: `${API_URL}/auth/register` -> POST /auth/register
app.use('/auth', authRoutes);
app.use('/meetups', meetupRoutes);
app.use('/users', userRoutes);
// Note: reviewRoutes was mounted on /api/meetups usually. 
// If it handles /:id/reviews, we mount it on /meetups too? 
// Let's keep it consistent:
app.use('/meetups', reviewRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
