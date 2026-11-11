'use client';

import React from 'react';
import { ToastProvider } from '../context/ToastContext';
import { AuthProvider } from '../context/AuthContext';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { AICareerBot } from './AICareerBot';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ToastProvider>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <AICareerBot />
        </div>
      </AuthProvider>
    </ToastProvider>
  );
};
