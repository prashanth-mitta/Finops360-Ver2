import React, { useState } from 'react';
import { useTenant, PARTNER_USERS } from '../../context/TenantContext';
import { ROLES } from '../../context/AuthContext';

// ── Scoped nav per role (same as main app but branded) ───────────────────────
const PARTNER_NAV = {
  master_admin: [
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
    { id: 'settings',      label: 'Settings',      icon: '⚙️' },
  ],
  sales: [
    { id: 'dashboard',     label: 'Dashboard',     icon: '🏠' },
    { id: 'clients',       label: 'Clients',       icon: '👥' },
    { id: 'tickets',       label: 'Tickets',       icon: '🎫' },
    { id: 'tasks',         label: 'Tasks',         icon: '✅' },
    { id: 'documents',     label: 'Documents',     icon: '📁' },
    { id: 'invoices',      label: 'Invoices',      icon: '🧾' },
    { id: 'reports',       label: 'Reports',       icon: '📊' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
  ],
  associate: [
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
};

function PartnerLogin({ tenant, onLogin, onBack }) {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');

  function handleLogin() {
    const users = PARTNER_USERS[tenant.tenantId] || [];
    const user  = users.find(u => u.email === email && u.password === password);
    if (user) { setError(''); onLogin(user); }
    else setError('Invalid email or password');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-sm">
        {/* branded card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-md mb-3"
              style={{ background: tenant.primaryColor }}>
              {tenant.logoText}
            </div>
            <h1 className="text-xl font-black text-slate-900">{tenant.firmName}</h1>
            <p className="text-xs text-slate-400 mt-1">{tenant.tagline}</p>
            <p className="text-[10px] text-slate-300 mt-1">Powered by FinOps 360</p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Email</label>
              <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Enter your email"
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 text-slate-800"
                style={{ '--tw-ring-color': tenant.primaryColor }} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Password</label>
              <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Enter password"
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 text-slate-800" />
            </div>
            {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
            <button onClick={handleLogin}
              className="w-full py-2.5 rounded-lg text-sm font-bold text-white transition-colors shadow-sm mt-1"
              style={{ background: tenant.primaryColor }}>
              Sign In to {tenant.firmName}
            </button>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 text-center">
            <p className="text-[10px] text-slate-400 mb-2">Demo credentials:</p>
            {(PARTNER_USERS[tenant.tenantId] || []).map(u => (
              <p key={u.id} className="text-[10px] text-slate-400">{u.email} / {u.password}</p>
            ))}
          </div>
        </div>
        <button onClick={onBack} className="w-full mt-3 text-xs text-slate-400 hover:text-slate-600 py-2 transition-colors">
          ← Back to FinOps 360
        </button>
      </div>
    </div>
  );
}

export default function PartnerAppShell({ partner, onExit }) {
  const [partnerUser, setPartnerUser] = useState(null);
  const [activePage,  setActivePage]  = useState('dashboard');
  const [collapsed,   setCollapsed]   = useState(false);

  if (!partnerUser) {
    return <PartnerLogin tenant={partner} onLogin={setPartnerUser} onBack={onExit} />;
  }

  const navItems = PARTNER_NAV[partnerUser.role] || PARTNER_NAV.associate;

  function renderPage() {
    // Each page shows the partner-scoped ComingSoon for modules not yet scoped
    // In a real implementation each module would receive tenantId and filter accordingly
    return (
      <div className="flex flex-col items-center justify-center h-full py-24 text-center p-6">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 text-white text-2xl font-black"
          style={{ background: partner.primaryColor }}>
          {partner.logoText}
        </div>
        <h2 className="text-lg font-bold text-slate-900 capitalize">{activePage.replace(/-/g, ' ')}</h2>
        <p className="text-slate-400 text-sm mt-2 max-w-sm">
          You are inside <strong>{partner.firmName}</strong>'s portal. This module shows only <strong>{partner.firmName}</strong>'s data — completely isolated from FinOps 360 and other partners.
        </p>
        <div className="mt-4 px-4 py-2 rounded-lg text-xs font-medium text-white" style={{ background: partner.primaryColor }}>
          Tenant: {partner.tenantId} • User: {partnerUser.name} • Role: {partnerUser.role}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen" style={{ background: '#f8fafc' }}>
      {/* branded sidebar */}
      <div className={`${collapsed ? 'w-16' : 'w-56'} min-h-screen flex flex-col transition-all duration-200 flex-shrink-0`}
        style={{ background: '#0f172a' }}>
        {/* logo */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-slate-700">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-black"
                style={{ background: partner.primaryColor }}>{partner.logoText}</div>
              <span className="text-white font-bold text-sm truncate max-w-[100px]">{partner.firmName}</span>
            </div>
          )}
          <button onClick={() => setCollapsed(c => !c)} className="text-slate-400 hover:text-white text-lg ml-auto">
            {collapsed ? '→' : '←'}
          </button>
        </div>

        {/* user */}
        {!collapsed && (
          <div className="px-4 py-3 border-b border-slate-700">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ background: partner.primaryColor }}>{partnerUser.avatar}</div>
              <div>
                <p className="text-white text-xs font-medium truncate max-w-[110px]">{partnerUser.name}</p>
                <p className="text-slate-400 text-[10px] capitalize">{partnerUser.role.replace('_',' ')}</p>
              </div>
            </div>
          </div>
        )}

        {/* nav */}
        <nav className="flex-1 px-2 py-3 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${activePage === item.id ? 'text-white' : 'text-slate-300 hover:text-white'}`}
              style={activePage === item.id ? { background: partner.primaryColor } : {}}>
              <span className="text-base">{item.icon}</span>
              {!collapsed && <span className="font-medium truncate">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* exit + logout */}
        <div className="px-2 py-3 border-t border-slate-700 space-y-1">
          <button onClick={() => setPartnerUser(null)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
            <span>🚪</span>{!collapsed && <span>Logout</span>}
          </button>
          <button onClick={onExit}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-500 hover:bg-slate-800 hover:text-slate-300 transition-colors">
            <span>↩</span>{!collapsed && <span className="text-xs">Exit to FinOps 360</span>}
          </button>
        </div>
      </div>

      {/* main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* branded header */}
        <div className="flex-none bg-white border-b border-slate-200 px-6 py-3 flex items-center gap-3">
          <h2 className="text-sm font-bold capitalize" style={{ color: partner.primaryColor }}>
            {activePage.replace(/-/g,' ')}
          </h2>
          <span className="ml-auto text-[10px] text-slate-400 px-2 py-1 bg-slate-50 rounded-full border border-slate-200">
            {partner.firmName} Portal • {partnerUser.name}
          </span>
        </div>
        <main className="flex-1 overflow-auto">{renderPage()}</main>
      </div>
    </div>
  );
}
