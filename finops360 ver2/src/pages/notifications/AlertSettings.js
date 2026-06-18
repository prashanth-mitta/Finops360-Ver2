import React, { useState } from 'react';
import { ALERT_LABELS } from './notificationData';

export default function AlertSettings({ settings, setSettings }) {
  const [saved, setSaved] = useState(false);

  const groups = {};
  Object.entries(ALERT_LABELS).forEach(([key, val]) => {
    if (!groups[val.group]) groups[val.group] = [];
    groups[val.group].push({ key, ...val });
  });

  function toggle(key, channel) {
    setSettings(prev => ({ ...prev, [key]: { ...prev[key], [channel]: !prev[key][channel] } }));
    setSaved(false);
  }

  function toggleAll(channel, value) {
    setSettings(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(k => { next[k] = { ...next[k], [channel]: value }; });
      return next;
    });
    setSaved(false);
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const allEmail = Object.values(settings).every(s => s.email);
  const allSms   = Object.values(settings).every(s => s.sms);
  const allInapp = Object.values(settings).every(s => s.inapp);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-none px-6 py-4 bg-white border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Alert Settings</h2>
            <p className="text-xs text-slate-400 mt-0.5">Configure how you receive notifications for each event type</p>
          </div>
          <button onClick={handleSave}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm ${saved ? 'bg-emerald-500 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
            {saved ? '✓ Saved' : 'Save Settings'}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4">
        {/* master toggles */}
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 mb-5">
          <p className="text-xs font-bold text-slate-700 mb-3">Quick Toggle — All Events</p>
          <div className="flex items-center gap-6">
            {[['Email', 'email', allEmail], ['SMS', 'sms', allSms], ['In-App', 'inapp', allInapp]].map(([label, ch, isAll]) => (
              <label key={ch} className="flex items-center gap-2 cursor-pointer">
                <button type="button" onClick={() => toggleAll(ch, !isAll)}
                  className={`w-10 h-5 rounded-full transition-colors relative ${isAll ? 'bg-blue-500' : 'bg-slate-300'}`}>
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${isAll ? 'left-5' : 'left-0.5'}`} />
                </button>
                <span className="text-sm font-medium text-slate-700">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          {Object.entries(groups).map(([groupName, items]) => (
            <div key={groupName} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">{groupName}</p>
              </div>
              <div className="divide-y divide-slate-100">
                {items.map(({ key, label }) => {
                  const s = settings[key] || { email:false, sms:false, inapp:false };
                  return (
                    <div key={key} className="flex items-center justify-between px-4 py-3">
                      <span className="text-sm text-slate-700 font-medium">{label}</span>
                      <div className="flex items-center gap-5">
                        {[['Email','email'],['SMS','sms'],['In-App','inapp']].map(([lbl, ch]) => (
                          <label key={ch} className="flex items-center gap-1.5 cursor-pointer">
                            <button type="button" onClick={() => toggle(key, ch)}
                              className={`w-8 h-4 rounded-full transition-colors relative ${s[ch] ? 'bg-blue-500' : 'bg-slate-200'}`}>
                              <span className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-all ${s[ch] ? 'left-4' : 'left-0.5'}`} />
                            </button>
                            <span className="text-[10px] text-slate-500">{lbl}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
