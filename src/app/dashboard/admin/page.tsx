import type { Metadata } from 'next';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AdminDashboardPage } from '@/views/AdminDashboardPage';

export const metadata: Metadata = {
  title: 'Admin Console',
};

export default function Page() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminDashboardPage />
    </ProtectedRoute>
  );
}
