import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { handleApiError } from '@/lib/apiError';
import Post from '@/models/Post';
import Comment from '@/models/Comment';

export const dynamic = 'force-dynamic';

export async function DELETE(
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

    if (post.author.toString() !== auth.user._id.toString() && auth.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Not authorized' },
        { status: 403 }
      );
    }

    await Comment.deleteMany({ post: post._id });
    await post.deleteOne();

    return NextResponse.json(
      {
        success: true,
        message: 'Post deleted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
