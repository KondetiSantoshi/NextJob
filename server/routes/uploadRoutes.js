const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect } = require('../middleware/auth');

router.post('/', protect, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please upload a file' });
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  res.status(200).json({
    success: true,
    fileUrl,
    filename: req.file.originalname,
    size: `${(req.file.size / 1024).toFixed(1)} KB`,
    message: 'File uploaded successfully',
  });
});

module.exports = router;
