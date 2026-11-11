import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectDB } from '@/lib/db';
import { generateToken } from '@/lib/auth';
import { handleApiError } from '@/lib/apiError';
import User from '@/models/User';
import JobSeekerProfile from '@/models/JobSeekerProfile';
import '@/models/Company';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { email, name, role = 'job_seeker' } = await request.json();
    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
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

    const token = generateToken(user._id.toString());

    return NextResponse.json(
      {
        success: true,
        token,
        user,
        message: 'Google login successful',
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
