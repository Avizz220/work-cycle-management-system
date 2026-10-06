'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, DisciplineType } from '@/types';
import { INITIAL_USERS } from '@/data/mockData';

interface AuthContextType {
  currentUser: User | null;
  usersList: User[];
  login: (email: string, password?: string) => { success: boolean; message?: string };
  signup: (userData: Omit<User, 'id'>) => { success: boolean; message?: string };
  logout: () => void;
  switchUser: (userId: string) => void;
  isPM: boolean;
  isHOD: boolean;
  isMember: boolean;
  userDiscipline: DisciplineType;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usersList, setUsersList] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User | null>(INITIAL_USERS[0]); // Default to PM for preview
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('dg5_current_user');
      const storedUsersList = localStorage.getItem('dg5_users_list');

      if (storedUsersList) {
        setUsersList(JSON.parse(storedUsersList));
      }
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      } else {
        // Default PM
        setCurrentUser(INITIAL_USERS[0]);
      }
    } catch {
      setCurrentUser(INITIAL_USERS[0]);
    }
    setIsLoaded(true);
  }, []);

  const login = (email: string, password = ''): { success: boolean; message?: string } => {
    const trimmedEmail = email.trim().toLowerCase();

    // Support convenient aliases
    let searchEmail = trimmedEmail;
    if (trimmedEmail === 'hod@dg5.com' || trimmedEmail === 'hod.elec@dg5.com') {
      searchEmail = 'electrical@dg5.com';
    } else if (trimmedEmail === 'member@dg5.com' || trimmedEmail === 'worker@dg5.com') {
      searchEmail = 'dinesh.j@dg5.com';
    }

    const found = usersList.find((u) => u.email.toLowerCase() === searchEmail);

    if (!found) {
      return { success: false, message: 'Invalid credentials. Please check the registered email.' };
    }

    // Check default passwords
    if (found.role === 'pm' && password && password !== 'admin123' && password !== 'pm123') {
      return { success: false, message: 'Incorrect password for Project Manager. Default is admin123 or pm123' };
    }
    if (found.role === 'hod' && password && password !== 'lead123' && password !== 'hod123') {
      return { success: false, message: 'Incorrect password for Department Head / Team Lead. Default is lead123' };
    }
    if (found.role === 'employee' && password && password !== 'emp123' && password !== 'user123') {
      return { success: false, message: 'Incorrect password for Team Member. Default is user123 or emp123' };
    }

    setCurrentUser(found);
    localStorage.setItem('dg5_current_user', JSON.stringify(found));
    return { success: true };
  };

  const signup = (userData: Omit<User, 'id'>) => {
    const existing = usersList.find((u) => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existing) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const newUser: User = {
      ...userData,
      id: `usr-${Date.now()}`,
    };

    const updated = [newUser, ...usersList];
    setUsersList(updated);
    setCurrentUser(newUser);
    localStorage.setItem('dg5_users_list', JSON.stringify(updated));
    localStorage.setItem('dg5_current_user', JSON.stringify(newUser));
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('dg5_current_user');
  };

  const switchUser = (userId: string) => {
    const found = usersList.find((u) => u.id === userId);
    if (found) {
      setCurrentUser(found);
      localStorage.setItem('dg5_current_user', JSON.stringify(found));
    }
  };

  const isPM = currentUser?.role === 'pm';
  const isHOD = currentUser?.role === 'hod';
  const isMember = currentUser?.role === 'employee';
  const userDiscipline = currentUser?.discipline || 'Management';

  if (!isLoaded) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        usersList,
        login,
        signup,
        logout,
        switchUser,
        isPM,
        isHOD,
        isMember,
        userDiscipline,
      }}
    >
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
