import React, { useState, useMemo } from 'react';
import TaskBoard   from './TaskBoard';
import TaskList    from './TaskList';
import TaskDetail  from './TaskDetail';
import TaskForm    from './TaskForm';
import TaskStats   from './TaskStats';
import { MOCK_TASKS, PROJECTS, TEAM_MEMBERS } from './taskData';

function Avatar({ member, size = 7 }) {
  if (!member) return null;
  return (
    <span className={`inline-flex items-center justify-center w-${size} h-${size} rounded-full text-white text-xs font-semibold flex-shrink-0`}
      style={{ background: member.color }} title={member.name}>
      {member.avatar}
    </span>
  );
}

export default function TasksModule({ userRole }) {
  const [tasks,      setTasks]      = useState(MOCK_TASKS);
  const [view,       setView]       = useState('board');
  const [detailTask, setDetailTask] = useState(null);
  const [showForm,   setShowForm]   = useState(false);
  const [editTask,   setEditTask]   = useState(null);

  const [filterProject,  setFilterProject]  = useState('all');
  const [filterAssignee, setFilterAssignee] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus,   setFilterStatus]   = useState('all');
  const [search,         setSearch]         = useState('');

  const filtered = useMemo(() => tasks.filter(t => {
    if (filterProject  !== 'all' && t.projectId !== filterProject)          return false;
    if (filterAssignee !== 'all' && !t.assignees.includes(filterAssignee))  return false;
    if (filterPriority !== 'all' && t.priority  !== filterPriority)         return false;
    if (filterStatus   !== 'all' && t.status    !== filterStatus)           return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase()))    return false;
    return true;
  }), [tasks, filterProject, filterAssignee, filterPriority, filterStatus, search]);

  const counts = useMemo(() => {
    const c = { todo:0, in_progress:0, review:0, done:0 };
    tasks.forEach(t => { if (c[t.status] !== undefined) c[t.status]++; });
    return c;
  }, [tasks]);

  const STATUS_META = {
    todo:        { label:'To Do',       bg:'bg-slate-100',   text:'text-slate-600',   dot:'bg-slate-400'   },
    in_progress: { label:'In Progress', bg:'bg-blue-50',     text:'text-blue-700',    dot:'bg-blue-500'    },
    review:      { label:'In Review',   bg:'bg-amber-50',    text:'text-amber-700',   dot:'bg-amber-400'   },
    done:        { label:'Done',        bg:'bg-emerald-50',  text:'text-emerald-700', dot:'bg-emerald-500' },
  };

  const PRIORITY_META = {
    low:    { label:'Low',    color:'text-slate-500', bg:'bg-slate-100' },
    medium: { label:'Medium', color:'text-blue-600',  bg:'bg-blue-50'   },
    high:   { label:'High',   color:'text-orange-600',bg:'bg-orange-50' },
    urgent: { label:'Urgent', color:'text-red-600',   bg:'bg-red-50'    },
  };

  function saveTask(data) {
    if (data.id) {
      setTasks(prev => prev.map(t => t.id === data.id ? { ...t, ...data } : t));
      if (detailTask?.id === data.id) setDetailTask(dt => ({ ...dt, ...data }));
    } else {
      const neo = { ...data, id:'t'+Date.now(), comments:[], checklist:data.checklist||[], createdAt:new Date().toISOString().slice(0,10) };
      setTasks(prev => [...prev, neo]);
    }
    setShowForm(false); setEditTask(null);
  }

  function moveTask(taskId, newStatus) {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    if (detailTask?.id === taskId) setDetailTask(dt => ({ ...dt, status: newStatus }));
  }

  function deleteTask(taskId) {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    setDetailTask(null);
  }

  function addComment(taskId, text, userId = 'u1') {
    const comment = { id:'c'+Date.now(), userId, text, at:new Date().toLocaleString('en-IN',{year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'}) };
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, comments:[...t.comments, comment] } : t));
    if (detailTask?.id === taskId) setDetailTask(dt => ({ ...dt, comments:[...dt.comments, comment] }));
  }

  function toggleChecklist(taskId, itemId) {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, checklist:t.checklist.map(c => c.id === itemId ? { ...c, done:!c.done } : c) } : t));
    if (detailTask?.id === taskId) setDetailTask(dt => ({ ...dt, checklist:dt.checklist.map(c => c.id === itemId ? { ...c, done:!c.done } : c) }));
  }

  const shared = { tasks:filtered, allTasks:tasks, PROJECTS, TEAM_MEMBERS, STATUS_META, PRIORITY_META, Avatar, onDetail:setDetailTask, onEdit:t => { setEditTask(t); setShowForm(true); }, onMove:moveTask, onDelete:deleteTask };

  const hasFilters = filterProject !== 'all' || filterAssignee !== 'all' || filterPriority !== 'all' || filterStatus !== 'all' || search;

  return (
    <div className="h-full flex flex-col bg-slate-50">

      {/* top bar */}
      <div className="flex-none bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-slate-900">Tasks & Work</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {filtered.length} task{filtered.length !== 1 ? 's' : ''} •&nbsp;
              <span className="text-blue-600 font-medium">{counts.in_progress} in progress</span>&nbsp;•&nbsp;
              <span className="text-amber-600 font-medium">{counts.review} in review</span>
            </p>
          </div>
          <div className="flex items-center bg-slate-100 rounded-lg p-1 gap-0.5">
            {[['board','⊞'],['list','☰'],['stats','▦']].map(([v,icon]) => (
              <button key={v} onClick={() => setView(v)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1 ${view === v ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                <span>{icon}</span><span className="capitalize">{v}</span>
              </button>
            ))}
          </div>
          <button onClick={() => { setEditTask(null); setShowForm(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm">
            <span className="text-base leading-none">+</span> New Task
          </button>
        </div>

        {/* filters */}
        <div className="flex flex-wrap gap-2 mt-3">
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tasks…"
              className="pl-7 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-44" />
          </div>
          <select value={filterProject} onChange={e => setFilterProject(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="all">All Projects</option>
            {PROJECTS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <select value={filterAssignee} onChange={e => setFilterAssignee(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="all">All Assignees</option>
            {TEAM_MEMBERS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
          <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="all">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="review">In Review</option>
            <option value="done">Done</option>
          </select>
          {hasFilters && (
            <button onClick={() => { setFilterProject('all'); setFilterAssignee('all'); setFilterPriority('all'); setFilterStatus('all'); setSearch(''); }}
              className="text-xs text-blue-600 hover:text-blue-800 px-2 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">
              ✕ Clear
            </button>
          )}
        </div>
      </div>

      {/* content */}
      <div className="flex-1 overflow-hidden">
        {view === 'board' && <TaskBoard {...shared} />}
        {view === 'list'  && <TaskList  {...shared} />}
        {view === 'stats' && <TaskStats allTasks={tasks} PROJECTS={PROJECTS} TEAM_MEMBERS={TEAM_MEMBERS} STATUS_META={STATUS_META} PRIORITY_META={PRIORITY_META} />}
      </div>

      {detailTask && (
        <TaskDetail task={detailTask} PROJECTS={PROJECTS} TEAM_MEMBERS={TEAM_MEMBERS} STATUS_META={STATUS_META} PRIORITY_META={PRIORITY_META} Avatar={Avatar}
          onClose={() => setDetailTask(null)} onEdit={() => { setEditTask(detailTask); setShowForm(true); }}
          onMove={moveTask} onDelete={deleteTask} onComment={addComment} onToggleCheck={toggleChecklist} />
      )}

      {showForm && (
        <TaskForm task={editTask} PROJECTS={PROJECTS} TEAM_MEMBERS={TEAM_MEMBERS}
          onSave={saveTask} onClose={() => { setShowForm(false); setEditTask(null); }} />
      )}
    </div>
  );
}
