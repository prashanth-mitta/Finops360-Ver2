/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { TICKETS } from '../../data/mockData';

const STAGES = [
  { id: 'maker', label: 'Maker (In Progress)', color: 'border-amber-400' },
  { id: 'checker', label: 'Checker (Review)', color: 'border-blue-400' },
  { id: 'approved', label: 'Approved', color: 'border-green-400' },
];

export default function TicketsModule() {
  const [view, setView] = useState('kanban');
  const [tickets, setTickets] = useState(TICKETS);

  const promote = (id) => {
    setTickets(prev => prev.map(t => {
      if (t.id !== id) return t;
      const next = t.stage === 'maker' ? 'checker' : t.stage === 'checker' ? 'approved' : 'approved';
      return { ...t, stage: next };
    }));
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-gray-900">Tickets</h2>
        <div className="flex items-center gap-2">
          <div className="flex border border-gray-200 rounded-lg overflow-hidden">
            {['kanban', 'list'].map(v => (
              <button key={v} onClick={() => setView(v)}
                className={`px-3 py-1.5 text-xs font-medium capitalize ${view === v ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
                {v}
              </button>
            ))}
          </div>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">
            + New Ticket
          </button>
        </div>
      </div>

      {view === 'kanban' ? (
        <div className="grid grid-cols-3 gap-4">
          {STAGES.map(stage => (
            <div key={stage.id} className={`bg-white rounded-xl border-t-4 ${stage.color} border border-gray-200 p-4`}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-gray-600">{stage.label}</p>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  {tickets.filter(t => t.stage === stage.id).length}
                </span>
              </div>
              <div className="space-y-3">
                {tickets.filter(t => t.stage === stage.id).map(t => (
                  <div key={t.id} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-400 font-mono">{t.id}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${t.priority === 'High' ? 'bg-red-100 text-red-600' : t.priority === 'Medium' ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-500'}`}>
                        {t.priority}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-800 mb-0.5">{t.type}</p>
                    <p className="text-xs text-gray-400 mb-2">{t.client}</p>
                    <p className="text-xs text-gray-400 mb-3">Due: {t.due}</p>
                    {stage.id !== 'approved' && (
                      <button onClick={() => promote(t.id)}
                        className="w-full text-xs bg-indigo-600 text-white py-1.5 rounded-lg hover:bg-indigo-700 font-medium">
                        {stage.id === 'maker' ? 'Send to Checker →' : 'Approve ✓'}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['ID', 'Type', 'Client', 'Priority', 'Stage', 'Assignee', 'Due'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {tickets.map(t => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-xs font-mono text-gray-500">{t.id}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{t.type}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{t.client}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${t.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{t.priority}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${t.stage === 'approved' ? 'bg-green-100 text-green-700' : t.stage === 'checker' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                      {t.stage}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{t.assignee}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{t.due}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
