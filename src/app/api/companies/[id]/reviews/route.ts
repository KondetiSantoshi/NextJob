import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { handleApiError } from '@/lib/apiError';
import Company from '@/models/Company';
import Review from '@/models/Review';
import '@/models/User';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(request);
    if ('error' in auth) return auth.error;

    await connectDB();
    const {
      rating,
      title,
      pros,
      cons,
      roleTitle,
      isCurrentEmployee,
      workLifeBalance,
      salaryBenefits,
      culture,
    } = await request.json();

    const company = await Company.findById(params.id);
    if (!company) {
      return NextResponse.json(
        { success: false, message: 'Company not found' },
        { status: 404 }
      );
    }

    const review = await Review.create({
      company: company._id,
      author: auth.user._id,
      rating: Number(rating) || 5,
      title,
      pros,
      cons,
      roleTitle: roleTitle || 'Software Engineer',
      isCurrentEmployee: isCurrentEmployee !== false,
      workLifeBalance: Number(workLifeBalance) || 4,
      salaryBenefits: Number(salaryBenefits) || 4,
      culture: Number(culture) || 4,
    });

    const allReviews = await Review.find({ company: company._id });
    const avgRating = (
      allReviews.reduce((acc: number, curr: any) => acc + curr.rating, 0) / allReviews.length
    ).toFixed(1);

    company.rating = parseFloat(avgRating);
    company.reviewsCount = allReviews.length;
    await company.save();

    const populatedReview = await Review.findById(review._id).populate(
      'author',
      'name avatar headline'
    );

    return NextResponse.json(
      {
        success: true,
        review: populatedReview,
        companyRating: company.rating,
        reviewsCount: company.reviewsCount,
        message: 'Review submitted successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
