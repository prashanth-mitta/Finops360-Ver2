/* eslint-disable */
import React, { useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { useClientsQuery, uploadDocument } from "../../services/finops";

const CATEGORIES = [
  { value: "contracts", label: "Contracts" },
  { value: "tax", label: "Tax & Compliance" },
  { value: "financials", label: "Financials" },
  { value: "identity", label: "KYC / Identity" },
  { value: "invoices", label: "Invoices" },
];

const ROLE_OPTIONS = ["Master Admin", "Sales", "HR", "Associate", "Client"];

const ACCEPTED_TYPES = ".pdf,.xlsx,.docx,.jpg,.jpeg,.png,.csv";
const MAX_SIZE_MB = 25;

export default function DocumentUploadModal({ onClose, onUploaded }) {
  const { currentUser } = useAuth();
  const { items: clients, loading: clientsLoading } = useClientsQuery();
  const [files, setFiles] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [form, setForm] = useState({
    clientId: "",
    category: "",
    tags: "",
    sharedWith: [],
    note: "",
  });
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadedCount, setUploadedCount] = useState(0);
  const fileRef = useRef();

  const selectedClient = clients.find((c) => String(c.id) === String(form.clientId));

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    addFiles(Array.from(e.dataTransfer.files));
  };

  const addFiles = (newFiles) => {
    const valid = newFiles.filter((f) => f.size / 1024 / 1024 <= MAX_SIZE_MB);
    setFiles((prev) => [
      ...prev,
      ...valid.map((f) => ({ file: f, id: Math.random().toString(36).slice(2) })),
    ]);
  };

  const removeFile = (id) => setFiles((prev) => prev.filter((f) => f.id !== id));

  const toggleRole = (role) => {
    setForm((prev) => ({
      ...prev,
      sharedWith: prev.sharedWith.includes(role)
        ? prev.sharedWith.filter((r) => r !== role)
        : [...prev.sharedWith, role],
    }));
  };

  const handleUpload = async () => {
    if (!files.length || !form.clientId || !form.category || !currentUser?.tenantId) return;
    setUploadError("");
    setUploading(true);
    try {
      const tags = form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      if (form.note.trim()) tags.push(`note:${form.note.trim()}`);

      let count = 0;
      for (const { file } of files) {
        await uploadDocument(currentUser.tenantId, {
          file,
          clientId: form.clientId,
          clientName: selectedClient?.name || "",
          category: form.category,
          tags,
          uploadedBy: currentUser.name,
          userId: currentUser.id,
        });
        count += 1;
      }
      setUploadedCount(count);
      setDone(true);
      onUploaded?.();
    } catch (err) {
      setUploadError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const formatBytes = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1024 / 1024).toFixed(1) + " MB";
  };

  const fileIcon = (name) => {
    const ext = name.split(".").pop().toLowerCase();
    const map = { pdf: "🔴", xlsx: "🟢", docx: "🔵", jpg: "🟠", jpeg: "🟠", png: "🟠" };
    return map[ext] || "⚪";
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Upload Documents</h2>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {done ? (
          <div className="px-6 py-16 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {uploadedCount} document{uploadedCount > 1 ? "s" : ""} uploaded!
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Saved to Supabase Storage ({selectedClient?.name || "client"} vault).
            </p>
            <div className="flex gap-3 justify-center">
              <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                Done
              </button>
              <button
                type="button"
                onClick={() => {
                  setDone(false);
                  setFiles([]);
                  setForm({ clientId: "", category: "", tags: "", sharedWith: [], note: "" });
                }}
                className="px-4 py-2 text-sm font-medium border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Upload More
              </button>
            </div>
          </div>
        ) : (
          <div className="px-6 py-5 space-y-5">
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                dragging ? "border-indigo-400 bg-indigo-50" : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
              }`}
            >
              <input
                ref={fileRef}
                type="file"
                multiple
                accept={ACCEPTED_TYPES}
                className="hidden"
                onChange={(e) => addFiles(Array.from(e.target.files))}
              />
              <svg className={`w-10 h-10 mx-auto mb-3 ${dragging ? "text-indigo-400" : "text-gray-300"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <p className="text-sm font-medium text-gray-700">
                Drag & drop files here, or <span className="text-indigo-600">browse</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">PDF, XLSX, DOCX, JPG, PNG — max {MAX_SIZE_MB} MB each</p>
            </div>

            {files.length > 0 && (
              <div className="space-y-2">
                {files.map(({ file, id }) => (
                  <div key={id} className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-2.5">
                    <span className="text-lg">{fileIcon(file.name)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                      <p className="text-xs text-gray-400">{formatBytes(file.size)}</p>
                    </div>
                    <button type="button" onClick={() => removeFile(id)} className="text-gray-400 hover:text-red-500">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Client <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.clientId}
                  onChange={(e) => setForm({ ...form, clientId: e.target.value })}
                  disabled={clientsLoading || !clients.length}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white disabled:bg-gray-50"
                >
                  <option value="">{clientsLoading ? "Loading…" : clients.length ? "Select client…" : "No clients — onboard first"}</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
                >
                  <option value="">Select category…</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Tags</label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="e.g. FY2025, Q4, GST (comma separated)"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2">Visible To (Roles)</label>
              <div className="flex gap-2 flex-wrap">
                {ROLE_OPTIONS.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => toggleRole(role)}
                    className={`px-3 py-1.5 text-xs rounded-full border font-medium transition-colors ${
                      form.sharedWith.includes(role)
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Internal Note</label>
              <textarea
                rows={2}
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                placeholder="Optional note for team members…"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
              />
            </div>

            {uploadError && (
              <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{uploadError}</p>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800">
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpload}
                disabled={!files.length || !form.clientId || !form.category || uploading}
                className="flex items-center gap-2 px-5 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {uploading ? "Uploading to Supabase…" : `Upload ${files.length > 0 ? `${files.length} file${files.length > 1 ? "s" : ""}` : ""}`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
