import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { handleApiError } from '@/lib/apiError';
import Application from '@/models/Application';
import JobSeekerProfile from '@/models/JobSeekerProfile';
import '@/models/Job';
import '@/models/User';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request, ['recruiter', 'admin']);
    if ('error' in auth) return auth.error;

    await connectDB();
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');
    const status = searchParams.get('status');

    const query: any = { recruiter: auth.user._id };
    if (jobId) {
      query.job = jobId;
    }
    if (status && status !== 'All') {
      query.status = status;
    }

    const applications = await Application.find(query)
      .populate('job', 'title location jobType category')
      .populate('applicant', 'name email mobile location avatar headline')
      .sort({ createdAt: -1 });

    const applicantIds = applications.map((a: any) => a.applicant?._id).filter(Boolean);
    const profiles = await JobSeekerProfile.find({ user: { $in: applicantIds } });
    const profileMap: Record<string, any> = {};
    profiles.forEach((p: any) => {
      profileMap[p.user.toString()] = p;
    });

    const enriched = applications.map((app: any) => {
      const appObj = app.toObject();
      if (appObj.applicant && profileMap[appObj.applicant._id.toString()]) {
        appObj.profile = profileMap[appObj.applicant._id.toString()];
      }
      return appObj;
    });

    return NextResponse.json(
      {
        success: true,
        count: enriched.length,
        applicants: enriched,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
