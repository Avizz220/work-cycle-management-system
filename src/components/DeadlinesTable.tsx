'use client';

import React, { useState } from 'react';
import { useProjects } from '@/context/ProjectContext';
import { useAuth } from '@/context/AuthContext';
import { DisciplineType, PhaseStatus } from '@/types';
import {
  Calendar,
  CheckCircle2,
  Filter,
  Zap,
  Building2,
  Droplets,
  Compass,
  FileCheck,
} from 'lucide-react';

interface DeadlinesTableProps {
  initialDiscipline?: DisciplineType | 'All';
  showFilters?: boolean;
}

export default function DeadlinesTable({ initialDiscipline = 'All', showFilters = true }: DeadlinesTableProps) {
  const { allDeadlines, updatePhaseStatus } = useProjects();
  const { isPM } = useAuth();
  const [selectedDiscipline, setSelectedDiscipline] = useState<DisciplineType | 'All'>(initialDiscipline);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Urgent' | 'Completed'>('All');
  const [selectedItemDeliverables, setSelectedItemDeliverables] = useState<{ name: string; deliverables: string[] } | null>(null);

  const filteredDeadlines = allDeadlines.filter((item) => {
    const matchesDiscipline =
      selectedDiscipline === 'All' ||
      item.assignedSection === selectedDiscipline ||
      item.assignedSection === 'All';

    if (!matchesDiscipline) return false;

    if (statusFilter === 'Active') {
      return item.status !== 'Completed';
    }
    if (statusFilter === 'Urgent') {
      return item.status !== 'Completed' && (item.isUrgent || item.isOverdue);
    }
    if (statusFilter === 'Completed') {
      return item.status === 'Completed';
    }
    return true;
  });

  const getDisciplineBadge = (disc: DisciplineType | 'All') => {
    switch (disc) {
      case 'Electrical':
        return (
          <span className="badge badge-subtle" style={{ whiteSpace: 'nowrap' }}>
            <Zap size={12} style={{ color: '#64748b', flexShrink: 0 }} /> Electrical
          </span>
        );
      case 'Civil':
        return (
          <span className="badge badge-subtle" style={{ whiteSpace: 'nowrap' }}>
            <Building2 size={12} style={{ color: '#64748b', flexShrink: 0 }} /> Civil & Structural
          </span>
        );
      case 'Plumbing':
        return (
          <span className="badge badge-subtle" style={{ whiteSpace: 'nowrap' }}>
            <Droplets size={12} style={{ color: '#64748b', flexShrink: 0 }} /> Plumbing & MEP
          </span>
        );
      case 'Architectural':
        return (
          <span className="badge badge-subtle" style={{ whiteSpace: 'nowrap' }}>
            <Compass size={12} style={{ color: '#64748b', flexShrink: 0 }} /> Architectural
          </span>
        );
      default:
        return <span className="badge badge-subtle" style={{ whiteSpace: 'nowrap' }}>General</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return <span className="badge badge-completed" style={{ whiteSpace: 'nowrap' }}>Completed</span>;
      case 'In Progress':
        return <span className="badge badge-progress" style={{ whiteSpace: 'nowrap' }}>In Progress</span>;
      case 'Under Review':
        return <span className="badge badge-review" style={{ whiteSpace: 'nowrap' }}>Under Review</span>;
      default:
        return <span className="badge badge-pending" style={{ whiteSpace: 'nowrap' }}>Pending</span>;
    }
  };

  const handleStatusChange = (projectId: string, phaseId: string, newStatus: PhaseStatus) => {
    const progressVal = newStatus === 'Completed' ? 100 : newStatus === 'Under Review' ? 85 : 50;
    updatePhaseStatus(projectId, phaseId, newStatus, progressVal);
  };

  return (
    <div className="card" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
      {/* Table Header & Filters - Styled matching reference screenshot */}
      {showFilters && (
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-light)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#ffffff',
          }}
        >
          {/* Section filter pills */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {(['All', 'Electrical', 'Civil', 'Plumbing', 'Architectural'] as const).map((disc) => (
              <button
                key={disc}
                onClick={() => setSelectedDiscipline(disc)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.8rem',
                  fontWeight: selectedDiscipline === disc ? 600 : 500,
                  backgroundColor: selectedDiscipline === disc ? '#0f172a' : '#ffffff',
                  color: selectedDiscipline === disc ? '#ffffff' : '#475569',
                  border: `1px solid ${selectedDiscipline === disc ? '#0f172a' : 'var(--border-light)'}`,
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                }}
              >
                {disc === 'All' ? 'All Sections' : disc}
              </button>
            ))}
          </div>

          {/* Status urgency filter dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 600 }}>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="select-input"
              style={{
                padding: '6px 12px',
                fontSize: '0.8rem',
                width: 'auto',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#ffffff',
                color: 'var(--text-main)',
                whiteSpace: 'nowrap',
              }}
            >
              <option value="All">All Phases ({allDeadlines.length})</option>
              <option value="Active">Active Only</option>
              <option value="Urgent">Urgent / Overdue Only</option>
              <option value="Completed">Completed Phases</option>
            </select>
          </div>
        </div>
      )}

      {/* Table content - with generous column sizing and single-line layout */}
      <div style={{ overflowX: 'auto', width: '100%' }}>
        <table style={{ width: '100%', minWidth: '1100px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid var(--border-light)', color: '#475569', fontSize: '0.74rem', fontWeight: 600, letterSpacing: '0.02em' }}>
              <th style={{ padding: '12px 18px', width: '27%', whiteSpace: 'nowrap' }}>Phase & Deliverable</th>
              <th style={{ padding: '12px 16px', width: '22%', whiteSpace: 'nowrap' }}>Project</th>
              <th style={{ padding: '12px 16px', width: '15%', whiteSpace: 'nowrap' }}>Section</th>
              <th style={{ padding: '12px 16px', width: '13%', whiteSpace: 'nowrap' }}>Lead Engineer</th>
              <th style={{ padding: '12px 16px', width: '11%', whiteSpace: 'nowrap' }}>Target Deadline</th>
              <th style={{ padding: '12px 14px', width: '8%', whiteSpace: 'nowrap' }}>Days Left</th>
              <th style={{ padding: '12px 14px', width: '9%', whiteSpace: 'nowrap' }}>Status</th>
              <th style={{ padding: '12px 18px', width: '8%', textAlign: 'right', whiteSpace: 'nowrap' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDeadlines.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: '36px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No project phases match the selected criteria.
                </td>
              </tr>
            ) : (
              filteredDeadlines.map((item) => (
                <tr
                  key={`${item.projectId}-${item.phaseId}`}
                  style={{
                    borderBottom: '1px solid #f1f5f9',
                    backgroundColor: '#ffffff',
                    transition: 'background-color 0.12s ease',
                  }}
                >
                  {/* Phase & Deliverable */}
                  <td style={{ padding: '12px 18px' }}>
                    <div
                      style={{
                        fontWeight: 600,
                        color: 'var(--text-main)',
                        fontSize: '0.85rem',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '280px',
                      }}
                      title={item.phaseName}
                    >
                      {item.phaseName}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px', whiteSpace: 'nowrap' }}>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                        Phase {item.phaseNumber}
                      </span>
                      {item.deliverables.length > 0 && (
                        <>
                          <span style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>•</span>
                          <button
                            onClick={() => setSelectedItemDeliverables({ name: item.phaseName, deliverables: item.deliverables })}
                            style={{
                              fontSize: '0.74rem',
                              color: '#2563eb',
                              fontWeight: 500,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '3px',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            <FileCheck size={12} />
                            <span>{item.deliverables.length} Deliverables</span>
                          </button>
                        </>
                      )}
                    </div>
                  </td>

                  {/* Project */}
                  <td style={{ padding: '12px 16px' }}>
                    <div
                      style={{
                        fontWeight: 600,
                        color: 'var(--text-main)',
                        fontSize: '0.84rem',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '240px',
                      }}
                      title={item.projectTitle}
                    >
                      {item.projectTitle}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px', whiteSpace: 'nowrap' }}>
                      {item.projectCode}
                    </div>
                  </td>

                  {/* Section */}
                  <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                    {getDisciplineBadge(item.assignedSection)}
                  </td>

                  {/* Lead */}
                  <td style={{ padding: '12px 16px', color: '#475569', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                    {item.leadPerson}
                  </td>

                  {/* Target Deadline Date */}
                  <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#334155', whiteSpace: 'nowrap' }}>
                      <Calendar size={13} style={{ color: '#64748b', flexShrink: 0 }} />
                      <span style={{ whiteSpace: 'nowrap' }}>{item.deadline}</span>
                    </div>
                  </td>

                  {/* Days Left - Soft Light Ash Pill (NO Pitch Black Blob!) */}
                  <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                    {item.status === 'Completed' ? (
                      <span style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
                        <CheckCircle2 size={13} /> Done
                      </span>
                    ) : item.isOverdue ? (
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          backgroundColor: '#fef2f2',
                          color: '#991b1b',
                          border: '1px solid #fecaca',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Overdue {Math.abs(item.daysRemaining)}d
                      </span>
                    ) : item.isUrgent ? (
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          backgroundColor: '#fffbeb',
                          color: '#92400e',
                          border: '1px solid #fde68a',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {item.daysRemaining}d Left
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.76rem', color: '#475569', fontWeight: 500, whiteSpace: 'nowrap' }}>
                        {item.daysRemaining}d
                      </span>
                    )}
                  </td>

                  {/* Status */}
                  <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                    {getStatusBadge(item.status)}
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '12px 18px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'inline-flex', gap: '6px', whiteSpace: 'nowrap' }}>
                      {item.status !== 'Completed' ? (
                        <button
                          onClick={() => handleStatusChange(item.projectId, item.phaseId, 'Completed')}
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '0.74rem', padding: '3px 8px', whiteSpace: 'nowrap' }}
                          title="Mark Phase as Completed"
                        >
                          <CheckCircle2 size={12} />
                          <span>Complete</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStatusChange(item.projectId, item.phaseId, 'In Progress')}
                          className="btn btn-ghost btn-sm"
                          style={{ fontSize: '0.72rem', padding: '3px 8px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}
                          title="Reopen phase"
                        >
                          Reopen
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Deliverables Popover Modal */}
      {selectedItemDeliverables && (
        <div className="modal-overlay" onClick={() => setSelectedItemDeliverables(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--border-light)' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Phase Deliverables Checklist
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                {selectedItemDeliverables.name}
              </p>
            </div>
            <div style={{ padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {selectedItemDeliverables.deliverables.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 12px',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-light)',
                    borderRadius: '6px',
                    fontSize: '0.84rem',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <CheckCircle2 size={15} style={{ color: '#16a34a', flexShrink: 0 }} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div style={{ padding: '12px 22px', borderTop: '1px solid var(--border-light)', textAlign: 'right', backgroundColor: '#f8fafc' }}>
              <button className="btn btn-primary btn-sm" onClick={() => setSelectedItemDeliverables(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
