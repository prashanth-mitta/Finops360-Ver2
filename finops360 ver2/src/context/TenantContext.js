import React, { createContext, useContext, useState } from 'react';

// ── PARTNER / TENANT REGISTRY ─────────────────────────────────────────────────
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

// ── PARTNER USERS (each partner has their own set of users) ───────────────────
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

// ── TENANT CONTEXT ────────────────────────────────────────────────────────────
const TenantContext = createContext(null);

export function TenantProvider({ children }) {
  const [tenants,       setTenants]       = useState(TENANTS);
  const [activeTenantId,setActiveTenantId]= useState('finops');

  const activeTenant = tenants[activeTenantId] || tenants['finops'];

  function addTenant(data) {
    const id = 'p' + String(Object.keys(tenants).length).padStart(3, '0');
    setTenants(prev => ({
      ...prev,
      [id]: { ...data, tenantId: id, isMaster: false, isActive: true, createdAt: new Date().toISOString().slice(0,10), stats: { clients:0, associates:0, tickets:0 } }
    }));
    return id;
  }

  function updateTenant(id, data) {
    setTenants(prev => ({ ...prev, [id]: { ...prev[id], ...data } }));
  }

  function toggleTenantActive(id) {
    setTenants(prev => ({ ...prev, [id]: { ...prev[id], isActive: !prev[id].isActive } }));
  }

  function switchTenant(id) {
    setActiveTenantId(id);
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
