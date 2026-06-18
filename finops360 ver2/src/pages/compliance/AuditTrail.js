import React, { useState } from 'react';
import { AUDIT_MODULES, TEAM_MEMBERS_MAP } from './complianceData';

const ACTION_META = {
  create:   { label: 'Created',    bg: 'bg-emerald-50', text: 'text-emerald-700', icon: '➕' },
  update:   { label: 'Updated',    bg: 'bg-blue-50',    text: 'text-blue-700',    icon: '✏️' },
  delete:   { label: 'Deleted',    bg: 'bg-red-50',     text: 'text-red-700',     icon: '🗑' },
  login:    { label: 'Login',      bg: 'bg-indigo-50',  text: 'text-indigo-700',  icon: '🔑' },
  logout:   { label: 'Logout',     bg: 'bg-slate-100',  text: 'text-slate-600',   icon: '🚪' },
  approve:  { label: 'Approved',   bg: 'bg-teal-50',    text: 'text-teal-700',    icon: '✅' },
  reject:   { label: 'Rejected',   bg: 'bg-orange-50',  text: 'text-orange-700',  icon: '❌' },
  upload:   { label: 'Uploaded',   bg: 'bg-purple-50',  text: 'text-purple-700',  icon: '⬆️' },
  download: { label: 'Downloaded', bg: 'bg-amber-50',   text: 'text-amber-700',   icon: '⬇️' },
  send:     { label: 'Sent',       bg: 'bg-pink-50',    text: 'text-pink-700',    icon: '📤' },
  view:     { label: 'Viewed',     bg: 'bg-slate-50',   text: 'text-slate-500',   icon: '👁' },
};

const ROLE_COLORS = {
  master_admin: '#6366f1', sales: '#f59e0b', hr: '#10b981', associate: '#3b82f6', client: '#ec4899',
};

export default function AuditTrail({ logs }) {
  const [filterAction, setFilterAction] = useState('all');
  const [filterModule, setFilterModule] = useState('all');
  const [filterUser,   setFilterUser]   = useState('all');
  const [search,       setSearch]       = useState('');
  const [expanded,     setExpanded]     = useState(null);

  const uniqueUsers = Object.entries(TEAM_MEMBERS_MAP).map(([id, m]) => ({ id, ...m }));

  const filtered = logs.filter(l => {
    if (filterAction !== 'all' && l.action !== filterAction)     return false;
    if (filterModule !== 'all' && l.module !== filterModule)     return false;
    if (filterUser   !== 'all' && l.userId !== filterUser)       return false;
    if (search && !l.detail.toLowerCase().includes(search.toLowerCase()) &&
        !l.userName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="h-full flex flex-col">
      {/* filters */}
      <div className="flex-none px-6 py-4 bg-white border-b border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Audit Trail</h2>
            <p className="text-xs text-slate-400 mt-0.5">{filtered.length} of {logs.length} events</p>
          </div>
          <button className="text-xs font-semibold text-slate-600 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
            ⬇ Export CSV
          </button>
        </div>
        <div className="flex gap-2 flex-wrap">
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search logs…"
              className="pl-7 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white w-48 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <select value={filterAction} onChange={e => setFilterAction(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="all">All Actions</option>
            {Object.entries(ACTION_META).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <select value={filterModule} onChange={e => setFilterModule(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 capitalize">
            <option value="all">All Modules</option>
            {AUDIT_MODULES.map(m => <option key={m} value={m} className="capitalize">{m.charAt(0).toUpperCase()+m.slice(1)}</option>)}
          </select>
          <select value={filterUser} onChange={e => setFilterUser(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="all">All Users</option>
            {uniqueUsers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
          {(filterAction !== 'all' || filterModule !== 'all' || filterUser !== 'all' || search) && (
            <button onClick={() => { setFilterAction('all'); setFilterModule('all'); setFilterUser('all'); setSearch(''); }}
              className="text-xs text-blue-600 hover:text-blue-800 px-2 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">✕ Clear</button>
          )}
        </div>
      </div>

      {/* timeline */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="text-4xl mb-3">🔍</span>
            <p className="text-sm font-semibold text-slate-700">No logs match your filters</p>
          </div>
        ) : (
          <div className="relative">
            {/* timeline line */}
            <div className="absolute left-[19px] top-0 bottom-0 w-px bg-slate-200" />
            <div className="space-y-1">
              {filtered.map((log, i) => {
                const am = ACTION_META[log.action] || ACTION_META.update;
                const member = TEAM_MEMBERS_MAP[log.userId];
                const isExpanded = expanded === log.id;
                return (
                  <div key={log.id} className="relative flex gap-4 group">
                    {/* timeline dot */}
                    <div className="flex-shrink-0 w-10 flex justify-center pt-3">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] z-10 border-2 border-white shadow-sm ${am.bg}`}>
                        {am.icon}
                      </span>
                    </div>
                    {/* card */}
                    <div className={`flex-1 mb-2 rounded-xl border transition-all cursor-pointer ${isExpanded ? 'border-blue-200 bg-blue-50/30' : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm'}`}
                      onClick={() => setExpanded(isExpanded ? null : log.id)}>
                      <div className="flex items-start gap-3 px-4 py-3">
                        {/* user avatar */}
                        {member && (
                          <span className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 mt-0.5"
                            style={{ background: member.color }}>{member.avatar}</span>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-slate-800">{log.userName}</span>
                            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${am.bg} ${am.text}`}>{am.label}</span>
                            <span className="text-[10px] text-slate-400 capitalize px-1.5 py-0.5 bg-slate-100 rounded-full">{log.module}</span>
                          </div>
                          <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{log.detail}</p>
                          {isExpanded && (
                            <div className="mt-2 pt-2 border-t border-slate-100 flex gap-4">
                              <span className="text-[10px] text-slate-400">🕐 {log.at}</span>
                              <span className="text-[10px] text-slate-400">🌐 IP: {log.ip}</span>
                              <span className="text-[10px] text-slate-400 capitalize">👤 Role: {log.role.replace('_', ' ')}</span>
                              <span className="text-[10px] text-slate-400">🆔 {log.id}</span>
                            </div>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 flex-shrink-0 whitespace-nowrap mt-0.5">{log.at.split(' ')[1]}<br/><span className="text-[9px]">{new Date(log.at.split(' ')[0]).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</span></span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
