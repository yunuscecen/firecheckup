const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

// 1. Çevresel değişkenler her şeyden ÖNCE yüklenmeli
dotenv.config();

// Veritabanı bağlantısını dotenv yüklendikten sonra çağır
const connectDB = require('./config/db');
connectDB();

const app = express();

// 2. MIDDLEWARE'LER ROTALARDAN ÖNCE GELMELİ (Aksi takdirde req.body okuyamazsın!)
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cors()); 
app.use(helmet()); 
app.use(morgan('dev')); 

// Statik Dosya Hizmeti
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rotaları içe aktar
const hotelRoutes = require('./routes/hotelRoutes');
const reportRoutes = require('./routes/reportRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const publicRoutes = require('./routes/publicRoutes');
const startPaymentReminderCron = require('./cron/paymentReminder');
const startDocumentReminderCron = require('./cron/documentReminder');

// 3. ROTALARI KULLAN (JSON middleware'inden sonra gelmeli)
app.use('/api/hotels', hotelRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/public', publicRoutes);

// Cron Job'u başlat
startPaymentReminderCron();
startDocumentReminderCron();
// Test Rotası
app.get('/api', (req, res) => {
  res.json({ message: 'Hotel Inspection API Çalışıyor...' });
});

// Hata Yakalama Middleware'i
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda ${process.env.NODE_ENV} modunda çalışıyor.`);
});