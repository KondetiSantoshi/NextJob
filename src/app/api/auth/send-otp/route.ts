import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { handleApiError } from '@/lib/apiError';
import User from '@/models/User';
import OtpCode from '@/models/OtpCode';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { identifier } = await request.json();
    if (!identifier) {
      return NextResponse.json(
        { success: false, message: 'Please provide email or mobile number' },
        { status: 400 }
      );
    }

    const cleanId = identifier.trim().toLowerCase();
    const isEmail = cleanId.includes('@');

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpire = new Date(Date.now() + 10 * 60 * 1000);

    const query = isEmail ? { email: cleanId } : { mobile: cleanId };
    const user = await User.findOne(query);

    if (user) {
      user.otp = otp;
      user.otpExpire = otpExpire;
      await user.save();
    } else {
      await OtpCode.findOneAndUpdate(
        { identifier: cleanId },
        { identifier: cleanId, otp, expiresAt: otpExpire },
        { upsert: true, new: true }
      );
    }

    console.log(`[OTP AUTH] Generated OTP for ${cleanId}: ${otp}`);

    return NextResponse.json(
      {
        success: true,
        message: `Verification code sent to ${cleanId}`,
        otp,
        isExistingUser: Boolean(user),
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
