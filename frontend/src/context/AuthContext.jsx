import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('hospital_token') || null);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('hospital_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial sync
    setLoading(false);
  }, []);

  const login = (jwtData) => {
    localStorage.setItem('hospital_token', jwtData.token);
    const userInfo = {
      id: jwtData.id,
      email: jwtData.email,
      fullName: jwtData.fullName,
      role: jwtData.role,
      profileId: jwtData.profileId,
    };
    localStorage.setItem('hospital_user', JSON.stringify(userInfo));
    setToken(jwtData.token);
    setUser(userInfo);
  };

  const logout = () => {
    localStorage.removeItem('hospital_token');
    localStorage.removeItem('hospital_user');
    setToken(null);
    setUser(null);
    window.location.href = '/login';
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'ADMIN': return '/admin/dashboard';
      case 'DOCTOR': return '/doctor/dashboard';
      case 'RECEPTIONIST': return '/receptionist/dashboard';
      case 'PATIENT': return '/patient/dashboard';
      default: return '/login';
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    role: user?.role,
    login,
    logout,
    getDashboardPath,
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
