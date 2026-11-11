import type { Metadata } from 'next';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { CandidateProfilePage } from '@/views/CandidateProfilePage';

export const metadata: Metadata = {
  title: 'My Profile',
};

export default function Page() {
  return (
    <ProtectedRoute>
      <CandidateProfilePage />
    </ProtectedRoute>
  );
}
