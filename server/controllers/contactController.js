const Contact = require('../models/Contact');

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    const contact = await Contact.create({ name, email, subject, message });

    res.status(201).json({
      success: true,
      message: 'Your message has been sent. We\'ll get back to you soon!',
      data: contact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error submitting contact form',
      error: error.message,
    });
  }
};

// @desc    Get all contact submissions (admin)
// @route   GET /api/contact
// @access  Admin
const getContacts = async (req, res) => {
  try {
    const { page = 1, limit = 20, unreadOnly } = req.query;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const filter = {};
    if (unreadOnly === 'true') filter.isRead = false;

    const [contacts, total] = await Promise.all([
      Contact.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Contact.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: contacts,
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
      message: 'Server error fetching contacts',
      error: error.message,
    });
  }
};

// @desc    Mark contact as read
// @route   PUT /api/contact/:id/read
// @access  Admin
const markAsRead = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact submission not found',
      });
    }

    res.json({
      success: true,
      message: 'Marked as read',
      data: contact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error updating contact',
      error: error.message,
    });
  }
};

module.exports = {
  submitContact,
  getContacts,
  markAsRead,
};
