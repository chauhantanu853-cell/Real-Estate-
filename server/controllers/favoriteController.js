const Favorite = require('../models/Favorite');

// @desc    Get user's favorites
// @route   GET /api/favorites
const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id })
      .populate({
        path: 'property',
        populate: { path: 'seller', select: 'name email phone' },
      })
      .sort({ createdAt: -1 });

    res.json(favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle favorite
// @route   POST /api/favorites/:propertyId
const toggleFavorite = async (req, res) => {
  try {
    const existing = await Favorite.findOne({
      user: req.user._id,
      property: req.params.propertyId,
    });

    if (existing) {
      await Favorite.findByIdAndDelete(existing._id);
      res.json({ message: 'Removed from favorites', favorited: false });
    } else {
      await Favorite.create({
        user: req.user._id,
        property: req.params.propertyId,
      });
      res.json({ message: 'Added to favorites', favorited: true });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getFavorites, toggleFavorite };
