'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import DeliverablesReviewModal from '@/components/DeliverablesReviewModal';
import { useProjects } from '@/context/ProjectContext';
import { useAuth } from '@/context/AuthContext';
import {
  ArrowLeft,
  Users,
  Search,
  UserPlus,
  Trash2,
  CheckCircle2,
  Clock,
  Layers,
  Zap,
  Building2,
  Droplets,
  Compass,
  FileCheck2,
  Sparkles,
  Shield,
  FolderGit2,
} from 'lucide-react';
import { DisciplineType, ProjectPhase, User } from '@/types';

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resolvedParams = use(params);
  const projectId = resolvedParams.id;

  const {
    projects,
    assignMembersToProject,
    assignDivisionToProject,
    removeMemberFromProject,
    assignMembersToPhase,
  } = useProjects();
  const { usersList, isPM } = useAuth();

  const project = projects.find((p) => p.id === projectId);

  // Deliverables Review Modal State
  const [selectedPhase, setSelectedPhase] = useState<ProjectPhase | null>(null);
  const [isDeliverablesModalOpen, setIsDeliverablesModalOpen] = useState(false);
  const [modalInitialDiscipline, setModalInitialDiscipline] = useState<DisciplineType>('Electrical');

  // Member Search State
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [selectedPhaseForAssignment, setSelectedPhaseForAssignment] = useState<string | null>(null);

  // Check URL query params for direct phase review
  React.useEffect(() => {
    const phaseParam = searchParams.get('phase');
    if (phaseParam && project) {
      const foundPhase = project.phases.find((p) => p.id === phaseParam);
      if (foundPhase) {
        setSelectedPhase(foundPhase);
        setIsDeliverablesModalOpen(true);
      }
    }
  }, [searchParams, project]);

  if (!project) {
    return (
      <div className="app-container">
        <Sidebar />
        <div className="main-wrapper">
          <Navbar pageTitle="Project Not Found" />
          <main className="main-content" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Project Record Not Found
            </h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '6px', fontSize: '0.86rem' }}>
              The requested contract ID may have been deleted or archived.
            </p>
            <Link href="/projects" className="btn btn-primary" style={{ marginTop: '16px' }}>
              <ArrowLeft size={16} />
              <span>Back to Projects Directory</span>
            </Link>
          </main>
        </div>
      </div>
    );
  }

  // Assigned members objects
  const assignedMemberIds = project.assignedMemberIds || [];
  const assignedMembers = usersList.filter((u) => assignedMemberIds.includes(u.id));

  // Available members to add (not yet in project)
  const availableMembers = usersList.filter(
    (u) =>
      !assignedMemberIds.includes(u.id) &&
      (u.name.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
        u.title.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
        u.discipline.toLowerCase().includes(memberSearchQuery.toLowerCase()))
  );

  const getDisciplineIcon = (disc: DisciplineType | 'All') => {
    switch (disc) {
      case 'Electrical':
        return <Zap size={14} style={{ color: '#64748b' }} />;
      case 'Civil':
        return <Building2 size={14} style={{ color: '#64748b' }} />;
      case 'Plumbing':
        return <Droplets size={14} style={{ color: '#64748b' }} />;
      case 'Architectural':
        return <Compass size={14} style={{ color: '#64748b' }} />;
      default:
        return <Layers size={14} style={{ color: '#64748b' }} />;
    }
  };

  const openPhaseDeliverables = (phase: ProjectPhase, discipline: DisciplineType = 'Electrical') => {
    setSelectedPhase(phase);
    setModalInitialDiscipline(discipline);
    setIsDeliverablesModalOpen(true);
  };

  // Division counts
  const electricalTotal = usersList.filter((u) => u.discipline === 'Electrical').length;
  const civilTotal = usersList.filter((u) => u.discipline === 'Civil').length;
  const plumbingTotal = usersList.filter((u) => u.discipline === 'Plumbing').length;
  const archTotal = usersList.filter((u) => u.discipline === 'Architectural').length;

  return (
    <div className="app-container">
      <Sidebar />

      <div className="main-wrapper">
        <Navbar
          pageTitle={`${project.code} — Project Hub`}
          subtitle={`Client: ${project.client} • Lead PM: ${project.projectManager}`}
        />

        <main className="main-content">
          {/* Top Back Navigation Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <Link
              href="/projects"
              className="btn btn-secondary btn-sm"
              style={{ gap: '6px', fontWeight: 600 }}
            >
              <ArrowLeft size={15} />
              <span>Back to Projects Directory</span>
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  backgroundColor: '#f1f5f9',
                  color: '#334155',
                  padding: '3px 10px',
                  borderRadius: '4px',
                  border: '1px solid var(--border-light)',
                }}
              >
                {project.code}
              </span>
              <span
                className={`badge ${
                  project.status === 'Completed' ? 'badge-completed' : 'badge-progress'
                }`}
              >
                {project.status === 'Completed' && <CheckCircle2 size={12} style={{ color: '#166534' }} />}
                {project.status}
              </span>
            </div>
          </div>

          {/* Project Master Overview Card */}
          <div
            className="card"
            style={{
              marginBottom: '24px',
              padding: '24px 28px',
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-light)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: '16px',
                marginBottom: '16px',
              }}
            >
              <div>
                <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  {project.title}
                </h1>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Client: <strong style={{ color: 'var(--text-main)' }}>{project.client}</strong> • Location: <strong>{project.location}</strong>
                </p>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '6px', maxWidth: '780px', lineHeight: 1.5 }}>
                  {project.description}
                </p>
              </div>

              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Total Contract Budget
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {project.budget}
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                  Target Delivery: <strong>{project.targetCompletion}</strong>
                </div>
              </div>
            </div>

            {/* Read-Only Overall Progress Metric Bar */}
            <div
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                padding: '14px 18px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                alignItems: 'center',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '5px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Overall Project Completion</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{project.overallProgress}%</span>
                </div>
                <div className="progress-track" style={{ height: '7px' }}>
                  <div className="progress-fill" style={{ width: `${project.overallProgress}%` }} />
                </div>
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Tracked Milestones:{' '}
                <strong style={{ color: 'var(--text-main)' }}>
                  {project.phases.filter((p) => p.status === 'Completed').length} / {project.phases.length} Phases Finished
                </strong>
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Assigned Specialists:{' '}
                <strong style={{ color: 'var(--text-main)' }}>
                  {assignedMembers.length} Engineers on Contract
                </strong>
              </div>
            </div>
          </div>

          {/* Section 1: Multidisciplinary Team Roster & Fast Division Batch Add */}
          <div
            className="card"
            style={{
              marginBottom: '24px',
              padding: '24px',
              border: '1px solid var(--border-light)',
              backgroundColor: '#ffffff',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '14px',
                marginBottom: '16px',
                borderBottom: '1px solid var(--border-light)',
                paddingBottom: '14px',
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={18} style={{ color: '#0f172a' }} />
                  <span>Project Team & Division Assignment</span>
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Search engineers individually or assign entire multidisciplinary divisions in 1-click.
                </p>
              </div>

              {/* Fast Division Batch Add Buttons */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => assignDivisionToProject(project.id, 'Electrical')}
                  className="btn btn-secondary btn-sm"
                  style={{ gap: '5px', fontSize: '0.75rem' }}
                  title="Assign all Electrical engineers"
                >
                  <Zap size={13} style={{ color: '#64748b' }} />
                  <span>+ Add All Electrical ({electricalTotal})</span>
                </button>

                <button
                  type="button"
                  onClick={() => assignDivisionToProject(project.id, 'Civil')}
                  className="btn btn-secondary btn-sm"
                  style={{ gap: '5px', fontSize: '0.75rem' }}
                  title="Assign all Civil engineers"
                >
                  <Building2 size={13} style={{ color: '#64748b' }} />
                  <span>+ Add All Civil ({civilTotal})</span>
                </button>

                <button
                  type="button"
                  onClick={() => assignDivisionToProject(project.id, 'Plumbing')}
                  className="btn btn-secondary btn-sm"
                  style={{ gap: '5px', fontSize: '0.75rem' }}
                  title="Assign all Plumbing engineers"
                >
                  <Droplets size={13} style={{ color: '#64748b' }} />
                  <span>+ Add All Plumbing ({plumbingTotal})</span>
                </button>

                <button
                  type="button"
                  onClick={() => assignDivisionToProject(project.id, 'Architectural')}
                  className="btn btn-secondary btn-sm"
                  style={{ gap: '5px', fontSize: '0.75rem' }}
                  title="Assign all Architectural architects"
                >
                  <Compass size={13} style={{ color: '#64748b' }} />
                  <span>+ Add All Architecture ({archTotal})</span>
                </button>
              </div>
            </div>

            {/* Individual Search & Add Member */}
            <div style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-md)',
                    padding: '6px 12px',
                    maxWidth: '380px',
                    width: '100%',
                  }}
                >
                  <Search size={15} style={{ color: '#94a3b8' }} />
                  <input
                    type="text"
                    placeholder="Search engineer by name, role, or discipline..."
                    value={memberSearchQuery}
                    onChange={(e) => setMemberSearchQuery(e.target.value)}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      fontSize: '0.82rem',
                      width: '100%',
                      color: 'var(--text-main)',
                    }}
                  />
                </div>

                {memberSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setMemberSearchQuery('')}
                    style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}
                  >
                    Clear search
                  </button>
                )}
              </div>

              {/* Search Suggestions Dropdown */}
              {memberSearchQuery.trim() !== '' && (
                <div
                  style={{
                    marginTop: '8px',
                    backgroundColor: '#ffffff',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-md)',
                    padding: '8px',
                    maxHeight: '180px',
                    overflowY: 'auto',
                    boxShadow: 'var(--shadow-md)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  {availableMembers.length === 0 ? (
                    <div style={{ padding: '8px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      No matching team members found or all already assigned to this project.
                    </div>
                  ) : (
                    availableMembers.map((user) => (
                      <div
                        key={user.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '6px 10px',
                          borderRadius: '4px',
                          backgroundColor: '#f8fafc',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={user.avatar}
                            alt={user.name}
                            style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }}>
                            {user.name}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            ({user.discipline} — {user.title})
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            assignMembersToProject(project.id, [user.id]);
                            setMemberSearchQuery('');
                          }}
                          className="btn btn-primary btn-sm"
                          style={{ fontSize: '0.72rem', padding: '3px 8px', gap: '4px' }}
                        >
                          <UserPlus size={12} />
                          <span>Assign</span>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Currently Assigned Project Team Members Cards */}
            <div>
              <div style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px' }}>
                Active Project Specialists ({assignedMembers.length})
              </div>

              {assignedMembers.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                  No specialists assigned yet. Use the search or quick buttons above.
                </div>
              ) : (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                    gap: '10px',
                  }}
                >
                  {assignedMembers.map((member) => (
                    <div
                      key={member.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        backgroundColor: '#f8fafc',
                        border: '1px solid var(--border-light)',
                        borderRadius: 'var(--radius-md)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={member.avatar}
                          alt={member.name}
                          style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                        />
                        <div style={{ minWidth: 0, lineHeight: 1.2 }}>
                          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {member.name}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            {getDisciplineIcon(member.discipline)}
                            <span>{member.discipline}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeMemberFromProject(project.id, member.id)}
                        style={{ color: '#94a3b8', padding: '4px', borderRadius: '4px' }}
                        title="Remove from project"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Multidisciplinary Phases & Deliverables Tracker */}
          <div
            className="card"
            style={{
              padding: '24px',
              border: '1px solid var(--border-light)',
              backgroundColor: '#ffffff',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
                marginBottom: '18px',
                borderBottom: '1px solid var(--border-light)',
                paddingBottom: '14px',
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                  Multidisciplinary Phase Schedule & Deliverables
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Progress updates automatically when sections are reviewed and completed by the Project Manager.
                </p>
              </div>

              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                Total: <strong>{project.phases.length} Phases Configured</strong>
              </div>
            </div>

            {/* Phases List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {project.phases.map((phase) => {
                const sectionComp = phase.sectionCompletion || {
                  Electrical: false,
                  Civil: false,
                  Plumbing: false,
                  Architectural: false,
                };

                const phaseDeliverables = phase.deliverableItems || [];
                const phaseAssignedIds = phase.assignedMemberIds || [];
                const phaseAssignedUsers = usersList.filter((u) => phaseAssignedIds.includes(u.id));

                return (
                  <div
                    key={phase.id}
                    style={{
                      border: '1px solid var(--border-light)',
                      borderRadius: 'var(--radius-lg)',
                      backgroundColor: '#ffffff',
                      boxShadow: 'var(--shadow-sm)',
                      padding: '18px 20px',
                    }}
                  >
                    {/* Header Row */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        flexWrap: 'wrap',
                        gap: '12px',
                        marginBottom: '12px',
                      }}
                    >
                      <div style={{ maxWidth: '70%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                          <span
                            style={{
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              backgroundColor: '#f1f5f9',
                              color: '#334155',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              border: '1px solid var(--border-light)',
                            }}
                          >
                            Phase {phase.phaseNumber}
                          </span>
                          <span className="badge badge-subtle">
                            {getDisciplineIcon(phase.assignedSection)} {phase.assignedSection} Lead
                          </span>
                          <h4 style={{ fontSize: '1.02rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                            {phase.name}
                          </h4>
                          {phase.critical && (
                            <span
                              style={{
                                fontSize: '0.68rem',
                                fontWeight: 700,
                                color: '#991b1b',
                                backgroundColor: '#fef2f2',
                                border: '1px solid #fecaca',
                                padding: '1px 6px',
                                borderRadius: '4px',
                              }}
                            >
                              Critical Path
                            </span>
                          )}
                        </div>

                        <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                          <span>Lead Engineer: <strong>{phase.leadPerson}</strong></span>
                          <span>Timeline: {phase.startDate} to <strong>{phase.deadline}</strong></span>
                        </div>
                      </div>

                      {/* Read-Only Phase Progress Status */}
                      <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span
                            className={`badge ${
                              phase.status === 'Completed'
                                ? 'badge-completed'
                                : phase.status === 'In Progress'
                                ? 'badge-progress'
                                : 'badge-pending'
                            }`}
                          >
                            {phase.status === 'Completed' && <CheckCircle2 size={12} style={{ color: '#166534' }} />}
                            {phase.status}
                          </span>
                          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>
                            {phase.progress}%
                          </span>
                        </div>
                        <div className="progress-track" style={{ width: '110px' }}>
                          <div className="progress-fill" style={{ width: `${phase.progress}%` }} />
                        </div>
                      </div>
                    </div>

                    {/* Section Approvals Overview & Deliverable Inspector Trigger */}
                    <div
                      style={{
                        backgroundColor: '#f8fafc',
                        border: '1px solid var(--border-light)',
                        borderRadius: 'var(--radius-md)',
                        padding: '12px 14px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '12px',
                      }}
                    >
                      {/* 4 Section Status Badges */}
                      <div>
                        <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                          4 Disciplines Review Status
                        </div>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {(['Electrical', 'Civil', 'Plumbing', 'Architectural'] as const).map((disc) => {
                            const isDone = sectionComp[disc];
                            return (
                              <button
                                key={disc}
                                type="button"
                                onClick={() => openPhaseDeliverables(phase, disc)}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  fontSize: '0.72rem',
                                  fontWeight: 600,
                                  padding: '3px 8px',
                                  borderRadius: '4px',
                                  backgroundColor: isDone ? '#f0fdf4' : '#ffffff',
                                  color: isDone ? '#166534' : '#64748b',
                                  border: `1px solid ${isDone ? '#bbf7d0' : 'var(--border-light)'}`,
                                  cursor: 'pointer',
                                }}
                                title={`Click to review ${disc} deliverables`}
                              >
                                {getDisciplineIcon(disc)}
                                <span>{disc}: {isDone ? '✓ Approved' : 'Pending'}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Main Button to Open Deliverables Pop-up Modal */}
                      <button
                        type="button"
                        onClick={() => openPhaseDeliverables(phase)}
                        className="btn btn-primary btn-sm"
                        style={{ gap: '6px', fontWeight: 600 }}
                      >
                        <FileCheck2 size={15} />
                        <span>Inspect Deliverables & Review ({phaseDeliverables.length})</span>
                      </button>
                    </div>

                    {/* Phase Task Assigned Persons */}
                    <div
                      style={{
                        marginTop: '10px',
                        paddingTop: '10px',
                        borderTop: '1px solid var(--border-light)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '8px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                          Assigned to this Phase:
                        </span>
                        {phaseAssignedUsers.length === 0 ? (
                          <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontStyle: 'italic' }}>
                            None assigned yet
                          </span>
                        ) : (
                          phaseAssignedUsers.map((u) => (
                            <span
                              key={u.id}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                backgroundColor: '#f1f5f9',
                                border: '1px solid var(--border-light)',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                fontSize: '0.72rem',
                                fontWeight: 500,
                              }}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={u.avatar} alt="" style={{ width: '15px', height: '15px', borderRadius: '50%' }} />
                              <span>{u.name}</span>
                              {isPM && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    assignMembersToPhase(
                                      project.id,
                                      phase.id,
                                      phaseAssignedIds.filter((id) => id !== u.id)
                                    );
                                  }}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '0 2px',
                                    color: '#94a3b8',
                                    fontSize: '0.8rem',
                                    lineHeight: 1,
                                    fontWeight: 700,
                                  }}
                                  title={`Remove ${u.name} from this phase`}
                                >
                                  ×
                                </button>
                              )}
                            </span>
                          ))
                        )}
                      </div>

                      {/* Quick Phase Member Assignment Selector */}
                      {isPM && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <select
                            className="select-input"
                            style={{ fontSize: '0.72rem', padding: '3px 8px', width: 'auto' }}
                            value=""
                            onChange={(e) => {
                              const newMemberId = e.target.value;
                              if (!newMemberId) return;
                              if (!phaseAssignedIds.includes(newMemberId)) {
                                assignMembersToPhase(project.id, phase.id, [...phaseAssignedIds, newMemberId]);
                                if (!assignedMemberIds.includes(newMemberId)) {
                                  assignMembersToProject(project.id, [newMemberId]);
                                }
                              }
                            }}
                          >
                            <option value="">+ Assign Specialist to Phase Tasks...</option>
                            {(assignedMembers.length > 0 ? assignedMembers : usersList)
                              .filter((m) => !phaseAssignedIds.includes(m.id))
                              .map((m) => (
                                <option key={m.id} value={m.id}>
                                  {m.name} ({m.discipline} — {m.title})
                                </option>
                              ))}
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>

      {/* Multidisciplinary Deliverables Review Pop-up Modal */}
      {selectedPhase && (
        <DeliverablesReviewModal
          isOpen={isDeliverablesModalOpen}
          onClose={() => setIsDeliverablesModalOpen(false)}
          project={project}
          phase={selectedPhase}
          initialDiscipline={modalInitialDiscipline}
        />
      )}
    </div>
  );
}
