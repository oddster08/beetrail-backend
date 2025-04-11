// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const hiveRoutes = require('./routes/hiveRoutes');
const cropRoutes = require('./routes/cropRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/hives', hiveRoutes);
// DB Connection
connectDB();

// Test route
app.get('/', (req, res) => {
  res.send('BeeTrail API is running 🐝');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
