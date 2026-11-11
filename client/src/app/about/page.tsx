import type { Metadata } from 'next';
import { AboutUsPage } from '@/views/AboutUsPage';

export const metadata: Metadata = {
  title: 'About Us',
};

export default function Page() {
  return <AboutUsPage />;
}
