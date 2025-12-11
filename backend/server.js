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

app.use(cors({
  origin: [
    'https://ci-cd-frontend-karl.onrender.com', // Render Frontend
    'http://localhost:3000', // Local development
    'http://cicd-grupp-exam.s3-website.eu-north-1.amazonaws.com' // S3 Bucket Website
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/meetups', meetupRoutes);
app.use('/api/users', userRoutes);
app.use('/api/meetups', reviewRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

