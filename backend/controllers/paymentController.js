const Payment = require('../models/Payment');

const createPayment = async (req, res) => {
  try {
    const { amount, paymentMethod, year } = req.body;

    const payment = await Payment.create({
      hotel: req.hotel._id,
      amount,
      paymentMethod,
      year,
      status: 'onaylandi'
    });

    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ hotel: req.hotel._id }).sort({ paymentDate: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createPayment, getMyPayments };