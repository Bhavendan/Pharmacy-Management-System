import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('pharmacy_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('pharmacy_token') || null;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial verification
    const storedToken = localStorage.getItem('pharmacy_token');
    const storedUser = localStorage.getItem('pharmacy_user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await authApi.login({ email, password });
    
    // AuthResponse structure: { token, tokenType, id, name, email, role }
    const userObj = {
      id: response.id,
      name: response.name,
      email: response.email,
      role: response.role,
    };

    localStorage.setItem('pharmacy_token', response.token);
    localStorage.setItem('pharmacy_user', JSON.stringify(userObj));

    setToken(response.token);
    setUser(userObj);
    return userObj;
  };

  const logout = () => {
    localStorage.removeItem('pharmacy_token');
    localStorage.removeItem('pharmacy_user');
    setToken(null);
    setUser(null);
  };

  const hasRole = (allowedRoles) => {
    if (!user || !user.role) return false;
    if (Array.isArray(allowedRoles)) {
      return allowedRoles.includes(user.role);
    }
    return user.role === allowedRoles;
  };

  const value = {
    user,
    token,
    role: user?.role || null,
    isAuthenticated: !!token && !!user,
    loading,
    login,
    logout,
    hasRole,
    isAdmin: user?.role === 'ADMIN',
    isDoctor: user?.role === 'DOCTOR',
    isPharmacist: user?.role === 'PHARMACIST',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
