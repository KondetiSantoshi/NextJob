import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { handleApiError } from '@/lib/apiError';
import JobSeekerProfile from '@/models/JobSeekerProfile';

export const dynamic = 'force-dynamic';

export async function DELETE(
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

    profile.resumes = profile.resumes.filter(
      (r: any) => r._id.toString() !== params.resumeId
    );

    if (profile.resumes.length > 0 && !profile.resumes.some((r: any) => r.isPrimary)) {
      profile.resumes[0].isPrimary = true;
    }

    await profile.save();

    return NextResponse.json(
      {
        success: true,
        resumes: profile.resumes,
        message: 'Resume removed successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
