const express = require('express');
const router = express.Router();
const { getAllMeetups, getMeetupById, createMeetup, registerForMeetup, unregisterFromMeetup, addReview, getReviews } = require('../controllers/meetupController');
const { authenticateToken } = require('../middleware/auth');

router.get('/', getAllMeetups);
router.get('/:id', getMeetupById);
router.post('/', authenticateToken, createMeetup);
router.post('/:id/register', authenticateToken, registerForMeetup);
router.delete('/:id/register', authenticateToken, unregisterFromMeetup);

// Review routes
router.post('/:id/reviews', authenticateToken, addReview);
router.get('/:id/reviews', getReviews);

module.exports = router;

