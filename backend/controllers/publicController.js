const Hotel = require('../models/Hotel');
const Report = require('../models/Report');

const searchHotel = async (req, res) => {
  try {
    const { query } = req.params;

    const hotel = await Hotel.findOne({
      $or: [{ hotelCode: query }, { hotelName: { $regex: query, $options: 'i' } }]
    }).select('-password -taxOffice -taxNumber -address -email');

    if (!hotel) {
      return res.status(404).json({ message: 'Aradığınız kriterlere uygun otel bulunamadı.' });
    }

    const reports = await Report.find({ hotel: hotel._id }).sort({ expiryDate: -1 });

    const processedReports = reports.map(report => {
      const expiry = new Date(report.expiryDate);
      const today = new Date();
      const diffTime = expiry.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let statusColor = 'yesil';
      if (diffDays < 0) {
        statusColor = 'kirmizi';
      } else if (diffDays <= 30) {
        statusColor = 'sari';
      }

      return {
        _id: report._id,
        documentCategory: report.documentCategory,
        institutionName: report.institutionName,
        issueDate: report.issueDate,
        expiryDate: report.expiryDate,
        documentUrl: report.documentUrl,
        statusColor
      };
    });

    res.json({
      hotelName: hotel.hotelName,
      hotelCode: hotel.hotelCode,
      isActive: hotel.isActive,
      reports: processedReports
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { searchHotel };