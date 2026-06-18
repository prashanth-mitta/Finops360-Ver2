/* eslint-disable */
import React, { useState, useRef } from "react";

const CATEGORIES = [
  { id: "all", label: "All Documents", count: 34 },
  { id: "contracts", label: "Contracts", count: 8 },
  { id: "tax", label: "Tax & Compliance", count: 12 },
  { id: "financials", label: "Financials", count: 7 },
  { id: "identity", label: "KYC / Identity", count: 4 },
  { id: "invoices", label: "Invoices", count: 3 },
];

const ROLE_ACCESS = {
  "Master Admin": ["contracts", "tax", "financials", "identity", "invoices"],
  Sales: ["contracts", "invoices"],
  HR: ["identity"],
  Associate: ["contracts", "tax", "financials", "invoices"],
  Client: ["contracts", "tax", "invoices"],
};

const MOCK_DOCS = [
  {
    id: 1,
    name: "Client Services Agreement - Acme Corp",
    category: "contracts",
    client: "Acme Corp",
    size: "245 KB",
    type: "PDF",
    status: "signed",
    uploadedBy: "Priya S.",
    uploadedAt: "2025-05-28",
    tags: ["FY2025", "Active"],
    sharedWith: ["Client", "Associate"],
  },
  {
    id: 2,
    name: "GST Returns Q4 FY2024-25",
    category: "tax",
    client: "Acme Corp",
    size: "1.2 MB",
    type: "PDF",
    status: "approved",
    uploadedBy: "Rahul M.",
    uploadedAt: "2025-05-20",
    tags: ["Q4", "GST", "FY2025"],
    sharedWith: ["Client"],
  },
  {
    id: 3,
    name: "Balance Sheet FY2024-25",
    category: "financials",
    client: "Redwood Tech",
    size: "892 KB",
    type: "XLSX",
    status: "pending_sign",
    uploadedBy: "Arjun K.",
    uploadedAt: "2025-05-15",
    tags: ["FY2025", "Annual"],
    sharedWith: ["Client", "Associate"],
  },
  {
    id: 4,
    name: "PAN Card - Redwood Tech",
    category: "identity",
    client: "Redwood Tech",
    size: "120 KB",
    type: "JPG",
    status: "verified",
    uploadedBy: "HR Team",
    uploadedAt: "2025-04-10",
    tags: ["KYC"],
    sharedWith: ["Master Admin"],
  },
  {
    id: 5,
    name: "Invoice INV-2025-047",
    category: "invoices",
    client: "Lighthouse Ltd",
    size: "78 KB",
    type: "PDF",
    status: "approved",
    uploadedBy: "Priya S.",
    uploadedAt: "2025-05-30",
    tags: ["May 2025"],
    sharedWith: ["Client"],
  },
  {
    id: 6,
    name: "TDS Certificate Q3",
    category: "tax",
    client: "Lighthouse Ltd",
    size: "340 KB",
    type: "PDF",
    status: "approved",
    uploadedBy: "Rahul M.",
    uploadedAt: "2025-05-01",
    tags: ["TDS", "Q3"],
    sharedWith: ["Client"],
  },
  {
    id: 7,
    name: "NDA - Vertex Solutions",
    category: "contracts",
    client: "Vertex Solutions",
    size: "198 KB",
    type: "PDF",
    status: "draft",
    uploadedBy: "Sales Team",
    uploadedAt: "2025-05-25",
    tags: ["Draft"],
    sharedWith: [],
  },
  {
    id: 8,
    name: "Profit & Loss Statement",
    category: "financials",
    client: "Acme Corp",
    size: "654 KB",
    type: "XLSX",
    status: "approved",
    uploadedBy: "Arjun K.",
    uploadedAt: "2025-04-22",
    tags: ["FY2025"],
    sharedWith: ["Client"],
  },
];

const STATUS_CONFIG = {
  signed: { label: "Signed", color: "bg-green-100 text-green-700" },
  approved: { label: "Approved", color: "bg-blue-100 text-blue-700" },
  pending_sign: { label: "Pending Sign", color: "bg-amber-100 text-amber-700" },
  verified: { label: "Verified", color: "bg-purple-100 text-purple-700" },
  draft: { label: "Draft", color: "bg-gray-100 text-gray-600" },
};

const TYPE_ICON_COLOR = {
  PDF: "text-red-600 bg-red-50",
  XLSX: "text-green-600 bg-green-50",
  DOCX: "text-blue-600 bg-blue-50",
  JPG: "text-orange-600 bg-orange-50",
  PNG: "text-orange-600 bg-orange-50",
};

