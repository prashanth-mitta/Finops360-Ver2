/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const DEMO_CREDS = [
  { role: 'Master Admin', email: 'admin@finops360.in', password: 'admin123', color: 'bg-purple-100 text-purple-700' },
  { role: 'Sales', email: 'sales@finops360.in', password: 'sales123', color: 'bg-blue-100 text-blue-700' },
  { role: 'HR', email: 'hr@finops360.in', password: 'hr123', color: 'bg-green-100 text-green-700' },
  { role: 'Associate', email: 'associate@finops360.in', password: 'assoc123', color: 'bg-amber-100 text-amber-700' },
  { role: 'Client', email: 'client@example.com', password: 'client123', color: 'bg-gray-100 text-gray-700' },
];

export default function Login() {
  const { login, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { login(email, password); setLoading(false); }, 600);
  };

  const fillDemo = (cred) => { setEmail(cred.email); setPassword(cred.password); };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">F</span>
          </div>
          <h1 className="text-2xl font-bold text-white">FinOps 360 Connect</h1>
          <p className="text-slate-400 text-sm mt-1">Sign in to your workspace</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Password</label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)} required
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                placeholder="••••••••"
              />
            </div>
            {error && <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
            <button
              type="submit" disabled={loading}
              className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium text-sm hover:bg-indigo-700 transition-colors disabled:opacity-60"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6">
            <p className="text-xs text-gray-400 text-center mb-3 font-medium uppercase tracking-wide">Demo Accounts</p>
            <div className="flex flex-wrap gap-2">
              {DEMO_CREDS.map(c => (
                <button key={c.role} onClick={() => fillDemo(c)}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium ${c.color} hover:opacity-80 transition-opacity`}>
                  {c.role}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
