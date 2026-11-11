import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { handleApiError } from '@/lib/apiError';
import JobSeekerProfile from '@/models/JobSeekerProfile';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    await connectDB();
    const user = await User.findById(params.userId).select('-password');
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    const profile = await JobSeekerProfile.findOne({ user: user._id });

    return NextResponse.json(
      {
        success: true,
        user,
        profile,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
