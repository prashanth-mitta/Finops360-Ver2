/* eslint-disable */
import React from "react";
import InvoiceDashboard from "./InvoiceDashboard";
import InvoiceList from "./InvoiceList";
import InvoiceBuilder from "./InvoiceBuilder";
import InvoiceDetail from "./InvoiceDetail";

export default function InvoicesModule(props) {
  var userRole = props.userRole || "Master Admin";
  var [tab, setTab] = React.useState("dashboard");
  var [selectedInvoice, setSelectedInvoice] = React.useState(null);
  var [editingInvoice, setEditingInvoice] = React.useState(null);
  var [invoices, setInvoices] = React.useState(null);

  // load from invoiceData lazily
  var [data, setData] = React.useState(null);
  React.useEffect(function() {
    var d = require("./invoiceData");
    setData(d);
    setInvoices(d.MOCK_INVOICES.slice());
  }, []);

  if (!data || !invoices) {
    return React.createElement("div", { className: "p-6 text-sm text-gray-400" }, "Loading...");
  }

  var handleSelectInvoice = function(inv) {
    setSelectedInvoice(inv);
    setTab("detail");
  };

  var handleNewInvoice = function() {
    setEditingInvoice(null);
    setTab("create");
  };

  var handleEditInvoice = function(inv) {
    setEditingInvoice(inv);
    setTab("create");
  };

  var handleSaveInvoice = function(inv) {
    setInvoices(function(prev) {
      var exists = prev.find(function(i) { return i.id === inv.id; });
      if (exists) {
        return prev.map(function(i) { return i.id === inv.id ? inv : i; });
      }
      return [inv].concat(prev);
    });
    setSelectedInvoice(inv);
    setTab("detail");
  };

  var handleUpdateStatus = function(id, status, extra) {
    setInvoices(function(prev) {
      return prev.map(function(inv) {
        if (inv.id !== id) return inv;
        return Object.assign({}, inv, { status: status }, extra || {});
      });
    });
    if (selectedInvoice && selectedInvoice.id === id) {
      setSelectedInvoice(function(prev) {
        return Object.assign({}, prev, { status: status }, extra || {});
      });
    }
  };

  var TABS = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "invoices", label: "All Invoices", icon: "🧾" },
    { id: "create", label: "New Invoice", icon: "➕" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Invoicing & Billing</h1>
            <p className="text-sm text-gray-400 mt-0.5">GST-compliant invoices, payments & tracking</p>
          </div>
          <button onClick={handleNewInvoice}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Invoice
          </button>
        </div>

        {tab !== "create" && tab !== "detail" && (
          <div className="flex gap-1 mt-4">
            {TABS.filter(function(t) { return t.id !== "create"; }).map(function(t) {
              return (
                <button key={t.id} onClick={function() { setTab(t.id); }}
                  className={"px-4 py-2 rounded-lg text-sm font-medium transition-colors " + (tab === t.id ? "bg-indigo-50 text-indigo-700" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100")}>
                  {t.icon} {t.label}
                </button>
              );
            })}
          </div>
        )}

        {(tab === "detail" || tab === "create") && (
          <button onClick={function() { setTab("invoices"); setSelectedInvoice(null); setEditingInvoice(null); }}
            className="mt-3 text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Invoices
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {tab === "dashboard" && (
          <InvoiceDashboard invoices={invoices} onSelectInvoice={handleSelectInvoice} onNewInvoice={handleNewInvoice} data={data} />
        )}
        {tab === "invoices" && (
          <InvoiceList invoices={invoices} onSelectInvoice={handleSelectInvoice} onNewInvoice={handleNewInvoice} userRole={userRole} data={data} />
        )}
        {tab === "create" && (
          <InvoiceBuilder editingInvoice={editingInvoice} onSave={handleSaveInvoice} onCancel={function() { setTab("invoices"); }} invoices={invoices} data={data} />
        )}
        {tab === "detail" && selectedInvoice && (
          <InvoiceDetail invoice={selectedInvoice} onEdit={handleEditInvoice} onUpdateStatus={handleUpdateStatus} onBack={function() { setTab("invoices"); }} data={data} userRole={userRole} />
        )}
      </div>
    </div>
  );
}
