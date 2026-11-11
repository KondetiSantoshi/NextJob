import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { handleApiError } from '@/lib/apiError';
import Notification from '@/models/Notification';
import '@/models/User';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if ('error' in auth) return auth.error;

    await connectDB();
    const notifications = await Notification.find({ recipient: auth.user._id })
      .sort({ createdAt: -1 })
      .populate('sender', 'name avatar');

    const unreadCount = await Notification.countDocuments({
      recipient: auth.user._id,
      read: false,
    });

    return NextResponse.json(
      {
        success: true,
        unreadCount,
        notifications,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
