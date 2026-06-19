/* eslint-disable */

// ── COMPLIANCE CALENDAR ───────────────────────────────────────────────────────
export const COMPLIANCE_CATEGORIES = ['GST', 'Income Tax', 'TDS', 'ROC/MCA', 'Payroll', 'FEMA', 'Labour'];

export const COMPLIANCE_DEADLINES = [
  // ── GST ──────────────────────────────────────────────────────────────────
  { id: 'cd001', category: 'GST',         title: 'GSTR-1 Filing (Monthly)',         description: 'Outward supplies return for June 2025', dueDate: '2025-07-11', status: 'pending',   priority: 'urgent', assignee: 'u1', clientId: 1, client: 'Acme Corp',        recurring: 'monthly'   },
  { id: 'cd002', category: 'GST',         title: 'GSTR-3B Filing (Monthly)',        description: 'Summary return & tax payment for June 2025', dueDate: '2025-07-20', status: 'pending',   priority: 'urgent', assignee: 'u1', clientId: 1, client: 'Acme Corp',        recurring: 'monthly'   },
  { id: 'cd003', category: 'GST',         title: 'GSTR-1 Filing (Monthly)',         description: 'Outward supplies return for June 2025', dueDate: '2025-07-11', status: 'completed', priority: 'urgent', assignee: 'u2', clientId: 2, client: 'Redwood Tech',      recurring: 'monthly'   },
  { id: 'cd004', category: 'GST',         title: 'GSTR-2B Reconciliation',          description: 'Match purchase register with GSTR-2B for June 2025', dueDate: '2025-07-14', status: 'in_progress', priority: 'high', assignee: 'u5', clientId: 3, client: 'Lighthouse Ltd',   recurring: 'monthly'   },
  { id: 'cd005', category: 'GST',         title: 'GSTR-9 Annual Return',            description: 'Annual GST return for FY 2024-25', dueDate: '2025-12-31', status: 'pending',   priority: 'medium', assignee: 'u6', clientId: 4, client: 'Vertex Solutions',   recurring: 'annual'    },

  // ── Income Tax ────────────────────────────────────────────────────────────
  { id: 'cd006', category: 'Income Tax',  title: 'Advance Tax — Q1 Installment',   description: '15% of estimated tax for FY25-26', dueDate: '2025-06-15', status: 'completed', priority: 'high',   assignee: 'u1', clientId: 1, client: 'Acme Corp',        recurring: 'quarterly' },
  { id: 'cd007', category: 'Income Tax',  title: 'Advance Tax — Q2 Installment',   description: '45% of estimated tax for FY25-26', dueDate: '2025-09-15', status: 'pending',   priority: 'high',   assignee: 'u1', clientId: 1, client: 'Acme Corp',        recurring: 'quarterly' },
  { id: 'cd008', category: 'Income Tax',  title: 'ITR Filing — Company (FY24-25)', description: 'Income tax return for FY 2024-25', dueDate: '2025-10-31', status: 'pending',   priority: 'high',   assignee: 'u6', clientId: 2, client: 'Redwood Tech',      recurring: 'annual'    },
  { id: 'cd009', category: 'Income Tax',  title: 'ITR Filing — Company (FY24-25)', description: 'Income tax return for FY 2024-25', dueDate: '2025-10-31', status: 'pending',   priority: 'high',   assignee: 'u2', clientId: 4, client: 'Vertex Solutions',   recurring: 'annual'    },

  // ── TDS ───────────────────────────────────────────────────────────────────
  { id: 'cd010', category: 'TDS',         title: 'TDS Payment — June 2025',         description: 'Deposit TDS deducted during June 2025', dueDate: '2025-07-07', status: 'completed', priority: 'urgent', assignee: 'u5', clientId: 1, client: 'Acme Corp',        recurring: 'monthly'   },
  { id: 'cd011', category: 'TDS',         title: 'TDS Return Q1 — Form 24Q',        description: 'Salary TDS return for Apr-Jun 2025', dueDate: '2025-07-31', status: 'pending',   priority: 'high',   assignee: 'u5', clientId: 2, client: 'Redwood Tech',      recurring: 'quarterly' },
  { id: 'cd012', category: 'TDS',         title: 'TDS Return Q1 — Form 26Q',        description: 'Non-salary TDS return for Apr-Jun 2025', dueDate: '2025-07-31', status: 'pending',   priority: 'high',   assignee: 'u1', clientId: 3, client: 'Lighthouse Ltd',   recurring: 'quarterly' },
  { id: 'cd013', category: 'TDS',         title: 'TDS Certificate — Form 16',       description: 'Issue Form 16 to employees for FY24-25', dueDate: '2025-06-15', status: 'completed', priority: 'high',   assignee: 'u4', clientId: null, client: 'Internal',         recurring: 'annual'    },

  // ── ROC / MCA ─────────────────────────────────────────────────────────────
  { id: 'cd014', category: 'ROC/MCA',     title: 'AOC-4 — Financial Statements',    description: 'File audited financials with MCA for FY24-25', dueDate: '2025-10-29', status: 'in_progress', priority: 'high', assignee: 'u2', clientId: 4, client: 'Vertex Solutions',   recurring: 'annual'    },
  { id: 'cd015', category: 'ROC/MCA',     title: 'MGT-7 — Annual Return',           description: 'File annual return with MCA for FY24-25', dueDate: '2025-11-29', status: 'pending',   priority: 'medium', assignee: 'u5', clientId: 3, client: 'Lighthouse Ltd',   recurring: 'annual'    },
  { id: 'cd016', category: 'ROC/MCA',     title: 'DIR-3 KYC for Directors',         description: 'Director KYC renewal on MCA portal', dueDate: '2025-09-30', status: 'in_progress', priority: 'medium', assignee: 'u5', clientId: 4, client: 'Vertex Solutions',   recurring: 'annual'    },

  // ── Payroll ───────────────────────────────────────────────────────────────
  { id: 'cd017', category: 'Payroll',     title: 'PF Contribution — June 2025',     description: 'Deposit employee & employer PF contribution', dueDate: '2025-07-15', status: 'pending',   priority: 'high',   assignee: 'u4', clientId: null, client: 'Internal',         recurring: 'monthly'   },
  { id: 'cd018', category: 'Payroll',     title: 'ESI Contribution — June 2025',    description: 'Deposit ESI contribution for June 2025', dueDate: '2025-07-15', status: 'pending',   priority: 'high',   assignee: 'u4', clientId: null, client: 'Internal',         recurring: 'monthly'   },
  { id: 'cd019', category: 'Payroll',     title: 'PT Return — Q1 2025',             description: 'Professional Tax return for Apr-Jun 2025', dueDate: '2025-07-20', status: 'pending',   priority: 'medium', assignee: 'u4', clientId: null, client: 'Internal',         recurring: 'quarterly' },
];

