import type { Metadata } from 'next';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { NotificationsPage } from '@/views/NotificationsPage';

export const metadata: Metadata = {
  title: 'Notifications',
};

export default function Page() {
  return (
    <ProtectedRoute>
      <NotificationsPage />
    </ProtectedRoute>
  );
}
