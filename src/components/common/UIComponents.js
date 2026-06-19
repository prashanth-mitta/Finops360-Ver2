import React from 'react';
import { STAGE } from '../../data/mockData';
import { FileX, Plus } from 'lucide-react';

export function StageTag({ stage }) {
  const map = {
    [STAGE.DOCS]: { label: 'Doc Collection', cls: 'bg-blue-50 text-blue-700' },
    [STAGE.MAKER]: { label: 'Maker', cls: 'bg-purple-50 text-purple-700' },
    [STAGE.CHECKER]: { label: 'Checker Review', cls: 'bg-amber-50 text-amber-700' },
    [STAGE.DONE]: { label: 'Completed', cls: 'bg-green-50 text-green-700' },
  };
  const s = map[stage] || { label: stage, cls: 'bg-gray-50 text-gray-600' };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${s.cls}`}>{s.label}</span>;
}

export function PriorityTag({ priority }) {
  const map = {
    High: 'bg-red-50 text-red-700',
    Medium: 'bg-amber-50 text-amber-700',
    Low: 'bg-gray-100 text-gray-600',
  };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${map[priority] || 'bg-gray-100 text-gray-600'}`}>{priority}</span>;
}

export function StatCard({ label, value, sub, icon: Icon, color = 'blue', onClick }) {
  const colors = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-700', icon: 'text-blue-500' },
    green: { bg: 'bg-green-50', text: 'text-green-700', icon: 'text-green-500' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-700', icon: 'text-amber-500' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-700', icon: 'text-purple-500' },
    red: { bg: 'bg-red-50', text: 'text-red-700', icon: 'text-red-500' },
    gray: { bg: 'bg-gray-50', text: 'text-gray-700', icon: 'text-gray-500' },
  };
  const c = colors[color] || colors.blue;
  return (
    <div
      className={`bg-white rounded-xl border border-gray-100 p-5 shadow-sm ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
          <p className={`text-2xl font-bold mt-1 ${c.text}`}>{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        </div>
        {Icon && (
          <div className={`w-10 h-10 ${c.bg} rounded-lg flex items-center justify-center`}>
            <Icon size={20} className={c.icon} />
          </div>
        )}
      </div>
    </div>
  );
}

export function EmptyState({ title = 'No data found', desc = '', action, actionLabel = 'Add new' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
        <FileX size={24} className="text-gray-400" />
      </div>
      <p className="text-gray-700 font-medium">{title}</p>
      {desc && <p className="text-gray-400 text-sm mt-1">{desc}</p>}
      {action && (
        <button onClick={action} className="mt-4 btn-primary flex items-center gap-2">
          <Plus size={16} /> {actionLabel}
        </button>
      )}
    </div>
  );
}

export function MaskedField({ value, label }) {
  const [revealed, setRevealed] = React.useState(false);
  const [otpSent, setOtpSent] = React.useState(false);
  const [otp, setOtp] = React.useState('');

  const handleReveal = () => { setOtpSent(true); };
  const handleVerify = () => {
    if (otp === '1234') { setRevealed(true); setOtpSent(false); setTimeout(() => setRevealed(false), 60000); }
    else alert('Invalid OTP. Use 1234 for demo.');
  };

  return (
    <div>
      <div className="flex items-center gap-2">
        <span className="font-mono text-sm">{revealed ? value : (value?.replace(/.(?=.{4})/g, 'X') || '—')}</span>
        {!revealed && !otpSent && (
          <button onClick={handleReveal} className="text-xs text-blue-600 hover:underline">View</button>
        )}
      </div>
      {otpSent && !revealed && (
        <div className="mt-2 flex items-center gap-2">
          <input type="text" placeholder="Enter OTP (demo: 1234)" className="input-field w-40 text-xs" value={otp} onChange={e => setOtp(e.target.value)} maxLength={4} />
          <button onClick={handleVerify} className="btn-primary text-xs px-3 py-1.5">Verify</button>
        </div>
      )}
      {revealed && <p className="text-xs text-green-600 mt-1">Visible for 60 seconds</p>}
    </div>
  );
}

export function SectionHeader({ title, action, actionLabel, actionIcon: Icon }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-base font-semibold text-gray-900">{title}</h2>
      {action && (
        <button onClick={action} className="btn-primary flex items-center gap-1.5 text-sm">
          {Icon && <Icon size={15} />} {actionLabel}
        </button>
      )}
    </div>
  );
}
