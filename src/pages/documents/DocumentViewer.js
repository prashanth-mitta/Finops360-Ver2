/* eslint-disable */
import React, { useState, useRef } from "react";

const STATUS_CONFIG = {
  signed: { label: "Signed", color: "bg-green-100 text-green-700" },
  approved: { label: "Approved", color: "bg-blue-100 text-blue-700" },
  pending_sign: { label: "Pending Signature", color: "bg-amber-100 text-amber-700" },
  verified: { label: "Verified", color: "bg-purple-100 text-purple-700" },
  draft: { label: "Draft", color: "bg-gray-100 text-gray-600" },
};

const MOCK_VERSIONS = [
  { v: "v3 (current)", by: "Rahul M.", date: "2025-05-28", size: "245 KB" },
  { v: "v2", by: "Priya S.", date: "2025-05-15", size: "238 KB" },
  { v: "v1", by: "Arjun K.", date: "2025-05-01", size: "220 KB" },
];

const MOCK_ACTIVITY = [
  { action: "Signed", user: "Client (Acme Corp)", time: "28 May 2025, 4:12 PM", icon: "✍️" },
  { action: "Sent for signing", user: "Priya S.", time: "28 May 2025, 10:00 AM", icon: "📤" },
  { action: "Downloaded", user: "Rahul M.", time: "27 May 2025, 3:45 PM", icon: "⬇️" },
  { action: "Uploaded v3", user: "Rahul M.", time: "28 May 2025, 9:55 AM", icon: "⬆️" },
];

export default function DocumentViewer({ doc, onClose, userRole }) {
  const [tab, setTab] = useState("details");
  const statusCfg = STATUS_CONFIG[doc.status] || STATUS_CONFIG.draft;
  const canSendSign = ["Master Admin", "Associate"].includes(userRole) && doc.type === "PDF";

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="flex-1 bg-black/30" onClick={onClose} />

      {/* Drawer */}
      <div className="w-[480px] bg-white shadow-2xl flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start gap-3 px-5 py-4 border-b border-gray-100">
          <div
            className={`w-10 h-12 rounded flex items-center justify-center text-xs font-bold flex-shrink-0 ${
              doc.type === "PDF"
                ? "bg-red-50 text-red-600"
                : doc.type === "XLSX"
                ? "bg-green-50 text-green-600"
                : "bg-blue-50 text-blue-600"
            }`}
          >
            {doc.type}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-semibold text-gray-900 leading-snug">{doc.name}</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {doc.client} · {doc.size}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Preview Area */}
        <div className="mx-5 mt-4 rounded-xl border border-gray-200 bg-gray-50 h-44 flex items-center justify-center relative overflow-hidden">
          <div className="text-center">
            <div className="text-5xl mb-2 opacity-30">
              {doc.type === "PDF" ? "📄" : doc.type === "XLSX" ? "📊" : "🖼️"}
            </div>
            <p className="text-xs text-gray-400">{doc.type} Preview</p>
            <p className="text-xs text-gray-300 mt-0.5">Click to open full view</p>
          </div>
          {/* Watermark overlay for certain roles */}
          {userRole === "Client" && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="text-4xl font-bold text-gray-200 rotate-[-30deg] tracking-widest select-none">
                CONFIDENTIAL
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 px-5 mt-3">
          <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
          </button>
          <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share
          </button>
          {canSendSign && (
            <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Send for Sign
            </button>
          )}
        </div>

        {/* Sub-tabs */}
        <div className="flex border-b border-gray-100 mt-4 px-5">
          {["details", "versions", "activity"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`mr-4 pb-2.5 text-xs font-medium capitalize border-b-2 transition-colors ${
                tab === t
                  ? "text-indigo-700 border-indigo-600"
                  : "text-gray-400 border-transparent hover:text-gray-600"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {tab === "details" && (
            <div className="space-y-4">
              <Row label="Status">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusCfg.color}`}>
                  {statusCfg.label}
                </span>
              </Row>
              <Row label="Client">{doc.client}</Row>
              <Row label="Category" capitalize>{doc.category}</Row>
              <Row label="File Type">{doc.type}</Row>
              <Row label="File Size">{doc.size}</Row>
              <Row label="Uploaded By">{doc.uploadedBy}</Row>
              <Row label="Upload Date">
                {new Date(doc.uploadedAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </Row>
              <Row label="Visible To">
                <div className="flex gap-1 flex-wrap">
                  {doc.sharedWith.length
                    ? doc.sharedWith.map((r) => (
                        <span key={r} className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">
                          {r}
                        </span>
                      ))
                    : <span className="text-xs text-gray-400">Internal only</span>}
                </div>
              </Row>
              <Row label="Tags">
                <div className="flex gap-1 flex-wrap">
                  {doc.tags.map((t) => (
                    <span key={t} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {t}
                    </span>
                  ))}
                </div>
              </Row>
            </div>
          )}

          {tab === "versions" && (
            <div className="space-y-2">
              {MOCK_VERSIONS.map((v) => (
                <div key={v.v} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2.5">
                  <div>
                    <p className="text-xs font-semibold text-gray-800">{v.v}</p>
                    <p className="text-xs text-gray-400">
                      {v.by} · {v.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">{v.size}</span>
                    <button className="text-xs text-indigo-600 hover:underline">Download</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "activity" && (
            <div className="space-y-3">
              {MOCK_ACTIVITY.map((a, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm flex-shrink-0">
                    {a.icon}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-800">
                      {a.action}
                      <span className="font-normal text-gray-500"> by {a.user}</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, children, capitalize }) {
  return (
    <div className="flex justify-between items-start gap-4 py-2.5 border-b border-gray-50">
      <span className="text-xs text-gray-400 flex-shrink-0 w-28">{label}</span>
      <span className={`text-xs font-medium text-gray-800 text-right ${capitalize ? "capitalize" : ""}`}>
        {children}
      </span>
    </div>
  );
}
