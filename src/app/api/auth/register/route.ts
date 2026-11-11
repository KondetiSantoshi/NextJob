import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { generateToken } from '@/lib/auth';
import { handleApiError } from '@/lib/apiError';
import User from '@/models/User';
import JobSeekerProfile from '@/models/JobSeekerProfile';
import Company from '@/models/Company';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { name, email, mobile, password, role, location, companyName } = await request.json();

    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json(
        { success: false, message: 'User already exists with this email' },
        { status: 400 }
      );
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
      headline:
        assignedRole === 'recruiter'
          ? 'Talent Acquisition & Hiring'
          : 'Passionate Professional seeking new opportunities',
    });

    if (assignedRole === 'job_seeker') {
      await JobSeekerProfile.create({
        user: user._id,
        headline: user.headline,
        skills: [
          { name: 'JavaScript', level: 'Intermediate' },
          { name: 'React', level: 'Intermediate' },
        ],
      });
    } else if (assignedRole === 'recruiter') {
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
      } else if (!company.recruiters.includes(user._id)) {
        company.recruiters.push(user._id);
        await company.save();
      }
      user.company = company._id;
      await user.save();
    }

    const token = generateToken(user._id.toString());
    const populatedUser = await User.findById(user._id).populate('company');

    return NextResponse.json(
      {
        success: true,
        token,
        user: populatedUser,
        message: 'Account created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
