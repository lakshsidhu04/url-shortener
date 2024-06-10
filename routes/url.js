const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const { handleUrlShorten } = require('../controllers/shortGenerator');
const router = express.Router();
const url = require('../models/url');

router.post('/shorten', handleUrlShorten);


module.exports = router; 