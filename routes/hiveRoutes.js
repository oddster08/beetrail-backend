// routes/hiveRoutes.js
const express = require('express');
const router = express.Router();
const { addHiveLog, getHiveLogs, exportHiveLogs } = require('../controllers/hiveController');

router.post('/', addHiveLog);
router.get('/', getHiveLogs);
router.get('/export', exportHiveLogs);

module.exports = router;
