const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const {
  getTopics,
  getTopicById,
  createTopic,
  answerTopic,
  toggleUpvoteTopic,
  toggleUpvoteAnswer,
} = require('../controllers/communityController');
const { protect } = require('../middleware/auth');

const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_jobportal_2026_xyz');
      req.user = await User.findById(decoded.id).select('-password');
    } catch (e) {}
  }
  next();
};

router.get('/topics', optionalAuth, getTopics);
router.get('/topics/:id', optionalAuth, getTopicById);
router.post('/topics', protect, createTopic);
router.post('/topics/:id/answers', protect, answerTopic);
router.post('/topics/:id/upvote', protect, toggleUpvoteTopic);
router.post('/answers/:id/upvote', protect, toggleUpvoteAnswer);

module.exports = router;
