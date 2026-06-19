import React from 'react';

const COLUMNS = [
  { key: 'todo',        label: 'To Do',       accent: 'border-slate-300',  headerBg: 'bg-slate-50'   },
  { key: 'in_progress', label: 'In Progress',  accent: 'border-blue-400',   headerBg: 'bg-blue-50'    },
  { key: 'review',      label: 'In Review',    accent: 'border-amber-400',  headerBg: 'bg-amber-50'   },
  { key: 'done',        label: 'Done',         accent: 'border-emerald-400',headerBg: 'bg-emerald-50' },
];

function TaskCard({ task, PROJECTS, TEAM_MEMBERS, STATUS_META, PRIORITY_META, Avatar, onDetail, onMove }) {
  const project    = PROJECTS.find(p => p.id === task.projectId);
  const assignees  = TEAM_MEMBERS.filter(m => task.assignees.includes(m.id));
  const doneItems  = task.checklist.filter(c => c.done).length;
  const totalItems = task.checklist.length;
  const isOverdue  = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';
  const NEXT = { todo: 'in_progress', in_progress: 'review', review: 'done' };
  const PREV = { done: 'review', review: 'in_progress', in_progress: 'todo' };
  const pm = PRIORITY_META[task.priority] || {};

  return (
    <div onClick={() => onDetail(task)}
      className="bg-white rounded-xl border border-slate-200 p-3.5 cursor-pointer hover:shadow-md hover:border-blue-200 transition-all group">
      {project && (
        <div className="flex items-center gap-1.5 mb-2">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: project.color }} />
          <span className="text-[10px] font-medium text-slate-500 truncate">{project.name}</span>
        </div>
      )}
      <p className="text-sm font-semibold text-slate-800 leading-snug mb-2 group-hover:text-blue-700 transition-colors">
        {task.title}
      </p>
      {task.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {task.tags.slice(0,3).map(tag => (
            <span key={tag} className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-medium">{tag}</span>
          ))}
        </div>
      )}
      {totalItems > 0 && (
        <div className="mb-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-slate-400">{doneItems}/{totalItems} done</span>
            <span className="text-[10px] text-slate-400">{Math.round(doneItems/totalItems*100)}%</span>
          </div>
          <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-400 rounded-full transition-all" style={{ width: `${totalItems ? doneItems/totalItems*100 : 0}%` }} />
          </div>
        </div>
      )}
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-1.5">
          <span className={`text-[10px] font-semibold ${pm.color}`}>{pm.label}</span>
          {task.comments?.length > 0 && (
            <span className="text-[10px] text-slate-400 ml-1">💬 {task.comments.length}</span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          {isOverdue && <span className="text-[10px] text-red-500 font-semibold">Overdue</span>}
          {task.dueDate && !isOverdue && (
            <span className="text-[10px] text-slate-400">{new Date(task.dueDate).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</span>
          )}
          <div className="flex -space-x-1.5">
            {assignees.slice(0,2).map(m => <Avatar key={m.id} member={m} size={5} />)}
            {assignees.length > 2 && (
              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-500 text-[9px] font-bold flex items-center justify-center border border-white">
                +{assignees.length - 2}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
        {PREV[task.status] && (
          <button onClick={() => onMove(task.id, PREV[task.status])}
            className="text-[10px] text-slate-400 hover:text-slate-700 px-1.5 py-0.5 rounded hover:bg-slate-100">
            ← Back
          </button>
        )}
        {NEXT[task.status] && (
          <button onClick={() => onMove(task.id, NEXT[task.status])}
            className="text-[10px] text-blue-500 hover:text-blue-700 px-1.5 py-0.5 rounded hover:bg-blue-50 ml-auto">
            Forward →
          </button>
        )}
      </div>
    </div>
  );
}

export default function TaskBoard({ tasks, PROJECTS, TEAM_MEMBERS, STATUS_META, PRIORITY_META, Avatar, onDetail, onMove }) {
  const byStatus = key => tasks.filter(t => t.status === key);
  return (
    <div className="h-full overflow-x-auto">
      <div className="flex gap-4 p-4 h-full min-w-max">
        {COLUMNS.map(col => {
          const colTasks = byStatus(col.key);
          return (
            <div key={col.key} className="w-72 flex flex-col flex-shrink-0">
              <div className={`flex items-center justify-between px-3 py-2 rounded-t-xl ${col.headerBg} border ${col.accent} border-b-0`}>
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${STATUS_META[col.key]?.dot || 'bg-slate-400'}`} />
                  <span className="text-xs font-bold text-slate-700">{col.label}</span>
                </div>
                <span className="text-xs font-semibold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                  {colTasks.length}
                </span>
              </div>
              <div className={`flex-1 overflow-y-auto border ${col.accent} rounded-b-xl rounded-tr-xl p-2 space-y-2 bg-slate-50/50 min-h-64`}>
                {colTasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <span className="text-2xl mb-2">{col.key === 'done' ? '✅' : col.key === 'review' ? '👀' : col.key === 'in_progress' ? '⚡' : '📋'}</span>
                    <p className="text-xs text-slate-400">No tasks here</p>
                  </div>
                ) : colTasks.map(t => (
                  <TaskCard key={t.id} task={t}
                    PROJECTS={PROJECTS} TEAM_MEMBERS={TEAM_MEMBERS}
                    STATUS_META={STATUS_META} PRIORITY_META={PRIORITY_META}
                    Avatar={Avatar} onDetail={onDetail} onMove={onMove} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
