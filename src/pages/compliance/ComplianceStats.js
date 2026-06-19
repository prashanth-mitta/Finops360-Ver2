import React, { useMemo } from 'react';
import { COMPLIANCE_CATEGORIES, TEAM_MEMBERS_MAP } from './complianceData';

export default function ComplianceStats({ deadlines, logs }) {
  const stats = useMemo(() => {
    const enriched = deadlines.map(d => ({
      ...d,
      effectiveStatus: d.status !== 'completed' && d.dueDate && new Date(d.dueDate) < new Date() ? 'overdue' : d.status,
    }));

    const total       = enriched.length;
    const completed   = enriched.filter(d => d.effectiveStatus === 'completed').length;
    const overdue     = enriched.filter(d => d.effectiveStatus === 'overdue').length;
    const inProgress  = enriched.filter(d => d.effectiveStatus === 'in_progress').length;
    const compRate    = total ? Math.round(completed / total * 100) : 0;

    // by category
    const byCat = COMPLIANCE_CATEGORIES.map(cat => {
      const items = enriched.filter(d => d.category === cat);
      return { cat, total: items.length, completed: items.filter(d => d.effectiveStatus === 'completed').length, overdue: items.filter(d => d.effectiveStatus === 'overdue').length };
    }).filter(c => c.total > 0);

    // by assignee
    const byAssignee = Object.entries(TEAM_MEMBERS_MAP).map(([id, m]) => {
      const items = enriched.filter(d => d.assignee === id);
      return { id, ...m, total: items.length, completed: items.filter(d => d.effectiveStatus === 'completed').length, overdue: items.filter(d => d.effectiveStatus === 'overdue').length };
    }).filter(a => a.total > 0).sort((a, b) => b.total - a.total);

    // upcoming (next 30 days)
    const now = new Date(); const soon = new Date(); soon.setDate(now.getDate() + 30);
    const upcoming = enriched.filter(d => {
      const dd = new Date(d.dueDate);
      return dd >= now && dd <= soon && d.effectiveStatus !== 'completed';
    }).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)).slice(0, 6);

    // audit activity (logs by module)
    const logsByModule = {};
    logs.forEach(l => { logsByModule[l.module] = (logsByModule[l.module] || 0) + 1; });
    const topModules = Object.entries(logsByModule).sort((a, b) => b[1] - a[1]).slice(0, 6);
    const maxMod = topModules[0]?.[1] || 1;

    return { total, completed, overdue, inProgress, compRate, byCat, byAssignee, upcoming, topModules, maxMod };
  }, [deadlines, logs]);

  const CAT_COLORS = {
    'GST': '#6366f1', 'Income Tax': '#ec4899', 'TDS': '#f59e0b',
    'ROC/MCA': '#10b981', 'Payroll': '#3b82f6', 'FEMA': '#8b5cf6', 'Labour': '#ef4444',
  };

  return (
    <div className="h-full overflow-auto px-6 py-4 space-y-4">
      {/* KPI row */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Compliance Rate', value: `${stats.compRate}%`,  sub: `${stats.completed}/${stats.total} completed`,   accent: stats.compRate >= 80 ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-amber-50 border-amber-200 text-amber-700' },
          { label: 'In Progress',      value: stats.inProgress,       sub: 'Actively being worked on',                     accent: 'bg-blue-50 border-blue-200 text-blue-700'   },
          { label: 'Overdue',          value: stats.overdue,          sub: 'Past due date, not completed',                  accent: 'bg-red-50 border-red-200 text-red-700'     },
          { label: 'Total Items',      value: stats.total,            sub: 'Across all categories',                         accent: 'bg-slate-50 border-slate-200 text-slate-700'},
        ].map(s => (
          <div key={s.label} className={`rounded-xl border p-4 ${s.accent}`}>
            <p className="text-[10px] font-semibold uppercase tracking-wide opacity-70">{s.label}</p>
            <p className="text-3xl font-black mt-1">{s.value}</p>
            <p className="text-[10px] mt-0.5 opacity-60">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* overall progress bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-bold text-slate-800">Overall Compliance Progress</p>
          <span className="text-sm font-bold text-slate-700">{stats.compRate}%</span>
        </div>
        <div className="flex h-3 rounded-full overflow-hidden">
          {[
            { w: stats.completed,  color: '#10b981', label: 'Completed'   },
            { w: stats.inProgress, color: '#3b82f6', label: 'In Progress' },
            { w: stats.overdue,    color: '#ef4444', label: 'Overdue'     },
            { w: stats.total - stats.completed - stats.inProgress - stats.overdue, color: '#e2e8f0', label: 'Pending' },
          ].filter(s => s.w > 0).map(s => (
            <div key={s.label} className="h-full" title={`${s.label}: ${s.w}`}
              style={{ width: `${stats.total ? s.w/stats.total*100 : 0}%`, background: s.color }} />
          ))}
        </div>
        <div className="flex gap-4 mt-2">
          {[{color:'#10b981',l:'Completed'},{color:'#3b82f6',l:'In Progress'},{color:'#ef4444',l:'Overdue'},{color:'#e2e8f0',l:'Pending'}].map(s => (
            <div key={s.l} className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ background:s.color }} /><span className="text-xs text-slate-500">{s.l}</span></div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* by category */}
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-sm font-bold text-slate-800 mb-3">By Category</p>
          <div className="space-y-3">
            {stats.byCat.map(c => {
              const color = CAT_COLORS[c.cat] || '#6366f1';
              const pct = c.total ? Math.round(c.completed/c.total*100) : 0;
              return (
                <div key={c.cat}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                      <span className="text-xs font-medium text-slate-700">{c.cat}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {c.overdue > 0 && <span className="text-[10px] text-red-500 font-semibold">{c.overdue} overdue</span>}
                      <span className="text-[10px] text-slate-400">{c.completed}/{c.total}</span>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width:`${pct}%`, background: color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* by assignee */}
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-sm font-bold text-slate-800 mb-3">By Assignee</p>
          <div className="space-y-3">
            {stats.byAssignee.map(a => {
              const pct = a.total ? Math.round(a.completed/a.total*100) : 0;
              return (
                <div key={a.id} className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0" style={{ background: a.color }}>{a.avatar}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-medium text-slate-700">{a.name.split(' ')[0]}</span>
                      <span className="text-[10px] text-slate-400">{pct}% {a.overdue > 0 && <span className="text-red-500">• {a.overdue} overdue</span>}</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width:`${pct}%`, background: a.color }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* upcoming deadlines */}
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-sm font-bold text-slate-800 mb-3">Upcoming (Next 30 Days)</p>
          {stats.upcoming.length === 0 ? (
            <div className="text-center py-6"><span className="text-2xl">🎉</span><p className="text-xs text-slate-400 mt-1">Nothing due soon!</p></div>
          ) : (
            <div className="space-y-2">
              {stats.upcoming.map(d => {
                const days = Math.ceil((new Date(d.dueDate) - new Date()) / 86400000);
                const color = CAT_COLORS[d.category] || '#6366f1';
                return (
                  <div key={d.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate">{d.title}</p>
                      <p className="text-[10px] text-slate-400">{d.client} • {d.category}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${days <= 3 ? 'bg-red-50 text-red-600' : days <= 7 ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>
                      {days === 0 ? 'Today' : `${days}d`}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* audit activity by module */}
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-sm font-bold text-slate-800 mb-3">Audit Activity by Module</p>
          <div className="space-y-2.5">
            {stats.topModules.map(([mod, count]) => (
              <div key={mod} className="flex items-center gap-3">
                <span className="text-xs font-medium text-slate-600 w-24 capitalize">{mod}</span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-400 rounded-full" style={{ width:`${count/stats.maxMod*100}%` }} />
                </div>
                <span className="text-xs font-bold text-slate-700 w-5 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
