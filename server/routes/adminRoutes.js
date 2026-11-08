const express = require('express');
const router = express.Router();
const {
  getStats,
  getAllUsers,
  toggleUserStatus,
  deleteUser,
  verifyCompany,
  deletePostAdmin,
  deleteCommunityTopicAdmin,
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.put('/users/:id/toggle-status', toggleUserStatus);
router.delete('/users/:id', deleteUser);
router.put('/companies/:id/verify', verifyCompany);
router.delete('/posts/:id', deletePostAdmin);
router.delete('/community/:id', deleteCommunityTopicAdmin);

module.exports = router;
