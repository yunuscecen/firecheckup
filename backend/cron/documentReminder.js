const cron = require('node-cron');
const Report = require('../models/Report');
const sendEmail = require('../utils/sendEmail');

const startDocumentReminderCron = () => {
  cron.schedule('0 10 * * *', async () => {
    try {
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

      const reportsToRemind = await Report.find({
        expiryDate: {
          $lte: thirtyDaysFromNow,
          $gt: new Date()
        },
        warningSent: false
      }).populate('hotel');

      for (const report of reportsToRemind) {
        if (report.hotel && report.hotel.isActive && report.hotel.email) {
          const message = `Sayın ${report.hotel.hotelName} yetkilisi,\n\nSisteme yüklediğiniz "${report.documentCategory}" belgesinin geçerlilik süresinin dolmasına 30 günden az bir süre kalmıştır. Lütfen denetime hazır olmak için belgenizi güncelleyiniz.`;

          await sendEmail({
            email: report.hotel.email,
            subject: 'FireCheckup - Belge Süresi Yaklaşıyor',
            message,
          });

          report.warningSent = true;
          await report.save();
        }
      }
    } catch (error) {
      console.error(error);
    }
  });
};

module.exports = startDocumentReminderCron;