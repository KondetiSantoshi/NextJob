import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { handleApiError } from '@/lib/apiError';
import JobSeekerProfile from '@/models/JobSeekerProfile';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if ('error' in auth) return auth.error;

    await connectDB();
    const { name, url, size } = await request.json();

    let profile = await JobSeekerProfile.findOne({ user: auth.user._id });
    if (!profile) {
      profile = await JobSeekerProfile.create({ user: auth.user._id });
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

    return NextResponse.json(
      {
        success: true,
        resumes: profile.resumes,
        message: 'Resume added successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
