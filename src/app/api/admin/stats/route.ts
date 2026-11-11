import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { handleApiError } from '@/lib/apiError';
import User from '@/models/User';
import Company from '@/models/Company';
import Job from '@/models/Job';
import Application from '@/models/Application';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request, ['admin']);
    if ('error' in auth) return auth.error;

    await connectDB();
    // Touch Company model so mongoose registers it before populate
    void Company;

    const [
      totalUsers,
      totalJobSeekers,
      totalRecruiters,
      totalCompanies,
      totalJobs,
      activeJobs,
      totalApplications,
      applicationBreakdown,
      recentUsers,
      recentJobs,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'job_seeker' }),
      User.countDocuments({ role: 'recruiter' }),
      Company.countDocuments(),
      Job.countDocuments(),
      Job.countDocuments({ status: 'active' }),
      Application.countDocuments(),
      Application.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      User.find().sort({ createdAt: -1 }).limit(6).select('-password'),
      Job.find().sort({ createdAt: -1 }).limit(6).populate('company', 'name logo'),
    ]);

    return NextResponse.json(
      {
        success: true,
        stats: {
          totalUsers,
          totalJobSeekers,
          totalRecruiters,
          totalCompanies,
          totalJobs,
          activeJobs,
          totalApplications,
        },
        applicationBreakdown,
        recentUsers,
        recentJobs,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
