/* eslint-disable */

export const TASK_PRIORITIES = ['low', 'medium', 'high', 'urgent'];
export const TASK_STATUSES   = ['todo', 'in_progress', 'review', 'done'];

export const TEAM_MEMBERS = [
  { id: 'u1', name: 'Arjun Sharma',    role: 'Associate',    avatar: 'AS', color: '#6366f1' },
  { id: 'u2', name: 'Priya Nair',      role: 'Associate',    avatar: 'PN', color: '#ec4899' },
  { id: 'u3', name: 'Rahul Mehta',     role: 'Sales',        avatar: 'RM', color: '#f59e0b' },
  { id: 'u4', name: 'Sneha Reddy',     role: 'HR',           avatar: 'SR', color: '#10b981' },
  { id: 'u5', name: 'Kiran Patel',     role: 'Associate',    avatar: 'KP', color: '#3b82f6' },
  { id: 'u6', name: 'Divya Krishnan',  role: 'Associate',    avatar: 'DK', color: '#8b5cf6' },
];

export const PROJECTS = [
  { id: 'p1', name: 'Q1 GST Filing',         color: '#6366f1', clientId: 1, client: 'Acme Corp'        },
  { id: 'p2', name: 'Annual Audit FY25',      color: '#ec4899', clientId: 2, client: 'Redwood Tech'     },
  { id: 'p3', name: 'Payroll Revamp',         color: '#f59e0b', clientId: null, client: 'Internal'      },
  { id: 'p4', name: 'ROC Compliance Pack',    color: '#10b981', clientId: 3, client: 'Lighthouse Ltd'   },
  { id: 'p5', name: 'MCA Filing — Jun 25',    color: '#3b82f6', clientId: 4, client: 'Vertex Solutions' },
];

export const CATEGORIES = ['Filing', 'Audit', 'Payroll', 'Compliance', 'Advisory', 'Internal', 'Client Comm'];

