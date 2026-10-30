import { ROLES } from '../context/AuthContext';

/** Role-based access rules for FinOps 360 Connect */
export const PERMISSIONS = {
  canCreateClient: [ROLES.SUPER_ADMIN, ROLES.MASTER_ADMIN, ROLES.SALES],
  canCreateTicket: [ROLES.SUPER_ADMIN, ROLES.MASTER_ADMIN, ROLES.SALES],
  canPromoteTicket: [ROLES.SUPER_ADMIN, ROLES.MASTER_ADMIN, ROLES.SALES, ROLES.ASSOCIATE],
  canManageEmployees: [ROLES.SUPER_ADMIN, ROLES.MASTER_ADMIN, ROLES.HR],
  canManageUsers: [ROLES.SUPER_ADMIN, ROLES.MASTER_ADMIN],
  canViewClients: [ROLES.SUPER_ADMIN, ROLES.MASTER_ADMIN, ROLES.SALES, ROLES.ASSOCIATE],
  canViewTickets: [ROLES.SUPER_ADMIN, ROLES.MASTER_ADMIN, ROLES.SALES, ROLES.ASSOCIATE],
};

export function hasPermission(role, permission) {
  if (role === ROLES.SUPER_ADMIN) return true;
  return (PERMISSIONS[permission] || []).includes(role);
}
