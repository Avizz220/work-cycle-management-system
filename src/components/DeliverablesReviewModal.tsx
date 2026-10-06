'use client';

import React, { useState } from 'react';
import { Project, ProjectPhase, DisciplineType, PhaseDeliverableItem } from '@/types';
import { useProjects } from '@/context/ProjectContext';
import { useCommunication } from '@/context/CommunicationContext';
import {
  X,
  Zap,
  Building2,
  Droplets,
  Compass,
  Download,
  Send,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  ShieldCheck,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

interface DeliverablesReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  phase: ProjectPhase;
  initialDiscipline?: DisciplineType;
}

const DISCIPLINES: DisciplineType[] = ['Electrical', 'Civil', 'Plumbing', 'Architectural'];

export default function DeliverablesReviewModal({
  isOpen,
  onClose,
  project,
  phase,
  initialDiscipline = 'Electrical',
}: DeliverablesReviewModalProps) {
  const { markSectionCompleted, addDeliverableComment } = useProjects();
  const { triggerFileDownload } = useCommunication();

  const [activeTab, setActiveTab] = useState<DisciplineType>(
    DISCIPLINES.includes(initialDiscipline) ? initialDiscipline : 'Electrical'
  );
  const [commentInputs, setCommentInputs] = useState<{ [delId: string]: string }>({});
  const [isNoticeFlags, setIsNoticeFlags] = useState<{ [delId: string]: boolean }>({});
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const sectionCompletion = phase.sectionCompletion || {
    Electrical: false,
    Civil: false,
    Plumbing: false,
    Architectural: false,
  };

  const deliverableItems = phase.deliverableItems || [];
  const currentSectionDeliverables = deliverableItems.filter(
    (item) => item.discipline === activeTab
  );

  const isCurrentSectionCompleted = !!sectionCompletion[activeTab];

  const getDisciplineIcon = (disc: DisciplineType) => {
    switch (disc) {
      case 'Electrical':
        return <Zap size={15} />;
      case 'Civil':
        return <Building2 size={15} />;
      case 'Plumbing':
        return <Droplets size={15} />;
      case 'Architectural':
        return <Compass size={15} />;
      default:
        return <FileText size={15} />;
    }
  };

  const handleDownload = (item: PhaseDeliverableItem) => {
    // Call triggerFileDownload with compatible structure
    triggerFileDownload({
      id: item.id,
      title: item.name,
      fileName: item.fileName,
      fileSize: item.fileSize,
      fileType: item.fileType,
      discipline: item.discipline,
      version: item.version,
      uploadedBy: item.uploadedBy.name,
      uploadDate: item.uploadDate,
      projectId: project.id,
      projectTitle: project.title,
      notes: `Certified deliverable submission for ${phase.name}.`,
      downloadsCount: 1,
    });
  };

  const handleSendFeedback = (deliverableId: string, authorName: string) => {
    const text = commentInputs[deliverableId]?.trim();
    if (!text) return;

    const isNotice = !!isNoticeFlags[deliverableId];
    addDeliverableComment(project.id, phase.id, deliverableId, text, isNotice);

    setCommentInputs({ ...commentInputs, [deliverableId]: '' });
    setFeedbackSuccess(`Feedback successfully recorded and sent to ${authorName}!`);
    setTimeout(() => setFeedbackSuccess(null), 3000);
  };

  const handleToggleSectionComplete = () => {
    const nextState = !isCurrentSectionCompleted;
    markSectionCompleted(project.id, phase.id, activeTab, nextState);
  };

  // Count how many sections completed
  const completedSectionsCount = DISCIPLINES.filter((d) => sectionCompletion[d]).length;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '860px',
          width: '95%',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-light)',
            backgroundColor: '#ffffff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '14px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  backgroundColor: '#f1f5f9',
                  color: '#334155',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  border: '1px solid var(--border-light)',
                }}
              >
                Phase {phase.phaseNumber} • {project.code}
              </span>
              <span
                className={`badge ${
                  phase.status === 'Completed'
                    ? 'badge-completed'
                    : phase.status === 'In Progress'
                    ? 'badge-progress'
                    : 'badge-pending'
                }`}
              >
                {phase.status}
              </span>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                {completedSectionsCount}/4 Sections Approved
              </span>
            </div>

            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
              {phase.name}
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Review multidisciplinary deliverables, download CAD drawings, leave feedback notices, and certify completion per section.
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              padding: '6px',
              borderRadius: '6px',
              color: 'var(--text-muted)',
              backgroundColor: '#f8fafc',
              border: '1px solid var(--border-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* 4 Category Tabs */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            backgroundColor: '#f8fafc',
            borderBottom: '1px solid var(--border-light)',
            padding: '4px 8px',
            gap: '6px',
          }}
        >
          {DISCIPLINES.map((disc) => {
            const isTabActive = activeTab === disc;
            const isCompleted = !!sectionCompletion[disc];

            return (
              <button
                key={disc}
                onClick={() => setActiveTab(disc)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.82rem',
                  fontWeight: isTabActive ? 600 : 500,
                  backgroundColor: isTabActive ? '#0f172a' : '#ffffff',
                  color: isTabActive ? '#ffffff' : isCompleted ? '#166534' : 'var(--text-main)',
                  border: `1px solid ${isTabActive ? '#0f172a' : 'var(--border-light)'}`,
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                <span>{getDisciplineIcon(disc)}</span>
                <span>{disc}</span>
                {isCompleted && (
                  <CheckCircle2
                    size={13}
                    style={{ color: isTabActive ? '#86efac' : '#16a34a', marginLeft: '2px' }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Body */}
        <div
          style={{
            padding: '20px 24px',
            overflowY: 'auto',
            maxHeight: 'calc(92vh - 200px)',
            backgroundColor: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
          }}
        >
          {/* Feedback Success Toast */}
          {feedbackSuccess && (
            <div
              style={{
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                color: '#166534',
                padding: '8px 14px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <CheckCircle2 size={16} />
              <span>{feedbackSuccess}</span>
            </div>
          )}

          {/* Section Summary Bar & Approval Status */}
          <div
            style={{
              padding: '14px 18px',
              backgroundColor: isCurrentSectionCompleted ? '#f0fdf4' : '#f8fafc',
              border: `1px solid ${isCurrentSectionCompleted ? '#bbf7d0' : 'var(--border-light)'}`,
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--text-main)' }}>
                  {activeTab} Engineering Section
                </span>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    backgroundColor: isCurrentSectionCompleted ? '#dcfce7' : '#f1f5f9',
                    color: isCurrentSectionCompleted ? '#166534' : '#475569',
                    border: `1px solid ${isCurrentSectionCompleted ? '#86efac' : 'var(--border-light)'}`,
                  }}
                >
                  {isCurrentSectionCompleted ? '✓ Section Approved' : 'Review in Progress'}
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                {isCurrentSectionCompleted
                  ? 'All deliverables in this category have been certified by Project Manager.'
                  : 'Examine submitted CAD models, calculations, and specification sheets before approving.'}
              </p>
            </div>

            {/* PM Approval Action */}
            <button
              onClick={handleToggleSectionComplete}
              className={`btn btn-sm ${isCurrentSectionCompleted ? 'btn-secondary' : 'btn-primary'}`}
              style={{ gap: '6px', fontWeight: 600 }}
            >
              <ShieldCheck size={15} />
              <span>
                {isCurrentSectionCompleted
                  ? 'Revoke Section Approval'
                  : `Mark ${activeTab} as Completed`}
              </span>
            </button>
          </div>

          {/* Deliverables List for this Section */}
          <div>
            <div
              style={{
                fontSize: '0.76rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                letterSpacing: '0.04em',
                marginBottom: '10px',
              }}
            >
              Submitted Deliverables ({currentSectionDeliverables.length})
            </div>

            {currentSectionDeliverables.length === 0 ? (
              <div
                style={{
                  padding: '36px 20px',
                  textAlign: 'center',
                  backgroundColor: '#f8fafc',
                  border: '1px dashed var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-muted)',
                  fontSize: '0.84rem',
                }}
              >
                No deliverables registered under {activeTab} section for this phase yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {currentSectionDeliverables.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      border: '1px solid var(--border-light)',
                      borderRadius: 'var(--radius-lg)',
                      backgroundColor: '#ffffff',
                      boxShadow: 'var(--shadow-sm)',
                      padding: '18px 20px',
                    }}
                  >
                    {/* Top Row: File Name, Version, Status, Download */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        flexWrap: 'wrap',
                        gap: '12px',
                        marginBottom: '10px',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                          <span
                            style={{
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              backgroundColor: '#f1f5f9',
                              color: '#334155',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              border: '1px solid var(--border-light)',
                            }}
                          >
                            .{item.fileType}
                          </span>
                          <span
                            style={{
                              fontSize: '0.72rem',
                              color: 'var(--text-muted)',
                              backgroundColor: '#f8fafc',
                              border: '1px solid var(--border-light)',
                              padding: '1px 6px',
                              borderRadius: '4px',
                            }}
                          >
                            {item.version}
                          </span>
                          <span
                            style={{
                              fontSize: '0.7rem',
                              fontWeight: 600,
                              padding: '1px 6px',
                              borderRadius: '4px',
                              backgroundColor:
                                item.status === 'Approved'
                                  ? '#f0fdf4'
                                  : item.status === 'Needs Revision'
                                  ? '#fef2f2'
                                  : '#fffbeb',
                              color:
                                item.status === 'Approved'
                                  ? '#166534'
                                  : item.status === 'Needs Revision'
                                  ? '#991b1b'
                                  : '#92400e',
                              border: `1px solid ${
                                item.status === 'Approved'
                                  ? '#bbf7d0'
                                  : item.status === 'Needs Revision'
                                  ? '#fecaca'
                                  : '#fde68a'
                              }`,
                            }}
                          >
                            {item.status}
                          </span>
                        </div>

                        <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                          {item.name}
                        </h4>
                        <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          File: <strong>{item.fileName}</strong> • {item.fileSize}
                        </div>
                      </div>

                      {/* Download Button */}
                      <button
                        onClick={() => handleDownload(item)}
                        className="btn btn-secondary btn-sm"
                        style={{ gap: '6px', fontSize: '0.78rem' }}
                        title="Download file package"
                      >
                        <Download size={14} />
                        <span>Download Drawing</span>
                      </button>
                    </div>

                    {/* Author & Published Info Pill */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: '#f8fafc',
                        border: '1px solid var(--border-light)',
                        borderRadius: 'var(--radius-md)',
                        padding: '10px 14px',
                        marginBottom: '14px',
                        flexWrap: 'wrap',
                        gap: '10px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.uploadedBy.avatar}
                          alt={item.uploadedBy.name}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '1px solid var(--border-light)',
                          }}
                        />
                        <div style={{ lineHeight: 1.2 }}>
                          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)' }}>
                            Published by: {item.uploadedBy.name}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            {item.uploadedBy.title}
                          </div>
                        </div>
                      </div>

                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={13} />
                        <span>Uploaded on {item.uploadDate}</span>
                      </div>
                    </div>

                    {/* Existing Comments / Notices */}
                    {item.comments && item.comments.length > 0 && (
                      <div style={{ marginBottom: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                          Notices & Feedback History ({item.comments.length})
                        </div>
                        {item.comments.map((cmt) => (
                          <div
                            key={cmt.id}
                            style={{
                              backgroundColor: cmt.isNotice ? '#fffbeb' : '#f8fafc',
                              border: `1px solid ${cmt.isNotice ? '#fde68a' : 'var(--border-light)'}`,
                              borderRadius: '6px',
                              padding: '9px 12px',
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                              <span style={{ fontSize: '0.76rem', fontWeight: 600, color: cmt.isNotice ? '#92400e' : 'var(--text-main)' }}>
                                {cmt.authorName} ({cmt.authorRole})
                                {cmt.isNotice && ' • Formal Notice'}
                              </span>
                              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                                {cmt.timestamp}
                              </span>
                            </div>
                            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0 }}>
                              {cmt.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* PM Message & Notice Input */}
                    <div
                      style={{
                        borderTop: '1px solid var(--border-light)',
                        paddingTop: '12px',
                      }}
                    >
                      <label
                        style={{
                          fontSize: '0.76rem',
                          fontWeight: 600,
                          color: 'var(--text-secondary)',
                          display: 'block',
                          marginBottom: '4px',
                        }}
                      >
                        Leave Comment or Revision Notice for {item.uploadedBy.name}:
                      </label>

                      <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                          <input
                            type="text"
                            className="input-text"
                            placeholder="Specify revisions, CEB compliance notes, or approval comments..."
                            value={commentInputs[item.id] || ''}
                            onChange={(e) =>
                              setCommentInputs({ ...commentInputs, [item.id]: e.target.value })
                            }
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleSendFeedback(item.id, item.uploadedBy.name);
                              }
                            }}
                            style={{ fontSize: '0.8rem', padding: '6px 10px' }}
                          />

                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
                              <input
                                type="checkbox"
                                checked={!!isNoticeFlags[item.id]}
                                onChange={(e) =>
                                  setIsNoticeFlags({ ...isNoticeFlags, [item.id]: e.target.checked })
                                }
                              />
                              <span>Flag as &apos;Revision Required&apos; Notice</span>
                            </label>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleSendFeedback(item.id, item.uploadedBy.name)}
                          className="btn btn-secondary btn-sm"
                          style={{ gap: '6px', fontSize: '0.76rem', padding: '7px 12px' }}
                        >
                          <Send size={13} />
                          <span>Send Notice</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '14px 24px',
            borderTop: '1px solid var(--border-light)',
            backgroundColor: '#f8fafc',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
            Phase Progress: <strong style={{ color: 'var(--text-main)' }}>{phase.progress}%</strong> (
            {completedSectionsCount} of 4 disciplines signed off)
          </div>

          <button onClick={onClose} className="btn btn-secondary btn-sm">
            Close Deliverables Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
