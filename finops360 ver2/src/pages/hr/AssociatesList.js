import React, { useState } from 'react';
import { Search, Plus, ArrowLeft, Mail, Phone, Briefcase, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import { TEAM_MEMBERS, TICKETS, STAGE } from '../../data/mockData';

const ROLE_LABELS = { associate: 'Associate', hr: 'HR', sales: 'Sales', master_admin: 'Master Admin' };
const ROLE_COLORS = {
  associate: 'bg-green-50 text-green-700',
  hr: 'bg-pink-50 text-pink-700',
  sales: 'bg-blue-50 text-blue-700',
  master_admin: 'bg-purple-50 text-purple-700',
};
const STATUS_COLORS = { active: 'bg-green-50 text-green-700', inactive: 'bg-gray-100 text-gray-500' };

function AssociateCard({ member, onClick }) {
  const myTickets = TICKETS.filter(t => t.assignedTo === member.id);
  const active = myTickets.filter(t => t.stage !== STAGE.DONE).length;
  const done = myTickets.filter(t => t.stage === STAGE.DONE).length;
  const initials = member.firstName[0] + member.lastName[0];

  return (
    <div onClick={onClick} className="bg-white rounded-xl border border-gray-100 p-5 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer group">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-11 h-11 rounded-xl bg-blue-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-gray-900 text-sm">{member.firstName} {member.lastName}</div>
          <div className="text-xs text-gray-400 mt-0.5">{member.designation || ROLE_LABELS[member.role]}</div>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[member.status]}`}>{member.status}</span>
      </div>

      <div className="flex items-center gap-2 flex-wrap mb-3">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ROLE_COLORS[member.role]}`}>{ROLE_LABELS[member.role]}</span>
        <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">{member.department}</span>
      </div>

      <div className="text-xs text-gray-500 mb-3">{member.email}</div>

      <div className="flex items-center gap-4 pt-3 border-t border-gray-50">
        <div className="text-center">
          <div className="text-sm font-bold text-blue-700">{active}</div>
          <div className="text-xs text-gray-400">Active</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-bold text-green-600">{done}</div>
          <div className="text-xs text-gray-400">Completed</div>
        </div>
        <div className="text-center ml-auto">
          <div className="text-xs text-gray-400">Joined</div>
          <div className="text-xs font-medium text-gray-600">{member.dateOfJoining}</div>
        </div>
      </div>
    </div>
  );
}

