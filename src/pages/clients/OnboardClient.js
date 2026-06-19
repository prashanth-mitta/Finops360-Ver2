/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, User, Building2, Shield, FileText, Settings } from 'lucide-react';

const STEPS = [
  { key: 'type', label: 'Client type', icon: User },
  { key: 'basic', label: 'Basic details', icon: User },
  { key: 'compliance', label: 'Compliance IDs', icon: Shield },
  { key: 'services', label: 'Services', icon: Settings },
  { key: 'review', label: 'Review', icon: Check },
];

const ALL_SERVICES = [
  'GST Filing', 'ITR Filing', 'TDS Filing', 'PF Monthly Filing',
  'ESI Monthly Filing', 'Payroll Processing', 'Tax Audit (3CD)',
  'Statutory Audit', 'P&L Preparation', 'Balance Sheet Preparation',
  'GST Reconciliation', 'Advance Tax Computation',
];

const ENTITY_TYPES = ['Private Limited', 'LLP', 'Partnership', 'Proprietorship', 'OPC', 'Public Limited', 'Trust / NGO'];

export default function OnboardClient({ onBack, onSuccess }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    clientType: '',
    // Individual
    firstName: '', lastName: '', middleName: '', dob: '', occupation: 'Salaried',
    nationality: 'Indian', maritalStatus: '',
    // Corporate
    companyName: '', entityType: '', cin: '', incorporationDate: '',
    primaryContactFirst: '', primaryContactLast: '', primaryContactEmail: '', primaryContactMobile: '',
    // Common
    email: '', mobile: '', altMobile: '',
    residentialAddress: '', registeredAddress: '', businessAddress: '',
    // Compliance
    pan: '', aadhaar: '', gstin: '', gstRegDate: '', gstType: 'Regular',
    gstFrequency: 'Monthly', tan: '',
    pfRegNo: '', esiRegNo: '', employees: '',
    // Services
    services: [], tier: 'Standard',
    // Internal
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));
  const toggleService = (s) => set('services', form.services.includes(s) ? form.services.filter(x => x !== s) : [...form.services, s]);

  const validateStep = () => {
    const e = {};
    if (step === 0 && !form.clientType) e.clientType = 'Please select a client type';
    if (step === 1) {
      if (form.clientType === 'individual') {
        if (!form.firstName.trim()) e.firstName = 'First name is required';
        if (!form.lastName.trim()) e.lastName = 'Last name is required';
        if (!form.dob) e.dob = 'Date of birth is required';
        if (!form.email.trim()) e.email = 'Email is required';
        if (!form.mobile.trim() || form.mobile.length !== 10) e.mobile = 'Enter a valid 10-digit mobile number';
      } else {
        if (!form.companyName.trim()) e.companyName = 'Company name is required';
        if (!form.entityType) e.entityType = 'Entity type is required';
        if (!form.email.trim()) e.email = 'Email is required';
        if (!form.mobile.trim() || form.mobile.length !== 10) e.mobile = 'Enter a valid 10-digit mobile number';
      }
    }
    if (step === 2) {
      if (!form.pan.trim() || form.pan.length !== 10) e.pan = 'Enter a valid 10-character PAN';
    }
    if (step === 3 && form.services.length === 0) e.services = 'Select at least one service';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validateStep()) setStep(s => s + 1); };
  const back = () => { setStep(s => s - 1); setErrors({}); };

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => onSuccess && onSuccess(), 1500);
  };

  const err = (f) => errors[f] ? <p className="text-red-500 text-xs mt-1">{errors[f]}</p> : null;

  const inputCls = (f) => `input-field ${errors[f] ? 'border-red-300 focus:ring-red-400' : ''}`;

  if (submitted) {
    return (
      <div className="p-6 max-w-xl mx-auto text-center py-20">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check size={28} className="text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Client onboarded successfully!</h2>
        <p className="text-gray-500 mt-2">
          {form.clientType === 'individual' ? `${form.firstName} ${form.lastName}` : form.companyName} has been added to FinOps 360.
        </p>
        <p className="text-sm text-gray-400 mt-1">A welcome email will be sent to {form.email}</p>
        <button onClick={onBack} className="btn-primary mt-6">Back to clients</button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-5 transition-colors">
        <ArrowLeft size={16} /> Back to clients
      </button>

      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Onboard new client</h1>
        <p className="text-sm text-gray-400 mt-0.5">Complete all steps to create the client profile</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-0 mb-8 overflow-x-auto pb-1">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const done = i < step;
          const active = i === step;
          return (
            <React.Fragment key={s.key}>
              <div className="flex flex-col items-center flex-shrink-0">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm transition-colors ${
                  done ? 'bg-green-500 text-white' : active ? 'bg-blue-700 text-white' : 'bg-gray-100 text-gray-400'
                }`}>
                  {done ? <Check size={16} /> : <Icon size={16} />}
                </div>
                <span className={`text-xs mt-1 whitespace-nowrap ${active ? 'text-blue-700 font-semibold' : 'text-gray-400'}`}>{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-0.5 flex-1 mx-2 mb-4 min-w-[20px] ${i < step ? 'bg-green-400' : 'bg-gray-100'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Step content */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">

        {/* Step 0 — Client type */}
        {step === 0 && (
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-4">What type of client is this?</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: 'individual', icon: User, label: 'Individual', desc: 'Salaried, business person, professional or NRI' },
                { value: 'corporate', icon: Building2, label: 'Corporate', desc: 'Pvt Ltd, LLP, Partnership, Proprietorship or Trust' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => set('clientType', opt.value)}
                  className={`p-5 rounded-xl border-2 text-left transition-all ${
                    form.clientType === opt.value ? 'border-blue-700 bg-blue-50' : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <opt.icon size={24} className={form.clientType === opt.value ? 'text-blue-700' : 'text-gray-400'} />
                  <div className="text-sm font-semibold text-gray-900 mt-2">{opt.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{opt.desc}</div>
                </button>
              ))}
            </div>
            {err('clientType')}
          </div>
        )}

        {/* Step 1 — Basic details */}
        {step === 1 && form.clientType === 'individual' && (
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Personal details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">First name <span className="text-red-500">*</span></label>
                <input className={inputCls('firstName')} value={form.firstName} onChange={e => set('firstName', e.target.value)} placeholder="Suresh" />
                {err('firstName')}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Last name <span className="text-red-500">*</span></label>
                <input className={inputCls('lastName')} value={form.lastName} onChange={e => set('lastName', e.target.value)} placeholder="Kumar" />
                {err('lastName')}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Middle name</label>
                <input className="input-field" value={form.middleName} onChange={e => set('middleName', e.target.value)} placeholder="Optional" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Date of birth <span className="text-red-500">*</span></label>
                <input type="date" className={inputCls('dob')} value={form.dob} onChange={e => set('dob', e.target.value)} />
                {err('dob')}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Occupation <span className="text-red-500">*</span></label>
                <select className="input-field" value={form.occupation} onChange={e => set('occupation', e.target.value)}>
                  <option>Salaried</option>
                  <option>Business</option>
                  <option>Professional</option>
                  <option>NRI</option>
                  <option>Retired</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Marital status</label>
                <select className="input-field" value={form.maritalStatus} onChange={e => set('maritalStatus', e.target.value)}>
                  <option value="">Select</option>
                  <option>Single</option>
                  <option>Married</option>
                  <option>Divorced</option>
                  <option>Widowed</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address <span className="text-red-500">*</span></label>
              <input type="email" className={inputCls('email')} value={form.email} onChange={e => set('email', e.target.value)} placeholder="suresh@email.com" />
              {err('email')}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Mobile number <span className="text-red-500">*</span></label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-200 rounded-l-lg bg-gray-50 text-sm text-gray-500 font-medium">+91</span>
                  <input
                    type="tel" maxLength={10}
                    className={`input-field rounded-l-none flex-1 ${errors.mobile ? 'border-red-300' : ''}`}
                    value={form.mobile}
                    onChange={e => set('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="9876543210"
                  />
                </div>
                {err('mobile')}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Alternate mobile</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-200 rounded-l-lg bg-gray-50 text-sm text-gray-500">+91</span>
                  <input type="tel" maxLength={10} className="input-field rounded-l-none flex-1"
                    value={form.altMobile} onChange={e => set('altMobile', e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="Optional" />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Residential address <span className="text-red-500">*</span></label>
              <textarea rows={2} className="input-field" value={form.residentialAddress} onChange={e => set('residentialAddress', e.target.value)} placeholder="Full address as per Aadhaar" />
            </div>
          </div>
        )}

        {/* Step 1 — Corporate */}
        {step === 1 && form.clientType === 'corporate' && (
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Company details</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Company name <span className="text-red-500">*</span></label>
              <input className={inputCls('companyName')} value={form.companyName} onChange={e => set('companyName', e.target.value)} placeholder="As per MCA / ROC registration" />
              {err('companyName')}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Entity type <span className="text-red-500">*</span></label>
                <select className={inputCls('entityType')} value={form.entityType} onChange={e => set('entityType', e.target.value)}>
                  <option value="">Select entity type</option>
                  {ENTITY_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
                {err('entityType')}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">CIN / LLPIN</label>
                <input className="input-field" value={form.cin} onChange={e => set('cin', e.target.value)} placeholder="U72900KA2018PTC123456" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Date of incorporation</label>
                <input type="date" className="input-field" value={form.incorporationDate} onChange={e => set('incorporationDate', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Company email <span className="text-red-500">*</span></label>
                <input type="email" className={inputCls('email')} value={form.email} onChange={e => set('email', e.target.value)} placeholder="accounts@company.in" />
                {err('email')}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Company mobile <span className="text-red-500">*</span></label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-200 rounded-l-lg bg-gray-50 text-sm text-gray-500">+91</span>
                  <input type="tel" maxLength={10} className={`input-field rounded-l-none flex-1 ${errors.mobile ? 'border-red-300' : ''}`}
                    value={form.mobile} onChange={e => set('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="9876543210" />
                </div>
                {err('mobile')}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Financial year end</label>
                <input className="input-field bg-gray-50" value="March 31 (default)" disabled />
              </div>
            </div>
            <div className="border-t border-gray-100 pt-4">
              <p className="text-sm font-semibold text-gray-700 mb-3">Primary contact person</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">First name</label>
                  <input className="input-field" value={form.primaryContactFirst} onChange={e => set('primaryContactFirst', e.target.value)} placeholder="Ravi" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Last name</label>
                  <input className="input-field" value={form.primaryContactLast} onChange={e => set('primaryContactLast', e.target.value)} placeholder="Mehta" />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Registered address</label>
              <textarea rows={2} className="input-field" value={form.registeredAddress} onChange={e => set('registeredAddress', e.target.value)} placeholder="As per MCA" />
            </div>
          </div>
        )}

        {/* Step 2 — Compliance IDs */}
        {step === 2 && (
          <div className="space-y-5">
            <h2 className="text-base font-semibold text-gray-900 mb-1">Compliance IDs</h2>
            <p className="text-xs text-gray-400 -mt-3 mb-4">Sensitive fields are encrypted and masked. Only last 4 digits visible after saving.</p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">PAN number <span className="text-red-500">*</span></label>
                <input className={`input-field uppercase font-mono ${errors.pan ? 'border-red-300' : ''}`} value={form.pan}
                  onChange={e => set('pan', e.target.value.toUpperCase().slice(0, 10))} placeholder="ABCDE1234F" maxLength={10} />
                {err('pan')}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Aadhaar number
                  <span className="ml-1 text-xs text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">Encrypted</span>
                </label>
                <input type="text" className="input-field font-mono" value={form.aadhaar}
                  onChange={e => set('aadhaar', e.target.value.replace(/\D/g, '').slice(0, 12))}
                  placeholder="12 digit Aadhaar" maxLength={12} />
                <p className="text-xs text-gray-400 mt-1">Stored encrypted — only last 4 digits shown</p>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <p className="text-sm font-semibold text-gray-700 mb-3">GST details</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">GSTIN</label>
                  <input className="input-field font-mono uppercase" value={form.gstin}
                    onChange={e => set('gstin', e.target.value.toUpperCase().slice(0, 15))} placeholder="29ABCDE1234F1Z5" maxLength={15} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Registration date</label>
                  <input type="date" className="input-field" value={form.gstRegDate} onChange={e => set('gstRegDate', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Registration type</label>
                  <select className="input-field" value={form.gstType} onChange={e => set('gstType', e.target.value)}>
                    <option>Regular</option><option>Composition</option><option>SEZ</option><option>Casual</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Filing frequency</label>
                  <select className="input-field" value={form.gstFrequency} onChange={e => set('gstFrequency', e.target.value)}>
                    <option>Monthly</option><option>Quarterly</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <p className="text-sm font-semibold text-gray-700 mb-3">Other registrations</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">TAN number</label>
                  <input className="input-field font-mono uppercase" value={form.tan}
                    onChange={e => set('tan', e.target.value.toUpperCase().slice(0, 10))} placeholder="MUMA12345B (if applicable)" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">PF registration number</label>
                  <input className="input-field" value={form.pfRegNo} onChange={e => set('pfRegNo', e.target.value)} placeholder="KA/BGN/123456 (if applicable)" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3 — Services */}
        {step === 3 && (
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-1">Services & tier</h2>
            <p className="text-xs text-gray-400 mb-5">Select all services this client has subscribed to</p>
            <div className="grid grid-cols-2 gap-2 mb-5">
              {ALL_SERVICES.map(s => (
                <button key={s} onClick={() => toggleService(s)}
                  className={`flex items-center gap-2 p-3 rounded-lg border text-left text-sm transition-all ${
                    form.services.includes(s) ? 'border-blue-700 bg-blue-50 text-blue-700 font-medium' : 'border-gray-100 hover:border-gray-200 text-gray-600'
                  }`}>
                  <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${form.services.includes(s) ? 'bg-blue-700 border-blue-700' : 'border-gray-300'}`}>
                    {form.services.includes(s) && <Check size={10} className="text-white" />}
                  </div>
                  {s}
                </button>
              ))}
            </div>
            {err('services')}
            <div className="border-t border-gray-100 pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Client tier</label>
              <div className="flex gap-3">
                {['Gold', 'Silver', 'Standard'].map(t => (
                  <button key={t} onClick={() => set('tier', t)}
                    className={`flex-1 py-2 rounded-lg border-2 text-sm font-semibold transition-all ${
                      form.tier === t ? 'border-blue-700 bg-blue-50 text-blue-700' : 'border-gray-100 text-gray-500'
                    }`}>{t}</button>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Internal notes</label>
              <textarea rows={2} className="input-field" value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Any notes for the team (not visible to client)" />
            </div>
          </div>
        )}

        {/* Step 4 — Review */}
        {step === 4 && (
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-4">Review & confirm</h2>
            <div className="space-y-3">
              {[
                { label: 'Client name', value: form.clientType === 'individual' ? `${form.firstName} ${form.lastName}` : form.companyName },
                { label: 'Client type', value: form.clientType === 'individual' ? 'Individual' : `Corporate — ${form.entityType}` },
                { label: 'Email', value: form.email },
                { label: 'Mobile', value: `+91 ${form.mobile}` },
                { label: 'PAN', value: form.pan },
                { label: 'GSTIN', value: form.gstin || 'Not provided' },
                { label: 'Services', value: form.services.join(', ') || 'None selected' },
                { label: 'Tier', value: form.tier },
              ].map(row => (
                <div key={row.label} className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-500">{row.label}</span>
                  <span className="text-sm font-medium text-gray-900 text-right max-w-xs">{row.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-xs text-blue-700">A welcome email will be sent to <strong>{form.email}</strong> with login credentials after onboarding.</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between mt-5">
        <button onClick={step === 0 ? onBack : back} className="btn-secondary flex items-center gap-2">
          <ArrowLeft size={15} /> {step === 0 ? 'Cancel' : 'Back'}
        </button>
        {step < STEPS.length - 1 ? (
          <button onClick={next} className="btn-primary flex items-center gap-2">
            Next <ArrowRight size={15} />
          </button>
        ) : (
          <button onClick={handleSubmit} className="btn-primary flex items-center gap-2 bg-green-600 hover:bg-green-700">
            <Check size={15} /> Confirm & onboard
          </button>
        )}
      </div>
    </div>
  );
}
