/* eslint-disable */
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useDocumentActivityQuery, downloadDocument } from "../../services/finops";

const STATUS_CONFIG = {
  active: { label: "Active", color: "bg-gray-100 text-gray-700" },
  signed: { label: "Signed", color: "bg-green-100 text-green-700" },
  approved: { label: "Approved", color: "bg-blue-100 text-blue-700" },
  pending_sign: { label: "Pending Signature", color: "bg-amber-100 text-amber-700" },
  verified: { label: "Verified", color: "bg-purple-100 text-purple-700" },
  draft: { label: "Draft", color: "bg-gray-100 text-gray-600" },
};

const ACTION_ICONS = {
  upload: "⬆️",
  download: "⬇️",
  view: "👁️",
  delete: "🗑️",
  sign: "✍️",
};

export default function DocumentViewer({ doc, onClose, userRole }) {
  const { currentUser } = useAuth();
  const { items: activity, loading: activityLoading } = useDocumentActivityQuery(doc.id);
  const [tab, setTab] = useState("details");
  const [downloading, setDownloading] = useState(false);
  const statusCfg = STATUS_CONFIG[doc.status] || STATUS_CONFIG.active;
  const canSendSign = ["Master Admin", "Super Admin", "Associate"].includes(userRole) && doc.type === "PDF";

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const url = await downloadDocument(currentUser.tenantId, doc, currentUser.id, currentUser.name);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (err) {
      alert(err.message || "Download failed");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/30" onClick={onClose} />

      <div className="w-full max-w-[480px] bg-white shadow-2xl flex flex-col h-full">
        <div className="flex items-start gap-3 px-5 py-4 border-b border-gray-100">
          <div
            className={`w-10 h-12 rounded flex items-center justify-center text-xs font-bold flex-shrink-0 ${
              doc.type === "PDF" ? "bg-red-50 text-red-600" : doc.type === "XLSX" ? "bg-green-50 text-green-600" : "bg-blue-50 text-blue-600"
            }`}
          >
            {doc.type}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-semibold text-gray-900 leading-snug">{doc.name}</h2>
            <p className="text-xs text-gray-400 mt-0.5">{doc.client || "—"} · {doc.size}</p>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 flex-shrink-0">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mx-5 mt-4 rounded-xl border border-gray-200 bg-gray-50 h-44 flex items-center justify-center relative overflow-hidden">
          <div className="text-center">
            <div className="text-5xl mb-2 opacity-30">{doc.type === "PDF" ? "📄" : doc.type === "XLSX" ? "📊" : "🖼️"}</div>
            <p className="text-xs text-gray-400">{doc.type} stored in Supabase</p>
            <p className="text-xs text-gray-300 mt-0.5 truncate max-w-[240px]">{doc.filePath || "—"}</p>
          </div>
          {userRole === "Client" && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="text-4xl font-bold text-gray-200 rotate-[-30deg] tracking-widest select-none">CONFIDENTIAL</p>
            </div>
          )}
        </div>

        <div className="flex gap-2 px-5 mt-3">
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading || !doc.filePath}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {downloading ? "Opening…" : "Download"}
          </button>
          {canSendSign && (
            <button type="button" className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              Send for Sign
            </button>
          )}
        </div>

        <div className="flex border-b border-gray-100 mt-4 px-5">
          {["details", "activity"].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`mr-4 pb-2.5 text-xs font-medium capitalize border-b-2 transition-colors ${
                tab === t ? "text-indigo-700 border-indigo-600" : "text-gray-400 border-transparent hover:text-gray-600"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {tab === "details" && (
            <div className="space-y-4">
              <Row label="Status">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusCfg.color}`}>{statusCfg.label}</span>
              </Row>
              <Row label="Client">{doc.client || "—"}</Row>
              <Row label="Category" capitalize>{doc.category}</Row>
              <Row label="File Type">{doc.type}</Row>
              <Row label="File Size">{doc.size}</Row>
              <Row label="Uploaded By">{doc.uploadedBy || "—"}</Row>
              <Row label="Upload Date">
                {doc.uploadedAt
                  ? new Date(doc.uploadedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
                  : "—"}
              </Row>
              <Row label="Storage Path">
                <span className="text-xs break-all">{doc.filePath || "—"}</span>
              </Row>
              <Row label="Tags">
                <div className="flex gap-1 flex-wrap justify-end">
                  {(doc.tags || []).filter((t) => !String(t).startsWith("note:")).length
                    ? doc.tags.filter((t) => !String(t).startsWith("note:")).map((t) => (
                        <span key={t} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{t}</span>
                      ))
                    : <span className="text-xs text-gray-400">None</span>}
                </div>
              </Row>
            </div>
          )}

          {tab === "activity" && (
            <div className="space-y-3">
              {activityLoading && <p className="text-xs text-gray-400">Loading activity…</p>}
              {!activityLoading && !activity.length && (
                <p className="text-xs text-gray-400">No activity recorded yet.</p>
              )}
              {activity.map((a) => (
                <div key={a.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm flex-shrink-0">
                    {ACTION_ICONS[a.action] || "•"}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-800 capitalize">
                      {a.action} <span className="font-normal text-gray-500">by {a.user}</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {a.time ? new Date(a.time).toLocaleString("en-IN") : "—"}
                    </p>
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
      <span className={`text-xs font-medium text-gray-800 text-right ${capitalize ? "capitalize" : ""}`}>{children}</span>
    </div>
  );
}
