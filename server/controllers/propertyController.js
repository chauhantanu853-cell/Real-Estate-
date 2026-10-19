const Property = require('../models/Property');

// @desc    Get all approved properties (with filters)
// @route   GET /api/properties
const getProperties = async (req, res) => {
  try {
    const { type, minPrice, maxPrice, city, bedrooms, search, page = 1, limit = 12 } = req.query;

    const filter = { status: 'approved' };

    if (type) filter.type = type;
    if (city) filter['location.city'] = new RegExp(city, 'i');
    if (bedrooms) filter.bedrooms = { $gte: Number(bedrooms) };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) {
      filter.$text = { $search: search };
    }

    const total = await Property.countDocuments(filter);
    const properties = await Property.find(filter)
      .populate('seller', 'name email phone avatar')
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.json({
      properties,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single property
// @route   GET /api/properties/:id
const getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('seller', 'name email phone avatar');

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create property
// @route   POST /api/properties
const createProperty = async (req, res) => {
  try {
    const {
      title, description, type, price, area,
      bedrooms, bathrooms, location, amenities, images,
    } = req.body;

    const property = await Property.create({
      title,
      description,
      type,
      price,
      area,
      bedrooms: bedrooms || 0,
      bathrooms: bathrooms || 0,
      location,
      amenities: amenities || [],
      images: images || [],
      seller: req.user._id,
      status: 'approved',
    });

    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update property
// @route   PUT /api/properties/:id
const updateProperty = async (req, res) => {
  try {
    let property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check ownership or admin
    if (property.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (property.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Property.findByIdAndDelete(req.params.id);
    res.json({ message: 'Property deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get seller's properties
// @route   GET /api/properties/seller/my
const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({ seller: req.user._id })
      .sort({ createdAt: -1 });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve / Reject property (admin)
// @route   PUT /api/properties/:id/approve
const approveProperty = async (req, res) => {
  try {
    const { status } = req.body; // 'approved' or 'rejected'
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyProperties,
  approveProperty,
};
