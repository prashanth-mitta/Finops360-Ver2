/* eslint-disable */
// Scoped mock data per tenant — each partner sees ONLY their own data

export const PARTNER_CLIENTS = {
  p001: [
    { id: 'p001-c1', name: 'TechNova Pvt Ltd',    gstin: '27TECHNO123A1Z1', email: 'accounts@technova.in',  status: 'active',   joinDate: '2024-04-01', services: ['GST', 'ITR', 'Audit'] },
    { id: 'p001-c2', name: 'Bright Traders',       gstin: '27BRIGHT456B2Z2', email: 'finance@brighttr.in',  status: 'active',   joinDate: '2024-05-10', services: ['GST', 'TDS'] },
    { id: 'p001-c3', name: 'Horizon Exports',      gstin: '27HORIZO789C3Z3', email: 'accounts@horizon.in',  status: 'inactive', joinDate: '2024-06-15', services: ['ITR'] },
    { id: 'p001-c4', name: 'Metro Constructions',  gstin: '27METROC012D4Z4', email: 'billing@metro.in',     status: 'active',   joinDate: '2024-07-01', services: ['GST', 'Payroll'] },
  ],
  p002: [
    { id: 'p002-c1', name: 'Sunrise Hotels',       gstin: '36SUNRIS123E1Z1', email: 'accounts@sunrise.in',  status: 'active',   joinDate: '2024-06-01', services: ['GST', 'ITR'] },
    { id: 'p002-c2', name: 'Green Valley Farms',   gstin: '36GREENV456F2Z2', email: 'finance@greenvalley.in',status:'active',   joinDate: '2024-07-15', services: ['ITR', 'TDS'] },
    { id: 'p002-c3', name: 'Pearl Jewellers',      gstin: '36PEARLS789G3Z3', email: 'accounts@pearl.in',    status: 'active',   joinDate: '2024-08-01', services: ['GST', 'Audit'] },
  ],
  p003: [
    { id: 'p003-c1', name: 'Rapid Logistics',      gstin: '06RAPIDL123H1Z1', email: 'accounts@rapid.in',    status: 'active',   joinDate: '2024-09-01', services: ['GST', 'ITR'] },
    { id: 'p003-c2', name: 'Capital Investments',  gstin: '06CAPINV456I2Z2', email: 'finance@capital.in',   status: 'inactive', joinDate: '2024-10-01', services: ['ITR'] },
  ],
};

export const PARTNER_TICKETS = {
  p001: [
    { id: 'p001-t1', clientName: 'TechNova Pvt Ltd',   title: 'GSTR-1 Filing May 2025',        status: 'open',        priority: 'high',   assignee: 'Rohan Shah',   dueDate: '2025-07-11' },
    { id: 'p001-t2', clientName: 'Bright Traders',      title: 'TDS Return Q1 FY26',             status: 'in_progress', priority: 'medium', assignee: 'Rohan Shah',   dueDate: '2025-07-31' },
    { id: 'p001-t3', clientName: 'Metro Constructions', title: 'Payroll Processing June 2025',   status: 'review',      priority: 'urgent', assignee: 'Rohan Shah',   dueDate: '2025-07-05' },
    { id: 'p001-t4', clientName: 'TechNova Pvt Ltd',    title: 'Annual Audit FY2024-25',         status: 'closed',      priority: 'high',   assignee: 'Rohan Shah',   dueDate: '2025-06-30' },
  ],
  p002: [
    { id: 'p002-t1', clientName: 'Sunrise Hotels',      title: 'GSTR-3B Filing June 2025',       status: 'open',        priority: 'urgent', assignee: 'Suresh Kumar', dueDate: '2025-07-20' },
    { id: 'p002-t2', clientName: 'Green Valley Farms',  title: 'ITR Filing FY2024-25',            status: 'in_progress', priority: 'high',   assignee: 'Suresh Kumar', dueDate: '2025-07-31' },
    { id: 'p002-t3', clientName: 'Pearl Jewellers',     title: 'GST Reconciliation May 2025',    status: 'review',      priority: 'medium', assignee: 'Suresh Kumar', dueDate: '2025-07-14' },
  ],
  p003: [
    { id: 'p003-t1', clientName: 'Rapid Logistics',     title: 'GST Filing June 2025',           status: 'open',        priority: 'high',   assignee: 'Deepak Sharma',dueDate: '2025-07-20' },
    { id: 'p003-t2', clientName: 'Capital Investments', title: 'ITR Filing FY2024-25',            status: 'in_progress', priority: 'medium', assignee: 'Deepak Sharma',dueDate: '2025-07-31' },
  ],
};

export const PARTNER_ASSOCIATES = {
  p001: [
    { id: 'p001-a1', name: 'Rohan Shah',     role: 'associate', email: 'assoc@mehtaassociates.in',  joinDate: '2024-03-20', status: 'active', tickets: 12 },
    { id: 'p001-a2', name: 'Nisha Kapoor',   role: 'associate', email: 'nisha@mehtaassociates.in',   joinDate: '2024-04-01', status: 'active', tickets: 9  },
    { id: 'p001-a3', name: 'Amit Joshi',     role: 'associate', email: 'amit@mehtaassociates.in',    joinDate: '2024-05-15', status: 'active', tickets: 7  },
  ],
  p002: [
    { id: 'p002-a1', name: 'Suresh Kumar',   role: 'associate', email: 'assoc@reddytax.in',          joinDate: '2024-06-01', status: 'active', tickets: 8  },
    { id: 'p002-a2', name: 'Lakshmi Rao',    role: 'associate', email: 'lakshmi@reddytax.in',        joinDate: '2024-07-10', status: 'active', tickets: 6  },
  ],
  p003: [
    { id: 'p003-a1', name: 'Rahul Gupta',    role: 'associate', email: 'assoc@sharmaandco.in',       joinDate: '2024-09-01', status: 'active', tickets: 4  },
  ],
};
