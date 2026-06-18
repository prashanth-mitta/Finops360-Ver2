import React, { useState } from 'react';
import { ROLES_ALL } from './notificationData';

const PRIORITY_META = {
  normal: { label: 'Normal', bg: 'bg-slate-100',   text: 'text-slate-600'   },
  high:   { label: 'High',   bg: 'bg-orange-50',   text: 'text-orange-700'  },
  urgent: { label: 'Urgent', bg: 'bg-red-50',      text: 'text-red-700'     },
};

const ROLE_LABELS = {
  master_admin: 'Master Admin', sales: 'Sales', hr: 'HR', associate: 'Associate', client: 'Client',
};

function AnnouncementCard({ ann, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const pm = PRIORITY_META[ann.priority] || PRIORITY_META.normal;
  const expired = ann.expiresAt && new Date(ann.expiresAt) < new Date();
  const isAllRoles = ann.targetRoles.length === ROLES_ALL.length;

  return (
    <div className={`bg-white rounded-xl border transition-all ${expired ? 'border-slate-100 opacity-60' : ann.priority === 'urgent' ? 'border-red-200' : ann.priority === 'high' ? 'border-orange-200' : 'border-slate-200'}`}>
      <div className="p-4 cursor-pointer" onClick={() => setExpanded(e => !e)}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${pm.bg} ${pm.text}`}>{pm.label}</span>
              {expired && <span className="text-[10px] text-slate-400 font-medium">Expired</span>}
              {!expired && ann.expiresAt && (
                <span className="text-[10px] text-slate-400">Expires {new Date(ann.expiresAt).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</span>
              )}
            </div>
            <p className="text-sm font-bold text-slate-800">{ann.title}</p>
            {!expanded && <p className="text-xs text-slate-500 mt-1 line-clamp-1">{ann.body}</p>}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={e => { e.stopPropagation(); onDelete(ann.id); }}
              className="text-xs text-slate-300 hover:text-red-500 transition-colors px-1">✕</button>
            <span className="text-slate-400 text-xs">{expanded ? '▲' : '▼'}</span>
          </div>
        </div>
        {expanded && (
          <div className="mt-3 pt-3 border-t border-slate-100">
            <p className="text-sm text-slate-600 leading-relaxed">{ann.body}</p>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">To:</span>
                <div className="flex gap-1">
                  {isAllRoles
                    ? <span className="text-[10px] px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full font-medium">Everyone</span>
                    : ann.targetRoles.map(r => (
                        <span key={r} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full font-medium">{ROLE_LABELS[r]}</span>
                      ))
                  }
                </div>
              </div>
              <span className="text-[10px] text-slate-400">By {ann.author} • {new Date(ann.createdAt.split(' ')[0]).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AnnouncementForm({ onSave, onClose }) {
  const [form, setForm] = useState({ title:'', body:'', priority:'normal', targetRoles:[...ROLES_ALL], expiresAt:'' });
  const [errors, setErrors] = useState({});
  const set = (k,v) => setForm(f => ({ ...f, [k]: v }));

  function toggleRole(r) {
    setForm(f => ({ ...f, targetRoles: f.targetRoles.includes(r) ? f.targetRoles.filter(x => x !== r) : [...f.targetRoles, r] }));
  }

  function submit() {
    const e = {};
    if (!form.title.trim()) e.title = 'Title required';
    if (!form.body.trim())  e.body  = 'Message required';
    if (form.targetRoles.length === 0) e.roles = 'Select at least one role';
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    onSave({ ...form, id:'a'+Date.now(), author:'Arjun Sharma', createdAt: new Date().toISOString().slice(0,16).replace('T',' ') });
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col pointer-events-auto">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
            <h3 className="text-base font-bold text-slate-900">New Announcement</h3>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:bg-slate-100 rounded-lg text-xl">×</button>
          </div>
          <div className="px-6 py-4 space-y-4 overflow-y-auto max-h-[70vh]">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Title <span className="text-red-500">*</span></label>
              <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Announcement title…"
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.title ? 'border-red-400' : 'border-slate-200'}`} />
              {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Message <span className="text-red-500">*</span></label>
              <textarea value={form.body} onChange={e => set('body', e.target.value)} rows={4} placeholder="Write your announcement…"
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${errors.body ? 'border-red-400' : 'border-slate-200'}`} />
              {errors.body && <p className="text-xs text-red-500 mt-1">{errors.body}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Priority</label>
                <select value={form.priority} onChange={e => set('priority', e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Expires On</label>
                <input type="date" value={form.expiresAt} onChange={e => set('expiresAt', e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">Visible To <span className="text-red-500">*</span></label>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => set('targetRoles', form.targetRoles.length === ROLES_ALL.length ? [] : [...ROLES_ALL])}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${form.targetRoles.length === ROLES_ALL.length ? 'bg-indigo-600 text-white border-indigo-600' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                  Everyone
                </button>
                {ROLES_ALL.map(r => (
                  <button key={r} type="button" onClick={() => toggleRole(r)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${form.targetRoles.includes(r) ? 'bg-blue-50 text-blue-700 border-blue-400' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                    {ROLE_LABELS[r]}
                  </button>
                ))}
              </div>
              {errors.roles && <p className="text-xs text-red-500 mt-1">{errors.roles}</p>}
            </div>
          </div>
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
            <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">Cancel</button>
            <button onClick={submit} className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm">📢 Post Announcement</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default function Announcements({ announcements, setAnnouncements, userRole }) {
  const [showForm, setShowForm] = useState(false);
  const isAdmin = userRole === 'master_admin';

  function addAnnouncement(data) {
    setAnnouncements(prev => [data, ...prev]);
    setShowForm(false);
  }

  function deleteAnn(id) {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  }

  const active  = announcements.filter(a => !a.expiresAt || new Date(a.expiresAt) >= new Date());
  const expired = announcements.filter(a => a.expiresAt  && new Date(a.expiresAt)  < new Date());

  return (
    <div className="h-full flex flex-col">
      <div className="flex-none px-6 py-4 bg-white border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Announcements</h2>
            <p className="text-xs text-slate-400 mt-0.5">{active.length} active • {expired.length} expired</p>
          </div>
          {isAdmin && (
            <button onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm">
              <span>+</span> New Announcement
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
        {active.length > 0 && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Active</p>
            <div className="space-y-3">
              {active.map(a => <AnnouncementCard key={a.id} ann={a} onDelete={isAdmin ? deleteAnn : () => {}} />)}
            </div>
          </div>
        )}
        {expired.length > 0 && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Expired</p>
            <div className="space-y-3">
              {expired.map(a => <AnnouncementCard key={a.id} ann={a} onDelete={isAdmin ? deleteAnn : () => {}} />)}
            </div>
          </div>
        )}
        {announcements.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="text-4xl mb-3">📢</span>
            <p className="text-sm font-semibold text-slate-700">No announcements yet</p>
            <p className="text-xs text-slate-400 mt-1">Post an announcement to notify your team.</p>
          </div>
        )}
      </div>

      {showForm && <AnnouncementForm onSave={addAnnouncement} onClose={() => setShowForm(false)} />}
    </div>
  );
}
