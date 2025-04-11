// models/Hive.js
const mongoose = require('mongoose');

const hiveSchema = new mongoose.Schema({
  hiveId: {
    type: String,
    required: true,
    unique: true,
  },
  datePlaced: {
    type: Date,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
    min: -90,
    max: 90,
  },
  longitude: {
    type: Number,
    required: true,
    min: -180,
    max: 180,
  },
  numColonies: {
    type: Number,
    required: true,
    min: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Hive', hiveSchema);
