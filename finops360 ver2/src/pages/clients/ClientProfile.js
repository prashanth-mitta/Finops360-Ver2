/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import {
  ArrowLeft, Mail, Phone,  Calendar,  User,
  Shield, FileText, Ticket, MessageSquare, Edit, CheckCircle,
  Clock, AlertCircle, Eye, ChevronRight, Lock
} from 'lucide-react';
import { CLIENTS, TICKETS, STAGE } from '../../data/mockData';
import { MaskedField, StageTag, PriorityTag } from '../../components/common/UIComponents';

const TIER_COLORS = {
  Gold: 'bg-amber-100 text-amber-700 border-amber-200',
  Silver: 'bg-gray-100 text-gray-600 border-gray-200',
  Standard: 'bg-blue-50 text-blue-600 border-blue-100',
};

const TABS = [
  { key: 'overview', label: 'Overview', icon: User },
  { key: 'gst', label: 'GST', icon: Shield },
  { key: 'it', label: 'Income Tax', icon: FileText },
  { key: 'pf', label: 'PF / ESI', icon: Shield },
  { key: 'tickets', label: 'Tickets', icon: Ticket },
  { key: 'documents', label: 'Documents', icon: FileText },
];

function FieldRow({ label, value, masked, sensitive }) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-500 w-44 flex-shrink-0">{label}</span>
      <div className="flex-1 text-right">
        {masked ? (
          <MaskedField value={value} label={label} />
        ) : (
          <span className="text-sm font-medium text-gray-900">{value || <span className="text-gray-300">—</span>}</span>
        )}
      </div>
      {sensitive && <Lock size={12} className="text-gray-300 ml-2 mt-0.5 flex-shrink-0" />}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 mb-4">
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 pb-2 border-b border-gray-100">{title}</h3>
      {children}
    </div>
  );
}

