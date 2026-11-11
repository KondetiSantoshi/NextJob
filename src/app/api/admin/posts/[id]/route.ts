import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { handleApiError } from '@/lib/apiError';
import Post from '@/models/Post';

export const dynamic = 'force-dynamic';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(request, ['admin']);
    if ('error' in auth) return auth.error;

    await connectDB();
    await Post.findByIdAndDelete(params.id);

    return NextResponse.json(
      { success: true, message: 'Post removed by administrator' },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
