const express = require('express');
const router = express.Router();
const {
  getMyProfile,
  getPublicProfile,
  updateProfile,
  addResume,
  setDefaultResume,
  deleteResume,
} = require('../controllers/profileController');
const { protect } = require('../middleware/auth');

router.get('/me', protect, getMyProfile);
router.get('/user/:userId', getPublicProfile);
router.put('/', protect, updateProfile);
router.post('/resumes', protect, addResume);
router.put('/resumes/:resumeId/primary', protect, setDefaultResume);
router.delete('/resumes/:resumeId', protect, deleteResume);

module.exports = router;
