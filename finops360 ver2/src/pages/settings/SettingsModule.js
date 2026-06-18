/* eslint-disable no-unused-vars */
import React, { useState } from 'react';

const TABS = ['Firm Profile', 'Users', 'Notifications', 'Security', 'Billing'];

export default function SettingsModule() {
  const [tab, setTab] = useState('Firm Profile');
  const [firmName, setFirmName] = useState('FinOps 360 Consulting LLP');
  const [saved, setSaved] = useState(false);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-5">Settings</h2>
      <div className="flex gap-6">
        <div className="w-44 flex-shrink-0">
          <nav className="space-y-1">
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${tab === t ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>
                {t}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            {tab === 'Firm Profile' && (
              <div className="space-y-4 max-w-lg">
                <h3 className="font-semibold text-gray-900 mb-4">Firm Profile</h3>
                {[
                  ['Firm Name', firmName, setFirmName],
                  ['GSTIN', '29ABCDE1234F1Z5', null],
                  ['PAN', 'ABCDE1234F', null],
                  ['Email', 'admin@finops360.in', null],
                  ['Phone', '+91 98765 00000', null],
                  ['City', 'Hyderabad', null],
                ].map(([label, value, setter]) => (
                  <div key={label}>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>
                    <input
                      defaultValue={value}
                      onChange={setter ? e => setter(e.target.value) : undefined}
                      readOnly={!setter}
                      className={`w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 ${!setter ? 'bg-gray-50' : ''}`}
                    />
                  </div>
                ))}
                <button onClick={handleSave}
                  className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${saved ? 'bg-green-600 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
                  {saved ? '✓ Saved!' : 'Save Changes'}
                </button>
              </div>
            )}

            {tab === 'Users' && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">User Management</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Arjun Sharma', role: 'Master Admin', email: 'admin@finops360.in' },
                    { name: 'Priya Reddy', role: 'Sales', email: 'sales@finops360.in' },
                    { name: 'Kavya Nair', role: 'HR', email: 'hr@finops360.in' },
                    { name: 'Rahul Mehta', role: 'Associate', email: 'associate@finops360.in' },
                  ].map(u => (
                    <div key={u.email} className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
                        {u.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{u.name}</p>
                        <p className="text-xs text-gray-400">{u.email}</p>
                      </div>
                      <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">{u.role}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === 'Notifications' && (
              <div className="max-w-md">
                <h3 className="font-semibold text-gray-900 mb-4">Notification Preferences</h3>
                <div className="space-y-4">
                  {['Email notifications', 'Ticket due date reminders', 'New client alerts', 'GST filing reminders', 'Monthly report digest'].map(n => (
                    <div key={n} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">{n}</span>
                      <div className="w-10 h-5 bg-indigo-600 rounded-full relative cursor-pointer">
                        <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5 shadow" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === 'Security' && (
              <div className="max-w-md">
                <h3 className="font-semibold text-gray-900 mb-4">Security Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Current Password</label>
                    <input type="password" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">New Password</label>
                    <input type="password" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">Two-Factor Authentication</span>
                    <span className="text-xs text-green-600 font-medium bg-green-100 px-2 py-0.5 rounded-full">Enabled</span>
                  </div>
                  <button className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">Update Password</button>
                </div>
              </div>
            )}

            {tab === 'Billing' && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Billing & Plan</h3>
                <div className="bg-indigo-50 rounded-xl p-4 mb-5 border border-indigo-100">
                  <p className="text-xs text-indigo-600 font-semibold uppercase tracking-wide mb-1">Current Plan</p>
                  <p className="text-2xl font-bold text-indigo-900">Professional</p>
                  <p className="text-sm text-indigo-700 mt-1">₹4,999/month · Up to 50 clients · 10 users</p>
                </div>
                <div className="space-y-2">
                  {[
                    { date: '01 May 2025', amount: '₹4,999', status: 'Paid' },
                    { date: '01 Apr 2025', amount: '₹4,999', status: 'Paid' },
                    { date: '01 Mar 2025', amount: '₹4,999', status: 'Paid' },
                  ].map(b => (
                    <div key={b.date} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                      <p className="text-sm text-gray-700">{b.date}</p>
                      <p className="text-sm font-medium text-gray-900">{b.amount}</p>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{b.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
