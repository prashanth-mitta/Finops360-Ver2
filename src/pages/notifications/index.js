import React, { useState, useEffect } from 'react';
import NotificationFeed from './NotificationFeed';
import Announcements    from './Announcements';
import AlertSettings    from './AlertSettings';
import CommLog          from './CommLog';
import { ALERT_SETTINGS_DEFAULT } from './notificationData';
import {
  useNotifications, useAnnouncements, useCommLog,
  setNotificationRead, setNotificationPinned, deleteNotification,
} from '../../services/finops';

const TABS = [
  { id: 'feed',          label: 'Notifications', icon: '🔔' },
  { id: 'announcements', label: 'Announcements', icon: '📢' },
  { id: 'alerts',        label: 'Alert Settings',icon: '⚙️' },
  { id: 'log',           label: 'Comm Log',      icon: '📋' },
];

export default function NotificationsModule({ userRole, setActivePage }) {
  const initialNotifs = useNotifications();
  const initialAnns   = useAnnouncements();
  const commLog       = useCommLog();
  const [tab,           setTab]           = useState('feed');
  const [notifications, setNotifications] = useState(initialNotifs);
  const [announcements, setAnnouncements] = useState(initialAnns);
  const [alertSettings, setAlertSettings] = useState(ALERT_SETTINGS_DEFAULT);

  useEffect(() => { setNotifications(initialNotifs); }, [initialNotifs]);
  useEffect(() => { setAnnouncements(initialAnns); }, [initialAnns]);

  const unreadCount = notifications.filter(n => !n.read).length;

  function markRead(id)    { setNotificationRead(id, true); setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true }       : n)); }
  function markAllRead()   { notifications.forEach(n => !n.read && setNotificationRead(n.id, true)); setNotifications(prev => prev.map(n => ({ ...n, read: true }))); }
  function deleteNotif(id) { deleteNotification(id); setNotifications(prev => prev.filter(n => n.id !== id)); }
  function pinNotif(id)    { const cur = notifications.find(n => n.id === id); setNotificationPinned(id, !cur?.pinned); setNotifications(prev => prev.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n)); }

  return (
    <div className="h-full flex flex-col bg-slate-50">

      {/* header */}
      <div className="flex-none bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Notifications & Comms</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {unreadCount > 0
                ? <span className="text-blue-600 font-semibold">{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</span>
                : 'All caught up — no unread notifications'}
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
              {t.id === 'feed' && unreadCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.5 bg-blue-600 text-white text-[10px] font-bold rounded-full leading-none">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* content */}
      <div className="flex-1 overflow-hidden">
        {tab === 'feed' && (
          <NotificationFeed
            notifications={notifications}
            onMarkRead={markRead}
            onMarkAllRead={markAllRead}
            onDelete={deleteNotif}
            onPin={pinNotif}
            setActivePage={setActivePage}
          />
        )}
        {tab === 'announcements' && (
          <Announcements
            announcements={announcements}
            setAnnouncements={setAnnouncements}
            userRole={userRole}
          />
        )}
        {tab === 'alerts' && (
          <AlertSettings
            settings={alertSettings}
            setSettings={setAlertSettings}
          />
        )}
        {tab === 'log' && (
          <CommLog log={commLog} />
        )}
      </div>
    </div>
  );
}
