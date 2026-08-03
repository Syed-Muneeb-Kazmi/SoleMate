const express = require('express');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');
const {
  getUsers,
  getUserById,
  getDashboardStats,
} = require('../controllers/userController');

const router = express.Router();

// All routes require admin access
router.use(protect, admin);

router.get('/stats/dashboard', getDashboardStats);
router.get('/', getUsers);
router.get('/:id', getUserById);

module.exports = router;
