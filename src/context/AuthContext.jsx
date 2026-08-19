import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch current user session from localStorage and verify if possible
  const fetchCurrentUser = async () => {
    try {
      setLoading(true);
      const savedToken = localStorage.getItem('auth_token');
      const savedUser = localStorage.getItem('user_session');

      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        if (savedToken) setToken(savedToken);

        // Optionally verify session against backend /api/auth/me
        try {
          const res = await fetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${savedToken}` }
          });
          if (res.ok) {
            const userData = await res.json();
            setUser(userData);
            localStorage.setItem('user_session', JSON.stringify(userData));
          }
        } catch (e) {
          // Keep saved user if backend is offline/unreachable
        }
      } else {
        setUser(null);
        setToken(null);
      }
    } catch (err) {
      console.error('Failed to fetch user session:', err);
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = (userData, authToken = null) => {
    // Clear old data first to prevent cross-account session contamination
    localStorage.removeItem('user_session');
    localStorage.removeItem('auth_token');

    localStorage.setItem('user_session', JSON.stringify(userData));
    setUser(userData);

    if (authToken) {
      localStorage.setItem('auth_token', authToken);
      setToken(authToken);
    }
  };

  const logout = () => {
    localStorage.removeItem('user_session');
    localStorage.removeItem('auth_token');
    setUser(null);
    setToken(null);
  };

  const updateUser = (updatedFields) => {
    const updated = { ...user, ...updatedFields };
    localStorage.setItem('user_session', JSON.stringify(updated));
    setUser(updated);
  };

  // Helper for generating dynamic initials from full_name
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser, getInitials, fetchCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
