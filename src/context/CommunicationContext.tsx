'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SectionMessage, SharedFile, DisciplineType } from '@/types';
import { INITIAL_MESSAGES, INITIAL_FILES } from '@/data/mockData';
import { useAuth } from './AuthContext';

interface CommunicationContextType {
  messages: SectionMessage[];
  sharedFiles: SharedFile[];
  sendMessage: (discipline: DisciplineType, content: string, urgent?: boolean, attachmentName?: string) => void;
  uploadFile: (newFile: Omit<SharedFile, 'id' | 'uploadDate' | 'downloadsCount'>) => void;
  triggerFileDownload: (file: SharedFile) => void;
  getMessagesByDiscipline: (discipline: DisciplineType) => SectionMessage[];
  getFilesByDiscipline: (discipline?: DisciplineType | 'All') => SharedFile[];
}

const CommunicationContext = createContext<CommunicationContextType | undefined>(undefined);

export function CommunicationProvider({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<SectionMessage[]>(INITIAL_MESSAGES);
  const [sharedFiles, setSharedFiles] = useState<SharedFile[]>(INITIAL_FILES);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedMsgs = localStorage.getItem('dg5_messages');
      const storedFiles = localStorage.getItem('dg5_files');
      if (storedMsgs) setMessages(JSON.parse(storedMsgs));
      if (storedFiles) setSharedFiles(JSON.parse(storedFiles));
    } catch {
      setMessages(INITIAL_MESSAGES);
      setSharedFiles(INITIAL_FILES);
    }
    setIsLoaded(true);
  }, []);

  const saveMessages = (msgs: SectionMessage[]) => {
    setMessages(msgs);
    try {
      localStorage.setItem('dg5_messages', JSON.stringify(msgs));
    } catch (e) {
      console.error(e);
    }
  };

  const saveFiles = (files: SharedFile[]) => {
    setSharedFiles(files);
    try {
      localStorage.setItem('dg5_files', JSON.stringify(files));
    } catch (e) {
      console.error(e);
    }
  };

  const sendMessage = (
    discipline: DisciplineType,
    content: string,
    urgent = false,
    attachmentName?: string
  ) => {
    if (!currentUser) return;

    const newMsg: SectionMessage = {
      id: `msg-${Date.now()}`,
      discipline,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.title,
      senderAvatar: currentUser.avatar,
      timestamp: 'Just now',
      content,
      urgent,
      attachmentName,
    };

    saveMessages([...messages, newMsg]);
  };

  const uploadFile = (fileData: Omit<SharedFile, 'id' | 'uploadDate' | 'downloadsCount'>) => {
    const today = new Date().toISOString().split('T')[0];
    const newFile: SharedFile = {
      ...fileData,
      id: `file-${Date.now()}`,
      uploadDate: today,
      downloadsCount: 0,
    };

    saveFiles([newFile, ...sharedFiles]);
  };

  const triggerFileDownload = (file: SharedFile) => {
    // Generate simulated download file
    const dummyContent = `=====================================================
DG 5 - THE DESIGN GROUP FIVE INTERNATIONAL (Est. 1972)
PROJECT MANAGEMENT & MULTIDISCIPLINARY ENGINEERING SYSTEM
=====================================================

FILE RECORD DETAILS:
Title: ${file.title}
File Name: ${file.fileName}
Discipline: ${file.discipline} Engineering Section
Project: ${file.projectTitle} (ID: ${file.projectId})
Revision Version: ${file.version}
Author / Approver: ${file.uploadedBy}
Date Registered: ${file.uploadDate}
File Size: ${file.fileSize}

SPECIFICATION NOTES & STATUTORY CLEARANCE:
${file.notes}

---
NOTICE: This engineering drawing / calculation specification is the
intellectual property of DG5 and its certified consultancy divisions.
Unauthorized reproduction or unsealed site execution is strictly prohibited.
=====================================================`;

    const blob = new Blob([dummyContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.fileName.endsWith('.txt') ? file.fileName : `${file.fileName}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Increment download counter
    const updated = sharedFiles.map((f) =>
      f.id === file.id ? { ...f, downloadsCount: f.downloadsCount + 1 } : f
    );
    saveFiles(updated);
  };

  const getMessagesByDiscipline = (discipline: DisciplineType) => {
    return messages.filter((m) => m.discipline === discipline);
  };

  const getFilesByDiscipline = (discipline?: DisciplineType | 'All') => {
    if (!discipline || discipline === 'All') return sharedFiles;
    return sharedFiles.filter((f) => f.discipline === discipline);
  };

  if (!isLoaded) return null;

  return (
    <CommunicationContext.Provider
      value={{
        messages,
        sharedFiles,
        sendMessage,
        uploadFile,
        triggerFileDownload,
        getMessagesByDiscipline,
        getFilesByDiscipline,
      }}
    >
      {children}
    </CommunicationContext.Provider>
  );
}

export function useCommunication() {
  const context = useContext(CommunicationContext);
  if (!context) {
    throw new Error('useCommunication must be used within a CommunicationProvider');
  }
  return context;
}
