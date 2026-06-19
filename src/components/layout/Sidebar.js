/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useAuth, ROLES } from '../../context/AuthContext';

const NAV_ITEMS = {
  [ROLES.MASTER_ADMIN]: [
    { id: 'dashboard',     label: 'Dashboard',     icon: '🏠' },
    { id: 'clients',       label: 'Clients',       icon: '👥' },
    { id: 'tickets',       label: 'Tickets',       icon: '🎫' },
    { id: 'tasks',         label: 'Tasks',         icon: '✅' },
    { id: 'documents',     label: 'Documents',     icon: '📁' },
    { id: 'invoices',      label: 'Invoices',      icon: '🧾' },
    { id: 'associates',    label: 'Associates',    icon: '👔' },
    { id: 'reports',       label: 'Reports',       icon: '📊' },
    { id: 'compliance',    label: 'Compliance',    icon: '🛡️' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'partners',      label: 'Partners',      icon: '🏢' },
    { id: 'settings',      label: 'Settings',      icon: '⚙️' },
  ],
  [ROLES.SALES]: [
    { id: 'dashboard',     label: 'Dashboard',     icon: '🏠' },
    { id: 'clients',       label: 'Clients',       icon: '👥' },
    { id: 'tickets',       label: 'Tickets',       icon: '🎫' },
    { id: 'tasks',         label: 'Tasks',         icon: '✅' },
    { id: 'documents',     label: 'Documents',     icon: '📁' },
    { id: 'invoices',      label: 'Invoices',      icon: '🧾' },
    { id: 'reports',       label: 'Reports',       icon: '📊' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
  ],
  [ROLES.HR]: [
    { id: 'dashboard',     label: 'Dashboard',     icon: '🏠' },
    { id: 'associates',    label: 'Team',          icon: '👔' },
    { id: 'documents',     label: 'Documents',     icon: '📁' },
    { id: 'compliance',    label: 'Compliance',    icon: '🛡️' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
  ],
  [ROLES.ASSOCIATE]: [
    { id: 'dashboard',     label: 'Dashboard',     icon: '🏠' },
    { id: 'tickets',       label: 'My Tickets',    icon: '🎫' },
    { id: 'tasks',         label: 'My Tasks',      icon: '✅' },
    { id: 'documents',     label: 'Documents',     icon: '📁' },
    { id: 'invoices',      label: 'Invoices',      icon: '🧾' },
    { id: 'clients',       label: 'Clients',       icon: '👥' },
    { id: 'reports',       label: 'Reports',       icon: '📊' },
    { id: 'compliance',    label: 'Compliance',    icon: '🛡️' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
  ],
  [ROLES.CLIENT]: [
    { id: 'dashboard',     label: 'Dashboard',     icon: '🏠' },
    { id: 'tasks',         label: 'My Tasks',      icon: '✅' },
    { id: 'documents',     label: 'Documents',     icon: '📁' },
    { id: 'messages',      label: 'Messages',      icon: '💬' },
    { id: 'history',       label: 'History',       icon: '📜' },
  ],
};

export default function Sidebar({ activePage, setActivePage }) {
  const { currentUser, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const items = NAV_ITEMS[currentUser?.role] || [];

  return (
    <div className={`${collapsed ? 'w-16' : 'w-56'} bg-slate-900 min-h-screen flex flex-col transition-all duration-200 flex-shrink-0`}>
      <div className="flex items-center justify-between px-4 py-4 border-b border-slate-700">
        {!collapsed && <span className="text-white font-bold text-sm">FinOps <span className="text-indigo-400">360</span></span>}
        <button onClick={() => setCollapsed(!collapsed)} className="text-slate-400 hover:text-white text-lg ml-auto">
          {collapsed ? '→' : '←'}
        </button>
      </div>

      {!collapsed && (
        <div className="px-4 py-3 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
              {currentUser?.avatar}
            </div>
            <div>
              <p className="text-white text-xs font-medium truncate max-w-[120px]">{currentUser?.name}</p>
              <p className="text-slate-400 text-xs">{currentUser?.role}</p>
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 px-2 py-3 space-y-1 overflow-y-auto">
        {items.map(item => (
          <button key={item.id} onClick={() => setActivePage(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              activePage === item.id ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}>
            <span className="text-base">{item.icon}</span>
            {!collapsed && <span className="font-medium">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="px-2 py-3 border-t border-slate-700">
        <button onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
          <span className="text-base">🚪</span>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}
