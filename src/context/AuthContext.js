/* eslint-disable no-unused-vars */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const AuthContext = createContext(null);

export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  MASTER_ADMIN: 'master_admin',
  SALES: 'sales',
  HR: 'hr',
  ASSOCIATE: 'associate',
  CLIENT: 'client',
};

export const ROLE_LABELS = {
  super_admin: 'Super Admin',
  master_admin: 'Master Admin',
  sales: 'Sales',
  hr: 'HR',
  associate: 'Associate',
  client: 'Client',
};

export const roleLabel = (role) => ROLE_LABELS[role] || role;

/** Turn phone / email input into the auth email Supabase expects. */
export function resolveLoginEmail(identifier) {
  const raw = String(identifier || '').trim();
  if (!raw) return '';
  if (raw.includes('@')) return raw.toLowerCase();

  let digits = raw.replace(/\D/g, '');
  if (digits.length > 10 && digits.startsWith('91')) {
    digits = digits.slice(-10);
  }
  if (digits.length === 10) {
    return `${digits}@phone.finops360.in`;
  }
  return raw;
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(isSupabaseConfigured);

  async function hydrateUser(authUser) {
    if (!authUser) return null;
    const { data: profile } = await supabase
      .from('profiles')
      .select('name, role, avatar, tenant_id, phone')
      .eq('id', authUser.id)
      .maybeSingle();
    const meta = authUser.user_metadata || {};
    return {
      id: authUser.id,
      email: authUser.email,
      name: profile?.name || meta.name || authUser.email,
      role: profile?.role || meta.role || ROLES.CLIENT,
      avatar: profile?.avatar || meta.avatar || (authUser.email || '??').slice(0, 2).toUpperCase(),
      tenantId: profile?.tenant_id || meta.tenant_id || 'finops',
      phone: profile?.phone || meta.phone || null,
    };
  }

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

  const login = async (identifier, password) => {
    setError('');
    if (!isSupabaseConfigured) {
      setError('Database not connected. Configure Supabase to sign in.');
      return false;
    }

    const email = resolveLoginEmail(identifier);
    const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) {
      setError(err.message || 'Invalid mobile/email or password');
      return false;
    }
    if (data.user) setCurrentUser(await hydrateUser(data.user));
    return true;
  };

  const logout = async () => {
    if (isSupabaseConfigured) await supabase.auth.signOut();
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, error, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
