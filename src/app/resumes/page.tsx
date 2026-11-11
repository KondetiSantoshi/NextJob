import type { Metadata } from 'next';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ResumeManagementPage } from '@/views/ResumeManagementPage';

export const metadata: Metadata = {
  title: 'Manage Resumes',
};

export default function Page() {
  return (
    <ProtectedRoute allowedRoles={['job_seeker', 'admin']}>
      <ResumeManagementPage />
    </ProtectedRoute>
  );
}
