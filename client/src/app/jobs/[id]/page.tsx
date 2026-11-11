import type { Metadata } from 'next';
import { JobDetailsPage } from '@/views/JobDetailsPage';

export const metadata: Metadata = {
  title: 'Job Details',
};

export default function Page() {
  return <JobDetailsPage />;
}
