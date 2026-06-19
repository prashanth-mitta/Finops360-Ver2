/* eslint-disable no-unused-vars */
export const CLIENTS = [
  { id: 1, name: 'Acme Corp', gstin: '29ABCDE1234F1Z5', pan: 'ABCDE1234F', contact: 'Rohan Gupta', email: 'rohan@acmecorp.in', phone: '+91 98765 43210', city: 'Hyderabad', status: 'Active', plan: 'Premium', since: '2023-04-01', manager: 'Rahul Mehta' },
  { id: 2, name: 'Redwood Tech', gstin: '27FGHIJ5678K2Z6', pan: 'FGHIJ5678K', contact: 'Sneha Patel', email: 'sneha@redwood.com', phone: '+91 87654 32109', city: 'Mumbai', status: 'Active', plan: 'Standard', since: '2024-01-15', manager: 'Priya Reddy' },
  { id: 3, name: 'Lighthouse Ltd', gstin: '07KLMNO9012L3Z7', pan: 'KLMNO9012L', contact: 'Vikram Joshi', email: 'vikram@lighthouse.in', phone: '+91 76543 21098', city: 'Delhi', status: 'Onboarding', plan: 'Basic', since: '2025-05-01', manager: 'Rahul Mehta' },
];

export const TICKETS = [
  { id: 'TKT-001', client: 'Acme Corp', type: 'GST Filing', priority: 'High', status: 'In Progress', assignee: 'Rahul Mehta', created: '2025-05-20', due: '2025-06-10', stage: 'maker' },
  { id: 'TKT-002', client: 'Redwood Tech', type: 'ITR Filing', priority: 'Medium', status: 'Pending Review', assignee: 'Priya Reddy', created: '2025-05-22', due: '2025-07-31', stage: 'checker' },
  { id: 'TKT-003', client: 'Lighthouse Ltd', type: 'Bookkeeping', priority: 'Low', status: 'Approved', assignee: 'Rahul Mehta', created: '2025-05-18', due: '2025-05-31', stage: 'approved' },
  { id: 'TKT-004', client: 'Acme Corp', type: 'TDS Filing', priority: 'High', status: 'In Progress', assignee: 'Rahul Mehta', created: '2025-05-25', due: '2025-06-07', stage: 'maker' },
];

export const TEAM = [
  { id: 1, name: 'Rahul Mehta', role: 'Associate', email: 'associate@finops360.in', phone: '+91 98765 11111', department: 'Tax', status: 'Active', joined: '2023-06-01', clients: 12, tickets: 8 },
  { id: 2, name: 'Priya Reddy', role: 'Sales', email: 'sales@finops360.in', phone: '+91 98765 22222', department: 'Business Dev', status: 'Active', joined: '2023-08-15', clients: 8, tickets: 3 },
  { id: 3, name: 'Kavya Nair', role: 'HR', email: 'hr@finops360.in', phone: '+91 98765 33333', department: 'HR', status: 'Active', joined: '2023-05-01', clients: 0, tickets: 0 },
  { id: 4, name: 'Amit Singh', role: 'Associate', email: 'amit@finops360.in', phone: '+91 98765 44444', department: 'Audit', status: 'Active', joined: '2024-02-01', clients: 6, tickets: 4 },
];

export const NOTIFICATIONS = [
  { id: 1, text: 'TKT-001 due in 2 days', type: 'warning', time: '1h ago', read: false },
  { id: 2, text: 'New client Lighthouse Ltd onboarded', type: 'success', time: '3h ago', read: false },
  { id: 3, text: 'GST filing approved for Acme Corp', type: 'info', time: '1d ago', read: true },
];
