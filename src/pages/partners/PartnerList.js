import React, { useState } from 'react';
import { useTenant } from '../../context/TenantContext';

const PLAN_META = {
  master:       { label: 'Master',       bg: 'bg-indigo-50',  text: 'text-indigo-700'  },
  professional: { label: 'Professional', bg: 'bg-blue-50',    text: 'text-blue-700'    },
  starter:      { label: 'Starter',      bg: 'bg-slate-100',  text: 'text-slate-600'   },
};

export default function PartnerList({ onAdd, onView, onLaunch, onLaunchPartner }) {
  const { tenants, toggleTenantActive } = useTenant();
  const [search, setSearch] = useState('');

  const partners = Object.values(tenants).filter(t => !t.isMaster);
  const filtered = partners.filter(p =>
    p.firmName.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalClients    = partners.reduce((s, p) => s + (p.stats?.clients    || 0), 0);
  const totalAssociates = partners.reduce((s, p) => s + (p.stats?.associates || 0), 0);
  const totalTickets    = partners.reduce((s, p) => s + (p.stats?.tickets    || 0), 0);
  const activeCount     = partners.filter(p => p.isActive).length;

  return (
    <div className="h-full flex flex-col">
      {/* aggregate stats */}
      <div className="flex-none px-6 pt-5 pb-3">
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Partner Firms',      value: partners.length, sub: `${activeCount} active`,    accent: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
            { label: 'Total Clients',      value: totalClients,    sub: 'across all partners',      accent: 'bg-blue-50 border-blue-200 text-blue-700'      },
            { label: 'Total Associates',   value: totalAssociates, sub: 'across all partners',      accent: 'bg-emerald-50 border-emerald-200 text-emerald-700'},
            { label: 'Total Tickets',      value: totalTickets,    sub: 'across all partners',      accent: 'bg-amber-50 border-amber-200 text-amber-700'   },
          ].map(s => (
            <div key={s.label} className={`rounded-xl border p-4 ${s.accent}`}>
              <p className="text-[10px] font-semibold uppercase tracking-wide opacity-70">{s.label}</p>
              <p className="text-3xl font-black mt-1">{s.value}</p>
              <p className="text-[10px] mt-0.5 opacity-60">{s.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* toolbar */}
      <div className="flex-none px-6 py-3 bg-white border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search partners…"
              className="w-full pl-7 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <button onClick={onAdd}
            className="ml-auto flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm">
            + Add Partner
          </button>
        </div>
      </div>

      {/* partner cards */}
      <div className="flex-1 overflow-auto px-6 py-4">
        <div className="grid grid-cols-1 gap-4">
          {filtered.map(partner => {
            const pm = PLAN_META[partner.plan] || PLAN_META.starter;
            return (
              <div key={partner.tenantId}
                className={`bg-white rounded-xl border-2 transition-all hover:shadow-md ${partner.isActive ? 'border-slate-200' : 'border-slate-100 opacity-70'}`}>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    {/* logo + info */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-black shadow-sm flex-shrink-0"
                        style={{ background: partner.primaryColor }}>
                        {partner.logoText}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-slate-900">{partner.firmName}</h3>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${pm.bg} ${pm.text}`}>{pm.label}</span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${partner.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                            {partner.isActive ? '● Active' : '○ Inactive'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{partner.tagline} • {partner.email}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{partner.address}</p>
                      </div>
                    </div>

                    {/* actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button onClick={() => onView(partner)}
                        className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                        View Details
                      </button>
                      <button onClick={() => toggleTenantActive(partner.tenantId)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${partner.isActive ? 'text-red-600 hover:bg-red-50 border border-red-200' : 'text-emerald-600 hover:bg-emerald-50 border border-emerald-200'}`}>
                        {partner.isActive ? 'Disable' : 'Enable'}
                      </button>
                      {partner.isActive && (
                        <button onClick={() => { onLaunch(partner); onLaunchPartner && onLaunchPartner(partner); }}
                          className="text-xs font-semibold text-white px-3 py-1.5 rounded-lg transition-colors shadow-sm"
                          style={{ background: partner.primaryColor }}>
                          🚀 Launch Portal
                        </button>
                      )}
                    </div>
                  </div>

                  {/* stats bar */}
                  <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-100">
                    {[
                      { label: 'Clients',    value: partner.stats?.clients    || 0, icon: '👥' },
                      { label: 'Associates', value: partner.stats?.associates || 0, icon: '👔' },
                      { label: 'Tickets',    value: partner.stats?.tickets    || 0, icon: '🎫' },
                    ].map(s => (
                      <div key={s.label} className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg">
                        <span className="text-base">{s.icon}</span>
                        <div>
                          <p className="text-lg font-black text-slate-800">{s.value}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{s.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 mt-3">
                    <span className="text-[10px] text-slate-400">Tenant ID: <code className="bg-slate-100 px-1 rounded">{partner.tenantId}</code></span>
                    <span className="text-[10px] text-slate-400">Added: {new Date(partner.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</span>
                    <span className="text-[10px] text-slate-400">GSTIN: {partner.gstin}</span>
                  </div>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <span className="text-4xl mb-3">🏢</span>
              <p className="text-sm font-semibold text-slate-700">No partners found</p>
              <p className="text-xs text-slate-400 mt-1">Add your first partner firm to get started.</p>
              <button onClick={onAdd} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors">+ Add Partner</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
