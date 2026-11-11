import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { handleApiError } from '@/lib/apiError';
import SavedJob from '@/models/SavedJob';
import '@/models/Job';
import '@/models/Company';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if ('error' in auth) return auth.error;

    await connectDB();
    const saved = await SavedJob.find({ user: auth.user._id })
      .populate({
        path: 'job',
        populate: { path: 'company', select: 'name logo location industry rating' },
      })
      .sort({ createdAt: -1 });

    const jobs = saved.filter((s: any) => s.job).map((s: any) => s.job);

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
