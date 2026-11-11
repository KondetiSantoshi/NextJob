import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { handleApiError } from '@/lib/apiError';
import Connection from '@/models/Connection';
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
    const { action } = await request.json();
    const connection = await Connection.findById(params.id);

    if (!connection) {
      return NextResponse.json(
        { success: false, message: 'Connection request not found' },
        { status: 404 }
      );
    }

    if (connection.recipient.toString() !== auth.user._id.toString()) {
      return NextResponse.json(
        { success: false, message: 'Not authorized to respond' },
        { status: 403 }
      );
    }

    if (action === 'accept') {
      connection.status = 'accepted';
      await connection.save();

      await Notification.create({
        recipient: connection.requester,
        sender: auth.user._id,
        type: 'connection_request',
        title: 'Connection Accepted',
        message: `${auth.user.name} accepted your connection request.`,
        link: '/network',
      });

      return NextResponse.json(
        {
          success: true,
          message: 'Connection accepted',
        },
        { status: 200 }
      );
    } else {
      await connection.deleteOne();
      return NextResponse.json(
        {
          success: true,
          message: 'Connection request declined',
        },
        { status: 200 }
      );
    }
  } catch (error) {
    return handleApiError(error);
  }
}
