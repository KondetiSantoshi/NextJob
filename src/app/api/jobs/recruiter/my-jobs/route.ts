import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { handleApiError } from '@/lib/apiError';
import Job from '@/models/Job';
import '@/models/Company';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request, ['recruiter', 'admin']);
    if ('error' in auth) return auth.error;

    await connectDB();
    const jobs = await Job.find({ recruiter: auth.user._id })
      .populate('company', 'name logo')
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        count: jobs.length,
        jobs,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
