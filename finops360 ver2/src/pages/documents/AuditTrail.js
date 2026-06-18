/* eslint-disable */
import React, { useState, useRef } from "react";

const ACTION_CONFIG = {
  uploaded: { label: "Uploaded", color: "bg-blue-100 text-blue-700", icon: "⬆️" },
  downloaded: { label: "Downloaded", color: "bg-gray-100 text-gray-600", icon: "⬇️" },
  viewed: { label: "Viewed", color: "bg-purple-100 text-purple-700", icon: "👁️" },
  signed: { label: "Signed", color: "bg-green-100 text-green-700", icon: "✍️" },
  sent_for_sign: { label: "Sent for Sign", color: "bg-indigo-100 text-indigo-700", icon: "📤" },
  shared: { label: "Shared", color: "bg-yellow-100 text-yellow-700", icon: "🔗" },
  deleted: { label: "Deleted", color: "bg-red-100 text-red-700", icon: "🗑️" },
  updated: { label: "Updated", color: "bg-orange-100 text-orange-700", icon: "✏️" },
};

const MOCK_AUDIT = [
  {
    id: 1,
    action: "signed",
    doc: "Client Services Agreement - Acme Corp",
    user: "Rohan Mehra (Client)",
    role: "Client",
    client: "Acme Corp",
    ip: "103.21.45.88",
    device: "Chrome · macOS",
    ts: "2025-05-28T16:12:00",
  },
  {
    id: 2,
    action: "sent_for_sign",
    doc: "Client Services Agreement - Acme Corp",
    user: "Priya S.",
    role: "Associate",
    client: "Acme Corp",
    ip: "192.168.1.5",
    device: "Chrome · Windows",
    ts: "2025-05-28T10:00:00",
  },
  {
    id: 3,
    action: "uploaded",
    doc: "GST Returns Q4 FY2024-25",
    user: "Rahul M.",
    role: "Associate",
    client: "Acme Corp",
    ip: "192.168.1.8",
    device: "Firefox · Windows",
    ts: "2025-05-27T14:45:00",
  },
  {
    id: 4,
    action: "viewed",
    doc: "Balance Sheet FY2024-25",
    user: "CFO · Redwood Tech (Client)",
    role: "Client",
    client: "Redwood Tech",
    ip: "49.205.88.11",
    device: "Safari · iOS",
    ts: "2025-05-27T11:30:00",
  },
  {
    id: 5,
    action: "downloaded",
    doc: "Profit & Loss Statement",
    user: "Arjun K.",
    role: "Associate",
    client: "Acme Corp",
    ip: "192.168.1.4",
    device: "Chrome · macOS",
    ts: "2025-05-26T16:20:00",
  },
  {
    id: 6,
    action: "shared",
    doc: "Invoice INV-2025-047",
    user: "Priya S.",
    role: "Associate",
    client: "Lighthouse Ltd",
    ip: "192.168.1.5",
    device: "Chrome · Windows",
    ts: "2025-05-30T09:10:00",
  },
  {
    id: 7,
    action: "updated",
    doc: "NDA - Vertex Solutions",
    user: "Sales Team",
    role: "Sales",
    client: "Vertex Solutions",
    ip: "192.168.1.3",
    device: "Chrome · Windows",
    ts: "2025-05-25T13:00:00",
  },
  {
    id: 8,
    action: "uploaded",
    doc: "PAN Card - Redwood Tech",
    user: "HR Team",
    role: "HR",
    client: "Redwood Tech",
    ip: "192.168.1.7",
    device: "Chrome · Linux",
    ts: "2025-04-10T10:20:00",
  },
  {
    id: 9,
    action: "viewed",
    doc: "GST Returns Q4 FY2024-25",
    user: "Rohan Mehra (Client)",
    role: "Client",
    client: "Acme Corp",
    ip: "103.21.45.88",
    device: "Chrome · macOS",
    ts: "2025-05-25T09:45:00",
  },
  {
    id: 10,
    action: "downloaded",
    doc: "TDS Certificate Q3",
    user: "Accounts · Lighthouse Ltd (Client)",
    role: "Client",
    client: "Lighthouse Ltd",
    ip: "202.88.11.5",
    device: "Edge · Windows",
    ts: "2025-05-22T15:30:00",
  },
];

function formatTs(ts) {
  const d = new Date(ts);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }) + ", " + d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

export default function AuditTrail({ userRole }) {
  const [actionFilter, setActionFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const canExport = ["Master Admin"].includes(userRole);

  const filtered = MOCK_AUDIT.filter((a) => {
    const actionMatch = actionFilter === "all" || a.action === actionFilter;
    const roleMatch = roleFilter === "all" || a.role === roleFilter;
    const searchMatch =
      !search ||
      a.doc.toLowerCase().includes(search.toLowerCase()) ||
      a.user.toLowerCase().includes(search.toLowerCase());
    return actionMatch && roleMatch && searchMatch;
  });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Audit Trail</h2>
          <p className="text-sm text-gray-500">Every document action, immutably logged</p>
        </div>
        {canExport && (
          <button className="flex items-center gap-2 border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export CSV
          </button>
        )}
      </div>

      {/* Summary stat cards */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: "Total Events", count: MOCK_AUDIT.length },
          { label: "Uploads", count: MOCK_AUDIT.filter((a) => a.action === "uploaded").length },
          { label: "Client Actions", count: MOCK_AUDIT.filter((a) => a.role === "Client").length },
          { label: "Downloads", count: MOCK_AUDIT.filter((a) => a.action === "downloaded").length },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-400 mb-1">{s.label}</p>
            <p className="text-2xl font-semibold text-gray-900">{s.count}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search logs…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 w-48"
          />
        </div>

        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          <option value="all">All Actions</option>
          {Object.entries(ACTION_CONFIG).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          <option value="all">All Roles</option>
          {["Master Admin", "Sales", "HR", "Associate", "Client"].map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>

        <span className="ml-auto text-xs text-gray-400 self-center">
          {filtered.length} events
        </span>
      </div>

      {/* Log Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">
                Timestamp
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">
                Action
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">
                Document
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">
                User
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">
                Client
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((entry) => {
              const cfg = ACTION_CONFIG[entry.action];
              const isExpanded = expandedId === entry.id;
              return (
                <>
                  <tr
                    key={entry.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                  >
                    <td className="px-4 py-3">
                      <p className="text-xs text-gray-600 font-mono whitespace-nowrap">
                        {formatTs(entry.ts)}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${cfg.color}`}>
                        {cfg.icon} {cfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-gray-800 max-w-[200px] truncate">{entry.doc}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-gray-700">{entry.user}</p>
                      <p className="text-xs text-gray-400">{entry.role}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-gray-600">{entry.client}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <svg
                        className={`w-4 h-4 text-gray-400 transition-transform inline ${isExpanded ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr key={`${entry.id}-detail`} className="bg-indigo-50/30">
                      <td colSpan={6} className="px-4 py-3">
                        <div className="flex gap-8 text-xs">
                          <div>
                            <span className="text-gray-400 block mb-0.5">IP Address</span>
                            <span className="font-mono text-gray-700">{entry.ip}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 block mb-0.5">Device / Browser</span>
                            <span className="text-gray-700">{entry.device}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 block mb-0.5">Full Timestamp</span>
                            <span className="font-mono text-gray-700">{new Date(entry.ts).toISOString()}</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm text-gray-400">No audit events match your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
