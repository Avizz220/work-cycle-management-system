'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { useProjects } from '@/context/ProjectContext';
import { useAuth } from '@/context/AuthContext';
import {
  FolderGit2,
  FolderPlus,
  ChevronDown,
  ChevronUp,
  Trash2,
  CheckCircle2,
  Zap,
  Building2,
  Droplets,
  Compass,
} from 'lucide-react';
import { DisciplineType } from '@/types';

export default function ProjectsDirectoryPage() {
  const { projects, deleteProject, updatePhaseStatus } = useProjects();
  const { isPM } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(projects[0]?.id || null);

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
        return <span className="badge badge-subtle"><Zap size={11} style={{ color: '#000000' }} /> Electrical</span>;
      case 'Civil':
        return <span className="badge badge-subtle"><Building2 size={11} style={{ color: '#000000' }} /> Civil</span>;
      case 'Plumbing':
        return <span className="badge badge-subtle"><Droplets size={11} style={{ color: '#000000' }} /> Plumbing</span>;
      case 'Architectural':
        return <span className="badge badge-subtle"><Compass size={11} style={{ color: '#000000' }} /> Architecture</span>;
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
          subtitle="Directory of active design, structural and MEP contracts"
        />

        <main className="main-content">
          {/* Top Controls & Search Bar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
              marginBottom: '24px',
            }}
          >
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', flex: 1 }}>
              <input
                type="text"
                placeholder="Search by project title, code, client..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-text"
                style={{ maxWidth: '360px', padding: '8px 14px', fontSize: '0.88rem', border: '1px solid #000000' }}
              />

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="select-input"
                style={{ width: 'auto', padding: '8px 14px', fontSize: '0.88rem', border: '1px solid #000000' }}
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
                <FolderPlus size={18} />
                <span>Add New Project</span>
              </Link>
            )}
          </div>

          {/* Projects List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {filteredProjects.length === 0 ? (
              <div className="card" style={{ padding: '60px 24px', textAlign: 'center', color: '#71717a' }}>
                No projects matched your search criteria.
              </div>
            ) : (
              filteredProjects.map((prj) => {
                const isExpanded = expandedProjectId === prj.id;
                return (
                  <div
                    key={prj.id}
                    className="card"
                    style={{
                      padding: '24px',
                      border: '1px solid #000000',
                      transition: 'all 0.2s ease',
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
                        marginBottom: '14px',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                          <span
                            style={{
                              fontSize: '0.76rem',
                              fontWeight: 800,
                              backgroundColor: '#000000',
                              color: '#ffffff',
                              padding: '2px 8px',
                              borderRadius: '4px',
                            }}
                          >
                            {prj.code}
                          </span>
                          <span className="badge badge-outline">{prj.status}</span>
                          <span className="badge badge-subtle">{prj.category}</span>
                        </div>
                        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#000000', margin: 0 }}>
                          {prj.title}
                        </h2>
                        <p style={{ fontSize: '0.84rem', color: '#52525b', marginTop: '4px' }}>
                          Client: <strong>{prj.client}</strong> • Location: <strong>{prj.location}</strong>
                        </p>
                      </div>

                      {/* Right Meta & Actions */}
                      <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                        <div style={{ fontSize: '0.84rem', color: '#52525b' }}>
                          Budget: <strong style={{ color: '#000000', fontSize: '0.98rem' }}>{prj.budget}</strong>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#71717a' }}>
                          Lead PM: <strong>{prj.projectManager}</strong>
                        </div>
                        {isPM && (
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete project ${prj.code}?`)) {
                                deleteProject(prj.id);
                              }
                            }}
                            style={{
                              fontSize: '0.75rem',
                              color: '#000000',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              marginTop: '4px',
                              textDecoration: 'underline',
                            }}
                          >
                            <Trash2 size={13} /> Delete Project
                          </button>
                        )}
                      </div>
                    </div>

                    <p style={{ fontSize: '0.85rem', color: '#27272a', marginBottom: '18px', lineHeight: 1.5 }}>
                      {prj.description}
                    </p>

                    {/* Progress Bar & Quick Metrics */}
                    <div
                      style={{
                        backgroundColor: '#f4f4f5',
                        border: '1px solid #e4e4e7',
                        borderRadius: 'var(--radius-md)',
                        padding: '14px 18px',
                        marginBottom: '16px',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                        gap: '16px',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                          <span style={{ color: '#71717a' }}>Overall Progress</span>
                          <span style={{ fontWeight: 800, color: '#000000' }}>{prj.overallProgress}%</span>
                        </div>
                        <div className="progress-track">
                          <div className="progress-fill" style={{ width: `${prj.overallProgress}%` }} />
                        </div>
                      </div>

                      <div style={{ fontSize: '0.8rem', color: '#52525b' }}>
                        Target Completion: <strong style={{ color: '#000000' }}>{prj.targetCompletion}</strong>
                      </div>

                      <div style={{ fontSize: '0.8rem', color: '#52525b' }}>
                        Phases Count: <strong style={{ color: '#000000' }}>{prj.phases.length} Phases</strong>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <button
                          type="button"
                          onClick={() => setExpandedProjectId(isExpanded ? null : prj.id)}
                          className="btn btn-secondary btn-sm"
                          style={{ gap: '6px', fontSize: '0.78rem' }}
                        >
                          <span>{isExpanded ? 'Hide Phases' : 'Inspect All Phases'}</span>
                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                      </div>
                    </div>

                    {/* Expandable Phase Details Section */}
                    {isExpanded && (
                      <div
                        style={{
                          borderTop: '1px solid #e4e4e7',
                          paddingTop: '18px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '12px',
                        }}
                      >
                        <div
                          style={{
                            fontSize: '0.8rem',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            color: '#000000',
                            letterSpacing: '0.04em',
                            display: 'flex',
                            justifyContent: 'space-between',
                          }}
                        >
                          <span>Multidisciplinary Phase Schedule & Deliverables</span>
                          <span>Phase Status</span>
                        </div>

                        {prj.phases.map((phase) => (
                          <div
                            key={phase.id}
                            style={{
                              backgroundColor: '#ffffff',
                              border: '1px solid #e4e4e7',
                              borderRadius: 'var(--radius-md)',
                              padding: '14px 18px',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              flexWrap: 'wrap',
                              gap: '12px',
                            }}
                          >
                            <div style={{ maxWidth: '65%' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                <span
                                  style={{
                                    fontSize: '0.72rem',
                                    fontWeight: 800,
                                    backgroundColor: '#000000',
                                    color: '#ffffff',
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                  }}
                                >
                                  Phase {phase.phaseNumber}
                                </span>
                                {getDisciplineBadge(phase.assignedSection)}
                                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#000000' }}>
                                  {phase.name}
                                </span>
                                {phase.critical && (
                                  <span className="badge badge-dark" style={{ fontSize: '0.68rem' }}>
                                    Critical Path
                                  </span>
                                )}
                              </div>

                              <div style={{ fontSize: '0.78rem', color: '#52525b', display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                                <span>Lead: <strong>{phase.leadPerson}</strong></span>
                                <span>Timeline: {phase.startDate} to <strong>{phase.deadline}</strong></span>
                              </div>

                              {phase.deliverables.length > 0 && (
                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                                  {phase.deliverables.map((del, dIdx) => (
                                    <span
                                      key={dIdx}
                                      style={{
                                        fontSize: '0.7rem',
                                        backgroundColor: '#f4f4f5',
                                        color: '#000000',
                                        padding: '2px 6px',
                                        borderRadius: '4px',
                                        border: '1px solid #d4d4d8',
                                        fontWeight: 600,
                                      }}
                                    >
                                      ✓ {del}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Phase Status control */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <select
                                value={phase.status}
                                onChange={(e) =>
                                  updatePhaseStatus(
                                    prj.id,
                                    phase.id,
                                    e.target.value as any,
                                    e.target.value === 'Completed' ? 100 : phase.progress
                                  )
                                }
                                className="select-input"
                                style={{ fontSize: '0.78rem', padding: '4px 10px', width: 'auto', border: '1px solid #000000' }}
                              >
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Under Review">Under Review</option>
                                <option value="Completed">Completed</option>
                              </select>

                              {phase.status === 'Completed' && (
                                <CheckCircle2 size={18} style={{ color: '#000000' }} />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
