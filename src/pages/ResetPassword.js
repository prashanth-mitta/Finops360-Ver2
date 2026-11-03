import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function ResetPassword() {
  const { updatePassword, clearPasswordRecovery, currentUser, error: authError } = useAuth();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    const ok = await updatePassword(password);
    if (ok) {
      setDone(true);
      clearPasswordRecovery();
    } else {
      setError(authError || 'Could not update password. Open the reset link from your email again or request a new one.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-900/40">
            <span className="text-white text-xl sm:text-2xl font-bold">F</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Set new password</h1>
          <p className="text-slate-400 text-sm mt-1">
            {currentUser?.email ? `Account: ${currentUser.email}` : 'Choose a new password for your account'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
          {done ? (
            <div className="text-center space-y-4">
              <p className="text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg">
                Your password was updated. You can continue using FinOps 360.
              </p>
              <button
                type="button"
                onClick={() => window.location.replace(window.location.pathname || '/')}
                className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium text-sm hover:bg-indigo-700"
              >
                Continue to app
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="new-password" className="block text-xs font-semibold text-gray-600 mb-1.5">
                  New password
                </label>
                <input
                  id="new-password"
                  type="password"
                  autoComplete="new-password"
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  placeholder="At least 6 characters"
                />
              </div>
              <div>
                <label htmlFor="confirm-password" className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Confirm password
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  minLength={6}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  placeholder="Repeat new password"
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
                {loading ? 'Saving…' : 'Update password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
