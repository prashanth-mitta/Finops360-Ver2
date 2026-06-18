import React, { useState } from 'react';
import ComplianceCalendar from './ComplianceCalendar';
import AuditTrail        from './AuditTrail';
import ComplianceStats   from './ComplianceStats';
import { COMPLIANCE_DEADLINES, MOCK_AUDIT_LOGS } from './complianceData';

const TABS = [
  { id: 'calendar', label: 'Compliance Calendar', icon: '📅' },
  { id: 'audit',    label: 'Audit Trail',          icon: '🔍' },
  { id: 'stats',    label: 'Analytics',            icon: '📊' },
];

export default function ComplianceModule({ userRole }) {
  const [tab,       setTab]       = useState('calendar');
  const [deadlines, setDeadlines] = useState(COMPLIANCE_DEADLINES);

  const overdueCount = deadlines.filter(d =>
    d.status !== 'completed' && d.dueDate && new Date(d.dueDate) < new Date()
  ).length;

  const dueSoonCount = deadlines.filter(d => {
    if (d.status === 'completed') return false;
    const diff = (new Date(d.dueDate) - new Date()) / 86400000;
    return diff >= 0 && diff <= 7;
  }).length;

  return (
    <div className="h-full flex flex-col bg-slate-50">

      {/* header */}
      <div className="flex-none bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Compliance & Audit</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {overdueCount > 0 && <span className="text-red-600 font-semibold">{overdueCount} overdue&nbsp;•&nbsp;</span>}
              {dueSoonCount > 0 && <span className="text-amber-600 font-semibold">{dueSoonCount} due this week&nbsp;•&nbsp;</span>}
              <span>{deadlines.length} total compliance items</span>
            </p>
          </div>
        </div>

        {/* tabs */}
        <div className="flex gap-1 mt-4 border-b border-slate-100 -mb-4">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-all -mb-px ${
                tab === t.id
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}>
              <span>{t.icon}</span>
              <span>{t.label}</span>
              {t.id === 'calendar' && overdueCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full leading-none">
                  {overdueCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* content */}
      <div className="flex-1 overflow-hidden">
        {tab === 'calendar' && <ComplianceCalendar deadlines={deadlines} setDeadlines={setDeadlines} />}
        {tab === 'audit'    && <AuditTrail logs={MOCK_AUDIT_LOGS} />}
        {tab === 'stats'    && <ComplianceStats deadlines={deadlines} logs={MOCK_AUDIT_LOGS} />}
      </div>
    </div>
  );
}
