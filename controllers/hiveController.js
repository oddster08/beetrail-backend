// controllers/hiveController.js
const Hive = require('../models/Hive');
const { Parser } = require('json2csv');

const addHiveLog = async (req, res) => {
  try {
    const { hiveId, datePlaced, latitude, longitude, numColonies } = req.body;

    // Check if hiveId is unique
    const existing = await Hive.findOne({ hiveId });
    if (existing) {
      return res.status(400).json({ error: 'hiveId must be unique' });
    }

    // Validate lat/lng range
    if (
      latitude < -90 || latitude > 90 ||
      longitude < -180 || longitude > 180
    ) {
      return res.status(400).json({ error: 'Invalid latitude or longitude' });
    }

    const newHive = new Hive({
      hiveId,
      datePlaced,
      latitude,
      longitude,
      numColonies,
    });

    const savedHive = await newHive.save();
    res.status(201).json(savedHive);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// controllers/hiveController.js
const getHiveLogs = async (req, res) => {
    try {
      const { startDate, endDate, page = 1, limit = 10 } = req.query;
  
      const filter = {};
  
      if (startDate || endDate) {
        filter.datePlaced = {};
        if (startDate) filter.datePlaced.$gte = new Date(startDate);
        if (endDate) filter.datePlaced.$lte = new Date(endDate);
      }
  
      const hives = await Hive.find(filter)
        .sort({ datePlaced: -1 }) // latest first
        .skip((page - 1) * limit)
        .limit(Number(limit));
  
      const total = await Hive.countDocuments(filter);
  
      res.json({
        total,
        page: Number(page),
        limit: Number(limit),
        data: hives,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  const exportHiveLogs = async (req, res) => {
    try {
      const logs = await Hive.find().lean();
  
      if (!logs.length) {
        return res.status(404).json({ error: 'No hive logs found to export' });
      }
  
      const fields = ['hiveId', 'datePlaced', 'latitude', 'longitude', 'numColonies', 'createdAt'];
      const parser = new Parser({ fields });
      const csv = parser.parse(logs);
  
      res.header('Content-Type', 'text/csv');
      res.attachment('hive-logs.csv');
      return res.send(csv);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  module.exports = { addHiveLog, getHiveLogs, exportHiveLogs };
  
