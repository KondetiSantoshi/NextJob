import type { Metadata } from 'next';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { MessagesPage } from '@/views/MessagesPage';

export const metadata: Metadata = {
  title: 'Messages',
};

export default function Page() {
  return (
    <ProtectedRoute>
      <MessagesPage />
    </ProtectedRoute>
  );
}
