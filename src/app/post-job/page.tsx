import type { Metadata } from 'next';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PostJobPage } from '@/views/PostJobPage';

export const metadata: Metadata = {
  title: 'Post a Job',
};

export default function Page() {
  return (
    <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
      <PostJobPage />
    </ProtectedRoute>
  );
}
