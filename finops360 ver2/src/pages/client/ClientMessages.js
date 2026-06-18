/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from 'react';
import { Send, Lock, MessageSquare, ChevronRight, Paperclip, CheckCircle } from 'lucide-react';
import { TICKETS, STAGE } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

const STAGE_LABELS = {
  [STAGE.DOCS]: 'Doc Collection',
  [STAGE.MAKER]: 'In Progress',
  [STAGE.CHECKER]: 'Under Review',
  [STAGE.DONE]: 'Completed',
};

export default function ClientMessages() {
  const { currentUser } = useAuth();
  const myTickets = TICKETS.filter(t => t.clientId === currentUser?.clientId);
  const [selectedTicketId, setSelectedTicketId] = useState(myTickets[0]?.id || null);
  const [messagesByTicket, setMessagesByTicket] = useState(
    Object.fromEntries(myTickets.map(t => [t.id, t.chat || []]))
  );
  const [text, setText] = useState('');
  const bottomRef = useRef(null);

  const selectedTicket = myTickets.find(t => t.id === selectedTicketId);
  const messages = messagesByTicket[selectedTicketId] || [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedTicketId]);

  const isMe = (msg) => msg.from === currentUser?.clientId || msg.fromRole === 'client';

  const send = () => {
    if (!text.trim() || !selectedTicketId) return;
    const newMsg = {
      id: `m${Date.now()}`,
      from: currentUser.clientId,
      fromName: `${currentUser.firstName} ${currentUser.lastName}`,
      fromRole: 'client',
      text: text.trim(),
      timestamp: new Date().toISOString(),
      type: 'text',
    };
    setMessagesByTicket(prev => ({
      ...prev,
      [selectedTicketId]: [...(prev[selectedTicketId] || []), newMsg],
    }));
    setText('');
  };

  const formatTime = (ts) => new Date(ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const formatDate = (ts) => {
    const d = new Date(ts);
    const today = new Date();
    const diff = Math.floor((today - d) / 86400000);
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  const getLastMessage = (ticketId) => {
    const msgs = messagesByTicket[ticketId] || [];
    return msgs[msgs.length - 1];
  };

  return (
    <div className="flex h-[calc(100vh-120px)] min-h-[500px]">
      {/* Ticket list sidebar */}
      <div className="w-72 flex-shrink-0 bg-white border-r border-gray-100 flex flex-col">
        <div className="px-4 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Messages</h2>
          <p className="text-xs text-gray-400 mt-0.5">Chat with your associate</p>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
          {myTickets.map(t => {
            const last = getLastMessage(t.id);
            const isSelected = selectedTicketId === t.id;
            return (
              <button key={t.id} onClick={() => setSelectedTicketId(t.id)}
                className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${isSelected ? 'bg-blue-50 border-l-2 border-blue-700' : ''}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-mono text-gray-400 mb-0.5">{t.id}</div>
                    <div className="text-sm font-medium text-gray-900 truncate">{t.title}</div>
                    {last && (
                      <div className="text-xs text-gray-400 mt-0.5 truncate">
                        {isMe(last) ? 'You: ' : ''}{last.text}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                      t.stage === STAGE.DOCS ? 'bg-amber-50 text-amber-700' :
                      t.stage === STAGE.MAKER ? 'bg-blue-50 text-blue-700' :
                      t.stage === STAGE.CHECKER ? 'bg-purple-50 text-purple-700' :
                      'bg-green-50 text-green-700'
                    }`}>{STAGE_LABELS[t.stage]}</span>
                    {last && <span className="text-xs text-gray-400">{formatTime(last.timestamp)}</span>}
                  </div>
                </div>
              </button>
            );
          })}
          {myTickets.length === 0 && (
            <div className="p-8 text-center">
              <MessageSquare size={24} className="text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-400">No active tasks</p>
            </div>
          )}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {selectedTicket ? (
          <>
            {/* Chat header */}
            <div className="px-5 py-3.5 border-b border-gray-100 bg-white flex items-center justify-between">
              <div>
                <div className="text-xs font-mono text-gray-400">{selectedTicket.id}</div>
                <div className="text-sm font-semibold text-gray-900">{selectedTicket.title}</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="text-xs text-gray-500">Your associate</div>
                  <div className="text-sm font-medium text-gray-800">{selectedTicket.assignedToName}</div>
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {selectedTicket.assignedToName?.split(' ').map(n => n[0]).join('')}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-gray-50">
              {messages.length === 0 && (
                <div className="text-center py-12">
                  <MessageSquare size={28} className="text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">No messages yet</p>
                  <p className="text-xs text-gray-300 mt-1">Send a message to your associate</p>
                </div>
              )}
              {messages.map((msg, i) => {
                const mine = isMe(msg);
                const showDate = i === 0 || formatDate(messages[i - 1].timestamp) !== formatDate(msg.timestamp);
                return (
                  <React.Fragment key={msg.id}>
                    {showDate && (
                      <div className="text-center">
                        <span className="text-xs text-gray-400 bg-gray-200 px-3 py-1 rounded-full">{formatDate(msg.timestamp)}</span>
                      </div>
                    )}
                    <div className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] flex flex-col gap-1 ${mine ? 'items-end' : 'items-start'}`}>
                        {!mine && (
                          <div className="flex items-center gap-1.5 ml-1">
                            <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">{msg.fromName?.[0]}</div>
                            <span className="text-xs text-gray-500 font-medium">{msg.fromName}</span>
                          </div>
                        )}
                        <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                          mine ? 'bg-blue-700 text-white rounded-tr-sm' : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm shadow-sm'
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

            {/* Input */}
            <div className="p-4 border-t border-gray-100 bg-white">
              <div className="flex items-center gap-1.5 text-xs text-amber-600 mb-2 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100">
                <Lock size={11} />
                All communication is on FinOps 360 only — calls and WhatsApp are discouraged
              </div>
              <div className="flex gap-2">
                <input className="input-field flex-1 text-sm" placeholder="Type your message..."
                  value={text} onChange={e => setText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()} />
                <button onClick={send} disabled={!text.trim()}
                  className="w-10 h-10 rounded-lg bg-blue-700 flex items-center justify-center text-white hover:bg-blue-800 disabled:opacity-40 flex-shrink-0 transition-colors">
                  <Send size={16} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare size={32} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400">Select a task to view messages</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
