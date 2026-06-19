import { ROLES } from '../context/AuthContext';

/** Role-based access rules for FinOps 360 Connect */
export const PERMISSIONS = {
  // Master Admin — full access
  canCreateClient: [ROLES.MASTER_ADMIN, ROLES.SALES],
  canCreateTicket: [ROLES.MASTER_ADMIN, ROLES.SALES],
  canPromoteTicket: [ROLES.MASTER_ADMIN, ROLES.SALES, ROLES.ASSOCIATE],
  canManageEmployees: [ROLES.MASTER_ADMIN, ROLES.HR],
  canViewClients: [ROLES.MASTER_ADMIN, ROLES.SALES, ROLES.ASSOCIATE],
  canViewTickets: [ROLES.MASTER_ADMIN, ROLES.SALES, ROLES.ASSOCIATE],
};

export function hasPermission(role, permission) {
  return (PERMISSIONS[permission] || []).includes(role);
}
