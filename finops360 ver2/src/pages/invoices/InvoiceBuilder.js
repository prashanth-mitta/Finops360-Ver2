/* eslint-disable */
import React from "react";

export default function InvoiceBuilder(props) {
  var editingInvoice = props.editingInvoice;
  var onSave = props.onSave;
  var onCancel = props.onCancel;
  var invoices = props.invoices;
  var data = props.data;
  var INVOICE_CLIENTS = data.INVOICE_CLIENTS;
  var SERVICE_TEMPLATES = data.SERVICE_TEMPLATES;
  var GST_RATES = data.GST_RATES;
  var calcInvoiceTotals = data.calcInvoiceTotals;
  var fmtCurrency = data.fmtCurrency;
  var nextInvoiceId = data.nextInvoiceId;

  var today = new Date().toISOString().split("T")[0];
  var due = new Date(Date.now() + 15 * 86400000).toISOString().split("T")[0];

  var defaultItems = [{ desc: "", qty: 1, rate: 0, gstRate: 18 }];

  var [form, setForm] = React.useState(editingInvoice ? {
    id: editingInvoice.id,
    clientId: editingInvoice.clientId,
    issueDate: editingInvoice.issueDate,
    dueDate: editingInvoice.dueDate,
    items: editingInvoice.items.map(function(i) { return Object.assign({}, i); }),
    notes: editingInvoice.notes || "",
    isInterState: editingInvoice.isInterState || false,
    status: editingInvoice.status || "draft",
  } : {
    id: nextInvoiceId(invoices),
    clientId: "",
    issueDate: today,
    dueDate: due,
    items: defaultItems,
    notes: "",
    isInterState: false,
    status: "draft",
  });

  var [errors, setErrors] = React.useState({});
  var [saved, setSaved] = React.useState(false);

  var selectedClient = INVOICE_CLIENTS.find(function(c) { return c.id === parseInt(form.clientId); });

  var totals = calcInvoiceTotals(form.items, form.isInterState);

  var setItem = function(idx, field, value) {
    setForm(function(prev) {
      var items = prev.items.map(function(it, i) {
        if (i !== idx) return it;
        var updated = Object.assign({}, it);
        updated[field] = field === "qty" || field === "rate" || field === "gstRate" ? parseFloat(value) || 0 : value;
        return updated;
      });
      return Object.assign({}, prev, { items: items });
    });
  };

  var addItem = function() {
    setForm(function(prev) {
      return Object.assign({}, prev, { items: prev.items.concat([{ desc: "", qty: 1, rate: 0, gstRate: 18 }]) });
    });
  };

  var removeItem = function(idx) {
    setForm(function(prev) {
      if (prev.items.length === 1) return prev;
      return Object.assign({}, prev, { items: prev.items.filter(function(_, i) { return i !== idx; }) });
    });
  };

  var validate = function() {
    var errs = {};
    if (!form.clientId) errs.clientId = "Select a client";
    if (!form.issueDate) errs.issueDate = "Required";
    if (!form.dueDate) errs.dueDate = "Required";
    var hasEmptyDesc = form.items.some(function(it) { return !it.desc.trim(); });
    if (hasEmptyDesc) errs.items = "All line items must have a description";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  var handleSave = function(asDraft) {
    if (!validate()) return;
    var inv = Object.assign({}, form, { status: asDraft ? "draft" : "sent" });
    setSaved(true);
    setTimeout(function() { onSave(inv); }, 500);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {/* Builder Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
          <div>
            <h2 className="text-base font-semibold text-gray-900">{editingInvoice ? "Edit Invoice" : "New Invoice"}</h2>
            <p className="text-xs text-gray-400 mt-0.5 font-mono">{form.id}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className={"flex items-center gap-2 text-xs px-3 py-1.5 rounded-full font-medium " + (form.isInterState ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700")}>
              <span>{form.isInterState ? "IGST" : "CGST + SGST"}</span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Client + Dates Row */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Bill To <span className="text-red-500">*</span>
              </label>
              <select value={form.clientId}
                onChange={function(e) {
                  var cId = e.target.value;
                  var client = INVOICE_CLIENTS.find(function(c) { return c.id === parseInt(cId); });
                  var isInter = client ? client.stateCode !== "36" : false;
                  setForm(function(prev) { return Object.assign({}, prev, { clientId: cId, isInterState: isInter }); });
                }}
                className={"w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white " + (errors.clientId ? "border-red-300" : "border-gray-200")}>
                <option value="">Select client...</option>
                {INVOICE_CLIENTS.map(function(c) {
                  return <option key={c.id} value={c.id}>{c.name}</option>;
                })}
              </select>
              {errors.clientId && <p className="text-xs text-red-500 mt-1">{errors.clientId}</p>}
              {selectedClient && (
                <div className="mt-2 p-3 bg-gray-50 rounded-lg text-xs text-gray-500 space-y-0.5">
                  <p className="font-medium text-gray-700">{selectedClient.name}</p>
                  <p>{selectedClient.address}</p>
                  <p>GSTIN: {selectedClient.gstin}</p>
                  <p>{selectedClient.email}</p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Issue Date <span className="text-red-500">*</span></label>
              <input type="date" value={form.issueDate}
                onChange={function(e) { setForm(function(prev) { return Object.assign({}, prev, { issueDate: e.target.value }); }); }}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Due Date <span className="text-red-500">*</span></label>
              <input type="date" value={form.dueDate}
                onChange={function(e) { setForm(function(prev) { return Object.assign({}, prev, { dueDate: e.target.value }); }); }}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
              <div className="flex gap-2 mt-2">
                {[15, 30, 45].map(function(days) {
                  return (
                    <button key={days} type="button"
                      onClick={function() {
                        var d = new Date(form.issueDate || today);
                        d.setDate(d.getDate() + days);
                        setForm(function(prev) { return Object.assign({}, prev, { dueDate: d.toISOString().split("T")[0] }); });
                      }}
                      className="text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded hover:bg-indigo-100">
                      +{days}d
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* GST Type Toggle */}
          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold text-gray-600">GST Type</label>
            <div className="flex border border-gray-200 rounded-lg overflow-hidden">
              <button type="button"
                onClick={function() { setForm(function(prev) { return Object.assign({}, prev, { isInterState: false }); }); }}
                className={"px-4 py-1.5 text-xs font-medium transition-colors " + (!form.isInterState ? "bg-indigo-600 text-white" : "text-gray-500 hover:bg-gray-50")}>
                Intra-State (CGST + SGST)
              </button>
              <button type="button"
                onClick={function() { setForm(function(prev) { return Object.assign({}, prev, { isInterState: true }); }); }}
                className={"px-4 py-1.5 text-xs font-medium transition-colors " + (form.isInterState ? "bg-indigo-600 text-white" : "text-gray-500 hover:bg-gray-50")}>
                Inter-State (IGST)
              </button>
            </div>
          </div>

          {/* Line Items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-gray-600">Line Items</label>
              {errors.items && <p className="text-xs text-red-500">{errors.items}</p>}
            </div>

            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left text-xs font-semibold text-gray-500 px-4 py-2.5 w-1/2">Description</th>
                    <th className="text-right text-xs font-semibold text-gray-500 px-3 py-2.5 w-16">Qty</th>
                    <th className="text-right text-xs font-semibold text-gray-500 px-3 py-2.5 w-28">Rate (Rs.)</th>
                    <th className="text-right text-xs font-semibold text-gray-500 px-3 py-2.5 w-20">GST %</th>
                    <th className="text-right text-xs font-semibold text-gray-500 px-3 py-2.5 w-28">Amount</th>
                    <th className="px-2 py-2.5 w-8"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {form.items.map(function(item, idx) {
                    var lineAmt = item.qty * item.rate;
                    var lineGst = lineAmt * item.gstRate / 100;
                    return (
                      <tr key={idx}>
                        <td className="px-3 py-2">
                          <input list={"services-" + idx} value={item.desc}
                            onChange={function(e) { setItem(idx, "desc", e.target.value); }}
                            placeholder="Service description..."
                            className="w-full text-sm border-0 focus:outline-none bg-transparent" />
                          <datalist id={"services-" + idx}>
                            {SERVICE_TEMPLATES.map(function(s) { return <option key={s} value={s} />; })}
                          </datalist>
                        </td>
                        <td className="px-3 py-2">
                          <input type="number" value={item.qty} min="1"
                            onChange={function(e) { setItem(idx, "qty", e.target.value); }}
                            className="w-full text-sm text-right border-0 focus:outline-none bg-transparent" />
                        </td>
                        <td className="px-3 py-2">
                          <input type="number" value={item.rate} min="0"
                            onChange={function(e) { setItem(idx, "rate", e.target.value); }}
                            className="w-full text-sm text-right border-0 focus:outline-none bg-transparent" />
                        </td>
                        <td className="px-3 py-2">
                          <select value={item.gstRate}
                            onChange={function(e) { setItem(idx, "gstRate", e.target.value); }}
                            className="w-full text-sm text-right border-0 focus:outline-none bg-transparent">
                            {GST_RATES.map(function(r) { return <option key={r} value={r}>{r}%</option>; })}
                          </select>
                        </td>
                        <td className="px-3 py-2 text-right text-sm font-medium text-gray-700">
                          {fmtCurrency(lineAmt + lineGst)}
                        </td>
                        <td className="px-2 py-2 text-center">
                          <button type="button" onClick={function() { removeItem(idx); }}
                            className="text-gray-300 hover:text-red-400 transition-colors">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="px-4 py-2 border-t border-gray-100">
                <button type="button" onClick={addItem}
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Line Item
                </button>
              </div>
            </div>
          </div>

          {/* Totals + Notes */}
          <div className="flex gap-6">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Notes / Terms</label>
              <textarea rows={3} value={form.notes}
                onChange={function(e) { setForm(function(prev) { return Object.assign({}, prev, { notes: e.target.value }); }); }}
                placeholder="Payment terms, bank details note, thank you message..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none" />
            </div>

            <div className="w-64 flex-shrink-0">
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-gray-800 font-medium">{fmtCurrency(totals.subtotal)}</span>
                </div>
                {!form.isInterState ? (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">CGST</span>
                      <span className="text-gray-700">{fmtCurrency(totals.cgst)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">SGST</span>
                      <span className="text-gray-700">{fmtCurrency(totals.sgst)}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">IGST</span>
                    <span className="text-gray-700">{fmtCurrency(totals.igst)}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-2 flex justify-between">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-bold text-indigo-700 text-base">{fmtCurrency(totals.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
          <button type="button" onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800">
            Cancel
          </button>
          <div className="flex gap-3">
            <button type="button" onClick={function() { handleSave(true); }}
              disabled={saved}
              className="px-5 py-2 text-sm font-medium border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 disabled:opacity-50">
              Save as Draft
            </button>
            <button type="button" onClick={function() { handleSave(false); }}
              disabled={saved}
              className={"flex items-center gap-2 px-5 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50 " + (saved ? "bg-green-600" : "bg-indigo-600 hover:bg-indigo-700")}>
              {saved ? (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Saved!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Save & Send
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
