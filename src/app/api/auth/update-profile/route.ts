import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { handleApiError } from '@/lib/apiError';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function PUT(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if ('error' in auth) return auth.error;

    await connectDB();
    const { name, mobile, location, headline, bio, avatar } = await request.json();
    const user = await User.findById(auth.user._id);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    if (name) user.name = name;
    if (mobile !== undefined) user.mobile = mobile;
    if (location !== undefined) user.location = location;
    if (headline !== undefined) user.headline = headline;
    if (bio !== undefined) user.bio = bio;
    if (avatar) user.avatar = avatar;

    await user.save();

    return NextResponse.json(
      {
        success: true,
        user,
        message: 'Profile updated successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
