import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { UserRole } from '../types';
import {
  Briefcase,
  User,
  Mail,
  Phone,
  Lock,
  MapPin,
  Building2,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Sparkles,
  Smartphone,
  KeyRound,
  RotateCw,
} from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialRole = (searchParams.get('role') as UserRole) || 'job_seeker';

  const { register, sendOTP, verifyOTP, isLoading } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  // Mode: 'otp' | 'standard'
  const [registerMode, setRegisterMode] = useState<'otp' | 'standard'>('otp');

  // Shared Fields
  const [role, setRole] = useState<UserRole>(initialRole);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [companyName, setCompanyName] = useState('');

  // OTP Flow state
  const [identifier, setIdentifier] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [demoOtpCode, setDemoOtpCode] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  // Standard Flow state
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');

  // Countdown timer
  useEffect(() => {
    let interval: any = null;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Navigate to appropriate dashboard based on role
  const navigateByRole = (assignedRole: UserRole) => {
    if (assignedRole === 'admin') navigate('/dashboard/admin');
    else if (assignedRole === 'recruiter') navigate('/dashboard/recruiter');
    else navigate('/dashboard/seeker');
  };

  // OTP Step 1: Send OTP
  const handleSendOTP = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!name.trim()) {
      error('Please enter your full name');
      return;
    }
    if (!identifier.trim()) {
      error('Please enter your mobile number or email');
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

  // OTP Step 2: Verify & Finish Registration
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim()) {
      error('Please enter the 6-digit verification code');
      return;
    }

    try {
      setVerifyingOtp(true);
      const ok = await verifyOTP(identifier.trim(), otpCode.trim(), role, name.trim());
      if (ok) {
        navigateByRole(role);
      }
    } finally {
      setVerifyingOtp(false);
    }
  };

  // Standard Registration submit
  const handleStandardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password) {
      error('Please complete all mandatory fields');
      return;
    }

    if (password.length < 6) {
      error('Password must be at least 6 characters long');
      return;
    }

    const payload: any = {
      name,
      email,
      mobile,
      password,
      role,
      location,
    };

    if (role === 'recruiter') {
      payload.companyName = companyName || `${name.split(' ')[0]}'s Company`;
    }

    const ok = await register(payload);
    if (ok) {
      navigateByRole(role);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-10 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-lg w-full relative z-10">
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
            Create Your Account
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            Join thousands of professionals & verified recruiters on NexJob
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20">
          {/* Role Selector Tabs */}
          <div className="mb-6">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Select Your Role
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setRole('job_seeker')}
                className={`py-3 px-2 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  role === 'job_seeker'
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-bold scale-[1.02]'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold'
                }`}
              >
                <User className="w-5 h-5" />
                <span className="text-xs">Job Seeker</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('recruiter')}
                className={`py-3 px-2 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  role === 'recruiter'
                    ? 'bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-600/30 font-bold scale-[1.02]'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold'
                }`}
              >
                <Building2 className="w-5 h-5" />
                <span className="text-xs">Recruiter</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`py-3 px-2 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  role === 'admin'
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-600/30 font-bold scale-[1.02]'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold'
                }`}
              >
                <ShieldCheck className="w-5 h-5" />
                <span className="text-xs">Admin</span>
              </button>
            </div>
          </div>

          {/* Registration Mode Switcher */}
          <div className="grid grid-cols-2 gap-1.5 p-1.5 bg-slate-100 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => {
                setRegisterMode('otp');
                setOtpSent(false);
              }}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                registerMode === 'otp'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Instant OTP Register</span>
            </button>
            <button
              type="button"
              onClick={() => setRegisterMode('standard')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                registerMode === 'standard'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>With Password</span>
            </button>
          </div>

          {/* MODE 1: OTP REGISTRATION */}
          {registerMode === 'otp' && (
            <div>
              {!otpSent ? (
                /* Step 1: Input Details & Request OTP */
                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Full Name *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <User className="w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 text-slate-900 text-sm font-medium transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Mobile Number or Email *
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
                  </div>

                  {role === 'recruiter' && (
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Company Name *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <input
                          type="text"
                          required
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="e.g. Stripe, Razorpay, TechCorp"
                          className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900 text-sm font-medium transition"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Current City / Location
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Bangalore, India (or Remote)"
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900 text-sm font-medium transition"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={sendingOtp}
                    className="w-full py-3.5 px-4 rounded-xl text-white font-bold text-sm bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition disabled:opacity-50 mt-2"
                  >
                    {sendingOtp ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Sending OTP...</span>
                      </>
                    ) : (
                      <>
                        <span>Send 6-Digit Verification Code</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* Step 2: Verify OTP & Launch Account */
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  <div className="p-3.5 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs text-indigo-900 font-bold">
                        Registering: <span className="text-indigo-600">{name}</span>
                      </p>
                      <p className="text-xs text-indigo-700 mt-0.5">
                        Code sent to: <span className="font-semibold">{identifier}</span>
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setOtpSent(false);
                          setOtpCode('');
                        }}
                        className="text-xs text-indigo-600 hover:underline font-bold mt-1 inline-block"
                      >
                        Change details
                      </button>
                    </div>
                    <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                      <CheckCircle className="w-4 h-4" />
                    </span>
                  </div>

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
                      Enter 6-Digit OTP Code
                    </label>
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
                        <span>Verifying & Setting Up Account...</span>
                      </>
                    ) : (
                      <>
                        <span>Complete Registration</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* MODE 2: STANDARD REGISTRATION */}
          {registerMode === 'standard' && (
            <form onSubmit={handleStandardSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900 text-sm font-medium transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Email Address *
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
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900 text-sm font-medium transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Mobile Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-5 h-5" />
                  </div>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900 text-sm font-medium transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Password (min 6 chars) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900 text-sm font-medium transition"
                  />
                </div>
              </div>

              {role === 'recruiter' && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Company Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Stripe, Razorpay, TechCorp"
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900 text-sm font-medium transition"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Current City / Location
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Bangalore, India"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900 text-sm font-medium transition"
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
                    <span>Creating your account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Free Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Footer link */}
          <div className="mt-6 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-700 underline">
              Sign in here
            </Link>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-6 flex items-center justify-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Free Forever for Seekers
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-400" /> Direct HR Connect
          </span>
        </div>
      </div>
    </div>
  );
};
