import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AICareerBot } from './components/AICareerBot';

// All 22 Pages
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { JobSearchPage } from './pages/JobSearchPage';
import { JobDetailsPage } from './pages/JobDetailsPage';
import { SeekerDashboardPage } from './pages/SeekerDashboardPage';
import { RecruiterDashboardPage } from './pages/RecruiterDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { CandidateProfilePage } from './pages/CandidateProfilePage';
import { CompanyDirectoryPage } from './pages/CompanyDirectoryPage';
import { CompanyDetailsPage } from './pages/CompanyDetailsPage';
import { PostJobPage } from './pages/PostJobPage';
import { MyApplicationsPage } from './pages/MyApplicationsPage';
import { SavedJobsPage } from './pages/SavedJobsPage';
import { ResumeManagementPage } from './pages/ResumeManagementPage';
import { NetworkPage } from './pages/NetworkPage';
import { CommunityPage } from './pages/CommunityPage';
import { MessagesPage } from './pages/MessagesPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { SettingsPage } from './pages/SettingsPage';
import { AboutUsPage } from './pages/AboutUsPage';
import { ContactUsPage } from './pages/ContactUsPage';

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* 1. Home Page */}
                <Route path="/" element={<HomePage />} />

                {/* 2. Login Page */}
                <Route path="/login" element={<LoginPage />} />

                {/* 3. Registration Page */}
                <Route path="/register" element={<RegisterPage />} />

                {/* 4. Job Search Page */}
                <Route path="/jobs" element={<JobSearchPage />} />

                {/* 5. Job Details Page */}
                <Route path="/jobs/:id" element={<JobDetailsPage />} />

                {/* 6. Job Seeker Dashboard */}
                <Route
                  path="/dashboard/seeker"
                  element={
                    <ProtectedRoute allowedRoles={['job_seeker', 'admin']}>
                      <SeekerDashboardPage />
                    </ProtectedRoute>
                  }
                />

                {/* 7. Recruiter Dashboard */}
                <Route
                  path="/dashboard/recruiter"
                  element={
                    <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
                      <RecruiterDashboardPage />
                    </ProtectedRoute>
                  }
                />

                {/* 8. Admin Dashboard */}
                <Route
                  path="/dashboard/admin"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboardPage />
                    </ProtectedRoute>
                  }
                />

                {/* 9. Candidate Profile Page (Self & Public) */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <CandidateProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/profile/:id" element={<CandidateProfilePage />} />

                {/* 10. Company Directory */}
                <Route path="/companies" element={<CompanyDirectoryPage />} />

                {/* 11. Company Details Page */}
                <Route path="/companies/:id" element={<CompanyDetailsPage />} />

                {/* 12. Post a Job Page */}
                <Route
                  path="/post-job"
                  element={
                    <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
                      <PostJobPage />
                    </ProtectedRoute>
                  }
                />

                {/* 13. My Applications Page */}
                <Route
                  path="/applications"
                  element={
                    <ProtectedRoute allowedRoles={['job_seeker', 'admin']}>
                      <MyApplicationsPage />
                    </ProtectedRoute>
                  }
                />

                {/* 14. Saved Jobs Page */}
                <Route
                  path="/saved-jobs"
                  element={
                    <ProtectedRoute allowedRoles={['job_seeker', 'admin']}>
                      <SavedJobsPage />
                    </ProtectedRoute>
                  }
                />

                {/* 15. Resume Management Page */}
                <Route
                  path="/resumes"
                  element={
                    <ProtectedRoute allowedRoles={['job_seeker', 'admin']}>
                      <ResumeManagementPage />
                    </ProtectedRoute>
                  }
                />

                {/* 16. Professional Network Page (LinkedIn Style) */}
                <Route
                  path="/network"
                  element={
                    <ProtectedRoute>
                      <NetworkPage />
                    </ProtectedRoute>
                  }
                />

                {/* 17. CareerPulse Community Page */}
                <Route path="/community" element={<CommunityPage />} />

                {/* 18. Messages Page */}
                <Route
                  path="/messages"
                  element={
                    <ProtectedRoute>
                      <MessagesPage />
                    </ProtectedRoute>
                  }
                />

                {/* 19. Notifications Page */}
                <Route
                  path="/notifications"
                  element={
                    <ProtectedRoute>
                      <NotificationsPage />
                    </ProtectedRoute>
                  }
                />

                {/* 20. Settings Page */}
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <SettingsPage />
                    </ProtectedRoute>
                  }
                />

                {/* 21. About Us Page */}
                <Route path="/about" element={<AboutUsPage />} />

                {/* 22. Contact Us Page */}
                <Route path="/contact" element={<ContactUsPage />} />

                {/* Catch-all redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
            <AICareerBot />
          </div>
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
};
