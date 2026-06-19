/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useTeam } from '../../services/finops';

export default function HRModule() {
  const TEAM = useTeam();
  const [selected, setSelected] = useState(null);

  if (selected) {
    return (
      <div className="p-6">
        <button onClick={() => setSelected(null)} className="text-sm text-indigo-600 hover:text-indigo-800 mb-4">← Back</button>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xl font-bold">
              {selected.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{selected.name}</h2>
              <p className="text-sm text-gray-400">{selected.role} · {selected.department}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[['Email', selected.email], ['Phone', selected.phone], ['Department', selected.department],
              ['Status', selected.status], ['Joined', selected.joined], ['Active Clients', selected.clients]].map(([l, v]) => (
              <div key={l} className="border-b border-gray-50 pb-3">
                <p className="text-xs text-gray-400">{l}</p>
                <p className="text-sm font-medium text-gray-800">{v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-gray-900">HR & Associates</h2>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">
          + Add Member
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {TEAM.map(m => (
          <div key={m.id} onClick={() => setSelected(m)}
            className="bg-white rounded-xl border border-gray-200 p-4 cursor-pointer hover:border-indigo-300 hover:shadow-sm transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold">
                {m.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{m.name}</p>
                <p className="text-xs text-gray-400">{m.role}</p>
              </div>
              <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">{m.status}</span>
            </div>
            <div className="flex gap-4 text-xs text-gray-500">
              <span>🏢 {m.department}</span>
              <span>👥 {m.clients} clients</span>
              <span>🎫 {m.tickets} tickets</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
