/* eslint-disable */
import React from "react";

var SIGN_STAGES = [
  { id: "draft", label: "Draft", color: "bg-gray-100 text-gray-600" },
  { id: "sent", label: "Sent", color: "bg-blue-100 text-blue-700" },
  { id: "viewed", label: "Viewed", color: "bg-purple-100 text-purple-700" },
  { id: "signed", label: "Signed", color: "bg-green-100 text-green-700" },
  { id: "declined", label: "Declined", color: "bg-red-100 text-red-700" }
];

var MOCK_REQUESTS = [
  { id: "ESR-001", docName: "Client Services Agreement - Acme Corp", sentTo: "rohan@acmecorp.in", sentBy: "Priya S.", sentAt: "2025-05-28", stage: "signed", signedAt: "2025-05-28", dueDate: "2025-06-04", reminders: 0 },
  { id: "ESR-002", docName: "Balance Sheet FY2024-25 - Redwood Tech", sentTo: "cfo@redwoodtech.com", sentBy: "Arjun K.", sentAt: "2025-05-27", stage: "viewed", signedAt: null, dueDate: "2025-06-03", reminders: 1 },
  { id: "ESR-003", docName: "NDA - Vertex Solutions", sentTo: "legal@vertex.io", sentBy: "Sales Team", sentAt: "2025-05-25", stage: "sent", signedAt: null, dueDate: "2025-06-01", reminders: 2 },
  { id: "ESR-004", docName: "Engagement Letter FY2025", sentTo: "accounts@lighthouse.in", sentBy: "Rahul M.", sentAt: "2025-05-20", stage: "signed", signedAt: "2025-05-22", dueDate: "2025-05-27", reminders: 0 },
  { id: "ESR-005", docName: "Power of Attorney - Acme Corp", sentTo: "rohan@acmecorp.in", sentBy: "Priya S.", sentAt: "2025-05-18", stage: "declined", signedAt: null, dueDate: "2025-05-25", reminders: 3 }
];

