/* eslint-disable */

export var INVOICE_CLIENTS = [];

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

export var MOCK_INVOICES = [];

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
