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

export default function InvoiceDashboard(props) {
  var invoices = props.invoices;
  var onSelectInvoice = props.onSelectInvoice;
  var onNewInvoice = props.onNewInvoice;
  var data = props.data;
  var calc = data.calcInvoiceTotals;
  var fmt = data.fmtCurrency;

  var totalRevenue = invoices
    .filter(function(inv) { return inv.status === "paid"; })
    .reduce(function(sum, inv) { return sum + calc(inv.items, inv.isInterState).total; }, 0);

  var totalOutstanding = invoices
    .filter(function(inv) { return inv.status === "sent" || inv.status === "partial"; })
    .reduce(function(sum, inv) {
      var t = calc(inv.items, inv.isInterState).total;
      return sum + t - (inv.paidAmount || 0);
    }, 0);

  var totalOverdue = invoices
    .filter(function(inv) { return inv.status === "overdue"; })
    .reduce(function(sum, inv) { return sum + calc(inv.items, inv.isInterState).total; }, 0);

  var totalDraft = invoices.filter(function(inv) { return inv.status === "draft"; }).length;

  var recentInvoices = invoices.slice(0, 5);

  // Monthly revenue (last 5 months based on mock data)
  var monthlyData = [
    { month: "Jan", amount: 45000 },
    { month: "Feb", amount: 62000 },
    { month: "Mar", amount: 54000 },
    { month: "Apr", amount: 89000 },
    { month: "May", amount: 71000 },
  ];
  var maxAmt = Math.max.apply(null, monthlyData.map(function(d) { return d.amount; }));

  var statusBreakdown = ["paid","sent","overdue","partial","draft"].map(function(s) {
    return { status: s, count: invoices.filter(function(inv) { return inv.status === s; }).length };
  });

  return (
    <div>
      {/* Overdue alert */}
      {totalOverdue > 0 && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5">
          <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-sm text-red-700 font-medium">
            {invoices.filter(function(inv) { return inv.status === "overdue"; }).length} overdue invoice{invoices.filter(function(inv) { return inv.status === "overdue"; }).length > 1 ? "s" : ""} — total {fmt(totalOverdue)} pending
          </p>
          <button onClick={function() { props.onTab && props.onTab("invoices"); }}
            className="ml-auto text-xs text-red-600 hover:text-red-800 font-semibold underline">
            View
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Collected", value: fmt(totalRevenue), sub: "All time", color: "text-green-700" },
          { label: "Outstanding", value: fmt(totalOutstanding), sub: "Awaiting payment", color: "text-blue-700" },
          { label: "Overdue", value: fmt(totalOverdue), sub: "Past due date", color: "text-red-600" },
          { label: "Draft Invoices", value: totalDraft, sub: "Not yet sent", color: "text-gray-700" },
        ].map(function(s) {
          return (
            <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-400 mb-1">{s.label}</p>
              <p className={"text-xl font-bold " + s.color}>{s.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-5 mb-5">
        {/* Revenue chart */}
        <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Monthly Revenue (2025)</h3>
          <div className="flex items-end gap-3 h-32">
            {monthlyData.map(function(d) {
              var pct = Math.round((d.amount / maxAmt) * 100);
              return (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                  <p className="text-xs font-semibold text-gray-700">
                    {(d.amount / 1000).toFixed(0)}k
                  </p>
                  <div className="w-full rounded-t bg-indigo-500 transition-all" style={{ height: pct + "%" }} />
                  <p className="text-xs text-gray-400">{d.month}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Invoice Status</h3>
          <div className="space-y-2.5">
            {statusBreakdown.map(function(s) {
              return (
                <div key={s.status} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={"text-xs px-2 py-0.5 rounded-full font-medium " + STATUS_COLOR[s.status]}>
                      {STATUS_LABEL[s.status]}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-400 rounded-full"
                        style={{ width: (invoices.length > 0 ? Math.round((s.count / invoices.length) * 100) : 0) + "%" }} />
                    </div>
                    <span className="text-xs font-semibold text-gray-700 w-4 text-right">{s.count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent invoices */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-800">Recent Invoices</h3>
          <button className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">View All</button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-50 bg-gray-50">
              {["Invoice", "Client", "Amount", "Due Date", "Status", ""].map(function(h) {
                return <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">{h}</th>;
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {recentInvoices.map(function(inv) {
              var totals = calc(inv.items, inv.isInterState);
              return (
                <tr key={inv.id} onClick={function() { onSelectInvoice(inv); }}
                  className="hover:bg-gray-50 cursor-pointer transition-colors">
                  <td className="px-4 py-3 text-sm font-mono font-medium text-indigo-600">{inv.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{inv.clientName}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">{fmt(totals.total)}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(inv.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3">
                    <span className={"text-xs px-2 py-1 rounded-full font-medium " + STATUS_COLOR[inv.status]}>
                      {STATUS_LABEL[inv.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <svg className="w-4 h-4 text-gray-300 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
