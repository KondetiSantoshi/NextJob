import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getOptionalUser } from '@/lib/auth';
import { handleApiError } from '@/lib/apiError';
import CommunityTopic from '@/models/CommunityTopic';
import CommunityAnswer from '@/models/CommunityAnswer';
import '@/models/User';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const user = await getOptionalUser(request);

    const topic = await CommunityTopic.findById(params.id).populate(
      'author',
      'name avatar headline role'
    );

    if (!topic) {
      return NextResponse.json(
        { success: false, message: 'Topic not found' },
        { status: 404 }
      );
    }

    topic.viewsCount = (topic.viewsCount || 0) + 1;
    await topic.save();

    const answers = await CommunityAnswer.find({ topic: topic._id })
      .populate('author', 'name avatar headline role')
      .sort({ isAccepted: -1, upvotes: -1, createdAt: 1 });

    const enrichedAnswers = answers.map((a: any) => {
      const obj = a.toObject();
      obj.isUpvoted = user
        ? a.upvotes.some((id: any) => id.toString() === user._id.toString())
        : false;
      return obj;
    });

    const isUpvoted = user
      ? topic.upvotes.some((id: any) => id.toString() === user._id.toString())
      : false;

    return NextResponse.json(
      {
        success: true,
        topic: { ...topic.toObject(), isUpvoted },
        answers: enrichedAnswers,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
