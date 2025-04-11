// controllers/cropController.js
const Crop = require('../models/Crop');
const { haversineDistance } = require('../utils/geo');

const addCropEntry = async (req, res) => {
  try {
    const {
      name,
      floweringStart,
      floweringEnd,
      latitude,
      longitude,
      recommendedHiveDensity,
    } = req.body;

    // Validate lat/lng range
    if (
      latitude < -90 || latitude > 90 ||
      longitude < -180 || longitude > 180
    ) {
      return res.status(400).json({ error: 'Invalid latitude or longitude' });
    }

    if (new Date(floweringEnd) < new Date(floweringStart)) {
      return res.status(400).json({ error: 'floweringEnd must be after floweringStart' });
    }

    const crop = new Crop({
      name,
      floweringStart,
      floweringEnd,
      latitude,
      longitude,
      recommendedHiveDensity,
    });

    const saved = await crop.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getNearbyCrops = async (req, res) => {
    try {
      const { latitude, longitude, radius = 100, date } = req.query;
  
      if (!latitude || !longitude) {
        return res.status(400).json({ error: 'latitude and longitude are required' });
      }
  
      const queryDate = date ? new Date(date) : new Date();
  
      // Get all crops whose flowering window includes the date
      const allCrops = await Crop.find({
        floweringStart: { $lte: queryDate },
        floweringEnd: { $gte: queryDate },
      });
  
      // Filter by distance
      const nearby = allCrops.filter(crop => {
        const distance = haversineDistance(
          parseFloat(latitude),
          parseFloat(longitude),
          crop.latitude,
          crop.longitude
        );
        return distance <= radius;
      });
  
      res.json({
        count: nearby.length,
        crops: nearby,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  module.exports = {
    addCropEntry,
    getNearbyCrops
  };
