import React, { useState, useEffect } from 'react';
import {
  Lock,
  Mail,
  User as UserIcon,
  Phone,
  Globe,
  Shield,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Sparkles,
  KeyRound,
  Check
} from 'lucide-react';
import { PrayerCloudLogo } from '../components/common/PrayerCloudLogo';
import { EmailOtpVerificationModal } from '../components/common/EmailOtpVerificationModal';
import { useAuth } from '../context/AuthContext';
import { useBranding } from '../context/ThemeAndBrandingContext';
import { UserRole } from '../types';

interface AuthPagesProps {
  mode: 'login' | 'register';
  onNavigate: (page: string) => void;
}

export const AuthPages: React.FC<AuthPagesProps> = ({ mode, onNavigate }) => {
  const {
    login,
    register,
    requestPasswordReset,
    resetPasswordWithToken,
    isOtpModalOpen,
    setIsOtpModalOpen,
    pendingVerificationEmail
  } = useAuth();
  const { branding } = useBranding();

  // Login form state
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Register form state
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [country, setCountry] = useState('United States');
  const [role, setRole] = useState<UserRole>('Prayer Warrior');
  const [registerPassword, setRegisterPassword] = useState('');

  // UI state
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Password Reset Modal state
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [resetStep, setResetStep] = useState<'REQUEST' | 'SUBMIT'>('REQUEST');
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetTokenOrCode, setResetTokenOrCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetMsg, setResetMsg] = useState<string | null>(null);
  const [resetError, setResetError] = useState<string | null>(null);

  // Detect URL query reset parameters (e.g. ?reset_token=...&email=...)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('reset_token');
      const paramEmail = params.get('email');

      if (token) {
        setResetTokenOrCode(token);
        if (paramEmail) {
          setForgotEmail(paramEmail);
        }
        setResetStep('SUBMIT');
        setForgotModalOpen(true);
      } else if (window.location.hash === '#reset-password') {
        setForgotModalOpen(true);
      }
    } catch {}
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const res = await login(identifier, password, rememberMe);
    setIsLoading(false);

    if (res.success) {
      // If user is Admin or Super Admin, route straight to the Admin Control Panel
      if (
        res.user &&
        (res.user.role === 'Super Admin' ||
          res.user.role === 'Admin' ||
          res.user.email?.toLowerCase() === 'admin@prayercloud.org' ||
          res.user.email?.toLowerCase() === 'dtemitope60@gmail.com' ||
          identifier.toLowerCase() === 'admin' ||
          identifier.toLowerCase() === 'superadmin' ||
          identifier.toLowerCase() === 'administrator' ||
          identifier.toLowerCase() === 'dtemitope60@gmail.com')
      ) {
        onNavigate('admin');
      } else {
        onNavigate('home');
      }
    } else {
      setError(res.error || 'Invalid credentials.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (registerPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    const res = await register({
      fullName,
      username,
      email,
      phoneNumber,
      country,
      role,
      password: registerPassword
    });
    setIsLoading(false);

    if (res.success) {
      if (res.requiresVerification) {
        // OTP modal is triggered by context, do not navigate yet
      } else {
        onNavigate('home');
      }
    } else {
      setError(res.error || 'Registration failed.');
    }
  };

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError(null);
    setResetMsg(null);
    setIsLoading(true);

    const res = await requestPasswordReset(forgotEmail);
    setIsLoading(false);

    if (res.success) {
      setResetMsg(res.message || 'If an account matches, instructions have been sent.');
      // Proceed to step 2 after brief notification
      setTimeout(() => {
        setResetStep('SUBMIT');
      }, 1500);
    } else {
      setResetError(res.error || 'Failed to dispatch reset email.');
    }
  };

  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError(null);
    setResetMsg(null);

    if (newPassword.length < 6) {
      setResetError('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setResetError('Passwords do not match. Please verify.');
      return;
    }

    setIsLoading(true);
    const res = await resetPasswordWithToken(forgotEmail || undefined, resetTokenOrCode, newPassword);
    setIsLoading(false);

    if (res.success) {
      setResetMsg('Password successfully updated! You can now log in.');
      setTimeout(() => {
        setForgotModalOpen(false);
        setResetStep('REQUEST');
        setResetTokenOrCode('');
        setNewPassword('');
        setConfirmPassword('');
        onNavigate('login');
      }, 1800);
    } else {
      setResetError(res.error || 'Password reset failed.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        
        {/* Brand Header with 3D Logo */}
        <div className="text-center space-y-2 flex flex-col items-center">
          <div className="p-2 bg-slate-900/60 rounded-2xl border border-blue-500/20 backdrop-blur-md shadow-lg">
            <PrayerCloudLogo size="md" />
          </div>
          <div>
            <div className="flex items-center justify-center gap-2 text-2xl sm:text-3xl font-black font-display tracking-tight">
              <span className="text-white drop-shadow-md">PRAYER</span>
              <span className="text-amber-400 drop-shadow-md">CLOUD</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-xs mx-auto">
              {mode === 'login'
                ? 'Access real-time missional strategy, prayer shields, and video conferences.'
                : 'Join the global network of missionaries, pastors, and prayer warriors.'}
            </p>
          </div>
        </div>

        {/* Card Container */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-5">
          
          {/* Mode Switcher Pills */}
          <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              onClick={() => onNavigate('login')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => onNavigate('register')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'register'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-xl text-xs text-red-600 dark:text-red-400 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email or Username
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. admin@prayercloud.org"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(true)}
                    className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <label htmlFor="rememberMe" className="ml-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                  Remember me on this device
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 active:scale-98"
              >
                <span>{isLoading ? 'Authenticating...' : 'Sign In to Platform'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Timothy Paul Silas"
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Username *
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="timothyp"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Country *
                  </label>
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Country of Residence"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="worker@missions.org"
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+1 555-0199"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Your Role *
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-medium"
                  >
                    <option value="Prayer Warrior">Prayer Warrior</option>
                    <option value="Missionary">Missionary</option>
                    <option value="Pastor">Pastor</option>
                    <option value="Evangelist">Evangelist</option>
                    <option value="Intercessor">Intercessor</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 mt-2"
              >
                <span>{isLoading ? 'Creating Account...' : 'Complete Registration'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Interactive Email OTP Verification Modal */}
      <EmailOtpVerificationModal
        isOpen={isOtpModalOpen}
        onClose={() => setIsOtpModalOpen(false)}
        onSuccess={() => onNavigate('home')}
        purpose="VERIFY_EMAIL"
      />

      {/* Secure Real Password Reset Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 space-y-4">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-600/10 text-blue-600 dark:text-blue-400 rounded-xl">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {resetStep === 'REQUEST' ? 'Reset Password' : 'Set New Password'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {resetStep === 'REQUEST' ? 'Enter email to receive instructions' : 'Enter reset token and new password'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setForgotModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>

            {resetError && (
              <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/40 rounded-xl text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{resetError}</span>
              </div>
            )}

            {resetMsg && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 rounded-xl text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-500" />
                <span>{resetMsg}</span>
              </div>
            )}

            {resetStep === 'REQUEST' ? (
              <form onSubmit={handleRequestReset} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Your Registered Email or Username *
                  </label>
                  <input
                    type="text"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="name@organization.org or username"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    type="button"
                    onClick={() => setResetStep('SUBMIT')}
                    className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                  >
                    I already have a code / token &rarr;
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all"
                  >
                    {isLoading ? 'Dispatching...' : 'Send Reset Link'}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleConfirmReset} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Reset Token or 6-Digit Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={resetTokenOrCode}
                    onChange={(e) => setResetTokenOrCode(e.target.value)}
                    placeholder="Paste link token or 6-digit code from email"
                    className="w-full px-3.5 py-2.5 font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    New Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Confirm New Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    type="button"
                    onClick={() => setResetStep('REQUEST')}
                    className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium"
                  >
                    &larr; Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all"
                  >
                    {isLoading ? 'Updating...' : 'Set New Password'}
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
