import React, { useState, useEffect } from 'react';
import { sendAdminOtp, verifyAdminOtp } from '../../lib/api';
import { AdminUser } from '../../types';
import { ShieldCheck, Mail, KeyRound, Loader2, ArrowLeft, RefreshCw, CheckCircle2 } from 'lucide-react';

interface AdminLoginProps {
  onSuccess: (user: AdminUser) => void;
  onBackToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onBackToSite }) => {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Step 1: Send OTP to email
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email.trim()) {
      setErrorMessage('Please enter your admin email address');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    try {
      const res = await sendAdminOtp(email.trim());
      setStep('otp');
      setResendCooldown(30); // 30s cooldown for resend
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to send OTP code');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) {
      setErrorMessage('Please enter the 6-digit verification code');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    try {
      const res = await verifyAdminOtp(email.trim(), otp.trim());
      if (res.user) {
        onSuccess(res.user);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid or expired verification code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-blue-deeper via-brand-blue to-brand-blue-dark flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm border border-white/20 backdrop-blur-sm hover:shadow-brand-blue/20 transition-shadow duration-300">
        {/* Brand Icon Header */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-brand-blue flex items-center justify-center shadow-lg shadow-brand-blue/30 text-white">
            {step === 'email' ? <Mail className="w-8 h-8" /> : <ShieldCheck className="w-8 h-8" />}
          </div>
        </div>

        <h1 className="text-2xl font-extrabold text-slate-900 text-center">
          {step === 'email' ? 'Admin Login' : 'Enter Verification Code'}
        </h1>
        <p className="text-sm text-slate-500 text-center mt-2">
          {step === 'email'
            ? 'Sign in securely with your email and one-time password (OTP)'
            : `We sent a 6-digit code to ${email}`}
        </p>

        {step === 'email' ? (
          /* Step 1: Email Form */
          <form onSubmit={handleSendOtp} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@skytec.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all duration-200 text-sm font-medium"
                />
              </div>
            </div>

            {errorMessage && (
              <p className="text-sm text-red-500 text-center font-medium bg-red-50 py-2 px-3 rounded-lg border border-red-100 animate-in fade-in slide-in-from-top-2">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-blue text-white font-semibold hover:bg-brand-blue-dark transition-colors duration-200 disabled:opacity-60 cursor-pointer text-sm shadow-md hover:shadow-lg"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isLoading ? 'Sending Code...' : 'Send OTP'}</span>
            </button>
          </form>
        ) : (
          /* Step 2: OTP Verification Form */
          <form onSubmit={handleVerifyOtp} className="mt-6 space-y-4">
            {/* Demo/Preview helper code banner */}
            {previewOtp && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs animate-in fade-in slide-in-from-top-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium">
                  Verification Code: <strong className="font-mono text-sm tracking-wider font-bold">{previewOtp}</strong>
                </span>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                6-Digit OTP Code
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  autoFocus
                  maxLength={6}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 tracking-[0.3em] font-mono text-center text-lg font-bold placeholder:text-slate-300 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all duration-200"
                />
              </div>
            </div>

            {errorMessage && (
              <p className="text-sm text-red-500 text-center font-medium bg-red-50 py-2 px-3 rounded-lg border border-red-100 animate-in fade-in slide-in-from-top-2">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading || otp.length < 6}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-blue text-white font-semibold hover:bg-brand-blue-dark transition-colors duration-200 disabled:opacity-60 cursor-pointer text-sm shadow-md hover:shadow-lg"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isLoading ? 'Verifying...' : 'Verify & Log In'}</span>
            </button>

            {/* Change Email or Resend */}
            <div className="flex items-center justify-between text-xs pt-2">
              <button
                type="button"
                onClick={() => {
                  setStep('email');
                  setOtp('');
                  setErrorMessage('');
                }}
                className="inline-flex items-center gap-1 text-slate-500 hover:text-brand-blue font-medium transition-colors duration-200 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Change Email</span>
              </button>

              <button
                type="button"
                disabled={resendCooldown > 0 || isLoading}
                onClick={() => handleSendOtp()}
                className="inline-flex items-center gap-1 text-brand-blue hover:underline font-semibold transition-colors duration-200 disabled:opacity-40 disabled:no-underline cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
                </span>
              </button>
            </div>
          </form>
        )}

        <button
          type="button"
          onClick={onBackToSite}
          className="block w-full mt-6 text-center text-sm text-slate-500 hover:text-brand-blue transition-colors duration-200 cursor-pointer"
        >
          Back to website
        </button>
      </div>
    </div>
  );
};
