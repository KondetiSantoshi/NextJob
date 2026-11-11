import type { Metadata } from 'next';
import { CommunityPage } from '@/views/CommunityPage';

export const metadata: Metadata = {
  title: 'CareerPulse Community',
};

export default function Page() {
  return <CommunityPage />;
}
