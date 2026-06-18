/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { TICKETS } from '../../data/mockData';

const PORTAL_DOCS = [
  { id: 1, name: 'Client Services Agreement', type: 'PDF', status: 'signed', date: '2025-05-28' },
  { id: 2, name: 'GST Returns Q4 FY2024-25', type: 'PDF', status: 'approved', date: '2025-05-20' },
  { id: 3, name: 'Invoice INV-2025-047', type: 'PDF', status: 'approved', date: '2025-05-30' },
];

const MESSAGES = [
  { id: 1, from: 'Rahul Mehta', text: 'Your GST return has been filed. Please check the attached acknowledgment.', time: '28 May, 10:00 AM', self: false },
  { id: 2, from: 'You', text: 'Thank you! When will the Q1 filing start?', time: '28 May, 10:30 AM', self: true },
  { id: 3, from: 'Rahul Mehta', text: 'We will start Q1 filing in the first week of July. Will keep you updated.', time: '28 May, 11:00 AM', self: false },
];

function TasksPage() {
  const myTickets = TICKETS.filter(t => t.client === 'Acme Corp');
  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-5">My Tasks</h2>
      <div className="space-y-3">
        {myTickets.map(t => (
          <div key={t.id} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold text-gray-900">{t.type}</p>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${t.stage === 'approved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                {t.status}
              </span>
            </div>
            <div className="flex gap-4 text-xs text-gray-400">
              <span>Due: {t.due}</span>
              <span>Handler: {t.assignee}</span>
              <span>ID: {t.id}</span>
            </div>
            <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${t.stage === 'approved' ? 'bg-green-500 w-full' : t.stage === 'checker' ? 'bg-blue-500 w-2/3' : 'bg-amber-500 w-1/3'}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DocumentsPage() {
  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-5">My Documents</h2>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {['Document', 'Type', 'Status', 'Date'].map(h => (
                <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {PORTAL_DOCS.map(d => (
              <tr key={d.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-800">{d.name}</td>
                <td className="px-4 py-3">
                  <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded font-medium">{d.type}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${d.status === 'signed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {d.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">{d.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MessagesPage() {
  const [msg, setMsg] = useState('');
  return (
    <div className="p-6 h-full flex flex-col">
      <h2 className="text-lg font-semibold text-gray-900 mb-5">Messages</h2>
      <div className="bg-white rounded-xl border border-gray-200 flex-1 flex flex-col overflow-hidden" style={{ height: '500px' }}>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {MESSAGES.map(m => (
            <div key={m.id} className={`flex ${m.self ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm ${m.self ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                {!m.self && <p className="text-xs font-semibold mb-1 text-indigo-600">{m.from}</p>}
                <p>{m.text}</p>
                <p className={`text-xs mt-1 ${m.self ? 'text-indigo-200' : 'text-gray-400'}`}>{m.time}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-100 p-3 flex gap-2">
          <input
            value={msg} onChange={e => setMsg(e.target.value)}
            placeholder="Type a message…"
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">Send</button>
        </div>
      </div>
    </div>
  );
}

function HistoryPage() {
  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-5">History</h2>
      <div className="space-y-3">
        {[
          { type: 'GST Filing Q3', completed: '2025-02-28', arn: 'AA123456789012' },
          { type: 'TDS Q2 Filing', completed: '2025-01-07', arn: 'AA987654321098' },
          { type: 'Bookkeeping FY2024', completed: '2024-12-31', arn: 'AA456789012345' },
        ].map((h, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-gray-900">{h.type}</p>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">Completed</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">Completed: {h.completed} · ARN: {h.arn}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ClientPortal({ page }) {
  switch (page) {
    case 'tasks': return <TasksPage />;
    case 'documents': return <DocumentsPage />;
    case 'messages': return <MessagesPage />;
    case 'history': return <HistoryPage />;
    default: return <TasksPage />;
  }
}
