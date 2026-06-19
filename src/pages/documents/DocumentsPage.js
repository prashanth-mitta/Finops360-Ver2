/* eslint-disable */
import React, { useState, useRef } from "react";
import DocumentVault from "./DocumentVault";
import DocumentUploadModal from "./DocumentUploadModal";
import DocumentViewer from "./DocumentViewer";
import ESignWorkflow from "./ESignWorkflow";
import AuditTrail from "./AuditTrail";

const TABS = [
  { id: "vault", label: "Document Vault", icon: "folder" },
  { id: "esign", label: "E-Sign", icon: "writing" },
  { id: "audit", label: "Audit Trail", icon: "history" },
];

export default function DocumentsPage({ userRole = "Master Admin" }) {
  const [activeTab, setActiveTab] = useState("vault");
  const [showUpload, setShowUpload] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Document Management</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Secure vault · E-sign workflows · Audit trails
            </p>
          </div>
          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Upload Document
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-4">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === "vault" && (
          <DocumentVault
            userRole={userRole}
            onSelectDoc={setSelectedDoc}
            onUpload={() => setShowUpload(true)}
          />
        )}
        {activeTab === "esign" && <ESignWorkflow userRole={userRole} />}
        {activeTab === "audit" && <AuditTrail userRole={userRole} />}
      </div>

      {/* Modals */}
      {showUpload && (
        <DocumentUploadModal onClose={() => setShowUpload(false)} />
      )}
      {selectedDoc && (
        <DocumentViewer doc={selectedDoc} onClose={() => setSelectedDoc(null)} userRole={userRole} />
      )}
    </div>
  );
}