export default function ClientProfile({ clientId, onBack, onOpenTicket }) {
  const [activeTab, setActiveTab] = useState('overview');
  const client = CLIENTS.find(c => c.id === clientId);
  if (!client) return null;

  const clientTickets = TICKETS.filter(t => t.clientId === clientId);
  const activeTickets = clientTickets.filter(t => t.stage !== STAGE.DONE);
  const doneTickets = clientTickets.filter(t => t.stage === STAGE.DONE);
  const isIndividual = client.clientType === 'individual';
  const clientName = isIndividual ? `${client.firstName} ${client.lastName}` : client.companyName;
  const initials = clientName?.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

  const renderOverview = () => (
    <div className="space-y-0">
      <Section title="Basic information">
        {isIndividual ? (
          <>
            <FieldRow label="First name" value={client.firstName} />
            <FieldRow label="Last name" value={client.lastName} />
            <FieldRow label="Date of birth" value={client.dob} />
            <FieldRow label="Occupation" value={client.occupation} />
            <FieldRow label="Nationality" value="Indian" />
            <FieldRow label="Marital status" value={client.maritalStatus || '—'} />
          </>
        ) : (
          <>
            <FieldRow label="Company name" value={client.companyName} />
            <FieldRow label="Entity type" value={client.entityType} />
            <FieldRow label="CIN / LLPIN" value={client.cin} />
            <FieldRow label="Date of incorporation" value={client.incorporationDate} />
            <FieldRow label="Financial year end" value="March 31" />
            <FieldRow label="Primary contact" value={client.primaryContact || 'Suresh Kumar'} />
          </>
        )}
      </Section>

      <Section title="Contact details">
        <FieldRow label="Email address" value={client.email} />
        <FieldRow label="Mobile" value={`+91 ${client.mobile}`} />
        <FieldRow label="Alternate mobile" value={client.altMobile || '—'} />
        <FieldRow label="Address" value={isIndividual ? client.residentialAddress : client.registeredAddress} />
        {!isIndividual && <FieldRow label="Business address" value={client.businessAddress || '—'} />}
      </Section>

      <Section title="Identity documents">
        <FieldRow label="PAN number" value={client.pan} />
        <FieldRow label="Aadhaar number" value={client.aadhaar} masked sensitive />
        {!isIndividual && <FieldRow label="CIN" value={client.cin} />}
      </Section>

      <Section title="Account information">
        <FieldRow label="Client ID" value={client.id} />
        <FieldRow label="Client type" value={isIndividual ? 'Individual' : 'Corporate'} />
        <FieldRow label="Tier" value={client.tier} />
        <FieldRow label="Status" value={client.status} />
        <FieldRow label="Onboarding date" value={client.onboardingDate} />
        <FieldRow label="Services subscribed" value={client.services?.join(', ')} />
      </Section>

      {client.notes && (
        <Section title="Internal notes">
          <p className="text-sm text-gray-600 leading-relaxed">{client.notes}</p>
          <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
            <Lock size={11} /> Visible to team only — not shown to client
          </p>
        </Section>
      )}
    </div>
  );

  const renderGST = () => (
    <div className="space-y-0">
      {client.gst ? (
        <>
          <Section title="GST registration">
            <FieldRow label="GSTIN" value={client.gst.gstin} />
            <FieldRow label="Registration date" value={client.gst.registrationDate} />
            <FieldRow label="Registration type" value={client.gst.type} />
            <FieldRow label="Filing frequency" value={client.gst.filingFrequency} />
            <FieldRow label="Nature of business" value={client.gst.nature || 'Services'} />
            <FieldRow label="HSN / SAC codes" value={client.gst.hsn || 'Service — 9983'} />
            <FieldRow label="EVC / DSC preference" value={client.gst.signingMethod || 'EVC'} />
          </Section>
          <Section title="Portal access">
            <FieldRow label="GST portal username" value="****@gst" sensitive masked />
            <FieldRow label="Portal password" value="Never stored — client present during filing" />
            <div className="mt-2 p-3 bg-amber-50 rounded-lg border border-amber-100">
              <p className="text-xs text-amber-700">
                <strong>Security policy:</strong> GST portal passwords are never stored. Client must be present (in-person or video call) during filing. OTP is sent to client's registered mobile directly.
              </p>
            </div>
          </Section>
          {client.gst.additionalGstins && (
            <Section title="Additional GSTINs">
              <p className="text-sm text-gray-500">No additional GSTINs registered.</p>
            </Section>
          )}
        </>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 p-10 text-center">
          <Shield size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">GST details not filled</p>
          <p className="text-gray-400 text-sm mt-1">Add GST registration details for this client</p>
          <button className="btn-primary mt-4">Add GST details</button>
        </div>
      )}
    </div>
  );

  const renderIT = () => (
    <div className="space-y-0">
      {client.it ? (
        <>
          <Section title="Income tax details">
            <FieldRow label="PAN number" value={client.pan} />
            <FieldRow label="ITR form type" value={client.it.itForm} />
            <FieldRow label="Assessment year" value={client.it.ay} />
            <FieldRow label="Tax regime" value={`${client.it.taxRegime} Regime`} />
            <FieldRow label="TAN number" value={client.tan || '—'} />
            <FieldRow label="Tax audit applicable" value={client.it.taxAudit || 'No'} />
          </Section>
          <Section title="Income sources">
            {isIndividual ? (
              <>
                <FieldRow label="Salary income" value={client.it.salary ? 'Yes' : 'To be confirmed'} />
                <FieldRow label="Business income" value={client.it.business ? 'Yes' : 'To be confirmed'} />
                <FieldRow label="Capital gains" value={client.it.capitalGains ? 'Yes' : 'To be confirmed'} />
                <FieldRow label="House property" value={client.it.houseProperty ? 'Yes' : 'No'} />
                <FieldRow label="Other sources" value={client.it.otherSources ? 'Yes' : 'No'} />
              </>
            ) : (
              <>
                <FieldRow label="Business type" value={client.entityType} />
                <FieldRow label="Previous year turnover" value={client.it.turnover || 'To be updated'} />
              </>
            )}
          </Section>
          <Section title="Portal access">
            <FieldRow label="IT portal login (PAN)" value={client.pan} />
            <FieldRow label="Portal password" value="Never stored — client present during filing" />
            <div className="mt-2 p-3 bg-amber-50 rounded-lg border border-amber-100">
              <p className="text-xs text-amber-700">
                <strong>Security policy:</strong> Income tax portal passwords are never stored. OTP for e-filing goes directly to client's Aadhaar-linked mobile.
              </p>
            </div>
          </Section>
          <Section title="Bank details (for refund)">
            <FieldRow label="Bank name" value={client.bank?.name || 'To be added'} />
            <FieldRow label="Account number" value={client.bank?.account || 'XXXXXXXXXXX3456'} masked sensitive />
            <FieldRow label="IFSC code" value={client.bank?.ifsc || 'To be added'} />
          </Section>
        </>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 p-10 text-center">
          <FileText size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Income tax details not filled</p>
          <button className="btn-primary mt-4">Add IT details</button>
        </div>
      )}
    </div>
  );

  const renderPF = () => (
    <div className="space-y-0">
      {client.pf ? (
        <>
          <Section title="PF registration">
            <FieldRow label="PF registration number" value={client.pf.pfRegNo} />
            <FieldRow label="ESI registration number" value={client.pf.esiRegNo || '—'} />
            <FieldRow label="Number of employees" value={String(client.pf.employees)} />
            <FieldRow label="Payroll cycle" value={client.pf.payrollCycle} />
            <FieldRow label="PT registration" value={client.pf.pt || '—'} />
          </Section>
          <Section title="Portal access">
            <FieldRow label="PF portal login" value="Never stored — client present during filing" />
            <div className="mt-2 p-3 bg-amber-50 rounded-lg border border-amber-100">
              <p className="text-xs text-amber-700">
                <strong>Security policy:</strong> PF portal passwords are never stored in the system.
              </p>
            </div>
          </Section>
        </>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 p-10 text-center">
          <Shield size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">PF / ESI details not applicable or not filled</p>
          <button className="btn-primary mt-4">Add PF / ESI details</button>
        </div>
      )}
    </div>
  );

  const renderTickets = () => (
    <div className="space-y-3">
      {activeTickets.length > 0 && (
        <>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Active tickets ({activeTickets.length})</h3>
          {activeTickets.map(t => (
            <div key={t.id} onClick={() => onOpenTicket && onOpenTicket(t.id)}
              className="bg-white rounded-xl border border-gray-100 p-4 hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-gray-400">{t.id}</span>
                    <PriorityTag priority={t.priority} />
                  </div>
                  <div className="text-sm font-semibold text-gray-900">{t.title}</div>
                  <div className="text-xs text-gray-400 mt-1">Assigned to: {t.assignedToName} · Due: {t.dueDate}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <StageTag stage={t.stage} />
                  <ChevronRight size={14} className="text-gray-300" />
                </div>
              </div>
              {t.stage === STAGE.DOCS && (
                <div className="mt-3 pt-3 border-t border-gray-50">
                  <div className="flex items-center gap-2">
                    <AlertCircle size={13} className="text-amber-500" />
                    <span className="text-xs text-amber-700 font-medium">
                      {t.checklist.filter(c => !c.received).length} documents pending
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </>
      )}

      {doneTickets.length > 0 && (
        <>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mt-4">Completed tickets ({doneTickets.length})</h3>
          {doneTickets.map(t => (
            <div key={t.id} className="bg-white rounded-xl border border-gray-100 p-4 opacity-80">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-gray-400">{t.id}</span>
                  </div>
                  <div className="text-sm font-medium text-gray-700">{t.title}</div>
                  {t.arn && <div className="text-xs text-green-600 mt-1 font-medium">ARN: {t.arn}</div>}
                  <div className="text-xs text-gray-400 mt-0.5">Filed: {t.dueDate}</div>
                </div>
                <StageTag stage={t.stage} />
              </div>
            </div>
          ))}
        </>
      )}

      {clientTickets.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-10 text-center">
          <Ticket size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No tickets yet</p>
          <p className="text-gray-400 text-sm mt-1">Create a ticket to start tracking work for this client</p>
          <button className="btn-primary mt-4">Create ticket</button>
        </div>
      )}
    </div>
  );

  const renderDocuments = () => (
    <div className="bg-white rounded-xl border border-gray-100 p-10 text-center">
      <FileText size={32} className="text-gray-300 mx-auto mb-3" />
      <p className="text-gray-500 font-medium">Document repository</p>
      <p className="text-gray-400 text-sm mt-1">All documents for this client will appear here. Documents are tied to individual tickets.</p>
      <p className="text-xs text-gray-400 mt-3">This module will be built in Session 3 — Tickets & Documents.</p>
    </div>
  );

  const tabContent = {
    overview: renderOverview,
    gst: renderGST,
    it: renderIT,
    pf: renderPF,
    tickets: renderTickets,
    documents: renderDocuments,
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Back button */}
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-5 transition-colors">
        <ArrowLeft size={16} /> Back to clients
      </button>

      {/* Client header card */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 ${isIndividual ? 'bg-blue-600' : 'bg-indigo-600'}`}>
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-gray-900">{clientName}</h1>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${TIER_COLORS[client.tier]}`}>{client.tier}</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-green-50 text-green-700">Active</span>
              </div>
              <div className="flex items-center gap-4 mt-1.5 text-sm text-gray-500 flex-wrap">
                <span className="flex items-center gap-1"><Mail size={13} />{client.email}</span>
                <span className="flex items-center gap-1"><Phone size={13} />+91 {client.mobile}</span>
                <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{client.id}</span>
              </div>
            </div>
          </div>
          <button className="btn-secondary flex items-center gap-1.5 flex-shrink-0">
            <Edit size={14} /> Edit profile
          </button>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5 pt-5 border-t border-gray-50">
          {[
            { label: 'Active tickets', value: activeTickets.length, color: 'text-blue-700' },
            { label: 'Completed', value: doneTickets.length, color: 'text-green-600' },
            { label: 'Services', value: client.services?.length || 0, color: 'text-purple-600' },
            { label: 'Docs pending', value: activeTickets.reduce((acc, t) => acc + t.checklist.filter(c => !c.received).length, 0), color: 'text-amber-600' },
          ].map(s => (
            <div key={s.label} className="text-center p-3 bg-gray-50 rounded-lg">
              <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-100 mb-5 overflow-x-auto">
        {TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.key
                  ? 'border-blue-700 text-blue-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon size={14} />
              {tab.label}
              {tab.key === 'tickets' && clientTickets.length > 0 && (
                <span className="ml-1 bg-blue-100 text-blue-700 text-xs px-1.5 py-0.5 rounded-full font-medium">
                  {clientTickets.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div>{tabContent[activeTab]?.()}</div>
    </div>
  );
}
