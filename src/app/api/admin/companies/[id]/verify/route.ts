import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { handleApiError } from '@/lib/apiError';
import Company from '@/models/Company';

export const dynamic = 'force-dynamic';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(request, ['admin']);
    if ('error' in auth) return auth.error;

    await connectDB();
    const company = await Company.findById(params.id);
    if (!company) {
      return NextResponse.json(
        { success: false, message: 'Company not found' },
        { status: 404 }
      );
    }

    company.verified = !company.verified;
    await company.save();

    return NextResponse.json(
      {
        success: true,
        company,
        message: `Company status updated to ${company.verified ? 'Verified' : 'Unverified'}`,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
