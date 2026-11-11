import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { handleApiError } from '@/lib/apiError';
import Application from '@/models/Application';
import Notification from '@/models/Notification';
import '@/models/Job';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(request, ['recruiter', 'admin']);
    if ('error' in auth) return auth.error;

    await connectDB();
    const { date, time, mode, link, notes } = await request.json();

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

    application.status = 'Interview Scheduled';
    application.interviewDetails = {
      date,
      time,
      mode: mode || 'Google Meet',
      link: link || 'https://meet.google.com/xyz-demo-abc',
      notes: notes || '',
    };
    await application.save();

    await Notification.create({
      recipient: application.applicant,
      sender: auth.user._id,
      type: 'interview_scheduled',
      title: 'Interview Scheduled!',
      message: `Interview scheduled for "${application.job?.title}" on ${date} at ${time} via ${
        mode || 'Google Meet'
      }.`,
      link: '/applications',
    });

    return NextResponse.json(
      {
        success: true,
        application,
        message: 'Interview successfully scheduled and candidate notified',
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
