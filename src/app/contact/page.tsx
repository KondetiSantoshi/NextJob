import type { Metadata } from 'next';
import { ContactUsPage } from '@/views/ContactUsPage';

export const metadata: Metadata = {
  title: 'Contact Us',
};

export default function Page() {
  return <ContactUsPage />;
}
