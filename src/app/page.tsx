'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import DeadlinesAlertBanner from '@/components/DeadlinesAlertBanner';
import DeadlinesTable from '@/components/DeadlinesTable';
import FileUploadModal from '@/components/FileUploadModal';
import { useAuth } from '@/context/AuthContext';
import { useProjects } from '@/context/ProjectContext';
import { useCommunication } from '@/context/CommunicationContext';
import {
  FolderGit2,
  FolderPlus,
  Clock,
  CheckCircle2,
  ArrowRight,
  UploadCloud,
  MessageSquare,
  Building2,
  Zap,
  Droplets,
  Compass,
  Download,
  Layers,
  Users,
  Award,
  ShieldCheck,
  Send,
  AlertTriangle,
  FileCheck2,
  Check,
  Briefcase,
} from 'lucide-react';
import { DisciplineType, ProjectPhase, PhaseDeliverableItem } from '@/types';
import DG5SplashIntro from '@/components/DG5SplashIntro';

export default function DashboardPage() {
  const { currentUser, isPM, isHOD, isMember, usersList } = useAuth();
  const {
    projects,
    totalStats,
    urgentDeadlines,
    markSectionCompleted,
    addDeliverableComment,
  } = useProjects();
  const { sharedFiles, triggerFileDownload, sendMessage, getMessagesByDiscipline } =
    useCommunication();

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // HOD state
  const [hodNoticeText, setHodNoticeText] = useState('');
  const [hodRecipient, setHodRecipient] = useState<'team' | 'pm'>('team');
  const [hodSuccessMsg, setHodSuccessMsg] = useState<string | null>(null);
  const [delFeedbackInputs, setDelFeedbackInputs] = useState<{ [delId: string]: string }>({});

  // Member state
  const [memberMsgText, setMemberMsgText] = useState('');
  const [memberSuccessMsg, setMemberSuccessMsg] = useState<string | null>(null);

  const userDiscipline: DisciplineType =
    (currentUser?.discipline as DisciplineType) || 'Electrical';

  const getDisciplineIcon = (disc: DisciplineType | 'Management' | 'All') => {
    switch (disc) {
      case 'Electrical':
        return <Zap size={14} style={{ color: '#64748b', flexShrink: 0 }} />;
      case 'Civil':
        return <Building2 size={14} style={{ color: '#64748b', flexShrink: 0 }} />;
      case 'Plumbing':
        return <Droplets size={14} style={{ color: '#64748b', flexShrink: 0 }} />;
      case 'Architectural':
        return <Compass size={14} style={{ color: '#64748b', flexShrink: 0 }} />;
      default:
        return <Layers size={14} style={{ color: '#64748b', flexShrink: 0 }} />;
    }
  };

  // Division team members for HOD
  const departmentTeamMembers = usersList.filter(
    (u) => u.discipline === userDiscipline && u.role === 'employee'
  );

  // Department Head user for normal team member
  const departmentHeadUser = usersList.find(
    (u) => u.discipline === userDiscipline && u.role === 'hod'
  );

  // Collect all phases in this discipline across all projects
  const departmentPhases: {
    projectId: string;
    projectCode: string;
    projectTitle: string;
    phase: ProjectPhase;
  }[] = [];

  // Collect all deliverables in this discipline
  const departmentDeliverables: {
    projectId: string;
    projectCode: string;
    phaseId: string;
    phaseName: string;
    item: PhaseDeliverableItem;
  }[] = [];

  projects.forEach((prj) => {
    prj.phases.forEach((ph) => {
      // Check if phase is assigned to this discipline or has deliverables for this discipline
      const hasDisciplineDeliverables = (ph.deliverableItems || []).some(
        (del) => del.discipline === userDiscipline
      );
      if (ph.assignedSection === userDiscipline || hasDisciplineDeliverables) {
        departmentPhases.push({
          projectId: prj.id,
          projectCode: prj.code,
          projectTitle: prj.title,
          phase: ph,
        });
      }

      (ph.deliverableItems || []).forEach((item) => {
        if (item.discipline === userDiscipline) {
          departmentDeliverables.push({
            projectId: prj.id,
            projectCode: prj.code,
            phaseId: ph.id,
            phaseName: ph.name,
            item,
          });
        }
      });
    });
  });

  const ongoingDeptPhases = departmentPhases.filter((dp) => dp.phase.status !== 'Completed');
  const completedDeptPhases = departmentPhases.filter((dp) => dp.phase.status === 'Completed');

  // Phases assigned to current member
  const memberAssignedPhases = departmentPhases.filter(
    (dp) =>
      dp.phase.assignedMemberIds?.includes(currentUser?.id || '') ||
      dp.phase.assignedSection === userDiscipline
  );

  // HOD send notice or message
  const handleHodSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hodNoticeText.trim()) return;

    if (hodRecipient === 'team') {
      sendMessage(
        userDiscipline,
        `[HOD Special Notice]: ${hodNoticeText.trim()}`,
        true
      );
      setHodSuccessMsg(`Special notice broadcast to all ${userDiscipline} team members.`);
    } else {
      sendMessage(
        userDiscipline,
        `[HOD to PM Memo - ${currentUser?.name}]: ${hodNoticeText.trim()}`,
        false
      );
      setHodSuccessMsg('Formal memorandum delivered to Project Manager (Arch. Samantha Reed).');
    }

    setHodNoticeText('');
    setTimeout(() => setHodSuccessMsg(null), 3000);
  };

  // Member send message to HOD
  const handleMemberSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberMsgText.trim()) return;

    sendMessage(
      userDiscipline,
      `[${currentUser?.title} - ${currentUser?.name}]: ${memberMsgText.trim()}`,
      false
    );
    setMemberMsgText('');
    setMemberSuccessMsg(`Message sent to Department Head (${departmentHeadUser?.name || 'HOD'}) & team.`);
    setTimeout(() => setMemberSuccessMsg(null), 3000);
  };

  // HOD Deliverable Feedback
  const handleDeliverableFeedback = (
    projectId: string,
    phaseId: string,
    deliverableId: string,
    authorName: string,
    isMistakeNotice = false
  ) => {
    const feedback = delFeedbackInputs[deliverableId]?.trim();
    if (!feedback) return;

    addDeliverableComment(projectId, phaseId, deliverableId, feedback, isMistakeNotice);
    setDelFeedbackInputs({ ...delFeedbackInputs, [deliverableId]: '' });
    setHodSuccessMsg(
      isMistakeNotice
        ? `Revision notice & correction instructions issued to ${authorName}.`
        : `Technical feedback posted for ${authorName}.`
    );
    setTimeout(() => setHodSuccessMsg(null), 3000);
  };

  // HOD Mark Section as completed
  const handleHodApproveSection = (projectId: string, phaseId: string) => {
    markSectionCompleted(projectId, phaseId, userDiscipline, true);
    setHodSuccessMsg(`Approved and certified ${userDiscipline} section for this phase milestone.`);
    setTimeout(() => setHodSuccessMsg(null), 3000);
  };

  // Discipline messages
  const recentMessages = getMessagesByDiscipline(userDiscipline).slice(0, 4);

  return (
    <div className="app-container">
      <DG5SplashIntro />
      <Sidebar />

      <div className="main-wrapper">
        <Navbar
          pageTitle={
            isPM
              ? 'Project Manager Master Dashboard'
              : isHOD
              ? `${userDiscipline} Department Head & Lead Portal`
              : `${userDiscipline} Team Member Specialist Workspace`
          }
          subtitle={`Welcome, ${currentUser?.name || 'Engineer'} • The Design Group Five International`}
        />

        <main className="main-content">
          <DeadlinesAlertBanner />

          {/* Toast Notification */}
          {(hodSuccessMsg || memberSuccessMsg) && (
            <div
              style={{
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                color: '#166534',
                padding: '10px 16px',
                borderRadius: '8px',
                marginBottom: '18px',
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 600,
              }}
            >
              <CheckCircle2 size={16} />
              <span>{hodSuccessMsg || memberSuccessMsg}</span>
            </div>
          )}

          {/* ============================================================== */}
          {/* 1. PROJECT MANAGER DASHBOARD VIEW */}
          {/* ============================================================== */}
          {isPM && (
            <>
              {/* PM Header Banner */}
              <div
                className="card"
                style={{
                  marginBottom: '24px',
                  padding: '24px 28px',
                  backgroundColor: '#ffffff',
                  color: 'var(--text-main)',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '20px',
                  border: '1px solid var(--border-light)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        backgroundColor: '#f1f5f9',
                        color: '#334155',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        padding: '2px 10px',
                        borderRadius: '9999px',
                        border: '1px solid var(--border-light)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Project Manager Control Panel
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                      • Colombo HQ & Multidisciplinary Portfolio
                    </span>
                  </div>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                    Master Project Portfolio & Milestone Tracker
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', marginTop: '4px', maxWidth: '680px', lineHeight: 1.5 }}>
                    Monitor progress across all 4 engineering disciplines. When phases or projects complete, notifications route exclusively to you.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <Link href="/projects/new" className="btn btn-primary" style={{ gap: '8px', fontWeight: 600 }}>
                    <FolderPlus size={16} />
                    <span>Add New Project & Phases</span>
                  </Link>
                  <Link href="/projects" className="btn btn-secondary" style={{ gap: '8px', fontWeight: 600 }}>
                    <FolderGit2 size={16} />
                    <span>Projects Directory</span>
                  </Link>
                </div>
              </div>

              {/* KPI Stats */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '16px',
                  marginBottom: '24px',
                }}
              >
                <div className="card" style={{ padding: '20px', border: '1px solid var(--border-light)', backgroundColor: '#ffffff' }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Active Contracts
                  </div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
                    {totalStats.activeProjects}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                    Total {totalStats.totalProjects} contracts
                  </div>
                </div>

                <div className="card" style={{ padding: '20px', border: '1px solid var(--border-light)', backgroundColor: '#ffffff' }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Upcoming Deadlines
                  </div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
                    {urgentDeadlines.length}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                    Due within 10 days
                  </div>
                </div>

                <div className="card" style={{ padding: '20px', border: '1px solid var(--border-light)', backgroundColor: '#ffffff' }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Completed Phases
                  </div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
                    {totalStats.completedPhases} / {totalStats.totalPhases}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                    Automatic progress calculation
                  </div>
                </div>

                <div className="card" style={{ padding: '20px', border: '1px solid var(--border-light)', backgroundColor: '#ffffff' }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Active Disciplines
                  </div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
                    4 Sections
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                    Electrical • Civil • Plumbing • Arch
                  </div>
                </div>
              </div>

              {/* Master Deadlines Schedule */}
              <div style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.18rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      All Project Deadlines & Phase Milestones
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Live delivery milestones tracked across all active contracts
                    </p>
                  </div>
                  <Link href="/deadlines" className="btn btn-secondary btn-sm" style={{ gap: '6px' }}>
                    <span>Full Timeline</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
                <DeadlinesTable initialDiscipline="All" showFilters={true} />
              </div>

              {/* Active Projects Grid */}
              <div style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.18rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      Active Projects & Deliverables ({projects.length})
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Click any project to inspect phase deliverables or assign team members
                    </p>
                  </div>
                  <Link href="/projects" className="btn btn-secondary btn-sm" style={{ gap: '6px' }}>
                    <span>View Projects Directory</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '18px' }}>
                  {projects.slice(0, 3).map((prj) => (
                    <div key={prj.id} className="card card-interactive" style={{ padding: '22px', border: '1px solid var(--border-light)', backgroundColor: '#ffffff' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 600, backgroundColor: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--border-light)' }}>
                          {prj.code}
                        </span>
                        <span className="badge badge-progress">{prj.status}</span>
                      </div>

                      <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '3px' }}>
                        <Link href={`/projects/${prj.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          {prj.title}
                        </Link>
                      </h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                        Client: <strong style={{ color: 'var(--text-secondary)' }}>{prj.client}</strong> • {prj.location}
                      </p>

                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', marginBottom: '5px' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Overall Progress</span>
                          <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{prj.overallProgress}%</span>
                        </div>
                        <div className="progress-track">
                          <div className="progress-fill" style={{ width: `${prj.overallProgress}%` }} />
                        </div>
                      </div>

                      <Link href={`/projects/${prj.id}`} className="btn btn-primary btn-sm" style={{ width: '100%', gap: '6px' }}>
                        <span>Open Project Hub & Review Deliverables</span>
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ============================================================== */}
          {/* 2. DEPARTMENT HEAD / TEAM LEAD (HOD) DASHBOARD VIEW */}
          {/* ============================================================== */}
          {isHOD && (
            <>
              {/* HOD Header Banner */}
              <div
                className="card"
                style={{
                  marginBottom: '24px',
                  padding: '24px 28px',
                  backgroundColor: '#ffffff',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '20px',
                  border: '1px solid var(--border-light)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        backgroundColor: '#e0f2fe',
                        color: '#0369a1',
                        border: '1px solid #bae6fd',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        padding: '2px 10px',
                        borderRadius: '9999px',
                      }}
                    >
                      Department Head & Team Lead Command Center
                    </span>
                    <span className="badge badge-subtle">{userDiscipline} Division</span>
                  </div>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                    {currentUser?.title}
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', marginTop: '4px', maxWidth: '720px', lineHeight: 1.5 }}>
                    Manage your team members, track ongoing & completed project phases, review and approve submitted deliverables, issue revision notices, and coordinate with the Project Manager.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="btn btn-primary"
                    style={{ gap: '8px', fontWeight: 600 }}
                  >
                    <UploadCloud size={16} />
                    <span>Upload Division Drawing</span>
                  </button>
                  <Link href="/disciplines" className="btn btn-secondary" style={{ gap: '8px', fontWeight: 600 }}>
                    <MessageSquare size={16} />
                    <span>Open Section Hub</span>
                  </Link>
                </div>
              </div>

              {/* HOD Grid: Section 1 (Team Members & Workloads) + Section 2 (Ongoing & Completed Phases) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1fr) minmax(340px, 1.4fr)', gap: '20px', marginBottom: '28px' }}>
                {/* Section 1: Department Team Members & Assigned Tasks */}
                <div
                  className="card"
                  style={{
                    padding: '22px',
                    border: '1px solid var(--border-light)',
                    backgroundColor: '#ffffff',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px' }}>
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Users size={16} style={{ color: '#0f172a' }} />
                        <span>Department Team Roster ({departmentTeamMembers.length})</span>
                      </h3>
                      <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Engineers & Specialists in {userDiscipline}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {departmentTeamMembers.map((member) => {
                      // Find phases assigned to this member
                      const memberPhases = departmentPhases.filter((dp) =>
                        dp.phase.assignedMemberIds?.includes(member.id)
                      );
                      const completedCount = memberPhases.filter((mp) => mp.phase.status === 'Completed').length;

                      return (
                        <div
                          key={member.id}
                          style={{
                            padding: '12px 14px',
                            backgroundColor: '#f8fafc',
                            border: '1px solid var(--border-light)',
                            borderRadius: 'var(--radius-md)',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={member.avatar}
                              alt={member.name}
                              style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-main)' }}>
                                {member.name}
                              </div>
                              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                                {member.title}
                              </div>
                            </div>
                            <span
                              style={{
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                padding: '2px 8px',
                                borderRadius: '4px',
                                backgroundColor: memberPhases.length > 0 ? '#f0fdf4' : '#f1f5f9',
                                color: memberPhases.length > 0 ? '#166534' : '#64748b',
                              }}
                            >
                              {memberPhases.length} Phases Assigned
                            </span>
                          </div>

                          {/* Member Assigned Project Phases */}
                          <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                            {memberPhases.length === 0 ? (
                              <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>
                                Available for new project assignment
                              </span>
                            ) : (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                {memberPhases.map((mp) => (
                                  <div
                                    key={mp.phase.id}
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      alignItems: 'center',
                                      backgroundColor: '#ffffff',
                                      padding: '4px 8px',
                                      borderRadius: '4px',
                                      border: '1px solid var(--border-light)',
                                    }}
                                  >
                                    <span style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.72rem' }}>
                                      {mp.projectCode} • P{mp.phase.phaseNumber}
                                    </span>
                                    <span
                                      className={`badge ${
                                        mp.phase.status === 'Completed' ? 'badge-completed' : 'badge-progress'
                                      }`}
                                      style={{ fontSize: '0.65rem', padding: '1px 6px' }}
                                    >
                                      {mp.phase.status} ({mp.phase.progress}%)
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Section 2: Ongoing & Completed Department Project Phases */}
                <div
                  className="card"
                  style={{
                    padding: '22px',
                    border: '1px solid var(--border-light)',
                    backgroundColor: '#ffffff',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px' }}>
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Briefcase size={16} style={{ color: '#0f172a' }} />
                        <span>{userDiscipline} Project Phases & Progress</span>
                      </h3>
                      <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {ongoingDeptPhases.length} Ongoing • {completedDeptPhases.length} Completed
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '420px', overflowY: 'auto' }}>
                    {departmentPhases.map((dp) => {
                      const isComplete = dp.phase.status === 'Completed';
                      const assignedUsers = usersList.filter((u) =>
                        dp.phase.assignedMemberIds?.includes(u.id)
                      );

                      return (
                        <div
                          key={dp.phase.id}
                          style={{
                            padding: '12px 14px',
                            backgroundColor: isComplete ? '#f0fdf4' : '#ffffff',
                            border: `1px solid ${isComplete ? '#bbf7d0' : 'var(--border-light)'}`,
                            borderRadius: 'var(--radius-md)',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ fontSize: '0.68rem', fontWeight: 700, backgroundColor: '#f1f5f9', color: '#334155', padding: '1px 6px', borderRadius: '4px' }}>
                                  {dp.projectCode}
                                </span>
                                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)' }}>
                                  P{dp.phase.phaseNumber}: {dp.phase.name}
                                </span>
                              </div>
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                Contract: {dp.projectTitle} • Deadline: <strong>{dp.phase.deadline}</strong>
                              </div>
                            </div>

                            <span
                              className={`badge ${isComplete ? 'badge-completed' : 'badge-progress'}`}
                              style={{ fontSize: '0.68rem' }}
                            >
                              {isComplete && <Check size={11} />} {dp.phase.status} ({dp.phase.progress}%)
                            </span>
                          </div>

                          {/* Progress bar */}
                          <div className="progress-track" style={{ height: '5px', marginBottom: '8px' }}>
                            <div className="progress-fill" style={{ width: `${dp.phase.progress}%` }} />
                          </div>

                          {/* Assigned team members */}
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                              <span>Assigned:</span>
                              {assignedUsers.length === 0 ? (
                                <span style={{ fontStyle: 'italic', color: '#94a3b8' }}>Unassigned</span>
                              ) : (
                                assignedUsers.map((u) => (
                                  <span key={u.id} style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', backgroundColor: '#f8fafc', border: '1px solid var(--border-light)', padding: '1px 5px', borderRadius: '4px', fontWeight: 500 }}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={u.avatar} alt="" style={{ width: '12px', height: '12px', borderRadius: '50%' }} />
                                    <span>{u.name.split(' ')[0]} {u.name.split(' ')[1]}</span>
                                  </span>
                                ))
                              )}
                            </div>

                            <Link
                              href={`/projects/${dp.projectId}?phase=${dp.phase.id}`}
                              style={{ fontSize: '0.72rem', color: '#0f172a', fontWeight: 600, textDecoration: 'underline' }}
                            >
                              Inspect Deliverables →
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Section 3: Review Works, Approve Deliverables & Report Mistakes */}
              <div
                className="card"
                style={{
                  padding: '24px',
                  border: '1px solid var(--border-light)',
                  backgroundColor: '#ffffff',
                  marginBottom: '28px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileCheck2 size={18} style={{ color: '#0f172a' }} />
                      <span>{userDiscipline} Deliverables Review & Approval Hub</span>
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Review team member drawings, approve certified works, or leave feedback and report mistakes for revision.
                    </p>
                  </div>
                  <span className="badge badge-subtle">{departmentDeliverables.length} Submissions</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {departmentDeliverables.length === 0 ? (
                    <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                      No deliverables submitted under {userDiscipline} yet.
                    </div>
                  ) : (
                    departmentDeliverables.map(({ projectId, projectCode, phaseId, phaseName, item }) => (
                      <div
                        key={item.id}
                        style={{
                          border: '1px solid var(--border-light)',
                          borderRadius: 'var(--radius-md)',
                          padding: '16px 18px',
                          backgroundColor: item.status === 'Approved' ? '#f0fdf4' : '#ffffff',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '10px' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                              <span style={{ fontSize: '0.7rem', fontWeight: 700, backgroundColor: '#f1f5f9', color: '#334155', padding: '1px 6px', borderRadius: '4px' }}>
                                {projectCode} • {phaseName}
                              </span>
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                {item.version}
                              </span>
                              <span
                                className={`badge ${
                                  item.status === 'Approved'
                                    ? 'badge-completed'
                                    : item.status === 'Needs Revision'
                                    ? 'badge-pending'
                                    : 'badge-progress'
                                }`}
                                style={{ fontSize: '0.68rem' }}
                              >
                                {item.status}
                              </span>
                            </div>
                            <h4 style={{ fontSize: '0.96rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                              {item.name}
                            </h4>
                            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                              File: <strong>{item.fileName}</strong> ({item.fileSize}) • Published on {item.uploadDate} by <strong>{item.uploadedBy.name}</strong> ({item.uploadedBy.title})
                            </div>
                          </div>

                          {/* Quick Actions */}
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <button
                              type="button"
                              onClick={() =>
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
                                  projectId,
                                  projectTitle: projectCode,
                                  notes: `Submitted by ${item.uploadedBy.name}`,
                                  downloadsCount: 1,
                                })
                              }
                              className="btn btn-secondary btn-sm"
                              style={{ gap: '5px', fontSize: '0.74rem' }}
                            >
                              <Download size={13} />
                              <span>Download Drawing</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleHodApproveSection(projectId, phaseId)}
                              className="btn btn-primary btn-sm"
                              style={{ gap: '5px', fontSize: '0.74rem' }}
                            >
                              <ShieldCheck size={13} />
                              <span>{item.status === 'Approved' ? 'Re-Approve Section' : 'Approve Work & Certify'}</span>
                            </button>
                          </div>
                        </div>

                        {/* Existing comments history */}
                        {item.comments && item.comments.length > 0 && (
                          <div style={{ backgroundColor: '#f8fafc', padding: '8px 12px', borderRadius: '6px', marginBottom: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {item.comments.map((cmt) => (
                              <div key={cmt.id} style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                                <strong style={{ color: 'var(--text-main)' }}>{cmt.authorName}:</strong> {cmt.content}{' '}
                                <span style={{ color: '#94a3b8', fontSize: '0.68rem' }}>({cmt.timestamp})</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* HOD Feedback / Mistakes Input */}
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '8px' }}>
                          <input
                            type="text"
                            className="input-text"
                            placeholder="Type feedback, specify corrections, or report mistakes..."
                            style={{ fontSize: '0.76rem', padding: '5px 10px' }}
                            value={delFeedbackInputs[item.id] || ''}
                            onChange={(e) =>
                              setDelFeedbackInputs({ ...delFeedbackInputs, [item.id]: e.target.value })
                            }
                          />
                          <button
                            type="button"
                            onClick={() =>
                              handleDeliverableFeedback(
                                projectId,
                                phaseId,
                                item.id,
                                item.uploadedBy.name,
                                false
                              )
                            }
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '0.72rem', whiteSpace: 'nowrap' }}
                          >
                            Post Feedback
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleDeliverableFeedback(
                                projectId,
                                phaseId,
                                item.id,
                                item.uploadedBy.name,
                                true
                              )
                            }
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '0.72rem', whiteSpace: 'nowrap', color: '#991b1b', borderColor: '#fecaca' }}
                            title="Flag technical mistake and require engineer to update drawing"
                          >
                            Flag Mistake & Require Revision
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Section 4: Fast Communication & Special Notices Panel */}
              <div
                className="card"
                style={{
                  padding: '24px',
                  border: '1px solid var(--border-light)',
                  backgroundColor: '#ffffff',
                  marginBottom: '28px',
                }}
              >
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MessageSquare size={18} style={{ color: '#0f172a' }} />
                  <span>Send Special Notice / Communicate with PM & Team</span>
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                  Issue an official announcement to your engineers or dispatch an update directly to Project Manager Arch. Samantha Reed.
                </p>

                <form onSubmit={handleHodSendMessage} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      Target Recipient:
                    </label>
                    <button
                      type="button"
                      onClick={() => setHodRecipient('team')}
                      style={{
                        padding: '4px 12px',
                        borderRadius: '4px',
                        fontSize: '0.74rem',
                        fontWeight: hodRecipient === 'team' ? 700 : 500,
                        backgroundColor: hodRecipient === 'team' ? '#0f172a' : '#f1f5f9',
                        color: hodRecipient === 'team' ? '#ffffff' : '#334155',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      Broadcast to {userDiscipline} Team
                    </button>
                    <button
                      type="button"
                      onClick={() => setHodRecipient('pm')}
                      style={{
                        padding: '4px 12px',
                        borderRadius: '4px',
                        fontSize: '0.74rem',
                        fontWeight: hodRecipient === 'pm' ? 700 : 500,
                        backgroundColor: hodRecipient === 'pm' ? '#0f172a' : '#f1f5f9',
                        color: hodRecipient === 'pm' ? '#ffffff' : '#334155',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      Direct Message to Project Manager (PM)
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                      type="text"
                      className="input-text"
                      placeholder={
                        hodRecipient === 'team'
                          ? `Write a special notice for all ${userDiscipline} specialists...`
                          : 'Write an update memorandum for the Project Manager...'
                      }
                      value={hodNoticeText}
                      onChange={(e) => setHodNoticeText(e.target.value)}
                      required
                    />
                    <button type="submit" className="btn btn-primary" style={{ gap: '6px', whiteSpace: 'nowrap' }}>
                      <Send size={14} />
                      <span>{hodRecipient === 'team' ? 'Post Notice' : 'Send to PM'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}

          {/* ============================================================== */}
          {/* 3. NORMAL TEAM MEMBER / WORKER DASHBOARD VIEW */}
          {/* ============================================================== */}
          {isMember && (
            <>
              {/* Member Header Banner */}
              <div
                className="card"
                style={{
                  marginBottom: '24px',
                  padding: '24px 28px',
                  backgroundColor: '#ffffff',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '20px',
                  border: '1px solid var(--border-light)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        backgroundColor: '#f1f5f9',
                        color: '#334155',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        padding: '2px 10px',
                        borderRadius: '9999px',
                        border: '1px solid var(--border-light)',
                      }}
                    >
                      Team Member Specialist Workspace
                    </span>
                    <span className="badge badge-subtle">{userDiscipline} Division</span>
                    {departmentHeadUser && (
                      <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                        • Lead HOD: <strong>{departmentHeadUser.name}</strong>
                      </span>
                    )}
                  </div>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                    {currentUser?.name} — {currentUser?.title}
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', marginTop: '4px', maxWidth: '700px', lineHeight: 1.5 }}>
                    Track your sequentially assigned project phases, upload your CAD drawings and calculation deliverables, and communicate directly with your Department Head.
                  </p>
                </div>

                {/* Primary CTA: Upload Assigned Deliverables */}
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="btn btn-primary"
                    style={{ gap: '8px', fontWeight: 600, padding: '10px 18px' }}
                  >
                    <UploadCloud size={16} />
                    <span>Upload Assigned Deliverable</span>
                  </button>
                  <Link href="/disciplines" className="btn btn-secondary" style={{ gap: '8px', fontWeight: 600 }}>
                    <MessageSquare size={16} />
                    <span>Division Channel</span>
                  </Link>
                </div>
              </div>

              {/* Section 1: Sequential Project Phases Roadmap */}
              <div
                className="card"
                style={{
                  padding: '24px',
                  border: '1px solid var(--border-light)',
                  backgroundColor: '#ffffff',
                  marginBottom: '28px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Briefcase size={18} style={{ color: '#0f172a' }} />
                      <span>My Assigned Projects & Sequential Phase Roadmap</span>
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Phase tasks assigned to you across active contracts, arranged sequentially.
                    </p>
                  </div>
                  <span className="badge badge-subtle">{memberAssignedPhases.length} Active Milestones</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {memberAssignedPhases.map(({ projectId, projectCode, projectTitle, phase }, idx) => {
                    const isDone = phase.status === 'Completed';

                    return (
                      <div
                        key={phase.id}
                        style={{
                          border: `1px solid ${isDone ? '#bbf7d0' : 'var(--border-light)'}`,
                          borderRadius: 'var(--radius-md)',
                          padding: '16px 20px',
                          backgroundColor: isDone ? '#f0fdf4' : '#ffffff',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '14px',
                        }}
                      >
                        <div style={{ minWidth: '280px', flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <span
                              style={{
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                backgroundColor: '#0f172a',
                                color: '#ffffff',
                                padding: '2px 8px',
                                borderRadius: '4px',
                              }}
                            >
                              Milestone {idx + 1}
                            </span>
                            <span style={{ fontSize: '0.72rem', fontWeight: 600, backgroundColor: '#f1f5f9', color: '#334155', padding: '2px 8px', borderRadius: '4px' }}>
                              {projectCode}
                            </span>
                            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                              Phase {phase.phaseNumber}: {phase.name}
                            </h4>
                          </div>

                          <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                            Contract: <strong>{projectTitle}</strong> • Deadline: <strong>{phase.deadline}</strong> • Lead: {phase.leadPerson}
                          </div>

                          {/* Deliverables checklist */}
                          <div style={{ marginTop: '8px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {phase.deliverables.map((del, dIdx) => (
                              <span
                                key={dIdx}
                                style={{
                                  fontSize: '0.7rem',
                                  padding: '2px 8px',
                                  borderRadius: '4px',
                                  backgroundColor: '#f8fafc',
                                  border: '1px solid var(--border-light)',
                                  color: 'var(--text-secondary)',
                                  fontWeight: 500,
                                }}
                              >
                                📋 {del}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Status & Upload button */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <div style={{ textAlign: 'right' }}>
                            <span className={`badge ${isDone ? 'badge-completed' : 'badge-progress'}`}>
                              {isDone && <Check size={12} />} {phase.status} ({phase.progress}%)
                            </span>
                            <div className="progress-track" style={{ width: '100px', marginTop: '6px' }}>
                              <div className="progress-fill" style={{ width: `${phase.progress}%` }} />
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => setIsUploadModalOpen(true)}
                            className="btn btn-secondary btn-sm"
                            style={{ gap: '6px', fontSize: '0.76rem' }}
                          >
                            <UploadCloud size={13} />
                            <span>Upload for this Phase</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Section 2: Direct Communication with Department Head & Teammates */}
              <div
                className="card"
                style={{
                  padding: '24px',
                  border: '1px solid var(--border-light)',
                  backgroundColor: '#ffffff',
                  marginBottom: '28px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MessageSquare size={18} style={{ color: '#0f172a' }} />
                      <span>Communicate with Department Head ({departmentHeadUser?.name || 'HOD'})</span>
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Ask technical clarifications, report milestone completion, or update your Team Lead.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleMemberSendMessage} style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
                  <input
                    type="text"
                    className="input-text"
                    placeholder={`Message your Department Head (${departmentHeadUser?.name || 'HOD'}) & team...`}
                    value={memberMsgText}
                    onChange={(e) => setMemberMsgText(e.target.value)}
                    required
                  />
                  <button type="submit" className="btn btn-primary" style={{ gap: '6px', whiteSpace: 'nowrap' }}>
                    <Send size={14} />
                    <span>Send to Lead</span>
                  </button>
                </form>

                {/* Recent department communication snippets */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Recent Division Messages
                  </div>
                  {recentMessages.map((msg) => (
                    <div
                      key={msg.id}
                      style={{
                        padding: '10px 12px',
                        backgroundColor: '#f8fafc',
                        border: '1px solid var(--border-light)',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                        <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                          {msg.senderName} ({msg.senderRole})
                        </span>
                        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                          {msg.timestamp}
                        </span>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                        {msg.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      <FileUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </div>
  );
}
