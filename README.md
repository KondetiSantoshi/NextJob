# NexJob - Next-Generation Job Portal & Professional Networking Platform

NexJob is a full-stack, enterprise-grade job portal and professional networking ecosystem inspired by the best features of **Naukri.com**, **LinkedIn**, and **Apna**. It seamlessly combines high-precision job discovery, employer talent acquisition, LinkedIn-style professional networking feeds, and Apna-style grassroots career discussion communities into a unified, high-performance platform.

---

## 🌟 Key Platform Features

### 1. Job Seeker Experience (Naukri + LinkedIn)
- **Comprehensive Job Search**: Full-text and keyword search by title, skills, company, and location.
- **Deep Multi-Faceted Filters**: Experience level, salary range, employment type (Full-time, Part-time, Contract, Internship), work mode (Remote, Hybrid, On-site), and 18 specialized technical & corporate categories.
- **Visual Application Tracker**: Real-time multi-stage pipeline (`Applied` ➔ `Viewed` ➔ `Shortlisted` ➔ `Interview Scheduled` ➔ `Selected` / `Rejected`).
- **Interview Scheduling Integration**: Direct display of interview dates, times, modes, and one-click Google Meet / Zoom meeting links.
- **Resume Management**: Upload, preview, download, and configure default primary resumes (PDF / DOCX).
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
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide React Icons, Axios |
| **Backend** | Node.js, Express.js, MongoDB, Mongoose ODM, JWT Authentication, bcryptjs |
| **Security** | Role-based authorization (`job_seeker`, `recruiter`, `admin`), password hashing, CORS, rate limiting |
| **File Handling** | Multer disk storage for resumes and profile images with static public serving |

---

## 🚀 Instant Demo Credentials

The platform is pre-seeded with realistic test data. You can log in using the **1-Click Demo Buttons** on the `/login` page or with the credentials below:

| Role | Email | Password | Access / Profile |
|---|---|---|---|
| **Job Seeker** | `seeker@example.com` | `password123` | **Aarav Sharma** (Senior Full Stack Engineer) |
| **Recruiter** | `recruiter@example.com` | `password123` | **Priya Nair** (Talent Acquisition @ Razorpay) |
| **Admin** | `admin@example.com` | `password123` | **Vikram Malhotra** (Platform Governance Lead) |

---

## 📁 Project Architecture

```
jobs/
├── client/                      # Next.js 14 (App Router) + React + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── app/                 # Next.js App Router layouts, metadata & route pages
│   │   ├── api/                 # Axios client with JWT interceptor
│   │   ├── components/          # AppShell, Navbar, Footer, JobCard, ApplyModal, ProtectedRoute
│   │   ├── context/             # AuthContext, ToastContext
│   │   ├── views/               # Client View Components for all 22 Platform Pages
│   │   ├── types/               # TypeScript interfaces
│   │   ├── utils/               # Company logo & redirect helpers
│   │   └── index.css            # Tailwind directives
│   ├── next.config.mjs          # Configured with /api & /uploads rewrites to port 5000
│   ├── package.json
│   ├── tailwind.config.js
│   └── tsconfig.json
│
├── server/                      # Node.js + Express + MongoDB
│   ├── config/                  # Database connection (db.js)
│   ├── controllers/             # Auth, Jobs, Applications, Profile, Companies, Posts, Community, Admin
│   ├── middleware/              # JWT protect, Role authorize, Multer upload, Error handler
│   ├── models/                  # 14 Mongoose Schemas (User, Job, Application, Company, Post, etc.)
│   ├── routes/                  # Express REST routes
│   ├── uploads/                 # Static uploads directory for resumes and media
│   ├── seed.js                  # Realistic database seeder
│   ├── server.js                # Express app entry point
│   ├── .env                     # Local environment variables
│   └── .env.example             # Example environment file
│
├── package.json                 # Root script orchestrator
└── README.md
```

---

## ⚙️ Installation & Setup Instructions

### Prerequisites
- **Node.js**: v18.x or v20.x or v22.x
- **MongoDB**: Local MongoDB Server running on `127.0.0.1:27017` or a MongoDB Atlas URI

### 1. Clone & Install Dependencies
From the repository root:
```bash
# Install dependencies across root, server, and client
npm run install:all
```

### 2. Configure Environment Variables
Inside `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/jobportal
JWT_SECRET=super_secret_jwt_key_jobportal_2026_xyz
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

### 3. Seed Realistic Demo Data
Populates top tech companies (Razorpay, Google Cloud, Swiggy, Microsoft), 16+ rich jobs across all 18 categories, applications, feed posts, and community Q&As:
```bash
npm run seed
```

### 4. Run Full-Stack Application
Start both the Express backend (`http://localhost:5000`) and the Next.js client (`http://localhost:3000`) concurrently:
```bash
npm run dev
```

Or run separately:
```bash
# Terminal 1: Start Backend API
npm run server

# Terminal 2: Start Frontend App
npm run client
```

Navigate to **`http://localhost:3000`** in your browser.

---

## 📑 Complete 22 Application Pages

1. **Home Page (`/`)**: Hero search, 18 categories, top hiring companies, latest jobs, Apna community highlights.
2. **Login Page (`/login`)**: Email/password, 1-click role logins, forgot password recovery.
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
- **JWT Authentication**: Authenticated routes protected via `Authorization: Bearer <token>` middleware.
- **Role Authorization**: Granular RBAC (`requireRole('job_seeker')`, `requireRole('recruiter')`, `requireRole('admin')`).
- **File Upload Security**: Extension validation preventing executable uploads; files isolated in static uploads folder.
- **CORS & Sanitize**: Centralized error handling and CORS support for local and deployed environments.

---

## 📄 License
MIT License. Built for modern developer, recruiter, and candidate workflows.
