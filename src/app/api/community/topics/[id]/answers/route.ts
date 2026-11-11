import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { handleApiError } from '@/lib/apiError';
import CommunityTopic from '@/models/CommunityTopic';
import CommunityAnswer from '@/models/CommunityAnswer';
import Notification from '@/models/Notification';
import '@/models/User';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(request);
    if ('error' in auth) return auth.error;

    await connectDB();
    const { content } = await request.json();
    if (!content || !content.trim()) {
      return NextResponse.json(
        { success: false, message: 'Answer content cannot be empty' },
        { status: 400 }
      );
    }

    const topic = await CommunityTopic.findById(params.id);
    if (!topic) {
      return NextResponse.json(
        { success: false, message: 'Topic not found' },
        { status: 404 }
      );
    }

    const answer = await CommunityAnswer.create({
      topic: topic._id,
      author: auth.user._id,
      content,
    });

    if (topic.author.toString() !== auth.user._id.toString()) {
      await Notification.create({
        recipient: topic.author,
        sender: auth.user._id,
        type: 'system',
        title: 'New Community Answer',
        message: `${auth.user.name} answered your discussion: "${topic.title.slice(0, 40)}..."`,
        link: '/community',
      });
    }

    const populated = await CommunityAnswer.findById(answer._id).populate(
      'author',
      'name avatar headline role'
    );

    return NextResponse.json(
      {
        success: true,
        answer: { ...populated.toObject(), isUpvoted: false },
        message: 'Your answer has been posted',
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
