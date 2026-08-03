const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const {
  createReview,
  getProductReviews,
  deleteReview,
} = require('../controllers/reviewController');

const router = express.Router();

// Public
router.get('/product/:productId', getProductReviews);

// Protected
router.post(
  '/',
  protect,
  [
    body('productId').notEmpty().withMessage('Product ID is required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').trim().notEmpty().withMessage('Comment is required'),
  ],
  validate,
  createReview
);

router.delete('/:id', protect, deleteReview);

module.exports = router;
