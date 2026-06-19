/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { hasPermission } from '../../lib/permissions';
import { useTeam, updateAssociate } from '../../services/finops';
import OnboardAssociate from './OnboardAssociate';

const DEPARTMENTS = ['Tax & Compliance', 'Audit', 'Accounts', 'Payroll', 'GST', 'Management', 'HR', 'Sales', 'Business Dev'];
const ROLES_LIST = ['Associate', 'Sales', 'HR'];

export default function HRModule() {
  const { currentUser } = useAuth();
  const TEAM = useTeam();
  const [screen, setScreen] = useState('list');
  const [selected, setSelected] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const canManage = hasPermission(currentUser?.role, 'canManageEmployees');

  const openEdit = (member) => {
    setEditForm({
      id: member.id,
      name: member.name,
      role: member.role,
      email: member.email,
      phone: member.phone || '',
      department: member.department || '',
      status: member.status || 'Active',
      joined: member.joined || '',
    });
    setSelected(member);
  };

  const saveEdit = async () => {
    if (!editForm) return;
    setSaveError('');
    setSaving(true);
    try {
      await updateAssociate(editForm.id, {
        name: editForm.name,
        role: editForm.role,
        email: editForm.email,
        phone: editForm.phone,
        department: editForm.department,
        status: editForm.status,
        joined: editForm.joined,
      }, currentUser.tenantId);
      setSelected(null);
      setEditForm(null);
    } catch (err) {
      setSaveError(err.message || 'Failed to update member');
    } finally {
      setSaving(false);
    }
  };

  if (screen === 'create' && canManage) {
    return (
      <OnboardAssociate
        onBack={() => setScreen('list')}
        onSuccess={() => setScreen('list')}
      />
    );
  }

  if (selected && editForm && canManage) {
    return (
      <div className="p-6 max-w-xl mx-auto">
        <button onClick={() => { setSelected(null); setEditForm(null); setSaveError(''); }} className="text-sm text-indigo-600 hover:text-indigo-800 mb-4">
          ← Back
        </button>
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Edit team member</h2>
          {[
            ['name', 'Full name', 'text'],
            ['email', 'Work email', 'email'],
            ['phone', 'Phone', 'text'],
            ['joined', 'Date joined', 'date'],
          ].map(([field, label, type]) => (
            <div key={field}>
              <label className="block text-xs text-gray-500 mb-1">{label}</label>
              <input
                type={type}
                className="input-field w-full"
                value={editForm[field]}
                onChange={(e) => setEditForm((p) => ({ ...p, [field]: e.target.value }))}
              />
            </div>
          ))}
          <div>
            <label className="block text-xs text-gray-500 mb-1">Department</label>
            <select className="input-field w-full" value={editForm.department} onChange={(e) => setEditForm((p) => ({ ...p, department: e.target.value }))}>
              <option value="">Select department</option>
              {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Role</label>
            <select className="input-field w-full" value={editForm.role} onChange={(e) => setEditForm((p) => ({ ...p, role: e.target.value }))}>
              {ROLES_LIST.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Status</label>
            <select className="input-field w-full" value={editForm.status} onChange={(e) => setEditForm((p) => ({ ...p, status: e.target.value }))}>
              {['Active', 'Inactive', 'On Leave'].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          {saveError && <p className="text-red-500 text-sm">{saveError}</p>}
          <button onClick={saveEdit} disabled={saving} className="btn-primary w-full disabled:opacity-60">
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>
    );
  }

  if (selected) {
    return (
      <div className="p-6">
        <button onClick={() => setSelected(null)} className="text-sm text-indigo-600 hover:text-indigo-800 mb-4">← Back</button>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xl font-bold">
              {selected.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{selected.name}</h2>
              <p className="text-sm text-gray-400">{selected.role} · {selected.department}</p>
            </div>
            {canManage && (
              <button onClick={() => openEdit(selected)} className="ml-auto text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                Edit
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[['Email', selected.email], ['Phone', selected.phone], ['Department', selected.department],
              ['Status', selected.status], ['Joined', selected.joined], ['Active Clients', selected.clients]].map(([l, v]) => (
              <div key={l} className="border-b border-gray-50 pb-3">
                <p className="text-xs text-gray-400">{l}</p>
                <p className="text-sm font-medium text-gray-800">{v ?? '—'}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-gray-900">HR & Associates</h2>
        {canManage && (
          <button
            onClick={() => setScreen('create')}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
          >
            + Add Member
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {TEAM.map(m => (
          <div key={m.id} onClick={() => setSelected(m)}
            className="bg-white rounded-xl border border-gray-200 p-4 cursor-pointer hover:border-indigo-300 hover:shadow-sm transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold">
                {m.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{m.name}</p>
                <p className="text-xs text-gray-400">{m.role}</p>
              </div>
              <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">{m.status}</span>
            </div>
            <div className="flex gap-4 text-xs text-gray-500">
              <span>🏢 {m.department}</span>
              <span>👥 {m.clients} clients</span>
              <span>🎫 {m.tickets} tickets</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
