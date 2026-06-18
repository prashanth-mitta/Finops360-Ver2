/* eslint-disable */

export const NOTIF_TYPES = {
  TICKET:    'ticket',
  INVOICE:   'invoice',
  DOCUMENT:  'document',
  TASK:      'task',
  PAYROLL:   'payroll',
  SYSTEM:    'system',
  ANNOUNCE:  'announcement',
};

export const NOTIF_ICONS = {
  ticket:       '🎫',
  invoice:      '🧾',
  document:     '📁',
  task:         '✅',
  payroll:      '💰',
  system:       '⚙️',
  announcement: '📢',
};

export const NOTIF_COLORS = {
  ticket:       { bg: 'bg-blue-50',    text: 'text-blue-700',   border: 'border-blue-200'   },
  invoice:      { bg: 'bg-emerald-50', text: 'text-emerald-700',border: 'border-emerald-200'},
  document:     { bg: 'bg-purple-50',  text: 'text-purple-700', border: 'border-purple-200' },
  task:         { bg: 'bg-amber-50',   text: 'text-amber-700',  border: 'border-amber-200'  },
  payroll:      { bg: 'bg-pink-50',    text: 'text-pink-700',   border: 'border-pink-200'   },
  system:       { bg: 'bg-slate-50',   text: 'text-slate-700',  border: 'border-slate-200'  },
  announcement: { bg: 'bg-indigo-50',  text: 'text-indigo-700', border: 'border-indigo-200' },
};

export const ROLES_ALL = ['master_admin', 'sales', 'hr', 'associate', 'client'];

