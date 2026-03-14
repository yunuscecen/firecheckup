const express = require('express');
const router = express.Router();
const { createPayment, getMyPayments } = require('../controllers/paymentController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
  .post(protect, createPayment)
  .get(protect, getMyPayments);

module.exports = router;