import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { handleApiError } from '@/lib/apiError';
import User from '@/models/User';
import JobSeekerProfile from '@/models/JobSeekerProfile';
import '@/models/Company';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if ('error' in auth) return auth.error;

    await connectDB();
    const user = await User.findById(auth.user._id).populate('company');
    let profile = null;
    if (user && user.role === 'job_seeker') {
      profile = await JobSeekerProfile.findOne({ user: user._id });
    }

    return NextResponse.json(
      {
        success: true,
        user,
        profile,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
