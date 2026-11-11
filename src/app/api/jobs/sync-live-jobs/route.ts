import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getOptionalUser } from '@/lib/auth';
import { handleApiError } from '@/lib/apiError';
import Job from '@/models/Job';
import Company from '@/models/Company';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

async function handleSync(request: NextRequest) {
  try {
    await connectDB();
    const optionalUser = await getOptionalUser(request);

    const fetchRes = await fetch('https://www.arbeitnow.com/api/job-board-api');
    const liveData = await fetchRes.json();

    if (!liveData || !liveData.data || !Array.isArray(liveData.data)) {
      return NextResponse.json(
        { success: false, message: 'Could not fetch live job feed' },
        { status: 400 }
      );
    }

    let importedCount = 0;
    const adminUser = await User.findOne({ role: 'admin' });
    const fallbackRecruiterId = adminUser
      ? adminUser._id
      : optionalUser
      ? optionalUser._id
      : null;

    for (const item of liveData.data.slice(0, 30)) {
      const companyName = item.company_name || 'Global Tech Partner';
      let company = await Company.findOne({
        name: { $regex: new RegExp(`^${companyName}$`, 'i') },
      });

      if (!company) {
        company = await Company.create({
          name: companyName,
          slug: companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          location: item.location || 'Remote',
          industry: 'Software & Technology',
          description: `${companyName} is actively hiring top engineering and business professionals worldwide.`,
          website: item.url || '',
          careerPageUrl: item.url || '',
          logo: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(companyName)}`,
          verified: true,
        });
      }

      const existing = await Job.findOne({ title: item.title, companyName: company.name });
      if (!existing && fallbackRecruiterId) {
        const cleanDesc = (item.description || '')
          .replace(/<[^>]*>?/gm, ' ')
          .replace(/\s+/g, ' ')
          .trim();

        await Job.create({
          title: item.title,
          company: company._id,
          companyName: company.name,
          companyLogo: company.logo,
          recruiter: fallbackRecruiterId,
          category: 'Software Development',
          description: cleanDesc.slice(0, 1500) || `Exciting live opening at ${company.name}`,
          requirements: [
            'Hands-on engineering experience',
            'Strong collaborative communication',
            'Problem solving skills',
          ],
          responsibilities: [
            'Build and maintain high-scale features',
            'Participate in team agile sprints',
          ],
          skills:
            item.tags && item.tags.length > 0
              ? item.tags
              : ['Software Engineering', 'Cloud', 'APIs'],
          experienceLevel: 'Mid Level',
          minExperience: 2,
          maxExperience: 6,
          salaryMin: 18,
          salaryMax: 35,
          salaryRange: 'Competitive Global CTC',
          location: item.location || 'Remote',
          jobType: 'Full-time',
          workMode: item.remote ? 'Remote' : 'Hybrid',
          vacancies: 2,
          careerUrl: item.url || company.careerPageUrl || '',
          source: 'live_scraped',
          featured: true,
        });
        importedCount++;
      }
    }

    return NextResponse.json(
      {
        success: true,
        importedCount,
        message: `Successfully synchronized ${importedCount} live real company jobs!`,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export async function GET(request: NextRequest) {
  return handleSync(request);
}

export async function POST(request: NextRequest) {
  return handleSync(request);
}
