import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch current user session (GET /api/auth/me)
  const fetchCurrentUser = async () => {
    try {
      setLoading(true);
      const savedUser = localStorage.getItem('user_session');
      if (savedUser) {
        // Mock GET /api/auth/me call
        await new Promise(resolve => setTimeout(resolve, 300));
        setUser(JSON.parse(savedUser));
      } else {
        // Default demo user session if none exists
        const defaultUser = {
          full_name: 'Jane Doe',
          email: 'jane.doe@student.college.edu',
          department: 'Computer Science',
          student_roll: '2026-CS-042',
          role: 'student',
          phone: '+1 234 567 8900'
        };
        localStorage.setItem('user_session', JSON.stringify(defaultUser));
        setUser(defaultUser);
      }
    } catch (err) {
      console.error('Failed to fetch user session:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = (userData) => {
    localStorage.setItem('user_session', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('user_session');
    setUser(null);
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
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser, getInitials, fetchCurrentUser }}>
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
