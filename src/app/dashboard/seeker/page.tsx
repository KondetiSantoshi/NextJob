import type { Metadata } from 'next';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { SeekerDashboardPage } from '@/views/SeekerDashboardPage';

export const metadata: Metadata = {
  title: 'Job Seeker Dashboard',
};

export default function Page() {
  return (
    <ProtectedRoute allowedRoles={['job_seeker', 'admin']}>
      <SeekerDashboardPage />
    </ProtectedRoute>
  );
}
