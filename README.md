# NexJob - Next-Generation Job Portal & Professional Networking Platform

NexJob is a full-stack, enterprise-grade job portal and professional networking ecosystem inspired by the best features of **Naukri.com**, **LinkedIn**, and **Apna**. Built as a **unified Next.js 14 (App Router) full-stack application**, both the frontend UI and backend REST API (`/api/*`) deploy together on a single Vercel server.

---

## 🌟 Key Platform Features

### 1. Job Seeker Experience (Naukri + LinkedIn)
- **Comprehensive Job Search**: Full-text and keyword search by title, skills, company, and location.
- **Deep Multi-Faceted Filters**: Experience level, salary range, employment type (Full-time, Part-time, Contract, Internship), work mode (Remote, Hybrid, On-site), and 18 specialized technical & corporate categories.
- **Visual Application Tracker**: Real-time multi-stage pipeline (`Applied` ➔ `Viewed` ➔ `Shortlisted` ➔ `Interview Scheduled` ➔ `Selected` / `Rejected`).
- **Interview Scheduling Integration**: Direct display of interview dates, times, modes, and one-click Google Meet / Zoom meeting links.
- **Resume Management**: Upload, preview, download, and configure default primary resumes (PDF / DOCX) persisted in MongoDB for serverless compatibility.
- **Interactive Professional Profiles**: Manage education history, work experience timeline, technical skills with proficiency tags, certifications, portfolio, and social links.
- **Bookmark & Saved Jobs**: Save opportunities and manage bookmarked listings in one place.

### 2. Recruiter & Employer Hub
- **Company Registration & Verified Profiles**: Register company details, headquarters, benefits, employee size, logos, and banners.
- **Job Posting Studio**: Publish rich job openings with experience boundaries, salary CTC ranges, required skill tags, responsibilities, and deadlines.
- **Active & Closed Job Management**: Edit, toggle live status, and delete job postings with real-time applicant counts.
- **Candidate Screening & Pipeline Management**: View applicants with full profile previews, skill summaries, and downloadable resumes.
- **Stage Progression & Interview Scheduling**: Update candidate statuses and schedule video/phone interviews with automated candidate alerts.
- **Talent Analytics**: Real-time tracking of applications received, shortlisted rates, and scheduled interviews.

### 3. Professional Networking (LinkedIn Style)
- **Dynamic Post Feed**: Create posts with text, images, and hashtags.
- **Reactions & Comments**: Like posts with live counts, submit threaded replies, and share posts across networks.
- **Network Connections**: Send connection requests, accept/reject pending invitations, and discover suggested peers.
- **Direct Messaging**: Two-column real-time messaging interface with unread indicators and active chat sessions.

### 4. Career Community (Apna Style)
- **Discussion Categories**:
  - Interview Experiences
  - Career Advice & Salary Negotiation
  - Technical Discussions & System Design
  - Fresher Job Updates & Walk-in Alerts
  - Government Job Updates & Work-from-Home (WFH)
- **Q&A Ecosystem**: Ask questions, provide answers, upvote discussions, and mark verified solutions.

### 5. Platform Admin Console
- **Platform Telemetry**: Total registered users, job seekers, recruiters, companies, active jobs, and applications.
- **User Governance**: Search users, toggle account active/deactivated statuses, and manage access.
- **Employer Verification**: Approve or verify company profiles with verified blue badges.
- **Moderation Engine**: Remove spam topics and oversee platform safety.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Framework** | Next.js 14 (App Router — Frontend Pages + Serverless Route Handlers) |
| **Frontend UI** | React 18, TypeScript, Tailwind CSS, Lucide React Icons, Axios |
| **Backend API** | Next.js Route Handlers (`src/app/api/**`), MongoDB, Mongoose ODM, JWT, bcryptjs |
| **Security** | Role-based authorization (`job_seeker`, `recruiter`, `admin`), password hashing, serverless DB caching |
| **File Handling** | MongoDB binary storage (`UploadedFile` model served via `/api/uploads/[id]`) + static assets in `public/` |

---

## 🚀 Instant Demo Credentials

The platform can be pre-seeded with realistic test data. You can log in using the **1-Click Demo Buttons** on the `/login` page or with the credentials below:

| Role | Email | Password | Access / Profile |
|---|---|---|---|
| **Job Seeker** | `seeker@example.com` | `password123` | **Aarav Sharma** (Senior Full Stack Engineer) |
| **Recruiter** | `recruiter@example.com` | `password123` | **Priya Nair** (Talent Acquisition @ Razorpay) |
| **Admin** | `admin@example.com` | `password123` | **Vikram Malhotra** (Platform Governance Lead) |

---

## 📁 Unified Project Architecture

