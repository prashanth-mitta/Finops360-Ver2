import React, { useMemo } from 'react';

function StatCard({ label, value, sub, accent = 'blue' }) {
  const colors = { blue:'bg-blue-50 text-blue-700 border-blue-100', emerald:'bg-emerald-50 text-emerald-700 border-emerald-100', amber:'bg-amber-50 text-amber-700 border-amber-100', red:'bg-red-50 text-red-600 border-red-100', slate:'bg-slate-50 text-slate-700 border-slate-200' };
  return (
    <div className={`rounded-xl border p-4 ${colors[accent]}`}>
      <p className="text-xs font-semibold uppercase tracking-wide opacity-70">{label}</p>
      <p className="text-3xl font-black mt-1">{value}</p>
      {sub && <p className="text-xs mt-0.5 opacity-60">{sub}</p>}
    </div>
  );
}

export default function TaskStats({ allTasks, PROJECTS, TEAM_MEMBERS, STATUS_META, PRIORITY_META }) {
  const stats = useMemo(() => {
    const total   = allTasks.length;
    const done    = allTasks.filter(t => t.status === 'done').length;
    const inProg  = allTasks.filter(t => t.status === 'in_progress').length;
    const review  = allTasks.filter(t => t.status === 'review').length;
    const todo    = allTasks.filter(t => t.status === 'todo').length;
    const overdue = allTasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done').length;
    const urgent  = allTasks.filter(t => t.priority === 'urgent' && t.status !== 'done').length;

    const byProject = PROJECTS.map(p => {
      const pts = allTasks.filter(t => t.projectId === p.id);
      return { ...p, total: pts.length, done: pts.filter(t => t.status === 'done').length };
    }).filter(p => p.total > 0).sort((a, b) => b.total - a.total);

    const byMember = TEAM_MEMBERS.map(m => {
      const mts = allTasks.filter(t => t.assignees.includes(m.id));
      return { ...m, total: mts.length, done: mts.filter(t => t.status === 'done').length, overdue: mts.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done').length };
    }).filter(m => m.total > 0).sort((a, b) => b.total - a.total);

    const byPriority = ['urgent','high','medium','low'].map(p => ({ priority: p, count: allTasks.filter(t => t.priority === p && t.status !== 'done').length })).filter(p => p.count > 0);

    const today = new Date(); const week = new Date(); week.setDate(today.getDate() + 7);
    const dueSoon = allTasks.filter(t => { if (t.status === 'done') return false; const d = new Date(t.dueDate); return d >= today && d <= week; }).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    return { total, done, inProg, review, todo, overdue, urgent, byProject, byMember, byPriority, dueSoon };
  }, [allTasks, PROJECTS, TEAM_MEMBERS]);

  const maxMember = Math.max(...stats.byMember.map(m => m.total), 1);

  return (
    <div className="h-full overflow-auto p-4 space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total Tasks"  value={stats.total}   sub={`${stats.done} completed`}        accent="slate"   />
        <StatCard label="In Progress"  value={stats.inProg}  sub={`${stats.review} in review`}       accent="blue"    />
        <StatCard label="Overdue"       value={stats.overdue} sub="Need immediate attention"          accent="red"     />
        <StatCard label="Urgent Open"   value={stats.urgent}  sub="Urgent tasks remaining"            accent="amber"   />
      </div>

      {/* completion bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-bold text-slate-800">Overall Completion</p>
          <span className="text-sm font-bold text-slate-700">{stats.total ? Math.round(stats.done/stats.total*100) : 0}%</span>
        </div>
        <div className="flex h-3 rounded-full overflow-hidden">
          {[{key:'done',w:stats.done,color:'#10b981'},{key:'review',w:stats.review,color:'#f59e0b'},{key:'in_progress',w:stats.inProg,color:'#3b82f6'},{key:'todo',w:stats.todo,color:'#cbd5e1'}].filter(s=>s.w>0).map(s => (
            <div key={s.key} className="h-full" title={`${s.key}: ${s.w}`} style={{ width:`${stats.total ? s.w/stats.total*100 : 0}%`, background:s.color }} />
          ))}
        </div>
        <div className="flex gap-4 mt-2">
          {[{color:'#10b981',label:'Done',count:stats.done},{color:'#f59e0b',label:'In Review',count:stats.review},{color:'#3b82f6',label:'In Progress',count:stats.inProg},{color:'#cbd5e1',label:'To Do',count:stats.todo}].map(s => (
            <div key={s.label} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background:s.color }} />
              <span className="text-xs text-slate-500">{s.label} ({s.count})</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* by project */}
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-sm font-bold text-slate-800 mb-3">Tasks by Project</p>
          <div className="space-y-3">
            {stats.byProject.map(p => (
              <div key={p.id}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background:p.color }} />
                    <span className="text-xs font-medium text-slate-700 truncate max-w-[160px]">{p.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{p.done}/{p.total} done</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width:`${p.total ? p.done/p.total*100 : 0}%`, background:p.color }} />
                </div>
              </div>
            ))}
            {stats.byProject.length === 0 && <p className="text-xs text-slate-400">No project data</p>}
          </div>
        </div>

        {/* by member */}
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-sm font-bold text-slate-800 mb-3">Workload by Member</p>
          <div className="space-y-2.5">
            {stats.byMember.map(m => (
              <div key={m.id} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0" style={{ background:m.color }}>{m.avatar}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-medium text-slate-700 truncate">{m.name}</span>
                    <span className="text-[10px] text-slate-400 flex-shrink-0 ml-2">{m.total} tasks {m.overdue > 0 && <span className="text-red-500">• {m.overdue} overdue</span>}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width:`${maxMember ? m.total/maxMember*100 : 0}%`, background:m.color }} />
                  </div>
                </div>
              </div>
            ))}
            {stats.byMember.length === 0 && <p className="text-xs text-slate-400">No assignments</p>}
          </div>
        </div>

        {/* due soon */}
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-sm font-bold text-slate-800 mb-3">Due in Next 7 Days</p>
          {stats.dueSoon.length === 0 ? (
            <div className="text-center py-6"><span className="text-2xl">🎉</span><p className="text-xs text-slate-400 mt-1">Nothing due this week!</p></div>
          ) : (
            <div className="space-y-2">
              {stats.dueSoon.slice(0,6).map(t => {
                const pm = PRIORITY_META[t.priority] || {};
                const days = Math.ceil((new Date(t.dueDate) - new Date()) / 86400000);
                return (
                  <div key={t.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate">{t.title}</p>
                      <p className="text-[10px] text-slate-400">{t.category}</p>
                    </div>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${pm.bg} ${pm.color}`}>{pm.label}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${days <= 2 ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-500'}`}>
                      {days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : `${days}d`}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* open by priority */}
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-sm font-bold text-slate-800 mb-3">Open Tasks by Priority</p>
          {stats.byPriority.length === 0 ? (
            <div className="text-center py-6"><span className="text-2xl">✅</span><p className="text-xs text-slate-400 mt-1">All caught up!</p></div>
          ) : (
            <div className="space-y-3">
              {stats.byPriority.map(p => {
                const pm = PRIORITY_META[p.priority] || {};
                const maxP = Math.max(...stats.byPriority.map(x => x.count), 1);
                const colors = { urgent:'#ef4444', high:'#f97316', medium:'#3b82f6', low:'#94a3b8' };
                return (
                  <div key={p.priority} className="flex items-center gap-3">
                    <span className={`text-xs font-semibold w-14 ${pm.color}`}>{pm.label}</span>
                    <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width:`${p.count/maxP*100}%`, background:colors[p.priority] }} />
                    </div>
                    <span className="text-xs font-bold text-slate-700 w-5 text-right">{p.count}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
