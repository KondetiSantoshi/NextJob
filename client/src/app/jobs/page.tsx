import type { Metadata } from 'next';
import { Suspense } from 'react';
import { JobSearchPage } from '../../views/JobSearchPage';
import { PageLoader } from '../../components/PageLoader';

export const metadata: Metadata = {
  title: 'Find Jobs',
};

export default function Page() {
  return (
    <Suspense fallback={<PageLoader label="Loading jobs..." />}>
      <JobSearchPage />
    </Suspense>
  );
}
