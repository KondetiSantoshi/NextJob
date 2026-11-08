const express = require('express');
const router = express.Router();
const {
  getConnections,
  sendRequest,
  respondRequest,
  getSuggestedConnections,
} = require('../controllers/connectionController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getConnections);
router.get('/suggestions', protect, getSuggestedConnections);
router.post('/request/:recipientId', protect, sendRequest);
router.put('/:id/respond', protect, respondRequest);

module.exports = router;
