import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { handleApiError } from '@/lib/apiError';
import Connection from '@/models/Connection';
import User from '@/models/User';
import '@/models/Company';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if ('error' in auth) return auth.error;

    await connectDB();
    const userId = auth.user._id;

    const existing = await Connection.find({
      $or: [{ requester: userId }, { recipient: userId }],
    });

    const excludedIds = existing.map((c: any) =>
      c.requester.toString() === userId.toString() ? c.recipient : c.requester
    );
    excludedIds.push(userId);

    const suggestions = await User.find({
      _id: { $nin: excludedIds },
      isActive: true,
    })
      .select('name avatar headline location role company')
      .populate('company', 'name')
      .limit(10);

    return NextResponse.json(
      {
        success: true,
        suggestions,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
