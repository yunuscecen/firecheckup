const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  hotel: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Hotel', 
    required: true 
  },
  amount: { type: Number, required: true },
  paymentMethod: { 
    type: String, 
    enum: ['kredi_karti', 'havale'], 
    required: true 
  },
  paymentDate: { type: Date, default: Date.now },
  year: { type: Number, required: true }, 
  status: { 
    type: String, 
    enum: ['bekliyor', 'onaylandi', 'iptal'], 
    default: 'bekliyor' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);