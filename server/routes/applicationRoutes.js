const express = require('express');
const router = express.Router();
const {
  applyJob,
  getSeekerApplications,
  getJobApplicants,
  updateApplicationStatus,
  scheduleInterview,
} = require('../controllers/applicationController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

router.post('/:jobId', protect, authorize('job_seeker', 'admin'), applyJob);
router.get('/my-applications', protect, authorize('job_seeker', 'admin'), getSeekerApplications);
router.get('/recruiter/applicants', protect, authorize('recruiter', 'admin'), getJobApplicants);
router.put('/:id/status', protect, authorize('recruiter', 'admin'), updateApplicationStatus);
router.post('/:id/schedule-interview', protect, authorize('recruiter', 'admin'), scheduleInterview);

module.exports = router;
