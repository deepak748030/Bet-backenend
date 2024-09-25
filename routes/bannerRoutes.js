const express = require('express');
const { addBanner, getAllBanners } = require('../controllers/bannerController'); // Adjust the path as necessary

const router = express.Router();

// POST request to add a new banner
router.post('/', addBanner);

// GET request to retrieve all banners
router.get('/', getAllBanners);

module.exports = router;
