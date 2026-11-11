import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { handleApiError } from '@/lib/apiError';
import Message from '@/models/Message';
import '@/models/User';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if ('error' in auth) return auth.error;

    await connectDB();
    const userId = auth.user._id;

    const messages = await Message.find({
      $or: [{ sender: userId }, { recipient: userId }],
    })
      .sort({ createdAt: -1 })
      .populate('sender', 'name avatar headline role')
      .populate('recipient', 'name avatar headline role');

    const conversationMap: Record<string, any> = {};

    messages.forEach((msg: any) => {
      const partner =
        msg.sender._id.toString() === userId.toString() ? msg.recipient : msg.sender;
      if (!partner) return;

      const partnerId = partner._id.toString();
      if (!conversationMap[partnerId]) {
        conversationMap[partnerId] = {
          user: partner,
          lastMessage: msg.content,
          lastMessageDate: msg.createdAt,
          unreadCount: 0,
        };
      }

      if (msg.recipient._id.toString() === userId.toString() && !msg.read) {
        conversationMap[partnerId].unreadCount += 1;
      }
    });

    const conversations = Object.values(conversationMap);

    return NextResponse.json(
      {
        success: true,
        conversations,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
