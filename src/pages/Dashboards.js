/* eslint-disable no-unused-vars */
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useClients, useTickets, useTeam } from '../services/finops';

function StatCard({ label, value, color = 'bg-indigo-50 text-indigo-700', icon }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  );
}

export function SalesDashboard({ setActivePage }) {
  const CLIENTS = useClients();
  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Sales Overview</h2>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Clients" value={CLIENTS.length} />
        <StatCard label="Active" value={CLIENTS.filter(c => c.status === 'Active').length} />
        <StatCard label="Onboarding" value={CLIENTS.filter(c => c.status !== 'Active').length} />
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-800 mb-3 text-sm">Recent Clients</h3>
        {CLIENTS.length === 0 ? (
          <p className="text-sm text-gray-400 py-4 text-center">No clients yet.</p>
        ) : CLIENTS.map(c => (
          <div key={c.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
            <div>
              <p className="text-sm font-medium text-gray-800">{c.name}</p>
              <p className="text-xs text-gray-400">{c.contact} · {c.city}</p>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
              {c.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HRDashboard({ setActivePage }) {
  const TEAM = useTeam();
  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">HR Overview</h2>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Team Members" value={TEAM.length} />
        <StatCard label="Active" value={TEAM.filter(t => t.status === 'Active').length} />
        <StatCard label="Departments" value={new Set(TEAM.map((t) => t.department).filter(Boolean)).size || 0} />
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-800 mb-3 text-sm">Team</h3>
        {TEAM.length === 0 ? (
          <p className="text-sm text-gray-400 py-4 text-center">No team members yet.</p>
        ) : TEAM.map(m => (
          <div key={m.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
              {m.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">{m.name}</p>
              <p className="text-xs text-gray-400">{m.role} · {m.department}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AssociateDashboard({ setActivePage }) {
  const TICKETS = useTickets();
  const myTickets = TICKETS.filter((t) => t.stage !== 'approved');
  const dueSoon = myTickets.length;
  const completed = TICKETS.filter((t) => t.stage === 'approved').length;
  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">My Work</h2>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="My Tickets" value={myTickets.length} />
        <StatCard label="In Progress" value={dueSoon} />
        <StatCard label="Completed" value={completed} />
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-800 mb-3 text-sm">Active Tickets</h3>
        {myTickets.length === 0 ? (
          <p className="text-sm text-gray-400 py-4 text-center">No active tickets assigned.</p>
        ) : (
          myTickets.slice(0, 10).map((t) => (
            <div key={t.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div>
                <p className="text-sm font-medium text-gray-800">{t.type}</p>
                <p className="text-xs text-gray-400">{t.client} · Due {t.due}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${t.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                {t.priority}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export function ClientDashboard({ setActivePage }) {
  const { currentUser } = useAuth();
  const TICKETS = useTickets();
  const active = TICKETS.filter((t) => t.stage !== 'approved');
  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Welcome back{currentUser?.name ? `, ${currentUser.name.split(' ')[0]}` : ''}!
      </h2>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Active Tasks" value={active.length} />
        <StatCard label="Total Items" value={TICKETS.length} />
        <StatCard label="Completed" value={TICKETS.filter((t) => t.stage === 'approved').length} />
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-800 mb-3 text-sm">Your Items</h3>
        {TICKETS.length === 0 ? (
          <p className="text-sm text-gray-400 py-4 text-center">Nothing assigned yet.</p>
        ) : TICKETS.map(t => (
          <div key={t.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
            <div>
              <p className="text-sm font-medium text-gray-800">{t.type}</p>
              <p className="text-xs text-gray-400">Due {t.due}</p>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${t.stage === 'approved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
              {t.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
