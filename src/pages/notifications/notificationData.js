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

export const MOCK_NOTIFICATIONS = [];

export const MOCK_ANNOUNCEMENTS = [];

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

export const COMM_LOG = [];
