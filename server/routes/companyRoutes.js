const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const {
  getAllCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  toggleFollowCompany,
  addReview,
  searchCompanyCareerJobs,
} = require('../controllers/companyController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

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

router.get('/career-search', searchCompanyCareerJobs);
router.get('/', getAllCompanies);
router.get('/:id', optionalAuth, getCompanyById);
router.post('/', protect, authorize('recruiter', 'admin'), createCompany);
router.put('/:id', protect, authorize('recruiter', 'admin'), updateCompany);
router.post('/:id/follow', protect, toggleFollowCompany);
router.post('/:id/reviews', protect, addReview);

module.exports = router;
