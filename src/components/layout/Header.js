/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHeaderNotifications } from '../../services/finops';

const PAGE_TITLES = {
  dashboard: 'Dashboard', clients: 'Client Management', tickets: 'Tickets',
  documents: 'Document Management', associates: 'HR & Associates', reports: 'Reports & Analytics',
  settings: 'Settings', tasks: 'My Tasks', messages: 'Messages', history: 'History',
};

export default function Header({ activePage }) {
  const { currentUser } = useAuth();
  const NOTIFICATIONS = useHeaderNotifications();
  const [showNotifs, setShowNotifs] = useState(false);
  const unread = NOTIFICATIONS.filter(n => !n.read).length;

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
      <div>
        <h1 className="text-lg font-semibold text-gray-800">{PAGE_TITLES[activePage] || activePage}</h1>
        <p className="text-xs text-gray-400">FinOps 360 Connect</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <button onClick={() => setShowNotifs(!showNotifs)} className="relative p-2 text-gray-500 hover:text-gray-700">
            🔔
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unread}
              </span>
            )}
          </button>
          {showNotifs && (
            <div className="absolute right-0 top-10 w-72 bg-white rounded-xl border border-gray-200 shadow-lg z-20 py-2">
              {NOTIFICATIONS.map(n => (
                <div key={n.id} className={`px-4 py-2.5 text-sm ${!n.read ? 'bg-indigo-50' : ''}`}>
                  <p className="text-gray-800">{n.text}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
          {currentUser?.avatar}
        </div>
      </div>
    </header>
  );
}
