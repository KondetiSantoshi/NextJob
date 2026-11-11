import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { handleApiError } from '@/lib/apiError';
import Notification from '@/models/Notification';

export const dynamic = 'force-dynamic';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(request);
    if ('error' in auth) return auth.error;

    await connectDB();
    if (params.id === 'all') {
      await Notification.updateMany(
        { recipient: auth.user._id, read: false },
        { read: true }
      );
      return NextResponse.json(
        { success: true, message: 'All notifications marked as read' },
        { status: 200 }
      );
    }

    const notification = await Notification.findOne({
      _id: params.id,
      recipient: auth.user._id,
    });

    if (notification) {
      notification.read = true;
      await notification.save();
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Notification marked as read',
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
