const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  hotel: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Hotel', 
    required: true 
  },
  documentCategory: { type: String, required: true },
  documentUrl: { type: String, required: true },
  issueDate: { type: Date, required: true },
  expiryDate: { type: Date, required: true },
  institutionName: { type: String, required: true },
  documentType: { type: String },
  warningSent: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);