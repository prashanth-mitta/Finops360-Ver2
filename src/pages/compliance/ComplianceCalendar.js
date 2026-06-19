import React, { useState, useMemo } from 'react';
import { COMPLIANCE_CATEGORIES, TEAM_MEMBERS_MAP } from './complianceData';

const STATUS_META = {
  pending:     { label: 'Pending',     bg: 'bg-slate-100',   text: 'text-slate-600',   dot: 'bg-slate-400',   border: 'border-slate-200'  },
  in_progress: { label: 'In Progress', bg: 'bg-blue-50',     text: 'text-blue-700',    dot: 'bg-blue-500',    border: 'border-blue-200'   },
  completed:   { label: 'Completed',   bg: 'bg-emerald-50',  text: 'text-emerald-700', dot: 'bg-emerald-500', border: 'border-emerald-200'},
  overdue:     { label: 'Overdue',     bg: 'bg-red-50',      text: 'text-red-700',     dot: 'bg-red-500',     border: 'border-red-200'    },
};

const PRIORITY_META = {
  urgent: { label: 'Urgent', color: 'text-red-600',    bg: 'bg-red-50'    },
  high:   { label: 'High',   color: 'text-orange-600', bg: 'bg-orange-50' },
  medium: { label: 'Medium', color: 'text-blue-600',   bg: 'bg-blue-50'   },
  low:    { label: 'Low',    color: 'text-slate-500',  bg: 'bg-slate-100' },
};

