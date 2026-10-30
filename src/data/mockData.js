/* eslint-disable no-unused-vars */
export const CLIENTS = [];

export const TICKETS = [];

export const TEAM = [];

export const NOTIFICATIONS = [];

export const TICKET_TYPES = [
  'GST Filing', 'ITR Filing', 'TDS Filing', 'Bookkeeping', 'Payroll Processing',
  'Tax Audit (3CD)', 'Statutory Audit', 'ROC Filing', 'GST Reconciliation',
];

export const DOC_CHECKLISTS = {
  'GST Filing': [
    'Sales register / invoices', 'Purchase register / bills', 'Bank statements',
    'Credit / debit notes', 'E-way bills summary', 'Previous GSTR-3B copy',
  ],
  'ITR Filing': [
    'Form 16 / salary slips', 'Bank statements', 'Investment proofs (80C, 80D)',
    'Capital gains statements', 'Previous ITR copy', 'Aadhaar & PAN',
  ],
  'TDS Filing': [
    'TDS deduction details', 'Challan copies', 'Employee / vendor PAN list',
    'Salary register', 'Previous TDS return', 'Form 16A copies',
  ],
  'Bookkeeping': [
    'Bank statements', 'Sales & purchase invoices', 'Expense vouchers',
    'Petty cash register', 'Fixed asset register',
  ],
  'Payroll Processing': [
    'Employee master', 'Attendance sheet', 'Salary structure', 'PF / ESI details',
    'Reimbursement claims', 'Previous month payroll',
  ],
  'Tax Audit (3CD)': [
    'Trial balance', 'Financial statements', 'Fixed asset schedule',
    'Loan statements', 'Related party disclosures',
  ],
  'Statutory Audit': [
    'Trial balance', 'Bank confirmations', 'Inventory statements',
    'Debtor / creditor confirmations', 'Board resolutions',
  ],
  'ROC Filing': [
    'Board meeting minutes', 'Director KYC (DIR-3)', 'Shareholding pattern',
    'Financial statements', 'Auditor report',
  ],
  'GST Reconciliation': [
    'GSTR-2B download', 'Purchase register', 'ITC mismatch report',
    'Credit note register', 'Previous reconciliation sheet',
  ],
};
