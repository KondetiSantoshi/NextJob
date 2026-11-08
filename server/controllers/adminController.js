const User = require('../models/User');
const Company = require('../models/Company');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Post = require('../models/Post');
const CommunityTopic = require('../models/CommunityTopic');

// @desc Get platform statistics and KPI analytics
// @route GET /api/admin/stats
exports.getStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalJobSeekers = await User.countDocuments({ role: 'job_seeker' });
    const totalRecruiters = await User.countDocuments({ role: 'recruiter' });
    const totalCompanies = await Company.countDocuments();
    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ status: 'active' });
    const totalApplications = await Application.countDocuments();

    // Application statuses breakdown
    const applicationBreakdown = await Application.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Recent registered users
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(6).select('-password');

    // Recent jobs
    const recentJobs = await Job.find().sort({ createdAt: -1 }).limit(6).populate('company', 'name logo');

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalJobSeekers,
        totalRecruiters,
        totalCompanies,
        totalJobs,
        activeJobs,
        totalApplications,
      },
      applicationBreakdown,
      recentUsers,
      recentJobs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get all users with search and filter
// @route GET /api/admin/users
exports.getAllUsers = async (req, res, next) => {
  try {
    const { role, q, page = 1, limit = 20 } = req.query;
    const query = {};

    if (role && role !== 'All') {
      query.role = role;
    }

    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { location: { $regex: q, $options: 'i' } },
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const pageSize = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * pageSize;

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .populate('company', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    res.status(200).json({
      success: true,
      total,
      totalPages: Math.ceil(total / pageSize) || 1,
      currentPage: pageNum,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Toggle user active status
// @route PUT /api/admin/users/:id/toggle-status
exports.toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      user,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Delete user
// @route DELETE /api/admin/users/:id
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User removed from platform',
    });
  } catch (error) {
    next(error);
  }
};

// @desc Verify or reject company profile
// @route PUT /api/admin/companies/:id/verify
exports.verifyCompany = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    company.verified = !company.verified;
    await company.save();

    res.status(200).json({
      success: true,
      company,
      message: `Company status updated to ${company.verified ? 'Verified' : 'Unverified'}`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Moderate / delete post
// @route DELETE /api/admin/posts/:id
exports.deletePostAdmin = async (req, res, next) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Post removed by administrator' });
  } catch (error) {
    next(error);
  }
};

// @desc Moderate / delete community topic
// @route DELETE /api/admin/community/:id
exports.deleteCommunityTopicAdmin = async (req, res, next) => {
  try {
    await CommunityTopic.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Community topic removed by administrator' });
  } catch (error) {
    next(error);
  }
};
