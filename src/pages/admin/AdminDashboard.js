/* eslint-disable no-unused-vars */
import React from 'react';
import { useClients, useTickets, useTeam } from '../../services/finops';

export default function AdminDashboard({ setActivePage }) {
  const CLIENTS = useClients();
  const TICKETS = useTickets();
  const TEAM = useTeam();
  const stats = [
    { label: 'Total Clients', value: CLIENTS.length },
    { label: 'Open Tickets', value: TICKETS.filter(t => t.stage !== 'approved').length },
    { label: 'Team Members', value: TEAM.length },
    { label: 'Revenue (May)', value: '₹3.8L' },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Admin Overview</h2>
        <p className="text-sm text-gray-400">FinOps 360 · June 2025</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-400 mb-1">{s.label}</p>
            <p className="text-2xl font-semibold text-gray-900">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-800 mb-3 text-sm">Recent Tickets</h3>
          {TICKETS.map(t => (
            <div key={t.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div>
                <p className="text-sm font-medium text-gray-800">{t.type}</p>
                <p className="text-xs text-gray-400">{t.client} · {t.assignee}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                t.stage === 'approved' ? 'bg-green-100 text-green-700' :
                t.stage === 'checker' ? 'bg-blue-100 text-blue-700' :
                'bg-amber-100 text-amber-700'
              }`}>
                {t.stage === 'maker' ? 'In Progress' : t.stage === 'checker' ? 'Review' : 'Approved'}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-800 mb-3 text-sm">Clients</h3>
          {CLIENTS.map(c => (
            <div key={c.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-bold flex-shrink-0">
                {c.name[0]}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{c.name}</p>
                <p className="text-xs text-gray-400">{c.city} · {c.plan}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                {c.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