export default function ComplianceCalendar({ deadlines, setDeadlines }) {
  const [filterCat,    setFilterCat]    = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [search,       setSearch]       = useState('');
  const [editId,       setEditId]       = useState(null);

  const enriched = useMemo(() => deadlines.map(d => ({
    ...d,
    effectiveStatus: d.status !== 'completed' && d.dueDate && new Date(d.dueDate) < new Date() ? 'overdue' : d.status,
  })), [deadlines]);

  const filtered = enriched.filter(d => {
    if (filterCat    !== 'all' && d.category !== filterCat)           return false;
    if (filterStatus !== 'all' && d.effectiveStatus !== filterStatus) return false;
    if (search && !d.title.toLowerCase().includes(search.toLowerCase()) && !d.client.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  // stats
  const stats = useMemo(() => ({
    total:       enriched.length,
    completed:   enriched.filter(d => d.effectiveStatus === 'completed').length,
    overdue:     enriched.filter(d => d.effectiveStatus === 'overdue').length,
    dueSoon:     enriched.filter(d => { const diff = (new Date(d.dueDate) - new Date()) / 86400000; return diff >= 0 && diff <= 7 && d.effectiveStatus !== 'completed'; }).length,
    inProgress:  enriched.filter(d => d.effectiveStatus === 'in_progress').length,
  }), [enriched]);

  function updateStatus(id, status) {
    setDeadlines(prev => prev.map(d => d.id === id ? { ...d, status } : d));
    setEditId(null);
  }

  function daysLabel(dueDate, status) {
    if (status === 'completed') return null;
    const diff = Math.ceil((new Date(dueDate) - new Date()) / 86400000);
    if (diff < 0)  return { text: `${Math.abs(diff)}d overdue`, cls: 'text-red-600 font-bold' };
    if (diff === 0)return { text: 'Due today',  cls: 'text-red-500 font-bold' };
    if (diff <= 3) return { text: `${diff}d left`, cls: 'text-orange-600 font-semibold' };
    if (diff <= 7) return { text: `${diff}d left`, cls: 'text-amber-600 font-semibold' };
    return { text: `${diff}d left`, cls: 'text-slate-400' };
  }

  const CAT_COLORS = {
    'GST':          '#6366f1', 'Income Tax': '#ec4899', 'TDS':     '#f59e0b',
    'ROC/MCA':      '#10b981', 'Payroll':    '#3b82f6', 'FEMA':    '#8b5cf6',
    'Labour':       '#ef4444',
  };

  return (
    <div className="h-full flex flex-col">
      {/* stat cards */}
      <div className="flex-none px-6 pt-4 pb-2">
        <div className="grid grid-cols-5 gap-3">
          {[
            { label: 'Total',       value: stats.total,      accent: 'bg-slate-50  border-slate-200  text-slate-700'  },
            { label: 'Completed',   value: stats.completed,  accent: 'bg-emerald-50 border-emerald-200 text-emerald-700'},
            { label: 'In Progress', value: stats.inProgress, accent: 'bg-blue-50   border-blue-200   text-blue-700'   },
            { label: 'Due in 7d',   value: stats.dueSoon,    accent: 'bg-amber-50  border-amber-200  text-amber-700'  },
            { label: 'Overdue',     value: stats.overdue,    accent: 'bg-red-50    border-red-200    text-red-700'    },
          ].map(s => (
            <div key={s.label} className={`rounded-xl border p-3 ${s.accent}`}>
              <p className="text-[10px] font-semibold uppercase tracking-wide opacity-70">{s.label}</p>
              <p className="text-2xl font-black mt-0.5">{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* filters */}
      <div className="flex-none px-6 py-3 bg-white border-b border-slate-200">
        <div className="flex gap-2 flex-wrap">
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search deadlines…"
              className="pl-7 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white w-44 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="all">All Categories</option>
            {COMPLIANCE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="overdue">Overdue</option>
          </select>
          {(filterCat !== 'all' || filterStatus !== 'all' || search) && (
            <button onClick={() => { setFilterCat('all'); setFilterStatus('all'); setSearch(''); }}
              className="text-xs text-blue-600 hover:text-blue-800 px-2 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">✕ Clear</button>
          )}
          <span className="ml-auto text-xs text-slate-400 self-center">{filtered.length} item{filtered.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* table */}
      <div className="flex-1 overflow-auto px-6 py-4">
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm min-w-[900px]">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {['Compliance Item','Category','Client','Due Date','Priority','Assignee','Status','Action'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-16 text-slate-400 text-sm">No items match your filters</td></tr>
              ) : filtered.map(d => {
                const sm = STATUS_META[d.effectiveStatus] || STATUS_META.pending;
                const pm = PRIORITY_META[d.priority]      || PRIORITY_META.medium;
                const member = TEAM_MEMBERS_MAP[d.assignee];
                const dl = daysLabel(d.dueDate, d.effectiveStatus);
                const catColor = CAT_COLORS[d.category] || '#6366f1';
                return (
                  <tr key={d.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-4 py-3 max-w-[220px]">
                      <p className="text-sm font-semibold text-slate-800 leading-snug">{d.title}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5 truncate">{d.description}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full" style={{ background: catColor + '15', color: catColor }}>
                        {d.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-slate-600 font-medium">{d.client}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <p className="text-xs font-semibold text-slate-700">{new Date(d.dueDate).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</p>
                      {dl && <p className={`text-[10px] mt-0.5 ${dl.cls}`}>{dl.text}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${pm.bg} ${pm.color}`}>{pm.label}</span>
                    </td>
                    <td className="px-4 py-3">
                      {member && (
                        <div className="flex items-center gap-1.5">
                          <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                            style={{ background: member.color }}>{member.avatar}</span>
                          <span className="text-xs text-slate-600 truncate max-w-[80px]">{member.name.split(' ')[0]}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${sm.bg} ${sm.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sm.dot}`} />{sm.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {editId === d.id ? (
                        <div className="flex flex-col gap-1" onClick={e => e.stopPropagation()}>
                          {['pending','in_progress','completed'].map(s => (
                            <button key={s} onClick={() => updateStatus(d.id, s)}
                              className={`text-[10px] px-2 py-1 rounded font-semibold ${STATUS_META[s].bg} ${STATUS_META[s].text} hover:opacity-80`}>
                              {STATUS_META[s].label}
                            </button>
                          ))}
                          <button onClick={() => setEditId(null)} className="text-[10px] text-slate-400 hover:text-slate-600 mt-0.5">Cancel</button>
                        </div>
                      ) : (
                        <button onClick={() => setEditId(d.id)}
                          className="text-[10px] text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-50 transition-colors opacity-0 group-hover:opacity-100">
                          Update →
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
