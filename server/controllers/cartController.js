const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id })
      .populate({
        path: 'items.product',
        select: 'name slug price compareAtPrice images sizes colors brand',
      });

    if (!cart) {
      cart = { items: [] };
    }

    res.json({
      success: true,
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching cart',
      error: error.message,
    });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
const addToCart = async (req, res) => {
  try {
    const { productId, size, color, quantity = 1 } = req.body;

    // Validate product exists and has stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Check size stock
    const sizeInfo = product.sizes.find(s => s.size === size);
    if (!sizeInfo) {
      return res.status(400).json({
        success: false,
        message: 'Selected size is not available',
      });
    }

    if (sizeInfo.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${sizeInfo.stock} items available in size ${size}`,
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Check if item already exists in cart (same product, size, color)
    const existingItem = cart.items.find(
      item => item.product.toString() === productId &&
              item.size === size &&
              item.color === (color || '')
    );

    if (existingItem) {
      const newQty = existingItem.quantity + quantity;
      if (newQty > sizeInfo.stock) {
        return res.status(400).json({
          success: false,
          message: `Cannot add more. Only ${sizeInfo.stock} available in size ${size}`,
        });
      }
      existingItem.quantity = newQty;
    } else {
      cart.items.push({
        product: productId,
        size,
        color: color || '',
        quantity,
      });
    }

    await cart.save();

    // Return populated cart
    await cart.populate({
      path: 'items.product',
      select: 'name slug price compareAtPrice images sizes colors brand',
    });

    res.json({
      success: true,
      message: 'Item added to cart',
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error adding to cart',
      error: error.message,
    });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/update
// @access  Private
const updateCartItem = async (req, res) => {
  try {
    const { itemId, quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart',
      });
    }

    // Validate stock
    const product = await Product.findById(item.product);
    if (product) {
      const sizeInfo = product.sizes.find(s => s.size === item.size);
      if (sizeInfo && quantity > sizeInfo.stock) {
        return res.status(400).json({
          success: false,
          message: `Only ${sizeInfo.stock} available in size ${item.size}`,
        });
      }
    }

    if (quantity <= 0) {
      cart.items.pull(itemId);
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    await cart.populate({
      path: 'items.product',
      select: 'name slug price compareAtPrice images sizes colors brand',
    });

    res.json({
      success: true,
      message: 'Cart updated',
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error updating cart',
      error: error.message,
    });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:itemId
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    cart.items.pull(req.params.itemId);
    await cart.save();
    await cart.populate({
      path: 'items.product',
      select: 'name slug price compareAtPrice images sizes colors brand',
    });

    res.json({
      success: true,
      message: 'Item removed from cart',
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error removing from cart',
      error: error.message,
    });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart/clear
// @access  Private
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.json({
      success: true,
      message: 'Cart cleared',
      data: { items: [] },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error clearing cart',
      error: error.message,
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
