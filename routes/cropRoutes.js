// routes/cropRoutes.js
const express = require('express');
const router = express.Router();
const { addCropEntry, getNearbyCrops } = require('../controllers/cropController');

router.post('/', addCropEntry);
router.get('/nearby', getNearbyCrops);

module.exports = router;
