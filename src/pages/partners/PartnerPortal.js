import React, { useState } from 'react';
import { PARTNER_CLIENTS, PARTNER_TICKETS, PARTNER_ASSOCIATES } from './partnerData';

const STATUS_COLORS = {
  open:        { bg: 'bg-blue-50',    text: 'text-blue-700',    dot: 'bg-blue-500'    },
  in_progress: { bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-500'   },
  review:      { bg: 'bg-purple-50',  text: 'text-purple-700',  dot: 'bg-purple-500'  },
  closed:      { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  active:      { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  inactive:    { bg: 'bg-slate-100',  text: 'text-slate-500',   dot: 'bg-slate-400'   },
};

const TABS = [
  { id: 'overview',    label: 'Overview',    icon: '🏠' },
  { id: 'clients',     label: 'Clients',     icon: '👥' },
  { id: 'tickets',     label: 'Tickets',     icon: '🎫' },
  { id: 'associates',  label: 'Associates',  icon: '👔' },
];

export default function PartnerPortal({ partner, onBack }) {
  const [tab, setTab] = useState('overview');

  const clients    = PARTNER_CLIENTS[partner.tenantId]    || [];
  const tickets    = PARTNER_TICKETS[partner.tenantId]    || [];
  const associates = PARTNER_ASSOCIATES[partner.tenantId] || [];

  const openTickets   = tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length;
  const activeClients = clients.filter(c => c.status === 'active').length;

  return (
    <div className="h-full flex flex-col">
      {/* branded header */}
      <div className="flex-none px-6 py-4 border-b border-slate-200" style={{ background: partner.primaryColor + '10' }}>
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-xs text-slate-500 hover:text-slate-700 px-2 py-1 rounded hover:bg-white/60 transition-colors">
            ← Back to Partners
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-black shadow-sm"
              style={{ background: partner.primaryColor }}>
              {partner.logoText}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">{partner.firmName}</h2>
              <p className="text-xs text-slate-500">{partner.tagline} • Tenant: {partner.tenantId}</p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${partner.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
              {partner.isActive ? '● Active' : '○ Inactive'}
            </span>
          </div>
        </div>

        {/* tabs */}
        <div className="flex gap-1 mt-3 -mb-4">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold border-b-2 transition-all -mb-px ${
                tab === t.id ? 'border-current text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
              style={tab === t.id ? { borderColor: partner.primaryColor, color: partner.primaryColor } : {}}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto px-6 py-5">

        {/* ── OVERVIEW ──────────────────────────────────────── */}
        {tab === 'overview' && (
          <div className="space-y-5">
            {/* KPI cards */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Total Clients',    value: clients.length,    sub: `${activeClients} active`  },
                { label: 'Total Associates', value: associates.length, sub: 'team members'              },
                { label: 'Total Tickets',    value: tickets.length,    sub: `${openTickets} open`       },
                { label: 'Open Tickets',     value: openTickets,       sub: 'need attention'            },
              ].map(s => (
                <div key={s.label} className="rounded-xl border border-slate-200 p-4 bg-white">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{s.label}</p>
                  <p className="text-3xl font-black mt-1" style={{ color: partner.primaryColor }}>{s.value}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{s.sub}</p>
                </div>
              ))}
            </div>

            {/* firm info */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-sm font-bold text-slate-800 mb-4">Firm Information</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  ['Firm Name', partner.firmName], ['Tagline', partner.tagline],
                  ['Email', partner.email], ['Phone', partner.phone],
                  ['GSTIN', partner.gstin], ['Plan', partner.plan],
                  ['Created', new Date(partner.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})],
                  ['Tenant ID', partner.tenantId],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">{label}</p>
                    <p className="text-sm text-slate-800 font-medium mt-0.5 capitalize">{value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">Address</p>
                <p className="text-sm text-slate-800 font-medium mt-0.5">{partner.address}</p>
              </div>
            </div>

            {/* recent tickets */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-sm font-bold text-slate-800 mb-3">Recent Tickets</h3>
              <div className="space-y-2">
                {tickets.slice(0,4).map(t => {
                  const sc = STATUS_COLORS[t.status] || STATUS_COLORS.open;
                  return (
                    <div key={t.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${sc.dot}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-800 truncate">{t.title}</p>
                        <p className="text-[10px] text-slate-400">{t.clientName}</p>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${sc.bg} ${sc.text} capitalize`}>{t.status.replace('_',' ')}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── CLIENTS ───────────────────────────────────────── */}
        {tab === 'clients' && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
              <p className="text-xs font-bold text-slate-700">{clients.length} Clients — {partner.firmName}</p>
            </div>
            <table className="w-full text-sm">
              <thead className="border-b border-slate-100">
                <tr>{['Client Name','GSTIN','Email','Services','Status','Joined'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {clients.map(c => {
                  const sc = STATUS_COLORS[c.status] || STATUS_COLORS.active;
                  return (
                    <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-semibold text-slate-800">{c.name}</td>
                      <td className="px-4 py-3 text-xs font-mono text-slate-500">{c.gstin}</td>
                      <td className="px-4 py-3 text-xs text-slate-600">{c.email}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {c.services.map(s => <span key={s} className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded font-medium">{s}</span>)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${sc.bg} ${sc.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />{c.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500">{new Date(c.joinDate).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* ── TICKETS ───────────────────────────────────────── */}
        {tab === 'tickets' && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
              <p className="text-xs font-bold text-slate-700">{tickets.length} Tickets — {partner.firmName}</p>
            </div>
            <table className="w-full text-sm">
              <thead className="border-b border-slate-100">
                <tr>{['Title','Client','Assignee','Priority','Due Date','Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {tickets.map(t => {
                  const sc = STATUS_COLORS[t.status] || STATUS_COLORS.open;
                  const PRIORITY_COLORS = { urgent:'text-red-600', high:'text-orange-600', medium:'text-blue-600', low:'text-slate-500' };
                  return (
                    <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-semibold text-slate-800 max-w-[200px] truncate">{t.title}</td>
                      <td className="px-4 py-3 text-xs text-slate-600">{t.clientName}</td>
                      <td className="px-4 py-3 text-xs text-slate-600">{t.assignee}</td>
                      <td className="px-4 py-3"><span className={`text-xs font-semibold capitalize ${PRIORITY_COLORS[t.priority]}`}>{t.priority}</span></td>
                      <td className="px-4 py-3 text-xs text-slate-500">{new Date(t.dueDate).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${sc.bg} ${sc.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />{t.status.replace('_',' ')}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* ── ASSOCIATES ────────────────────────────────────── */}
        {tab === 'associates' && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
              <p className="text-xs font-bold text-slate-700">{associates.length} Associates — {partner.firmName}</p>
            </div>
            <table className="w-full text-sm">
              <thead className="border-b border-slate-100">
                <tr>{['Name','Role','Email','Tickets','Status','Joined'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {associates.map(a => {
                  const sc = STATUS_COLORS[a.status] || STATUS_COLORS.active;
                  return (
                    <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-semibold text-slate-800">{a.name}</td>
                      <td className="px-4 py-3 text-xs text-slate-500 capitalize">{a.role}</td>
                      <td className="px-4 py-3 text-xs text-slate-600">{a.email}</td>
                      <td className="px-4 py-3 text-xs font-bold text-slate-700">{a.tickets}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${sc.bg} ${sc.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />{a.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500">{new Date(a.joinDate).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
