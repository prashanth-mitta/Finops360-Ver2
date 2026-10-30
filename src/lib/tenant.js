import { ROLES } from '../context/AuthContext';

export const MASTER_TENANT_ID = 'finops';

/** True when the tenant row is the FinOps master platform (not a partner firm). */
export function isMasterTenant(tenant) {
  return Boolean(tenant?.isMaster || tenant?.tenantId === MASTER_TENANT_ID);
}

/** Only FinOps platform admins manage partner firms. */
export function canManagePartners(user, tenant) {
  if (!user || !tenant) return false;
  if (!isMasterTenant(tenant)) return false;
  return user.role === ROLES.SUPER_ADMIN || user.role === ROLES.MASTER_ADMIN;
}

/** Full admin nav; Partners is hidden for partner-tenant users. */
export function getAdminNav(showPartners) {
  const base = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'clients', label: 'Clients', icon: '👥' },
    { id: 'tickets', label: 'Tickets', icon: '🎫' },
    { id: 'tasks', label: 'Tasks', icon: '✅' },
    { id: 'documents', label: 'Documents', icon: '📁' },
    { id: 'invoices', label: 'Invoices', icon: '🧾' },
    { id: 'associates', label: 'Associates', icon: '👔' },
    { id: 'reports', label: 'Reports', icon: '📊' },
    { id: 'compliance', label: 'Compliance', icon: '🛡️' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'partners', label: 'Partners', icon: '🏢' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];
  return showPartners ? base : base.filter((item) => item.id !== 'partners');
}
