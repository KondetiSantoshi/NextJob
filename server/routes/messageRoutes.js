const express = require('express');
const router = express.Router();
const {
  getConversations,
  getMessagesWithUser,
  sendMessage,
} = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

router.get('/conversations', protect, getConversations);
router.get('/:userId', protect, getMessagesWithUser);
router.post('/:userId', protect, sendMessage);

module.exports = router;
