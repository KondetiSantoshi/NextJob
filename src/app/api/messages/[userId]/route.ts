import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { handleApiError } from '@/lib/apiError';
import Message from '@/models/Message';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const auth = await requireAuth(request);
    if ('error' in auth) return auth.error;

    await connectDB();
    const currentUserId = auth.user._id;
    const partnerId = params.userId;

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, recipient: partnerId },
        { sender: partnerId, recipient: currentUserId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate('sender', 'name avatar')
      .populate('recipient', 'name avatar');

    await Message.updateMany(
      { sender: partnerId, recipient: currentUserId, read: false },
      { read: true }
    );

    const partner = await User.findById(partnerId).select(
      'name avatar headline role company location'
    );

    return NextResponse.json(
      {
        success: true,
        partner,
        messages,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const auth = await requireAuth(request);
    if ('error' in auth) return auth.error;

    await connectDB();
    const senderId = auth.user._id;
    const recipientId = params.userId;
    const { content } = await request.json();

    if (!content || !content.trim()) {
      return NextResponse.json(
        { success: false, message: 'Message content cannot be empty' },
        { status: 400 }
      );
    }

    const message = await Message.create({
      sender: senderId,
      recipient: recipientId,
      content,
    });

    const populated = await Message.findById(message._id)
      .populate('sender', 'name avatar')
      .populate('recipient', 'name avatar');

    return NextResponse.json(
      {
        success: true,
        message: populated,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