export const MOCK_NOTIFICATIONS = [
  // ── Tickets ─────────────────────────────────────────────────────
  { id: 'n001', type: 'ticket',   title: 'Ticket #TKT-0042 moved to Review',         body: 'GST Filing for Acme Corp has been submitted by Arjun Sharma and is awaiting checker approval.', read: false, pinned: false, createdAt: '2025-07-06 09:15', targetRoles: ['master_admin', 'associate'], linkedId: 'TKT-0042', linkedModule: 'tickets' },
  { id: 'n002', type: 'ticket',   title: 'New ticket raised by Redwood Tech',          body: 'Client has raised a new support ticket: "GSTR-2B mismatch for May 2025". Assigned to Priya Nair.', read: false, pinned: false, createdAt: '2025-07-06 08:30', targetRoles: ['master_admin', 'sales'], linkedId: 'TKT-0043', linkedModule: 'tickets' },
  { id: 'n003', type: 'ticket',   title: 'Ticket #TKT-0039 approved & closed',        body: 'ITR filing for Vertex Solutions has been approved by the checker and marked complete.', read: true,  pinned: false, createdAt: '2025-07-05 17:45', targetRoles: ['master_admin', 'associate', 'client'], linkedId: 'TKT-0039', linkedModule: 'tickets' },

  // ── Invoices ─────────────────────────────────────────────────────
  { id: 'n004', type: 'invoice',  title: 'Invoice INV-2025-047 is overdue',            body: 'Invoice of ₹24,780 sent to Acme Corp on 30 May is now 7 days overdue. Please follow up.', read: false, pinned: true,  createdAt: '2025-07-06 10:00', targetRoles: ['master_admin', 'sales'], linkedId: 'INV-2025-047', linkedModule: 'invoices' },
  { id: 'n005', type: 'invoice',  title: 'Payment received — Lighthouse Ltd',          body: '₹18,290 received from Lighthouse Ltd against Invoice INV-2025-044. Marked as paid.', read: false, pinned: false, createdAt: '2025-07-05 14:20', targetRoles: ['master_admin', 'sales'], linkedId: 'INV-2025-044', linkedModule: 'invoices' },
  { id: 'n006', type: 'invoice',  title: 'New invoice generated for Vertex Solutions', body: 'Invoice INV-2025-051 of ₹32,400 has been created and is ready to send.', read: true,  pinned: false, createdAt: '2025-07-04 11:00', targetRoles: ['master_admin'], linkedId: 'INV-2025-051', linkedModule: 'invoices' },

  // ── Documents ────────────────────────────────────────────────────
  { id: 'n007', type: 'document', title: 'Document pending e-sign: Acme Corp MOU',    body: 'MOU for Acme Corp is awaiting digital signature from the client. Reminder sent automatically.', read: false, pinned: false, createdAt: '2025-07-06 07:00', targetRoles: ['master_admin', 'associate'], linkedId: 'DOC-109', linkedModule: 'documents' },
  { id: 'n008', type: 'document', title: 'Client uploaded 12 new documents',           body: 'Redwood Tech has uploaded 12 documents to the shared folder. Review and categorise.', read: true,  pinned: false, createdAt: '2025-07-05 16:10', targetRoles: ['master_admin', 'associate'], linkedId: 'DOC-FOLDER-RW', linkedModule: 'documents' },

  // ── Tasks ────────────────────────────────────────────────────────
  { id: 'n009', type: 'task',     title: 'Task overdue: File GSTR-1 for Q1',           body: 'Task assigned to Arjun Sharma & Kiran Patel was due on 11 Jul. No update received.', read: false, pinned: true,  createdAt: '2025-07-06 09:00', targetRoles: ['master_admin', 'associate'], linkedId: 't003', linkedModule: 'tasks' },
  { id: 'n010', type: 'task',     title: 'Task completed: Map new salary structure',   body: 'Sneha Reddy has marked the salary structure mapping task as complete. Ready for review.', read: true,  pinned: false, createdAt: '2025-07-05 09:45', targetRoles: ['master_admin', 'hr'], linkedId: 't006', linkedModule: 'tasks' },

  // ── Payroll ──────────────────────────────────────────────────────
  { id: 'n011', type: 'payroll',  title: 'Payroll processing due in 3 days',           body: 'June 2025 payroll for 8 associates is due for processing by 10 July. Please review and approve.', read: false, pinned: false, createdAt: '2025-07-06 08:00', targetRoles: ['master_admin', 'hr'], linkedId: null, linkedModule: null },
  { id: 'n012', type: 'payroll',  title: 'TDS deduction summary ready',                body: 'Monthly TDS summary for June 2025 has been auto-generated. Verify and file by 7th July.', read: true,  pinned: false, createdAt: '2025-07-04 10:30', targetRoles: ['master_admin', 'hr'], linkedId: null, linkedModule: null },

  // ── System ───────────────────────────────────────────────────────
  { id: 'n013', type: 'system',   title: 'Scheduled maintenance — 8 Jul 2:00 AM',      body: 'FinOps 360 Connect will be down for maintenance on 8 July from 2:00 AM to 4:00 AM IST. Please save your work.', read: false, pinned: false, createdAt: '2025-07-05 12:00', targetRoles: ROLES_ALL, linkedId: null, linkedModule: null },
  { id: 'n014', type: 'system',   title: 'Security alert: New login from Bengaluru',   body: 'A new login was detected from Bengaluru (IP 49.37.x.x) on your account. If this was not you, change your password immediately.', read: false, pinned: true,  createdAt: '2025-07-06 06:45', targetRoles: ['master_admin'], linkedId: null, linkedModule: 'settings' },

  // ── Announcements ────────────────────────────────────────────────
  { id: 'n015', type: 'announcement', title: 'Office closed — 9 July (Public Holiday)', body: 'The office will remain closed on 9 July 2025 on account of a public holiday. All deadlines falling on this date are moved to 10 July.', read: false, pinned: false, createdAt: '2025-07-05 10:00', targetRoles: ROLES_ALL, linkedId: null, linkedModule: null },
  { id: 'n016', type: 'announcement', title: 'New feature: Invoice bulk download',      body: 'You can now download multiple invoices as a zip file from the Invoices module. Click the "Bulk Download" button to try it out.', read: true,  pinned: false, createdAt: '2025-07-03 09:00', targetRoles: ROLES_ALL, linkedId: null, linkedModule: null },
  { id: 'n017', type: 'announcement', title: 'Q2 target: 95% on-time filing rate',      body: 'The firm has set a Q2 target of 95% on-time filing rate across all clients. Associates, please ensure timely submissions and flag blockers early.', read: true,  pinned: false, createdAt: '2025-07-01 10:00', targetRoles: ['master_admin', 'associate', 'sales'], linkedId: null, linkedModule: null },
];

export const MOCK_ANNOUNCEMENTS = [
  { id: 'a001', title: 'Office closed — 9 July (Public Holiday)', body: 'The office will remain closed on 9 July 2025 on account of a public holiday. All deadlines falling on this date are moved to 10 July.', priority: 'normal', targetRoles: ROLES_ALL, author: 'Arjun Sharma', createdAt: '2025-07-05 10:00', expiresAt: '2025-07-10' },
  { id: 'a002', title: 'Q2 Target: 95% On-Time Filing Rate',       body: 'The firm has set a Q2 target of 95% on-time filing rate across all clients. Associates, please ensure timely submissions and flag any blockers early to the team lead.', priority: 'high',   targetRoles: ['master_admin','associate','sales'], author: 'Arjun Sharma', createdAt: '2025-07-01 10:00', expiresAt: '2025-09-30' },
  { id: 'a003', title: 'New Feature: Invoice Bulk Download',        body: 'You can now download multiple invoices as a zip file directly from the Invoices module. Select invoices using the checkboxes and click "Bulk Download".', priority: 'normal', targetRoles: ROLES_ALL, author: 'Arjun Sharma', createdAt: '2025-07-03 09:00', expiresAt: '2025-07-31' },
  { id: 'a004', title: 'Mandatory: Update KYC Documents by 15 Jul', body: 'All associates must upload updated KYC documents (Aadhaar + PAN) to the HR portal by 15 July 2025. Non-compliance will affect payroll processing.', priority: 'urgent', targetRoles: ['associate','hr'], author: 'Sneha Reddy', createdAt: '2025-07-04 11:00', expiresAt: '2025-07-15' },
];

