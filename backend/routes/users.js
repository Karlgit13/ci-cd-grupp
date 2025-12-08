const express = require('express');
const router = express.Router();
const { getUserProfile, getUserMeetups, getUserPastMeetups } = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');

router.get('/me', authenticateToken, getUserProfile);
router.get('/me/meetups', authenticateToken, getUserMeetups);
router.get('/me/past-meetups', authenticateToken, getUserPastMeetups);

module.exports = router;

