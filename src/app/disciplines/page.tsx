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
          icon: <Zap size={20} style={{ color: '#0f172a' }} />,
          lead: 'Eng. Kevin Fernando',
          description:
            'Responsible for 11kV/33kV substations, transformer risers, emergency diesel generators, LEED energy efficiency, and lightning protection systems.',
        };
      case 'Civil':
        return {
          name: 'Civil, Geotechnical & Structural Engineering',
          icon: <Building2 size={20} style={{ color: '#0f172a' }} />,
          lead: 'Eng. Dilshan Perera',
          description:
            'Specializes in diaphragm walls, deep bored piling, post-tensioned bridge girders, seismic structural analysis, and highway stormwater earthworks.',
        };
      case 'Plumbing':
        return {
          name: 'Plumbing, MEP & Fire Protection Systems',
          icon: <Droplets size={20} style={{ color: '#0f172a' }} />,
          lead: 'Eng. Kasun Silva',
          description:
            'Designs hydro-pneumatic booster pumping risers, medical gas pipework, wastewater bio-digesters, and NFPA compliant fire suppression sprinkler grids.',
        };
      case 'Architectural':
        return {
          name: 'Architectural & Façade Engineering',
          icon: <Compass size={20} style={{ color: '#0f172a' }} />,
          lead: 'Arch. Nimmi Wickramasinghe',
          description:
            'Focuses on spatial planning, curtain wall façade engineering, sustainable building envelopes, urban zoning statutory compliance, and construction detailing.',
        };
      default:
        return {
          name: 'Multidisciplinary Department',
          icon: <Users size={20} style={{ color: '#0f172a' }} />,
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
          {/* Discipline Navigation Tabs - Styled cleanly matching enterprise standard */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              borderBottom: '1px solid var(--border-light)',
              paddingBottom: '14px',
              marginBottom: '20px',
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
                    gap: '8px',
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '0.85rem',
                    backgroundColor: isActive ? '#0f172a' : '#ffffff',
                    color: isActive ? '#ffffff' : '#475569',
                    border: `1px solid ${isActive ? '#0f172a' : 'var(--border-light)'}`,
                    transition: 'all 0.15s ease',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span style={{ color: isActive ? '#ffffff' : '#64748b' }}>
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
              marginBottom: '20px',
              padding: '22px 26px',
              border: '1px solid var(--border-light)',
              backgroundColor: '#ffffff',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: '14px',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span className="badge badge-subtle">
                    {activeDiscipline} Division
                  </span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    • Lead Engineer: <strong style={{ color: 'var(--text-secondary)' }}>{currentInfo.lead}</strong>
                  </span>
                </div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                  {currentInfo.name}
                </h2>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '4px', maxWidth: '780px', lineHeight: 1.5 }}>
                  {currentInfo.description}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="btn btn-primary btn-sm"
                  style={{ gap: '6px', fontWeight: 600 }}
                >
                  <UploadCloud size={15} />
                  <span>Upload {activeDiscipline} Drawing</span>
                </button>
              </div>
            </div>

            {/* Sub-tabs: Communication vs Files */}
            <div
              style={{
                display: 'flex',
                gap: '10px',
                marginTop: '16px',
                borderTop: '1px solid var(--border-light)',
                paddingTop: '14px',
              }}
            >
              <button
                onClick={() => setActiveSubTab('communication')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.82rem',
                  fontWeight: activeSubTab === 'communication' ? 600 : 500,
                  backgroundColor: activeSubTab === 'communication' ? '#0f172a' : '#ffffff',
                  color: activeSubTab === 'communication' ? '#ffffff' : '#475569',
                  border: `1px solid ${activeSubTab === 'communication' ? '#0f172a' : 'var(--border-light)'}`,
                }}
              >
                <MessageSquare size={14} />
                <span>Discussion Board ({messages.length})</span>
              </button>

              <button
                onClick={() => setActiveSubTab('files')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.82rem',
                  fontWeight: activeSubTab === 'files' ? 600 : 500,
                  backgroundColor: activeSubTab === 'files' ? '#0f172a' : '#ffffff',
                  color: activeSubTab === 'files' ? '#ffffff' : '#475569',
                  border: `1px solid ${activeSubTab === 'files' ? '#0f172a' : 'var(--border-light)'}`,
                }}
              >
                <FileCode size={14} />
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
                gap: '20px',
                alignItems: 'start',
              }}
            >
              {/* Message Feed & Input Box */}
              <div className="card" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
                <div
                  style={{
                    padding: '14px 18px',
                    borderBottom: '1px solid var(--border-light)',
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-main)' }}>
                    {activeDiscipline} Technical Discussion Feed
                  </span>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    Posting as: <strong style={{ color: 'var(--text-secondary)' }}>{currentUser?.name}</strong>
                  </span>
                </div>

                {/* Message List */}
                <div
                  style={{
                    padding: '16px 18px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                    minHeight: '380px',
                    maxHeight: '520px',
                    overflowY: 'auto',
                    backgroundColor: '#f8fafc',
                  }}
                >
                  {messages.length === 0 ? (
                    <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
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
                          border: `1px solid ${msg.urgent ? '#fde68a' : 'var(--border-light)'}`,
                          borderRadius: '8px',
                          padding: '14px',
                          boxShadow: 'var(--shadow-sm)',
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={msg.senderAvatar}
                          alt={msg.senderName}
                          style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border-light)', flexShrink: 0 }}
                        />

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-main)' }}>
                                {msg.senderName}
                              </span>
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                ({msg.senderRole})
                              </span>
                              {msg.urgent && (
                                <span
                                  style={{
                                    fontSize: '0.66rem',
                                    fontWeight: 600,
                                    backgroundColor: '#fffbeb',
                                    color: '#92400e',
                                    border: '1px solid #fde68a',
                                    padding: '1px 6px',
                                    borderRadius: '4px',
                                  }}
                                >
                                  Urgent Priority
                                </span>
                              )}
                            </div>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                              {msg.timestamp}
                            </span>
                          </div>

                          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.5 }}>
                            {msg.content}
                          </p>

                          {msg.attachmentName && (
                            <div
                              style={{
                                marginTop: '8px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                backgroundColor: '#f1f5f9',
                                padding: '4px 10px',
                                borderRadius: '4px',
                                border: '1px solid var(--border-light)',
                                fontSize: '0.74rem',
                                color: 'var(--text-secondary)',
                                fontWeight: 500,
                              }}
                            >
                              <Paperclip size={12} style={{ color: '#64748b' }} />
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
                    padding: '14px 18px',
                    borderTop: '1px solid var(--border-light)',
                    backgroundColor: '#ffffff',
                  }}
                >
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                    <div style={{ flex: 1 }}>
                      <textarea
                        className="textarea-input"
                        rows={2}
                        placeholder={`Share an update, technical note, or query with the ${activeDiscipline} section...`}
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        required
                        style={{ border: '1px solid var(--border-light)', fontSize: '0.82rem' }}
                      />
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '6px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={isUrgentMsg}
                            onChange={(e) => setIsUrgentMsg(e.target.checked)}
                          />
                          <span style={{ fontWeight: isUrgentMsg ? 600 : 400, color: isUrgentMsg ? '#92400e' : 'var(--text-muted)' }}>
                            Flag as Urgent Priority
                          </span>
                        </label>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ padding: '8px 16px', gap: '6px', fontWeight: 600 }}
                    >
                      <Send size={15} />
                      <span>Post</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Section Roster */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="card" style={{ padding: '18px', border: '1px solid var(--border-light)', backgroundColor: '#ffffff' }}>
                  <h4 style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '12px' }}>
                    {activeDiscipline} Section Team Members
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {sectionEngineers.map((user) => (
                      <div
                        key={user.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '8px 10px',
                          borderRadius: '6px',
                          backgroundColor: '#f8fafc',
                          border: '1px solid var(--border-light)',
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={user.avatar}
                          alt={user.name}
                          style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border-light)', flexShrink: 0 }}
                        />
                        <div style={{ lineHeight: 1.2, minWidth: 0 }}>
                          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {user.name}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {user.title}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card" style={{ padding: '16px', backgroundColor: '#f8fafc', border: '1px solid var(--border-light)' }}>
                  <h4 style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                    Section Guidelines
                  </h4>
                  <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                  <h3 style={{ fontSize: '1.18rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {activeDiscipline} Drawing & Specification Vault
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Approved AutoCAD (.dwg), BIM models, and tender BOQ schedules
                  </p>
                </div>

                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="btn btn-primary btn-sm"
                  style={{ gap: '6px' }}
                >
                  <UploadCloud size={15} />
                  <span>Upload New Drawing</span>
                </button>
              </div>

              {files.length === 0 ? (
                <div className="card" style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--text-muted)', border: '1px solid var(--border-light)', backgroundColor: '#ffffff' }}>
                  No technical drawings uploaded for the {activeDiscipline} section yet.
                </div>
              ) : (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                    gap: '16px',
                  }}
                >
                  {files.map((file) => (
                    <div key={file.id} className="card card-interactive" style={{ padding: '20px', border: '1px solid var(--border-light)', backgroundColor: '#ffffff' }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          marginBottom: '8px',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            padding: '2px 8px',
                            borderRadius: '4px',
                            textTransform: 'uppercase',
                            backgroundColor: '#f1f5f9',
                            color: '#475569',
                            border: '1px solid var(--border-light)',
                          }}
                        >
                          .{file.fileType}
                        </span>

                        <span
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 500,
                            color: 'var(--text-muted)',
                            backgroundColor: '#f8fafc',
                            border: '1px solid var(--border-light)',
                            padding: '2px 8px',
                            borderRadius: '4px',
                          }}
                        >
                          {file.version}
                        </span>
                      </div>

                      <h4 style={{ fontSize: '0.94rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '3px' }}>
                        {file.title}
                      </h4>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                        File: <strong>{file.fileName}</strong> • {file.fileSize}
                      </div>

                      <div
                        style={{
                          backgroundColor: '#f8fafc',
                          border: '1px solid var(--border-light)',
                          borderRadius: '6px',
                          padding: '8px 10px',
                          fontSize: '0.76rem',
                          color: 'var(--text-secondary)',
                          marginBottom: '12px',
                          lineHeight: 1.4,
                        }}
                      >
                        <div>Project: <strong>{file.projectTitle}</strong></div>
                        <div style={{ marginTop: '3px' }}>{file.notes}</div>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          borderTop: '1px solid var(--border-light)',
                          paddingTop: '10px',
                        }}
                      >
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          <div>By: {file.uploadedBy}</div>
                          <div>Date: {file.uploadDate}</div>
                        </div>

                        <button
                          onClick={() => triggerFileDownload(file)}
                          className="btn btn-secondary btn-sm"
                          style={{ gap: '6px', fontSize: '0.74rem', padding: '3px 8px' }}
                        >
                          <Download size={13} />
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
