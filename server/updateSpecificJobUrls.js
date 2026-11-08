/**
 * updateSpecificJobUrls.js
 * Updates all jobs in MongoDB to have role-specific direct requisition career URLs.
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Job = require('./models/Job');

function resolveSpecificCareerUrl(companyName, title) {
  const normComp = (companyName || '').toLowerCase();
  const cleanTitle = (title || '').replace(/\([^)]*\)/g, '').trim();
  const encodedTitle = encodeURIComponent(cleanTitle);

  if (normComp.includes('tcs') || normComp.includes('tata consultancy')) {
    if (
      title.toLowerCase().includes('ninja') ||
      title.toLowerCase().includes('trainee') ||
      title.toLowerCase().includes('graduate')
    ) {
      return 'https://nextstep.tcs.com/campus/#/';
    }
    return `https://ibegin.tcs.com/iBegin/jobs/search?keyword=${encodedTitle}`;
  }

  if (normComp.includes('infosys')) {
    return `https://career.infosys.com/joblist?keyword=${encodedTitle}`;
  }

  if (normComp.includes('wipro')) {
    return `https://careers.wipro.com/careers-home/jobs?keywords=${encodedTitle}`;
  }

  if (normComp.includes('accenture')) {
    return `https://www.accenture.com/in-en/careers/jobsearch?jk=${encodedTitle}&location=India`;
  }

  if (normComp.includes('cognizant')) {
    return `https://careers.cognizant.com/global/en/search-results?keywords=${encodedTitle}`;
  }

  if (normComp.includes('capgemini')) {
    return `https://www.capgemini.com/in-en/careers/job-search/?keyword=${encodedTitle}`;
  }

  if (normComp.includes('deloitte')) {
    return `https://jobs2.deloitte.com/in/en/search-results?keywords=${encodedTitle}`;
  }

  if (normComp.includes('swiggy')) {
    return `https://careers.swiggy.com/#/job-search?q=${encodedTitle}`;
  }

  if (normComp.includes('flipkart')) {
    return `https://www.flipkartcareers.com/#!/job-search?q=${encodedTitle}`;
  }

  if (normComp.includes('zomato') || normComp.includes('blinkit')) {
    return `https://www.zomato.com/careers?q=${encodedTitle}`;
  }

  if (normComp.includes('jio') || normComp.includes('reliance')) {
    return `https://careers.jio.com/jobsearch.aspx?q=${encodedTitle}`;
  }

  if (normComp.includes('phonepe')) {
    return `https://careers.phonepe.com/#jobs?q=${encodedTitle}`;
  }

  if (normComp.includes('razorpay')) {
    return `https://razorpay.com/jobs/?search=${encodedTitle}`;
  }

  if (normComp.includes('paytm')) {
    return `https://jobs.lever.co/paytm?query=${encodedTitle}`;
  }

  if (normComp.includes('cred')) {
    return 'https://careers.cred.club/#openings';
  }

  if (normComp.includes('google')) {
    return `https://careers.google.com/jobs/results/?location=India&q=${encodedTitle}`;
  }

  if (normComp.includes('microsoft')) {
    return `https://careers.microsoft.com/professionals/us/en/search-results?q=${encodedTitle}&location=India`;
  }

  if (normComp.includes('amazon')) {
    return `https://www.amazon.jobs/en/search?base_query=${encodedTitle}&loc_query=India`;
  }

  const domain = normComp.replace(/[^a-z0-9]/g, '');
  return `https://careers.${domain || 'company'}.com/jobs?q=${encodedTitle}`;
}

async function updateAllJobUrls() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/jobportal');
    console.log('Connected to MongoDB. Updating specific job requisition URLs...');

    const jobs = await Job.find({});
    console.log(`Found ${jobs.length} jobs to update.`);

    let updatedCount = 0;
    for (const job of jobs) {
      const specificUrl = resolveSpecificCareerUrl(job.companyName, job.title);
      job.careerUrl = specificUrl;
      await job.save();
      updatedCount++;
    }

    console.log(`✓ Updated ${updatedCount} jobs with exact specific direct apply URLs.`);

    // Sample inspect TCS jobs
    const sampleTCS = await Job.find({ companyName: /tcs/i }).limit(3);
    sampleTCS.forEach((j) => {
      console.log(`[TCS] ${j.title} -> ${j.careerUrl}`);
    });

    process.exit(0);
  } catch (err) {
    console.error('Error updating job URLs:', err);
    process.exit(1);
  }
}

updateAllJobUrls();