function StageProgress(props) {
  var stage = props.stage;
  var stages = ["draft", "sent", "viewed", "signed"];
  if (stage === "declined") {
    return React.createElement("span", { className: "text-xs text-red-600" }, "Declined");
  }
  var idx = stages.indexOf(stage);
  return React.createElement(
    "div",
    { className: "flex items-center gap-1" },
    stages.map(function(s, i) {
      return React.createElement(
        "div",
        { key: s, className: "flex items-center gap-1" },
        React.createElement(
          "div",
          { className: "w-5 h-5 rounded-full flex items-center justify-center text-xs " + (i <= idx ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-400") },
          i < idx
            ? React.createElement("svg", { className: "w-3 h-3", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
                React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 3, d: "M5 13l4 4L19 7" }))
            : React.createElement("span", null, i + 1)
        ),
        i < stages.length - 1 && React.createElement("div", { className: "h-0.5 w-6 " + (i < idx ? "bg-indigo-400" : "bg-gray-200") })
      );
    })
  );
}

export default function ESignWorkflow(props) {
  var userRole = props.userRole;
  var [filter, setFilter] = React.useState("all");
  var [showNewRequest, setShowNewRequest] = React.useState(false);
  var [newReq, setNewReq] = React.useState({ docName: "", email: "", dueDate: "", message: "" });
  var [sent, setSent] = React.useState(false);

  var canCreate = ["Master Admin", "Associate"].includes(userRole);

  var filtered = MOCK_REQUESTS.filter(function(r) {
    return filter === "all" || r.stage === filter;
  });

  var isOverdue = function(r) {
    return !["signed", "declined", "archived"].includes(r.stage) && new Date(r.dueDate) < new Date();
  };

  var handleSend = function() {
    setSent(true);
    setTimeout(function() {
      setShowNewRequest(false);
      setSent(false);
      setNewReq({ docName: "", email: "", dueDate: "", message: "" });
    }, 1600);
  };

  var counts = {};
  SIGN_STAGES.forEach(function(s) {
    counts[s.id] = MOCK_REQUESTS.filter(function(r) { return r.stage === s.id; }).length;
  });
  counts.all = MOCK_REQUESTS.length;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-semibold text-gray-900">E-Sign Requests</h2>
          <p className="text-sm text-gray-500">Track document signing across all clients</p>
        </div>
        {canCreate && (
          <button onClick={() => setShowNewRequest(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">
            + New Request
          </button>
        )}
      </div>

      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total", count: MOCK_REQUESTS.length, color: "text-gray-900" },
          { label: "Awaiting", count: MOCK_REQUESTS.filter(r => ["sent","viewed"].includes(r.stage)).length, color: "text-blue-700" },
          { label: "Signed", count: counts.signed || 0, color: "text-green-700" },
          { label: "Overdue", count: MOCK_REQUESTS.filter(isOverdue).length, color: "text-red-600" }
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-400 mb-1">{s.label}</p>
            <p className={"text-2xl font-semibold " + s.color}>{s.count}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap mb-4">
        <button onClick={() => setFilter("all")}
          className={"px-3 py-1.5 text-xs rounded-full border font-medium " + (filter === "all" ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400")}>
          All ({counts.all})
        </button>
        {SIGN_STAGES.map(s => (
          <button key={s.id} onClick={() => setFilter(s.id)}
            className={"px-3 py-1.5 text-xs rounded-full border font-medium " + (filter === s.id ? s.color + " border-current" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400")}>
            {s.label} ({counts[s.id] || 0})
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(req => {
          var stageCfg = SIGN_STAGES.find(s => s.id === req.stage);
          var overdue = isOverdue(req);
          return (
            <div key={req.id} className={"bg-white rounded-xl border p-4 " + (overdue ? "border-red-200" : "border-gray-200")}>
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-gray-400 font-mono">{req.id}</span>
                    <span className={"text-xs px-2 py-0.5 rounded-full font-medium " + (stageCfg ? stageCfg.color : "")}>{stageCfg ? stageCfg.label : req.stage}</span>
                    {overdue && <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-600 font-medium">Overdue</span>}
                  </div>
                  <p className="text-sm font-medium text-gray-900 truncate">{req.docName}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Sent to <span className="font-medium">{req.sentTo}</span> by {req.sentBy}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-gray-400">Due: <span className={overdue ? "text-red-600 font-medium" : "text-gray-600"}>{new Date(req.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span></p>
                  {req.signedAt && <p className="text-xs text-green-600 mt-0.5">Signed {new Date(req.signedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>}
                  {req.reminders > 0 && <p className="text-xs text-amber-600 mt-0.5">{req.reminders} reminder{req.reminders > 1 ? "s" : ""} sent</p>}
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <StageProgress stage={req.stage} />
                {["sent","viewed"].includes(req.stage) && canCreate && (
                  <button className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">Send Reminder</button>
                )}
                {req.stage === "declined" && canCreate && (
                  <button className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">Resend</button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showNewRequest && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6">
            {sent ? (
              <div className="py-8 text-center">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Signing request sent!</h3>
              </div>
            ) : (
              <>
                <h3 className="text-base font-semibold text-gray-900 mb-4">New Signing Request</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">Document Name</label>
                    <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                      placeholder="Document name..." value={newReq.docName}
                      onChange={e => setNewReq(Object.assign({}, newReq, { docName: e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">Recipient Email</label>
                    <input type="email" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                      placeholder="client@example.com" value={newReq.email}
                      onChange={e => setNewReq(Object.assign({}, newReq, { email: e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">Due Date</label>
                    <input type="date" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                      value={newReq.dueDate} onChange={e => setNewReq(Object.assign({}, newReq, { dueDate: e.target.value }))} />
                  </div>
                </div>
                <div className="flex gap-3 mt-5">
                  <button onClick={() => setShowNewRequest(false)}
                    className="flex-1 px-4 py-2 text-sm font-medium border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50">
                    Cancel
                  </button>
                  <button onClick={handleSend} disabled={!newReq.docName || !newReq.email}
                    className="flex-1 px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">
                    Send Request
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
