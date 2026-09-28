import React, { useState, useEffect, useRef } from 'react';
import { Mail, Shield, CheckCircle, AlertCircle, RefreshCw, X, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PrayerCloudLogo } from './PrayerCloudLogo';

interface EmailOtpVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  emailOverride?: string;
  purpose?: 'VERIFY_EMAIL' | 'LOGIN_VERIFICATION' | 'PASSWORD_RESET';
}

export const EmailOtpVerificationModal: React.FC<EmailOtpVerificationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  emailOverride,
  purpose = 'VERIFY_EMAIL'
}) => {
  const { verifyEmailOtp, resendEmailOtp, pendingVerificationEmail, currentUser } = useAuth();
  const targetEmail = emailOverride || pendingVerificationEmail || currentUser?.email || '';

  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Cooldown countdown timer
  useEffect(() => {
    if (!isOpen) return;
    setDigits(['', '', '', '', '', '']);
    setError(null);
    setSuccessMsg(null);
    setResendCooldown(60);

    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  // Focus first input on modal open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDigitChange = (index: number, value: string) => {
    // Handle paste of whole 6-digit code
    if (value.length > 1) {
      const pasted = value.replace(/\D/g, '').slice(0, 6);
      if (pasted) {
        const newDigits = [...digits];
        for (let i = 0; i < pasted.length; i++) {
          newDigits[i] = pasted[i];
        }
        setDigits(newDigits);
        const nextIndex = Math.min(pasted.length, 5);
        inputRefs.current[nextIndex]?.focus();
        return;
      }
    }

    const cleanChar = value.replace(/\D/g, '');
    const newDigits = [...digits];
    newDigits[index] = cleanChar;
    setDigits(newDigits);
    setError(null);

    // Auto advance to next input
    if (cleanChar && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const code = digits.join('').trim();
    if (code.length !== 6) {
      setError('Please enter all 6 digits of your verification code.');
      return;
    }

    setError(null);
    setIsLoading(true);

    const res = await verifyEmailOtp(code, purpose);
    setIsLoading(false);

    if (res.success) {
      setSuccessMsg('Email verified successfully! Welcome to PrayerCloud.');
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 1200);
    } else {
      setError(res.error || 'Verification failed. Please check the code.');
      if (res.attemptsLeft !== undefined) {
        setAttemptsLeft(res.attemptsLeft);
      }
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || isResending) return;
    setIsResending(true);
    setError(null);

    const res = await resendEmailOtp(purpose);
    setIsResending(false);

    if (res.success) {
      setResendCooldown(60);
      setSuccessMsg('A new 6-digit code has been sent to your email.');
      setTimeout(() => setSuccessMsg(null), 4000);
    } else {
      setError(res.error || 'Failed to resend code. Please try again.');
      if (res.waitSeconds) {
        setResendCooldown(res.waitSeconds);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-slate-900 border border-blue-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-blue-950/80 space-y-6 text-white relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 flex flex-col items-center">
          <div className="p-3 bg-blue-600/10 border border-amber-400/30 rounded-2xl">
            <PrayerCloudLogo size="sm" />
          </div>
          <div>
            <h3 className="text-xl font-black font-display tracking-tight text-white flex items-center justify-center gap-2">
              <span>Verify Your Email</span>
              <Shield className="w-4 h-4 text-amber-400" />
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              We sent a 6-digit verification code to
            </p>
            <p className="text-xs font-semibold text-blue-400 mt-0.5 break-all">
              {targetEmail || 'your email address'}
            </p>
          </div>
        </div>

        {/* Notifications */}
        {error && (
          <div className="p-3.5 bg-red-950/50 border border-red-500/40 rounded-xl flex items-start gap-2.5 text-xs text-red-300">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p>{error}</p>
              {attemptsLeft !== null && attemptsLeft > 0 && (
                <p className="text-[11px] text-red-400 mt-1 font-semibold">
                  Attempts remaining before expiration: {attemptsLeft}
                </p>
              )}
            </div>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 bg-emerald-950/50 border border-emerald-500/40 rounded-xl flex items-center gap-2.5 text-xs text-emerald-300 font-medium">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* 6-Digit Code Input Form */}
        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex justify-between gap-2 sm:gap-3">
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-mono font-bold bg-slate-800/80 border-2 border-slate-700 focus:border-amber-400 focus:bg-slate-800 focus:ring-4 focus:ring-amber-400/20 rounded-2xl text-amber-400 transition-all outline-none"
              />
            ))}
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isLoading || digits.join('').length !== 6}
            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:opacity-40 disabled:pointer-events-none text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
          >
            <span>{isLoading ? 'Verifying Code...' : 'Confirm & Activate Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Resend Cooldown Section */}
        <div className="pt-2 border-t border-slate-800 text-center space-y-2">
          <p className="text-xs text-slate-400">
            Didn't receive the email? Check your spam folder or request a new code.
          </p>

          <button
            type="button"
            onClick={handleResend}
            disabled={resendCooldown > 0 || isResending}
            className={`inline-flex items-center gap-1.5 text-xs font-semibold py-1.5 px-3 rounded-lg transition-colors ${
              resendCooldown > 0
                ? 'text-slate-500 cursor-not-allowed'
                : 'text-amber-400 hover:text-amber-300 hover:bg-slate-800'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
            <span>
              {resendCooldown > 0
                ? `Resend available in ${resendCooldown}s`
                : isResending
                ? 'Sending Code...'
                : 'Resend Verification Code'}
            </span>
          </button>
        </div>

      </div>
    </div>
  );
};
