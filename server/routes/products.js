const express = require('express');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');
const upload = require('../middleware/upload');
const {
  getProducts,
  getProductBySlug,
  getProductById,
  getFeaturedProducts,
  getNewArrivals,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  getBrands,
} = require('../controllers/productController');

const router = express.Router();

// Public routes — order matters: specific routes before param routes
router.get('/featured', getFeaturedProducts);
router.get('/new-arrivals', getNewArrivals);
router.get('/brands', getBrands);
router.get('/', getProducts);
router.get('/slug/:slug', getProductBySlug);
router.get('/:id', getProductById);

// Admin routes
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);
router.post('/:id/images', protect, admin, upload.array('images', 10), uploadProductImages);

module.exports = router;
