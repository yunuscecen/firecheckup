const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const hotelSchema = new mongoose.Schema({
  hotelCode: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  hotelName: { type: String, required: true },
  taxOffice: { type: String, required: true },
  taxNumber: { type: String, required: true },
  address: { type: String, required: true },
  membershipStartDate: { type: Date, required: true },
  membershipEndDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// GÜNCELLENEN KISIM: next parametresi ve next() çağrıları tamamen kaldırıldı!
hotelSchema.pre('save', async function () {
  // Eğer şifre değişmediyse hiçbir şey yapmadan direkt çık (return)
  if (!this.isModified('password')) return;
  
  // Şifreyi kriptola
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

hotelSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Hotel', hotelSchema);