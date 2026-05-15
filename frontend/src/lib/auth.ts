import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthState {
  token: string | null;
  user: string | null;
  isAuthenticated: boolean;
}

export function useAuth() {
  const [auth, setAuth] = useState<AuthState>(() => {
    const token = localStorage.getItem('adminToken');
    const user = localStorage.getItem('adminUser');
    return {
      token,
      user,
      isAuthenticated: !!token,
    };
  });

  const navigate = useNavigate();

  const login = useCallback((token: string, user: string) => {
    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminUser', user);
    setAuth({ token, user, isAuthenticated: true });
    navigate('/admin/dashboard');
  }, [navigate]);

  const logout = useCallback(() => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setAuth({ token: null, user: null, isAuthenticated: false });
    navigate('/admin/login');
  }, [navigate]);

  return { ...auth, login, logout };
}
