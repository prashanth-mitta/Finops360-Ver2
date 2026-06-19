/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { CheckCircle, Clock, FileText, MessageSquare, AlertCircle, ChevronRight, Calendar, User, ArrowRight } from 'lucide-react';
import { TICKETS, STAGE } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

const STAGE_INFO = {
  [STAGE.DOCS]: { label: 'Documents needed', color: 'bg-amber-50 border-amber-200 text-amber-700', dot: 'bg-amber-500', desc: 'Your associate is waiting for documents to begin work.' },
  [STAGE.MAKER]: { label: 'Work in progress', color: 'bg-blue-50 border-blue-200 text-blue-700', dot: 'bg-blue-500', desc: 'Your associate is actively working on this task.' },
  [STAGE.CHECKER]: { label: 'Under review', color: 'bg-purple-50 border-purple-200 text-purple-700', dot: 'bg-purple-500', desc: 'Work is being reviewed for accuracy before completion.' },
  [STAGE.DONE]: { label: 'Completed', color: 'bg-green-50 border-green-200 text-green-700', dot: 'bg-green-500', desc: 'This task has been completed and filed.' },
};

function StageProgress({ stage }) {
  const stages = [STAGE.DOCS, STAGE.MAKER, STAGE.CHECKER, STAGE.DONE];
  const labels = ['Docs needed', 'In progress', 'Under review', 'Completed'];
  const current = stages.indexOf(stage);
  return (
    <div className="flex items-center gap-0 my-3">
      {stages.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <React.Fragment key={s}>
            <div className="flex flex-col items-center flex-shrink-0">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${done ? 'bg-green-500 text-white' : active ? 'bg-blue-700 text-white ring-2 ring-blue-200' : 'bg-gray-100 text-gray-400'}`}>
                {done ? '✓' : i + 1}
              </div>
              <span className={`text-xs mt-1 whitespace-nowrap ${active ? 'text-blue-700 font-semibold' : done ? 'text-green-600' : 'text-gray-400'}`}>{labels[i]}</span>
            </div>
            {i < stages.length - 1 && (
              <div className={`h-0.5 flex-1 mx-1 mb-4 min-w-[12px] ${i < current ? 'bg-green-400' : 'bg-gray-100'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default function ClientTasks({ onOpenTicket }) {
  const { currentUser } = useAuth();
  const [filter, setFilter] = useState('all');
  const myTickets = TICKETS.filter(t => t.clientId === currentUser?.clientId);
  const filtered = filter === 'all' ? myTickets : filter === 'active' ? myTickets.filter(t => t.stage !== STAGE.DONE) : myTickets.filter(t => t.stage === STAGE.DONE);

  const pendingDocsCount = myTickets.filter(t => t.stage === STAGE.DOCS)
    .reduce((acc, t) => acc + t.checklist.filter(c => !c.received).length, 0);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">My tasks</h1>
        <p className="text-sm text-gray-400 mt-0.5">Track the status of all your work items</p>
      </div>

      {/* Pending docs alert */}
      {pendingDocsCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5 flex items-start gap-3">
          <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-800">Action needed — {pendingDocsCount} document{pendingDocsCount > 1 ? 's' : ''} pending</p>
            <p className="text-xs text-amber-700 mt-0.5">Your associate is waiting for documents. Please upload them to avoid delays.</p>
          </div>
          <button onClick={() => onOpenTicket && onOpenTicket('docs')} className="text-xs font-semibold text-amber-700 bg-amber-100 px-3 py-1.5 rounded-lg hover:bg-amber-200 transition-colors flex-shrink-0">
            Upload now
          </button>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5">
        {[
          { key: 'all', label: `All (${myTickets.length})` },
          { key: 'active', label: `Active (${myTickets.filter(t => t.stage !== STAGE.DONE).length})` },
          { key: 'done', label: `Completed (${myTickets.filter(t => t.stage === STAGE.DONE).length})` },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === f.key ? 'bg-blue-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Ticket cards */}
      <div className="space-y-4">
        {filtered.map(t => {
          const info = STAGE_INFO[t.stage];
          const pendingDocs = t.checklist.filter(c => !c.received).length;
          const totalDocs = t.checklist.length;
          const docsReceived = t.checklist.filter(c => c.received).length;
          return (
            <div key={t.id} className={`bg-white rounded-xl border-2 ${t.stage !== STAGE.DONE ? 'border-gray-100 hover:border-blue-200' : 'border-gray-100'} p-5 transition-all`}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-xs font-mono text-gray-400">{t.id}</span>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${info.color}`}>
                      <span className="flex items-center gap-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${info.dot} inline-block`} />
                        {info.label}
                      </span>
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-gray-900">{t.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{info.desc}</p>
                </div>
              </div>

              {/* Stage progress */}
              <StageProgress stage={t.stage} />

              {/* Doc progress bar for doc collection stage */}
              {t.stage === STAGE.DOCS && (
                <div className="mt-2 p-3 bg-amber-50 rounded-lg border border-amber-100">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-medium text-amber-800">Documents uploaded</span>
                    <span className="text-amber-700 font-semibold">{docsReceived} / {totalDocs}</span>
                  </div>
                  <div className="w-full bg-amber-100 rounded-full h-2">
                    <div className="bg-amber-500 h-2 rounded-full transition-all" style={{ width: `${Math.round((docsReceived / totalDocs) * 100)}%` }} />
                  </div>
                  {pendingDocs > 0 && (
                    <p className="text-xs text-amber-700 mt-1.5">{pendingDocs} document{pendingDocs > 1 ? 's' : ''} still pending</p>
                  )}
                </div>
              )}

              {/* Completed info */}
              {t.stage === STAGE.DONE && t.arn && (
                <div className="mt-2 p-3 bg-green-50 rounded-lg border border-green-100 flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-green-800">Filed successfully</p>
                    <p className="text-xs text-green-700">ARN / Acknowledgement: <strong>{t.arn}</strong></p>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><User size={12} />{t.assignedToName}</span>
                  <span className="flex items-center gap-1"><Calendar size={12} />Due {t.dueDate}</span>
                </div>
                <button onClick={() => onOpenTicket && onOpenTicket(t.id)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
                  {t.stage === STAGE.DOCS ? 'Upload docs' : 'View details'}
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <CheckCircle size={32} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No tasks found</p>
            <p className="text-gray-400 text-sm mt-1">All your tasks will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}
