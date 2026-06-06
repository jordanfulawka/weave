import { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '../lib/types';

interface AuthContextType {
  login: (token: string) => void;
  logout: () => void;
  user: User | null;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

function decodeToken(token: string) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return { id: payload.id, username: payload.username, email: payload.email };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('token');
    if (stored) {
      setToken(stored);
      setUser(decodeToken(stored));
    }
  }, []);

  function login(token: string) {
    localStorage.setItem('token', token);
    setToken(token);
    setUser(decodeToken(token));
  }

  function logout() {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within the AuthProvider');
  }
  return context;
}
