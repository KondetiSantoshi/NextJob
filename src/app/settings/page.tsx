import type { Metadata } from 'next';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { SettingsPage } from '@/views/SettingsPage';

export const metadata: Metadata = {
  title: 'Account Settings',
};

export default function Page() {
  return (
    <ProtectedRoute>
      <SettingsPage />
    </ProtectedRoute>
  );
}
