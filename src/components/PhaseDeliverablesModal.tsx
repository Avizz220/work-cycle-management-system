'use client';

import React, { useState } from 'react';
import { useProjects } from '@/context/ProjectContext';
import { useCommunication } from '@/context/CommunicationContext';
import { Project, ProjectPhase, DisciplineType, PhaseDeliverableItem } from '@/types';
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
  FileCode,
  RotateCcw,
  MessageSquare,
  MessageCircle,
  Calendar,
  Check,
} from 'lucide-react';

interface PhaseDeliverablesModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  phase: ProjectPhase;
}

export default function PhaseDeliverablesModal({
  isOpen,
  onClose,
  project,
  phase,
}: PhaseDeliverablesModalProps) {
  const { markSectionCompleted, addDeliverableComment } = useProjects();
  const { triggerFileDownload } = useCommunication();

  const [activeCategory, setActiveCategory] = useState<DisciplineType>('Electrical');
  const [commentInputs, setCommentInputs] = useState<{ [deliverableId: string]: string }>({});
  const [isNoticeFlags, setIsNoticeFlags] = useState<{ [deliverableId: string]: boolean }>({});
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Retrieve deliverables for this phase
  const allDeliverables = phase.deliverableItems || [];
  const categoryDeliverables = allDeliverables.filter(
    (del) => del.discipline === activeCategory
  );

  const sectionCompletion = phase.sectionCompletion || {
    Electrical: false,
    Civil: false,
    Plumbing: false,
    Architectural: false,
  };

  const isCurrentSectionCompleted = sectionCompletion[activeCategory] || false;

  const disciplines: { type: DisciplineType; label: string; icon: React.ReactNode }[] = [
    { type: 'Electrical', label: 'Electrical Systems', icon: <Zap size={14} /> },
    { type: 'Civil', label: 'Civil & Structural', icon: <Building2 size={14} /> },
    { type: 'Plumbing', label: 'Plumbing & MEP', icon: <Droplets size={14} /> },
    { type: 'Architectural', label: 'Architecture & Façade', icon: <Compass size={14} /> },
  ];

  const handleToggleSectionComplete = () => {
    const nextState = !isCurrentSectionCompleted;
    markSectionCompleted(project.id, phase.id, activeCategory, nextState);
    setActionSuccessMsg(
      nextState
        ? `Marked ${activeCategory} Section as Completed & Approved!`
        : `Reopened ${activeCategory} Section for further technical revisions.`
    );
    setTimeout(() => setActionSuccessMsg(null), 3000);
  };

  const handleSendComment = (deliverableId: string) => {
    const text = commentInputs[deliverableId]?.trim();
    if (!text) return;

    const isNotice = !!isNoticeFlags[deliverableId];
    addDeliverableComment(project.id, phase.id, deliverableId, text, isNotice);

    setCommentInputs({ ...commentInputs, [deliverableId]: '' });
    setIsNoticeFlags({ ...isNoticeFlags, [deliverableId]: false });

    setActionSuccessMsg(
      isNotice
        ? 'Revision notice issued to lead engineer.'
        : 'Feedback comment posted successfully.'
    );
    setTimeout(() => setActionSuccessMsg(null), 2500);
  };

  const completedSectionsCount = disciplines.filter((d) => sectionCompletion[d.type]).length;
  const currentProgress = Math.round((completedSectionsCount / 4) * 100);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '820px',
          width: '95%',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-light)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-light)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            backgroundColor: '#ffffff',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  backgroundColor: '#f1f5f9',
                  color: '#334155',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  border: '1px solid var(--border-light)',
                }}
              >
                {project.code}
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {project.title}
              </span>
            </div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
              Phase {phase.phaseNumber}: {phase.name}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Target Deadline: <strong style={{ color: 'var(--text-secondary)' }}>{phase.deadline}</strong>
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Phase Progress:{' '}
                <strong style={{ color: currentProgress === 100 ? '#166534' : '#0f172a' }}>
                  {currentProgress}% ({completedSectionsCount} of 4 Sections Approved)
                </strong>
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              padding: '6px',
              borderRadius: '6px',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              border: 'none',
              background: 'transparent',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Success Alert Banner if an action was taken */}
        {actionSuccessMsg && (
          <div
            style={{
              padding: '10px 24px',
              backgroundColor: '#f0fdf4',
              borderBottom: '1px solid #bbf7d0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.82rem',
              color: '#166534',
              fontWeight: 600,
            }}
          >
            <Check size={16} />
            <span>{actionSuccessMsg}</span>
          </div>
        )}

        {/* 4 Section Category Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '6px',
            padding: '12px 24px',
            backgroundColor: '#f8fafc',
            borderBottom: '1px solid var(--border-light)',
            overflowX: 'auto',
          }}
        >
          {disciplines.map((d) => {
            const isActive = activeCategory === d.type;
            const isCompleted = sectionCompletion[d.type] || false;
            return (
              <button
                key={d.type}
                onClick={() => setActiveCategory(d.type)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.82rem',
                  fontWeight: isActive ? 600 : 500,
                  backgroundColor: isActive ? '#0f172a' : '#ffffff',
                  color: isActive ? '#ffffff' : '#475569',
                  border: `1px solid ${isActive ? '#0f172a' : 'var(--border-light)'}`,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <span style={{ color: isActive ? '#ffffff' : '#64748b' }}>{d.icon}</span>
                <span>{d.label}</span>
                {isCompleted ? (
                  <span
                    style={{
                      fontSize: '0.64rem',
                      fontWeight: 600,
                      backgroundColor: isActive ? '#1e293b' : '#f0fdf4',
                      color: isActive ? '#86efac' : '#166534',
                      padding: '1px 6px',
                      borderRadius: '4px',
                      border: `1px solid ${isActive ? '#334155' : '#bbf7d0'}`,
                    }}
                  >
                    Approved
                  </span>
                ) : (
                  <span
                    style={{
                      fontSize: '0.64rem',
                      fontWeight: 500,
                      backgroundColor: isActive ? '#1e293b' : '#f8fafc',
                      color: isActive ? '#cbd5e1' : '#64748b',
                      padding: '1px 6px',
                      borderRadius: '4px',
                      border: `1px solid ${isActive ? '#334155' : '#e2e8f0'}`,
                    }}
                  >
                    Pending
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Section Management Action Bar for PM */}
        <div
          style={{
            padding: '14px 24px',
            backgroundColor: '#ffffff',
            borderBottom: '1px solid var(--border-light)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-main)' }}>
                {activeCategory} Section Status:
              </span>
              {isCurrentSectionCompleted ? (
                <span
                  style={{
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    backgroundColor: '#f0fdf4',
                    color: '#166534',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    border: '1px solid #bbf7d0',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <CheckCircle2 size={13} /> Completed & Approved by PM
                </span>
              ) : (
                <span
                  style={{
                    fontSize: '0.74rem',
                    fontWeight: 500,
                    backgroundColor: '#fffbeb',
                    color: '#92400e',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    border: '1px solid #fde68a',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <AlertCircle size={13} /> Under Review / In Progress
                </span>
              )}
            </div>
            <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Verify deliverables below, submit optional revision notices, and approve section completion.
            </p>
          </div>

          <div>
            {isCurrentSectionCompleted ? (
              <button
                type="button"
                onClick={handleToggleSectionComplete}
                className="btn btn-secondary btn-sm"
                style={{ gap: '6px', fontSize: '0.78rem' }}
              >
                <RotateCcw size={13} />
                <span>Reopen {activeCategory} Section</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleToggleSectionComplete}
                className="btn btn-primary btn-sm"
                style={{ gap: '6px', fontSize: '0.8rem', fontWeight: 600 }}
              >
                <CheckCircle2 size={14} />
                <span>Mark {activeCategory} Section as Completed</span>
              </button>
            )}
          </div>
        </div>

        {/* Deliverables List (One by One) */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            backgroundColor: '#f8fafc',
          }}
        >
          {categoryDeliverables.length === 0 ? (
            <div
              style={{
                padding: '40px 20px',
                textAlign: 'center',
                backgroundColor: '#ffffff',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-muted)',
                fontSize: '0.84rem',
              }}
            >
              No specific deliverables registered under the {activeCategory} section for this phase yet.
            </div>
          ) : (
            categoryDeliverables.map((del) => (
              <div
                key={del.id}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  padding: '18px 20px',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                {/* Header Row: Deliverable Name & Status */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: '10px',
                    marginBottom: '10px',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          backgroundColor: '#f1f5f9',
                          color: '#475569',
                          border: '1px solid var(--border-light)',
                          padding: '1px 6px',
                          borderRadius: '4px',
                          textTransform: 'uppercase',
                        }}
                      >
                        .{del.fileType}
                      </span>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          color: 'var(--text-muted)',
                        }}
                      >
                        {del.version}
                      </span>
                      <span
                        style={{
                          fontSize: '0.68rem',
                          fontWeight: 600,
                          backgroundColor:
                            del.status === 'Approved'
                              ? '#f0fdf4'
                              : del.status === 'Needs Revision'
                              ? '#fef2f2'
                              : '#f8fafc',
                          color:
                            del.status === 'Approved'
                              ? '#166534'
                              : del.status === 'Needs Revision'
                              ? '#991b1b'
                              : '#475569',
                          border: `1px solid ${
                            del.status === 'Approved'
                              ? '#bbf7d0'
                              : del.status === 'Needs Revision'
                              ? '#fecaca'
                              : 'var(--border-light)'
                          }`,
                          padding: '1px 7px',
                          borderRadius: '4px',
                        }}
                      >
                        {del.status}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '0.98rem', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>
                      {del.name}
                    </h4>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      File: <strong>{del.fileName}</strong> • {del.fileSize}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      triggerFileDownload({
                        id: del.id,
                        title: del.name,
                        fileName: del.fileName,
                        fileSize: del.fileSize,
                        fileType: del.fileType,
                        discipline: del.discipline,
                        version: del.version,
                        uploadedBy: del.uploadedBy.name,
                        uploadDate: del.uploadDate,
                        projectId: project.id,
                        projectTitle: project.title,
                        notes: 'Certified drawing package download.',
                        downloadsCount: 1,
                      })
                    }
                    className="btn btn-secondary btn-sm"
                    style={{ gap: '6px', fontSize: '0.76rem', padding: '4px 10px' }}
                  >
                    <Download size={13} />
                    <span>Download ({del.fileSize})</span>
                  </button>
                </div>

                {/* Published Person Info */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid var(--border-light)',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    marginBottom: '14px',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={del.uploadedBy.avatar}
                    alt={del.uploadedBy.name}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '1px solid var(--border-light)',
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        {del.uploadedBy.name}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        ({del.uploadedBy.title})
                      </span>
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={11} />
                      <span>Published on: {del.uploadDate}</span>
                    </div>
                  </div>
                </div>

                {/* Existing Comments & Revision Notices */}
                {del.comments && del.comments.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                    <div style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Comments & Directives ({del.comments.length})
                    </div>
                    {del.comments.map((cmt) => (
                      <div
                        key={cmt.id}
                        style={{
                          padding: '8px 12px',
                          backgroundColor: cmt.isNotice ? '#fffbeb' : '#ffffff',
                          border: `1px solid ${cmt.isNotice ? '#fde68a' : 'var(--border-light)'}`,
                          borderRadius: '6px',
                          fontSize: '0.78rem',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                          <span style={{ fontWeight: 600, color: cmt.isNotice ? '#92400e' : 'var(--text-main)' }}>
                            {cmt.authorName} ({cmt.authorRole})
                            {cmt.isNotice && (
                              <span
                                style={{
                                  marginLeft: '6px',
                                  fontSize: '0.64rem',
                                  backgroundColor: '#fef3c7',
                                  color: '#92400e',
                                  padding: '1px 5px',
                                  borderRadius: '3px',
                                  fontWeight: 600,
                                }}
                              >
                                Revision Notice
                              </span>
                            )}
                          </span>
                          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{cmt.timestamp}</span>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                          {cmt.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* PM Feedback & Revision Notice Input Form */}
                <div
                  style={{
                    borderTop: '1px solid var(--border-light)',
                    paddingTop: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    <MessageSquare size={12} />
                    <span>Provide feedback or revision notice for <strong>{del.uploadedBy.name}</strong>:</span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <textarea
                      rows={1}
                      placeholder={`Leave note or revision request for ${del.uploadedBy.name.split(' ')[1]}...`}
                      value={commentInputs[del.id] || ''}
                      onChange={(e) =>
                        setCommentInputs({ ...commentInputs, [del.id]: e.target.value })
                      }
                      style={{
                        flex: 1,
                        padding: '6px 10px',
                        fontSize: '0.8rem',
                        border: '1px solid var(--border-light)',
                        borderRadius: 'var(--radius-md)',
                        outline: 'none',
                        resize: 'vertical',
                      }}
                    />

                    <button
                      type="button"
                      onClick={() => handleSendComment(del.id)}
                      className="btn btn-secondary btn-sm"
                      style={{ gap: '4px', fontSize: '0.74rem', padding: '6px 12px', flexShrink: 0 }}
                    >
                      <Send size={12} />
                      <span>Post</span>
                    </button>
                  </div>

                  <label
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.72rem',
                      color: isNoticeFlags[del.id] ? '#92400e' : 'var(--text-muted)',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={!!isNoticeFlags[del.id]}
                      onChange={(e) =>
                        setIsNoticeFlags({ ...isNoticeFlags, [del.id]: e.target.checked })
                      }
                    />
                    <span>Flag as Priority Revision Notice (requires update from engineer)</span>
                  </label>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '14px 24px',
            backgroundColor: '#ffffff',
            borderTop: '1px solid var(--border-light)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
            Viewing <strong>{activeCategory}</strong> deliverables • Project Manager Review Panel
          </div>

          <button
            type="button"
            onClick={onClose}
            className="btn btn-primary btn-sm"
            style={{ padding: '6px 16px' }}
          >
            Close Review Panel
          </button>
        </div>
      </div>
    </div>
  );
}
