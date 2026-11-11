import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { handleApiError } from '@/lib/apiError';
import Connection from '@/models/Connection';
import '@/models/User';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if ('error' in auth) return auth.error;

    await connectDB();
    const userId = auth.user._id;

    const accepted = await Connection.find({
      $or: [
        { requester: userId, status: 'accepted' },
        { recipient: userId, status: 'accepted' },
      ],
    })
      .populate('requester', 'name avatar headline location role company')
      .populate('recipient', 'name avatar headline location role company');

    const connectionsList = accepted.map((c: any) =>
      c.requester._id.toString() === userId.toString() ? c.recipient : c.requester
    );

    const pendingReceived = await Connection.find({
      recipient: userId,
      status: 'pending',
    }).populate('requester', 'name avatar headline location role company');

    const pendingSent = await Connection.find({
      requester: userId,
      status: 'pending',
    }).populate('recipient', 'name avatar headline location role company');

    return NextResponse.json(
      {
        success: true,
        connections: connectionsList,
        pendingReceived,
        pendingSent,
        counts: {
          totalConnections: connectionsList.length,
          pendingRequests: pendingReceived.length,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
