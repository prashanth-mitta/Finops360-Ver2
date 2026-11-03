/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, error, requestPasswordReset, resetEmailSent, setError } = useAuth();
  const [mode, setMode] = useState('signin');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const switchMode = (next) => {
    setMode(next);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(identifier, password);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await requestPasswordReset(resetEmail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-900/40">
            <span className="text-white text-xl sm:text-2xl font-bold">F</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">FinOps 360 Connect</h1>
          <p className="text-slate-400 text-sm mt-1">
            {mode === 'forgot' ? 'Reset your password' : 'Sign in to your workspace'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
          {mode === 'forgot' ? (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <p className="text-xs text-gray-500">
                Enter the email on your account (Gmail, Outlook, company mail, etc.). We will send a reset link to that inbox.
              </p>
              <div>
                <label htmlFor="reset-email" className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Email address
                </label>
                <input
                  id="reset-email"
                  type="email"
                  autoComplete="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value.trim())}
                  required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  placeholder="your@email.com"
                />
              </div>
              {resetEmailSent && (
                <p className="text-xs text-green-700 bg-green-50 px-3 py-2 rounded-lg" role="status">
                  If an account exists for <strong>{resetEmailSent}</strong>, check your inbox (and spam) for the reset link.
                </p>
              )}
              {error && (
                <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg" role="alert">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium text-sm hover:bg-indigo-700 transition-colors disabled:opacity-60"
              >
                {loading ? 'Sending…' : 'Send reset link'}
              </button>
              <button
                type="button"
                onClick={() => switchMode('signin')}
                className="w-full text-sm text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Back to sign in
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="identifier" className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Mobile or Email
                </label>
                <input
                  id="identifier"
                  type="text"
                  autoComplete="username"
                  inputMode="email"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  placeholder="90304 41804 or your@email.com"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="block text-xs font-semibold text-gray-600">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setResetEmail(identifier.includes('@') ? identifier.trim() : '');
                      switchMode('forgot');
                    }}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Forgot password?
                  </button>
                </div>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  placeholder="••••••••"
                />
              </div>
              {error && (
                <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg" role="alert">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium text-sm hover:bg-indigo-700 transition-colors disabled:opacity-60"
              >
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
