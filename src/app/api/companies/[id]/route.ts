import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getOptionalUser, requireAuth } from '@/lib/auth';
import { handleApiError } from '@/lib/apiError';
import Company from '@/models/Company';
import Job from '@/models/Job';
import Review from '@/models/Review';
import '@/models/User';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const user = await getOptionalUser(request);

    const isObjectId = /^[0-9a-fA-F]{24}$/.test(params.id);
    const query = isObjectId ? { _id: params.id } : { slug: params.id };

    const company = await Company.findOne(query).populate(
      'recruiters',
      'name headline avatar email'
    );

    if (!company) {
      return NextResponse.json(
        { success: false, message: 'Company not found' },
        { status: 404 }
      );
    }

    const openJobs = await Job.find({ company: company._id, status: 'active' }).sort({
      createdAt: -1,
    });
    const reviews = await Review.find({ company: company._id })
      .populate('author', 'name avatar headline')
      .sort({ createdAt: -1 });

    const isFollowing = user
      ? company.followers.some((f: any) => f.toString() === user._id.toString())
      : false;

    return NextResponse.json(
      {
        success: true,
        company,
        openJobs,
        reviews,
        isFollowing,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(request, ['recruiter', 'admin']);
    if ('error' in auth) return auth.error;

    await connectDB();
    const company = await Company.findById(params.id);
    if (!company) {
      return NextResponse.json(
        { success: false, message: 'Company not found' },
        { status: 404 }
      );
    }

    const isOwner = company.recruiters.some(
      (r: any) => r.toString() === auth.user._id.toString()
    );
    if (!isOwner && auth.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Not authorized to edit this company' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const updated = await Company.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json(
      {
        success: true,
        company: updated,
        message: 'Company details updated',
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