function AssociateProfile({ member, onBack }) {
  const [activeTab, setActiveTab] = useState('overview');
  const myTickets = TICKETS.filter(t => t.assignedTo === member.id);
  const active = myTickets.filter(t => t.stage !== STAGE.DONE);
  const done = myTickets.filter(t => t.stage === STAGE.DONE);
  const overdue = myTickets.filter(t => t.stage !== STAGE.DONE && new Date(t.dueDate) < new Date());
  const onTimeRate = myTickets.length > 0 ? Math.round((done.length / myTickets.length) * 100) : 0;
  const initials = member.firstName[0] + member.lastName[0];

  const stageBreakdown = [
    { label: 'Doc Collection', count: myTickets.filter(t => t.stage === STAGE.DOCS).length, color: 'bg-blue-500' },
    { label: 'Maker', count: myTickets.filter(t => t.stage === STAGE.MAKER).length, color: 'bg-purple-500' },
    { label: 'Checker Review', count: myTickets.filter(t => t.stage === STAGE.CHECKER).length, color: 'bg-amber-500' },
    { label: 'Completed', count: done.length, color: 'bg-green-500' },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-5 transition-colors">
        <ArrowLeft size={16} /> Back to associates
      </button>

      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-5">
        <div className="flex items-start gap-4 mb-5">
          <div className="w-14 h-14 rounded-xl bg-blue-700 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="text-xl font-bold text-gray-900">{member.firstName} {member.lastName}</h1>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${ROLE_COLORS[member.role]}`}>{ROLE_LABELS[member.role]}</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-green-50 text-green-700">{member.status}</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
              <span className="flex items-center gap-1"><Mail size={13} />{member.email}</span>
              <span className="flex items-center gap-1"><Phone size={13} />+91 {member.mobile}</span>
              <span className="flex items-center gap-1"><Briefcase size={13} />{member.department}</span>
            </div>
          </div>
          <button className="btn-secondary text-sm flex-shrink-0">Edit</button>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-5 border-t border-gray-50">
          {[
            { label: 'Active tickets', value: active.length, color: 'text-blue-700' },
            { label: 'Completed', value: done.length, color: 'text-green-600' },
            { label: 'Overdue', value: overdue.length, color: overdue.length > 0 ? 'text-red-600' : 'text-gray-400' },
            { label: 'On-time rate', value: `${onTimeRate}%`, color: 'text-purple-600' },
          ].map(s => (
            <div key={s.label} className="text-center p-3 bg-gray-50 rounded-lg">
              <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-100 mb-5">
        {[
          { key: 'overview', label: 'Overview' },
          { key: 'tickets', label: `Tickets (${myTickets.length})` },
          { key: 'performance', label: 'Performance' },
        ].map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab === t.key ? 'border-blue-700 text-blue-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Employment details</h3>
            {[
              { label: 'Employee ID', value: member.employeeId },
              { label: 'Department', value: member.department },
              { label: 'Designation', value: member.designation || '—' },
              { label: 'Date of joining', value: member.dateOfJoining },
              { label: 'Reporting manager', value: 'Rajesh Sharma' },
              { label: 'Employment type', value: 'Full-time' },
            ].map(row => (
              <div key={row.label} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-400">{row.label}</span>
                <span className="text-sm font-medium text-gray-800">{row.value}</span>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Ticket breakdown</h3>
            <div className="space-y-3">
              {stageBreakdown.map(s => (
                <div key={s.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600">{s.label}</span>
                    <span className="font-semibold text-gray-800">{s.count}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className={`${s.color} h-2 rounded-full`} style={{ width: myTickets.length > 0 ? `${(s.count / myTickets.length) * 100}%` : '0%' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tickets tab */}
      {activeTab === 'tickets' && (
        <div className="space-y-3">
          {active.length > 0 && (
            <>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Active ({active.length})</h3>
              {active.map(t => (
                <div key={t.id} className="bg-white rounded-xl border border-gray-100 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-mono text-gray-400">{t.id}</span>
                      <div className="text-sm font-semibold text-gray-900 mt-0.5">{t.title}</div>
                      <div className="text-xs text-gray-400 mt-1">{t.clientName} · Due {t.dueDate}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                        t.stage === STAGE.DOCS ? 'bg-blue-50 text-blue-700' :
                        t.stage === STAGE.MAKER ? 'bg-purple-50 text-purple-700' :
                        'bg-amber-50 text-amber-700'
                      }`}>
                        {t.stage === STAGE.DOCS ? 'Doc Collection' : t.stage === STAGE.MAKER ? 'Maker' : 'Checker'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
          {done.length > 0 && (
            <>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mt-4">Completed ({done.length})</h3>
              {done.map(t => (
                <div key={t.id} className="bg-white rounded-xl border border-gray-100 p-4 opacity-75">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-mono text-gray-400">{t.id}</span>
                      <div className="text-sm font-medium text-gray-700 mt-0.5">{t.title}</div>
                      <div className="text-xs text-gray-400 mt-1">{t.clientName}</div>
                    </div>
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-green-50 text-green-700">Done</span>
                  </div>
                </div>
              ))}
            </>
          )}
          {myTickets.length === 0 && (
            <div className="text-center py-12 text-gray-400">No tickets assigned yet</div>
          )}
        </div>
      )}

      {/* Performance tab */}
      {activeTab === 'performance' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { label: 'On-time completion', value: `${onTimeRate}%`, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50', sub: 'of tickets filed before due date' },
            { label: 'Total completed', value: done.length, icon: CheckCircle, color: 'text-blue-700', bg: 'bg-blue-50', sub: 'tickets completed overall' },
            { label: 'Avg turnaround', value: '4.2 days', icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50', sub: 'from assignment to completion' },
          ].map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-5">
                <div className={`w-10 h-10 ${s.bg} rounded-lg flex items-center justify-center mb-3`}>
                  <Icon size={20} className={s.color} />
                </div>
                <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-sm font-medium text-gray-700 mt-1">{s.label}</div>
                <div className="text-xs text-gray-400 mt-0.5">{s.sub}</div>
              </div>
            );
          })}
          <div className="bg-white rounded-xl border border-gray-100 p-5 md:col-span-3">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Monthly activity</h3>
            <div className="flex items-end gap-2 h-24">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, i) => {
                const heights = [60, 40, 80, 55, 70, 90];
                return (
                  <div key={month} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full bg-blue-100 rounded-t-md hover:bg-blue-400 transition-colors cursor-pointer" style={{ height: `${heights[i]}%` }} />
                    <span className="text-xs text-gray-400">{month}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AssociatesList({ onAddAssociate }) {
  const [search, setSearch] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [filterRole, setFilterRole] = useState('all');

  if (selectedMember) {
    return <AssociateProfile member={selectedMember} onBack={() => setSelectedMember(null)} />;
  }

  const filtered = TEAM_MEMBERS.filter(u => {
    if (u.role === 'client') return false;
    const name = `${u.firstName} ${u.lastName}`.toLowerCase();
    const matchSearch = name.includes(search.toLowerCase()) || u.employeeId?.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === 'all' || u.role === filterRole;
    return matchSearch && matchRole;
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Team members</h1>
          <p className="text-sm text-gray-400 mt-0.5">{filtered.length} members</p>
        </div>
        <button onClick={onAddAssociate} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Onboard associate
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search by name or ID..." value={search}
            onChange={e => setSearch(e.target.value)} className="input-field pl-9" />
        </div>
        <select value={filterRole} onChange={e => setFilterRole(e.target.value)} className="input-field w-36 py-1.5">
          <option value="all">All roles</option>
          <option value="associate">Associate</option>
          <option value="sales">Sales</option>
          <option value="hr">HR</option>
          <option value="master_admin">Admin</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(m => <AssociateCard key={m.id} member={m} onClick={() => setSelectedMember(m)} />)}
        {filtered.length === 0 && (
          <div className="col-span-3 text-center py-16 text-gray-400">No team members found</div>
        )}
      </div>
    </div>
  );
}
