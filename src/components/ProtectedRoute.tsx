'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      const target = pathname ? `/login?redirect=${encodeURIComponent(pathname)}` : '/login';
      router.replace(target);
      return;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      if (user.role === 'admin') router.replace('/dashboard/admin');
      else if (user.role === 'recruiter') router.replace('/dashboard/recruiter');
      else router.replace('/dashboard/seeker');
    }
  }, [user, isLoading, allowedRoles, router, pathname]);

  if (isLoading || !user || (allowedRoles && !allowedRoles.includes(user.role))) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-slate-500">Checking credentials...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
