/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { CheckCircle, FileText, Calendar, User, ChevronDown, ChevronUp, Download, Search } from 'lucide-react';
import { TICKETS, STAGE } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

export default function ClientHistory() {
  const { currentUser } = useAuth();
  const [expanded, setExpanded] = useState(null);
  const [search, setSearch] = useState('');

  const doneTickets = TICKETS.filter(t =>
    t.clientId === currentUser?.clientId && t.stage === STAGE.DONE
  );

  const filtered = doneTickets.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.id.toLowerCase().includes(search.toLowerCase())
  );

  if (doneTickets.length === 0) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-xl font-semibold text-gray-900 mb-2">History</h1>
        <p className="text-sm text-gray-400 mb-8">All completed work will appear here</p>
        <div className="text-center py-16">
          <CheckCircle size={40} className="text-gray-200 mx-auto mb-4" />
          <p className="text-gray-400 font-medium">No completed tasks yet</p>
          <p className="text-gray-300 text-sm mt-1">Your completed filings and work will be archived here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">History</h1>
        <p className="text-sm text-gray-400 mt-0.5">{doneTickets.length} completed task{doneTickets.length > 1 ? 's' : ''}</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total completed', value: doneTickets.length, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'This year', value: doneTickets.filter(t => t.dueDate?.startsWith('2025')).length, color: 'text-blue-700', bg: 'bg-blue-50' },
          { label: 'Filed with ARN', value: doneTickets.filter(t => t.arn).length, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-xl p-4 text-center`}>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Search completed tasks..." value={search}
          onChange={e => setSearch(e.target.value)} className="input-field pl-9" />
      </div>

      {/* Timeline */}
      <div className="space-y-3">
        {filtered.map(t => {
          const isExp = expanded === t.id;
          return (
            <div key={t.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="p-4 flex items-start gap-3 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpanded(isExp ? null : t.id)}>
                <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle size={18} className="text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-mono text-gray-400">{t.id}</span>
                    <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium">Completed</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{t.title}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-400 flex-wrap">
                    <span className="flex items-center gap-1"><Calendar size={11} />Due: {t.dueDate}</span>
                    <span className="flex items-center gap-1"><User size={11} />{t.assignedToName}</span>
                    {t.arn && <span className="text-green-600 font-medium">ARN: {t.arn}</span>}
                  </div>
                </div>
                {isExp ? <ChevronUp size={16} className="text-gray-400 flex-shrink-0 mt-1" /> : <ChevronDown size={16} className="text-gray-400 flex-shrink-0 mt-1" />}
              </div>

              {isExp && (
                <div className="border-t border-gray-100 p-4 space-y-4">
                  {/* Completion notes */}
                  {t.completionNotes && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Summary</p>
                      <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-lg p-3">{t.completionNotes}</p>
                    </div>
                  )}

                  {/* Documents */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Documents submitted</p>
                    <div className="space-y-1.5">
                      {t.checklist.map(item => (
                        <div key={item.id} className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                          <CheckCircle size={13} className="text-green-500 flex-shrink-0" />
                          <span className="text-xs text-green-800 flex-1">{item.label}</span>
                          <button className="text-xs text-blue-600 hover:underline flex items-center gap-0.5">
                            <Download size={11} /> View
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Activity history */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Activity log</p>
                    <div className="space-y-2">
                      {t.history.map((h, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0 mt-1.5" />
                          <div>
                            <p className="text-xs font-medium text-gray-700">{h.action}</p>
                            <p className="text-xs text-gray-400">
                              {h.by} · {new Date(h.at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && search && (
          <div className="text-center py-10 text-gray-400">
            <p>No results found for "{search}"</p>
          </div>
        )}
      </div>
    </div>
  );
}
