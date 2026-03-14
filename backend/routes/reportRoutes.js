const express = require('express');
const router = express.Router();
const { addReport, getMyReports } = require('../controllers/reportController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.route('/')
  .post(protect, upload.single('document'), addReport)
  .get(protect, getMyReports);

module.exports = router;