```
jobs/
├── public/
│   ├── logos/                   # Company SVG/PNG brand logos
│   └── uploads/                 # Static seeded assets
├── scripts/
│   ├── seed.js                  # Main database seeder
│   ├── seedIndianCompanies.js   # Seed Indian tech companies & jobs
│   ├── seedAllAvailableCompanyJobs.js
│   └── updateSpecificJobUrls.js
├── src/
│   ├── app/
│   │   ├── api/                 # Next.js App Router Backend API Route Handlers (/api/*)
│   │   │   ├── admin/           # Admin stats, user & company moderation
│   │   │   ├── ai/              # NexAI career copilot endpoint
│   │   │   ├── applications/    # Candidate applications & interview scheduling
│   │   │   ├── auth/            # Login, register, OTP, Google & profile auth
│   │   │   ├── companies/       # Directory, career search, reviews & follow
│   │   │   ├── community/       # Apna-style community topics & answers
│   │   │   ├── connections/     # Network invitations & suggestions
│   │   │   ├── health/          # Health check endpoint
│   │   │   ├── jobs/            # Jobs CRUD, live sync, saved & recruiter jobs
│   │   │   ├── messages/        # Direct messaging endpoints
│   │   │   ├── notifications/   # Notifications feed & read markers
│   │   │   ├── posts/           # Social feed CRUD, likes, comments & shares
│   │   │   ├── profile/         # Job seeker profile & resume management
│   │   │   ├── upload/          # Multipart upload handler -> MongoDB
│   │   │   └── uploads/         # Binary file serving route (/api/uploads/[id])
│   │   └── **/page.tsx          # Frontend Next.js App Router pages
│   ├── api/                     # Axios client (/api baseURL)
│   ├── components/              # AppShell, Navbar, Footer, JobCard, ApplyModal, ProtectedRoute
│   ├── context/                 # AuthContext, ToastContext
│   ├── data/                    # Indian companies catalog & role generators
│   ├── lib/                     # Cached MongoDB connector (db.ts), JWT auth (auth.ts), error helper
│   ├── models/                  # Mongoose schemas with hot-reload/serverless model caching
│   ├── types/                   # TypeScript interfaces
│   ├── utils/                   # Company logo & redirect helpers
│   └── views/                   # Client View Components for all platform pages
├── .env.example                 # Example environment variables
├── next.config.mjs              # Unified Next.js configuration
├── package.json                 # Single root package.json for full-stack build & deploy
├── tailwind.config.js
└── tsconfig.json
```

---

## ⚙️ Installation & Local Development

### Prerequisites
- **Node.js**: v18.x, v20.x, or v22.x
- **MongoDB**: Local MongoDB Server running on `127.0.0.1:27017` or a MongoDB Atlas URI

### 1. Install Dependencies
From the repository root:
```bash
npm install
```

### 2. Configure Environment Variables
Create `.env.local` in the repository root (see `.env.example`):
```env
MONGODB_URI=mongodb://127.0.0.1:27017/jobportal
JWT_SECRET=super_secret_jwt_key_jobportal_2026_xyz
NODE_ENV=development
```

### 3. Seed Realistic Demo Data
Populates top tech companies, jobs across 18 categories, applications, feed posts, and community Q&As:
```bash
npm run seed
```

### 4. Run Full-Stack Application
Starts the unified Next.js server (frontend + `/api/*` backend on `http://localhost:3000`):
```bash
npm run dev
```

---

## ☁️ Deploying on Vercel (Single Server)

1. Import this repository directly into Vercel with the **Root Directory** set to `.` (default).
2. Add the following Environment Variables in Vercel Project Settings:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Strong random secret for signing JWTs
3. Deploy — Vercel automatically builds Next.js pages and turns `src/app/api/**/route.ts` into serverless functions on the same domain.

---

## 📑 Complete Application Pages

1. **Home Page (`/`)**: Hero search, 18 categories, top hiring companies, latest jobs, Apna community highlights.
2. **Login Page (`/login`)**: Email/password, OTP/Google login, 1-click role logins, forgot password recovery.
3. **Registration Page (`/register`)**: Role switcher (Job Seeker / Recruiter / Admin), company registration.
4. **Job Search Page (`/jobs`)**: Keyword search, location, work mode, experience chips, sorting, pagination.
5. **Job Details Page (`/jobs/:id`)**: Full requirements, responsibilities, recruiter card, one-click ApplyModal.
6. **Job Seeker Dashboard (`/dashboard/seeker`)**: Profile strength meter, application stats, interview alerts.
7. **Recruiter Dashboard (`/dashboard/recruiter`)**: Job management table, applicants viewer, interview scheduler.
8. **Admin Dashboard (`/dashboard/admin`)**: Platform telemetry, user management, company verification.
9. **Candidate Profile Page (`/profile`)**: Education, experience timeline, technical skills, certifications, links.
10. **Company Directory (`/companies`)**: Search companies, industry filters, company cards with ratings.
11. **Company Details Page (`/companies/:id`)**: Company overview, benefits, open jobs, reviews, write review modal.
12. **Post a Job Page (`/post-job`)**: Full recruiter job creation form with interactive skill tags.
13. **My Applications Page (`/applications`)**: Multi-stage progress pipeline tracker and meeting join links.
14. **Saved Jobs Page (`/saved-jobs`)**: Manage bookmarked opportunities.
15. **Resume Management Page (`/resumes`)**: Upload multiple resumes, set primary, download/view.
16. **Professional Network Page (`/network`)**: LinkedIn-style feed, create posts with images/tags, likes, comments, share, connection requests.
17. **Community Page (`/community`)**: Apna-style discussions, ask questions, browse categories, post answers.
18. **Messages Page (`/messages`)**: Direct messaging between recruiters and candidates.
19. **Notifications Page (`/notifications`)**: Alerts for interview scheduling, application reviews, and likes.
20. **Settings Page (`/settings`)**: Personal details, notification preferences, account security.
21. **About Us Page (`/about`)**: Platform story, core pillars, and metrics.
22. **Contact Us Page (`/contact`)**: Support ticket inquiry form, headquarters location, phone support.

---

## 🔒 Security Best Practices
- **Password Protection**: Passwords salted and hashed with `bcryptjs` before persistence.
- **JWT Authentication**: Authenticated routes protected via `Authorization: Bearer <token>` helpers.
- **Role Authorization**: Granular RBAC (`job_seeker`, `recruiter`, `admin`).
- **File Upload Security**: Extension and size validation before persistence.

---

## 📄 License
MIT License. Built for modern developer, recruiter, and candidate workflows.
