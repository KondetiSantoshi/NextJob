'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../api/client';
import { User, JobSeekerProfile, UserRole } from '../types';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: User | null;
  profile: JobSeekerProfile | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  demoLogin: (role: UserRole) => Promise<boolean>;
  register: (data: any) => Promise<boolean>;
  sendOTP: (identifier: string) => Promise<{ success: boolean; message?: string; otp?: string; isExistingUser?: boolean }>;
  verifyOTP: (identifier: string, otp: string, role?: UserRole, name?: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<JobSeekerProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { success, error: toastError } = useToast();

  useEffect(() => {
    const savedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (savedToken) {
      setToken(savedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchCurrentUser = async (activeToken?: string | null) => {
    const currentToken = activeToken !== undefined ? activeToken : token;
    try {
      if (!currentToken) {
        setIsLoading(false);
        return;
      }
      const res = await api.get('/auth/me');
      if (res.data.success) {
        setUser(res.data.user);
        setProfile(res.data.profile || null);
      }
    } catch (err) {
      console.error('Failed to load user session', err);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCurrentUser(token);
    }
  }, [token]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        success(`Welcome back, ${res.data.user.name}!`);
        return true;
      }
      return false;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      toastError(msg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const demoLogin = async (role: UserRole): Promise<boolean> => {
    const creds: Record<UserRole, { email: string; pass: string }> = {
      job_seeker: { email: 'seeker@example.com', pass: 'password123' },
      recruiter: { email: 'recruiter@example.com', pass: 'password123' },
      admin: { email: 'admin@example.com', pass: 'password123' },
    };

    const target = creds[role];
    return await login(target.email, target.pass);
  };

  const register = async (data: any): Promise<boolean> => {
    try {
      setIsLoading(true);
      const res = await api.post('/auth/register', data);
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        success('Account created successfully! Welcome to NexJob.');
        return true;
      }
      return false;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Registration failed.';
      toastError(msg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const sendOTP = async (
    identifier: string
  ): Promise<{ success: boolean; message?: string; otp?: string; isExistingUser?: boolean }> => {
    try {
      setIsLoading(true);
      const res = await api.post('/auth/send-otp', { identifier });
      if (res.data.success) {
        success(res.data.message || 'OTP sent successfully!');
        return {
          success: true,
          message: res.data.message,
          otp: res.data.otp,
          isExistingUser: res.data.isExistingUser,
        };
      }
      return { success: false, message: 'Failed to send OTP' };
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to send OTP code.';
      toastError(msg);
      return { success: false, message: msg };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (
    identifier: string,
    otp: string,
    role: UserRole = 'job_seeker',
    name?: string
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      const res = await api.post('/auth/verify-otp', { identifier, otp, role, name });
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        success(`Authentication successful! Welcome, ${res.data.user.name}.`);
        return true;
      }
      return false;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Invalid or expired OTP code.';
      toastError(msg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setProfile(null);
    success('Logged out successfully.');
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...data });
    }
  };

  const refreshUser = async () => {
    await fetchCurrentUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        isLoading,
        login,
        demoLogin,
        register,
        sendOTP,
        verifyOTP,
        logout,
        updateUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
