import { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '../lib/types';

interface AuthContextType {
  login: (token: string) => void;
  logout: () => void;
  user: User | null;
  token: string | null;
  loading: boolean;
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('token');
    if (stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setToken(stored);
      setUser(decodeToken(stored));
    }
    setLoading(false);
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
    <AuthContext.Provider value={{ token, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within the AuthProvider');
  }
  return context;
}
