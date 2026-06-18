import React, { useState } from 'react';
import { ALERT_LABELS } from './notificationData';

const CHANNEL_META = {
  email: { icon: '✉️', label: 'Email', bg: 'bg-blue-50',   text: 'text-blue-700'   },
  sms:   { icon: '📱', label: 'SMS',   bg: 'bg-green-50',  text: 'text-green-700'  },
};

const STATUS_META = {
  delivered: { label: 'Delivered', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  pending:   { label: 'Pending',   bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-400'   },
  failed:    { label: 'Failed',    bg: 'bg-red-50',     text: 'text-red-700',     dot: 'bg-red-500'     },
};

export default function CommLog({ log }) {
  const [filterChannel, setFilterChannel] = useState('all');
  const [filterStatus,  setFilterStatus]  = useState('all');
  const [search, setSearch] = useState('');

  const filtered = log.filter(l => {
    if (filterChannel !== 'all' && l.channel !== filterChannel)                          return false;
    if (filterStatus  !== 'all' && l.status  !== filterStatus)                           return false;
    if (search && !l.subject.toLowerCase().includes(search.toLowerCase()) && !l.to.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const delivered = log.filter(l => l.status === 'delivered').length;
  const failed    = log.filter(l => l.status === 'failed').length;
  const pending   = log.filter(l => l.status === 'pending').length;

  return (
    <div className="h-full flex flex-col">
      {/* header */}
      <div className="flex-none px-6 py-4 bg-white border-b border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Communication Log</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {log.length} sent &nbsp;•&nbsp;
              <span className="text-emerald-600 font-medium">{delivered} delivered</span> &nbsp;•&nbsp;
              <span className="text-red-500 font-medium">{failed} failed</span> &nbsp;•&nbsp;
              <span className="text-amber-600 font-medium">{pending} pending</span>
            </p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by recipient or subject…"
              className="pl-7 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-56" />
          </div>
          <select value={filterChannel} onChange={e => setFilterChannel(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="all">All Channels</option>
            <option value="email">Email</option>
            <option value="sms">SMS</option>
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="all">All Statuses</option>
            <option value="delivered">Delivered</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
          {(filterChannel !== 'all' || filterStatus !== 'all' || search) && (
            <button onClick={() => { setFilterChannel('all'); setFilterStatus('all'); setSearch(''); }}
              className="text-xs text-blue-600 hover:text-blue-800 px-2 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">✕ Clear</button>
          )}
        </div>
      </div>

      {/* table */}
      <div className="flex-1 overflow-auto px-6 py-4">
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm min-w-[700px]">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Channel</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Recipient</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Subject / Message</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Trigger</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Sent At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-16 text-slate-400 text-sm">No records match your filters</td></tr>
              ) : filtered.map(l => {
                const cm = CHANNEL_META[l.channel] || {};
                const sm = STATUS_META[l.status]   || {};
                const trigger = ALERT_LABELS[l.trigger] || { label: l.trigger };
                return (
                  <tr key={l.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold ${cm.bg} ${cm.text}`}>
                        {cm.icon} {cm.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-slate-700 font-medium">{l.to}</span>
                    </td>
                    <td className="px-4 py-3 max-w-[240px]">
                      <p className="text-xs text-slate-700 font-medium truncate">{l.subject}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-slate-500 px-2 py-0.5 bg-slate-100 rounded-full">{trigger.label}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${sm.bg} ${sm.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sm.dot}`} />{sm.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs text-slate-500">{l.sentAt}</span>
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
