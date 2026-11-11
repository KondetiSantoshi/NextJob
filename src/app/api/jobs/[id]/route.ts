import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getOptionalUser, requireAuth } from '@/lib/auth';
import { handleApiError } from '@/lib/apiError';
import Job from '@/models/Job';
import Application from '@/models/Application';
import SavedJob from '@/models/SavedJob';
import '@/models/Company';
import '@/models/User';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const user = await getOptionalUser(request);

    const job = await Job.findById(params.id)
      .populate('company')
      .populate('recruiter', 'name email headline avatar');

    if (!job) {
      return NextResponse.json(
        { success: false, message: 'Job not found' },
        { status: 404 }
      );
    }

    job.viewsCount = (job.viewsCount || 0) + 1;
    await job.save();

    let hasApplied = false;
    let isSaved = false;
    let applicationStatus = null;

    if (user) {
      const application = await Application.findOne({ job: job._id, applicant: user._id });
      if (application) {
        hasApplied = true;
        applicationStatus = application.status;
      }

      const saved = await SavedJob.findOne({ user: user._id, job: job._id });
      if (saved) {
        isSaved = true;
      }
    }

    const recommendedJobs = await Job.find({
      _id: { $ne: job._id },
      category: job.category,
      status: 'active',
    })
      .limit(4)
      .populate('company', 'name logo location');

    return NextResponse.json(
      {
        success: true,
        job,
        hasApplied,
        applicationStatus,
        isSaved,
        recommendedJobs,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(request, ['recruiter', 'admin']);
    if ('error' in auth) return auth.error;

    await connectDB();
    let job = await Job.findById(params.id);
    if (!job) {
      return NextResponse.json(
        { success: false, message: 'Job not found' },
        { status: 404 }
      );
    }

    if (job.recruiter.toString() !== auth.user._id.toString() && auth.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Not authorized to edit this job' },
        { status: 403 }
      );
    }

    const updates = await request.json();
    if (typeof updates.skills === 'string') {
      updates.skills = updates.skills
        .split(',')
        .map((s: string) => s.trim())
        .filter(Boolean);
    }
    if (typeof updates.requirements === 'string') {
      updates.requirements = updates.requirements
        .split('\n')
        .map((r: string) => r.trim())
        .filter(Boolean);
    }
    if (typeof updates.responsibilities === 'string') {
      updates.responsibilities = updates.responsibilities
        .split('\n')
        .map((r: string) => r.trim())
        .filter(Boolean);
    }

    job = await Job.findByIdAndUpdate(params.id, updates, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json(
      {
        success: true,
        job,
        message: 'Job updated successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(request, ['recruiter', 'admin']);
    if ('error' in auth) return auth.error;

    await connectDB();
    const job = await Job.findById(params.id);
    if (!job) {
      return NextResponse.json(
        { success: false, message: 'Job not found' },
        { status: 404 }
      );
    }

    if (job.recruiter.toString() !== auth.user._id.toString() && auth.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Not authorized to delete this job' },
        { status: 403 }
      );
    }

    await job.deleteOne();

    return NextResponse.json(
      {
        success: true,
        message: 'Job posting deleted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
