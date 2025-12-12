const express = require('express');
const router = express.Router();
// Import from meetupController for meetup logic
const { getAllMeetups, getMeetupById, createMeetup, registerForMeetup, unregisterFromMeetup } = require('../controllers/meetupController');
// Import from reviewController for review logic
const { addReview, getReviews } = require('../controllers/reviewController');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

router.get('/', getAllMeetups);
router.get('/:id', optionalAuth, getMeetupById); // Updated to use optionalAuth
router.post('/', authenticateToken, createMeetup);
router.post('/:id/register', authenticateToken, registerForMeetup);
router.delete('/:id/register', authenticateToken, unregisterFromMeetup);

// Review routes
router.post('/:id/reviews', authenticateToken, addReview);
router.get('/:id/reviews', getReviews);

module.exports = router;
