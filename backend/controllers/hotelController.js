const Hotel = require('../models/Hotel');
const generateToken = require('../utils/generateToken');

const createHotel = async (req, res) => {
  try {
    const { hotelCode, email, password, hotelName, taxOffice, taxNumber, address, membershipStartDate, membershipEndDate } = req.body;

    const hotelExists = await Hotel.findOne({ $or: [{ email }, { hotelCode }] });

    if (hotelExists) {
      return res.status(400).json({ message: 'Bu otel kodu veya email zaten kayıtlı.' });
    }

    const hotel = await Hotel.create({
      hotelCode,
      email,
      password,
      hotelName,
      taxOffice,
      taxNumber,
      address,
      membershipStartDate,
      membershipEndDate
    });

    if (hotel) {
      res.status(201).json({
        _id: hotel._id,
        hotelCode: hotel.hotelCode,
        hotelName: hotel.hotelName,
        email: hotel.email,
        message: 'Otel başarıyla oluşturuldu.'
      });
    } else {
      res.status(400).json({ message: 'Geçersiz otel verisi.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginHotel = async (req, res) => {
  try {
    const { loginId, password } = req.body; 

    const hotel = await Hotel.findOne({
      $or: [{ email: loginId }, { hotelCode: loginId }]
    });

    if (hotel && (await hotel.matchPassword(password))) {
      if (!hotel.isActive) {
        return res.status(401).json({ message: 'Hesabınız aktif değil.' });
      }

      res.json({
        _id: hotel._id,
        hotelCode: hotel.hotelCode,
        hotelName: hotel.hotelName,
        email: hotel.email,
        token: generateToken(hotel._id),
      });
    } else {
      res.status(401).json({ message: 'Geçersiz kullanıcı adı/email veya şifre.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllHotelsAdmin = async (req, res) => {
  try {
    const hotels = await Hotel.find({}).select('-password').sort({ createdAt: -1 });
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createHotel, loginHotel, getAllHotelsAdmin };