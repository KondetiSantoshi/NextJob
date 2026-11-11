import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { handleApiError } from '@/lib/apiError';
import Post from '@/models/Post';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(request);
    if ('error' in auth) return auth.error;

    await connectDB();
    const post = await Post.findById(params.id);
    if (!post) {
      return NextResponse.json(
        { success: false, message: 'Post not found' },
        { status: 404 }
      );
    }

    post.sharesCount = (post.sharesCount || 0) + 1;
    await post.save();

    return NextResponse.json(
      {
        success: true,
        sharesCount: post.sharesCount,
        message: 'Post shared to your network!',
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
