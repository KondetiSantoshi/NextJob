import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { handleApiError } from '@/lib/apiError';
import Application from '@/models/Application';
import '@/models/Job';
import '@/models/Company';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request, ['job_seeker', 'admin']);
    if ('error' in auth) return auth.error;

    await connectDB();
    const applications = await Application.find({ applicant: auth.user._id })
      .populate({
        path: 'job',
        populate: { path: 'company', select: 'name logo location industry' },
      })
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        count: applications.length,
        applications,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
