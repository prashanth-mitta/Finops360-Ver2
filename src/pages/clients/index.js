/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useClients } from '../../services/finops';

export default function ClientsModule() {
  const CLIENTS = useClients();
  const [view, setView] = useState('list');
  const [selected, setSelected] = useState(null);

  if (selected) {
    return (
      <div className="p-6">
        <button onClick={() => setSelected(null)} className="text-sm text-indigo-600 hover:text-indigo-800 mb-4 flex items-center gap-1">
          ← Back to Clients
        </button>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700 text-xl font-bold">
              {selected.name[0]}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{selected.name}</h2>
              <p className="text-sm text-gray-400">{selected.city} · {selected.plan} Plan</p>
            </div>
            <span className={`ml-auto text-sm px-3 py-1 rounded-full font-medium ${selected.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
              {selected.status}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              ['Contact', selected.contact], ['Email', selected.email], ['Phone', selected.phone],
              ['GSTIN', selected.gstin], ['PAN', selected.pan], ['Manager', selected.manager],
              ['Client Since', selected.since], ['Plan', selected.plan],
            ].map(([label, value]) => (
              <div key={label} className="border-b border-gray-50 pb-3">
                <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                <p className="text-sm font-medium text-gray-800">{value}</p>
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
        <h2 className="text-lg font-semibold text-gray-900">Clients ({CLIENTS.length})</h2>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">
          + Onboard Client
        </button>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {['Client', 'Contact', 'City', 'Plan', 'Status', 'Manager'].map(h => (
                <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {CLIENTS.map(c => (
              <tr key={c.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelected(c)}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">{c.name[0]}</div>
                    <span className="text-sm font-medium text-gray-900">{c.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{c.contact}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{c.city}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{c.plan}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${c.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{c.status}</span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{c.manager}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
