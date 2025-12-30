import React, { createContext, useContext, useState, useCallback } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  register: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: User[] = [
  {
    id: '1',
    email: 'applicant@demo.com',
    name: 'John Applicant',
    role: 'applicant',
    createdAt: new Date(),
  },
  {
    id: '2',
    email: 'consultant@demo.com',
    name: 'Sarah Consultant',
    role: 'consultant',
    createdAt: new Date(),
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (email: string, password: string, role: UserRole) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email && u.role === role);
    if (foundUser) {
      setUser(foundUser);
    } else {
      // Create a mock user for demo purposes
      setUser({
        id: Date.now().toString(),
        email,
        name: email.split('@')[0],
        role,
        createdAt: new Date(),
      });
    }
  }, []);

  const register = useCallback(async (email: string, password: string, name: string, role: UserRole) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setUser({
      id: Date.now().toString(),
      email,
      name,
      role,
      createdAt: new Date(),
    });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      register,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
