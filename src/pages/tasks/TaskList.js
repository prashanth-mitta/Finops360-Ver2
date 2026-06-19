import React, { useState } from 'react';

export default function TaskList({ tasks, PROJECTS, TEAM_MEMBERS, STATUS_META, PRIORITY_META, Avatar, onDetail, onMove }) {
  const [sortKey, setSortKey] = useState('dueDate');
  const [sortDir, setSortDir] = useState('asc');

  function toggleSort(key) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  }

  const sorted = [...tasks].sort((a, b) => {
    const PRIORITY_ORDER = { urgent: 0, high: 1, medium: 2, low: 3 };
    const STATUS_ORDER   = { todo: 0, in_progress: 1, review: 2, done: 3 };
    let av = a[sortKey] ?? '', bv = b[sortKey] ?? '';
    if (sortKey === 'priority') { av = PRIORITY_ORDER[a.priority]; bv = PRIORITY_ORDER[b.priority]; }
    if (sortKey === 'status')   { av = STATUS_ORDER[a.status];     bv = STATUS_ORDER[b.status];     }
    if (av < bv) return sortDir === 'asc' ? -1 : 1;
    if (av > bv) return sortDir === 'asc' ?  1 : -1;
    return 0;
  });

  const Th = ({ label, sortable, k }) => (
    <th className={`px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap ${sortable ? 'cursor-pointer hover:text-slate-700 select-none' : ''}`}
      onClick={() => sortable && toggleSort(k)}>
      {label}{sortable && sortKey === k ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ''}
    </th>
  );

  const NEXT = { todo: 'in_progress', in_progress: 'review', review: 'done' };

  return (
    <div className="h-full overflow-auto p-4">
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm min-w-[900px]">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <Th label="Task"      sortable k="title"     />
              <Th label="Project"   sortable k="projectId" />
              <Th label="Status"    sortable k="status"    />
              <Th label="Priority"  sortable k="priority"  />
              <Th label="Assignees" />
              <Th label="Due Date"  sortable k="dueDate"   />
              <Th label="Progress" />
              <Th label="" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sorted.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-16 text-slate-400 text-sm">No tasks match your filters</td></tr>
            ) : sorted.map(task => {
              const project   = PROJECTS.find(p => p.id === task.projectId);
              const assignees = TEAM_MEMBERS.filter(m => task.assignees.includes(m.id));
              const sm = STATUS_META[task.status]    || {};
              const pm = PRIORITY_META[task.priority] || {};
              const done  = task.checklist.filter(c => c.done).length;
              const total = task.checklist.length;
              const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';
              return (
                <tr key={task.id} onClick={() => onDetail(task)}
                  className="hover:bg-slate-50 cursor-pointer transition-colors group">
                  <td className="px-4 py-3 max-w-[260px]">
                    <p className="font-semibold text-slate-800 text-sm leading-snug group-hover:text-blue-700 transition-colors line-clamp-2">{task.title}</p>
                    {task.tags?.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {task.tags.slice(0,2).map(t => (
                          <span key={t} className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded">{t}</span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {project ? (
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: project.color }} />
                        <span className="text-xs text-slate-600 truncate max-w-[120px]">{project.name}</span>
                      </div>
                    ) : <span className="text-slate-300 text-xs">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${sm.bg} ${sm.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${sm.dot}`} />{sm.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${pm.bg} ${pm.color}`}>{pm.label}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex -space-x-1.5">
                      {assignees.slice(0,3).map(m => <Avatar key={m.id} member={m} size={6} />)}
                      {assignees.length > 3 && (
                        <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-500 text-[10px] font-bold flex items-center justify-center border-2 border-white">+{assignees.length-3}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {task.dueDate ? (
                      <span className={`text-xs font-medium ${isOverdue ? 'text-red-600' : 'text-slate-600'}`}>
                        {isOverdue && '⚠ '}{new Date(task.dueDate).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}
                      </span>
                    ) : <span className="text-slate-300 text-xs">No due date</span>}
                  </td>
                  <td className="px-4 py-3">
                    {total > 0 ? (
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-400 rounded-full" style={{ width: `${done/total*100}%` }} />
                        </div>
                        <span className="text-[10px] text-slate-400">{done}/{total}</span>
                      </div>
                    ) : <span className="text-slate-300 text-xs">—</span>}
                  </td>
                  <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                    {NEXT[task.status] && (
                      <button onClick={() => onMove(task.id, NEXT[task.status])}
                        className="text-[10px] text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-50 transition-colors whitespace-nowrap opacity-0 group-hover:opacity-100">
                        → {STATUS_META[NEXT[task.status]]?.label}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
