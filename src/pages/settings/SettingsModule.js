/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useAuth, roleLabel, ROLES } from '../../context/AuthContext';
import { hasPermission } from '../../lib/permissions';
import { useProfilesQuery, updateProfile, inviteUser } from '../../services/finops';
import { isSupabaseConfigured } from '../../lib/supabaseClient';

const TABS = ['Firm Profile', 'Users', 'Notifications', 'Security', 'Billing'];
const ASSIGNABLE_ROLES = [
  { value: ROLES.MASTER_ADMIN, label: roleLabel(ROLES.MASTER_ADMIN) },
  { value: ROLES.SALES, label: roleLabel(ROLES.SALES) },
  { value: ROLES.HR, label: roleLabel(ROLES.HR) },
  { value: ROLES.ASSOCIATE, label: roleLabel(ROLES.ASSOCIATE) },
  { value: ROLES.CLIENT, label: roleLabel(ROLES.CLIENT) },
];

export default function SettingsModule() {
  const { currentUser, updatePassword, requestPasswordReset, error: authError, setError } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securityMessage, setSecurityMessage] = useState('');
  const [securitySaving, setSecuritySaving] = useState(false);
  const canManageUsers = hasPermission(currentUser?.role, 'canManageUsers');
  const { items: profiles, loading, error } = useProfilesQuery();

  const [tab, setTab] = useState('Firm Profile');
  const [firmName, setFirmName] = useState('FinOps 360');
  const [saved, setSaved] = useState(false);

  const [showInvite, setShowInvite] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    name: '', email: '', password: '', role: ROLES.ASSOCIATE,
  });
  const [inviteError, setInviteError] = useState('');
  const [inviteSaving, setInviteSaving] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [editRole, setEditRole] = useState('');
  const [saveError, setSaveError] = useState('');

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setSecurityMessage('');
    setError('');
    if (newPassword.length < 6) {
      setSecurityMessage('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setSecurityMessage('Passwords do not match.');
      return;
    }
    setSecuritySaving(true);
    const ok = await updatePassword(newPassword);
    if (ok) {
      setSecurityMessage('Password updated successfully.');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setSecurityMessage(authError || 'Could not update password.');
    }
    setSecuritySaving(false);
  };

  const handleEmailResetLink = async () => {
    setSecurityMessage('');
    setError('');
    if (!currentUser?.email) return;
    setSecuritySaving(true);
    const ok = await requestPasswordReset(currentUser.email);
    setSecurityMessage(
      ok
        ? `Reset link sent to ${currentUser.email}. Check your inbox (and spam).`
        : authError || 'Could not send reset email.',
    );
    setSecuritySaving(false);
  };

  const handleRoleSave = async (profileId) => {
    setSaveError('');
    try {
      await updateProfile(profileId, { role: editRole }, currentUser.tenantId);
      setEditingId(null);
    } catch (err) {
      setSaveError(err.message || 'Failed to update role');
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    setInviteError('');
    setInviteSuccess('');
    setInviteSaving(true);
    try {
      const result = await inviteUser(currentUser.tenantId, inviteForm);
      setInviteSuccess(
        result.emailConfirmationRequired
          ? `User invited. They must confirm email before login (${inviteForm.email}).`
          : `User ${inviteForm.name} created successfully.`,
      );
      setInviteForm({ name: '', email: '', password: '', role: ROLES.ASSOCIATE });
    } catch (err) {
      setInviteError(err.message || 'Failed to invite user');
    } finally {
      setInviteSaving(false);
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 sm:mb-5">Settings</h2>
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
        <div className="w-full lg:w-44 flex-shrink-0">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto pb-1 lg:pb-0 lg:space-y-1">
            {TABS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`flex-shrink-0 lg:w-full text-left px-3 py-2 rounded-lg text-sm transition-colors whitespace-nowrap ${
                  tab === t ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {t}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
            {tab === 'Firm Profile' && (
              <div className="space-y-4 max-w-lg">
                <h3 className="font-semibold text-gray-900 mb-4">Firm Profile</h3>
                {[
                  ['Firm Name', firmName, setFirmName],
                  ['GSTIN', '29ABCDE1234F1Z5', null],
                  ['PAN', 'ABCDE1234F', null],
                  ['Email', 'kishore.nagilla@gmail.com', null],
                  ['Phone', '+91 96523 45613', null],
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
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">User Management</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Invite users and assign roles (Admin & Super Admin)</p>
                  </div>
                  {canManageUsers && (
                    <button
                      type="button"
                      onClick={() => setShowInvite(!showInvite)}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 w-full sm:w-auto"
                    >
                      + Invite User
                    </button>
                  )}
                </div>

                {!canManageUsers && (
                  <p className="text-sm text-gray-500 mb-4">Only Admin or Super Admin can manage users.</p>
                )}

                {showInvite && canManageUsers && (
                  <form onSubmit={handleInvite} className="mb-5 p-4 border border-indigo-100 bg-indigo-50/40 rounded-xl space-y-3">
                    <h4 className="text-sm font-semibold text-gray-800">Invite new user</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input required className="input-field" placeholder="Full name" value={inviteForm.name}
                        onChange={(e) => setInviteForm((p) => ({ ...p, name: e.target.value }))} />
                      <input required type="email" className="input-field" placeholder="Email" value={inviteForm.email}
                        onChange={(e) => setInviteForm((p) => ({ ...p, email: e.target.value }))} />
                      <input required type="password" minLength={6} className="input-field" placeholder="Temp password (min 6)"
                        value={inviteForm.password} onChange={(e) => setInviteForm((p) => ({ ...p, password: e.target.value }))} />
                      <select className="input-field" value={inviteForm.role}
                        onChange={(e) => setInviteForm((p) => ({ ...p, role: e.target.value }))}>
                        {ASSIGNABLE_ROLES.map((r) => (
                          <option key={r.value} value={r.value}>{r.label}</option>
                        ))}
                      </select>
                    </div>
                    {inviteError && <p className="text-red-600 text-xs">{inviteError}</p>}
                    <button type="submit" disabled={inviteSaving} className="btn-primary text-sm disabled:opacity-60">
                      {inviteSaving ? 'Creating…' : 'Create user'}
                    </button>
                  </form>
                )}

                {inviteSuccess && <p className="text-green-700 text-sm mb-3">{inviteSuccess}</p>}
                {loading && <p className="text-sm text-gray-400">Loading users…</p>}
                {error && <p className="text-sm text-red-600 mb-3">Failed to load users: {error}</p>}
                {saveError && <p className="text-sm text-red-600 mb-3">{saveError}</p>}

                {!isSupabaseConfigured && (
                  <p className="text-amber-700 text-sm mb-3 bg-amber-50 p-3 rounded-lg border border-amber-100">
                    Supabase not connected on this deployment — user list is unavailable.
                  </p>
                )}

                <div className="space-y-3">
                  {(profiles.length ? profiles : []).map((u) => (
                    <div key={u.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 border border-gray-100 rounded-lg">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {(u.avatar || u.name || '?').slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{u.name}</p>
                          <p className="text-xs text-gray-400 truncate">{u.email}</p>
                        </div>
                      </div>
                      {canManageUsers && editingId === u.id ? (
                        <div className="flex flex-wrap items-center gap-2">
                          <select className="input-field text-xs py-1 flex-1 min-w-[8rem]" value={editRole} onChange={(e) => setEditRole(e.target.value)}>
                            {ASSIGNABLE_ROLES.map((r) => (
                              <option key={r.value} value={r.value}>{r.label}</option>
                            ))}
                          </select>
                          <button type="button" onClick={() => handleRoleSave(u.id)} className="text-xs text-indigo-600 font-medium">Save</button>
                          <button type="button" onClick={() => setEditingId(null)} className="text-xs text-gray-400">Cancel</button>
                        </div>
                      ) : (
                        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                          <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                            {roleLabel(u.role)}
                          </span>
                          {canManageUsers && u.id !== currentUser.id && u.role !== ROLES.SUPER_ADMIN && (
                            <button
                              type="button"
                              onClick={() => { setEditingId(u.id); setEditRole(u.role); }}
                              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                            >
                              Edit role
                            </button>
                          )}
                        </div>
                      )}
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
              <div className="max-w-md space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Change password</h3>
                  <p className="text-xs text-gray-500 mb-4">Update while signed in, or use email reset below.</p>
                  <form onSubmit={handlePasswordUpdate} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">New password</label>
                      <input
                        type="password"
                        autoComplete="new-password"
                        minLength={6}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Confirm new password</label>
                      <input
                        type="password"
                        autoComplete="new-password"
                        minLength={6}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={securitySaving}
                      className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-60"
                    >
                      {securitySaving ? 'Saving…' : 'Update password'}
                    </button>
                  </form>
                </div>
                <div className="border-t border-gray-100 pt-5">
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Email password reset</h4>
                  <p className="text-xs text-gray-500 mb-3">
                    Send a password reset link to <span className="font-medium text-gray-700">{currentUser?.email}</span>.
                  </p>
                  <button
                    type="button"
                    disabled={securitySaving || !currentUser?.email}
                    onClick={handleEmailResetLink}
                    className="border border-indigo-200 text-indigo-700 px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-50 disabled:opacity-60"
                  >
                    Send reset link to my email
                  </button>
                </div>
                {securityMessage && (
                  <p className={`text-sm px-3 py-2 rounded-lg ${securityMessage.includes('success') || securityMessage.includes('sent') ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'}`}>
                    {securityMessage}
                  </p>
                )}
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
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