export const ALERT_SETTINGS_DEFAULT = {
  ticket_created:    { email: true,  sms: false, inapp: true  },
  ticket_updated:    { email: true,  sms: false, inapp: true  },
  ticket_approved:   { email: true,  sms: true,  inapp: true  },
  invoice_due:       { email: true,  sms: true,  inapp: true  },
  invoice_overdue:   { email: true,  sms: true,  inapp: true  },
  invoice_paid:      { email: true,  sms: false, inapp: true  },
  document_uploaded: { email: false, sms: false, inapp: true  },
  document_esign:    { email: true,  sms: true,  inapp: true  },
  task_due:          { email: true,  sms: false, inapp: true  },
  task_overdue:      { email: true,  sms: true,  inapp: true  },
  payroll_reminder:  { email: true,  sms: true,  inapp: true  },
  announcement:      { email: false, sms: false, inapp: true  },
  system_alert:      { email: true,  sms: false, inapp: true  },
};

export const ALERT_LABELS = {
  ticket_created:    { label: 'Ticket Created',        group: 'Tickets'    },
  ticket_updated:    { label: 'Ticket Updated',        group: 'Tickets'    },
  ticket_approved:   { label: 'Ticket Approved',       group: 'Tickets'    },
  invoice_due:       { label: 'Invoice Due Reminder',  group: 'Invoices'   },
  invoice_overdue:   { label: 'Invoice Overdue',       group: 'Invoices'   },
  invoice_paid:      { label: 'Payment Received',      group: 'Invoices'   },
  document_uploaded: { label: 'Document Uploaded',     group: 'Documents'  },
  document_esign:    { label: 'E-Sign Required',       group: 'Documents'  },
  task_due:          { label: 'Task Due Soon',         group: 'Tasks'      },
  task_overdue:      { label: 'Task Overdue',          group: 'Tasks'      },
  payroll_reminder:  { label: 'Payroll Reminder',      group: 'Payroll'    },
  announcement:      { label: 'Announcements',         group: 'General'    },
  system_alert:      { label: 'System Alerts',         group: 'General'    },
};

export const COMM_LOG = [
  { id: 'l001', channel: 'email', to: 'accounts@acmecorp.in',    subject: 'Invoice INV-2025-047 — Payment Overdue', status: 'delivered', sentAt: '2025-07-06 10:01', trigger: 'invoice_overdue' },
  { id: 'l002', channel: 'sms',   to: '+91 98765 11111',         subject: 'Payment overdue: ₹24,780 — FinOps 360', status: 'delivered', sentAt: '2025-07-06 10:01', trigger: 'invoice_overdue' },
  { id: 'l003', channel: 'email', to: 'arjun@finops360.in',      subject: 'Task overdue: File GSTR-1 for Q1',       status: 'delivered', sentAt: '2025-07-06 09:01', trigger: 'task_overdue'    },
  { id: 'l004', channel: 'email', to: 'finance@redwoodtech.com', subject: 'New ticket raised — TKT-0043',            status: 'delivered', sentAt: '2025-07-06 08:31', trigger: 'ticket_created'  },
  { id: 'l005', channel: 'email', to: 'all@finops360.in',        subject: 'Announcement: Office closed 9 July',     status: 'delivered', sentAt: '2025-07-05 10:01', trigger: 'announcement'    },
  { id: 'l006', channel: 'sms',   to: '+91 98765 22222',         subject: 'Payroll due in 3 days — FinOps 360',     status: 'failed',    sentAt: '2025-07-06 08:01', trigger: 'payroll_reminder'},
  { id: 'l007', channel: 'email', to: 'billing@lighthouse.in',   subject: 'Payment confirmed — INV-2025-044',       status: 'delivered', sentAt: '2025-07-05 14:21', trigger: 'invoice_paid'    },
  { id: 'l008', channel: 'email', to: 'kiran@finops360.in',      subject: 'Task due tomorrow: DIR-3 KYC',           status: 'delivered', sentAt: '2025-07-05 09:00', trigger: 'task_due'        },
  { id: 'l009', channel: 'sms',   to: '+91 98765 33333',         subject: 'E-sign pending: Acme Corp MOU',          status: 'pending',   sentAt: '2025-07-06 07:01', trigger: 'document_esign'  },
  { id: 'l010', channel: 'email', to: 'accounts@vertex.io',      subject: 'Invoice INV-2025-051 — ₹32,400',        status: 'delivered', sentAt: '2025-07-04 11:01', trigger: 'invoice_due'     },
];
