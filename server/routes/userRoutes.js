const express = require('express');
const router = express.Router();
const {
  getUsers,
  getSellers,
  getAllProperties,
  deleteUser,
  getStats,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');

router.use(protect, roleCheck('admin'));

router.get('/stats', getStats);
router.get('/users', getUsers);
router.get('/sellers', getSellers);
router.get('/properties', getAllProperties);
router.delete('/users/:id', deleteUser);

module.exports = router;
