import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { handleApiError } from '@/lib/apiError';
import User from '@/models/User';
import Company from '@/models/Company';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request, ['admin']);
    if ('error' in auth) return auth.error;

    await connectDB();
    void Company;

    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const q = searchParams.get('q');
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '20';

    const query: any = {};

    if (role && role !== 'All') {
      query.role = role;
    }

    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { location: { $regex: q, $options: 'i' } },
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const pageSize = Math.max(1, parseInt(limit, 10) || 20);
    const skip = (pageNum - 1) * pageSize;

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .populate('company', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    return NextResponse.json(
      {
        success: true,
        total,
        totalPages: Math.ceil(total / pageSize) || 1,
        currentPage: pageNum,
        users,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
