import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { handleApiError } from '@/lib/apiError';
import Application from '@/models/Application';
import Job from '@/models/Job';
import Notification from '@/models/Notification';
import JobSeekerProfile from '@/models/JobSeekerProfile';
import '@/models/Company';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(request, ['job_seeker', 'admin']);
    if ('error' in auth) return auth.error;

    await connectDB();
    const jobId = params.id;
    const { coverNote, resumeUrl, resumeName } = await request.json();

    const job = await Job.findById(jobId).populate('company');
    if (!job) {
      return NextResponse.json(
        { success: false, message: 'Job not found' },
        { status: 404 }
      );
    }

    if (job.status !== 'active') {
      return NextResponse.json(
        { success: false, message: 'This job posting is no longer active' },
        { status: 400 }
      );
    }

    const existingApp = await Application.findOne({ job: jobId, applicant: auth.user._id });
    if (existingApp) {
      return NextResponse.json(
        { success: false, message: 'You have already applied for this job' },
        { status: 400 }
      );
    }

    let finalResumeUrl = resumeUrl;
    let finalResumeName = resumeName || 'Resume.pdf';

    if (!finalResumeUrl) {
      const profile = await JobSeekerProfile.findOne({ user: auth.user._id });
      if (profile && profile.resumes && profile.resumes.length > 0) {
        const primary = profile.resumes.find((r: any) => r.isPrimary) || profile.resumes[0];
        finalResumeUrl = primary.url;
        finalResumeName = primary.name;
      } else {
        finalResumeUrl =
          'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
      }
    }

    const application = await Application.create({
      job: jobId,
      applicant: auth.user._id,
      recruiter: job.recruiter,
      company: job.company?._id || job.company,
      resumeUrl: finalResumeUrl,
      resumeName: finalResumeName,
      coverNote: coverNote || '',
      status: 'Applied',
    });

    job.applicantsCount = (job.applicantsCount || 0) + 1;
    await job.save();

    await Notification.create({
      recipient: job.recruiter,
      sender: auth.user._id,
      type: 'application_status',
      title: 'New Candidate Application',
      message: `${auth.user.name} applied for "${job.title}" at ${job.companyName}`,
      link: `/dashboard/recruiter?tab=applicants&jobId=${job._id}`,
    });

    return NextResponse.json(
      {
        success: true,
        application,
        message: 'Application submitted successfully!',
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
