/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Search, Plus, Filter, LayoutGrid, List, Clock, AlertTriangle, ChevronRight, Calendar, User } from 'lucide-react';
import { TICKETS, STAGE, CLIENTS } from '../../data/mockData';
import { useAuth, ROLES } from '../../context/AuthContext';
import { StageTag, PriorityTag } from '../../components/common/UIComponents';

const STAGE_COLUMNS = [
  { key: STAGE.DOCS, label: 'Doc Collection', color: 'border-blue-300 bg-blue-50', headerColor: 'bg-blue-600', dot: 'bg-blue-500' },
  { key: STAGE.MAKER, label: 'Maker', color: 'border-purple-300 bg-purple-50', headerColor: 'bg-purple-600', dot: 'bg-purple-500' },
  { key: STAGE.CHECKER, label: 'Checker Review', color: 'border-amber-300 bg-amber-50', headerColor: 'bg-amber-500', dot: 'bg-amber-500' },
  { key: STAGE.DONE, label: 'Completed', color: 'border-green-300 bg-green-50', headerColor: 'bg-green-600', dot: 'bg-green-500' },
];

export default function TicketsList({ onSelectTicket, onCreateTicket }) {
  const { currentUser } = useAuth();
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('kanban'); // kanban | table
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStage, setFilterStage] = useState('all');

  const visibleTickets = TICKETS.filter(t => {
    if (currentUser?.role === ROLES.ASSOCIATE && t.assignedTo !== currentUser.id) return false;
    if (currentUser?.role === ROLES.CLIENT && t.clientId !== currentUser.clientId) return false;
    return true;
  });

  const filtered = visibleTickets.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.clientName.toLowerCase().includes(search.toLowerCase());
    const matchPriority = filterPriority === 'all' || t.priority === filterPriority;
    const matchStage = filterStage === 'all' || t.stage === filterStage;
    return matchSearch && matchPriority && matchStage;
  });

  const isOverdue = (t) => t.stage !== STAGE.DONE && new Date(t.dueDate) < new Date();
  const docsPct = (t) => {
    if (!t.checklist?.length) return 100;
    return Math.round((t.checklist.filter(c => c.received).length / t.checklist.length) * 100);
  };

  const TicketCard = ({ ticket: t }) => (
    <div onClick={() => onSelectTicket(t.id)}
      className={`bg-white rounded-xl border p-4 cursor-pointer hover:shadow-md transition-all group ${isOverdue(t) ? 'border-red-200' : 'border-gray-100 hover:border-blue-200'}`}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-xs font-mono text-gray-400">{t.id}</span>
        <div className="flex items-center gap-1.5">
          <PriorityTag priority={t.priority} />
          {isOverdue(t) && <span className="flex items-center gap-0.5 text-xs text-red-600 font-medium"><AlertTriangle size={11} />Overdue</span>}
        </div>
      </div>
      <div className="text-sm font-semibold text-gray-900 leading-tight mb-2 group-hover:text-blue-700 transition-colors">{t.title}</div>
      <div className="text-xs text-gray-500 mb-3">{t.clientName}</div>

      {t.stage === STAGE.DOCS && (
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Documents</span><span className="font-medium">{t.checklist.filter(c => c.received).length}/{t.checklist.length}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div className="bg-blue-500 h-1.5 rounded-full transition-all" style={{ width: `${docsPct(t)}%` }} />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-gray-400">
        <span className="flex items-center gap-1"><Calendar size={11} />{t.dueDate}</span>
        <span className="flex items-center gap-1"><User size={11} />{t.assignedToName?.split(' ')[0]}</span>
      </div>
    </div>
  );

  const TableRow = ({ ticket: t }) => (
    <tr onClick={() => onSelectTicket(t.id)} className="hover:bg-blue-50/50 cursor-pointer border-b border-gray-50">
      <td className="py-3 px-4">
        <div className="text-xs font-mono text-gray-400">{t.id}</div>
        <div className="text-sm font-semibold text-gray-900 mt-0.5">{t.title}</div>
      </td>
      <td className="py-3 px-4 text-sm text-gray-600">{t.clientName}</td>
      <td className="py-3 px-4"><StageTag stage={t.stage} /></td>
      <td className="py-3 px-4"><PriorityTag priority={t.priority} /></td>
      <td className="py-3 px-4 text-sm text-gray-500">{t.assignedToName}</td>
      <td className="py-3 px-4">
        <span className={`text-sm ${isOverdue(t) ? 'text-red-600 font-semibold' : 'text-gray-500'}`}>{t.dueDate}</span>
      </td>
      <td className="py-3 px-4">
        <ChevronRight size={16} className="text-gray-300" />
      </td>
    </tr>
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Tickets</h1>
          <p className="text-sm text-gray-400 mt-0.5">{filtered.length} ticket{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        {[ROLES.MASTER_ADMIN, ROLES.SALES, ROLES.ASSOCIATE].includes(currentUser?.role) && (
          <button onClick={onCreateTicket} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Create ticket
          </button>
        )}
      </div>

      {/* Filters bar */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search tickets, clients..." value={search}
            onChange={e => setSearch(e.target.value)} className="input-field pl-9" />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-gray-400" />
          <select value={filterStage} onChange={e => setFilterStage(e.target.value)} className="input-field w-40 py-1.5">
            <option value="all">All stages</option>
            <option value={STAGE.DOCS}>Doc Collection</option>
            <option value={STAGE.MAKER}>Maker</option>
            <option value={STAGE.CHECKER}>Checker Review</option>
            <option value={STAGE.DONE}>Completed</option>
          </select>
          <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} className="input-field w-32 py-1.5">
            <option value="all">All priority</option>
            <option>High</option><option>Medium</option><option>Low</option>
          </select>
        </div>
        <div className="flex items-center gap-1 ml-auto bg-gray-100 rounded-lg p-1">
          <button onClick={() => setViewMode('kanban')} className={`p-1.5 rounded ${viewMode === 'kanban' ? 'bg-white shadow-sm' : ''}`}>
            <LayoutGrid size={16} className={viewMode === 'kanban' ? 'text-blue-700' : 'text-gray-400'} />
          </button>
          <button onClick={() => setViewMode('table')} className={`p-1.5 rounded ${viewMode === 'table' ? 'bg-white shadow-sm' : ''}`}>
            <List size={16} className={viewMode === 'table' ? 'text-blue-700' : 'text-gray-400'} />
          </button>
        </div>
      </div>

      {/* Kanban view */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:grid md:grid-cols-2">
          {STAGE_COLUMNS.map(col => {
            const colTickets = filtered.filter(t => t.stage === col.key);
            return (
              <div key={col.key} className="min-w-0">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${col.dot}`} />
                  <span className="text-sm font-semibold text-gray-700">{col.label}</span>
                  <span className="ml-auto bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full font-medium">{colTickets.length}</span>
                </div>
                <div className="space-y-3">
                  {colTickets.map(t => <TicketCard key={t.id} ticket={t} />)}
                  {colTickets.length === 0 && (
                    <div className="border-2 border-dashed border-gray-100 rounded-xl p-6 text-center">
                      <p className="text-xs text-gray-300">No tickets</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table view */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Ticket', 'Client', 'Stage', 'Priority', 'Assigned to', 'Due date', ''].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider py-3 px-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => <TableRow key={t.id} ticket={t} />)}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="text-center py-12 text-gray-400 text-sm">No tickets found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
