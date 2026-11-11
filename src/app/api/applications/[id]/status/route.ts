import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { handleApiError } from '@/lib/apiError';
import Application from '@/models/Application';
import Notification from '@/models/Notification';
import '@/models/Job';

export const dynamic = 'force-dynamic';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(request, ['recruiter', 'admin']);
    if ('error' in auth) return auth.error;

    await connectDB();
    const { status, recruiterNotes } = await request.json();

    const validStatuses = [
      'Applied',
      'Viewed',
      'Shortlisted',
      'Interview Scheduled',
      'Selected',
      'Rejected',
    ];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Invalid status' },
        { status: 400 }
      );
    }

    const application = await Application.findById(params.id).populate('job');
    if (!application) {
      return NextResponse.json(
        { success: false, message: 'Application not found' },
        { status: 404 }
      );
    }

    if (
      application.recruiter.toString() !== auth.user._id.toString() &&
      auth.user.role !== 'admin'
    ) {
      return NextResponse.json(
        { success: false, message: 'Not authorized' },
        { status: 403 }
      );
    }

    application.status = status;
    if (recruiterNotes !== undefined) {
      application.recruiterNotes = recruiterNotes;
    }
    await application.save();

    await Notification.create({
      recipient: application.applicant,
      sender: auth.user._id,
      type: 'application_status',
      title: 'Application Status Updated',
      message: `Your application status for "${application.job?.title}" is now "${status}"`,
      link: '/applications',
    });

    return NextResponse.json(
      {
        success: true,
        application,
        message: `Status updated to ${status}`,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
