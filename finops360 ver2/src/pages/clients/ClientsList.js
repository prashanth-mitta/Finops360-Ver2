/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Search, Plus, Building2, User, ChevronRight, Filter } from 'lucide-react';
import { CLIENTS, TICKETS, STAGE } from '../../data/mockData';
import { useAuth, ROLES } from '../../context/AuthContext';
import { StageTag } from '../../components/common/UIComponents';

const TIER_COLORS = {
  Gold: 'bg-amber-100 text-amber-700',
  Silver: 'bg-gray-100 text-gray-600',
  Standard: 'bg-blue-50 text-blue-600',
};

const STATUS_COLORS = {
  active: 'bg-green-50 text-green-700',
  'on hold': 'bg-amber-50 text-amber-700',
  churned: 'bg-red-50 text-red-700',
};

export default function ClientsList({ onSelectClient, onAddClient }) {
  const { currentUser } = useAuth();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterTier, setFilterTier] = useState('all');

  const visibleClients = CLIENTS.filter(c => {
    if (currentUser?.role === ROLES.SALES && c.assignedSales !== currentUser.id) return false;
    if (currentUser?.role === ROLES.ASSOCIATE && c.assignedAssociate !== currentUser.id) return false;
    return true;
  });

  const filtered = visibleClients.filter(c => {
    const name = c.clientType === 'individual'
      ? `${c.firstName} ${c.lastName}`.toLowerCase()
      : c.companyName?.toLowerCase() || '';
    const matchSearch = name.includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      (c.pan || '').toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'all' || c.clientType === filterType;
    const matchTier = filterTier === 'all' || c.tier === filterTier;
    return matchSearch && matchType && matchTier;
  });

  const getClientName = (c) => c.clientType === 'individual'
    ? `${c.firstName} ${c.lastName}` : c.companyName;

  const getActiveTickets = (clientId) =>
    TICKETS.filter(t => t.clientId === clientId && t.stage !== STAGE.DONE).length;

  const getInitials = (c) => {
    const name = getClientName(c);
    return name?.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Clients</h1>
          <p className="text-sm text-gray-400 mt-0.5">{filtered.length} client{filtered.length !== 1 ? 's' : ''} found</p>
        </div>
        {[ROLES.MASTER_ADMIN, ROLES.SALES].includes(currentUser?.role) && (
          <button onClick={onAddClient} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Onboard new client
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, ID or PAN..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-gray-400" />
          <select value={filterType} onChange={e => setFilterType(e.target.value)} className="input-field w-36 py-1.5">
            <option value="all">All types</option>
            <option value="individual">Individual</option>
            <option value="corporate">Corporate</option>
          </select>
          <select value={filterTier} onChange={e => setFilterTier(e.target.value)} className="input-field w-32 py-1.5">
            <option value="all">All tiers</option>
            <option value="Gold">Gold</option>
            <option value="Silver">Silver</option>
            <option value="Standard">Standard</option>
          </select>
        </div>
      </div>

      {/* Client cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(c => {
          const activeT = getActiveTickets(c.id);
          const doneT = TICKETS.filter(t => t.clientId === c.id && t.stage === STAGE.DONE).length;
          return (
            <div
              key={c.id}
              onClick={() => onSelectClient(c.id)}
              className="bg-white rounded-xl border border-gray-100 p-5 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${c.clientType === 'corporate' ? 'bg-indigo-600' : 'bg-blue-600'}`}>
                    {getInitials(c)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm leading-tight">{getClientName(c)}</div>
                    <div className="text-xs text-gray-400 mt-0.5 font-mono">{c.id}</div>
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-300 group-hover:text-blue-500 transition-colors mt-0.5" />
              </div>

              <div className="flex items-center gap-2 flex-wrap mb-3">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TIER_COLORS[c.tier]}`}>{c.tier}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[c.status]}`}>{c.status}</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-gray-100 text-gray-600 flex items-center gap-1">
                  {c.clientType === 'corporate' ? <Building2 size={10} /> : <User size={10} />}
                  {c.clientType === 'individual' ? 'Individual' : c.entityType || 'Corporate'}
                </span>
              </div>

              <div className="text-xs text-gray-500 mb-3 truncate">{c.email}</div>

              <div className="flex items-center gap-2 flex-wrap text-xs">
                {c.services?.slice(0, 3).map(s => (
                  <span key={s} className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-medium">{s}</span>
                ))}
                {c.services?.length > 3 && (
                  <span className="text-gray-400">+{c.services.length - 3} more</span>
                )}
              </div>

              <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-50">
                <div className="text-center">
                  <div className="text-sm font-bold text-blue-700">{activeT}</div>
                  <div className="text-xs text-gray-400">Active tickets</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-green-600">{doneT}</div>
                  <div className="text-xs text-gray-400">Completed</div>
                </div>
                <div className="text-center ml-auto">
                  <div className="text-xs text-gray-400">Onboarded</div>
                  <div className="text-xs font-medium text-gray-600">{c.onboardingDate}</div>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="col-span-3 flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
              <Building2 size={24} className="text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium">No clients found</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
