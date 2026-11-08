const Application = require('../models/Application');
const Job = require('../models/Job');
const Notification = require('../models/Notification');
const JobSeekerProfile = require('../models/JobSeekerProfile');

// @desc Apply for a job
// @route POST /api/applications/:jobId
exports.applyJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { coverNote, resumeUrl, resumeName } = req.body;

    const job = await Job.findById(jobId).populate('company');
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.status !== 'active') {
      return res.status(400).json({ success: false, message: 'This job posting is no longer active' });
    }

    // Check if already applied
    const existingApp = await Application.findOne({ job: jobId, applicant: req.user._id });
    if (existingApp) {
      return res.status(400).json({ success: false, message: 'You have already applied for this job' });
    }

    // Determine resume
    let finalResumeUrl = resumeUrl;
    let finalResumeName = resumeName || 'Resume.pdf';

    if (!finalResumeUrl) {
      const profile = await JobSeekerProfile.findOne({ user: req.user._id });
      if (profile && profile.resumes && profile.resumes.length > 0) {
        const primary = profile.resumes.find((r) => r.isPrimary) || profile.resumes[0];
        finalResumeUrl = primary.url;
        finalResumeName = primary.name;
      } else {
        finalResumeUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
      }
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      recruiter: job.recruiter,
      company: job.company?._id || job.company,
      resumeUrl: finalResumeUrl,
      resumeName: finalResumeName,
      coverNote: coverNote || '',
      status: 'Applied',
    });

    // Increment applicantsCount on Job
    job.applicantsCount = (job.applicantsCount || 0) + 1;
    await job.save();

    // Create notification for recruiter
    await Notification.create({
      recipient: job.recruiter,
      sender: req.user._id,
      type: 'application_status',
      title: 'New Candidate Application',
      message: `${req.user.name} applied for "${job.title}" at ${job.companyName}`,
      link: `/dashboard/recruiter?tab=applicants&jobId=${job._id}`,
    });

    res.status(201).json({
      success: true,
      application,
      message: 'Application submitted successfully!',
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get current job seeker's applications
// @route GET /api/applications/my-applications
exports.getSeekerApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate({
        path: 'job',
        populate: { path: 'company', select: 'name logo location industry' },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get applicants for recruiter's jobs
// @route GET /api/applications/recruiter/applicants
exports.getJobApplicants = async (req, res, next) => {
  try {
    const { jobId, status } = req.query;

    const query = { recruiter: req.user._id };
    if (jobId) {
      query.job = jobId;
    }
    if (status && status !== 'All') {
      query.status = status;
    }

    const applications = await Application.find(query)
      .populate('job', 'title location jobType category')
      .populate('applicant', 'name email mobile location avatar headline')
      .sort({ createdAt: -1 });

    // Attach profile details (skills, experience) for each applicant
    const applicantIds = applications.map((a) => a.applicant?._id).filter(Boolean);
    const profiles = await JobSeekerProfile.find({ user: { $in: applicantIds } });
    const profileMap = {};
    profiles.forEach((p) => {
      profileMap[p.user.toString()] = p;
    });

    const enriched = applications.map((app) => {
      const appObj = app.toObject();
      if (appObj.applicant && profileMap[appObj.applicant._id.toString()]) {
        appObj.profile = profileMap[appObj.applicant._id.toString()];
      }
      return appObj;
    });

    res.status(200).json({
      success: true,
      count: enriched.length,
      applicants: enriched,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Update application status (Viewed, Shortlisted, Selected, Rejected)
// @route PUT /api/applications/:id/status
exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, recruiterNotes } = req.body;

    const validStatuses = ['Applied', 'Viewed', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const application = await Application.findById(req.params.id).populate('job');
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Verify recruiter authorization
    if (application.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    application.status = status;
    if (recruiterNotes !== undefined) {
      application.recruiterNotes = recruiterNotes;
    }
    await application.save();

    // Notify job seeker
    await Notification.create({
      recipient: application.applicant,
      sender: req.user._id,
      type: 'application_status',
      title: 'Application Status Updated',
      message: `Your application status for "${application.job?.title}" is now "${status}"`,
      link: '/applications',
    });

    res.status(200).json({
      success: true,
      application,
      message: `Status updated to ${status}`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Schedule interview for applicant
// @route POST /api/applications/:id/schedule-interview
exports.scheduleInterview = async (req, res, next) => {
  try {
    const { date, time, mode, link, notes } = req.body;

    const application = await Application.findById(req.params.id).populate('job');
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    if (application.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    application.status = 'Interview Scheduled';
    application.interviewDetails = {
      date,
      time,
      mode: mode || 'Google Meet',
      link: link || 'https://meet.google.com/xyz-demo-abc',
      notes: notes || '',
    };
    await application.save();

    // Create high-priority notification for seeker
    await Notification.create({
      recipient: application.applicant,
      sender: req.user._id,
      type: 'interview_scheduled',
      title: 'Interview Scheduled!',
      message: `Interview scheduled for "${application.job?.title}" on ${date} at ${time} via ${mode || 'Google Meet'}.`,
      link: '/applications',
    });

    res.status(200).json({
      success: true,
      application,
      message: 'Interview successfully scheduled and candidate notified',
    });
  } catch (error) {
    next(error);
  }
};
