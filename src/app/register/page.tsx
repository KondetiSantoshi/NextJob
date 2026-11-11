import type { Metadata } from 'next';
import { Suspense } from 'react';
import { RegisterPage } from '../../views/RegisterPage';
import { PageLoader } from '../../components/PageLoader';

export const metadata: Metadata = {
  title: 'Create Account',
};

export default function Page() {
  return (
    <Suspense fallback={<PageLoader label="Loading registration..." />}>
      <RegisterPage />
    </Suspense>
  );
}
