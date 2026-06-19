import React, { useState } from 'react';
import PartnerList   from './PartnerList';
import PartnerPortal from './PartnerPortal';
import PartnerForm   from './PartnerForm';
import { useTenant } from '../../context/TenantContext';

export default function PartnersModule({ onLaunchPartner }) {
  const { addTenant, updateTenant } = useTenant();
  const [view,           setView]           = useState('list');   // list | portal | form
  const [selectedPartner,setSelectedPartner]= useState(null);
  const [editPartner,    setEditPartner]    = useState(null);

  function handleAdd() {
    setEditPartner(null);
    setView('form');
  }

  function handleView(partner) {
    setSelectedPartner(partner);
    setView('portal');
  }

  function handleLaunch(partner) {
    setSelectedPartner(partner);
    setView('portal');
  }

  function handleSave(data) {
    if (editPartner) {
      updateTenant(editPartner.tenantId, data);
    } else {
      addTenant(data);
    }
    setView('list');
    setEditPartner(null);
  }

  return (
    <div className="h-full flex flex-col bg-slate-50">

      {/* header */}
      <div className="flex-none bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center gap-3">
          {view !== 'list' && (
            <button onClick={() => setView('list')} className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-2 py-1 rounded hover:bg-slate-100 transition-colors">
              ← Partners
            </button>
          )}
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              {view === 'list'   ? 'Partner Management'          : ''}
              {view === 'portal' ? selectedPartner?.firmName      : ''}
              {view === 'form'   ? (editPartner ? 'Edit Partner' : 'Add New Partner') : ''}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {view === 'list'   ? 'Manage partner CA firms on FinOps 360 platform' : ''}
              {view === 'portal' ? `Viewing isolated data for ${selectedPartner?.firmName}` : ''}
              {view === 'form'   ? 'Set up a new partner firm with their own branded instance' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* content */}
      <div className="flex-1 overflow-hidden">
        {view === 'list' && (
          <PartnerList
            onAdd={handleAdd}
            onView={handleView}
            onLaunch={handleLaunch}
            onLaunchPartner={onLaunchPartner}
          />
        )}
        {view === 'portal' && selectedPartner && (
          <PartnerPortal
            partner={selectedPartner}
            onBack={() => setView('list')}
          />
        )}
      </div>

      {/* form modal */}
      {view === 'form' && (
        <PartnerForm
          partner={editPartner}
          onSave={handleSave}
          onClose={() => setView('list')}
        />
      )}
    </div>
  );
}
