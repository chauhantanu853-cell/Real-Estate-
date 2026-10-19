const express = require('express');
const router = express.Router();
const {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyProperties,
  approveProperty,
} = require('../controllers/propertyController');
const { protect } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');

router.get('/', getProperties);
router.get('/seller/my', protect, getMyProperties);
router.get('/:id', getProperty);
router.post('/', protect, createProperty);
router.put('/:id', protect, updateProperty);
router.delete('/:id', protect, deleteProperty);
router.put('/:id/approve', protect, roleCheck('admin'), approveProperty);

module.exports = router;
