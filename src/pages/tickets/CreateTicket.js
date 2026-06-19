import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check, Plus, X } from 'lucide-react';
import { TICKET_TYPES, DOC_CHECKLISTS } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { useClients, useTeam, createTicket } from '../../services/finops';

export default function CreateTicket({ onBack, onSuccess }) {
  const { currentUser } = useAuth();
  const allClients = useClients();
  const team = useTeam();
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

  const associates = team.filter((u) => /associate/i.test(String(u.role)));
  const assignees = associates.length ? associates : team;
  const clients = allClients;

  const validate = () => {
    const e = {};
    if (!form.clientId) e.clientId = 'Select a client';
    if (!form.type) e.type = 'Select a task type';
    if (!form.dueDate) e.dueDate = 'Due date is required';
    if (!form.assignedTo) e.assignedTo = assignees.length ? 'Assign to a team member' : 'No team members found — run seed.sql in Supabase';
    if (!clients.length) e.clientId = 'No clients found — onboard a client first or run seed.sql';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    const client = clients.find((c) => c.id === form.clientId);
    const assignee = assignees.find((u) => u.id === form.assignedTo);
    setSaveError('');
    setSaving(true);
    try {
      await createTicket(currentUser.tenantId, {
        clientId: form.clientId,
        clientName: client?.name,
        type: form.type,
        period: form.period,
        ay: form.ay,
        due: form.dueDate,
        priority: form.priority,
        assignee: assignee?.name || null,
        title: [form.type, form.period, form.ay].filter(Boolean).join(' · '),
      });
      setSubmitted(true);
      setTimeout(() => onSuccess && onSuccess(), 1200);
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
        <p className="text-gray-500 mt-2 text-sm">The ticket has been created and assigned. The client has been notified.</p>
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
        <p className="text-sm text-gray-400 mt-0.5">Fill in the details to create and assign a task</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main form */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Task details</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Client <span className="text-red-500">*</span></label>
                <select className={`input-field ${errors.clientId ? 'border-red-300' : ''}`} value={form.clientId} onChange={e => set('clientId', e.target.value)}>
                  <option value="">Select client</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{getClientName(c)} ({c.id})</option>)}
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
                {form.type && <p className="text-xs text-blue-600 mt-1">Document checklist auto-loaded for this task type</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Period (if applicable)</label>
                  <input className="input-field" placeholder="e.g. May 2025" value={form.period} onChange={e => set('period', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Assessment year (if applicable)</label>
                  <input className="input-field" placeholder="e.g. AY 2025-26" value={form.ay} onChange={e => set('ay', e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Due date (statutory) <span className="text-red-500">*</span></label>
                  <input type="date" className={`input-field ${errors.dueDate ? 'border-red-300' : ''}`} value={form.dueDate} onChange={e => set('dueDate', e.target.value)} />
                  {errors.dueDate && <p className="text-red-500 text-xs mt-1">{errors.dueDate}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Internal target date</label>
                  <input type="date" className="input-field" value={form.internalTargetDate} onChange={e => set('internalTargetDate', e.target.value)} />
                  <p className="text-xs text-gray-400 mt-1">Set a buffer before the due date</p>
                </div>
              </div>
            </div>
          </div>

          {/* Document checklist */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Document checklist</h2>
                {form.type && <p className="text-xs text-gray-400 mt-0.5">Auto-loaded for {form.type}. Uncheck items not required.</p>}
              </div>
              <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                {checklist.filter(c => c.selected).length} selected
              </span>
            </div>

            {!form.type && (
              <div className="border-2 border-dashed border-gray-100 rounded-xl p-8 text-center">
                <p className="text-sm text-gray-400">Select a task type above to auto-load the document checklist</p>
              </div>
            )}

            {form.type && (
              <>
                <div className="space-y-2 mb-4 max-h-64 overflow-y-auto pr-1">
                  {checklist.map(item => (
                    <div key={item.id} className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all ${item.selected ? 'border-blue-100 bg-blue-50/50' : 'border-gray-100 bg-gray-50 opacity-60'}`}>
                      <button onClick={() => toggleItem(item.id)}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${item.selected ? 'bg-blue-700 border-blue-700' : 'border-gray-300 bg-white'}`}>
                        {item.selected && <Check size={11} className="text-white" />}
                      </button>
                      <span className="text-sm text-gray-700 flex-1">{item.label}</span>
                      <div className="flex items-center gap-1.5">
                        {item.mandatory && <span className="text-xs text-red-500 font-medium">Required</span>}
                        {item.custom && (
                          <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-400 transition-colors">
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add custom document */}
                <div className="flex gap-2 pt-3 border-t border-gray-100">
                  <input
                    className="input-field flex-1 text-sm"
                    placeholder="Add a custom document..."
                    value={customDoc}
                    onChange={e => setCustomDoc(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addCustom()}
                  />
                  <button onClick={addCustom} className="btn-secondary flex items-center gap-1.5 text-sm flex-shrink-0">
                    <Plus size={14} /> Add
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right panel */}
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Assignment</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Assign to <span className="text-red-500">*</span></label>
                <select className={`input-field ${errors.assignedTo ? 'border-red-300' : ''}`} value={form.assignedTo} onChange={e => set('assignedTo', e.target.value)}>
                  <option value="">Select team member</option>
                  {assignees.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                  ))}
                </select>
                {errors.assignedTo && <p className="text-red-500 text-xs mt-1">{errors.assignedTo}</p>}
                {!assignees.length && (
                  <p className="text-amber-600 text-xs mt-1">No associates in database. Run supabase/migrations/seed.sql in the Supabase SQL Editor.</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Priority</label>
                <div className="flex gap-2">
                  {['High', 'Medium', 'Low'].map(p => (
                    <button key={p} onClick={() => set('priority', p)}
                      className={`flex-1 py-2 text-xs font-semibold rounded-lg border-2 transition-all ${
                        form.priority === p
                          ? p === 'High' ? 'border-red-500 bg-red-50 text-red-600'
                          : p === 'Medium' ? 'border-amber-500 bg-amber-50 text-amber-700'
                          : 'border-gray-300 bg-gray-50 text-gray-600'
                          : 'border-gray-100 text-gray-400'
                      }`}>{p}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Notes</h2>
            <textarea rows={4} className="input-field text-sm" placeholder="Any special instructions or notes for the associate..." value={form.notes} onChange={e => set('notes', e.target.value)} />
          </div>

          {/* Notification preview */}
          <div className="bg-blue-50 rounded-xl border border-blue-100 p-4">
            <p className="text-xs font-semibold text-blue-700 mb-2">Notifications that will be sent</p>
            <div className="space-y-1.5 text-xs text-blue-600">
              <div className="flex items-start gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                Client notified: ticket created
              </div>
              <div className="flex items-start gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                Associate notified: new ticket assigned
              </div>
              <div className="flex items-start gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                Document request sent to client
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={saving}
            className="w-full btn-primary py-3 flex items-center justify-center gap-2 text-sm disabled:opacity-60"
          >
            <Check size={16} /> {saving ? 'Creating…' : 'Create ticket'}
          </button>
          {saveError && <p className="text-red-500 text-xs mt-2 text-center">{saveError}</p>}
        </div>
      </div>
    </div>
  );
}
