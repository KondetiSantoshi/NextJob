import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { handleApiError } from '@/lib/apiError';
import Company from '@/models/Company';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(request);
    if ('error' in auth) return auth.error;

    await connectDB();
    const company = await Company.findById(params.id);
    if (!company) {
      return NextResponse.json(
        { success: false, message: 'Company not found' },
        { status: 404 }
      );
    }

    const index = company.followers.findIndex(
      (f: any) => f.toString() === auth.user._id.toString()
    );
    let isFollowing = false;

    if (index > -1) {
      company.followers.splice(index, 1);
    } else {
      company.followers.push(auth.user._id);
      isFollowing = true;
    }

    await company.save();

    return NextResponse.json(
      {
        success: true,
        isFollowing,
        followersCount: company.followers.length,
        message: isFollowing
          ? `You are now following ${company.name}`
          : `Unfollowed ${company.name}`,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
