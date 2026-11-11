import type { Metadata } from 'next';
import { HomePage } from '../views/HomePage';

export const metadata: Metadata = {
  title: 'NexJob - Next-Gen Job Portal & Professional Networking',
};

export default function Page() {
  return <HomePage />;
}
