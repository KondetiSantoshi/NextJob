import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { handleApiError } from '@/lib/apiError';
import CommunityAnswer from '@/models/CommunityAnswer';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(request);
    if ('error' in auth) return auth.error;

    await connectDB();
    const answer = await CommunityAnswer.findById(params.id);
    if (!answer) {
      return NextResponse.json(
        { success: false, message: 'Answer not found' },
        { status: 404 }
      );
    }

    const index = answer.upvotes.findIndex(
      (id: any) => id.toString() === auth.user._id.toString()
    );
    let isUpvoted = false;

    if (index > -1) {
      answer.upvotes.splice(index, 1);
    } else {
      answer.upvotes.push(auth.user._id);
      isUpvoted = true;
    }

    await answer.save();

    return NextResponse.json(
      {
        success: true,
        isUpvoted,
        upvotesCount: answer.upvotes.length,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
