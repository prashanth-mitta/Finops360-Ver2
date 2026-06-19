import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { useAuth } from './AuthContext';

// ── PARTNER / TENANT REGISTRY (fallback when Supabase is not configured) ──────
// tenantId: 'finops' = master platform
// tenantId: 'p001', 'p002', 'p003' = partner firms

export const TENANTS = {
  finops: {
    tenantId:    'finops',
    firmName:    'FinOps 360',
    tagline:     'Finance & Accounting Platform',
    logoText:    'FO',
    primaryColor:'#6366f1',
    accentColor: '#4f46e5',
    email:       'admin@finops360.in',
    phone:       '+91 98765 00000',
    address:     'Unit 501, Skyview Tower, Madhapur, Hyderabad - 500081',
    gstin:       '36FINOP1234A1Z9',
    isActive:    true,
    isMaster:    true,
    createdAt:   '2024-01-01',
    plan:        'master',
  },
  p001: {
    tenantId:    'p001',
    firmName:    'Mehta & Associates',
    tagline:     'Chartered Accountants',
    logoText:    'MA',
    primaryColor:'#0ea5e9',
    accentColor: '#0284c7',
    email:       'admin@mehtaassociates.in',
    phone:       '+91 98765 11111',
    address:     'Office 12, Nariman Point, Mumbai - 400021',
    gstin:       '27MEHTA5678B2Z1',
    isActive:    true,
    isMaster:    false,
    createdAt:   '2024-03-15',
    plan:        'professional',
    stats:       { clients: 24, associates: 8, tickets: 47 },
  },
  p002: {
    tenantId:    'p002',
    firmName:    'Reddy Tax Consultants',
    tagline:     'Tax & Compliance Experts',
    logoText:    'RT',
    primaryColor:'#10b981',
    accentColor: '#059669',
    email:       'admin@reddytax.in',
    phone:       '+91 98765 22222',
    address:     'Plot 88, Jubilee Hills, Hyderabad - 500033',
    gstin:       '36REDDY9012C3Z2',
    isActive:    true,
    isMaster:    false,
    createdAt:   '2024-05-20',
    plan:        'professional',
    stats:       { clients: 18, associates: 5, tickets: 31 },
  },
  p003: {
    tenantId:    'p003',
    firmName:    'Sharma & Co. CAs',
    tagline:     'Your Trusted Financial Partner',
    logoText:    'SC',
    primaryColor:'#f59e0b',
    accentColor: '#d97706',
    email:       'admin@sharmaandco.in',
    phone:       '+91 98765 33333',
    address:     'Tower B, DLF Cyber City, Gurugram - 122002',
    gstin:       '06SHARM3456D4Z3',
    isActive:    false,
    isMaster:    false,
    createdAt:   '2024-08-10',
    plan:        'starter',
    stats:       { clients: 9, associates: 3, tickets: 14 },
  },
};

// ── PARTNER USERS (used by the legacy launch flow + as a credentials hint) ────
export const PARTNER_USERS = {
  p001: [
    { id: 'p001-u1', tenantId: 'p001', name: 'Vikram Mehta',    email: 'admin@mehtaassociates.in',  password: 'mehta123',  role: 'master_admin', avatar: 'VM' },
    { id: 'p001-u2', tenantId: 'p001', name: 'Sneha Mehta',     email: 'sales@mehtaassociates.in',  password: 'mehta123',  role: 'sales',        avatar: 'SM' },
    { id: 'p001-u3', tenantId: 'p001', name: 'Rohan Shah',      email: 'assoc@mehtaassociates.in',  password: 'mehta123',  role: 'associate',    avatar: 'RS' },
  ],
  p002: [
    { id: 'p002-u1', tenantId: 'p002', name: 'Anil Reddy',      email: 'admin@reddytax.in',         password: 'reddy123',  role: 'master_admin', avatar: 'AR' },
    { id: 'p002-u2', tenantId: 'p002', name: 'Priya Reddy',     email: 'sales@reddytax.in',         password: 'reddy123',  role: 'sales',        avatar: 'PR' },
    { id: 'p002-u3', tenantId: 'p002', name: 'Suresh Kumar',    email: 'assoc@reddytax.in',         password: 'reddy123',  role: 'associate',    avatar: 'SK' },
  ],
  p003: [
    { id: 'p003-u1', tenantId: 'p003', name: 'Deepak Sharma',   email: 'admin@sharmaandco.in',      password: 'sharma123', role: 'master_admin', avatar: 'DS' },
  ],
};

