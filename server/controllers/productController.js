const Product = require('../models/Product');
const Category = require('../models/Category');
const mongoose = require('mongoose');

// @desc    Get all products (with filters, sort, pagination, search)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const {
      category, brand, gender, color, size,
      minPrice, maxPrice,
      search, sort, page = 1, limit = 12,
      featured, newArrivals,
    } = req.query;

    const filter = {};

    if (category) {
      const catArray = category.split(',').map(c => c.trim()).filter(Boolean);
      const allCatIds = new Set();

      for (const catVal of catArray) {
        const isValidObjectId = mongoose.Types.ObjectId.isValid(catVal);
        let catDoc = null;
        if (isValidObjectId) {
          catDoc = await Category.findById(catVal);
        }
        if (!catDoc) {
          catDoc = await Category.findOne({ slug: catVal });
        }

        if (catDoc) {
          allCatIds.add(catDoc._id);
          const subCats = await Category.find({ parent: catDoc._id }).select('_id');
          subCats.forEach(sc => allCatIds.add(sc._id));
        } else if (isValidObjectId) {
          allCatIds.add(catVal);
        }
      }

      if (allCatIds.size > 0) {
        filter.category = { $in: Array.from(allCatIds) };
      }
    }

    if (brand) {
      const brandArray = brand.split(',').map(b => b.trim()).filter(Boolean);
      if (brandArray.length > 0) {
        filter.brand = { $in: brandArray.map(b => new RegExp(`^${b.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i')) };
      }
    }

    if (gender) {
      const genderArray = gender.split(',').map(g => g.trim()).filter(Boolean);
      if (genderArray.length > 0) {
        const genderSet = new Set(genderArray);
        if (!genderSet.has('unisex') && (genderSet.has('men') || genderSet.has('women'))) {
          genderSet.add('unisex');
        }
        filter.gender = { $in: Array.from(genderSet) };
      }
    }

    if (color) {
      const colorArray = color.split(',').map(c => c.trim()).filter(Boolean);
      if (colorArray.length > 0) {
        filter['colors.name'] = { $in: colorArray.map(c => new RegExp(c, 'i')) };
      }
    }

    if (size) {
      const sizeArray = size.split(',').map(s => s.trim()).filter(Boolean);
      if (sizeArray.length > 0) {
        filter['sizes.size'] = { $in: sizeArray };
      }
    }
    if (featured === 'true') filter.isFeatured = true;
    if (newArrivals === 'true') filter.isNewArrival = true;

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    // Sort options
    let sortOption = { createdAt: -1 }; // default: newest
    if (sort === 'price_asc') sortOption = { price: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1 };
    else if (sort === 'name_asc') sortOption = { name: 1 };
    else if (sort === 'name_desc') sortOption = { name: -1 };
    else if (sort === 'popular') sortOption = { ratingsCount: -1, createdAt: -1 };
    else if (sort === 'rating') sortOption = { ratingsAverage: -1, ratingsCount: -1 };

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('category', 'name slug')
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Product.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching products',
      error: error.message,
    });
  }
};

// @desc    Get single product by slug
// @route   GET /api/products/slug/:slug
// @access  Public
const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate('category', 'name slug');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching product',
      error: error.message,
    });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching product',
      error: error.message,
    });
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true })
      .populate('category', 'name slug')
      .limit(8)
      .lean();

    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching featured products',
      error: error.message,
    });
  }
};

// @desc    Get new arrivals
// @route   GET /api/products/new-arrivals
// @access  Public
const getNewArrivals = async (req, res) => {
  try {
    const products = await Product.find({ isNewArrival: true })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .limit(8)
      .lean();

    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching new arrivals',
      error: error.message,
    });
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Admin
const createProduct = async (req, res) => {
  try {
    if (!req.body.category) {
      return res.status(400).json({
        success: false,
        message: 'Category is required',
        error: 'Please select a valid category for the product.',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(req.body.category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Category ID',
        error: `The category ID "${req.body.category}" is not valid.`,
      });
    }

    const product = await Product.create(req.body);
    await product.populate('category', 'name slug');

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        error: messages.join(', '),
        errors: messages,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error creating product',
      error: error.message,
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Admin
const updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      product[key] = req.body[key];
    });

    await product.save();
    await product.populate('category', 'name slug');

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error updating product',
      error: error.message,
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error deleting product',
      error: error.message,
    });
  }
};

// @desc    Upload product images
// @route   POST /api/products/:id/images
// @access  Admin
const uploadProductImages = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No images uploaded',
      });
    }

    const imageUrls = req.files.map(file => `/uploads/${file.filename}`);
    product.images.push(...imageUrls);
    await product.save();

    res.json({
      success: true,
      message: 'Images uploaded successfully',
      data: { images: product.images },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error uploading images',
      error: error.message,
    });
  }
};

// @desc    Get all brands (unique)
// @route   GET /api/products/brands
// @access  Public
const getBrands = async (req, res) => {
  try {
    const brands = await Product.distinct('brand');
    res.json({
      success: true,
      data: brands.sort(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching brands',
      error: error.message,
    });
  }
};

module.exports = {
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
};
