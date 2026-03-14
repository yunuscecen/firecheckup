const express = require('express');
const router = express.Router();
const { searchHotel } = require('../controllers/publicController');

router.get('/search/:query', searchHotel);

module.exports = router;