import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { handleApiError } from '@/lib/apiError';
import Job from '@/models/Job';
import Company from '@/models/Company';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    void Company;

    const body = await request.json();
    const { message } = body || {};

    if (!message || !String(message).trim()) {
      return NextResponse.json(
        { success: false, message: 'Message is required' },
        { status: 400 }
      );
    }

    const userQuery = String(message).trim().toLowerCase();

    // 1. Detect if the user is looking for jobs / recommendations
    const isJobSearch =
      userQuery.includes('job') ||
      userQuery.includes('opening') ||
      userQuery.includes('hire') ||
      userQuery.includes('hiring') ||
      userQuery.includes('vacancy') ||
      userQuery.includes('role') ||
      userQuery.includes('apply') ||
      userQuery.includes('sde') ||
      userQuery.includes('developer') ||
      userQuery.includes('engineer') ||
      userQuery.includes('tcs') ||
      userQuery.includes('infosys') ||
      userQuery.includes('swiggy') ||
      userQuery.includes('google') ||
      userQuery.includes('amazon') ||
      userQuery.includes('flipkart') ||
      userQuery.includes('jio') ||
      userQuery.includes('remote') ||
      userQuery.includes('fresher') ||
      userQuery.includes('bangalore') ||
      userQuery.includes('pune') ||
      userQuery.includes('hyderabad');

    let recommendedJobs: any[] = [];

    if (isJobSearch) {
      const query: any = { status: 'active' };
      const orClauses: any[] = [];

      const companies = [
        'tcs',
        'infosys',
        'wipro',
        'hcl',
        'tech mahindra',
        'swiggy',
        'zomato',
        'flipkart',
        'phonepe',
        'razorpay',
        'cred',
        'jio',
        'google',
        'microsoft',
        'amazon',
        'meta',
        'apple',
        'uber',
        'nvidia',
        'stripe',
        'zoho',
        'paytm',
      ];

      for (const comp of companies) {
        if (userQuery.includes(comp)) {
          orClauses.push({ companyName: { $regex: comp, $options: 'i' } });
        }
      }

      const skills = [
        'react',
        'python',
        'java',
        'node',
        'frontend',
        'backend',
        'full stack',
        'devops',
        'cloud',
        'ai',
        'machine learning',
        'data',
        'cybersecurity',
      ];

      for (const skill of skills) {
        if (userQuery.includes(skill)) {
          orClauses.push({ title: { $regex: skill, $options: 'i' } });
          orClauses.push({ skills: { $in: [new RegExp(skill, 'i')] } });
        }
      }

      if (userQuery.includes('remote')) {
        query.workMode = 'Remote';
      }

      if (userQuery.includes('fresher') || userQuery.includes('entry level')) {
        query.minExperience = { $lte: 1 };
      }

      if (
        userQuery.includes('30l') ||
        userQuery.includes('40l') ||
        userQuery.includes('high pay') ||
        userQuery.includes('high salary')
      ) {
        orClauses.push({
          salaryRange: {
            $regex: /(3[0-9]|4[0-9]|5[0-9]|6[0-9]|7[0-9]|8[0-9]|9[0-9]|1\s*cr)/i,
          },
        });
      }

      if (orClauses.length > 0) {
        query.$or = orClauses;
      }

      recommendedJobs = await Job.find(query).limit(4).sort({ createdAt: -1 });

      if (recommendedJobs.length === 0) {
        recommendedJobs = await Job.find({ status: 'active' })
          .limit(3)
          .sort({ createdAt: -1 });
      }
    }

    // 2. Generate intelligent response tailored to query intent
    let responseText = '';

    if (
      userQuery.includes('interview') ||
      userQuery.includes('question') ||
      userQuery.includes('prepare')
    ) {
      responseText = `### 🎯 High-Impact Interview Preparation Strategy

Here are the critical areas recruiters and engineering leads focus on at top Indian tech firms and MNCs:

1. **Core Data Structures & Algorithms:**
   - Arrays, Two Pointers, Sliding Window, Trees, and Dynamic Programming.
   - Practice medium problems on LeetCode focusing on patterns rather than memorization.

2. **System Design (HLD & LLD):**
   - High-Level: Microservices, API Gateways, Kafka/RabbitMQ message queues, Redis caching, and Database Sharding.
   - Low-Level: SOLID principles, Factory, Strategy, and Singleton design patterns.

3. **Behavioral & Leadership Rounds:**
   - Use the **STAR Framework** (Situation, Task, Action, Result) to narrate how you handled tight deadlines, production outages, or cross-team disagreements.

💡 *Would you like me to run a mock technical quiz or provide specific company interview rounds for Google, Amazon, TCS, or Swiggy?*`;
    } else if (
      userQuery.includes('resume') ||
      userQuery.includes('cv') ||
      userQuery.includes('ats')
    ) {
      responseText = `### 📄 NexAI Resume Optimization Playbook

To pass Applicant Tracking Systems (ATS) and catch recruiter attention in 6 seconds:

1. **Quantify Your Impact with Metrics:**
   - Instead of *"Built payment APIs"*, write *"Architected distributed payment gateway handling 12,000+ RPS with 99.98% uptime, reducing latency by 35%"*.
2. **Tailor Skills to Job Postings:**
   - Highlight modern tools: \`React.js\`, \`Node.js\`, \`TypeScript\`, \`Kubernetes\`, \`AWS\`, \`PostgreSQL\`, \`Kafka\`.
3. **Keep Format Clean:**
   - Single-column standard layout, clear headers (Experience, Skills, Projects, Education), PDF format.

⚡ *Tip: You can upload your primary resume in your NexJob Profile to use 1-click **Easy Apply** on all verified jobs below!*`;
    } else if (
      userQuery.includes('salary') ||
      userQuery.includes('ctc') ||
      userQuery.includes('package')
    ) {
      responseText = `### 💰 Indian Tech Industry Compensation Benchmarks (2026)

- **Entry Level / Fresher (0-1 Yrs):**
  - IT Services (TCS, Infosys, Wipro): **₹4L – ₹9L PA**
  - Product Unicorns & Startups: **₹12L – ₹24L PA**
- **Mid Level / SDE-2 (2-5 Yrs):**
  - Unicorns (Swiggy, Flipkart, PhonePe, Razorpay): **₹25L – ₹48L PA**
  - Global GCCs (Google, Amazon, Microsoft, Uber): **₹35L – ₹65L PA**
- **Senior / Staff Engineer (5-9+ Yrs):**
  - Base + Lucrative ESOPs / RSUs: **₹50L – ₹1.1 Cr+ PA**

💼 *Always negotiate by showcasing competing offers, production impact, and domain expertise.*`;
    } else if (isJobSearch) {
      responseText = `### ⚡ Top Verified Job Matches Found For You

I scanned our active Indian tech openings and career portals. Here are the top live roles matching your query with **Easy Apply** and official career portal verification:`;
    } else {
      responseText = `Hello! I am **NexAI**, your personalized Career & Interview Copilot on NexJob.

Here is what I can help you with:
- ⚡ **Find & Easy Apply to Jobs:** Ask me for React, Python, SDE-2, Remote, or Fresher openings.
- 🏢 **Company Career Pages:** Ask about TCS, Infosys, Swiggy, Flipkart, Google India, or Reliance Jio.
- 🎯 **Interview Practice:** Get technical, system design, and HR questions for any role.
- 📄 **Resume Review:** Optimize your resume points with metrics for top recruiters.
- 💰 **Salary Insights:** Learn typical CTC benchmarks for Indian tech hubs.

*What would you like to explore today?*`;
    }

    return NextResponse.json(
      {
        success: true,
        reply: responseText,
        jobs: recommendedJobs,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
