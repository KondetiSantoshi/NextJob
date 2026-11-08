const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Company = require('./models/Company');
const Job = require('./models/Job');
const User = require('./models/User');
const indianCompaniesCatalog = require('./data/indianCompaniesData');

const seedIndianCompanies = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/jobportal');
    console.log('Connected to MongoDB. Seeding Indian companies & career page jobs...');

    let recruiter = await User.findOne({ role: 'recruiter' });
    if (!recruiter) {
      recruiter = await User.create({
        name: 'Technical Hiring Team',
        email: 'recruiter.india@nexjob.com',
        role: 'recruiter',
        password: 'password123',
        location: 'Bangalore, India'
      });
    }

    let companiesAdded = 0;
    let jobsAdded = 0;

    for (const compData of indianCompaniesCatalog) {
      let company = await Company.findOne({ name: compData.name });
      if (!company) {
        company = await Company.create({
          name: compData.name,
          slug: compData.shortName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          industry: compData.industry,
          careerPageUrl: compData.careerPageUrl,
          website: compData.website,
          logo: compData.logo,
          headquarters: compData.headquarters,
          location: compData.locations[0] || 'Bangalore, India',
          size: compData.size,
          foundedYear: compData.foundedYear,
          rating: compData.rating,
          reviewsCount: compData.reviewsCount,
          description: compData.description,
          benefits: compData.benefits,
          verified: true,
          recruiters: [recruiter._id]
        });
        companiesAdded++;
      } else {
        // Ensure careerPageUrl is set
        company.careerPageUrl = compData.careerPageUrl;
        company.logo = compData.logo || company.logo;
        company.verified = true;
        await company.save();
      }

      // Check existing jobs for this company
      const existingJobs = await Job.countDocuments({ company: company._id });
      if (existingJobs === 0 && compData.rolesTemplate) {
        for (const roleItem of compData.rolesTemplate) {
          const randLoc = compData.locations[Math.floor(Math.random() * compData.locations.length)];
          await Job.create({
            title: roleItem.title,
            company: company._id,
            companyName: company.name,
            companyLogo: company.logo,
            recruiter: recruiter._id,
            category: roleItem.category,
            description: `Exciting opening at ${company.name} for ${roleItem.title}. Join an industry-leading engineering team solving massive scale challenges with modern technologies.`,
            requirements: [
              `Hands-on experience in relevant domain (${roleItem.exp})`,
              'Strong problem solving, data structures and system design skills',
              'Collaborative mindset with passion for engineering excellence',
              'Proven track record delivering reliable software in production'
            ],
            responsibilities: [
              'Design, build and maintain highly scalable services and features',
              'Work closely with product managers, QA and cross-functional teams',
              'Champion code quality, automated testing and engineering best practices'
            ],
            skills: ['Java', 'Python', 'React', 'Cloud', 'System Design', 'APIs', 'Docker', 'Kubernetes'],
            experienceLevel: roleItem.exp.includes('0-1') ? 'Fresher' : roleItem.exp.includes('2-5') ? 'Mid Level' : 'Senior Level',
            minExperience: parseInt(roleItem.exp) || 2,
            maxExperience: (parseInt(roleItem.exp) || 2) + 3,
            salaryRange: roleItem.ctc,
            location: `${randLoc}, India`,
            jobType: 'Full-time',
            workMode: roleItem.mode || 'Hybrid',
            vacancies: Math.floor(Math.random() * 5) + 2,
            careerUrl: compData.careerPageUrl,
            source: 'official_career_page',
            status: 'active'
          });
          jobsAdded++;
        }
      }
    }

    const totalCompanies = await Company.countDocuments();
    const totalJobs = await Job.countDocuments();
    console.log(`Finished seeding! New Companies: ${companiesAdded}, New Jobs: ${jobsAdded}`);
    console.log(`TOTAL IN DATABASE NOW -> Companies: ${totalCompanies}, Jobs: ${totalJobs}`);

    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedIndianCompanies();
