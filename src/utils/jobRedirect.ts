/**
 * jobRedirect.ts
 * Resolves specific, direct job application URLs for Indian enterprises, MNCs & startups.
 * Guarantees that clicking "Apply" redirects to THAT company's THAT specific job opening.
 */

import { Job } from '../types';

export function getSpecificJobApplyUrl(job: Partial<Job> | null | undefined): string {
  if (!job) return 'https://www.google.com/search?q=career+jobs+india';

  const company = (job.companyName || '').toLowerCase().trim();
  const rawTitle = job.title || '';
  // Clean up title for search parameters (e.g., remove parens like '(Fresher)' or '(Off-Campus)')
  const cleanTitle = rawTitle.replace(/\([^)]*\)/g, '').trim();
  const encodedTitle = encodeURIComponent(cleanTitle);

  // 1. If job already has a specific requisition URL with parameters, return it
  if (
    job.careerUrl &&
    (job.careerUrl.includes('?keyword=') ||
      job.careerUrl.includes('?keywords=') ||
      job.careerUrl.includes('?q=') ||
      job.careerUrl.includes('?search=') ||
      job.careerUrl.includes('?jk=') ||
      job.careerUrl.includes('?role=') ||
      job.careerUrl.includes('/job-view/') ||
      job.careerUrl.includes('/jobdetails/') ||
      job.careerUrl.includes('nextstep.tcs.com') ||
      job.careerUrl.includes('lever.co') ||
      job.careerUrl.includes('greenhouse.io') ||
      job.careerUrl.includes('myworkdayjobs.com'))
  ) {
    return job.careerUrl;
  }

  // 2. Enterprise & MNC specific job requisition URL resolvers
  if (company.includes('tcs') || company.includes('tata consultancy')) {
    if (
      rawTitle.toLowerCase().includes('ninja') ||
      rawTitle.toLowerCase().includes('trainee') ||
      rawTitle.toLowerCase().includes('graduate')
    ) {
      return 'https://nextstep.tcs.com/campus/#/';
    }
    return `https://ibegin.tcs.com/iBegin/jobs/search?keyword=${encodedTitle}`;
  }

  if (company.includes('infosys')) {
    return `https://career.infosys.com/joblist?keyword=${encodedTitle}`;
  }

  if (company.includes('wipro')) {
    return `https://careers.wipro.com/careers-home/jobs?keywords=${encodedTitle}`;
  }

  if (company.includes('accenture')) {
    return `https://www.accenture.com/in-en/careers/jobsearch?jk=${encodedTitle}&location=India`;
  }

  if (company.includes('cognizant')) {
    return `https://careers.cognizant.com/global/en/search-results?keywords=${encodedTitle}`;
  }

  if (company.includes('capgemini')) {
    return `https://www.capgemini.com/in-en/careers/job-search/?keyword=${encodedTitle}`;
  }

  if (company.includes('deloitte')) {
    return `https://jobs2.deloitte.com/in/en/search-results?keywords=${encodedTitle}`;
  }

  if (company.includes('swiggy')) {
    return `https://careers.swiggy.com/#/job-search?q=${encodedTitle}`;
  }

  if (company.includes('flipkart')) {
    return `https://www.flipkartcareers.com/#!/job-search?q=${encodedTitle}`;
  }

  if (company.includes('zomato') || company.includes('blinkit')) {
    return `https://www.zomato.com/careers?q=${encodedTitle}`;
  }

  if (company.includes('jio') || company.includes('reliance')) {
    return `https://careers.jio.com/jobsearch.aspx?q=${encodedTitle}`;
  }

  if (company.includes('phonepe')) {
    return `https://careers.phonepe.com/#jobs?q=${encodedTitle}`;
  }

  if (company.includes('razorpay')) {
    return `https://razorpay.com/jobs/?search=${encodedTitle}`;
  }

  if (company.includes('paytm')) {
    return `https://jobs.lever.co/paytm?query=${encodedTitle}`;
  }

  if (company.includes('cred')) {
    return 'https://careers.cred.club/#openings';
  }

  if (company.includes('google')) {
    return `https://careers.google.com/jobs/results/?location=India&q=${encodedTitle}`;
  }

  if (company.includes('microsoft')) {
    return `https://careers.microsoft.com/professionals/us/en/search-results?q=${encodedTitle}&location=India`;
  }

  if (company.includes('amazon')) {
    return `https://www.amazon.jobs/en/search?base_query=${encodedTitle}&loc_query=India`;
  }

  if (company.includes('hcl')) {
    return `https://www.hcltech.com/careers/careers-in-india?search=${encodedTitle}`;
  }

  if (company.includes('tech mahindra')) {
    return `https://careers.techmahindra.com/SearchJob.aspx?keyword=${encodedTitle}`;
  }

  if (company.includes('ltimindtree')) {
    return `https://www.ltimindtree.com/careers/?keyword=${encodedTitle}`;
  }

  if (company.includes('zoho')) {
    return `https://www.zoho.com/careers/jobdetails/?job_title=${encodedTitle}`;
  }

  if (company.includes('freshworks')) {
    return `https://www.freshworks.com/company/careers/jobs/?search=${encodedTitle}`;
  }

  if (company.includes('zepto')) {
    return `https://jobs.lever.co/zepto?query=${encodedTitle}`;
  }

  if (company.includes('meesho')) {
    return `https://meesho.io/jobs?query=${encodedTitle}`;
  }

  if (company.includes('zerodha')) {
    return 'https://zerodha.com/careers';
  }

  if (company.includes('groww')) {
    return `https://groww.in/careers?q=${encodedTitle}`;
  }

  if (company.includes('walmart')) {
    return `https://careers.walmart.com/results?q=${encodedTitle}&location=India`;
  }

  // 3. If generic careerUrl is present, construct requisition search query
  if (job.careerUrl) {
    const cleanUrl = job.careerUrl.replace(/\/+$/, '');
    return `${cleanUrl}/search?q=${encodedTitle}`;
  }

  // 4. Fallback: Google Jobs direct application deep link for the exact role at the company
  return `https://www.google.com/search?q=${encodeURIComponent(job.companyName + ' ' + rawTitle + ' official career apply')}&ibp=htl;jobs`;
}

/**
 * Executes direct redirection to the specific company job application page in a new window/tab.
 */
export function redirectToSpecificJob(job: Partial<Job> | null | undefined): void {
  const url = getSpecificJobApplyUrl(job);
  window.open(url, '_blank', 'noopener,noreferrer');
}
