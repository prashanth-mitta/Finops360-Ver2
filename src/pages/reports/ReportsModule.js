/* eslint-disable no-unused-vars */
import React, { useState } from 'react';

const REPORT_DATA = [
  { month: 'Jan', revenue: 280000, tickets: 12, clients: 8 },
  { month: 'Feb', revenue: 310000, tickets: 15, clients: 9 },
  { month: 'Mar', revenue: 290000, tickets: 11, clients: 9 },
  { month: 'Apr', revenue: 350000, tickets: 18, clients: 10 },
  { month: 'May', revenue: 380000, tickets: 20, clients: 11 },
];

function Bar({ value, max, color = 'bg-indigo-500' }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="flex items-end gap-1 h-24">
      <div className={`${color} rounded-t w-full`} style={{ height: `${pct}%` }} />
    </div>
  );
}

export default function ReportsModule() {
  const [tab, setTab] = useState('overview');
  const maxRev = Math.max(...REPORT_DATA.map(d => d.revenue));

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-5">Reports & Analytics</h2>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Revenue (YTD)', value: '₹16.1L' },
          { label: 'Avg Monthly', value: '₹3.2L' },
          { label: 'Total Tickets', value: '76' },
          { label: 'Active Clients', value: '11' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-400 mb-1">{s.label}</p>
            <p className="text-2xl font-semibold text-gray-900">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-800 mb-4 text-sm">Monthly Revenue (Jan–May 2025)</h3>
        <div className="flex items-end gap-4">
          {REPORT_DATA.map(d => (
            <div key={d.month} className="flex-1 text-center">
              <div className="h-24 flex items-end">
                <div className="bg-indigo-500 rounded-t w-full transition-all"
                  style={{ height: `${Math.round((d.revenue / maxRev) * 100)}%` }} />
              </div>
              <p className="text-xs text-gray-500 mt-1">{d.month}</p>
              <p className="text-xs font-semibold text-gray-700">₹{(d.revenue / 100000).toFixed(1)}L</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {['Month', 'Revenue', 'Tickets Closed', 'Active Clients'].map(h => (
                <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {REPORT_DATA.map(d => (
              <tr key={d.month} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-800">{d.month} 2025</td>
                <td className="px-4 py-3 text-sm text-gray-600">₹{(d.revenue / 100000).toFixed(1)}L</td>
                <td className="px-4 py-3 text-sm text-gray-600">{d.tickets}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{d.clients}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
