import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { handleApiError } from '@/lib/apiError';
import SavedJob from '@/models/SavedJob';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(request);
    if ('error' in auth) return auth.error;

    await connectDB();
    const jobId = params.id;
    const existing = await SavedJob.findOne({ user: auth.user._id, job: jobId });

    if (existing) {
      await existing.deleteOne();
      return NextResponse.json(
        {
          success: true,
          isSaved: false,
          message: 'Job removed from saved list',
        },
        { status: 200 }
      );
    }

    await SavedJob.create({
      user: auth.user._id,
      job: jobId,
    });

    return NextResponse.json(
      {
        success: true,
        isSaved: true,
        message: 'Job saved successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
