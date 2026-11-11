import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { handleApiError } from '@/lib/apiError';
import Company from '@/models/Company';
import Job from '@/models/Job';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    const industry = searchParams.get('industry');
    const location = searchParams.get('location');
    const sort = searchParams.get('sort') || 'rating';

    const query: any = {};

    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { industry: { $regex: q, $options: 'i' } },
        { location: { $regex: q, $options: 'i' } },
      ];
    }

    if (industry && industry !== 'All') {
      query.industry = { $regex: new RegExp(`^${industry}$`, 'i') };
    }

    if (location && location !== 'All') {
      query.location = { $regex: location, $options: 'i' };
    }

    let sortOption: any = { rating: -1 };
    if (sort === 'name') sortOption = { name: 1 };
    if (sort === 'newest') sortOption = { createdAt: -1 };

    const companies = await Company.find(query).sort(sortOption);

    const companyIds = companies.map((c: any) => c._id);
    const jobCounts = await Job.aggregate([
      { $match: { company: { $in: companyIds }, status: 'active' } },
      { $group: { _id: '$company', count: { $sum: 1 } } },
    ]);

    const jobCountMap: Record<string, number> = {};
    jobCounts.forEach((j: any) => {
      jobCountMap[j._id.toString()] = j.count;
    });

    const enriched = companies.map((c: any) => ({
      ...c.toObject(),
      openingsCount: jobCountMap[c._id.toString()] || 0,
    }));

    return NextResponse.json(
      {
        success: true,
        count: enriched.length,
        companies: enriched,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request, ['recruiter', 'admin']);
    if ('error' in auth) return auth.error;

    await connectDB();
    const {
      name,
      website,
      industry,
      size,
      location,
      headquarters,
      description,
      logo,
      banner,
      benefits,
    } = await request.json();

    const existing = await Company.findOne({ name });
    if (existing) {
      return NextResponse.json(
        { success: false, message: 'Company with this name already exists' },
        { status: 400 }
      );
    }

    const company = await Company.create({
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      website,
      industry: industry || 'Information Technology',
      size: size || '50-200 employees',
      location,
      headquarters: headquarters || location,
      description,
      logo:
        logo || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(name)}`,
      banner:
        banner ||
        'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      benefits: benefits || ['Health Insurance', 'Remote Work Flexibility', 'Learning Stipend'],
      recruiters: [auth.user._id],
      verified: true,
    });

    auth.user.company = company._id;
    await auth.user.save();

    return NextResponse.json(
      {
        success: true,
        company,
        message: 'Company registered successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
