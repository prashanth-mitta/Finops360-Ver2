/* eslint-disable */

export var INVOICE_CLIENTS = [
  { id: 1, name: "Acme Corp", gstin: "29ABCDE1234F1Z5", email: "accounts@acmecorp.in", address: "Plot 12, HITEC City, Hyderabad - 500081", state: "Telangana", stateCode: "36" },
  { id: 2, name: "Redwood Tech", gstin: "27FGHIJ5678K2Z6", email: "finance@redwoodtech.com", address: "Level 4, BKC, Mumbai - 400051", state: "Maharashtra", stateCode: "27" },
  { id: 3, name: "Lighthouse Ltd", gstin: "07KLMNO9012L3Z7", email: "billing@lighthouse.in", address: "Tower B, Cyber Hub, Gurugram - 122002", state: "Haryana", stateCode: "06" },
  { id: 4, name: "Vertex Solutions", gstin: "29PQRST3456U4Z8", email: "accounts@vertex.io", address: "3rd Floor, Prestige, Bengaluru - 560025", state: "Karnataka", stateCode: "29" },
];

export var FIRM = {
  name: "FinOps 360 Consulting LLP",
  gstin: "36FINOP1234A1Z9",
  pan: "FINOP1234A",
  address: "Unit 501, Skyview Tower, Madhapur, Hyderabad - 500081",
  state: "Telangana",
  stateCode: "36",
  email: "billing@finops360.in",
  phone: "+91 98765 00000",
  bankName: "HDFC Bank",
  accountNo: "XXXX XXXX 4521",
  ifsc: "HDFC0001234",
};

export var SERVICE_TEMPLATES = [
  "GST Filing - Monthly",
  "GST Filing - Quarterly",
  "ITR Filing - Individual",
  "ITR Filing - Company",
  "TDS Filing",
  "Bookkeeping - Monthly",
  "Audit Services",
  "ROC Filing",
  "MCA Compliance",
  "Payroll Processing",
  "Consultation - Tax Advisory",
  "Consultation - Business Advisory",
  "Balance Sheet Preparation",
  "P&L Statement",
  "Financial Projections",
];

export var GST_RATES = [0, 5, 12, 18, 28];

export var MOCK_INVOICES = [
  {
    id: "INV-2025-047",
    clientId: 1,
    clientName: "Acme Corp",
    issueDate: "2025-05-30",
    dueDate: "2025-06-14",
    status: "paid",
    paidDate: "2025-06-05",
    items: [
      { desc: "GST Filing - Monthly (Apr 2025)", qty: 1, rate: 3500, gstRate: 18 },
      { desc: "TDS Filing - Q4", qty: 1, rate: 2000, gstRate: 18 },
      { desc: "Bookkeeping - Monthly (Apr 2025)", qty: 1, rate: 5000, gstRate: 18 },
    ],
    notes: "Payment received via NEFT. Thank you for your business.",
    isInterState: false,
  },
  {
    id: "INV-2025-046",
    clientId: 2,
    clientName: "Redwood Tech",
    issueDate: "2025-05-25",
    dueDate: "2025-06-09",
    status: "overdue",
    paidDate: null,
    items: [
      { desc: "ITR Filing - Company FY2024-25", qty: 1, rate: 15000, gstRate: 18 },
      { desc: "Balance Sheet Preparation", qty: 1, rate: 8000, gstRate: 18 },
      { desc: "P&L Statement", qty: 1, rate: 5000, gstRate: 18 },
    ],
    notes: "Please transfer within due date to avoid late fees.",
    isInterState: true,
  },
  {
    id: "INV-2025-045",
    clientId: 3,
    clientName: "Lighthouse Ltd",
    issueDate: "2025-05-20",
    dueDate: "2025-06-04",
    status: "sent",
    paidDate: null,
    items: [
      { desc: "GST Filing - Quarterly (Q4)", qty: 1, rate: 4500, gstRate: 18 },
      { desc: "Payroll Processing - May 2025", qty: 1, rate: 3000, gstRate: 18 },
    ],
    notes: "",
    isInterState: true,
  },
  {
    id: "INV-2025-044",
    clientId: 1,
    clientName: "Acme Corp",
    issueDate: "2025-04-30",
    dueDate: "2025-05-15",
    status: "paid",
    paidDate: "2025-05-10",
    items: [
      { desc: "GST Filing - Monthly (Mar 2025)", qty: 1, rate: 3500, gstRate: 18 },
      { desc: "Bookkeeping - Monthly (Mar 2025)", qty: 1, rate: 5000, gstRate: 18 },
    ],
    notes: "",
    isInterState: false,
  },
  {
    id: "INV-2025-043",
    clientId: 4,
    clientName: "Vertex Solutions",
    issueDate: "2025-04-25",
    dueDate: "2025-05-10",
    status: "paid",
    paidDate: "2025-05-08",
    items: [
      { desc: "Audit Services - FY2024-25", qty: 1, rate: 25000, gstRate: 18 },
      { desc: "ROC Filing", qty: 1, rate: 5000, gstRate: 18 },
    ],
    notes: "",
    isInterState: false,
  },
  {
    id: "INV-2025-042",
    clientId: 2,
    clientName: "Redwood Tech",
    issueDate: "2025-04-20",
    dueDate: "2025-05-05",
    status: "partial",
    paidDate: null,
    paidAmount: 15000,
    items: [
      { desc: "Consultation - Tax Advisory (Q4)", qty: 1, rate: 12000, gstRate: 18 },
      { desc: "MCA Compliance Filing", qty: 1, rate: 8000, gstRate: 18 },
      { desc: "Bookkeeping - Monthly (Mar 2025)", qty: 1, rate: 5000, gstRate: 18 },
    ],
    notes: "Partial payment of Rs. 15,000 received on 01 May 2025.",
    isInterState: true,
  },
  {
    id: "INV-2025-041",
    clientId: 3,
    clientName: "Lighthouse Ltd",
    issueDate: "2025-04-15",
    dueDate: "2025-04-30",
    status: "draft",
    paidDate: null,
    items: [
      { desc: "Financial Projections - FY2026", qty: 1, rate: 20000, gstRate: 18 },
    ],
    notes: "",
    isInterState: true,
  },
];

export function calcInvoiceTotals(items, isInterState) {
  var subtotal = items.reduce(function(sum, item) {
    return sum + (item.qty * item.rate);
  }, 0);

  var totalGst = items.reduce(function(sum, item) {
    return sum + (item.qty * item.rate * item.gstRate / 100);
  }, 0);

  var cgst = isInterState ? 0 : totalGst / 2;
  var sgst = isInterState ? 0 : totalGst / 2;
  var igst = isInterState ? totalGst : 0;
  var total = subtotal + totalGst;

  return { subtotal: subtotal, cgst: cgst, sgst: sgst, igst: igst, totalGst: totalGst, total: total };
}

export function fmtCurrency(n) {
  return "Rs. " + Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function nextInvoiceId(invoices) {
  var nums = invoices.map(function(inv) {
    return parseInt(inv.id.split("-")[2]) || 0;
  });
  var max = Math.max.apply(null, nums);
  var next = max + 1;
  return "INV-2025-0" + (next < 10 ? "0" + next : next);
}
