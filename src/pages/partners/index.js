import React, { useState } from 'react';
import PartnerList   from './PartnerList';
import PartnerPortal from './PartnerPortal';
import PartnerForm   from './PartnerForm';
import { useTenant } from '../../context/TenantContext';
import { createPartner } from '../../services/finops';

export default function PartnersModule() {
  const { updateTenant, refreshTenants } = useTenant();
  const [view,            setView]            = useState('list');
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [editPartner,     setEditPartner]     = useState(null);
  const [saving,          setSaving]          = useState(false);
  const [saveError,       setSaveError]       = useState('');
  const [saveSuccess,     setSaveSuccess]     = useState('');

  function handleAdd() {
    setEditPartner(null);
    setSaveError('');
    setSaveSuccess('');
    setView('form');
  }

  function handleView(partner) {
    setSelectedPartner(partner);
    setView('portal');
  }

  async function handleSave(data) {
    setSaving(true);
    setSaveError('');
    setSaveSuccess('');
    try {
      if (editPartner) {
        await updateTenant(editPartner.tenantId, data);
        setSaveSuccess('Partner updated.');
      } else {
        const result = await createPartner(data);
        await refreshTenants();
        const confirmNote = result.emailConfirmationRequired
          ? ' Admin must confirm email before first login.'
          : '';
        setSaveSuccess(
          `Partner "${data.firmName}" created. Admin can sign in at the same login page with ${data.email}.${confirmNote}`,
        );
      }
      setView('list');
      setEditPartner(null);
    } catch (err) {
      setSaveError(err.message || 'Failed to save partner');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="h-full flex flex-col bg-slate-50">
      <div className="flex-none bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center gap-3">
          {view !== 'list' && (
            <button
              type="button"
              onClick={() => setView('list')}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-2 py-1 rounded hover:bg-slate-100 transition-colors"
            >
              ← Partners
            </button>
          )}
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              {view === 'list' && 'Partner Management'}
              {view === 'portal' && selectedPartner?.firmName}
              {view === 'form' && (editPartner ? 'Edit Partner' : 'Add New Partner')}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {view === 'list' && 'Onboard partner CA firms — they get full FinOps access scoped to their firm'}
              {view === 'portal' && `Overview for ${selectedPartner?.firmName}`}
              {view === 'form' && 'Partner admins sign in on the main login page and manage their own operations'}
            </p>
          </div>
        </div>
        {saveSuccess && view === 'list' && (
          <p className="mt-3 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
            {saveSuccess}
          </p>
        )}
      </div>

      <div className="flex-1 overflow-hidden">
        {view === 'list' && (
          <PartnerList onAdd={handleAdd} onView={handleView} />
        )}
        {view === 'portal' && selectedPartner && (
          <PartnerPortal partner={selectedPartner} onBack={() => setView('list')} />
        )}
      </div>

      {view === 'form' && (
        <PartnerForm
          partner={editPartner}
          saving={saving}
          saveError={saveError}
          onSave={handleSave}
          onClose={() => setView('list')}
        />
      )}
    </div>
  );
}
