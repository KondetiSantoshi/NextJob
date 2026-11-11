import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { handleApiError } from '@/lib/apiError';
import Connection from '@/models/Connection';
import User from '@/models/User';
import Notification from '@/models/Notification';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { recipientId: string } }
) {
  try {
    const auth = await requireAuth(request);
    if ('error' in auth) return auth.error;

    await connectDB();
    const recipientId = params.recipientId;

    if (recipientId === auth.user._id.toString()) {
      return NextResponse.json(
        { success: false, message: 'Cannot connect with yourself' },
        { status: 400 }
      );
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    let connection = await Connection.findOne({
      $or: [
        { requester: auth.user._id, recipient: recipientId },
        { requester: recipientId, recipient: auth.user._id },
      ],
    });

    if (connection) {
      if (connection.status === 'accepted') {
        return NextResponse.json(
          { success: false, message: 'Already connected' },
          { status: 400 }
        );
      }
      if (connection.status === 'pending') {
        return NextResponse.json(
          { success: false, message: 'Connection request is already pending' },
          { status: 400 }
        );
      }
    }

    connection = await Connection.create({
      requester: auth.user._id,
      recipient: recipientId,
      status: 'pending',
    });

    await Notification.create({
      recipient: recipientId,
      sender: auth.user._id,
      type: 'connection_request',
      title: 'New Connection Request',
      message: `${auth.user.name} sent you a connection request.`,
      link: '/network',
    });

    return NextResponse.json(
      {
        success: true,
        connection,
        message: 'Connection request sent',
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
