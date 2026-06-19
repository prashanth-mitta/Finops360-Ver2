import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check, Plus, X } from 'lucide-react';
import { TICKET_TYPES, DOC_CHECKLISTS } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { useClientsQuery, useTeamQuery, createTicket } from '../../services/finops';

export default function CreateTicket({ onBack, onSuccess }) {
  const { currentUser } = useAuth();
  const { items: clients, loading: clientsLoading, error: clientsError } = useClientsQuery();
  const { items: team, loading: teamLoading } = useTeamQuery();
  const [form, setForm] = useState({
    clientId: '', type: '', period: '', ay: '',
    dueDate: '', internalTargetDate: '', priority: 'Medium',
    assignedTo: '', notes: '',
  });
  const [checklist, setChecklist] = useState([]);
  const [customDoc, setCustomDoc] = useState('');
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const set = (f, v) => { setForm(p => ({ ...p, [f]: v })); setErrors(p => ({ ...p, [f]: '' })); };

  useEffect(() => {
    if (form.type && DOC_CHECKLISTS[form.type]) {
      setChecklist(DOC_CHECKLISTS[form.type].map((label, i) => ({
        id: `c${i + 1}`, label, mandatory: i < 3, selected: true,
      })));
    } else {
      setChecklist([]);
    }
  }, [form.type]);

  const toggleItem = (id) => setChecklist(prev => prev.map(c => c.id === id ? { ...c, selected: !c.selected } : c));
  const addCustom = () => {
    if (!customDoc.trim()) return;
    setChecklist(prev => [...prev, { id: `c${Date.now()}`, label: customDoc.trim(), mandatory: false, selected: true, custom: true }]);
    setCustomDoc('');
  };
  const removeItem = (id) => setChecklist(prev => prev.filter(c => c.id !== id));

  const assignees = team.length ? team : [];
  const dataLoading = clientsLoading || teamLoading;
  const canSubmit = !dataLoading && clients.length > 0;

  const validate = () => {
    const e = {};
    if (!form.clientId) e.clientId = clients.length ? 'Select a client' : 'No clients in database — onboard a client first';
    if (!form.type) e.type = 'Select a task type';
    if (!form.dueDate) e.dueDate = 'Due date is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    if (!currentUser?.tenantId) {
      setSaveError('Missing tenant. Log out and sign in again.');
      return;
    }
    const client = clients.find((c) => String(c.id) === String(form.clientId));
    const assignee = assignees.find((u) => String(u.id) === String(form.assignedTo));
    setSaveError('');
    setSaving(true);
    try {
      const created = await createTicket(currentUser.tenantId, {
        clientId: form.clientId,
        clientName: client?.name,
        type: form.type,
        period: form.period,
        ay: form.ay,
        due: form.dueDate,
        priority: form.priority,
        assignee: assignee?.name || currentUser.name,
        title: [form.type, form.period, form.ay].filter(Boolean).join(' · '),
      });
      setSubmitted(true);
      setTimeout(() => onSuccess && onSuccess(created), 800);
    } catch (err) {
      setSaveError(err.message || 'Failed to create ticket');
    } finally {
      setSaving(false);
    }
  };

  const getClientName = (c) => c.name;

  if (submitted) {
    return (
      <div className="p-6 max-w-xl mx-auto text-center py-20">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check size={28} className="text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Ticket created!</h2>
        <p className="text-gray-500 mt-2 text-sm">Saved to Supabase. It will appear in the Maker column now.</p>
        <button onClick={onBack} className="btn-primary mt-6">Back to tickets</button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-5 transition-colors">
        <ArrowLeft size={16} /> Back to tickets
      </button>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Create new ticket</h1>
        <p className="text-sm text-gray-400 mt-0.5">Saved to database (unlike Tasks/Document upload which are UI-only for now)</p>
      </div>

      {dataLoading && (
        <p className="text-sm text-indigo-600 mb-4 bg-indigo-50 p-3 rounded-lg">Loading clients and team…</p>
      )}
      {clientsError && (
        <p className="text-sm text-red-600 mb-4 bg-red-50 p-3 rounded-lg">Could not load clients: {clientsError}</p>
      )}
      {!dataLoading && !clients.length && (
        <p className="text-sm text-amber-700 mb-4 bg-amber-50 p-3 rounded-lg border border-amber-100">
          No clients found. Go to <strong>Clients → + Onboard Client</strong> first, then create a ticket.
        </p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Task details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Client <span className="text-red-500">*</span></label>
                <select
                  className={`input-field ${errors.clientId ? 'border-red-300' : ''}`}
                  value={form.clientId}
                  onChange={e => set('clientId', e.target.value)}
                  disabled={!clients.length}
                >
                  <option value="">Select client</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{getClientName(c)}</option>)}
                </select>
                {errors.clientId && <p className="text-red-500 text-xs mt-1">{errors.clientId}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Task type <span className="text-red-500">*</span></label>
                <select className={`input-field ${errors.type ? 'border-red-300' : ''}`} value={form.type} onChange={e => set('type', e.target.value)}>
                  <option value="">Select task type</option>
                  {TICKET_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
                {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Period (optional)</label>
                  <input className="input-field" placeholder="e.g. May 2025" value={form.period} onChange={e => set('period', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Assessment year (optional)</label>
                  <input className="input-field" placeholder="e.g. AY 2025-26" value={form.ay} onChange={e => set('ay', e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Due date <span className="text-red-500">*</span></label>
                  <input type="date" className={`input-field ${errors.dueDate ? 'border-red-300' : ''}`} value={form.dueDate} onChange={e => set('dueDate', e.target.value)} />
                  {errors.dueDate && <p className="text-red-500 text-xs mt-1">{errors.dueDate}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Internal target date</label>
                  <input type="date" className="input-field" value={form.internalTargetDate} onChange={e => set('internalTargetDate', e.target.value)} />
                </div>
              </div>
            </div>
          </div>

          {form.type && (
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Document checklist</h2>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {checklist.map(item => (
                  <div key={item.id} className="flex items-center gap-3 p-2.5 rounded-lg border border-gray-100">
                    <button type="button" onClick={() => toggleItem(item.id)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center ${item.selected ? 'bg-blue-700 border-blue-700' : 'border-gray-300'}`}>
                      {item.selected && <Check size={11} className="text-white" />}
                    </button>
                    <span className="text-sm text-gray-700 flex-1">{item.label}</span>
                    {item.custom && (
                      <button type="button" onClick={() => removeItem(item.id)}><X size={14} className="text-gray-400" /></button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Assignment</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Assign to (optional)</label>
              <select className="input-field" value={form.assignedTo} onChange={e => set('assignedTo', e.target.value)}>
                <option value="">Unassigned / assign later</option>
                {assignees.map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                ))}
              </select>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Priority</label>
              <div className="flex gap-2">
                {['High', 'Medium', 'Low'].map(p => (
                  <button key={p} type="button" onClick={() => set('priority', p)}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg border-2 ${form.priority === p ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-100 text-gray-400'}`}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Notes</h2>
            <textarea rows={4} className="input-field text-sm" placeholder="Special instructions…" value={form.notes} onChange={e => set('notes', e.target.value)} />
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving || !canSubmit}
            className="w-full btn-primary py-3 flex items-center justify-center gap-2 text-sm disabled:opacity-60"
          >
            <Check size={16} /> {saving ? 'Saving to database…' : 'Create ticket'}
          </button>
          {saveError && <p className="text-red-500 text-xs mt-2 text-center font-medium">{saveError}</p>}
        </div>
      </div>
    </div>
  );
}
