import React, { useState, useEffect } from 'react';
import { CATEGORIES } from './taskData';

export default function TaskForm({ task, PROJECTS, TEAM_MEMBERS, onSave, onClose }) {
  const isEdit = !!task;
  const [form, setForm] = useState({ title:'', desc:'', projectId:'', priority:'medium', status:'todo', category:'', assignees:[], dueDate:'', tags:[], checklist:[] });
  const [tagInput, setTagInput]     = useState('');
  const [checkInput, setCheckInput] = useState('');
  const [errors, setErrors]         = useState({});

  useEffect(() => {
    if (task) setForm({ id:task.id, title:task.title||'', desc:task.desc||'', projectId:task.projectId||'', priority:task.priority||'medium', status:task.status||'todo', category:task.category||'', assignees:task.assignees||[], dueDate:task.dueDate||'', tags:task.tags||[], checklist:task.checklist||[] });
  }, [task]);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  function toggleAssignee(id) {
    setForm(f => ({ ...f, assignees: f.assignees.includes(id) ? f.assignees.filter(a => a !== id) : [...f.assignees, id] }));
  }

  function addTag() {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) set('tags', [...form.tags, t]);
    setTagInput('');
  }

  function addCheckItem() {
    const label = checkInput.trim();
    if (!label) return;
    set('checklist', [...form.checklist, { id: 'cl' + Date.now(), label, done: false }]);
    setCheckInput('');
  }

  function validate() {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.dueDate)       e.dueDate = 'Due date is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    onSave(form);
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col pointer-events-auto">

          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
            <h2 className="text-base font-bold text-slate-900">{isEdit ? 'Edit Task' : 'New Task'}</h2>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors text-xl">×</button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Task Title <span className="text-red-500">*</span></label>
              <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. File GSTR-1 for Q1"
                className={`w-full border rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.title ? 'border-red-400' : 'border-slate-200'}`} />
              {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Description</label>
              <textarea value={form.desc} onChange={e => set('desc', e.target.value)} rows={2} placeholder="Brief description…"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Project</label>
                <select value={form.projectId} onChange={e => set('projectId', e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  <option value="">— No Project —</option>
                  {PROJECTS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Category</label>
                <select value={form.category} onChange={e => set('category', e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  <option value="">— Select —</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Priority</label>
                <select value={form.priority} onChange={e => set('priority', e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Status</label>
                <select value={form.status} onChange={e => set('status', e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="review">In Review</option>
                  <option value="done">Done</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Due Date <span className="text-red-500">*</span></label>
              <input type="date" value={form.dueDate} onChange={e => set('dueDate', e.target.value)}
                className={`w-full border rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.dueDate ? 'border-red-400' : 'border-slate-200'}`} />
              {errors.dueDate && <p className="text-xs text-red-500 mt-1">{errors.dueDate}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">Assign To</label>
              <div className="flex flex-wrap gap-2">
                {TEAM_MEMBERS.map(m => {
                  const selected = form.assignees.includes(m.id);
                  return (
                    <button key={m.id} type="button" onClick={() => toggleAssignee(m.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${selected ? 'border-blue-400 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}>
                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold" style={{ background: m.color }}>{m.avatar}</span>
                      {m.name.split(' ')[0]}
                      {selected && <span className="text-blue-500">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Tags</label>
              <div className="flex gap-2">
                <input value={tagInput} onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Add tag, press Enter"
                  className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <button type="button" onClick={addTag} className="px-3 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm hover:bg-slate-200 transition-colors">Add</button>
              </div>
              {form.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {form.tags.map(t => (
                    <span key={t} className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                      {t}<button onClick={() => set('tags', form.tags.filter(x => x !== t))} className="text-blue-400 hover:text-blue-700 ml-0.5">×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Checklist</label>
              <div className="flex gap-2">
                <input value={checkInput} onChange={e => setCheckInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCheckItem())}
                  placeholder="Add item, press Enter"
                  className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <button type="button" onClick={addCheckItem} className="px-3 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm hover:bg-slate-200 transition-colors">Add</button>
              </div>
              {form.checklist.length > 0 && (
                <div className="space-y-1.5 mt-2">
                  {form.checklist.map(item => (
                    <div key={item.id} className="flex items-center gap-2 text-sm text-slate-700 bg-slate-50 rounded-lg px-3 py-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0" />
                      <span className="flex-1">{item.label}</span>
                      <button onClick={() => set('checklist', form.checklist.filter(c => c.id !== item.id))} className="text-slate-300 hover:text-red-400 transition-colors text-lg leading-none">×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex-none border-t border-slate-200 px-6 py-4 flex justify-end gap-3 bg-slate-50">
            <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-200 transition-colors">Cancel</button>
            <button onClick={handleSubmit} className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm">
              {isEdit ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
