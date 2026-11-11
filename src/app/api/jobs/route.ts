import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { handleApiError } from '@/lib/apiError';
import Job from '@/models/Job';
import Company from '@/models/Company';
import User from '@/models/User';
import indianCompaniesCatalog from '@/data/indianCompaniesData';
import { getRolesForCompany, resolveSpecificCareerUrl } from '@/data/companyJobsGenerator';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);

    const q = searchParams.get('q');
    const category = searchParams.get('category');
    const location = searchParams.get('location');
    const workModeParams = searchParams.getAll('workMode');
    const jobTypeParams = searchParams.getAll('jobType');
    const experienceLevel = searchParams.get('experienceLevel');
    const minExp = searchParams.get('minExp');
    const maxExp = searchParams.get('maxExp');
    const salaryMin = searchParams.get('salaryMin');
    const fresher = searchParams.get('fresher');
    const featured = searchParams.get('featured');
    const careerOnly = searchParams.get('careerOnly');
    const sort = searchParams.get('sort') || 'newest';
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';

    const query: any = { status: 'active' };

    if (q && q.trim()) {
      const keyword = q.trim();
      const regex = new RegExp(keyword, 'i');

      let matchedCompany = await Company.findOne({
        $or: [{ name: regex }, { slug: regex }, { website: regex }],
      });

      if (!matchedCompany) {
        const catMatch = (indianCompaniesCatalog as any[]).find(
          (c) =>
            regex.test(c.name) ||
            regex.test(c.shortName) ||
            (c.aliases && c.aliases.some((a: string) => regex.test(a)))
        );

        if (catMatch) {
          const recruiterUser = await User.findOne({ role: 'recruiter' });
          matchedCompany = await Company.create({
            name: catMatch.name,
            slug: catMatch.shortName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            industry: catMatch.industry,
            careerPageUrl: catMatch.careerPageUrl,
            website: catMatch.website,
            logo: catMatch.logo,
            headquarters: catMatch.headquarters,
            location: catMatch.locations?.[0] || 'Bangalore, India',
            size: catMatch.size,
            foundedYear: catMatch.foundedYear,
            rating: catMatch.rating,
            reviewsCount: catMatch.reviewsCount,
            description: catMatch.description,
            benefits: catMatch.benefits,
            verified: true,
            recruiters: recruiterUser ? [recruiterUser._id] : [],
          });
        }
      }

      const COMMON_SKILLS = [
        'react',
        'node',
        'python',
        'java',
        'sql',
        'developer',
        'engineer',
        'frontend',
        'backend',
        'fullstack',
        'fresher',
        'remote',
        'intern',
        'cloud',
        'devops',
      ];
      if (!matchedCompany && !COMMON_SKILLS.includes(keyword.toLowerCase()) && keyword.length >= 3) {
        const cleanName = keyword.charAt(0).toUpperCase() + keyword.slice(1);
        const domain = keyword.toLowerCase().replace(/[^a-z0-9]/g, '');
        const recruiterUser = await User.findOne({ role: 'recruiter' });
        matchedCompany = await Company.create({
          name: cleanName,
          slug: domain,
          industry: 'Software & Technology Services',
          careerPageUrl: `https://careers.${domain}.com`,
          website: `https://${domain}.com`,
          logo: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(cleanName)}`,
          headquarters: 'Bangalore, India',
          location: 'Bangalore, India',
          size: '1,000 - 10,000+ employees',
          foundedYear: 2016,
          rating: 4.3,
          reviewsCount: 1400,
          description: `${cleanName} is one of India's prominent technology and business enterprises powering digital innovation.`,
          benefits: ['Health Insurance', 'Flexible Hybrid Work', 'Learning Allowance', 'Performance Bonus'],
          verified: true,
          recruiters: recruiterUser ? [recruiterUser._id] : [],
        });
      }

      if (matchedCompany) {
        const existingCompJobs = await Job.countDocuments({
          company: matchedCompany._id,
          status: 'active',
        });
        if (existingCompJobs < 6) {
          const recruiterUser = await User.findOne({ role: 'recruiter' });
          const roles = getRolesForCompany(matchedCompany.name);
          for (const role of roles) {
            const exists = await Job.findOne({
              company: matchedCompany._id,
              title: role.title,
            });
            if (!exists) {
              await Job.create({
                title: role.title,
                company: matchedCompany._id,
                companyName: matchedCompany.name,
                companyLogo: matchedCompany.logo,
                recruiter: recruiterUser?._id,
                category: role.category,
                description: role.desc,
                requirements: [
                  `Relevant experience (${role.exp}) in software engineering domain`,
                  'Strong problem solving, data structures, and architecture principles',
                  'Passion for writing clean, tested, and high-performance code',
                ],
                responsibilities: [
                  'Design, develop and maintain scalable services and user interfaces',
                  'Work closely with product managers, designers and QA engineers',
                  'Champion engineering best practices and agile delivery',
                ],
                skills: role.skills,
                experienceLevel: role.expLevel,
                minExperience: role.minExp,
                maxExperience: role.maxExp,
                salaryRange: role.ctc,
                location: role.location,
                jobType: 'Full-time',
                workMode: role.mode,
                vacancies: 4,
                careerUrl: resolveSpecificCareerUrl(matchedCompany.name, role.title),
                source: 'official_career_page',
                status: 'active',
                featured: true,
              });
            }
          }
        }

        query.$or = [
          { company: matchedCompany._id },
          { companyName: { $regex: keyword, $options: 'i' } },
          { title: { $regex: keyword, $options: 'i' } },
          { skills: { $in: [new RegExp(keyword, 'i')] } },
          { location: { $regex: keyword, $options: 'i' } },
          { category: { $regex: keyword, $options: 'i' } },
        ];
      } else {
        query.$or = [
          { title: { $regex: keyword, $options: 'i' } },
          { companyName: { $regex: keyword, $options: 'i' } },
          { skills: { $in: [new RegExp(keyword, 'i')] } },
          { location: { $regex: keyword, $options: 'i' } },
          { category: { $regex: keyword, $options: 'i' } },
        ];
      }
    }

    if (category && category !== 'All' && category !== 'all') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    if (location && location !== 'All' && location !== 'all') {
      query.location = { $regex: location, $options: 'i' };
    }

    if (workModeParams.length > 0 && !workModeParams.includes('All')) {
      const modes = workModeParams.flatMap((m) => m.split(','));
      query.workMode = { $in: modes.map((m) => new RegExp(`^${m.trim()}$`, 'i')) };
    }

    if (jobTypeParams.length > 0 && !jobTypeParams.includes('All')) {
      const types = jobTypeParams.flatMap((t) => t.split(','));
      query.jobType = { $in: types.map((t) => new RegExp(`^${t.trim()}$`, 'i')) };
    }

    if (fresher === 'true') {
      query.minExperience = { $lte: 1 };
    } else {
      if (minExp !== null && minExp !== '') {
        query.minExperience = { $gte: Number(minExp) };
      }
      if (maxExp !== null && maxExp !== '') {
        query.maxExperience = { $lte: Number(maxExp) };
      }
    }

    if (experienceLevel && experienceLevel !== 'All') {
      query.experienceLevel = experienceLevel;
    }

    if (salaryMin !== null && salaryMin !== '') {
      query.salaryMax = { $gte: Number(salaryMin) };
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (careerOnly === 'true') {
      query.careerUrl = { $exists: true, $ne: '' };
    }

    let sortOption: any = { createdAt: -1 };
    if (sort === 'salary_high') {
      sortOption = { salaryMax: -1 };
    } else if (sort === 'popular') {
      sortOption = { applicantsCount: -1 };
    } else if (sort === 'oldest') {
      sortOption = { createdAt: 1 };
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const pageSize = Math.max(1, parseInt(limit, 10) || 10);
    const skip = (pageNum - 1) * pageSize;

    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate('company', 'name logo location industry rating')
      .populate('recruiter', 'name email avatar')
      .sort(sortOption)
      .skip(skip)
      .limit(pageSize);

    return NextResponse.json(
      {
        success: true,
        count: jobs.length,
        total,
        totalPages: Math.ceil(total / pageSize) || 1,
        currentPage: pageNum,
        jobs,
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
      title,
      companyId,
      companyName,
      category,
      description,
      requirements,
      responsibilities,
      skills,
      experienceLevel,
      minExperience,
      maxExperience,
      salaryMin,
      salaryMax,
      salaryRange,
      location,
      jobType,
      workMode,
      vacancies,
      education,
      deadline,
      featured,
      urgent,
    } = await request.json();

    let company = null;
    if (companyId) {
      company = await Company.findById(companyId);
    } else if (auth.user.company) {
      company = await Company.findById(auth.user.company);
    }

    if (!company) {
      const cName = companyName || 'InnovateTech Systems';
      company = await Company.findOne({ name: cName });
      if (!company) {
        company = await Company.create({
          name: cName,
          slug: cName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          location: location || 'Bangalore, India',
          description: `${cName} is actively hiring tech and business professionals.`,
          logo: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(cName)}`,
          recruiters: [auth.user._id],
        });
      }
    }

    let parsedSkills = skills;
    if (typeof skills === 'string') {
      parsedSkills = skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }

    let parsedRequirements = requirements;
    if (typeof requirements === 'string') {
      parsedRequirements = requirements
        .split('\n')
        .map((r) => r.trim())
        .filter(Boolean);
    }

    let parsedResponsibilities = responsibilities;
    if (typeof responsibilities === 'string') {
      parsedResponsibilities = responsibilities
        .split('\n')
        .map((r) => r.trim())
        .filter(Boolean);
    }

    const job = await Job.create({
      title,
      company: company._id,
      companyName: company.name,
      companyLogo: company.logo,
      recruiter: auth.user._id,
      category,
      description,
      requirements: parsedRequirements || [],
      responsibilities: parsedResponsibilities || [],
      skills: parsedSkills && parsedSkills.length ? parsedSkills : ['General Skills'],
      experienceLevel: experienceLevel || 'Mid Level',
      minExperience: Number(minExperience) || 0,
      maxExperience: Number(maxExperience) || 5,
      salaryMin: Number(salaryMin) || 0,
      salaryMax: Number(salaryMax) || 0,
      salaryRange:
        salaryRange || (salaryMin && salaryMax ? `₹${salaryMin} - ₹${salaryMax} LPA` : 'Competitive'),
      location,
      jobType: jobType || 'Full-time',
      workMode: workMode || 'On-site',
      vacancies: Number(vacancies) || 1,
      education: education || "Bachelor's degree or equivalent experience",
      deadline: deadline ? new Date(deadline) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      featured: Boolean(featured),
      urgent: Boolean(urgent),
    });

    return NextResponse.json(
      {
        success: true,
        job,
        message: 'Job posted successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
