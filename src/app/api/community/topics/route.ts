import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getOptionalUser, requireAuth } from '@/lib/auth';
import { handleApiError } from '@/lib/apiError';
import CommunityTopic from '@/models/CommunityTopic';
import CommunityAnswer from '@/models/CommunityAnswer';
import '@/models/User';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const user = await getOptionalUser(request);

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const q = searchParams.get('q');
    const sort = searchParams.get('sort') || 'newest';
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '15';

    const query: any = { isFlagged: false };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } },
      ];
    }

    let sortOption: any = { createdAt: -1 };
    if (sort === 'popular') sortOption = { viewsCount: -1 };

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const pageSize = Math.max(1, parseInt(limit, 10) || 15);
    const skip = (pageNum - 1) * pageSize;

    const topics = await CommunityTopic.find(query)
      .populate('author', 'name avatar headline role')
      .sort(sortOption)
      .skip(skip)
      .limit(pageSize);

    const topicIds = topics.map((t: any) => t._id);
    const answersCounts = await CommunityAnswer.aggregate([
      { $match: { topic: { $in: topicIds } } },
      { $group: { _id: '$topic', count: { $sum: 1 } } },
    ]);

    const countMap: Record<string, number> = {};
    answersCounts.forEach((a: any) => {
      countMap[a._id.toString()] = a.count;
    });

    const enriched = topics.map((t: any) => {
      const obj = t.toObject();
      obj.answersCount = countMap[obj._id.toString()] || 0;
      obj.isUpvoted = user
        ? t.upvotes.some((id: any) => id.toString() === user._id.toString())
        : false;
      return obj;
    });

    const total = await CommunityTopic.countDocuments(query);

    return NextResponse.json(
      {
        success: true,
        topics: enriched,
        total,
        totalPages: Math.ceil(total / pageSize) || 1,
        currentPage: pageNum,
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
    const { category, title, content, tags } = await request.json();

    if (!title || !content || !category) {
      return NextResponse.json(
        { success: false, message: 'Please provide category, title, and content' },
        { status: 400 }
      );
    }

    let parsedTags = tags;
    if (typeof tags === 'string') {
      parsedTags = tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
    }

    const topic = await CommunityTopic.create({
      author: auth.user._id,
      category,
      title,
      content,
      tags: parsedTags || [],
    });

    const populated = await CommunityTopic.findById(topic._id).populate(
      'author',
      'name avatar headline role'
    );

    return NextResponse.json(
      {
        success: true,
        topic: populated,
        message: 'Discussion topic created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
