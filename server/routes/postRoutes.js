const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const {
  getFeed,
  createPost,
  toggleLike,
  addComment,
  sharePost,
  deletePost,
} = require('../controllers/postController');
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

router.get('/', optionalAuth, getFeed);
router.post('/', protect, createPost);
router.post('/:id/like', protect, toggleLike);
router.post('/:id/comments', protect, addComment);
router.post('/:id/share', protect, sharePost);
router.delete('/:id', protect, deletePost);

module.exports = router;
