import type { Metadata } from 'next';
import { CompanyDetailsPage } from '@/views/CompanyDetailsPage';

export const metadata: Metadata = {
  title: 'Company Details',
};

export default function Page() {
  return <CompanyDetailsPage />;
}