// ── AUDIT TRAIL ───────────────────────────────────────────────────────────────
export const AUDIT_ACTIONS = {
  CREATE:  'create',
  UPDATE:  'update',
  DELETE:  'delete',
  LOGIN:   'login',
  LOGOUT:  'logout',
  APPROVE: 'approve',
  REJECT:  'reject',
  UPLOAD:  'upload',
  DOWNLOAD:'download',
  SEND:    'send',
  VIEW:    'view',
};

export const AUDIT_MODULES = ['auth','clients','tickets','tasks','documents','invoices','hr','reports','settings','notifications','compliance'];

export const MOCK_AUDIT_LOGS = [
  { id: 'al001', userId: 'u1', userName: 'Arjun Sharma',   role: 'master_admin', action: 'approve',  module: 'tickets',     detail: 'Approved ticket TKT-0039 — ITR Filing, Vertex Solutions',  ip: '49.37.12.88',  at: '2025-07-06 17:45:12' },
  { id: 'al002', userId: 'u2', userName: 'Priya Nair',     role: 'associate',    action: 'upload',   module: 'documents',   detail: 'Uploaded 12 documents to Redwood Tech shared folder',        ip: '103.21.58.11', at: '2025-07-06 16:10:05' },
  { id: 'al003', userId: 'u1', userName: 'Arjun Sharma',   role: 'master_admin', action: 'create',   module: 'invoices',    detail: 'Created invoice INV-2025-051 — ₹32,400 for Vertex Solutions', ip: '49.37.12.88',  at: '2025-07-06 15:30:44' },
  { id: 'al004', userId: 'u5', userName: 'Kiran Patel',    role: 'associate',    action: 'update',   module: 'tasks',       detail: 'Updated task t002 status: todo → in_progress',               ip: '14.99.201.55', at: '2025-07-06 14:22:31' },
  { id: 'al005', userId: 'u3', userName: 'Rahul Mehta',    role: 'sales',        action: 'view',     module: 'clients',     detail: 'Viewed client profile — Acme Corp',                          ip: '27.56.88.201', at: '2025-07-06 13:55:20' },
  { id: 'al006', userId: 'u1', userName: 'Arjun Sharma',   role: 'master_admin', action: 'login',    module: 'auth',        detail: 'Logged in successfully from Hyderabad',                      ip: '49.37.12.88',  at: '2025-07-06 09:01:03' },
  { id: 'al007', userId: 'u6', userName: 'Divya Krishnan', role: 'associate',    action: 'upload',   module: 'documents',   detail: 'Uploaded trial balance FY25 to Document Vault',              ip: '182.71.22.9',  at: '2025-07-06 09:15:47' },
  { id: 'al008', userId: 'u4', userName: 'Sneha Reddy',    role: 'hr',           action: 'update',   module: 'hr',          detail: 'Updated payroll record for Kiran Patel — June 2025',         ip: '117.55.9.33',  at: '2025-07-05 17:30:00' },
  { id: 'al009', userId: 'u1', userName: 'Arjun Sharma',   role: 'master_admin', action: 'send',     module: 'invoices',    detail: 'Sent invoice INV-2025-047 reminder to Acme Corp',            ip: '49.37.12.88',  at: '2025-07-05 16:00:11' },
  { id: 'al010', userId: 'u2', userName: 'Priya Nair',     role: 'associate',    action: 'update',   module: 'tickets',     detail: 'Moved ticket TKT-0042 to Review stage',                      ip: '103.21.58.11', at: '2025-07-05 15:45:22' },
  { id: 'al011', userId: 'u5', userName: 'Kiran Patel',    role: 'associate',    action: 'create',   module: 'tickets',     detail: 'Created ticket TKT-0043 for Redwood Tech',                   ip: '14.99.201.55', at: '2025-07-05 14:10:33' },
  { id: 'al012', userId: 'u3', userName: 'Rahul Mehta',    role: 'sales',        action: 'create',   module: 'clients',     detail: 'Onboarded new client — Lighthouse Ltd',                      ip: '27.56.88.201', at: '2025-07-05 11:30:05' },
  { id: 'al013', userId: 'u1', userName: 'Arjun Sharma',   role: 'master_admin', action: 'approve',  module: 'invoices',    detail: 'Marked INV-2025-044 as paid — ₹18,290 received',             ip: '49.37.12.88',  at: '2025-07-05 14:21:08' },
  { id: 'al014', userId: 'u6', userName: 'Divya Krishnan', role: 'associate',    action: 'create',   module: 'tasks',       detail: 'Created task: Prepare trial balance FY25',                   ip: '182.71.22.9',  at: '2025-07-04 10:45:00' },
  { id: 'al015', userId: 'u4', userName: 'Sneha Reddy',    role: 'hr',           action: 'update',   module: 'compliance',  detail: 'Marked TDS Payment June 2025 as completed',                  ip: '117.55.9.33',  at: '2025-07-04 09:00:55' },
  { id: 'al016', userId: 'u1', userName: 'Arjun Sharma',   role: 'master_admin', action: 'update',   module: 'settings',    detail: 'Updated firm profile — added new bank account details',      ip: '49.37.12.88',  at: '2025-07-03 17:15:00' },
  { id: 'al017', userId: 'u2', userName: 'Priya Nair',     role: 'associate',    action: 'download', module: 'documents',   detail: 'Downloaded GSTR-2B reconciliation report — Acme Corp',      ip: '103.21.58.11', at: '2025-07-03 15:00:44' },
  { id: 'al018', userId: 'u5', userName: 'Kiran Patel',    role: 'associate',    action: 'update',   module: 'compliance',  detail: 'Updated GSTR-1 deadline status to in_progress',              ip: '14.99.201.55', at: '2025-07-03 13:22:10' },
  { id: 'al019', userId: 'u3', userName: 'Rahul Mehta',    role: 'sales',        action: 'login',    module: 'auth',        detail: 'Logged in successfully from Mumbai',                         ip: '27.56.88.201', at: '2025-07-03 09:05:00' },
  { id: 'al020', userId: 'u1', userName: 'Arjun Sharma',   role: 'master_admin', action: 'delete',   module: 'documents',   detail: 'Deleted duplicate document — old_MOU_draft.pdf',             ip: '49.37.12.88',  at: '2025-07-02 16:45:00' },
];

export const TEAM_MEMBERS_MAP = {
  u1: { name: 'Arjun Sharma',    avatar: 'AS', color: '#6366f1' },
  u2: { name: 'Priya Nair',      avatar: 'PN', color: '#ec4899' },
  u3: { name: 'Rahul Mehta',     avatar: 'RM', color: '#f59e0b' },
  u4: { name: 'Sneha Reddy',     avatar: 'SR', color: '#10b981' },
  u5: { name: 'Kiran Patel',     avatar: 'KP', color: '#3b82f6' },
  u6: { name: 'Divya Krishnan',  avatar: 'DK', color: '#8b5cf6' },
};
