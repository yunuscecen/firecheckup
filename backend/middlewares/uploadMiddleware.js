const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage();

const checkFileType = (file, cb) => {
  const filetypes = /pdf|doc|docx|jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Sadece PDF, Word veya Resim formatları yüklenebilir!'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 10000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
});

module.exports = upload;