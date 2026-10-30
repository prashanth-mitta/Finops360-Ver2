/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useAuth, ROLES, roleLabel } from '../../context/AuthContext';
import { useTenant } from '../../context/TenantContext';
import { canManagePartners, getAdminNav, isMasterTenant } from '../../lib/tenant';

const NAV_ITEMS = {
  [ROLES.SALES]: [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'clients', label: 'Clients', icon: '👥' },
    { id: 'tickets', label: 'Tickets', icon: '🎫' },
    { id: 'tasks', label: 'Tasks', icon: '✅' },
    { id: 'documents', label: 'Documents', icon: '📁' },
    { id: 'invoices', label: 'Invoices', icon: '🧾' },
    { id: 'reports', label: 'Reports', icon: '📊' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
  ],
  [ROLES.HR]: [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'associates', label: 'Team', icon: '👔' },
    { id: 'documents', label: 'Documents', icon: '📁' },
    { id: 'compliance', label: 'Compliance', icon: '🛡️' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
  ],
  [ROLES.ASSOCIATE]: [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'tickets', label: 'My Tickets', icon: '🎫' },
    { id: 'tasks', label: 'My Tasks', icon: '✅' },
    { id: 'documents', label: 'Documents', icon: '📁' },
    { id: 'invoices', label: 'Invoices', icon: '🧾' },
    { id: 'clients', label: 'Clients', icon: '👥' },
    { id: 'reports', label: 'Reports', icon: '📊' },
    { id: 'compliance', label: 'Compliance', icon: '🛡️' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
  ],
  [ROLES.CLIENT]: [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'tasks', label: 'My Tasks', icon: '✅' },
    { id: 'documents', label: 'Documents', icon: '📁' },
    { id: 'messages', label: 'Messages', icon: '💬' },
    { id: 'history', label: 'History', icon: '📜' },
  ],
};

function resolveNavItems(role, showPartners) {
  if (role === ROLES.SUPER_ADMIN || role === ROLES.MASTER_ADMIN) {
    return getAdminNav(showPartners);
  }
  return NAV_ITEMS[role] || [];
}

export default function Sidebar({ activePage, setActivePage, mobileOpen, onMobileClose }) {
  const { currentUser, logout } = useAuth();
  const { activeTenant } = useTenant();
  const [collapsed, setCollapsed] = useState(false);
  const showPartners = canManagePartners(currentUser, activeTenant);
  const items = resolveNavItems(currentUser?.role, showPartners);
  const branded = !isMasterTenant(activeTenant);
  const brandColor = activeTenant?.primaryColor || '#6366f1';
  const brandLabel = activeTenant?.firmName || 'FinOps 360';
  const brandLogo = activeTenant?.logoText || 'FO';

  const navigate = (id) => {
    setActivePage(id);
    onMobileClose?.();
  };

  const panel = (
    <div
      className={`${
        collapsed ? 'w-16' : 'w-56'
      } bg-slate-900 h-full flex flex-col transition-all duration-200 flex-shrink-0`}
    >
      <div className="flex items-center justify-between px-4 py-4 border-b border-slate-700">
        {!collapsed && (
          branded ? (
            <div className="flex items-center gap-2 min-w-0">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-black flex-shrink-0"
                style={{ background: brandColor }}
              >
                {brandLogo}
              </div>
              <span className="text-white font-bold text-sm truncate">{brandLabel}</span>
            </div>
          ) : (
            <span className="text-white font-bold text-sm">
              FinOps <span className="text-indigo-400">360</span>
            </span>
          )
        )}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:inline text-slate-400 hover:text-white text-lg ml-auto"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? '→' : '←'}
        </button>
        <button
          type="button"
          onClick={onMobileClose}
          className="lg:hidden text-slate-400 hover:text-white text-lg ml-auto"
          aria-label="Close menu"
        >
          ✕
        </button>
      </div>

      {!collapsed && (
        <div className="px-4 py-3 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${branded ? '' : 'bg-indigo-600'}`}
              style={branded ? { background: brandColor } : undefined}
            >
              {currentUser?.avatar}
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-medium truncate">{currentUser?.name}</p>
              <p className="text-slate-400 text-xs truncate">
                {branded && currentUser?.role === ROLES.MASTER_ADMIN
                  ? 'Firm Admin'
                  : roleLabel(currentUser?.role)}
              </p>
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 px-2 py-3 space-y-1 overflow-y-auto">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => navigate(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              activePage === item.id
                ? 'text-white'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
            style={activePage === item.id ? { background: branded ? brandColor : '#4f46e5' } : undefined}
          >
            <span className="text-base flex-shrink-0">{item.icon}</span>
            {!collapsed && <span className="font-medium truncate">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="px-2 py-3 border-t border-slate-700">
        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <span className="text-base">🚪</span>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          aria-label="Close navigation overlay"
          onClick={onMobileClose}
        />
      )}
      <div
        className={`fixed inset-y-0 left-0 z-50 lg:static lg:z-auto transform transition-transform duration-200 ease-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {panel}
      </div>
    </>
  );
}
