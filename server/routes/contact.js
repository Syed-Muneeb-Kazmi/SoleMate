const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');
const {
  submitContact,
  getContacts,
  markAsRead,
} = require('../controllers/contactController');

const router = express.Router();

// Public
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('subject').trim().notEmpty().withMessage('Subject is required'),
    body('message').trim().notEmpty().withMessage('Message is required'),
  ],
  validate,
  submitContact
);

// Admin
router.get('/', protect, admin, getContacts);
router.put('/:id/read', protect, admin, markAsRead);

module.exports = router;