const mapTenantRow = (r, stats) => ({
  tenantId: r.id,
  firmName: r.firm_name,
  tagline: r.tagline,
  logoText: r.logo_text,
  primaryColor: r.primary_color,
  accentColor: r.accent_color,
  email: r.email,
  phone: r.phone,
  address: r.address,
  gstin: r.gstin,
  isActive: r.is_active,
  isMaster: r.is_master,
  createdAt: r.created_at ? String(r.created_at).slice(0, 10) : undefined,
  plan: r.plan,
  stats,
});

const toTenantRow = (data) => ({
  firm_name: data.firmName,
  tagline: data.tagline,
  logo_text: data.logoText,
  primary_color: data.primaryColor,
  accent_color: data.accentColor,
  email: data.email,
  phone: data.phone,
  address: data.address,
  gstin: data.gstin,
  plan: data.plan,
});

const TenantContext = createContext(null);

export function TenantProvider({ children }) {
  const { currentUser } = useAuth();
  const [tenants, setTenants] = useState(TENANTS);
  const [overrideTenantId, setOverrideTenantId] = useState(null);

  // The active tenant follows the logged-in user (master override aside).
  const activeTenantId = overrideTenantId || currentUser?.tenantId || 'finops';
  const activeTenant = tenants[activeTenantId] || tenants.finops;

  // Load the tenant registry + aggregate stats from Supabase when available.
  useEffect(() => {
    if (!isSupabaseConfigured || !currentUser) return;
    let active = true;
    (async () => {
      const [{ data: rows }, { data: stats }] = await Promise.all([
        supabase.from('tenants').select('*'),
        supabase.rpc('get_partner_stats'),
      ]);
      if (!active || !rows) return;
      const statsById = {};
      (stats || []).forEach((s) => {
        statsById[s.tenant_id] = { clients: Number(s.clients), associates: Number(s.associates), tickets: Number(s.tickets) };
      });
      const map = {};
      rows.forEach((r) => { map[r.id] = mapTenantRow(r, statsById[r.id]); });
      setTenants((prev) => ({ ...prev, ...map }));
    })();
    return () => { active = false; };
  }, [currentUser]);

  async function addTenant(data) {
    if (isSupabaseConfigured) {
      const { data: row } = await supabase.from('tenants').insert(toTenantRow(data)).select().single();
      if (row) setTenants((prev) => ({ ...prev, [row.id]: mapTenantRow(row) }));
      return row?.id;
    }
    const id = 'p' + String(Object.keys(tenants).length).padStart(3, '0');
    setTenants((prev) => ({
      ...prev,
      [id]: { ...data, tenantId: id, isMaster: false, isActive: true, createdAt: new Date().toISOString().slice(0, 10), stats: { clients: 0, associates: 0, tickets: 0 } },
    }));
    return id;
  }

  async function updateTenant(id, data) {
    if (isSupabaseConfigured) await supabase.from('tenants').update(toTenantRow(data)).eq('id', id);
    setTenants((prev) => ({ ...prev, [id]: { ...prev[id], ...data } }));
  }

  async function toggleTenantActive(id) {
    const next = !tenants[id]?.isActive;
    if (isSupabaseConfigured) await supabase.from('tenants').update({ is_active: next }).eq('id', id);
    setTenants((prev) => ({ ...prev, [id]: { ...prev[id], isActive: next } }));
  }

  function switchTenant(id) {
    setOverrideTenantId(id);
  }

  return (
    <TenantContext.Provider value={{ tenants, activeTenant, activeTenantId, addTenant, updateTenant, toggleTenantActive, switchTenant }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  return useContext(TenantContext);
}
