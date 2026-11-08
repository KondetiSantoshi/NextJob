const User = require('../models/User');
const JobSeekerProfile = require('../models/JobSeekerProfile');
const Company = require('../models/Company');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// In-memory store for pending registration OTPs
const otpStore = new Map();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_jwt_key_jobportal_2026_xyz', {
    expiresIn: '30d',
  });
};

// @desc Send OTP to email or mobile
// @route POST /api/auth/send-otp
exports.sendOTP = async (req, res, next) => {
  try {
    const { identifier } = req.body;
    if (!identifier) {
      return res.status(400).json({ success: false, message: 'Please provide email or mobile number' });
    }

    const cleanId = identifier.trim().toLowerCase();
    const isEmail = cleanId.includes('@');

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const query = isEmail ? { email: cleanId } : { mobile: cleanId };
    let user = await User.findOne(query);

    if (user) {
      user.otp = otp;
      user.otpExpire = otpExpire;
      await user.save();
    } else {
      otpStore.set(cleanId, { otp, expire: otpExpire });
    }

    console.log(`[OTP AUTH] Generated OTP for ${cleanId}: ${otp}`);

    res.status(200).json({
      success: true,
      message: `Verification code sent to ${cleanId}`,
      otp, // included for seamless instant testing
      isExistingUser: Boolean(user),
    });
  } catch (error) {
    next(error);
  }
};

// @desc Verify OTP and authenticate/register
// @route POST /api/auth/verify-otp
exports.verifyOTP = async (req, res, next) => {
  try {
    const { identifier, otp, role = 'job_seeker', name } = req.body;
    if (!identifier || !otp) {
      return res.status(400).json({ success: false, message: 'Please provide identifier and OTP code' });
    }

    const cleanId = identifier.trim().toLowerCase();
    const isEmail = cleanId.includes('@');
    const query = isEmail ? { email: cleanId } : { mobile: cleanId };

    let user = await User.findOne(query).select('+otp +otpExpire').populate('company');

    let isValid = false;
    if (user && user.otp === otp && user.otpExpire && user.otpExpire > Date.now()) {
      isValid = true;
      user.otp = undefined;
      user.otpExpire = undefined;
      user.isVerified = true;
      await user.save();
    } else if (otpStore.has(cleanId)) {
      const stored = otpStore.get(cleanId);
      if (stored.otp === otp && stored.expire > Date.now()) {
        isValid = true;
        otpStore.delete(cleanId);
      }
    } else if (otp === '123456') {
      // Master test OTP for convenience
      isValid = true;
    }

    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP code' });
    }

    if (!user) {
      const assignedRole = ['job_seeker', 'recruiter', 'admin'].includes(role) ? role : 'job_seeker';
      const userName = name || (isEmail ? cleanId.split('@')[0] : `User_${cleanId.slice(-4)}`);
      const email = isEmail ? cleanId : `${cleanId}@mobile.nexjob.com`;
      const mobile = isEmail ? '' : cleanId;

      user = await User.create({
        name: userName,
        email,
        mobile,
        role: assignedRole,
        isVerified: true,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userName)}`,
      });

      if (assignedRole === 'job_seeker') {
        await JobSeekerProfile.create({ user: user._id });
      }
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user,
      message: 'OTP verified successfully!',
    });
  } catch (error) {
    next(error);
  }
};

// @desc Register user
// @route POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, mobile, password, role, location, companyName } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const assignedRole = ['job_seeker', 'recruiter', 'admin'].includes(role) ? role : 'job_seeker';

    const user = await User.create({
      name,
      email,
      mobile: mobile || '',
      password,
      role: assignedRole,
      location: location || '',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      headline: assignedRole === 'recruiter' ? 'Talent Acquisition & Hiring' : 'Passionate Professional seeking new opportunities',
    });

    if (assignedRole === 'job_seeker') {
      await JobSeekerProfile.create({
        user: user._id,
        headline: user.headline,
        skills: [{ name: 'JavaScript', level: 'Intermediate' }, { name: 'React', level: 'Intermediate' }],
      });
    } else if (assignedRole === 'recruiter') {
      // If companyName given, link or create company
      const cName = companyName || `${name.split(' ')[0]}'s Tech Corp`;
      let company = await Company.findOne({ name: { $regex: new RegExp(`^${cName}$`, 'i') } });
      if (!company) {
        company = await Company.create({
          name: cName,
          slug: cName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          location: location || 'Bangalore, India',
          description: `${cName} is a dynamic organization innovating digital solutions and empowering top talent.`,
          logo: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(cName)}`,
          recruiters: [user._id],
        });
      } else {
        if (!company.recruiters.includes(user._id)) {
          company.recruiters.push(user._id);
          await company.save();
        }
      }
      user.company = company._id;
      await user.save();
    }

    const token = generateToken(user._id);

    const populatedUser = await User.findById(user._id).populate('company');

    res.status(201).json({
      success: true,
      token,
      user: populatedUser,
      message: 'Account created successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc Login user
// @route POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password').populate('company');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account is deactivated. Contact admin.' });
    }

    const token = generateToken(user._id);

    user.password = undefined;

    res.status(200).json({
      success: true,
      token,
      user,
      message: 'Logged in successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc Google Login
// @route POST /api/auth/google
exports.googleLogin = async (req, res, next) => {
  try {
    const { email, name, role = 'job_seeker' } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    let user = await User.findOne({ email }).populate('company');
    if (!user) {
      user = await User.create({
        name: name || email.split('@')[0],
        email,
        password: crypto.randomBytes(16).toString('hex'),
        role,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || email)}`,
        isVerified: true,
      });

      if (role === 'job_seeker') {
        await JobSeekerProfile.create({ user: user._id });
      }
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user,
      message: 'Google login successful',
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get current logged-in user
// @route GET /api/auth/me
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('company');
    let profile = null;
    if (user.role === 'job_seeker') {
      profile = await JobSeekerProfile.findOne({ user: user._id });
    }

    res.status(200).json({
      success: true,
      user,
      profile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Forgot password
// @route POST /api/auth/forgot-password
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'No account found with this email' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 mins
    await user.save();

    // In production we send an email. For demo/dev convenience we return the token in response
    res.status(200).json({
      success: true,
      message: 'Password reset link sent to your email',
      resetToken, // Returned for effortless demo testing
    });
  } catch (error) {
    next(error);
  }
};

// @desc Reset password
// @route POST /api/auth/reset-password/:token
exports.resetPassword = async (req, res, next) => {
  try {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      message: 'Password reset successful. You are now logged in.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc Update user profile basic details
// @route PUT /api/auth/update-profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, mobile, location, headline, bio, avatar } = req.body;
    const user = await User.findById(req.user.id);

    if (name) user.name = name;
    if (mobile !== undefined) user.mobile = mobile;
    if (location !== undefined) user.location = location;
    if (headline !== undefined) user.headline = headline;
    if (bio !== undefined) user.bio = bio;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.status(200).json({
      success: true,
      user,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    next(error);
  }
};
