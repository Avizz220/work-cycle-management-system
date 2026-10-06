'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import PhaseDeliverablesModal from '@/components/PhaseDeliverablesModal';
import ProjectTeamModal from '@/components/ProjectTeamModal';
import { useProjects } from '@/context/ProjectContext';
import { useAuth } from '@/context/AuthContext';
import {
  FolderPlus,
  ChevronDown,
  ChevronUp,
  Trash2,
  CheckCircle2,
  Zap,
  Building2,
  Droplets,
  Compass,
  Search,
  Users,
  FileCheck,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { DisciplineType, Project, ProjectPhase } from '@/types';

export default function ProjectsDirectoryPage() {
  const { projects, deleteProject } = useProjects();
  const { isPM } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(projects[0]?.id || null);

  // Modals state
  const [activeDeliverablesModal, setActiveDeliverablesModal] = useState<{
    project: Project;
    phase: ProjectPhase;
  } | null>(null);

  const [activeTeamModalProject, setActiveTeamModalProject] = useState<Project | null>(null);

  const filteredProjects = projects.filter((prj) => {
    const matchesSearch =
      prj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prj.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prj.client.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'All' || prj.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const getDisciplineBadge = (disc: DisciplineType | 'All') => {
    switch (disc) {
      case 'Electrical':
        return (
          <span className="badge badge-subtle">
            <Zap size={12} style={{ color: '#64748b' }} /> Electrical
          </span>
        );
      case 'Civil':
        return (
          <span className="badge badge-subtle">
            <Building2 size={12} style={{ color: '#64748b' }} /> Civil
          </span>
        );
      case 'Plumbing':
        return (
          <span className="badge badge-subtle">
            <Droplets size={12} style={{ color: '#64748b' }} /> Plumbing
          </span>
        );
      case 'Architectural':
        return (
          <span className="badge badge-subtle">
            <Compass size={12} style={{ color: '#64748b' }} /> Architecture
          </span>
        );
      default:
        return <span className="badge badge-subtle">General</span>;
    }
  };

  return (
    <div className="app-container">
      <Sidebar />

      <div className="main-wrapper">
        <Navbar
          pageTitle="Projects & Multidisciplinary Portfolio"
          subtitle="Enterprise Directory of active design, structural and MEP contracts"
        />

        <main className="main-content">
          {/* Top Controls & Search Bar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '14px',
              marginBottom: '20px',
            }}
          >
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', flex: 1 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  padding: '6px 12px',
                  maxWidth: '360px',
                  width: '100%',
                }}
              >
                <Search size={15} style={{ color: '#94a3b8' }} />
                <input
                  type="text"
                  placeholder="Search by title, code, client..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    fontSize: '0.84rem',
                    width: '100%',
                    color: 'var(--text-main)',
                    outline: 'none',
                  }}
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="select-input"
                style={{
                  width: 'auto',
                  padding: '6px 12px',
                  fontSize: '0.82rem',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: '#ffffff',
                  color: 'var(--text-main)',
                }}
              >
                <option value="All">All Categories</option>
                <option value="Commercial">Commercial</option>
                <option value="Residential">Residential</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Healthcare">Healthcare</option>
              </select>
            </div>

            {isPM && (
              <Link href="/projects/new" className="btn btn-primary" style={{ gap: '6px' }}>
                <FolderPlus size={16} />
                <span>Add New Project</span>
              </Link>
            )}
          </div>

          {/* Projects List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {filteredProjects.length === 0 ? (
              <div
                className="card"
                style={{
                  padding: '48px 24px',
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border-light)',
                  backgroundColor: '#ffffff',
                }}
              >
                No projects matched your search criteria.
              </div>
            ) : (
              filteredProjects.map((prj) => {
                const isExpanded = expandedProjectId === prj.id;
                const assignedCount = (prj.assignedMemberIds || []).length;

                return (
                  <div
                    key={prj.id}
                    className="card"
                    style={{
                      padding: '22px 24px',
                      border: '1px solid var(--border-light)',
                      backgroundColor: '#ffffff',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    {/* Project Header Row */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        flexWrap: 'wrap',
                        gap: '14px',
                        marginBottom: '12px',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                          {/* Light Ash Code Badge - No Black Blob! */}
                          <span
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 600,
                              backgroundColor: '#f1f5f9',
                              color: '#334155',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              border: '1px solid var(--border-light)',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {prj.code}
                          </span>
                          <span className="badge badge-progress">{prj.status}</span>
                          <span className="badge badge-subtle">{prj.category}</span>
                        </div>

                        <Link
                          href={`/projects/${prj.id}`}
                          style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                          <h2
                            style={{
                              fontSize: '1.25rem',
                              fontWeight: 700,
                              color: 'var(--text-main)',
                              margin: 0,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '8px',
                            }}
                          >
                            <span>{prj.title}</span>
                            <ExternalLink size={14} style={{ color: '#94a3b8' }} />
                          </h2>
                        </Link>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                          Client: <strong style={{ color: 'var(--text-secondary)' }}>{prj.client}</strong> • Location: <strong style={{ color: 'var(--text-secondary)' }}>{prj.location}</strong>
                        </p>
                      </div>

                      {/* Right Meta & Actions */}
                      <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                          Budget: <strong style={{ color: 'var(--text-main)', fontSize: '0.92rem' }}>{prj.budget}</strong>
                        </div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                          Lead PM: <strong>{prj.projectManager}</strong>
                        </div>

                        {/* Team assignment & Open Project action button */}
                        <div style={{ display: 'flex', gap: '8px', marginTop: '6px', alignItems: 'center' }}>
                          <Link
                            href={`/projects/${prj.id}`}
                            className="btn btn-primary btn-sm"
                            style={{ gap: '5px', fontSize: '0.76rem', padding: '4px 11px' }}
                            title="Open project hub, multidisciplinary deliverables and team assignment"
                          >
                            <ExternalLink size={13} />
                            <span>Open Project & Deliverables</span>
                          </Link>

                          {isPM && (
                            <button
                              type="button"
                              onClick={() => setActiveTeamModalProject(prj)}
                              className="btn btn-secondary btn-sm"
                              style={{ gap: '5px', fontSize: '0.75rem', padding: '4px 9px' }}
                            >
                              <Users size={13} />
                              <span>Assign Team ({assignedCount})</span>
                            </button>
                          )}

                          {isPM && (
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete project ${prj.code}?`)) {
                                  deleteProject(prj.id);
                                }
                              }}
                              style={{
                                fontSize: '0.74rem',
                                color: '#991b1b',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                              }}
                              title="Delete project contract"
                            >
                              <Trash2 size={13} />
                              <span>Delete</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.5 }}>
                      {prj.description}
                    </p>

                    {/* Progress Bar & Quick Metrics */}
                    <div
                      style={{
                        backgroundColor: '#f8fafc',
                        border: '1px solid var(--border-light)',
                        borderRadius: 'var(--radius-md)',
                        padding: '12px 16px',
                        marginBottom: '14px',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                        gap: '14px',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', marginBottom: '4px' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Overall Progress</span>
                          <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{prj.overallProgress}%</span>
                        </div>
                        <div className="progress-track">
                          <div className="progress-fill" style={{ width: `${prj.overallProgress}%` }} />
                        </div>
                      </div>

                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Target Completion: <strong style={{ color: 'var(--text-secondary)' }}>{prj.targetCompletion}</strong>
                      </div>

                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Phases Count: <strong style={{ color: 'var(--text-secondary)' }}>{prj.phases.length} Phases</strong>
                      </div>

                      <div style={{ textAlign: 'right', display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <Link
                          href={`/projects/${prj.id}`}
                          className="btn btn-secondary btn-sm"
                          style={{ gap: '5px', fontSize: '0.76rem' }}
                        >
                          <ExternalLink size={13} />
                          <span>Open Project Details</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => setExpandedProjectId(isExpanded ? null : prj.id)}
                          className="btn btn-secondary btn-sm"
                          style={{ gap: '6px', fontSize: '0.76rem' }}
                        >
                          <span>{isExpanded ? 'Hide' : 'Quick Preview'}</span>
                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                      </div>
                    </div>

                    {/* Expandable Phase Details Section */}
                    {isExpanded && (
                      <div
                        style={{
                          borderTop: '1px solid var(--border-light)',
                          paddingTop: '16px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '12px',
                        }}
                      >
                        <div
                          style={{
                            fontSize: '0.76rem',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            color: 'var(--text-muted)',
                            letterSpacing: '0.04em',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <span>Multidisciplinary Phase Schedule & Deliverables</span>
                          <span>Phase Progress & Section Reviews</span>
                        </div>

                        {prj.phases.map((phase) => {
                          const deliverableCount = (phase.deliverableItems || []).length || phase.deliverables.length;
                          const sectionComp = phase.sectionCompletion || {
                            Electrical: false,
                            Civil: false,
                            Plumbing: false,
                            Architectural: false,
                          };
                          const completedCount = ['Electrical', 'Civil', 'Plumbing', 'Architectural'].filter(
                            (s) => (sectionComp as any)[s]
                          ).length;

                          return (
                            <div
                              key={phase.id}
                              style={{
                                backgroundColor: '#ffffff',
                                border: '1px solid var(--border-light)',
                                borderRadius: 'var(--radius-md)',
                                padding: '14px 18px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                gap: '14px',
                              }}
                            >
                              <div style={{ maxWidth: '65%', flex: 1, minWidth: '280px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                                  {/* Light Ash Phase Tag - No Black Blob! */}
                                  <span
                                    style={{
                                      fontSize: '0.7rem',
                                      fontWeight: 600,
                                      backgroundColor: '#f1f5f9',
                                      color: '#334155',
                                      padding: '2px 8px',
                                      borderRadius: '4px',
                                      border: '1px solid var(--border-light)',
                                      whiteSpace: 'nowrap',
                                    }}
                                  >
                                    Phase {phase.phaseNumber}
                                  </span>

                                  {getDisciplineBadge(phase.assignedSection)}

                                  <span style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-main)' }}>
                                    {phase.name}
                                  </span>

                                  {phase.critical && (
                                    <span
                                      style={{
                                        fontSize: '0.66rem',
                                        fontWeight: 600,
                                        backgroundColor: '#fef2f2',
                                        color: '#991b1b',
                                        border: '1px solid #fecaca',
                                        padding: '1px 6px',
                                        borderRadius: '4px',
                                        whiteSpace: 'nowrap',
                                      }}
                                    >
                                      Critical Path
                                    </span>
                                  )}
                                </div>

                                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '2px' }}>
                                  <span>Lead: <strong>{phase.leadPerson}</strong></span>
                                  <span>Timeline: {phase.startDate} to <strong>{phase.deadline}</strong></span>
                                  <span>Sections Approved: <strong style={{ color: 'var(--text-secondary)' }}>{completedCount} / 4</strong></span>
                                </div>

                                {/* Clickable Deliverables Summary */}
                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
                                  {phase.deliverables.map((del, dIdx) => (
                                    <span
                                      key={dIdx}
                                      onClick={() => setActiveDeliverablesModal({ project: prj, phase })}
                                      style={{
                                        fontSize: '0.7rem',
                                        backgroundColor: '#f8fafc',
                                        color: '#475569',
                                        padding: '2px 8px',
                                        borderRadius: '4px',
                                        border: '1px solid var(--border-light)',
                                        fontWeight: 500,
                                        cursor: 'pointer',
                                      }}
                                      title="Click to review full deliverable package"
                                    >
                                      ✓ {del}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {/* Phase Progress & Review Deliverables Action (NO Manual Status Select Dropdown!) */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                                {/* Read-Only Progress Display */}
                                <div style={{ textAlign: 'right', minWidth: '110px' }}>
                                  {phase.status === 'Completed' ? (
                                    <span
                                      style={{
                                        fontSize: '0.74rem',
                                        fontWeight: 600,
                                        color: '#166534',
                                        backgroundColor: '#f0fdf4',
                                        border: '1px solid #bbf7d0',
                                        padding: '2px 8px',
                                        borderRadius: '4px',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        whiteSpace: 'nowrap',
                                      }}
                                    >
                                      <CheckCircle2 size={13} /> Completed
                                    </span>
                                  ) : phase.status === 'In Progress' ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
                                      <span
                                        style={{
                                          fontSize: '0.72rem',
                                          fontWeight: 600,
                                          color: '#0f172a',
                                          backgroundColor: '#f8fafc',
                                          border: '1px solid var(--border-light)',
                                          padding: '2px 8px',
                                          borderRadius: '4px',
                                          whiteSpace: 'nowrap',
                                        }}
                                      >
                                        {phase.progress}% In Progress
                                      </span>
                                    </div>
                                  ) : (
                                    <span
                                      style={{
                                        fontSize: '0.72rem',
                                        color: 'var(--text-muted)',
                                        backgroundColor: '#f1f5f9',
                                        border: '1px solid var(--border-light)',
                                        padding: '2px 8px',
                                        borderRadius: '4px',
                                        whiteSpace: 'nowrap',
                                      }}
                                    >
                                      Pending
                                    </span>
                                  )}
                                </div>

                                {/* Deliverable Review & Approval Modal Trigger */}
                                <button
                                  type="button"
                                  onClick={() => setActiveDeliverablesModal({ project: prj, phase })}
                                  className="btn btn-secondary btn-sm"
                                  style={{
                                    gap: '6px',
                                    fontSize: '0.76rem',
                                    padding: '5px 12px',
                                    whiteSpace: 'nowrap',
                                  }}
                                  title="Review deliverables, post notices, and approve sections"
                                >
                                  <FileCheck size={14} />
                                  <span>Review Deliverables ({deliverableCount})</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </main>
      </div>

      {/* Phase Deliverables Modal */}
      {activeDeliverablesModal && (
        <PhaseDeliverablesModal
          isOpen={true}
          onClose={() => setActiveDeliverablesModal(null)}
          project={activeDeliverablesModal.project}
          phase={activeDeliverablesModal.phase}
        />
      )}

      {/* Project Team Assignment Modal */}
      {activeTeamModalProject && (
        <ProjectTeamModal
          isOpen={true}
          onClose={() => setActiveTeamModalProject(null)}
          project={activeTeamModalProject}
        />
      )}
    </div>
  );
}
