import type { Metadata } from 'next';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { SavedJobsPage } from '@/views/SavedJobsPage';

export const metadata: Metadata = {
  title: 'Saved Jobs',
};

export default function Page() {
  return (
    <ProtectedRoute allowedRoles={['job_seeker', 'admin']}>
      <SavedJobsPage />
    </ProtectedRoute>
  );
}
