import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../index.css';
import { AppShell } from '../components/AppShell';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'NexJob - Next-Gen Job Portal & Professional Networking',
    template: '%s | NexJob',
  },
  description:
    'Next-generation job portal and professional networking ecosystem uniting job discovery, verified career portals, recruiter hiring, and career communities.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-slate-50 text-slate-900 font-sans antialiased selection:bg-indigo-500 selection:text-white">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
