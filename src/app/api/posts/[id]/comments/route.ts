import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { handleApiError } from '@/lib/apiError';
import Post from '@/models/Post';
import Comment from '@/models/Comment';
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
        { success: false, message: 'Comment cannot be empty' },
        { status: 400 }
      );
    }

    const post = await Post.findById(params.id);
    if (!post) {
      return NextResponse.json(
        { success: false, message: 'Post not found' },
        { status: 404 }
      );
    }

    const comment = await Comment.create({
      post: post._id,
      author: auth.user._id,
      content,
    });

    if (post.author.toString() !== auth.user._id.toString()) {
      await Notification.create({
        recipient: post.author,
        sender: auth.user._id,
        type: 'post_like',
        title: 'New Comment on your post',
        message: `${auth.user.name} commented on your post: "${content.slice(0, 40)}..."`,
        link: '/network',
      });
    }

    const populated = await Comment.findById(comment._id).populate(
      'author',
      'name avatar headline'
    );

    return NextResponse.json(
      {
        success: true,
        comment: populated,
        message: 'Comment posted',
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
