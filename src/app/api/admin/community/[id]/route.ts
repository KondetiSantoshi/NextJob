import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { handleApiError } from '@/lib/apiError';
import CommunityTopic from '@/models/CommunityTopic';

export const dynamic = 'force-dynamic';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(request, ['admin']);
    if ('error' in auth) return auth.error;

    await connectDB();
    await CommunityTopic.findByIdAndDelete(params.id);

    return NextResponse.json(
      { success: true, message: 'Community topic removed by administrator' },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
