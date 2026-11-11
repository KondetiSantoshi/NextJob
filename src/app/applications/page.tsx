import type { Metadata } from 'next';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { MyApplicationsPage } from '@/views/MyApplicationsPage';

export const metadata: Metadata = {
  title: 'My Applications',
};

export default function Page() {
  return (
    <ProtectedRoute allowedRoles={['job_seeker', 'admin']}>
      <MyApplicationsPage />
    </ProtectedRoute>
  );
}
