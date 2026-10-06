'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import FileUploadModal from '@/components/FileUploadModal';
import { useCommunication } from '@/context/CommunicationContext';
import { useProjects } from '@/context/ProjectContext';
import { useAuth } from '@/context/AuthContext';
import { DisciplineType } from '@/types';
import {
  Zap,
  Building2,
  Droplets,
  Compass,
  MessageSquare,
  UploadCloud,
  Download,
  Send,
  FileCode,
  Users,
  Paperclip,
} from 'lucide-react';

export default function DisciplineHubsPage() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as DisciplineType) || 'Electrical';

  const [activeDiscipline, setActiveDiscipline] = useState<DisciplineType>(
    ['Electrical', 'Civil', 'Plumbing', 'Architectural'].includes(initialTab)
      ? initialTab
      : 'Electrical'
  );

  const [activeSubTab, setActiveSubTab] = useState<'communication' | 'files'>('communication');
  const [messageInput, setMessageInput] = useState('');
  const [isUrgentMsg, setIsUrgentMsg] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const { getMessagesByDiscipline, sendMessage, getFilesByDiscipline, triggerFileDownload } =
    useCommunication();
  const { currentUser, isPM, usersList } = useAuth();
  const { projects } = useProjects();

  const messages = getMessagesByDiscipline(activeDiscipline);
  const files = getFilesByDiscipline(activeDiscipline);

  const sectionEngineers = usersList.filter(
    (u) => u.discipline === activeDiscipline || (isPM && u.role === 'pm')
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    sendMessage(activeDiscipline, messageInput.trim(), isUrgentMsg);
    setMessageInput('');
    setIsUrgentMsg(false);
  };

  const getDisciplineInfo = (disc: DisciplineType) => {
    switch (disc) {
      case 'Electrical':
        return {
          name: 'Electrical Engineering & Power Systems',
          icon: <Zap size={22} style={{ color: '#000000' }} />,
          lead: 'Eng. Kevin Fernando',
          description:
            'Responsible for 11kV/33kV substations, transformer risers, emergency diesel generators, LEED energy efficiency, and lightning protection systems.',
        };
      case 'Civil':
        return {
          name: 'Civil, Geotechnical & Structural Engineering',
          icon: <Building2 size={22} style={{ color: '#000000' }} />,
          lead: 'Eng. Dilshan Perera',
          description:
            'Specializes in diaphragm walls, deep bored piling, post-tensioned bridge girders, seismic structural analysis, and highway stormwater earthworks.',
        };
      case 'Plumbing':
        return {
          name: 'Plumbing, MEP & Fire Protection Systems',
          icon: <Droplets size={22} style={{ color: '#000000' }} />,
          lead: 'Eng. Kasun Silva',
          description:
            'Designs hydro-pneumatic booster pumping risers, medical gas pipework, wastewater bio-digesters, and NFPA compliant fire suppression sprinkler grids.',
        };
      case 'Architectural':
        return {
          name: 'Architectural & Façade Engineering',
          icon: <Compass size={22} style={{ color: '#000000' }} />,
          lead: 'Arch. Nimmi Wickramasinghe',
          description:
            'Focuses on spatial planning, curtain wall façade engineering, sustainable building envelopes, urban zoning statutory compliance, and construction detailing.',
        };
      default:
        return {
          name: 'Multidisciplinary Department',
          icon: <Users size={22} style={{ color: '#000000' }} />,
          lead: 'Project Management Division',
          description: 'Multidisciplinary coordination.',
        };
    }
  };

  const currentInfo = getDisciplineInfo(activeDiscipline);

  return (
    <div className="app-container">
      <Sidebar />

      <div className="main-wrapper">
        <Navbar
          pageTitle="Engineering Sections & Collaboration Hub"
          subtitle="Inter-departmental messaging, technical discussions, and CAD drawing vault"
        />

        <main className="main-content">
          {/* Discipline Navigation Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '10px',
              borderBottom: '1px solid #000000',
              paddingBottom: '16px',
              marginBottom: '24px',
              overflowX: 'auto',
            }}
          >
            {(['Electrical', 'Civil', 'Plumbing', 'Architectural'] as const).map((disc) => {
              const isActive = activeDiscipline === disc;
              const info = getDisciplineInfo(disc);
              return (
                <button
                  key={disc}
                  onClick={() => setActiveDiscipline(disc)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px 20px',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 800,
                    fontSize: '0.92rem',
                    backgroundColor: isActive ? '#000000' : '#ffffff',
                    color: isActive ? '#ffffff' : '#000000',
                    border: '1px solid #000000',
                    transition: 'all 0.15s ease',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span style={{ color: isActive ? '#ffffff' : '#000000' }}>
                    {info.icon}
                  </span>
                  <span>{disc} Section</span>
                </button>
              );
            })}
          </div>

          {/* Section Hero Overview Card */}
          <div
            className="card"
            style={{
              marginBottom: '24px',
              padding: '26px 30px',
              borderTop: '1px solid #e4e4e7',
              borderRight: '1px solid #e4e4e7',
              borderBottom: '1px solid #e4e4e7',
              borderLeft: '5px solid #000000',
              backgroundColor: '#ffffff',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: '16px',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span className="badge badge-dark" style={{ fontSize: '0.72rem' }}>
                    {activeDiscipline} Division
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#52525b' }}>
                    • Lead Engineer: <strong>{currentInfo.lead}</strong>
                  </span>
                </div>
                <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#000000' }}>
                  {currentInfo.name}
                </h2>
                <p style={{ fontSize: '0.86rem', color: '#27272a', marginTop: '6px', maxWidth: '780px' }}>
                  {currentInfo.description}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="btn btn-primary btn-sm"
                  style={{ gap: '6px', fontWeight: 700 }}
                >
                  <UploadCloud size={16} />
                  <span>Upload {activeDiscipline} Drawing</span>
                </button>
              </div>
            </div>

            {/* Sub-tabs: Communication vs Files */}
            <div
              style={{
                display: 'flex',
                gap: '12px',
                marginTop: '20px',
                borderTop: '1px solid #e4e4e7',
                paddingTop: '16px',
              }}
            >
              <button
                onClick={() => setActiveSubTab('communication')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 18px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  backgroundColor: activeSubTab === 'communication' ? '#000000' : '#ffffff',
                  color: activeSubTab === 'communication' ? '#ffffff' : '#000000',
                  border: '1px solid #000000',
                }}
              >
                <MessageSquare size={16} />
                <span>Discussion Board ({messages.length})</span>
              </button>

              <button
                onClick={() => setActiveSubTab('files')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 18px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  backgroundColor: activeSubTab === 'files' ? '#000000' : '#ffffff',
                  color: activeSubTab === 'files' ? '#ffffff' : '#000000',
                  border: '1px solid #000000',
                }}
              >
                <FileCode size={16} />
                <span>Drawings & Document Vault ({files.length})</span>
              </button>
            </div>
          </div>

          {/* Tab 1: Section Communication Board */}
          {activeSubTab === 'communication' && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 2fr) minmax(280px, 1fr)',
                gap: '24px',
                alignItems: 'start',
              }}
            >
              {/* Message Feed & Input Box */}
              <div className="card" style={{ padding: '0', overflow: 'hidden', border: '1px solid #000000' }}>
                <div
                  style={{
                    padding: '16px 20px',
                    borderBottom: '1px solid #000000',
                    backgroundColor: '#f4f4f5',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#000000' }}>
                    {activeDiscipline} Technical Discussion Feed
                  </span>
                  <span style={{ fontSize: '0.76rem', color: '#52525b' }}>
                    Posting as: <strong>{currentUser?.name}</strong>
                  </span>
                </div>

                {/* Message List */}
                <div
                  style={{
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    minHeight: '380px',
                    maxHeight: '520px',
                    overflowY: 'auto',
                  }}
                >
                  {messages.length === 0 ? (
                    <div style={{ padding: '40px 20px', textAlign: 'center', color: '#71717a' }}>
                      No discussions in this section yet. Start the conversation below!
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        style={{
                          display: 'flex',
                          gap: '12px',
                          backgroundColor: '#ffffff',
                          border: msg.urgent ? '2px solid #000000' : '1px solid #e4e4e7',
                          borderRadius: '8px',
                          padding: '16px',
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={msg.senderAvatar}
                          alt={msg.senderName}
                          style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #000000' }}
                        />

                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#000000' }}>
                                {msg.senderName}
                              </span>
                              <span style={{ fontSize: '0.74rem', color: '#71717a' }}>
                                ({msg.senderRole})
                              </span>
                              {msg.urgent && (
                                <span className="badge badge-dark" style={{ fontSize: '0.65rem' }}>
                                  Urgent Priority
                                </span>
                              )}
                            </div>
                            <span style={{ fontSize: '0.72rem', color: '#71717a' }}>
                              {msg.timestamp}
                            </span>
                          </div>

                          <p style={{ fontSize: '0.86rem', color: '#000000', marginTop: '6px', lineHeight: 1.5 }}>
                            {msg.content}
                          </p>

                          {msg.attachmentName && (
                            <div
                              style={{
                                marginTop: '10px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                backgroundColor: '#f4f4f5',
                                padding: '5px 12px',
                                borderRadius: '4px',
                                border: '1px solid #000000',
                                fontSize: '0.78rem',
                                color: '#000000',
                                fontWeight: 700,
                              }}
                            >
                              <Paperclip size={13} style={{ color: '#000000' }} />
                              <span>{msg.attachmentName}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Message Input Box */}
                <form
                  onSubmit={handleSendMessage}
                  style={{
                    padding: '16px 20px',
                    borderTop: '1px solid #000000',
                    backgroundColor: '#ffffff',
                  }}
                >
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                    <div style={{ flex: 1 }}>
                      <textarea
                        className="textarea-input"
                        rows={2}
                        placeholder={`Share an update, technical note, or query with the ${activeDiscipline} section...`}
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        required
                        style={{ border: '1px solid #d4d4d8' }}
                      />
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '6px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#000000', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={isUrgentMsg}
                            onChange={(e) => setIsUrgentMsg(e.target.checked)}
                          />
                          <span style={{ fontWeight: isUrgentMsg ? 800 : 500 }}>
                            Flag as Urgent Priority
                          </span>
                        </label>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ padding: '10px 20px', gap: '6px', fontWeight: 700 }}
                    >
                      <Send size={16} />
                      <span>Post</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Section Roster */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div className="card" style={{ padding: '22px', border: '1px solid #000000' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#000000', marginBottom: '14px' }}>
                    {activeDiscipline} Section Team Members
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {sectionEngineers.map((user) => (
                      <div
                        key={user.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px',
                          borderRadius: '6px',
                          backgroundColor: '#f4f4f5',
                          border: '1px solid #e4e4e7',
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={user.avatar}
                          alt={user.name}
                          style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #000000' }}
                        />
                        <div style={{ lineHeight: 1.2 }}>
                          <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#000000' }}>
                            {user.name}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#52525b' }}>
                            {user.title}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card" style={{ padding: '20px', backgroundColor: '#f4f4f5', border: '1px solid #d4d4d8' }}>
                  <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#000000', marginBottom: '8px' }}>
                    Section Guidelines
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: '#27272a', lineHeight: 1.5 }}>
                    • Electrical schematics must comply with CEB regulations and British Standard 7671.
                    <br />
                    • Civil calculations require structural lead sign-off prior to site execution.
                    <br />
                    • Mechanical pipelines must ensure minimum clearance from structural gridlines.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Section Document & Blueprint Vault */}
          {activeSubTab === 'files' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#000000' }}>
                    {activeDiscipline} Drawing & Specification Vault
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: '#52525b' }}>
                    Approved AutoCAD (.dwg), BIM models, and tender BOQ schedules
                  </p>
                </div>

                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="btn btn-primary btn-sm"
                  style={{ gap: '6px' }}
                >
                  <UploadCloud size={16} />
                  <span>Upload New Drawing</span>
                </button>
              </div>

              {files.length === 0 ? (
                <div className="card" style={{ padding: '60px 24px', textAlign: 'center', color: '#71717a' }}>
                  No technical drawings uploaded for the {activeDiscipline} section yet.
                </div>
              ) : (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
                    gap: '18px',
                  }}
                >
                  {files.map((file) => (
                    <div key={file.id} className="card card-interactive" style={{ padding: '24px', border: '1px solid #000000' }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          marginBottom: '10px',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '0.74rem',
                            fontWeight: 800,
                            padding: '3px 8px',
                            borderRadius: '4px',
                            textTransform: 'uppercase',
                            backgroundColor: '#000000',
                            color: '#ffffff',
                          }}
                        >
                          .{file.fileType}
                        </span>

                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            color: '#000000',
                            backgroundColor: '#f4f4f5',
                            border: '1px solid #d4d4d8',
                            padding: '2px 8px',
                            borderRadius: '4px',
                          }}
                        >
                          {file.version}
                        </span>
                      </div>

                      <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#000000', marginBottom: '4px' }}>
                        {file.title}
                      </h4>
                      <div style={{ fontSize: '0.8rem', color: '#71717a', marginBottom: '8px' }}>
                        File: <strong>{file.fileName}</strong> • {file.fileSize}
                      </div>

                      <div
                        style={{
                          backgroundColor: '#f4f4f5',
                          border: '1px solid #e4e4e7',
                          borderRadius: '6px',
                          padding: '10px 12px',
                          fontSize: '0.78rem',
                          color: '#27272a',
                          marginBottom: '14px',
                          lineHeight: 1.4,
                        }}
                      >
                        <div>Project: <strong>{file.projectTitle}</strong></div>
                        <div style={{ marginTop: '4px' }}>{file.notes}</div>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          borderTop: '1px solid #e4e4e7',
                          paddingTop: '12px',
                        }}
                      >
                        <div style={{ fontSize: '0.72rem', color: '#71717a' }}>
                          <div>By: {file.uploadedBy}</div>
                          <div>Date: {file.uploadDate}</div>
                        </div>

                        <button
                          onClick={() => triggerFileDownload(file)}
                          className="btn btn-secondary btn-sm"
                          style={{ gap: '6px', fontSize: '0.78rem' }}
                        >
                          <Download size={14} />
                          <span>Download</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <FileUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        defaultDiscipline={activeDiscipline}
      />
    </div>
  );
}
