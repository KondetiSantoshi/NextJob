import type { Metadata } from 'next';
import { CandidateProfilePage } from '@/views/CandidateProfilePage';

export const metadata: Metadata = {
  title: 'Candidate Profile',
};

export default function Page() {
  return <CandidateProfilePage />;
}
