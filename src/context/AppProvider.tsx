'use client';

import React from 'react';
import { AuthProvider } from './AuthContext';
import { ProjectProvider } from './ProjectContext';
import { CommunicationProvider } from './CommunicationContext';

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ProjectProvider>
        <CommunicationProvider>{children}</CommunicationProvider>
      </ProjectProvider>
    </AuthProvider>
  );
}
