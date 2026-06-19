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

export default function InvoiceList(props) {
  var invoices = props.invoices;
  var onSelectInvoice = props.onSelectInvoice;
  var onNewInvoice = props.onNewInvoice;
  var data = props.data;
  var fmt = data.fmtCurrency;
  var calc = data.calcInvoiceTotals;

  var [search, setSearch] = React.useState("");
  var [statusFilter, setStatusFilter] = React.useState("all");
  var [clientFilter, setClientFilter] = React.useState("all");
  var [sortBy, setSortBy] = React.useState("date");

  var clients = data.INVOICE_CLIENTS;

  var filtered = invoices.filter(function(inv) {
    var matchSearch = !search ||
      inv.id.toLowerCase().includes(search.toLowerCase()) ||
      inv.clientName.toLowerCase().includes(search.toLowerCase());
    var matchStatus = statusFilter === "all" || inv.status === statusFilter;
    var matchClient = clientFilter === "all" || inv.clientId === parseInt(clientFilter);
    return matchSearch && matchStatus && matchClient;
  }).sort(function(a, b) {
    if (sortBy === "date") return new Date(b.issueDate) - new Date(a.issueDate);
    if (sortBy === "amount") {
      return calc(b.items, b.isInterState).total - calc(a.items, a.isInterState).total;
    }
    if (sortBy === "due") return new Date(a.dueDate) - new Date(b.dueDate);
    return 0;
  });

  var totalFiltered = filtered.reduce(function(sum, inv) {
    return sum + calc(inv.items, inv.isInterState).total;
  }, 0);

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" value={search} onChange={function(e) { setSearch(e.target.value); }}
            placeholder="Search invoices..."
            className="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 w-52" />
        </div>

        <select value={statusFilter} onChange={function(e) { setStatusFilter(e.target.value); }}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300">
          <option value="all">All Statuses</option>
          {["paid","sent","overdue","partial","draft"].map(function(s) {
            return <option key={s} value={s}>{STATUS_LABEL[s]}</option>;
          })}
        </select>

        <select value={clientFilter} onChange={function(e) { setClientFilter(e.target.value); }}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300">
          <option value="all">All Clients</option>
          {clients.map(function(c) {
            return <option key={c.id} value={c.id}>{c.name}</option>;
          })}
        </select>

        <select value={sortBy} onChange={function(e) { setSortBy(e.target.value); }}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300">
          <option value="date">Sort: Issue Date</option>
          <option value="due">Sort: Due Date</option>
          <option value="amount">Sort: Amount</option>
        </select>

        <div className="ml-auto flex items-center gap-3">
          <span className="text-xs text-gray-400">{filtered.length} invoices</span>
          <span className="text-xs font-semibold text-gray-700">{fmt(totalFiltered)}</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {["Invoice #", "Client", "Issue Date", "Due Date", "Amount", "GST", "Total", "Status", ""].map(function(h) {
                return <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">{h}</th>;
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(function(inv) {
              var totals = calc(inv.items, inv.isInterState);
              var isOverdue = inv.status === "overdue";
              return (
                <tr key={inv.id} onClick={function() { onSelectInvoice(inv); }}
                  className={"hover:bg-gray-50 cursor-pointer transition-colors " + (isOverdue ? "bg-red-50/30" : "")}>
                  <td className="px-4 py-3">
                    <span className="text-sm font-mono font-semibold text-indigo-600">{inv.id}</span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-800">{inv.clientName}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(inv.issueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3">
                    <p className={"text-sm " + (isOverdue ? "text-red-600 font-semibold" : "text-gray-500")}>
                      {new Date(inv.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{fmt(totals.subtotal)}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{fmt(totals.totalGst)}</td>
                  <td className="px-4 py-3 text-sm font-bold text-gray-900">{fmt(totals.total)}</td>
                  <td className="px-4 py-3">
                    <span className={"text-xs px-2 py-1 rounded-full font-medium " + STATUS_COLOR[inv.status]}>
                      {STATUS_LABEL[inv.status]}
                    </span>
                    {inv.status === "partial" && inv.paidAmount && (
                      <p className="text-xs text-amber-600 mt-0.5">Paid: {fmt(inv.paidAmount)}</p>
                    )}
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

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-sm text-gray-400 mb-3">No invoices match your filters</p>
            <button onClick={onNewInvoice} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
              Create new invoice +
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
