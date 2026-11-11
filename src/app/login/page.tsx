import type { Metadata } from 'next';
import { Suspense } from 'react';
import { LoginPage } from '../../views/LoginPage';
import { PageLoader } from '../../components/PageLoader';

export const metadata: Metadata = {
  title: 'Login',
};

export default function Page() {
  return (
    <Suspense fallback={<PageLoader label="Loading sign in..." />}>
      <LoginPage />
    </Suspense>
  );
}
