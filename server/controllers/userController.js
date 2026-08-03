const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Get all users (admin)
// @route   GET /api/users
// @access  Admin
const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const filter = { role: 'customer' };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      User.countDocuments(filter),
    ]);

    // Attach order count to each user
    const usersWithOrders = await Promise.all(
      users.map(async (user) => {
        const orderCount = await Order.countDocuments({ user: user._id });
        return { ...user, orderCount };
      })
    );

    res.json({
      success: true,
      data: usersWithOrders,
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
      message: 'Server error fetching users',
      error: error.message,
    });
  }
};

// @desc    Get single user with orders (admin)
// @route   GET /api/users/:id
// @access  Admin
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password').lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const orders = await Order.find({ user: req.params.id })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    res.json({
      success: true,
      data: {
        ...user,
        orders,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching user',
      error: error.message,
    });
  }
};

// @desc    Get dashboard stats (admin)
// @route   GET /api/users/stats/dashboard
// @access  Admin
const getDashboardStats = async (req, res) => {
  try {
    const [
      totalCustomers,
      totalProducts,
      totalOrders,
      revenue,
      lowStockProducts,
      recentOrders,
    ] = await Promise.all([
      User.countDocuments({ role: 'customer' }),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { orderStatus: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Product.find({
        'sizes.stock': { $lte: 5 },
      }).select('name sizes images brand').limit(10).lean(),
      Order.find()
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),
    ]);

    res.json({
      success: true,
      data: {
        totalCustomers,
        totalProducts,
        totalOrders,
        totalRevenue: revenue[0]?.total || 0,
        lowStockProducts: lowStockProducts.filter(p =>
          p.sizes.some(s => s.stock <= 5)
        ),
        recentOrders,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching dashboard stats',
      error: error.message,
    });
  }
};

module.exports = {
  getUsers,
  getUserById,
  getDashboardStats,
};
