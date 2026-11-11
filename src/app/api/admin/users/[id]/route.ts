import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { handleApiError } from '@/lib/apiError';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(request, ['admin']);
    if ('error' in auth) return auth.error;

    await connectDB();
    const user = await User.findById(params.id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    await user.deleteOne();

    return NextResponse.json(
      {
        success: true,
        message: 'User removed from platform',
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
