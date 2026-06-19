import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, User, Briefcase, Shield, Eye, EyeOff } from 'lucide-react';

const DEPARTMENTS = ['Tax & Compliance', 'Audit', 'Accounts', 'Payroll', 'GST', 'Management', 'HR', 'Sales'];
const DESIGNATIONS = ['Junior Associate', 'Associate', 'Senior Associate', 'Assistant Manager', 'Manager', 'Senior Manager', 'CA', 'Partner'];
const STEPS = [
  { key: 'personal', label: 'Personal details', icon: User },
  { key: 'employment', label: 'Employment', icon: Briefcase },
  { key: 'access', label: 'Access & role', icon: Shield },
  { key: 'review', label: 'Review', icon: Check },
];

export default function OnboardAssociate({ onBack, onSuccess }) {
  const [step, setStep] = useState(0);
  const [showPass, setShowPass] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    firstName: '', lastName: '', middleName: '',
    dob: '', gender: '', mobile: '', altMobile: '',
    email: '', personalEmail: '',
    address: '',
    employeeId: '', department: '', designation: '',
    dateOfJoining: '', reportingManager: '',
    employmentType: 'Full-time',
    role: 'associate',
    password: '', confirmPassword: '',
    notes: '',
  });

  const set = (f, v) => { setForm(p => ({ ...p, [f]: v })); setErrors(p => ({ ...p, [f]: '' })); };

  const validate = () => {
    const e = {};
    if (step === 0) {
      if (!form.firstName.trim()) e.firstName = 'First name is required';
      if (!form.lastName.trim()) e.lastName = 'Last name is required';
      if (!form.mobile || form.mobile.length !== 10) e.mobile = 'Enter valid 10-digit mobile';
      if (!form.email.trim()) e.email = 'Work email is required';
      if (!form.dob) e.dob = 'Date of birth is required';
    }
    if (step === 1) {
      if (!form.employeeId.trim()) e.employeeId = 'Employee ID is required';
      if (!form.department) e.department = 'Select a department';
      if (!form.designation) e.designation = 'Select a designation';
      if (!form.dateOfJoining) e.dateOfJoining = 'Date of joining is required';
    }
    if (step === 2) {
      if (!form.password || form.password.length < 6) e.password = 'Minimum 6 characters';
      if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate()) setStep(s => s + 1); };
  const back = () => { setStep(s => s - 1); setErrors({}); };
  const handleSubmit = () => { setSubmitted(true); setTimeout(() => onSuccess && onSuccess(), 1500); };

  const inp = (f) => `input-field ${errors[f] ? 'border-red-300' : ''}`;
  const err = (f) => errors[f] ? <p className="text-red-500 text-xs mt-1">{errors[f]}</p> : null;

  if (submitted) {
    return (
      <div className="p-6 max-w-xl mx-auto text-center py-20">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check size={28} className="text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Associate onboarded!</h2>
        <p className="text-gray-500 mt-2">{form.firstName} {form.lastName} has been added to the team.</p>
        <p className="text-sm text-gray-400 mt-1">Login credentials sent to {form.email}</p>
        <button onClick={onBack} className="btn-primary mt-6">Back to associates</button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-5 transition-colors">
        <ArrowLeft size={16} /> Back to associates
      </button>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Onboard new associate</h1>
        <p className="text-sm text-gray-400 mt-0.5">Add a new team member to FinOps 360</p>
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
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm transition-colors ${done ? 'bg-green-500 text-white' : active ? 'bg-blue-700 text-white' : 'bg-gray-100 text-gray-400'}`}>
                  {done ? <Check size={16} /> : <Icon size={16} />}
                </div>
                <span className={`text-xs mt-1 whitespace-nowrap ${active ? 'text-blue-700 font-semibold' : 'text-gray-400'}`}>{s.label}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`h-0.5 flex-1 mx-2 mb-4 min-w-[20px] ${i < step ? 'bg-green-400' : 'bg-gray-100'}`} />}
            </React.Fragment>
          );
        })}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        {/* Step 0 — Personal */}
        {step === 0 && (
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Personal details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">First name <span className="text-red-500">*</span></label>
                <input className={inp('firstName')} value={form.firstName} onChange={e => set('firstName', e.target.value)} placeholder="Vikram" />
                {err('firstName')}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Last name <span className="text-red-500">*</span></label>
                <input className={inp('lastName')} value={form.lastName} onChange={e => set('lastName', e.target.value)} placeholder="Patel" />
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
                <input type="date" className={inp('dob')} value={form.dob} onChange={e => set('dob', e.target.value)} />
                {err('dob')}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Gender</label>
                <select className="input-field" value={form.gender} onChange={e => set('gender', e.target.value)}>
                  <option value="">Select</option>
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Work email <span className="text-red-500">*</span></label>
                <input type="email" className={inp('email')} value={form.email} onChange={e => set('email', e.target.value)} placeholder="vikram@finops360.in" />
                {err('email')}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Mobile <span className="text-red-500">*</span></label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-200 rounded-l-lg bg-gray-50 text-sm text-gray-500">+91</span>
                  <input type="tel" maxLength={10} className={`input-field rounded-l-none flex-1 ${errors.mobile ? 'border-red-300' : ''}`}
                    value={form.mobile} onChange={e => set('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="9876543210" />
                </div>
                {err('mobile')}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Personal email</label>
                <input type="email" className="input-field" value={form.personalEmail} onChange={e => set('personalEmail', e.target.value)} placeholder="Optional" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Residential address</label>
              <textarea rows={2} className="input-field" value={form.address} onChange={e => set('address', e.target.value)} placeholder="Full address" />
            </div>
          </div>
        )}

        {/* Step 1 — Employment */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Employment details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Employee ID <span className="text-red-500">*</span></label>
                <input className={inp('employeeId')} value={form.employeeId} onChange={e => set('employeeId', e.target.value)} placeholder="EMP006" />
                {err('employeeId')}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Date of joining <span className="text-red-500">*</span></label>
                <input type="date" className={inp('dateOfJoining')} value={form.dateOfJoining} onChange={e => set('dateOfJoining', e.target.value)} />
                {err('dateOfJoining')}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Department <span className="text-red-500">*</span></label>
                <select className={inp('department')} value={form.department} onChange={e => set('department', e.target.value)}>
                  <option value="">Select department</option>
                  {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                </select>
                {err('department')}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Designation <span className="text-red-500">*</span></label>
                <select className={inp('designation')} value={form.designation} onChange={e => set('designation', e.target.value)}>
                  <option value="">Select designation</option>
                  {DESIGNATIONS.map(d => <option key={d}>{d}</option>)}
                </select>
                {err('designation')}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Employment type</label>
                <select className="input-field" value={form.employmentType} onChange={e => set('employmentType', e.target.value)}>
                  <option>Full-time</option><option>Part-time</option><option>Contract</option><option>Intern</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Reporting manager</label>
                <select className="input-field" value={form.reportingManager} onChange={e => set('reportingManager', e.target.value)}>
                  <option value="">Select manager</option>
                  <option value="u1">Rajesh Sharma (Master Admin)</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Internal notes</label>
              <textarea rows={2} className="input-field" value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Any notes about this associate (not visible to them)" />
            </div>
          </div>
        )}

        {/* Step 2 — Access */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-gray-900 mb-1">App access & role</h2>
            <p className="text-xs text-gray-400 mb-4">Set the role and login credentials for this associate</p>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'associate', label: 'Associate', desc: 'Works on tickets, communicates with clients' },
                  { value: 'hr', label: 'HR', desc: 'Manages team onboarding and performance' },
                  { value: 'sales', label: 'Sales', desc: 'Onboards clients, manages client portfolio' },
                  { value: 'master_admin', label: 'Master Admin', desc: 'Full access to everything' },
                ].map(opt => (
                  <button key={opt.value} onClick={() => set('role', opt.value)}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${form.role === opt.value ? 'border-blue-700 bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}>
                    <div className="text-sm font-semibold text-gray-900">{opt.label}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <p className="text-sm font-semibold text-gray-700 mb-3">Login credentials</p>
              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                <p className="text-xs text-gray-500">Login email: <strong className="text-gray-800">{form.email || 'Set in step 1'}</strong></p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Temporary password <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input type={showPass ? 'text' : 'password'} className={inp('password')}
                      value={form.password} onChange={e => set('password', e.target.value)} placeholder="Min 6 characters" />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {err('password')}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm password <span className="text-red-500">*</span></label>
                  <input type="password" className={inp('confirmPassword')}
                    value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} placeholder="Repeat password" />
                  {err('confirmPassword')}
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2">Associate will be prompted to change password on first login.</p>
            </div>
          </div>
        )}

        {/* Step 3 — Review */}
        {step === 3 && (
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-4">Review & confirm</h2>
            <div className="space-y-2">
              {[
                { label: 'Name', value: `${form.firstName} ${form.lastName}` },
                { label: 'Work email', value: form.email },
                { label: 'Mobile', value: `+91 ${form.mobile}` },
                { label: 'Employee ID', value: form.employeeId },
                { label: 'Department', value: form.department },
                { label: 'Designation', value: form.designation },
                { label: 'Employment type', value: form.employmentType },
                { label: 'Date of joining', value: form.dateOfJoining },
                { label: 'Role', value: form.role },
              ].map(row => (
                <div key={row.label} className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-500">{row.label}</span>
                  <span className="text-sm font-medium text-gray-900 capitalize">{row.value || '—'}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-xs text-blue-700">Login credentials will be sent to <strong>{form.email}</strong>. Associate must change password on first login.</p>
            </div>
          </div>
        )}
      </div>

      {/* Nav buttons */}
      <div className="flex items-center justify-between mt-5">
        <button onClick={step === 0 ? onBack : back} className="btn-secondary flex items-center gap-2">
          <ArrowLeft size={15} /> {step === 0 ? 'Cancel' : 'Back'}
        </button>
        {step < STEPS.length - 1
          ? <button onClick={next} className="btn-primary flex items-center gap-2">Next <ArrowRight size={15} /></button>
          : <button onClick={handleSubmit} className="btn-primary flex items-center gap-2 bg-green-600 hover:bg-green-700"><Check size={15} /> Confirm & onboard</button>
        }
      </div>
    </div>
  );
}
