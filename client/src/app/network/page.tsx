import type { Metadata } from 'next';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { NetworkPage } from '@/views/NetworkPage';

export const metadata: Metadata = {
  title: 'Professional Network',
};

export default function Page() {
  return (
    <ProtectedRoute>
      <NetworkPage />
    </ProtectedRoute>
  );
}
