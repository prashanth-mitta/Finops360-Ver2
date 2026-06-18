import React, { useState } from 'react';
import { NOTIF_ICONS, NOTIF_COLORS } from './notificationData';

export default function NotificationFeed({ notifications, onMarkRead, onMarkAllRead, onDelete, onPin, setActivePage }) {
  const [filterType, setFilterType] = useState('all');
  const [filterRead, setFilterRead] = useState('all');

  const types = ['all', 'ticket', 'invoice', 'document', 'task', 'payroll', 'system', 'announcement'];

  const filtered = notifications.filter(n => {
    if (filterType !== 'all' && n.type !== filterType) return false;
    if (filterRead === 'unread' && n.read)  return false;
    if (filterRead === 'read'   && !n.read) return false;
    return true;
  });

  const pinned   = filtered.filter(n => n.pinned);
  const unpinned = filtered.filter(n => !n.pinned);
  const unreadCount = notifications.filter(n => !n.read).length;

  function timeAgo(str) {
    const d = new Date(str.replace(' ', 'T'));
    const diff = Math.floor((Date.now() - d) / 1000);
    if (diff < 60)   return 'Just now';
    if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
    if (diff < 86400)return `${Math.floor(diff/3600)}h ago`;
    return `${Math.floor(diff/86400)}d ago`;
  }

  function NotifCard({ n }) {
    const c = NOTIF_COLORS[n.type] || NOTIF_COLORS.system;
    return (
      <div className={`group relative flex gap-3 p-4 rounded-xl border transition-all cursor-pointer hover:shadow-sm ${n.read ? 'bg-white border-slate-100' : `${c.bg} ${c.border}`}`}
        onClick={() => { onMarkRead(n.id); if (n.linkedModule) setActivePage(n.linkedModule); }}>

        {/* unread dot */}
        {!n.read && <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-blue-500" />}

        {/* pin indicator */}
        {n.pinned && <span className="absolute top-3 right-7 text-[10px] text-amber-500">📌</span>}

        {/* icon */}
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-lg ${n.read ? 'bg-slate-100' : c.bg} border ${n.read ? 'border-slate-200' : c.border}`}>
          {NOTIF_ICONS[n.type]}
        </div>

        {/* content */}
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold leading-snug ${n.read ? 'text-slate-600' : 'text-slate-900'}`}>{n.title}</p>
          <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.body}</p>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-[10px] text-slate-400">{timeAgo(n.createdAt)}</span>
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${c.bg} ${c.text} border ${c.border}`}>{n.type}</span>
            {n.linkedModule && <span className="text-[10px] text-blue-500 hover:text-blue-700">View →</span>}
          </div>
        </div>

        {/* actions on hover */}
        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
          <button onClick={() => onPin(n.id)} title={n.pinned ? 'Unpin' : 'Pin'}
            className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-200 text-slate-400 hover:text-amber-500 text-xs transition-colors">
            📌
          </button>
          {!n.read && (
            <button onClick={() => onMarkRead(n.id)} title="Mark read"
              className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-200 text-slate-400 hover:text-blue-600 text-xs transition-colors">
              ✓
            </button>
          )}
          <button onClick={() => onDelete(n.id)} title="Delete"
            className="w-6 h-6 flex items-center justify-center rounded hover:bg-red-50 text-slate-300 hover:text-red-500 text-xs transition-colors">
            ✕
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* toolbar */}
      <div className="flex-none px-6 py-4 bg-white border-b border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Notification Feed</h2>
            <p className="text-xs text-slate-400 mt-0.5">{unreadCount} unread • {notifications.length} total</p>
          </div>
          {unreadCount > 0 && (
            <button onClick={onMarkAllRead}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">
              ✓ Mark all read
            </button>
          )}
        </div>

        {/* filters */}
        <div className="flex gap-2 flex-wrap">
          <div className="flex bg-slate-100 rounded-lg p-0.5 gap-0.5">
            {['all','unread','read'].map(f => (
              <button key={f} onClick={() => setFilterRead(f)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all capitalize ${filterRead === f ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                {f}
              </button>
            ))}
          </div>
          <select value={filterType} onChange={e => setFilterType(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 capitalize">
            {types.map(t => <option key={t} value={t} className="capitalize">{t === 'all' ? 'All Types' : t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
          </select>
        </div>
      </div>

      {/* list */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {pinned.length > 0 && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1">📌 Pinned</p>
            <div className="space-y-2">{pinned.map(n => <NotifCard key={n.id} n={n} />)}</div>
          </div>
        )}
        {unpinned.length > 0 && (
          <div>
            {pinned.length > 0 && <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Recent</p>}
            <div className="space-y-2">{unpinned.map(n => <NotifCard key={n.id} n={n} />)}</div>
          </div>
        )}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="text-4xl mb-3">🔔</span>
            <p className="text-sm font-semibold text-slate-700">All clear!</p>
            <p className="text-xs text-slate-400 mt-1">No notifications match your filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
