import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { handleApiError } from '@/lib/apiError';
import Post from '@/models/Post';
import Notification from '@/models/Notification';

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

    const index = post.likes.findIndex(
      (id: any) => id.toString() === auth.user._id.toString()
    );
    let isLiked = false;

    if (index > -1) {
      post.likes.splice(index, 1);
    } else {
      post.likes.push(auth.user._id);
      isLiked = true;

      if (post.author.toString() !== auth.user._id.toString()) {
        await Notification.create({
          recipient: post.author,
          sender: auth.user._id,
          type: 'post_like',
          title: 'New Like on your post',
          message: `${auth.user.name} liked your post: "${post.content.slice(0, 40)}..."`,
          link: '/network',
        });
      }
    }

    await post.save();

    return NextResponse.json(
      {
        success: true,
        isLiked,
        likesCount: post.likes.length,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
