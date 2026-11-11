import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { handleApiError } from '@/lib/apiError';
import JobSeekerProfile from '@/models/JobSeekerProfile';
import '@/models/User';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if ('error' in auth) return auth.error;

    await connectDB();
    let profile = await JobSeekerProfile.findOne({ user: auth.user._id }).populate(
      'user',
      'name email mobile location avatar headline bio'
    );

    if (!profile) {
      profile = await JobSeekerProfile.create({
        user: auth.user._id,
        headline: auth.user.headline,
      });
      profile = await JobSeekerProfile.findById(profile._id).populate(
        'user',
        'name email mobile location avatar headline bio'
      );
    }

    return NextResponse.json(
      {
        success: true,
        profile,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
