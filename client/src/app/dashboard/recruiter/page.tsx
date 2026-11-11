import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { RecruiterDashboardPage } from '@/views/RecruiterDashboardPage';
import { PageLoader } from '@/components/PageLoader';

export const metadata: Metadata = {
  title: 'Recruiter Hub',
};

export default function Page() {
  return (
    <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
      <Suspense fallback={<PageLoader label="Loading Recruiter Hub..." />}>
        <RecruiterDashboardPage />
      </Suspense>
    </ProtectedRoute>
  );
}
