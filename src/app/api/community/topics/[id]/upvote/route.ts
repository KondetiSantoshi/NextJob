import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { handleApiError } from '@/lib/apiError';
import CommunityTopic from '@/models/CommunityTopic';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(request);
    if ('error' in auth) return auth.error;

    await connectDB();
    const topic = await CommunityTopic.findById(params.id);
    if (!topic) {
      return NextResponse.json(
        { success: false, message: 'Topic not found' },
        { status: 404 }
      );
    }

    const index = topic.upvotes.findIndex(
      (id: any) => id.toString() === auth.user._id.toString()
    );
    let isUpvoted = false;

    if (index > -1) {
      topic.upvotes.splice(index, 1);
    } else {
      topic.upvotes.push(auth.user._id);
      isUpvoted = true;
    }

    await topic.save();

    return NextResponse.json(
      {
        success: true,
        isUpvoted,
        upvotesCount: topic.upvotes.length,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
