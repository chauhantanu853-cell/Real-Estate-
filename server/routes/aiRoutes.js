const express = require('express');
const router = express.Router();
const { aiSearch, aiDescription, aiPriceEstimate } = require('../controllers/aiController');

router.post('/search', aiSearch);
router.post('/description', aiDescription);
router.post('/price-estimate', aiPriceEstimate);

module.exports = router;
