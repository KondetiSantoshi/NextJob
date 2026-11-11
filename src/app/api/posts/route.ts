import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getOptionalUser, requireAuth } from '@/lib/auth';
import { handleApiError } from '@/lib/apiError';
import Post from '@/models/Post';
import Comment from '@/models/Comment';
import '@/models/User';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const user = await getOptionalUser(request);

    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';
    const tag = searchParams.get('tag');

    const query: any = { isFlagged: false };
    if (tag) {
      query.tags = tag;
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const pageSize = Math.max(1, parseInt(limit, 10) || 10);
    const skip = (pageNum - 1) * pageSize;

    const posts = await Post.find(query)
      .populate('author', 'name avatar headline location role company')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    const postIds = posts.map((p: any) => p._id);
    const comments = await Comment.find({ post: { $in: postIds } })
      .populate('author', 'name avatar headline')
      .sort({ createdAt: 1 });

    const commentMap: Record<string, any[]> = {};
    comments.forEach((c: any) => {
      const pid = c.post.toString();
      if (!commentMap[pid]) commentMap[pid] = [];
      commentMap[pid].push(c);
    });

    const enriched = posts.map((post: any) => {
      const p = post.toObject();
      p.comments = commentMap[p._id.toString()] || [];
      p.commentsCount = p.comments.length;
      p.isLiked = user
        ? post.likes.some((id: any) => id.toString() === user._id.toString())
        : false;
      return p;
    });

    const total = await Post.countDocuments(query);

    return NextResponse.json(
      {
        success: true,
        posts: enriched,
        total,
        hasMore: skip + posts.length < total,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if ('error' in auth) return auth.error;

    await connectDB();
    const { content, mediaUrl, mediaType, tags } = await request.json();

    if (!content || !content.trim()) {
      return NextResponse.json(
        { success: false, message: 'Content cannot be empty' },
        { status: 400 }
      );
    }

    let parsedTags = tags;
    if (typeof tags === 'string') {
      parsedTags = tags
        .split(',')
        .map((t) => t.trim().replace(/^#/, ''))
        .filter(Boolean);
    }

    const post = await Post.create({
      author: auth.user._id,
      content,
      mediaUrl: mediaUrl || '',
      mediaType: mediaType || (mediaUrl ? 'image' : 'none'),
      tags: parsedTags || [],
    });

    const populatedPost = await Post.findById(post._id).populate(
      'author',
      'name avatar headline location role company'
    );

    return NextResponse.json(
      {
        success: true,
        post: {
          ...populatedPost.toObject(),
          comments: [],
          commentsCount: 0,
          isLiked: false,
        },
        message: 'Post created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
