import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
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
    email:       'kishore.nagilla@gmail.com',
    phone:       '+91 96523 45613',
    address:     'Hyderabad, Telangana, India',
    gstin:       '36FINOP1234A1Z9',
    isActive:    true,
    isMaster:    true,
    createdAt:   '2024-01-01',
    plan:        'master',
  },
};

export const PARTNER_USERS = {};

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
  const refreshTenants = useCallback(async () => {
    if (!isSupabaseConfigured || !currentUser) return;
    const [{ data: rows }, { data: stats }] = await Promise.all([
      supabase.from('tenants').select('*'),
      supabase.rpc('get_partner_stats'),
    ]);
    if (!rows) return;
    const statsById = {};
    (stats || []).forEach((s) => {
      statsById[s.tenant_id] = { clients: Number(s.clients), associates: Number(s.associates), tickets: Number(s.tickets) };
    });
    const map = {};
    rows.forEach((r) => { map[r.id] = mapTenantRow(r, statsById[r.id]); });
    setTenants((prev) => ({ ...prev, ...map }));
  }, [currentUser]);

  useEffect(() => {
    refreshTenants();
  }, [refreshTenants]);

  async function addTenant(data) {
    if (isSupabaseConfigured) {
      const id = data.tenantId || `p${String(Object.keys(tenants).filter((k) => k.startsWith('p')).length + 1).padStart(3, '0')}`;
      const { data: row, error } = await supabase.from('tenants').insert({ id, ...toTenantRow(data), is_active: true, is_master: false }).select().single();
      if (error) throw new Error(error.message);
      setTenants((prev) => ({ ...prev, [row.id]: mapTenantRow(row) }));
      return row.id;
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
    <TenantContext.Provider value={{ tenants, activeTenant, activeTenantId, addTenant, updateTenant, toggleTenantActive, switchTenant, refreshTenants }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  return useContext(TenantContext);
}
