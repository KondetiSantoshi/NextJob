import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../api/client';
import {
  Briefcase,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Smartphone,
  KeyRound,
  CheckCircle,
  RotateCw,
  Building2,
  User,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, demoLogin, sendOTP, verifyOTP, isLoading } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Mode: 'otp' | 'password'
  const [authMode, setAuthMode] = useState<'otp' | 'password'>('otp');

  // OTP Login state
  const [identifier, setIdentifier] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [demoOtpCode, setDemoOtpCode] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  // Password Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Forgot password modal
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetStep, setResetStep] = useState<'request' | 'reset'>('request');

  const redirectPath = (location.state as any)?.from?.pathname || '/';

  // Timer countdown
  useEffect(() => {
    let interval: any = null;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendOTP = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!identifier.trim()) {
      error('Please enter your mobile number or email address');
      return;
    }

    try {
      setSendingOtp(true);
      const res = await sendOTP(identifier.trim());
      if (res.success) {
        setOtpSent(true);
        setDemoOtpCode(res.otp || '123456');
        setTimer(60);
      }
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim()) {
      error('Please enter the 6-digit OTP code');
      return;
    }

    try {
      setVerifyingOtp(true);
      const ok = await verifyOTP(identifier.trim(), otpCode.trim());
      if (ok) {
        navigate(redirectPath);
      }
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      error('Please enter email and password');
      return;
    }

    const ok = await login(email, password);
    if (ok) {
      navigate(redirectPath);
    }
  };

  const handleDemoLogin = async (role: 'job_seeker' | 'recruiter' | 'admin') => {
    const ok = await demoLogin(role);
    if (ok) {
      if (role === 'admin') navigate('/dashboard/admin');
      else if (role === 'recruiter') navigate('/dashboard/recruiter');
      else navigate('/dashboard/seeker');
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/forgot-password', { email: forgotEmail });
      if (res.data.success) {
        success('Password reset token generated!');
        setResetToken(res.data.resetToken);
        setResetStep('reset');
      }
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to request reset token');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post(`/auth/reset-password/${resetToken}`, { password: newPassword });
      if (res.data.success) {
        success('Password has been successfully reset! Please log in.');
        setForgotModalOpen(false);
        setResetStep('request');
        setPassword(newPassword);
        setEmail(forgotEmail);
        setAuthMode('password');
      }
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to reset password');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Glow Blobs */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-200">
              <Briefcase className="w-6 h-6" />
            </div>
            <div className="text-left">
              <span className="text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
                Nex<span className="text-indigo-400">Job</span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                  PRO
                </span>
              </span>
            </div>
          </Link>
          <h2 className="mt-4 text-3xl font-extrabold text-white tracking-tight">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            Sign in to access your dream jobs, applications & professional network
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20">
          {/* Auth Method Switcher Tabs */}
          <div className="grid grid-cols-2 gap-1.5 p-1.5 bg-slate-100 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => {
                setAuthMode('otp');
                setOtpSent(false);
              }}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                authMode === 'otp'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>OTP Sign-In</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-700 font-bold">
                Fast
              </span>
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('password')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                authMode === 'password'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>Password</span>
            </button>
          </div>

          {/* MODE 1: OTP AUTHENTICATION */}
          {authMode === 'otp' && (
            <div>
              {!otpSent ? (
                /* Step 1: Input Identifier */
                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Mobile Number or Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        required
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="e.g. 9876543210 or your.email@example.com"
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 text-slate-900 text-sm font-medium transition"
                      />
                    </div>
                    <p className="mt-1.5 text-xs text-slate-500">
                      We'll send a 6-digit verification code to this mobile or email.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={sendingOtp}
                    className="w-full py-3.5 px-4 rounded-xl text-white font-bold text-sm bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition disabled:opacity-50"
                  >
                    {sendingOtp ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Sending Verification Code...</span>
                      </>
                    ) : (
                      <>
                        <span>Send 6-Digit OTP</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* Step 2: Enter & Verify OTP */
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  <div className="p-3.5 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs text-indigo-800 font-semibold">
                        Code sent to: <span className="font-bold">{identifier}</span>
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setOtpSent(false);
                          setOtpCode('');
                        }}
                        className="text-xs text-indigo-600 hover:underline font-bold mt-1 inline-block"
                      >
                        Change number / email
                      </button>
                    </div>
                    <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                      <CheckCircle className="w-4 h-4" />
                    </span>
                  </div>

                  {/* Demo Helper Box */}
                  {demoOtpCode && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800">
                      <div>
                        <span className="font-bold">⚡ Demo Test OTP:</span>{' '}
                        <span className="font-mono text-sm font-extrabold tracking-widest text-emerald-950 bg-white px-2 py-0.5 rounded border border-emerald-300">
                          {demoOtpCode}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setOtpCode(demoOtpCode)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition"
                      >
                        Auto-fill
                      </button>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Enter 6-Digit Verification Code
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        maxLength={6}
                        required
                        autoFocus
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                        placeholder="••••••"
                        className="w-full text-center text-2xl tracking-[0.5em] font-mono py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 text-slate-900 font-bold"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>
                      {timer > 0 ? (
                        <span className="font-medium text-slate-600">
                          Resend in <span className="font-bold text-indigo-600">{timer}s</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSendOTP()}
                          className="font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                        >
                          <RotateCw className="w-3.5 h-3.5" /> Resend OTP
                        </button>
                      )}
                    </span>
                    <span className="text-[11px] text-slate-400">Master code: 123456</span>
                  </div>

                  <button
                    type="submit"
                    disabled={verifyingOtp || otpCode.length < 6}
                    className="w-full py-3.5 px-4 rounded-xl text-white font-bold text-sm bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-700 hover:to-indigo-700 shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition disabled:opacity-50"
                  >
                    {verifyingOtp ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Verifying Code...</span>
                      </>
                    ) : (
                      <>
                        <span>Verify & Sign In</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* MODE 2: PASSWORD AUTHENTICATION */}
          {authMode === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 text-slate-900 text-sm font-medium transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(true)}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 text-slate-900 text-sm font-medium transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-xl text-white font-bold text-sm bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Quick Demo Accounts */}
          <div className="mt-6 pt-6 border-t border-slate-200/80">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center mb-3">
              ⚡ Instant 1-Click Demo Login
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('job_seeker')}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-indigo-500 bg-slate-50 hover:bg-indigo-50/50 text-slate-700 hover:text-indigo-600 transition flex flex-col items-center gap-1 group text-center"
              >
                <User className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-bold">Job Seeker</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('recruiter')}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-purple-500 bg-slate-50 hover:bg-purple-50/50 text-slate-700 hover:text-purple-600 transition flex flex-col items-center gap-1 group text-center"
              >
                <Building2 className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-bold">Recruiter</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/50 text-slate-700 hover:text-emerald-600 transition flex flex-col items-center gap-1 group text-center"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-bold">Admin</span>
              </button>
            </div>
          </div>

          {/* Footer link */}
          <div className="mt-6 text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-700 underline">
              Create an account
            </Link>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-6 flex items-center justify-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> 256-bit SSL Encrypted
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-400" /> Real Career Portals
          </span>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 relative">
            <h3 className="text-xl font-black text-slate-900 mb-2">Reset Your Password</h3>
            <p className="text-xs text-slate-500 mb-6">
              {resetStep === 'request'
                ? 'Enter your registered email address to receive a reset token.'
                : 'Enter your new password to complete the reset.'}
            </p>

            {resetStep === 'request' ? (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                    placeholder="you@example.com"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 text-sm font-semibold hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold"
                  >
                    Get Reset Token
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                    placeholder="••••••••"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 text-sm font-semibold hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
