/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, CheckCircle, AlertCircle, Send, Lock, Upload, FileText, Clock, User } from 'lucide-react';
import { TICKETS, STAGE } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

const STAGE_LABELS = {
  [STAGE.DOCS]: 'Waiting for documents',
  [STAGE.MAKER]: 'Work in progress',
  [STAGE.CHECKER]: 'Under review',
  [STAGE.DONE]: 'Completed',
};

export default function ClientTicketDetail({ ticketId, onBack }) {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const bottomRef = useRef(null);
  const ticket = TICKETS.find(t => t.id === ticketId);

  useEffect(() => {
    if (ticket) setMessages(ticket.chat || []);
  }, [ticketId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!ticket) return null;

  const isMe = (msg) => msg.fromRole === 'client';
  const formatTime = (ts) => new Date(ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  const send = () => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, {
      id: `m${Date.now()}`, from: currentUser.clientId,
      fromName: `${currentUser.firstName} ${currentUser.lastName}`,
      fromRole: 'client', text: text.trim(),
      timestamp: new Date().toISOString(), type: 'text',
    }]);
    setText('');
  };

  const pendingDocs = ticket.checklist.filter(c => !c.received).length;
  const receivedDocs = ticket.checklist.filter(c => c.received).length;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-5 transition-colors">
        <ArrowLeft size={16} /> Back
      </button>

      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <span className="text-xs font-mono text-gray-400">{ticket.id}</span>
            <h1 className="text-lg font-bold text-gray-900 mt-0.5">{ticket.title}</h1>
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold flex-shrink-0 ${
            ticket.stage === STAGE.DOCS ? 'bg-amber-50 text-amber-700' :
            ticket.stage === STAGE.MAKER ? 'bg-blue-50 text-blue-700' :
            ticket.stage === STAGE.CHECKER ? 'bg-purple-50 text-purple-700' :
            'bg-green-50 text-green-700'
          }`}>{STAGE_LABELS[ticket.stage]}</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1"><User size={12} />Associate: {ticket.assignedToName}</span>
          <span className="flex items-center gap-1"><Clock size={12} />Due: {ticket.dueDate}</span>
        </div>
        {ticket.stage === STAGE.DOCS && pendingDocs > 0 && (
          <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-100 flex items-center gap-2">
            <AlertCircle size={15} className="text-amber-600 flex-shrink-0" />
            <p className="text-xs text-amber-700 font-medium">{pendingDocs} document{pendingDocs > 1 ? 's' : ''} still pending. Please upload them to proceed.</p>
          </div>
        )}
        {ticket.stage === STAGE.DONE && (
          <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-100 flex items-center gap-2">
            <CheckCircle size={15} className="text-green-600 flex-shrink-0" />
            <p className="text-xs text-green-700 font-medium">Completed. {ticket.arn ? `ARN: ${ticket.arn}` : ''}</p>
          </div>
        )}
      </div>

      {/* Checklist summary */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-700">Documents</h3>
          <span className="text-xs text-gray-500">{receivedDocs}/{ticket.checklist.length} received</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.round((receivedDocs / ticket.checklist.length) * 100)}%` }} />
        </div>
        <div className="space-y-1.5 max-h-40 overflow-y-auto">
          {ticket.checklist.map(item => (
            <div key={item.id} className={`flex items-center gap-2 p-2 rounded-lg ${item.received ? 'bg-green-50' : 'bg-gray-50'}`}>
              <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${item.received ? 'bg-green-500' : 'border-2 border-gray-200'}`}>
                {item.received && <span className="text-white text-xs">✓</span>}
              </div>
              <span className={`text-xs ${item.received ? 'text-green-800' : 'text-gray-600'}`}>{item.label}</span>
              {item.mandatory && !item.received && <span className="text-xs text-red-500 ml-auto">Required</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Chat */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700">Messages with {ticket.assignedToName}</h3>
        </div>
        <div className="p-4 space-y-3 min-h-[200px] max-h-[300px] overflow-y-auto bg-gray-50">
          {messages.map(msg => {
            const mine = isMe(msg);
            return (
              <div key={msg.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] flex flex-col gap-1 ${mine ? 'items-end' : 'items-start'}`}>
                  {!mine && <span className="text-xs text-gray-500 ml-1 font-medium">{msg.fromName}</span>}
                  <div className={`px-4 py-2.5 rounded-2xl text-sm ${mine ? 'bg-blue-700 text-white rounded-tr-sm' : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm'}`}>
                    {msg.text}
                  </div>
                  <span className="text-xs text-gray-400 mx-1">{formatTime(msg.timestamp)}</span>
                </div>
              </div>
            );
          })}
          {messages.length === 0 && (
            <div className="text-center py-6 text-gray-400 text-sm">No messages yet</div>
          )}
          <div ref={bottomRef} />
        </div>
        <div className="p-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-xs text-amber-600 mb-2">
            <Lock size={11} /> All communication must be on FinOps 360 only
          </div>
          <div className="flex gap-2">
            <input className="input-field flex-1 text-sm" placeholder="Type your message..."
              value={text} onChange={e => setText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()} />
            <button onClick={send} disabled={!text.trim()}
              className="w-10 h-10 rounded-lg bg-blue-700 flex items-center justify-center text-white hover:bg-blue-800 disabled:opacity-40 flex-shrink-0">
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
