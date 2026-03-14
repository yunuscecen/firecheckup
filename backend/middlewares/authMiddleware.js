const jwt = require('jsonwebtoken');
const Hotel = require('../models/Hotel');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.hotel = await Hotel.findById(decoded.id).select('-password');
      
      if (!req.hotel.isActive) {
        return res.status(401).json({ message: 'Hesabınız pasif duruma alınmış.' });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Yetkisiz erişim, token başarısız.' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Yetkisiz erişim, token bulunamadı.' });
  }
};

module.exports = { protect };