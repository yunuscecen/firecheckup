const express = require('express');
const router = express.Router();
const { createHotel, loginHotel, getAllHotelsAdmin } = require('../controllers/hotelController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', createHotel);
router.post('/login', loginHotel);
router.get('/', protect, getAllHotelsAdmin); 

module.exports = router;