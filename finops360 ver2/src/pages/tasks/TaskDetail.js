import React, { useState, useEffect } from 'react';

export default function TaskDetail({ task, PROJECTS, TEAM_MEMBERS, STATUS_META, PRIORITY_META, Avatar, onClose, onEdit, onMove, onDelete, onComment, onToggleCheck }) {
  const [commentText, setCommentText] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const project   = PROJECTS.find(p => p.id === task.projectId);
  const assignees = TEAM_MEMBERS.filter(m => task.assignees.includes(m.id));
  const sm        = STATUS_META[task.status]     || {};
  const pm        = PRIORITY_META[task.priority]  || {};
  const doneCount = task.checklist.filter(c => c.done).length;
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

  const STATUSES = [
    { key: 'todo',        label: 'To Do'       },
    { key: 'in_progress', label: 'In Progress' },
    { key: 'review',      label: 'In Review'   },
    { key: 'done',        label: 'Done'        },
  ];

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  function submitComment() {
    if (!commentText.trim()) return;
    onComment(task.id, commentText.trim());
    setCommentText('');
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-xl bg-white shadow-2xl z-50 flex flex-col overflow-hidden">

        {/* header */}
        <div className="flex-none border-b border-slate-200 px-5 py-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              {project && (
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: project.color }} />
                  <span className="text-xs font-medium text-slate-500">{project.name} • {project.client}</span>
                </div>
              )}
              <h2 className="text-base font-bold text-slate-900 leading-snug">{task.title}</h2>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={onEdit} className="text-xs text-blue-600 font-semibold px-2.5 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">✏ Edit</button>
              <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors text-xl">×</button>
            </div>
          </div>
        </div>

        {/* body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">

          {/* meta grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-1.5">Status</p>
              <select value={task.status} onChange={e => onMove(task.id, e.target.value)}
                className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border-0 ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${sm.bg} ${sm.text} cursor-pointer`}>
                {STATUSES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-1.5">Priority</p>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold ${pm.bg} ${pm.color}`}>{pm.label}</span>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-1.5">Due Date</p>
              <span className={`text-sm font-medium ${isOverdue ? 'text-red-600' : 'text-slate-700'}`}>
                {isOverdue && '⚠ '}{task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short',year:'numeric'}) : 'None'}
              </span>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-1.5">Category</p>
              <span className="text-xs text-slate-700 font-medium px-2 py-1 bg-slate-100 rounded-lg">{task.category || '—'}</span>
            </div>
          </div>

          {/* assignees */}
          <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-2">Assigned To</p>
            <div className="flex flex-wrap gap-2">
              {assignees.map(m => (
                <div key={m.id} className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-50 rounded-lg border border-slate-200">
                  <Avatar member={m} size={6} />
                  <div>
                    <p className="text-xs font-semibold text-slate-700">{m.name}</p>
                    <p className="text-[10px] text-slate-400">{m.role}</p>
                  </div>
                </div>
              ))}
              {assignees.length === 0 && <span className="text-xs text-slate-400">Unassigned</span>}
            </div>
          </div>

          {/* description */}
          {task.desc && (
            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-1.5">Description</p>
              <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 rounded-lg p-3 border border-slate-100">{task.desc}</p>
            </div>
          )}

          {/* tags */}
          {task.tags?.length > 0 && (
            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-1.5">Tags</p>
              <div className="flex flex-wrap gap-1.5">
                {task.tags.map(t => (
                  <span key={t} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">{t}</span>
                ))}
              </div>
            </div>
          )}

          {/* checklist */}
          {task.checklist?.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Checklist</p>
                <span className="text-xs text-slate-500 font-medium">{doneCount}/{task.checklist.length}</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full mb-3 overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full transition-all"
                  style={{ width: `${task.checklist.length ? doneCount/task.checklist.length*100 : 0}%` }} />
              </div>
              <div className="space-y-2">
                {task.checklist.map(item => (
                  <label key={item.id} className="flex items-center gap-2.5 cursor-pointer group/check">
                    <input type="checkbox" checked={item.done}
                      onChange={() => onToggleCheck(task.id, item.id)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                    <span className={`text-sm transition-colors ${item.done ? 'line-through text-slate-400' : 'text-slate-700 group-hover/check:text-slate-900'}`}>
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* comments */}
          <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-3">
              Comments {task.comments?.length > 0 && `(${task.comments.length})`}
            </p>
            <div className="space-y-3 mb-3">
              {task.comments?.length === 0 && <p className="text-xs text-slate-400 py-2">No comments yet.</p>}
              {task.comments?.map(c => {
                const author = TEAM_MEMBERS.find(m => m.id === c.userId);
                return (
                  <div key={c.id} className="flex gap-2.5">
                    <Avatar member={author} size={7} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 mb-0.5">
                        <span className="text-xs font-semibold text-slate-800">{author?.name || 'Unknown'}</span>
                        <span className="text-[10px] text-slate-400">{c.at}</span>
                      </div>
                      <p className="text-sm text-slate-600 bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">{c.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-2">
              <input value={commentText} onChange={e => setCommentText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && submitComment()}
                placeholder="Add a comment…"
                className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white placeholder-slate-400" />
              <button onClick={submitComment} disabled={!commentText.trim()}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                Send
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <p className="text-[10px] text-slate-400">Task ID: {task.id} • Created {task.createdAt}</p>
          </div>
        </div>

        {/* footer */}
        <div className="flex-none border-t border-slate-200 px-5 py-3 flex items-center justify-between bg-slate-50">
          {confirmDelete ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-red-600 font-medium">Delete this task?</span>
              <button onClick={() => onDelete(task.id)} className="text-xs font-semibold text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg transition-colors">Yes, delete</button>
              <button onClick={() => setConfirmDelete(false)} className="text-xs text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-200 transition-colors">Cancel</button>
            </div>
          ) : (
            <>
              <button onClick={() => setConfirmDelete(true)} className="text-xs text-red-500 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">🗑 Delete Task</button>
              <button onClick={onEdit} className="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-lg transition-colors">✏ Edit Task</button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
