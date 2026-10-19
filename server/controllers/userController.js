const User = require('../models/User');
const Property = require('../models/Property');

// @desc    Get all users (admin)
// @route   GET /api/admin/users
const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'buyer' }).sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all sellers (admin)
// @route   GET /api/admin/sellers
const getSellers = async (req, res) => {
  try {
    const sellers = await User.find({ role: 'seller' }).sort({ createdAt: -1 });

    // Get property count for each seller
    const sellersWithStats = await Promise.all(
      sellers.map(async (seller) => {
        const propertyCount = await Property.countDocuments({ seller: seller._id });
        return { ...seller.toObject(), propertyCount };
      })
    );

    res.json(sellersWithStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all properties (admin - any status)
// @route   GET /api/admin/properties
const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find()
      .populate('seller', 'name email')
      .sort({ createdAt: -1 });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user (admin)
// @route   DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot delete admin users' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dashboard stats (admin)
// @route   GET /api/admin/stats
const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'buyer' });
    const totalSellers = await User.countDocuments({ role: 'seller' });
    const totalProperties = await Property.countDocuments();
    const pendingApprovals = await Property.countDocuments({ status: 'pending' });
    const approvedProperties = await Property.countDocuments({ status: 'approved' });
    const soldProperties = await Property.countDocuments({ status: 'sold' });

    res.json({
      totalUsers,
      totalSellers,
      totalProperties,
      pendingApprovals,
      approvedProperties,
      soldProperties,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUsers, getSellers, getAllProperties, deleteUser, getStats };
