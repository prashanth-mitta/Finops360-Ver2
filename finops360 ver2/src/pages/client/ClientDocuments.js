/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Upload, CheckCircle, AlertCircle, FileText, X, FolderOpen, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { TICKETS, STAGE } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

function FileUploadZone({ onUpload, ticketId, itemId }) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleFiles = (files) => {
    if (!files.length) return;
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setUploaded(true);
      onUpload && onUpload(ticketId, itemId, files[0].name);
    }, 1500);
  };

  if (uploaded) {
    return (
      <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg border border-green-100">
        <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
        <span className="text-xs text-green-700 font-medium">Uploaded successfully</span>
      </div>
    );
  }

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-lg p-3 text-center transition-all ${dragging ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}`}
    >
      {uploading ? (
        <div className="flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-blue-600">Uploading...</span>
        </div>
      ) : (
        <>
          <Upload size={16} className="text-gray-400 mx-auto mb-1" />
          <p className="text-xs text-gray-500">Drag & drop or <label className="text-blue-600 cursor-pointer hover:underline">
            browse
            <input type="file" className="hidden" onChange={e => handleFiles(e.target.files)}
              accept=".pdf,.xlsx,.xls,.jpg,.jpeg,.png,.doc,.docx" />
          </label></p>
          <p className="text-xs text-gray-400 mt-0.5">PDF, Excel, Word, JPG accepted</p>
        </>
      )}
    </div>
  );
}

export default function ClientDocuments() {
  const { currentUser } = useAuth();
  const [expandedTicket, setExpandedTicket] = useState(null);
  const [uploadedDocs, setUploadedDocs] = useState({});

  const myTickets = TICKETS.filter(t =>
    t.clientId === currentUser?.clientId && t.stage !== STAGE.DONE
  );
  const docsTickets = myTickets.filter(t => t.stage === STAGE.DOCS);
  const otherTickets = myTickets.filter(t => t.stage !== STAGE.DOCS);

  const handleUpload = (ticketId, itemId, fileName) => {
    setUploadedDocs(prev => ({ ...prev, [`${ticketId}-${itemId}`]: fileName }));
  };

  const isUploaded = (ticketId, itemId) => !!uploadedDocs[`${ticketId}-${itemId}`] || false;

  const totalPending = docsTickets.reduce((acc, t) =>
    acc + t.checklist.filter(c => !c.received && !isUploaded(t.id, c.id)).length, 0);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Upload documents</h1>
        <p className="text-sm text-gray-400 mt-0.5">Upload the documents your associate has requested</p>
      </div>

      {/* Summary banner */}
      {totalPending > 0 ? (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5 flex items-center gap-3">
          <AlertCircle size={20} className="text-amber-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-800">{totalPending} document{totalPending > 1 ? 's' : ''} pending upload</p>
            <p className="text-xs text-amber-700 mt-0.5">Please upload all pending documents to help your associate complete your work on time.</p>
          </div>
        </div>
      ) : docsTickets.length === 0 ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-5 flex items-center gap-3">
          <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-green-800">No documents pending!</p>
            <p className="text-xs text-green-700 mt-0.5">All document requests have been fulfilled.</p>
          </div>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-5 flex items-center gap-3">
          <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
          <p className="text-sm font-semibold text-green-800">All documents uploaded! Your associate will begin work shortly.</p>
        </div>
      )}

      {/* Tickets needing docs */}
      {docsTickets.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Documents requested</h2>
          <div className="space-y-3">
            {docsTickets.map(t => {
              const pendingItems = t.checklist.filter(c => !c.received && !isUploaded(t.id, c.id));
              const receivedItems = t.checklist.filter(c => c.received || isUploaded(t.id, c.id));
              const isExpanded = expandedTicket === t.id;

              return (
                <div key={t.id} className="bg-white rounded-xl border border-amber-200 overflow-hidden">
                  <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => setExpandedTicket(isExpanded ? null : t.id)}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-mono text-gray-400">{t.id}</span>
                        {pendingItems.length > 0
                          ? <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">{pendingItems.length} pending</span>
                          : <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">All uploaded</span>
                        }
                      </div>
                      <p className="text-sm font-semibold text-gray-900 truncate">{t.title}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                      <div className="text-xs text-gray-500">{receivedItems.length}/{t.checklist.length}</div>
                      {isExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-gray-100 p-4 space-y-4">
                      {/* Pending items */}
                      {pendingItems.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-2">Pending upload</p>
                          <div className="space-y-3">
                            {pendingItems.map(item => (
                              <div key={item.id} className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                                <div className="flex items-center gap-2 mb-2">
                                  <FileText size={14} className="text-amber-600 flex-shrink-0" />
                                  <span className="text-sm font-medium text-gray-800">{item.label}</span>
                                  {item.mandatory && <span className="text-xs text-red-500 font-medium ml-auto">Required</span>}
                                </div>
                                <FileUploadZone
                                  ticketId={t.id}
                                  itemId={item.id}
                                  onUpload={handleUpload}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Received items */}
                      {receivedItems.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-2">Uploaded / received</p>
                          <div className="space-y-1.5">
                            {receivedItems.map(item => (
                              <div key={item.id} className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                                <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
                                <span className="text-sm text-green-800">{item.label}</span>
                                {uploadedDocs[`${t.id}-${item.id}`] && (
                                  <span className="text-xs text-green-600 ml-auto truncate max-w-[120px]">
                                    {uploadedDocs[`${t.id}-${item.id}`]}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Other active tickets */}
      {otherTickets.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Other active tasks</h2>
          <div className="space-y-2">
            {otherTickets.map(t => (
              <div key={t.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{t.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {t.stage === STAGE.MAKER ? 'Your associate is working on this' :
                      t.stage === STAGE.CHECKER ? 'Under review for accuracy' : ''}
                  </p>
                </div>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium flex-shrink-0 ${
                  t.stage === STAGE.MAKER ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
                }`}>
                  {t.stage === STAGE.MAKER ? 'In progress' : 'Under review'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Document guidelines */}
      <div className="bg-gray-50 rounded-xl border border-gray-100 p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <FolderOpen size={16} className="text-gray-500" /> Document upload guidelines
        </h3>
        <ul className="space-y-1.5 text-xs text-gray-500">
          <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">•</span>Accepted formats: PDF, Excel (.xlsx), Word (.docx), JPG, PNG</li>
          <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">•</span>Maximum file size: 10 MB per document</li>
          <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">•</span>Ensure documents are clear and fully readable</li>
          <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">•</span>Bank statements should be in PDF format (downloaded from your bank's internet banking)</li>
          <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">•</span>All documents are stored securely and are only accessible to your assigned associate</li>
          <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">•</span>If you have any questions, use the Messages section to contact your associate</li>
        </ul>
      </div>
    </div>
  );
}
