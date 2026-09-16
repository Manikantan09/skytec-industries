import React, { useState } from 'react';
import { adminLogin } from '../../lib/api';
import { AdminUser } from '../../types';
import { Mail, KeyRound, Loader2 } from 'lucide-react';

interface AdminLoginProps {
  onSuccess: (user: AdminUser) => void;
  onBackToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onBackToSite }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter your admin email and password');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    try {
      const res = await adminLogin(email.trim(), password);
      if (res.user) {
        onSuccess(res.user);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid admin credentials');
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
            <Mail className="w-8 h-8" />
          </div>
        </div>

        <h1 className="text-2xl font-extrabold text-slate-900 text-center">
          Admin Login
        </h1>
        <p className="text-sm text-slate-500 text-center mt-2">
          Sign in with your administrator password.
        </p>

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all duration-200 text-sm font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  autoFocus
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  placeholder="Enter admin password"
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
              <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
            </button>
        </form>

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
