/* eslint-disable no-unused-vars */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const AuthContext = createContext(null);

// Canonical role identifiers (snake_case) used across the whole platform.
export const ROLES = {
  MASTER_ADMIN: 'master_admin',
  SALES: 'sales',
  HR: 'hr',
  ASSOCIATE: 'associate',
  CLIENT: 'client',
};

export const ROLE_LABELS = {
  master_admin: 'Master Admin',
  sales: 'Sales',
  hr: 'HR',
  associate: 'Associate',
  client: 'Client',
};

export const roleLabel = (role) => ROLE_LABELS[role] || role;

// Demo users (used only as a fallback when Supabase is not configured).
const DEMO_USERS = [
  { id: '1', name: 'Arjun Sharma', email: 'admin@finops360.in', password: 'admin123', role: ROLES.MASTER_ADMIN, avatar: 'AS', tenantId: 'finops' },
  { id: '2', name: 'Priya Reddy', email: 'sales@finops360.in', password: 'sales123', role: ROLES.SALES, avatar: 'PR', tenantId: 'finops' },
  { id: '3', name: 'Kavya Nair', email: 'hr@finops360.in', password: 'hr123', role: ROLES.HR, avatar: 'KN', tenantId: 'finops' },
  { id: '4', name: 'Rahul Mehta', email: 'associate@finops360.in', password: 'assoc123', role: ROLES.ASSOCIATE, avatar: 'RM', tenantId: 'finops' },
  { id: '5', name: 'Rohan Gupta', email: 'client@example.com', password: 'client123', role: ROLES.CLIENT, avatar: 'RG', tenantId: 'finops' },
];

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(isSupabaseConfigured);

  // ── Build the in-app user object from an auth user + its profile row ───────
  async function hydrateUser(authUser) {
    if (!authUser) return null;
    let profile = null;
    const { data } = await supabase
      .from('profiles')
      .select('name, role, avatar, tenant_id')
      .eq('id', authUser.id)
      .maybeSingle();
    profile = data;
    const meta = authUser.user_metadata || {};
    return {
      id: authUser.id,
      email: authUser.email,
      name: profile?.name || meta.name || authUser.email,
      role: profile?.role || meta.role || ROLES.CLIENT,
      avatar: profile?.avatar || meta.avatar || (authUser.email || '??').slice(0, 2).toUpperCase(),
      tenantId: profile?.tenant_id || meta.tenant_id || 'finops',
    };
  }

  // ── Restore session + subscribe to auth changes (Supabase mode only) ───────
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let active = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      if (data.session?.user) {
        setCurrentUser(await hydrateUser(data.session.user));
      }
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!active) return;
      setCurrentUser(session?.user ? await hydrateUser(session.user) : null);
    });

    return () => {
      active = false;
      sub?.subscription?.unsubscribe();
    };
  }, []);

  // ── Login ──────────────────────────────────────────────────────────────────
  const login = async (email, password) => {
    setError('');
    if (!isSupabaseConfigured) {
      const user = DEMO_USERS.find((u) => u.email === email && u.password === password);
      if (user) {
        const { password: _pw, ...safe } = user;
        setCurrentUser(safe);
        return true;
      }
      setError('Invalid email or password');
      return false;
    }

    const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) {
      setError(err.message || 'Invalid email or password');
      return false;
    }
    if (data.user) setCurrentUser(await hydrateUser(data.user));
    return true;
  };

  // ── Logout ───────────────────────────────────────────────────────────────--
  const logout = async () => {
    if (isSupabaseConfigured) await supabase.auth.signOut();
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, error, loading, DEMO_USERS }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
