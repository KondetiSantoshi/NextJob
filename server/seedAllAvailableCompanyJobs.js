/**
 * seedAllAvailableCompanyJobs.js
 * Populates complete suites of available official career jobs for all major Indian companies.
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Company = require('./models/Company');
const Job = require('./models/Job');
const User = require('./models/User');
const { getRolesForCompany, TOP_COMPANIES_ROLES } = require('./data/companyJobsGenerator');
const indianCompaniesCatalog = require('./data/indianCompaniesData');

const seedAllAvailableJobs = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/jobportal');
    console.log('Connected to MongoDB. Seeding all available company career jobs...');

    let recruiter = await User.findOne({ role: 'recruiter' });
    if (!recruiter) {
      recruiter = await User.create({
        name: 'Enterprise Hiring Lead',
        email: 'careers.india@nexjob.com',
        role: 'recruiter',
        password: 'password123',
        location: 'Bangalore, India'
      });
    }

    // List of priority Indian companies to ensure complete jobs for
    const priorityCompanies = [
      { name: 'Tata Consultancy Services (TCS)', short: 'TCS', key: 'tcs', careerUrl: 'https://www.tcs.com/careers/india', logo: '/logos/tcs.svg', hq: 'Mumbai, Maharashtra' },
      { name: 'Infosys', short: 'Infosys', key: 'infosys', careerUrl: 'https://www.infosys.com/careers.html', logo: '/logos/infosys.svg', hq: 'Bangalore, Karnataka' },
      { name: 'Wipro Technologies', short: 'Wipro', key: 'wipro', careerUrl: 'https://careers.wipro.com', logo: '/logos/wipro.svg', hq: 'Bangalore, Karnataka' },
      { name: 'Swiggy & Instamart', short: 'Swiggy', key: 'swiggy', careerUrl: 'https://careers.swiggy.com', logo: '/logos/swiggy.svg', hq: 'Bangalore, Karnataka' },
      { name: 'Flipkart', short: 'Flipkart', key: 'flipkart', careerUrl: 'https://www.flipkartcareers.com', logo: '/logos/flipkart.svg', hq: 'Bangalore, Karnataka' },
      { name: 'Reliance Jio Platforms', short: 'Jio', key: 'jio', careerUrl: 'https://careers.jio.com', logo: '/logos/jio.svg', hq: 'Mumbai, Maharashtra' },
      { name: 'Accenture India', short: 'Accenture', key: 'accenture', careerUrl: 'https://www.accenture.com/in-en/careers', logo: '/logos/accenture.svg', hq: 'Bangalore, Karnataka' },
      { name: 'Cognizant Technology Solutions', short: 'Cognizant', key: 'cognizant', careerUrl: 'https://careers.cognizant.com/global/en', logo: '/logos/cognizant.svg', hq: 'Chennai, Tamil Nadu' },
      { name: 'Capgemini India', short: 'Capgemini', key: 'capgemini', careerUrl: 'https://www.capgemini.com/in-en/careers/', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=Capgemini', hq: 'Mumbai, Maharashtra' },
      { name: 'Deloitte India', short: 'Deloitte', key: 'deloitte', careerUrl: 'https://jobs2.deloitte.com/in/en', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=Deloitte', hq: 'Hyderabad, Telangana' }
    ];

    let totalCreated = 0;

    for (const pComp of priorityCompanies) {
      // Find or create company
      let company = await Company.findOne({
        $or: [
          { name: new RegExp(`^${pComp.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
          { slug: pComp.short.toLowerCase() },
          { name: new RegExp(pComp.short, 'i') }
        ]
      });

      if (!company) {
        company = await Company.create({
          name: pComp.name,
          slug: pComp.short.toLowerCase(),
          industry: 'IT Services & Software Technology',
          careerPageUrl: pComp.careerUrl,
          website: pComp.careerUrl,
          logo: pComp.logo,
          headquarters: pComp.hq,
          location: 'Bangalore, India',
          size: '100,000+ employees',
          foundedYear: 1980,
          rating: 4.4,
          reviewsCount: 45000,
          description: `${pComp.name} is one of Indias premier technology and digital services enterprises.`,
          benefits: ['Health Insurance', 'Flexible Work Options', 'Learning Sponsorship', 'Performance Bonus'],
          verified: true,
          recruiters: [recruiter._id]
        });
        console.log(`Created company: ${company.name}`);
      } else {
        company.careerPageUrl = pComp.careerUrl;
        company.logo = pComp.logo || company.logo;
        company.verified = true;
        await company.save();
      }

      // Get all roles for this company
      const roles = getRolesForCompany(pComp.name);

      for (const role of roles) {
        // Check if job with same title and company exists
        const exists = await Job.findOne({
          company: company._id,
          title: role.title
        });

        if (!exists) {
          await Job.create({
            title: role.title,
            company: company._id,
            companyName: company.name,
            companyLogo: company.logo,
            recruiter: recruiter._id,
            category: role.category,
            description: role.desc,
            requirements: [
              `Relevant hands-on expertise (${role.exp}) in software engineering`,
              'Strong knowledge of algorithms, data structures and system design',
              'Collaborative mindset with passion for high quality code',
              'Experience delivering reliable systems in cloud environments'
            ],
            responsibilities: [
              'Design, develop and maintain mission-critical modules and services',
              'Collaborate with product management, QA, and cross-functional teams',
              'Champion continuous integration, automated testing and clean architecture'
            ],
            skills: role.skills,
            experienceLevel: role.expLevel,
            minExperience: role.minExp,
            maxExperience: role.maxExp,
            salaryRange: role.ctc,
            location: role.location,
            jobType: 'Full-time',
            workMode: role.mode,
            vacancies: Math.floor(Math.random() * 8) + 2,
            careerUrl: company.careerPageUrl,
            source: 'official_career_page',
            status: 'active',
            featured: true
          });
          totalCreated++;
        }
      }

      const currentCount = await Job.countDocuments({ company: company._id });
      console.log(`✓ ${company.name}: ${currentCount} available jobs`);
    }

    console.log(`\nSuccessfully populated ${totalCreated} new jobs. Total available jobs updated!`);
    process.exit(0);
  } catch (err) {
    console.error('Error seeding jobs:', err);
    process.exit(1);
  }
};

seedAllAvailableJobs();
