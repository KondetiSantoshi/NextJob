import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { handleApiError } from '@/lib/apiError';
import JobSeekerProfile from '@/models/JobSeekerProfile';

export const dynamic = 'force-dynamic';

export async function PUT(
  request: NextRequest,
  { params }: { params: { resumeId: string } }
) {
  try {
    const auth = await requireAuth(request);
    if ('error' in auth) return auth.error;

    await connectDB();
    const profile = await JobSeekerProfile.findOne({ user: auth.user._id });
    if (!profile) {
      return NextResponse.json(
        { success: false, message: 'Profile not found' },
        { status: 404 }
      );
    }

    profile.resumes.forEach((r: any) => {
      r.isPrimary = r._id.toString() === params.resumeId;
    });

    await profile.save();

    return NextResponse.json(
      {
        success: true,
        resumes: profile.resumes,
        message: 'Primary resume set',
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
