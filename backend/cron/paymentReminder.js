const cron = require('node-cron');
const Hotel = require('../models/Hotel');
const sendEmail = require('../utils/sendEmail');

const startPaymentReminderCron = () => {
  cron.schedule('0 9 * * *', async () => {
    try {
      const oneMonthFromNow = new Date();
      oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

      const hotelsToRemind = await Hotel.find({
        membershipEndDate: {
          $lte: oneMonthFromNow,
          $gt: new Date()
        },
        isActive: true
      });

      for (const hotel of hotelsToRemind) {
        const message = `Sayın ${hotel.hotelName} yetkilisi,\n\nSistem üyeliğinizin bitmesine 1 aydan az bir süre kalmıştır. Yıllık kayıt ücretinizi ödemenizi rica ederiz.`;

        await sendEmail({
          email: hotel.email,
          subject: 'Yıllık Üyelik Yenileme Hatırlatması',
          message,
        });
      }
    } catch (error) {
      console.error(error);
    }
  });
};

module.exports = startPaymentReminderCron;