import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectDB } from '@/lib/db';
import { generateToken } from '@/lib/auth';
import { handleApiError } from '@/lib/apiError';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    await connectDB();
    const { password } = await request.json();
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(params.token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    const token = generateToken(user._id.toString());

    return NextResponse.json(
      {
        success: true,
        token,
        message: 'Password reset successful. You are now logged in.',
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