export const MOCK_TASKS = [
  {
    id: 't001', projectId: 'p1', title: 'Collect Apr-Jun purchase invoices',
    desc: 'Reach out to client and collect all purchase invoices for Q1.',
    status: 'done', priority: 'high', category: 'Filing',
    assignees: ['u1', 'u2'], dueDate: '2025-07-03', createdAt: '2025-06-20',
    tags: ['GST', 'Client'],
    comments: [
      { id: 'c1', userId: 'u1', text: 'Collected 47 invoices. 3 pending from client.', at: '2025-06-28 10:15' },
      { id: 'c2', userId: 'u2', text: 'All 50 received. Uploading now.', at: '2025-06-29 14:00' },
    ],
    checklist: [
      { id: 'cl1', label: 'Send reminder email to client', done: true },
      { id: 'cl2', label: 'Upload to document vault', done: true },
      { id: 'cl3', label: 'Cross-verify count with client', done: true },
    ],
  },
  {
    id: 't002', projectId: 'p1', title: 'Reconcile GSTR-2B vs purchase register',
    desc: 'Download GSTR-2B from portal and reconcile with books.',
    status: 'in_progress', priority: 'urgent', category: 'Filing',
    assignees: ['u1'], dueDate: '2025-07-10', createdAt: '2025-07-01',
    tags: ['GST', 'Reconciliation'],
    comments: [
      { id: 'c3', userId: 'u1', text: '₹1.2L mismatch found. Investigating.', at: '2025-07-04 11:30' },
    ],
    checklist: [
      { id: 'cl4', label: 'Download GSTR-2B', done: true },
      { id: 'cl5', label: 'Compare with books', done: true },
      { id: 'cl6', label: 'Resolve mismatches', done: false },
      { id: 'cl7', label: 'Prepare reconciliation report', done: false },
    ],
  },
  {
    id: 't003', projectId: 'p1', title: 'File GSTR-1 for Q1',
    desc: 'Prepare and file GSTR-1 after data validation.',
    status: 'todo', priority: 'urgent', category: 'Filing',
    assignees: ['u1', 'u5'], dueDate: '2025-07-11', createdAt: '2025-07-01',
    tags: ['GST'],
    comments: [],
    checklist: [
      { id: 'cl8', label: 'Validate output data', done: false },
      { id: 'cl9', label: 'Prepare GSTR-1 JSON', done: false },
      { id: 'cl10', label: 'Client sign-off', done: false },
      { id: 'cl11', label: 'File on portal', done: false },
    ],
  },
  {
    id: 't004', projectId: 'p2', title: 'Prepare trial balance FY25',
    desc: 'Extract and verify trial balance from Tally.',
    status: 'review', priority: 'high', category: 'Audit',
    assignees: ['u6'], dueDate: '2025-07-08', createdAt: '2025-06-25',
    tags: ['Audit', 'Tally'],
    comments: [
      { id: 'c4', userId: 'u6', text: 'TB ready. Sent for checker review.', at: '2025-07-06 16:45' },
    ],
    checklist: [
      { id: 'cl12', label: 'Export from Tally', done: true },
      { id: 'cl13', label: 'Verify closing balances', done: true },
      { id: 'cl14', label: 'Checker review', done: false },
    ],
  },
  {
    id: 't005', projectId: 'p2', title: 'Fixed assets schedule',
    desc: 'Prepare FA schedule including additions, disposals, and depreciation.',
    status: 'todo', priority: 'medium', category: 'Audit',
    assignees: ['u2', 'u6'], dueDate: '2025-07-15', createdAt: '2025-07-02',
    tags: ['Audit'],
    comments: [],
    checklist: [
      { id: 'cl15', label: 'List all assets', done: false },
      { id: 'cl16', label: 'Apply depreciation rates', done: false },
      { id: 'cl17', label: 'Reconcile with GL', done: false },
    ],
  },
  {
    id: 't006', projectId: 'p3', title: 'Map new salary structure',
    desc: 'Design updated CTC breakup — Basic, HRA, Special Allowance etc.',
    status: 'done', priority: 'medium', category: 'Payroll',
    assignees: ['u4'], dueDate: '2025-06-30', createdAt: '2025-06-18',
    tags: ['Internal', 'Payroll'],
    comments: [
      { id: 'c5', userId: 'u4', text: 'New structure approved by management.', at: '2025-06-28 09:00' },
    ],
    checklist: [
      { id: 'cl18', label: 'Draft salary breakup', done: true },
      { id: 'cl19', label: 'Management approval', done: true },
    ],
  },
  {
    id: 't007', projectId: 'p3', title: 'Update payroll template in Excel',
    desc: 'Reflect new salary structure in the monthly payroll master template.',
    status: 'in_progress', priority: 'medium', category: 'Payroll',
    assignees: ['u4', 'u3'], dueDate: '2025-07-12', createdAt: '2025-07-01',
    tags: ['Internal'],
    comments: [],
    checklist: [
      { id: 'cl20', label: 'Update formula sheet', done: true },
      { id: 'cl21', label: 'Test with sample data', done: false },
      { id: 'cl22', label: 'Final sign-off', done: false },
    ],
  },
  {
    id: 't008', projectId: 'p4', title: 'Draft DIR-3 KYC for all directors',
    desc: 'Collect DIN and KYC documents from all 4 directors.',
    status: 'in_progress', priority: 'high', category: 'Compliance',
    assignees: ['u5'], dueDate: '2025-07-09', createdAt: '2025-06-28',
    tags: ['ROC', 'Compliance'],
    comments: [
      { id: 'c6', userId: 'u5', text: 'Received docs from 3 directors. 1 pending.', at: '2025-07-05 12:00' },
    ],
    checklist: [
      { id: 'cl23', label: 'Director 1 KYC', done: true },
      { id: 'cl24', label: 'Director 2 KYC', done: true },
      { id: 'cl25', label: 'Director 3 KYC', done: true },
      { id: 'cl26', label: 'Director 4 KYC', done: false },
    ],
  },
  {
    id: 't009', projectId: 'p4', title: 'File Form MGT-7 annual return',
    desc: 'Prepare and file annual return for the FY.',
    status: 'todo', priority: 'high', category: 'Compliance',
    assignees: ['u5', 'u1'], dueDate: '2025-07-20', createdAt: '2025-07-03',
    tags: ['ROC', 'MCA'],
    comments: [],
    checklist: [
      { id: 'cl27', label: 'Compile shareholding data', done: false },
      { id: 'cl28', label: 'Prepare MGT-7 draft', done: false },
      { id: 'cl29', label: 'Director certification', done: false },
      { id: 'cl30', label: 'File on MCA portal', done: false },
    ],
  },
  {
    id: 't010', projectId: 'p5', title: 'Prepare financial statements',
    desc: 'BS, P&L, Cash flow for FY25 per Schedule III.',
    status: 'review', priority: 'high', category: 'Filing',
    assignees: ['u2', 'u6'], dueDate: '2025-07-07', createdAt: '2025-06-22',
    tags: ['MCA', 'FinStatements'],
    comments: [
      { id: 'c7', userId: 'u2', text: 'BS and P&L done. CF pending review.', at: '2025-07-04 17:00' },
    ],
    checklist: [
      { id: 'cl31', label: 'Balance Sheet', done: true },
      { id: 'cl32', label: 'P&L Statement', done: true },
      { id: 'cl33', label: 'Cash Flow Statement', done: false },
      { id: 'cl34', label: 'Notes to Accounts', done: false },
    ],
  },
  {
    id: 't011', projectId: 'p5', title: 'Obtain Board resolution for filing',
    desc: 'Draft and get signed board resolution authorising MCA filing.',
    status: 'todo', priority: 'medium', category: 'Compliance',
    assignees: ['u3'], dueDate: '2025-07-14', createdAt: '2025-07-02',
    tags: ['MCA', 'Board'],
    comments: [],
    checklist: [
      { id: 'cl35', label: 'Draft resolution', done: false },
      { id: 'cl36', label: 'Director signatures', done: false },
    ],
  },
  {
    id: 't012', projectId: 'p5', title: 'File AOC-4 on MCA portal',
    desc: 'Attach financial statements and file AOC-4.',
    status: 'todo', priority: 'urgent', category: 'Filing',
    assignees: ['u1', 'u5'], dueDate: '2025-07-18', createdAt: '2025-07-03',
    tags: ['MCA'],
    comments: [],
    checklist: [
      { id: 'cl37', label: 'Attach financials', done: false },
      { id: 'cl38', label: 'DSC signing', done: false },
      { id: 'cl39', label: 'Submit on portal', done: false },
    ],
  },
];
