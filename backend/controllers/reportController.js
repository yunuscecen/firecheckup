const Report = require('../models/Report');
const cloudinary = require('../config/cloudinary');

const addReport = async (req, res) => {
  try {
    const { issueDate, expiryDate, institutionName, documentCategory } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Lütfen bir belge yükleyin.' });
    }

    const b64 = Buffer.from(req.file.buffer).toString('base64');
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'hotel_reports',
      resource_type: 'auto' 
    });

    const documentUrl = result.secure_url;

    const report = await Report.create({
      hotel: req.hotel._id,
      documentCategory,
      documentUrl,
      issueDate,
      expiryDate,
      institutionName,
      documentType: req.file.mimetype
    });

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ hotel: req.hotel._id }).sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addReport, getMyReports };