function FileTypeIcon({ type }) {
  const cls = TYPE_ICON_COLOR[type] || "text-gray-600 bg-gray-50";
  return (
    <div className={`w-10 h-12 rounded flex items-center justify-center text-xs font-bold ${cls}`}>
      {type}
    </div>
  );
}

export default function DocumentVault({ userRole, onSelectDoc, onUpload }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [viewMode, setViewMode] = useState("list"); // "list" | "grid"
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date");

  const allowedCats = ROLE_ACCESS[userRole] || [];

  const filtered = MOCK_DOCS.filter((doc) => {
    const catMatch =
      activeCategory === "all"
        ? allowedCats.includes(doc.category)
        : doc.category === activeCategory && allowedCats.includes(doc.category);
    const searchMatch =
      !search ||
      doc.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.client.toLowerCase().includes(search.toLowerCase());
    return catMatch && searchMatch;
  }).sort((a, b) => {
    if (sortBy === "date") return new Date(b.uploadedAt) - new Date(a.uploadedAt);
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return 0;
  });

  const visibleCategories = CATEGORIES.filter(
    (c) => c.id === "all" || allowedCats.includes(c.id)
  );

  return (
    <div className="flex gap-5">
      {/* Sidebar - Category Filters */}
      <div className="w-48 flex-shrink-0">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">
          Categories
        </p>
        <nav className="space-y-0.5">
          {visibleCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                activeCategory === cat.id
                  ? "bg-indigo-50 text-indigo-700 font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeCategory === cat.id
                    ? "bg-indigo-100 text-indigo-600"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {cat.count}
              </span>
            </button>
          ))}
        </nav>

        {/* Storage usage */}
        <div className="mt-6 px-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Storage Used</span>
            <span>3.7 / 10 GB</span>
          </div>
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full w-[37%] bg-indigo-500 rounded-full" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-sm">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search documents..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
          >
            <option value="date">Sort: Date</option>
            <option value="name">Sort: Name</option>
          </select>

          {/* View toggle */}
          <div className="flex border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-2 ${
                viewMode === "list" ? "bg-indigo-50 text-indigo-700" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-2 ${
                viewMode === "grid" ? "bg-indigo-50 text-indigo-700" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
          </div>

          <span className="text-sm text-gray-400">{filtered.length} documents</span>
        </div>

        {/* List View */}
        {viewMode === "list" && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">
                    Document
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">
                    Client
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">
                    Status
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">
                    Uploaded
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">
                    Size
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((doc) => {
                  const statusCfg = STATUS_CONFIG[doc.status] || STATUS_CONFIG.draft;
                  return (
                    <tr
                      key={doc.id}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => onSelectDoc(doc)}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <FileTypeIcon type={doc.type} />
                          <div>
                            <p className="text-sm font-medium text-gray-900 leading-snug">
                              {doc.name}
                            </p>
                            <div className="flex gap-1 mt-1 flex-wrap">
                              {doc.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-600">{doc.client}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusCfg.color}`}>
                          {statusCfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-600">
                          {new Date(doc.uploadedAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                        <p className="text-xs text-gray-400">{doc.uploadedBy}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-500">{doc.size}</span>
                      </td>
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <DocActions doc={doc} userRole={userRole} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="py-16 text-center">
                <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-sm text-gray-500">No documents found</p>
                <button
                  onClick={onUpload}
                  className="mt-3 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Upload a document →
                </button>
              </div>
            )}
          </div>
        )}

        {/* Grid View */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((doc) => {
              const statusCfg = STATUS_CONFIG[doc.status] || STATUS_CONFIG.draft;
              return (
                <div
                  key={doc.id}
                  onClick={() => onSelectDoc(doc)}
                  className="bg-white rounded-xl border border-gray-200 p-4 cursor-pointer hover:border-indigo-300 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <FileTypeIcon type={doc.type} />
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusCfg.color}`}>
                      {statusCfg.label}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 leading-snug line-clamp-2 mb-2">
                    {doc.name}
                  </p>
                  <p className="text-xs text-gray-400">{doc.client}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(doc.uploadedAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {doc.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function DocActions({ doc, userRole }) {
  const [open, setOpen] = useState(false);
  const canSendSign = ["Master Admin", "Associate"].includes(userRole) && doc.type === "PDF";
  const canDelete = userRole === "Master Admin";

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="5" r="1.5" />
          <circle cx="12" cy="12" r="1.5" />
          <circle cx="12" cy="19" r="1.5" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-8 z-20 w-44 bg-white rounded-lg border border-gray-200 shadow-lg py-1">
          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Preview
          </button>
          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
          </button>
          {canSendSign && (
            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Send for Signing
            </button>
          )}
          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share
          </button>
          {canDelete && (
            <>
              <div className="border-t border-gray-100 my-1" />
              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
