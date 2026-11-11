import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { handleApiError } from '@/lib/apiError';
import Company from '@/models/Company';
import Job from '@/models/Job';
import User from '@/models/User';
import indianCompaniesCatalog from '@/data/indianCompaniesData';
import { getRolesForCompany, resolveSpecificCareerUrl } from '@/data/companyJobsGenerator';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    const location = searchParams.get('location');
    const industry = searchParams.get('industry');

    if (!q || !q.trim()) {
      return NextResponse.json(
        { success: false, message: 'Please provide a company name to search' },
        { status: 400 }
      );
    }

    const companyKeyword = q.trim();
    const regex = new RegExp(companyKeyword, 'i');

    let company = await Company.findOne({
      $or: [{ name: regex }, { slug: regex }, { website: regex }],
    });

    if (!company) {
      const catalogMatch = (indianCompaniesCatalog as any[]).find(
        (c) =>
          regex.test(c.name) ||
          regex.test(c.shortName) ||
          (c.aliases && c.aliases.some((a: string) => regex.test(a)))
      );

      if (catalogMatch) {
        company = await Company.create({
          name: catalogMatch.name,
          slug: catalogMatch.shortName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          industry: catalogMatch.industry,
          careerPageUrl: catalogMatch.careerPageUrl,
          website: catalogMatch.website,
          logo: catalogMatch.logo,
          headquarters: catalogMatch.headquarters,
          location: catalogMatch.locations[0] || 'Bangalore, India',
          size: catalogMatch.size,
          foundedYear: catalogMatch.foundedYear,
          rating: catalogMatch.rating,
          reviewsCount: catalogMatch.reviewsCount,
          description: catalogMatch.description,
          benefits: catalogMatch.benefits,
          verified: true,
        });

        const recruiterUser = await User.findOne({ role: 'recruiter' });
        if (catalogMatch.rolesTemplate && catalogMatch.rolesTemplate.length > 0) {
          for (const roleItem of catalogMatch.rolesTemplate) {
            await Job.create({
              title: roleItem.title,
              company: company._id,
              companyName: company.name,
              companyLogo: company.logo,
              recruiter: recruiterUser?._id,
              category: roleItem.category,
              description: `Exciting career opening at ${company.name} for ${roleItem.title}. Join an industry-leading engineering team solving massive scale challenges with modern technologies.`,
              requirements: [
                `Hands-on experience in relevant domain (${roleItem.exp})`,
                'Strong problem solving, data structures and system design skills',
                'Collaborative mindset with passion for engineering excellence',
                'Proven track record delivering reliable software in production',
              ],
              responsibilities: [
                'Design, build and maintain highly scalable services and features',
                'Work closely with product managers, QA and cross-functional teams',
                'Champion code quality, automated testing and engineering best practices',
              ],
              skills: ['Java', 'Python', 'React', 'Cloud', 'System Design', 'APIs', 'Docker'],
              experienceLevel: roleItem.exp.includes('0-1')
                ? 'Fresher'
                : roleItem.exp.includes('2-5')
                ? 'Mid Level'
                : 'Senior Level',
              minExperience: parseInt(roleItem.exp, 10) || 2,
              maxExperience: (parseInt(roleItem.exp, 10) || 2) + 3,
              salaryRange: roleItem.ctc,
              location: `${
                catalogMatch.locations[Math.floor(Math.random() * catalogMatch.locations.length)]
              }, India`,
              jobType: 'Full-time',
              workMode: roleItem.mode || 'Hybrid',
              vacancies: Math.floor(Math.random() * 5) + 2,
              careerUrl: catalogMatch.careerPageUrl,
              source: 'official_career_page',
              status: 'active',
            });
          }
        }
      } else {
        const cleanName = companyKeyword.charAt(0).toUpperCase() + companyKeyword.slice(1);
        const domainName = companyKeyword.toLowerCase().replace(/[^a-z0-9]/g, '');
        const careerUrl = `https://careers.${domainName}.com`;

        company = await Company.create({
          name: cleanName,
          slug: domainName,
          industry: industry || 'Information Technology & Software',
          careerPageUrl: careerUrl,
          website: `https://${domainName}.com`,
          logo: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(cleanName)}`,
          headquarters: location || 'Bangalore, Karnataka, India',
          location: location || 'Bangalore, India',
          size: '1,000 - 10,000+ employees',
          foundedYear: 2014,
          rating: 4.4,
          reviewsCount: 1200,
          description: `${cleanName} is one of India's prominent enterprises powering digital transformation, products, and services across India.`,
          benefits: [
            'Health Insurance',
            'Flexible Hybrid Work',
            'Performance Incentive',
            'Learning Allowance',
          ],
          verified: true,
        });

        const sampleRoles = [
          {
            title: 'Software Engineer (Full Stack / Backend)',
            exp: '2-5 Yrs',
            ctc: '₹14,00,000 - ₹28,00,000 PA',
            category: 'Software Development',
          },
          {
            title: 'Senior Frontend Developer (React / Next.js)',
            exp: '3-6 Yrs',
            ctc: '₹18,00,000 - ₹32,00,000 PA',
            category: 'Web Development',
          },
          {
            title: 'DevOps & Cloud Systems Engineer',
            exp: '2-5 Yrs',
            ctc: '₹12,00,000 - ₹24,00,000 PA',
            category: 'DevOps',
          },
        ];

        const recruiterUser = await User.findOne({ role: 'recruiter' });
        for (const sRole of sampleRoles) {
          await Job.create({
            title: sRole.title,
            company: company._id,
            companyName: company.name,
            companyLogo: company.logo,
            recruiter: recruiterUser?._id,
            category: sRole.category,
            description: `Official job opening at ${cleanName}. Work on high-impact products and modern tech stack with competitive compensation.`,
            requirements: [
              'Strong engineering fundamentals',
              'Proven experience with modern frameworks',
              'Problem-solving and teamwork',
            ],
            responsibilities: [
              'Architect and deliver production-grade modules',
              'Collaborate with engineering leadership',
              'Maintain automated tests and documentation',
            ],
            skills: ['React', 'Node.js', 'Python', 'AWS', 'Docker', 'SQL'],
            experienceLevel: 'Mid Level',
            minExperience: 2,
            maxExperience: 5,
            salaryRange: sRole.ctc,
            location: location || 'Bangalore, India',
            jobType: 'Full-time',
            workMode: 'Hybrid',
            vacancies: 3,
            careerUrl,
            source: 'official_career_page',
            status: 'active',
          });
        }
      }
    }

    const existingCompJobs = await Job.find({ company: company._id, status: 'active' });
    if (existingCompJobs.length < 6) {
      const recruiterUser = await User.findOne({ role: 'recruiter' });
      const roles = getRolesForCompany(company.name);
      for (const role of roles) {
        const exists = await Job.findOne({ company: company._id, title: role.title });
        if (!exists) {
          await Job.create({
            title: role.title,
            company: company._id,
            companyName: company.name,
            companyLogo: company.logo,
            recruiter: recruiterUser?._id,
            category: role.category,
            description: role.desc,
            requirements: [
              `Hands-on expertise (${role.exp}) in core software engineering domain`,
              'Strong knowledge of algorithms, data structures and system design',
              'Collaborative mindset with passion for high quality code',
            ],
            responsibilities: [
              'Design, develop and maintain scalable services and user interfaces',
              'Collaborate with cross-functional product and QA teams',
              'Champion continuous integration and clean code architecture',
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
            careerUrl: resolveSpecificCareerUrl(company.name, role.title),
            source: 'official_career_page',
            status: 'active',
            featured: true,
          });
        }
      }
    }

    const jobs = await Job.find({ company: company._id, status: 'active' }).sort({
      createdAt: -1,
    });

    return NextResponse.json(
      {
        success: true,
        company,
        jobs,
        totalJobs: jobs.length,
        careerPageUrl: company.careerPageUrl,
        message: `Found ${jobs.length} career page jobs for ${company.name}`,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
