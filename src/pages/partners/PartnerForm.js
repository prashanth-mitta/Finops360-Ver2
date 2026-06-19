import React, { useState, useEffect } from 'react';

const PLANS = ['starter', 'professional', 'enterprise'];
const PRESET_COLORS = ['#6366f1','#0ea5e9','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899','#14b8a6','#f97316','#64748b'];

export default function PartnerForm({ partner, onSave, onClose }) {
  const isEdit = !!partner;
  const [form, setForm] = useState({
    firmName: '', tagline: '', logoText: '', primaryColor: '#6366f1',
    email: '', phone: '', address: '', gstin: '', plan: 'professional',
    adminName: '', adminPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [step, setStep]     = useState(1); // 1=firm details, 2=branding, 3=admin account

  useEffect(() => {
    if (partner) {
      setForm(f => ({ ...f, ...partner }));
    }
  }, [partner]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  function validate(s) {
    const e = {};
    if (s === 1) {
      if (!form.firmName.trim()) e.firmName = 'Firm name required';
      if (!form.email.trim())    e.email    = 'Admin email required';
      if (!form.gstin.trim())    e.gstin    = 'GSTIN required';
    }
    if (s === 2) {
      if (!form.logoText.trim()) e.logoText = 'Logo initials required (2 letters)';
    }
    if (s === 3 && !isEdit) {
      if (!form.adminName.trim())     e.adminName     = 'Admin name required';
      if (!form.adminPassword.trim()) e.adminPassword = 'Password required';
      if (form.adminPassword.length < 6) e.adminPassword = 'Min 6 characters';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() { if (validate(step)) setStep(s => s + 1); }
  function back() { setStep(s => s - 1); }

  function submit() {
    if (!validate(3)) return;
    onSave(form);
  }

  const STEP_LABELS = ['Firm Details', 'Branding', 'Admin Account'];

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col pointer-events-auto">

          {/* header */}
          <div className="px-6 py-4 border-b border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-slate-900">{isEdit ? 'Edit Partner' : 'Add New Partner'}</h2>
              <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:bg-slate-100 rounded-lg text-xl">×</button>
            </div>
            {/* step indicators */}
            <div className="flex items-center gap-2">
              {STEP_LABELS.map((label, i) => (
                <React.Fragment key={i}>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step > i+1 ? 'bg-emerald-500 text-white' : step === i+1 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                      {step > i+1 ? '✓' : i+1}
                    </div>
                    <span className={`text-xs font-medium ${step === i+1 ? 'text-indigo-700' : 'text-slate-400'}`}>{label}</span>
                  </div>
                  {i < 2 && <div className={`flex-1 h-px ${step > i+1 ? 'bg-emerald-300' : 'bg-slate-200'}`} />}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* body */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 max-h-[65vh]">

            {/* ── STEP 1: Firm Details ─────────────────────────── */}
            {step === 1 && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Firm Name <span className="text-red-500">*</span></label>
                  <input value={form.firmName} onChange={e => set('firmName', e.target.value)} placeholder="e.g. Mehta & Associates"
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.firmName ? 'border-red-400' : 'border-slate-200'}`} />
                  {errors.firmName && <p className="text-xs text-red-500 mt-1">{errors.firmName}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Tagline</label>
                  <input value={form.tagline} onChange={e => set('tagline', e.target.value)} placeholder="e.g. Chartered Accountants"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Admin Email <span className="text-red-500">*</span></label>
                  <input value={form.email} onChange={e => set('email', e.target.value)} placeholder="admin@firmname.in"
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.email ? 'border-red-400' : 'border-slate-200'}`} />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Phone</label>
                    <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+91 98765 00000"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">GSTIN <span className="text-red-500">*</span></label>
                    <input value={form.gstin} onChange={e => set('gstin', e.target.value.toUpperCase())} placeholder="27ABCDE1234F1Z5"
                      className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono ${errors.gstin ? 'border-red-400' : 'border-slate-200'}`} />
                    {errors.gstin && <p className="text-xs text-red-500 mt-1">{errors.gstin}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Address</label>
                  <textarea value={form.address} onChange={e => set('address', e.target.value)} rows={2} placeholder="Office address…"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Plan</label>
                  <div className="flex gap-2">
                    {PLANS.map(p => (
                      <button key={p} type="button" onClick={() => set('plan', p)}
                        className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-all capitalize ${form.plan === p ? 'bg-indigo-600 text-white border-indigo-600' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ── STEP 2: Branding ─────────────────────────────── */}
            {step === 2 && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Logo Initials <span className="text-red-500">*</span></label>
                  <input value={form.logoText} onChange={e => set('logoText', e.target.value.toUpperCase().slice(0,3))} placeholder="e.g. MA"
                    maxLength={3}
                    className={`w-full border rounded-lg px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.logoText ? 'border-red-400' : 'border-slate-200'}`} />
                  {errors.logoText && <p className="text-xs text-red-500 mt-1">{errors.logoText}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2">Brand Color</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {PRESET_COLORS.map(c => (
                      <button key={c} type="button" onClick={() => set('primaryColor', c)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${form.primaryColor === c ? 'border-slate-800 scale-110' : 'border-transparent hover:scale-105'}`}
                        style={{ background: c }} />
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="color" value={form.primaryColor} onChange={e => set('primaryColor', e.target.value)}
                      className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer" />
                    <input value={form.primaryColor} onChange={e => set('primaryColor', e.target.value)}
                      className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </div>

                {/* live preview */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2">Live Preview</label>
                  <div className="rounded-xl border border-slate-200 overflow-hidden">
                    {/* mock sidebar */}
                    <div className="flex" style={{ height: 140 }}>
                      <div className="w-36 flex flex-col" style={{ background: '#0f172a' }}>
                        <div className="flex items-center gap-2 px-3 py-3 border-b border-slate-700">
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-black" style={{ background: form.primaryColor }}>
                            {form.logoText || '??'}
                          </div>
                          <span className="text-white text-xs font-bold truncate">{form.firmName || 'Firm Name'}</span>
                        </div>
                        <div className="px-2 py-2 space-y-1">
                          {['Dashboard','Clients','Tickets'].map((item, i) => (
                            <div key={item} className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-xs font-medium ${i === 0 ? 'text-white' : 'text-slate-400'}`}
                              style={i === 0 ? { background: form.primaryColor } : {}}>
                              <span>{['🏠','👥','🎫'][i]}</span><span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex-1 bg-slate-50 p-3">
                        <div className="h-5 w-32 rounded mb-2" style={{ background: form.primaryColor, opacity: 0.15 }} />
                        <div className="grid grid-cols-3 gap-2">
                          {[1,2,3].map(i => (
                            <div key={i} className="h-14 rounded-lg bg-white border border-slate-200 p-2">
                              <div className="h-2 w-10 bg-slate-200 rounded mb-1.5" />
                              <div className="h-4 w-8 rounded" style={{ background: form.primaryColor, opacity: 0.3 }} />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ── STEP 3: Admin Account ─────────────────────────── */}
            {step === 3 && (
              <>
                <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-2">
                  <p className="text-xs font-semibold text-indigo-800 mb-1">🔐 Partner Admin Account</p>
                  <p className="text-xs text-indigo-600">This creates the Master Admin account for <strong>{form.firmName}</strong>. They will use these credentials to log in to their platform.</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Admin Full Name <span className="text-red-500">*</span></label>
                  <input value={form.adminName} onChange={e => set('adminName', e.target.value)} placeholder="e.g. Vikram Mehta"
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.adminName ? 'border-red-400' : 'border-slate-200'}`} />
                  {errors.adminName && <p className="text-xs text-red-500 mt-1">{errors.adminName}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Login Email</label>
                  <input value={form.email} disabled className="w-full border border-slate-100 bg-slate-50 rounded-lg px-3 py-2 text-sm text-slate-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Password <span className="text-red-500">*</span></label>
                  <input type="password" value={form.adminPassword} onChange={e => set('adminPassword', e.target.value)} placeholder="Min 6 characters"
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.adminPassword ? 'border-red-400' : 'border-slate-200'}`} />
                  {errors.adminPassword && <p className="text-xs text-red-500 mt-1">{errors.adminPassword}</p>}
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                  <p className="text-xs text-amber-700 font-medium">⚠️ Share these credentials securely with the partner firm admin. They can change their password after first login in Settings.</p>
                </div>
              </>
            )}
          </div>

          {/* footer */}
          <div className="flex-none border-t border-slate-200 px-6 py-4 flex items-center justify-between bg-slate-50">
            <div>
              {step > 1 && (
                <button onClick={back} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">← Back</button>
              )}
            </div>
            <div className="flex gap-3">
              <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">Cancel</button>
              {step < 3
                ? <button onClick={next} className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm">Next →</button>
                : <button onClick={submit} className="px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-sm">
                    {isEdit ? '✓ Save Changes' : '🚀 Create Partner'}
                  </button>
              }
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
