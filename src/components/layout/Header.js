/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTenant } from '../../context/TenantContext';
import { isMasterTenant } from '../../lib/tenant';
import { useHeaderNotifications } from '../../services/finops';

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  clients: 'Client Management',
  tickets: 'Tickets',
  documents: 'Document Management',
  associates: 'HR & Associates',
  reports: 'Reports & Analytics',
  settings: 'Settings',
  tasks: 'My Tasks',
  messages: 'Messages',
  history: 'History',
  invoices: 'Invoices',
  notifications: 'Notifications',
  compliance: 'Compliance',
  partners: 'Partners',
};

export default function Header({ activePage, onMobileMenuOpen }) {
  const { currentUser } = useAuth();
  const { activeTenant } = useTenant();
  const NOTIFICATIONS = useHeaderNotifications();
  const [showNotifs, setShowNotifs] = useState(false);
  const unread = NOTIFICATIONS.filter((n) => !n.read).length;
  const branded = !isMasterTenant(activeTenant);
  const subtitle = branded
    ? `${activeTenant?.firmName || 'Partner'} • Powered by FinOps 360`
    : 'FinOps 360 Connect';

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onMobileMenuOpen}
          className="lg:hidden p-2 -ml-1 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>
        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-semibold text-gray-800 truncate">
            {PAGE_TITLES[activePage] || activePage}
          </h1>
          <p className="text-xs text-gray-400 hidden sm:block">{subtitle}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-50"
            aria-label="Notifications"
          >
            🔔
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unread}
              </span>
            )}
          </button>
          {showNotifs && (
            <div className="absolute right-0 top-10 w-[min(18rem,calc(100vw-2rem))] bg-white rounded-xl border border-gray-200 shadow-lg z-20 py-2 max-h-80 overflow-y-auto">
              {NOTIFICATIONS.map((n) => (
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
