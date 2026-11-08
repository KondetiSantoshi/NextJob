const JobSeekerProfile = require('../models/JobSeekerProfile');
const User = require('../models/User');

// @desc Get current seeker's profile
// @route GET /api/profile/me
exports.getMyProfile = async (req, res, next) => {
  try {
    let profile = await JobSeekerProfile.findOne({ user: req.user._id }).populate(
      'user',
      'name email mobile location avatar headline bio'
    );

    if (!profile) {
      profile = await JobSeekerProfile.create({
        user: req.user._id,
        headline: req.user.headline,
      });
      profile = await JobSeekerProfile.findById(profile._id).populate(
        'user',
        'name email mobile location avatar headline bio'
      );
    }

    res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get public profile by user ID
// @route GET /api/profile/user/:userId
exports.getPublicProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const profile = await JobSeekerProfile.findOne({ user: user._id });

    res.status(200).json({
      success: true,
      user,
      profile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Update seeker profile details
// @route PUT /api/profile
exports.updateProfile = async (req, res, next) => {
  try {
    let profile = await JobSeekerProfile.findOne({ user: req.user._id });

    if (!profile) {
      profile = new JobSeekerProfile({ user: req.user._id });
    }

    const fields = [
      'headline',
      'about',
      'primaryRole',
      'currentCompany',
      'currentDesignation',
      'totalExperienceYears',
      'currentSalary',
      'expectedSalary',
      'noticePeriod',
      'availabilityStatus',
      'lastWorkingDay',
      'mobile',
      'currentCity',
      'openToRelocate',
      'portfolioUrl',
      'linkedinUrl',
      'githubUrl',
      'leetcodeUrl',
      'twitterUrl',
      'preferredLocations',
      'preferredJobTypes',
      'preferredWorkModes',
      'skills',
      'education',
      'experience',
      'projects',
      'certifications',
      'languages',
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        profile[field] = req.body[field];
      }
    });

    await profile.save();

    // Synchronize updates on User model
    const userUpdates = {};
    if (req.body.headline !== undefined) userUpdates.headline = req.body.headline;
    if (req.body.about !== undefined) userUpdates.bio = req.body.about;
    if (req.body.mobile !== undefined) userUpdates.mobile = req.body.mobile;
    if (req.body.currentCity !== undefined) userUpdates.location = req.body.currentCity;

    if (Object.keys(userUpdates).length > 0) {
      await User.findByIdAndUpdate(req.user._id, userUpdates);
    }

    // Populate user details on return
    await profile.populate('user', 'name email mobile location avatar headline bio');

    res.status(200).json({
      success: true,
      profile,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc Add or upload resume item
// @route POST /api/profile/resumes
exports.addResume = async (req, res, next) => {
  try {
    const { name, url, size } = req.body;

    let profile = await JobSeekerProfile.findOne({ user: req.user._id });
    if (!profile) {
      profile = await JobSeekerProfile.create({ user: req.user._id });
    }

    const isFirst = !profile.resumes || profile.resumes.length === 0;

    profile.resumes.push({
      name: name || 'Resume.pdf',
      url: url || '/sample-resume.pdf',
      size: size || '450 KB',
      isPrimary: isFirst,
      uploadedAt: new Date(),
    });

    await profile.save();

    res.status(201).json({
      success: true,
      resumes: profile.resumes,
      message: 'Resume added successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc Set resume as primary
// @route PUT /api/profile/resumes/:resumeId/primary
exports.setDefaultResume = async (req, res, next) => {
  try {
    const profile = await JobSeekerProfile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    profile.resumes.forEach((r) => {
      r.isPrimary = r._id.toString() === req.params.resumeId;
    });

    await profile.save();

    res.status(200).json({
      success: true,
      resumes: profile.resumes,
      message: 'Primary resume set',
    });
  } catch (error) {
    next(error);
  }
};

// @desc Delete resume
// @route DELETE /api/profile/resumes/:resumeId
exports.deleteResume = async (req, res, next) => {
  try {
    const profile = await JobSeekerProfile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    profile.resumes = profile.resumes.filter((r) => r._id.toString() !== req.params.resumeId);

    // If deleted primary, make first remaining primary
    if (profile.resumes.length > 0 && !profile.resumes.some((r) => r.isPrimary)) {
      profile.resumes[0].isPrimary = true;
    }

    await profile.save();

    res.status(200).json({
      success: true,
      resumes: profile.resumes,
      message: 'Resume removed successfully',
    });
  } catch (error) {
    next(error);
  }
};
