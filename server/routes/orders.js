const express = require('express');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');
const {
  placeOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  getOrderStats,
} = require('../controllers/orderController');

const router = express.Router();

// Protected customer routes
router.post('/', protect, placeOrder);
router.get('/my-orders', protect, getMyOrders);

// Admin routes (must come before /:id)
router.get('/stats', protect, admin, getOrderStats);
router.get('/all', protect, admin, getAllOrders);
router.put('/:id/status', protect, admin, updateOrderStatus);

// Shared route (customer or admin)
router.get('/:id', protect, getOrderById);

module.exports = router;
