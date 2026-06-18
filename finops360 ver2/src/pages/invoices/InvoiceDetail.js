/* eslint-disable */
import React from "react";

var STATUS_COLOR = {
  paid: "bg-green-100 text-green-700",
  sent: "bg-blue-100 text-blue-700",
  overdue: "bg-red-100 text-red-700",
  partial: "bg-amber-100 text-amber-700",
  draft: "bg-gray-100 text-gray-600",
};
var STATUS_LABEL = { paid: "Paid", sent: "Sent", overdue: "Overdue", partial: "Partial", draft: "Draft" };

function numberToWords(n) {
  var a = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  var b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  n = Math.round(n);
  if (n === 0) return "Zero";
  if (n < 20) return a[n];
  if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "");
  if (n < 1000) return a[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + numberToWords(n % 100) : "");
  if (n < 100000) return numberToWords(Math.floor(n / 1000)) + " Thousand" + (n % 1000 ? " " + numberToWords(n % 1000) : "");
  if (n < 10000000) return numberToWords(Math.floor(n / 100000)) + " Lakh" + (n % 100000 ? " " + numberToWords(n % 100000) : "");
  return numberToWords(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 ? " " + numberToWords(n % 10000000) : "");
}

export default function InvoiceDetail(props) {
  var invoice = props.invoice;
  var onEdit = props.onEdit;
  var onUpdateStatus = props.onUpdateStatus;
  var onBack = props.onBack;
  var data = props.data;
  var userRole = props.userRole;
  var FIRM = data.FIRM;
  var INVOICE_CLIENTS = data.INVOICE_CLIENTS;
  var calc = data.calcInvoiceTotals;
  var fmt = data.fmtCurrency;

  var [showPayModal, setShowPayModal] = React.useState(false);
  var [payAmount, setPayAmount] = React.useState("");
  var [payDate, setPayDate] = React.useState(new Date().toISOString().split("T")[0]);
  var [showSentConfirm, setShowSentConfirm] = React.useState(false);

  var client = INVOICE_CLIENTS.find(function(c) { return c.id === invoice.clientId; });
  var totals = calc(invoice.items, invoice.isInterState);
  var canEdit = userRole !== "Client";
  var canMarkPaid = ["Master Admin", "Associate"].includes(userRole);

  var amountInWords = numberToWords(Math.round(totals.total)) + " Rupees Only";

  var handleMarkPaid = function() {
    var amt = parseFloat(payAmount);
    if (!amt || amt <= 0) return;
    var remaining = totals.total - (invoice.paidAmount || 0);
    if (amt >= remaining) {
      onUpdateStatus(invoice.id, "paid", { paidDate: payDate, paidAmount: totals.total });
    } else {
      onUpdateStatus(invoice.id, "partial", { paidAmount: (invoice.paidAmount || 0) + amt });
    }
    setShowPayModal(false);
    setPayAmount("");
  };

  var handleSend = function() {
    onUpdateStatus(invoice.id, "sent");
    setShowSentConfirm(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Action Bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className={"text-sm px-3 py-1.5 rounded-full font-medium " + STATUS_COLOR[invoice.status]}>
            {STATUS_LABEL[invoice.status]}
          </span>
          {invoice.status === "overdue" && (
            <span className="text-xs text-red-600 font-medium">
              Overdue since {new Date(invoice.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          {invoice.status === "draft" && canEdit && (
            <>
              <button onClick={function() { onEdit(invoice); }}
                className="px-4 py-2 text-sm font-medium border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Edit
              </button>
              <button onClick={function() { setShowSentConfirm(true); }}
                className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Send to Client
              </button>
            </>
          )}
          {["sent", "overdue", "partial"].includes(invoice.status) && canMarkPaid && (
            <button onClick={function() { setShowPayModal(true); }}
              className="px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Record Payment
            </button>
          )}
          <button className="px-4 py-2 text-sm font-medium border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download PDF
          </button>
        </div>
      </div>

      {/* Invoice Preview */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {/* Invoice Header */}
        <div className="bg-indigo-700 px-8 py-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                  <span className="text-indigo-700 font-black text-lg">F</span>
                </div>
                <div>
                  <p className="font-bold text-lg leading-tight">{FIRM.name}</p>
                  <p className="text-indigo-200 text-xs">GSTIN: {FIRM.gstin}</p>
                </div>
              </div>
              <p className="text-indigo-200 text-xs mt-2">{FIRM.address}</p>
              <p className="text-indigo-200 text-xs">{FIRM.email} | {FIRM.phone}</p>
            </div>
            <div className="text-right">
              <p className="text-indigo-200 text-xs uppercase tracking-widest mb-1">Tax Invoice</p>
              <p className="text-2xl font-black font-mono">{invoice.id}</p>
              <div className="mt-3 space-y-0.5 text-xs text-indigo-200">
                <p>Issue Date: <span className="text-white font-medium">
                  {new Date(invoice.issueDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </span></p>
                <p>Due Date: <span className="text-white font-medium">
                  {new Date(invoice.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </span></p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-8 py-6">
          {/* Bill To */}
          <div className="flex gap-8 mb-6 pb-6 border-b border-gray-100">
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Bill To</p>
              <p className="font-bold text-gray-900">{invoice.clientName}</p>
              {client && (
                <>
                  <p className="text-sm text-gray-600 mt-0.5">{client.address}</p>
                  <p className="text-sm text-gray-500">GSTIN: {client.gstin}</p>
                  <p className="text-sm text-gray-500">{client.email}</p>
                  <p className="text-xs text-gray-400 mt-1">State: {client.state} ({client.stateCode})</p>
                </>
              )}
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Payment Info</p>
              <p className="text-sm text-gray-700">Bank: <span className="font-medium">{FIRM.bankName}</span></p>
              <p className="text-sm text-gray-700">A/C: <span className="font-medium">{FIRM.accountNo}</span></p>
              <p className="text-sm text-gray-700">IFSC: <span className="font-medium">{FIRM.ifsc}</span></p>
              <div className="mt-2">
                <span className={"text-xs px-2 py-1 rounded-full font-medium " + (invoice.isInterState ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700")}>
                  {invoice.isInterState ? "Inter-State (IGST)" : "Intra-State (CGST+SGST)"}
                </span>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <table className="w-full mb-4">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left text-xs font-semibold text-gray-600 px-3 py-2.5">#</th>
                <th className="text-left text-xs font-semibold text-gray-600 px-3 py-2.5">Description</th>
                <th className="text-right text-xs font-semibold text-gray-600 px-3 py-2.5">Qty</th>
                <th className="text-right text-xs font-semibold text-gray-600 px-3 py-2.5">Rate</th>
                <th className="text-right text-xs font-semibold text-gray-600 px-3 py-2.5">GST%</th>
                <th className="text-right text-xs font-semibold text-gray-600 px-3 py-2.5">GST Amt</th>
                <th className="text-right text-xs font-semibold text-gray-600 px-3 py-2.5">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {invoice.items.map(function(item, idx) {
                var base = item.qty * item.rate;
                var gst = base * item.gstRate / 100;
                return (
                  <tr key={idx}>
                    <td className="px-3 py-3 text-sm text-gray-400">{idx + 1}</td>
                    <td className="px-3 py-3 text-sm font-medium text-gray-800">{item.desc}</td>
                    <td className="px-3 py-3 text-sm text-gray-600 text-right">{item.qty}</td>
                    <td className="px-3 py-3 text-sm text-gray-600 text-right">{fmt(item.rate)}</td>
                    <td className="px-3 py-3 text-sm text-gray-600 text-right">{item.gstRate}%</td>
                    <td className="px-3 py-3 text-sm text-gray-600 text-right">{fmt(gst)}</td>
                    <td className="px-3 py-3 text-sm font-semibold text-gray-800 text-right">{fmt(base + gst)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end mb-4">
            <div className="w-64 space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-gray-800">{fmt(totals.subtotal)}</span>
              </div>
              {!invoice.isInterState ? (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">CGST</span>
                    <span className="text-gray-700">{fmt(totals.cgst)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">SGST</span>
                    <span className="text-gray-700">{fmt(totals.sgst)}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">IGST</span>
                  <span className="text-gray-700">{fmt(totals.igst)}</span>
                </div>
              )}
              {invoice.paidAmount && invoice.status === "partial" && (
                <div className="flex justify-between text-sm text-green-700">
                  <span>Payment Received</span>
                  <span>- {fmt(invoice.paidAmount)}</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-2 flex justify-between">
                <span className="font-bold text-gray-900 text-base">
                  {invoice.status === "partial" ? "Balance Due" : "Total Due"}
                </span>
                <span className="font-bold text-indigo-700 text-lg">
                  {fmt(invoice.status === "partial" ? totals.total - (invoice.paidAmount || 0) : totals.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Amount in Words */}
          <div className="bg-indigo-50 rounded-lg px-4 py-2.5 mb-4">
            <p className="text-xs text-indigo-600 font-medium">
              Amount in Words: <span className="text-indigo-800">{amountInWords}</span>
            </p>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Notes</p>
              <p className="text-sm text-gray-600">{invoice.notes}</p>
            </div>
          )}

          {/* Payment stamp */}
          {invoice.status === "paid" && (
            <div className="flex justify-end mt-4">
              <div className="border-4 border-green-500 rounded-xl px-6 py-3 transform rotate-[-8deg] opacity-70">
                <p className="text-2xl font-black text-green-600 tracking-widest">PAID</p>
                {invoice.paidDate && (
                  <p className="text-xs text-green-600 text-center">
                    {new Date(invoice.paidDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Record Payment Modal */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-1">Record Payment</h3>
            <p className="text-xs text-gray-400 mb-4">
              Total due: <span className="font-semibold text-gray-700">{fmt(totals.total - (invoice.paidAmount || 0))}</span>
            </p>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Amount Received (Rs.)</label>
                <input type="number" value={payAmount}
                  onChange={function(e) { setPayAmount(e.target.value); }}
                  placeholder={"Max: " + Math.round(totals.total - (invoice.paidAmount || 0))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                <div className="flex gap-2 mt-1.5">
                  <button type="button"
                    onClick={function() { setPayAmount(String(Math.round(totals.total - (invoice.paidAmount || 0)))); }}
                    className="text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded hover:bg-indigo-100">
                    Full Amount
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Payment Date</label>
                <input type="date" value={payDate}
                  onChange={function(e) { setPayDate(e.target.value); }}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={function() { setShowPayModal(false); }}
                className="flex-1 px-4 py-2 text-sm font-medium border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleMarkPaid} disabled={!payAmount || parseFloat(payAmount) <= 0}
                className="flex-1 px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send Confirm Modal */}
      {showSentConfirm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-2">Send Invoice?</h3>
            <p className="text-sm text-gray-500 mb-1">This will send <span className="font-semibold">{invoice.id}</span> to:</p>
            <p className="text-sm font-semibold text-indigo-600 mb-4">{client ? client.email : invoice.clientName}</p>
            <p className="text-sm text-gray-500 mb-5">Total: <span className="font-bold text-gray-900">{fmt(totals.total)}</span></p>
            <div className="flex gap-3">
              <button onClick={function() { setShowSentConfirm(false); }}
                className="flex-1 px-4 py-2 text-sm font-medium border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleSend}
                className="flex-1 px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                Send Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
