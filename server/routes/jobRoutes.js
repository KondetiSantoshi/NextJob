const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getRecruiterJobs,
  toggleSaveJob,
  getSavedJobs,
  getCategories,
  syncLiveCareerJobs,
} = require('../controllers/jobController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

// Optional auth middleware
const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_jobportal_2026_xyz');
      req.user = await User.findById(decoded.id).select('-password');
    } catch (e) {
      // Ignore invalid token in optional auth
    }
  }
  next();
};

router.get('/meta/categories', getCategories);
router.get('/sync-live-jobs', syncLiveCareerJobs);
router.post('/sync-live-jobs', syncLiveCareerJobs);
router.get('/', optionalAuth, getAllJobs);
router.get('/recruiter/my-jobs', protect, authorize('recruiter', 'admin'), getRecruiterJobs);
router.get('/seeker/saved', protect, getSavedJobs);
router.get('/:id', optionalAuth, getJobById);
router.post('/', protect, authorize('recruiter', 'admin'), createJob);
router.put('/:id', protect, authorize('recruiter', 'admin'), updateJob);
router.delete('/:id', protect, authorize('recruiter', 'admin'), deleteJob);
router.post('/:id/save', protect, toggleSaveJob);

module.exports = router;
