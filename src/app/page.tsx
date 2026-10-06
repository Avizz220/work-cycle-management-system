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
} from 'lucide-react';
import { DisciplineType } from '@/types';

export default function DashboardPage() {
  const { currentUser, isPM } = useAuth();
  const { projects, totalStats, urgentDeadlines } = useProjects();
  const { sharedFiles, triggerFileDownload } = useCommunication();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const getDisciplineIcon = (disc: DisciplineType | 'Management' | 'All') => {
    switch (disc) {
      case 'Electrical':
        return <Zap size={14} style={{ color: '#000000', flexShrink: 0 }} />;
      case 'Civil':
        return <Building2 size={14} style={{ color: '#000000', flexShrink: 0 }} />;
      case 'Plumbing':
        return <Droplets size={14} style={{ color: '#000000', flexShrink: 0 }} />;
      case 'Architectural':
        return <Compass size={14} style={{ color: '#000000', flexShrink: 0 }} />;
      default:
        return <Layers size={14} style={{ color: '#000000', flexShrink: 0 }} />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar />

      <div className="main-wrapper">
        <Navbar
          pageTitle="Work Management & Deadlines Dashboard"
          subtitle={`Welcome back, ${currentUser?.name || 'Engineer'} • The Design Group Five International`}
        />

        <main className="main-content">
          {/* Prominent Deadlines Banner for all employees upon login */}
          <DeadlinesAlertBanner />

          {/* Welcome & Role Context Banner - Crisp Light White Card (No Dark Background) */}
          <div
            className="card"
            style={{
              marginBottom: '28px',
              padding: '28px 32px',
              backgroundColor: '#ffffff',
              color: '#000000',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '20px',
              border: '1px solid #000000',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                <span
                  style={{
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    padding: '3px 10px',
                    borderRadius: '4px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {isPM ? 'Project Manager Control Panel' : `${currentUser?.discipline} Engineering Hub`}
                </span>
                <span style={{ color: '#71717a', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>• Colombo HQ & Site Network</span>
              </div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0, color: '#000000' }}>
                {isPM
                  ? `Master Project Portfolio & Multidisciplinary Schedule`
                  : `${currentUser?.discipline} Engineering Operations & Deliverables`}
              </h2>
              <p style={{ color: '#52525b', fontSize: '0.86rem', marginTop: '6px', maxWidth: '680px', lineHeight: 1.5 }}>
                {isPM
                  ? 'Coordinate all active project phases across Electrical, Civil, Plumbing and Architectural disciplines. Monitor milestones, budgets, and tender schedules.'
                  : `Review critical phase deadlines, collaborate with colleagues, and exchange certified technical drawings and calculation packages.`}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {isPM ? (
                <Link
                  href="/projects/new"
                  className="btn btn-primary"
                  style={{
                    gap: '8px',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                  }}
                >
                  <FolderPlus size={16} />
                  <span>Add New Project & Phases</span>
                </Link>
              ) : (
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="btn btn-primary"
                  style={{
                    gap: '8px',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                  }}
                >
                  <UploadCloud size={16} />
                  <span>Upload Drawing</span>
                </button>
              )}

              <Link
                href="/disciplines"
                className="btn btn-secondary"
                style={{
                  gap: '8px',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                }}
              >
                <MessageSquare size={15} />
                <span>Section Hubs</span>
              </Link>
            </div>
          </div>

          {/* Key KPI Stats Grid - Pure Black Icons WITHOUT background boxes */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '18px',
              marginBottom: '28px',
            }}
          >
            {/* Stat 1: Active Projects */}
            <div className="card card-interactive" style={{ padding: '20px', border: '1px solid #e4e4e7', backgroundColor: '#ffffff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
                    Active Projects
                  </div>
                  <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#000000', marginTop: '4px' }}>
                    {totalStats.activeProjects}
                  </div>
                </div>
                {/* Pure black icon with NO background box */}
                <FolderGit2 size={24} style={{ color: '#000000' }} />
              </div>
              <div style={{ fontSize: '0.8rem', color: '#52525b', marginTop: '12px', whiteSpace: 'nowrap' }}>
                Total Portfolio: <strong>{totalStats.totalProjects} contracts</strong>
              </div>
            </div>

            {/* Stat 2: Critical Deadlines */}
            <div className="card card-interactive" style={{ padding: '20px', border: '1px solid #000000', backgroundColor: '#ffffff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#000000', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
                    Approaching Deadlines
                  </div>
                  <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#000000', marginTop: '4px' }}>
                    {urgentDeadlines.length}
                  </div>
                </div>
                {/* Pure black icon with NO background box */}
                <Clock size={24} style={{ color: '#000000' }} />
              </div>
              <div style={{ fontSize: '0.8rem', color: '#000000', fontWeight: 600, marginTop: '12px', whiteSpace: 'nowrap' }}>
                Milestones due within 10 days
              </div>
            </div>

            {/* Stat 3: Phases Completed */}
            <div className="card card-interactive" style={{ padding: '20px', border: '1px solid #e4e4e7', backgroundColor: '#ffffff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
                    Phases Completed
                  </div>
                  <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#000000', marginTop: '4px' }}>
                    {totalStats.completedPhases} / {totalStats.totalPhases}
                  </div>
                </div>
                {/* Pure black icon with NO background box */}
                <CheckCircle2 size={24} style={{ color: '#000000' }} />
              </div>
              <div style={{ fontSize: '0.8rem', color: '#52525b', marginTop: '12px', whiteSpace: 'nowrap' }}>
                Completion rate:{' '}
                <strong>
                  {totalStats.totalPhases > 0
                    ? Math.round((totalStats.completedPhases / totalStats.totalPhases) * 100)
                    : 0}
                  %
                </strong>
              </div>
            </div>

            {/* Stat 4: Engineering Disciplines */}
            <div className="card card-interactive" style={{ padding: '20px', border: '1px solid #e4e4e7', backgroundColor: '#ffffff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
                    Active Sections
                  </div>
                  <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#000000', marginTop: '4px' }}>
                    4 Sections
                  </div>
                </div>
                {/* Pure black icon with NO background box */}
                <Layers size={24} style={{ color: '#000000' }} />
              </div>
              <div style={{ fontSize: '0.8rem', color: '#52525b', marginTop: '12px', whiteSpace: 'nowrap' }}>
                Electrical • Civil • Plumbing • Architecture
              </div>
            </div>
          </div>

          {/* Section: Master Project Deadlines Schedule */}
          <div style={{ marginBottom: '36px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
                flexWrap: 'wrap',
                gap: '10px',
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#000000' }}>
                  All Project Deadlines & Phase Milestones
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#52525b' }}>
                  Live delivery milestones tracked across all active design & engineering contracts
                </p>
              </div>

              <Link
                href="/deadlines"
                className="btn btn-secondary btn-sm"
                style={{ gap: '6px', whiteSpace: 'nowrap' }}
              >
                <span>Full Timeline View</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <DeadlinesTable initialDiscipline="All" showFilters={true} />
          </div>

          {/* Section: Active Projects Grid with Phase Progress */}
          <div style={{ marginBottom: '36px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
                flexWrap: 'wrap',
                gap: '10px',
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#000000' }}>
                  Active Engineering Projects ({projects.length})
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#52525b' }}>
                  Detailed breakdown of phases, milestones, and section deliverables
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                {isPM && (
                  <Link href="/projects/new" className="btn btn-primary btn-sm" style={{ gap: '6px', whiteSpace: 'nowrap' }}>
                    <FolderPlus size={15} />
                    <span>Add Project</span>
                  </Link>
                )}
                <Link href="/projects" className="btn btn-secondary btn-sm" style={{ gap: '6px', whiteSpace: 'nowrap' }}>
                  <span>View All Projects</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
                gap: '20px',
              }}
            >
              {projects.slice(0, 3).map((prj) => (
                <div key={prj.id} className="card card-interactive" style={{ padding: '24px', border: '1px solid #e4e4e7', backgroundColor: '#ffffff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <span
                      style={{
                        fontSize: '0.74rem',
                        fontWeight: 800,
                        backgroundColor: '#000000',
                        color: '#ffffff',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {prj.code}
                    </span>
                    <span className="badge badge-outline" style={{ whiteSpace: 'nowrap' }}>{prj.status}</span>
                  </div>

                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#000000', marginBottom: '4px' }}>
                    {prj.title}
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: '#52525b', marginBottom: '16px', lineHeight: 1.4 }}>
                    Client: <strong>{prj.client}</strong> • {prj.location}
                  </p>

                  {/* Overall Progress */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px' }}>
                      <span style={{ color: '#71717a' }}>Overall Progress</span>
                      <span style={{ fontWeight: 800, color: '#000000' }}>{prj.overallProgress}%</span>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${prj.overallProgress}%` }} />
                    </div>
                  </div>

                  {/* Phases Mini-Stepper */}
                  <div style={{ marginBottom: '16px', borderTop: '1px solid #e4e4e7', paddingTop: '12px' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#71717a', marginBottom: '8px' }}>
                      Project Phases ({prj.phases.length})
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {prj.phases.slice(0, 3).map((phase) => (
                        <div
                          key={phase.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            fontSize: '0.78rem',
                            backgroundColor: '#fafafa',
                            border: '1px solid #e4e4e7',
                            padding: '6px 10px',
                            borderRadius: '6px',
                            gap: '8px',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0, flex: 1 }}>
                            {getDisciplineIcon(phase.assignedSection)}
                            <span
                              style={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                fontWeight: 600,
                                color: '#000000',
                              }}
                              title={phase.name}
                            >
                              P{phase.phaseNumber}: {phase.name}
                            </span>
                          </div>
                          <span
                            style={{
                              fontSize: '0.7rem',
                              fontWeight: 800,
                              color: '#000000',
                              whiteSpace: 'nowrap',
                              flexShrink: 0,
                            }}
                          >
                            {phase.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderTop: '1px solid #e4e4e7',
                      paddingTop: '12px',
                      fontSize: '0.78rem',
                      color: '#52525b',
                    }}
                  >
                    <span>Budget: <strong style={{ color: '#000000' }}>{prj.budget}</strong></span>
                    <Link
                      href="/projects"
                      style={{ color: '#000000', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}
                    >
                      <span>Details</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Shared Engineering Vault (CAD & Documents) */}
          <div style={{ marginBottom: '32px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
                flexWrap: 'wrap',
                gap: '10px',
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#000000' }}>
                  Recent Section Drawings & Technical Documents
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#52525b' }}>
                  Approved AutoCAD drawings, BIM models, and specification documents shared between sections
                </p>
              </div>

              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="btn btn-secondary btn-sm"
                style={{ gap: '6px', whiteSpace: 'nowrap' }}
              >
                <UploadCloud size={15} />
                <span>Upload Document</span>
              </button>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '16px',
              }}
            >
              {sharedFiles.slice(0, 3).map((file) => (
                <div key={file.id} className="card card-interactive" style={{ padding: '20px', border: '1px solid #e4e4e7', backgroundColor: '#ffffff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <span
                      style={{
                        textTransform: 'uppercase',
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        backgroundColor: '#000000',
                        color: '#ffffff',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      .{file.fileType}
                    </span>
                    <span className="badge badge-subtle" style={{ fontSize: '0.7rem', whiteSpace: 'nowrap' }}>
                      {file.discipline}
                    </span>
                  </div>

                  <h4
                    style={{
                      fontSize: '0.95rem',
                      fontWeight: 800,
                      color: '#000000',
                      marginBottom: '4px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                    title={file.title}
                  >
                    {file.title}
                  </h4>
                  <div style={{ fontSize: '0.78rem', color: '#71717a', marginBottom: '12px', whiteSpace: 'nowrap' }}>
                    {file.fileName} • {file.fileSize}
                  </div>

                  <p style={{ fontSize: '0.78rem', color: '#52525b', marginBottom: '14px', lineHeight: 1.4 }}>
                    {file.notes}
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderTop: '1px solid #e4e4e7',
                      paddingTop: '10px',
                    }}
                  >
                    <span style={{ fontSize: '0.72rem', color: '#71717a', whiteSpace: 'nowrap' }}>
                      By {file.uploadedBy.split(' ')[0]} {file.uploadedBy.split(' ')[1]}
                    </span>
                    <button
                      onClick={() => triggerFileDownload(file)}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.74rem', padding: '4px 10px', gap: '4px', whiteSpace: 'nowrap' }}
                      title="Download Certified Drawing Package"
                    >
                      <Download size={13} />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      <FileUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </div>
  );
}
