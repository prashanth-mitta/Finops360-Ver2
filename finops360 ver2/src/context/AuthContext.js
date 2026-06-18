/* eslint-disable no-unused-vars */
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const ROLES = {
  MASTER_ADMIN: 'Master Admin',
  SALES: 'Sales',
  HR: 'HR',
  ASSOCIATE: 'Associate',
  CLIENT: 'Client',
};

const DEMO_USERS = [
  { id: 1, name: 'Arjun Sharma', email: 'admin@finops360.in', password: 'admin123', role: ROLES.MASTER_ADMIN, avatar: 'AS' },
  { id: 2, name: 'Priya Reddy', email: 'sales@finops360.in', password: 'sales123', role: ROLES.SALES, avatar: 'PR' },
  { id: 3, name: 'Kavya Nair', email: 'hr@finops360.in', password: 'hr123', role: ROLES.HR, avatar: 'KN' },
  { id: 4, name: 'Rahul Mehta', email: 'associate@finops360.in', password: 'assoc123', role: ROLES.ASSOCIATE, avatar: 'RM' },
  { id: 5, name: 'Rohan Gupta', email: 'client@example.com', password: 'client123', role: ROLES.CLIENT, avatar: 'RG' },
];

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState('');

  const login = (email, password) => {
    const user = DEMO_USERS.find(u => u.email === email && u.password === password);
    if (user) { setCurrentUser(user); setError(''); return true; }
    setError('Invalid email or password'); return false;
  };

  const logout = () => setCurrentUser(null);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, error, DEMO_USERS }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() { return useContext(AuthContext); }
