const express = require('express');
const router = express.Router();
const { addReview, getReviews } = require('../controllers/reviewController');
const { authenticateToken } = require('../middleware/auth');

router.post('/:id/reviews', authenticateToken, addReview);
router.get('/:id/reviews', getReviews);

module.exports = router;

