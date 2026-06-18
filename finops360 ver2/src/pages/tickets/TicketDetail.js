/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft, CheckCircle, Circle, Upload, Send, Clock,
  AlertTriangle, FileText, MessageSquare, History, ChevronRight,
  Check, X, Plus, Lock, User, ArrowRight, RotateCcw
} from 'lucide-react';
import { TICKETS, STAGE } from '../../data/mockData';
import { useAuth, ROLES } from '../../context/AuthContext';
import { StageTag, PriorityTag } from '../../components/common/UIComponents';

const STAGE_STEPS = [
  { key: STAGE.DOCS, num: 1, label: 'Doc Collection', sub: 'Collect all required documents' },
  { key: STAGE.MAKER, num: 2, label: 'Maker', sub: 'Work on the task' },
  { key: STAGE.CHECKER, num: 3, label: 'Checker Review', sub: 'Review & verify' },
  { key: STAGE.DONE, num: 4, label: 'Completed', sub: 'Filed & archived' },
];

const STAGE_ORDER = [STAGE.DOCS, STAGE.MAKER, STAGE.CHECKER, STAGE.DONE];

function StageProgress({ stage }) {
  const current = STAGE_ORDER.indexOf(stage);
  return (
    <div className="flex items-center gap-0">
      {STAGE_STEPS.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <React.Fragment key={s.key}>
            <div className="flex flex-col items-center flex-shrink-0">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                done ? 'bg-green-500 text-white' : active ? 'bg-blue-700 text-white ring-4 ring-blue-100' : 'bg-gray-100 text-gray-400'
              }`}>
                {done ? <Check size={16} /> : s.num}
              </div>
              <div className={`text-xs mt-1.5 font-medium text-center whitespace-nowrap ${active ? 'text-blue-700' : done ? 'text-green-600' : 'text-gray-400'}`}>
                {s.label}
              </div>
              <div className="text-xs text-gray-400 text-center max-w-[80px] leading-tight hidden md:block">{s.sub}</div>
            </div>
            {i < STAGE_STEPS.length - 1 && (
              <div className={`h-0.5 flex-1 mx-2 mb-6 min-w-[16px] transition-colors ${i < current ? 'bg-green-400' : 'bg-gray-100'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function ChecklistPanel({ ticket, onUpdate }) {
  const [newDoc, setNewDoc] = useState('');
  const allMandatoryReceived = ticket.checklist.filter(c => c.mandatory).every(c => c.received);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">Document checklist</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">{ticket.checklist.filter(c => c.received).length}/{ticket.checklist.length} received</span>
          <div className="w-20 bg-gray-100 rounded-full h-1.5">
            <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${Math.round((ticket.checklist.filter(c => c.received).length / ticket.checklist.length) * 100)}%` }} />
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-3">
        {ticket.checklist.map(item => (
          <div key={item.id} className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
            item.received ? 'border-green-100 bg-green-50' : 'border-gray-100 bg-white'
          }`}>
            <button
              onClick={() => onUpdate && onUpdate(item.id, !item.received)}
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                item.received ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-green-400'
              }`}
            >
              {item.received && <Check size={11} className="text-white" />}
            </button>
            <span className={`text-sm flex-1 ${item.received ? 'text-green-700 line-through decoration-green-300' : 'text-gray-700'}`}>
              {item.label}
            </span>
            {item.mandatory && !item.received && (
              <span className="text-xs text-red-500 font-medium flex-shrink-0">Required</span>
            )}
            {item.received && <CheckCircle size={14} className="text-green-500 flex-shrink-0" />}
          </div>
        ))}
      </div>

      {/* Add custom doc */}
      <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
        <input className="input-field flex-1 text-sm" placeholder="Add a document to the list..."
          value={newDoc} onChange={e => setNewDoc(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && newDoc.trim() && onUpdate && onUpdate('add', newDoc)} />
        <button onClick={() => newDoc.trim() && onUpdate && onUpdate('add', newDoc)}
          className="btn-secondary flex items-center gap-1 text-sm flex-shrink-0">
          <Plus size={14} /> Add
        </button>
      </div>

      {allMandatoryReceived && ticket.stage === STAGE.DOCS && (
        <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-100">
          <p className="text-sm text-green-700 font-medium flex items-center gap-2">
            <CheckCircle size={16} /> All required documents received
          </p>
          <p className="text-xs text-green-600 mt-1">You can now move this ticket to the Maker stage.</p>
        </div>
      )}
    </div>
  );
}

function ChatPanel({ ticket }) {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState(ticket.chat || []);
  const [text, setText] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = () => {
    if (!text.trim()) return;
    const newMsg = {
      id: `m${Date.now()}`,
      from: currentUser.id,
      fromName: `${currentUser.firstName} ${currentUser.lastName}`,
      fromRole: currentUser.role,
      text: text.trim(),
      timestamp: new Date().toISOString(),
      type: 'text',
    };
    setMessages(prev => [...prev, newMsg]);
    setText('');
  };

  const isMe = (msg) => msg.from === currentUser.id || msg.from === currentUser.clientId;

  const formatTime = (ts) => new Date(ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const formatDate = (ts) => new Date(ts).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0" style={{ maxHeight: '380px' }}>
        {messages.length === 0 && (
          <div className="text-center py-8">
            <MessageSquare size={24} className="text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-400">No messages yet. Start the conversation.</p>
          </div>
        )}
        {messages.map((msg, i) => {
          const mine = isMe(msg);
          const showDate = i === 0 || formatDate(messages[i - 1].timestamp) !== formatDate(msg.timestamp);
          return (
            <React.Fragment key={msg.id}>
              {showDate && (
                <div className="text-center">
                  <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{formatDate(msg.timestamp)}</span>
                </div>
              )}
              <div className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] ${mine ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                  {!mine && (
                    <div className="flex items-center gap-1.5 ml-1">
                      <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                        {msg.fromName?.[0]}
                      </div>
                      <span className="text-xs text-gray-500 font-medium">{msg.fromName}</span>
                    </div>
                  )}
                  <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    mine
                      ? 'bg-blue-700 text-white rounded-tr-sm'
                      : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm'
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-xs text-gray-400 mx-1">{formatTime(msg.timestamp)}</span>
                </div>
              </div>
            </React.Fragment>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="p-3 border-t border-gray-100 bg-gray-50 rounded-b-xl">
        <div className="flex items-center gap-2 text-xs text-amber-600 mb-2">
          <Lock size={11} />
          <span>All communication must be on FinOps 360 only. Calls or WhatsApp are not encouraged.</span>
        </div>
        <div className="flex gap-2">
          <input
            className="input-field flex-1 text-sm"
            placeholder="Type your message..."
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
          />
          <button onClick={send} disabled={!text.trim()}
            className="w-10 h-10 rounded-lg bg-blue-700 flex items-center justify-center text-white hover:bg-blue-800 disabled:opacity-40 flex-shrink-0 transition-colors">
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function HistoryPanel({ ticket }) {
  return (
    <div className="space-y-0">
      {ticket.history.map((h, i) => (
        <div key={i} className="flex gap-3 pb-4 relative">
          {i < ticket.history.length - 1 && (
            <div className="absolute left-3 top-6 bottom-0 w-0.5 bg-gray-100" />
          )}
          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 z-10">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
          </div>
          <div className="flex-1 min-w-0 pt-0.5">
            <p className="text-sm font-medium text-gray-800">{h.action}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {h.by} · {new Date(h.at).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

const TABS = [
  { key: 'checklist', label: 'Documents', icon: FileText },
  { key: 'chat', label: 'Chat', icon: MessageSquare },
  { key: 'history', label: 'History', icon: History },
];

export default function TicketDetail({ ticketId, onBack }) {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('checklist');
  const [ticket, setTicket] = useState(() => TICKETS.find(t => t.id === ticketId));
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [checkerRemark, setCheckerRemark] = useState('');

  if (!ticket) return null;

  const isOverdue = ticket.stage !== STAGE.DONE && new Date(ticket.dueDate) < new Date();
  const currentStageIdx = STAGE_ORDER.indexOf(ticket.stage);
  const canAdvance = ticket.stage !== STAGE.DONE;
  const isChecker = currentUser?.role === ROLES.MASTER_ADMIN || currentUser?.role === ROLES.ASSOCIATE;

  const handleChecklistUpdate = (id, value) => {
    if (id === 'add') {
      setTicket(prev => ({
        ...prev,
        checklist: [...prev.checklist, { id: `c${Date.now()}`, label: value, mandatory: false, received: false, custom: true }]
      }));
    } else {
      setTicket(prev => ({
        ...prev,
        checklist: prev.checklist.map(c => c.id === id ? { ...c, received: value } : c)
      }));
    }
  };

  const advanceStage = () => {
    if (!canAdvance) return;
    const nextStage = STAGE_ORDER[currentStageIdx + 1];
    const actionLabels = {
      [STAGE.MAKER]: 'Moved to Maker stage',
      [STAGE.CHECKER]: 'Submitted for checker review',
      [STAGE.DONE]: 'Approved and completed by checker',
    };
    setTicket(prev => ({
      ...prev,
      stage: nextStage,
      history: [...prev.history, { action: actionLabels[nextStage] || 'Stage advanced', by: `${currentUser.firstName} ${currentUser.lastName}`, at: new Date().toISOString() }],
    }));
    setShowMoveModal(false);
  };

  const sendBack = () => {
    setTicket(prev => ({
      ...prev,
      stage: STAGE.MAKER,
      history: [...prev.history, {
        action: `Sent back to Maker with remarks: "${checkerRemark || 'Please review'}"`,
        by: `${currentUser.firstName} ${currentUser.lastName}`,
        at: new Date().toISOString()
      }],
    }));
    setShowMoveModal(false);
    setCheckerRemark('');
  };

  const stageActions = {
    [STAGE.DOCS]: { label: 'Move to Maker', color: 'bg-purple-600 hover:bg-purple-700', desc: 'All docs received? Move to Maker stage to start work.' },
    [STAGE.MAKER]: { label: 'Submit for Review', color: 'bg-amber-500 hover:bg-amber-600', desc: 'Work done? Submit to Checker for review.' },
    [STAGE.CHECKER]: { label: 'Approve & Complete', color: 'bg-green-600 hover:bg-green-700', desc: 'Verified and accurate? Approve to mark as complete.' },
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-5 transition-colors">
        <ArrowLeft size={16} /> Back to tickets
      </button>

      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-5">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{ticket.id}</span>
              <PriorityTag priority={ticket.priority} />
              <StageTag stage={ticket.stage} />
              {isOverdue && (
                <span className="flex items-center gap-1 text-xs text-red-600 font-semibold bg-red-50 px-2 py-0.5 rounded-full">
                  <AlertTriangle size={11} /> Overdue
                </span>
              )}
            </div>
            <h1 className="text-xl font-bold text-gray-900">{ticket.title}</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 flex-wrap">
              <span>Client: <strong className="text-gray-700">{ticket.clientName}</strong></span>
              <span>Assigned: <strong className="text-gray-700">{ticket.assignedToName}</strong></span>
              <span className={`flex items-center gap-1 ${isOverdue ? 'text-red-600 font-semibold' : ''}`}>
                <Clock size={13} /> Due: {ticket.dueDate}
              </span>
            </div>
          </div>

          {/* Stage action button */}
          {ticket.stage !== STAGE.DONE && isChecker && (
            <button onClick={() => setShowMoveModal(true)}
              className={`text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 flex-shrink-0 ${stageActions[ticket.stage]?.color}`}>
              {stageActions[ticket.stage]?.label} <ArrowRight size={14} />
            </button>
          )}
        </div>

        {/* Stage progress */}
        <div className="pt-5 border-t border-gray-50">
          <StageProgress stage={ticket.stage} />
        </div>
      </div>

      {/* Move stage modal */}
      {showMoveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl">
            <h3 className="text-base font-bold text-gray-900 mb-2">{stageActions[ticket.stage]?.label}</h3>
            <p className="text-sm text-gray-500 mb-4">{stageActions[ticket.stage]?.desc}</p>

            {ticket.stage === STAGE.CHECKER && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Remarks (optional)</label>
                <textarea rows={3} className="input-field text-sm" placeholder="Add any remarks or observations..."
                  value={checkerRemark} onChange={e => setCheckerRemark(e.target.value)} />
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => setShowMoveModal(false)} className="btn-secondary flex-1">Cancel</button>
              {ticket.stage === STAGE.CHECKER && (
                <button onClick={sendBack} className="flex-1 bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-600 flex items-center justify-center gap-1.5">
                  <RotateCcw size={14} /> Send back
                </button>
              )}
              <button onClick={advanceStage} className={`flex-1 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 ${stageActions[ticket.stage]?.color}`}>
                <Check size={14} /> Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Left panel — tabs */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="flex border-b border-gray-100">
              {TABS.map(tab => {
                const Icon = tab.icon;
                return (
                  <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-1.5 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.key ? 'border-blue-700 text-blue-700' : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}>
                    <Icon size={14} /> {tab.label}
                    {tab.key === 'chat' && ticket.chat.length > 0 && (
                      <span className="bg-blue-100 text-blue-700 text-xs px-1.5 py-0.5 rounded-full ml-0.5">{ticket.chat.length}</span>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="p-5">
              {activeTab === 'checklist' && <ChecklistPanel ticket={ticket} onUpdate={handleChecklistUpdate} />}
              {activeTab === 'chat' && <ChatPanel ticket={ticket} />}
              {activeTab === 'history' && <HistoryPanel ticket={ticket} />}
            </div>
          </div>
        </div>

        {/* Right panel — details */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Ticket details</h3>
            {[
              { label: 'Task type', value: ticket.type },
              { label: 'Client', value: ticket.clientName },
              { label: 'Period', value: ticket.period || ticket.ay || '—' },
              { label: 'Due date', value: ticket.dueDate },
              { label: 'Internal target', value: ticket.internalTargetDate || '—' },
              { label: 'Assigned to', value: ticket.assignedToName },
              { label: 'Created', value: ticket.createdAt?.split('T')[0] },
            ].map(row => (
              <div key={row.label} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
                <span className="text-xs text-gray-400">{row.label}</span>
                <span className="text-xs font-medium text-gray-800 text-right">{row.value}</span>
              </div>
            ))}
          </div>

          {ticket.completionNotes && (
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Completion notes</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{ticket.completionNotes}</p>
              {ticket.arn && (
                <div className="mt-3 p-2 bg-green-50 rounded-lg">
                  <p className="text-xs text-green-700 font-medium">ARN / Acknowledgement: {ticket.arn}</p>
                </div>
              )}
            </div>
          )}

          {ticket.stage === STAGE.DONE && (
            <div className="bg-green-50 rounded-xl border border-green-100 p-4 text-center">
              <CheckCircle size={28} className="text-green-500 mx-auto mb-2" />
              <p className="text-sm font-semibold text-green-700">Task completed</p>
              <p className="text-xs text-green-600 mt-1">All work verified and archived</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
