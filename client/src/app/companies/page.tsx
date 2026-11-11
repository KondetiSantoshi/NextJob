import type { Metadata } from 'next';
import { CompanyDirectoryPage } from '@/views/CompanyDirectoryPage';

export const metadata: Metadata = {
  title: 'Companies Directory',
};

export default function Page() {
  return <CompanyDirectoryPage />;
}
