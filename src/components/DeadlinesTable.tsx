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
            <Zap size={13} style={{ color: '#000000', flexShrink: 0 }} /> Electrical
          </span>
        );
      case 'Civil':
        return (
          <span className="badge badge-subtle" style={{ whiteSpace: 'nowrap' }}>
            <Building2 size={13} style={{ color: '#000000', flexShrink: 0 }} /> Civil & Structural
          </span>
        );
      case 'Plumbing':
        return (
          <span className="badge badge-subtle" style={{ whiteSpace: 'nowrap' }}>
            <Droplets size={13} style={{ color: '#000000', flexShrink: 0 }} /> Plumbing & MEP
          </span>
        );
      case 'Architectural':
        return (
          <span className="badge badge-subtle" style={{ whiteSpace: 'nowrap' }}>
            <Compass size={13} style={{ color: '#000000', flexShrink: 0 }} /> Architectural
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
    <div className="card" style={{ padding: '0', overflow: 'hidden', border: '1px solid #e4e4e7' }}>
      {/* Table Header & Controls */}
      {showFilters && (
        <div
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid #e4e4e7',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '14px',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#ffffff',
          }}
        >
          {/* Discipline tabs */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {(['All', 'Electrical', 'Civil', 'Plumbing', 'Architectural'] as const).map((disc) => (
              <button
                key={disc}
                onClick={() => setSelectedDiscipline(disc)}
                style={{
                  padding: '7px 16px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  backgroundColor: selectedDiscipline === disc ? '#000000' : '#ffffff',
                  color: selectedDiscipline === disc ? '#ffffff' : '#000000',
                  border: '1px solid #000000',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                }}
              >
                {disc === 'All' ? 'All Sections' : `${disc}`}
              </button>
            ))}
          </div>

          {/* Status urgency filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={15} style={{ color: '#000000', flexShrink: 0 }} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="select-input"
              style={{ padding: '7px 14px', fontSize: '0.82rem', width: 'auto', border: '1px solid #000000', whiteSpace: 'nowrap' }}
            >
              <option value="All">All Statuses ({allDeadlines.length})</option>
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
            <tr style={{ backgroundColor: '#fafafa', borderBottom: '1px solid #e4e4e7', color: '#000000', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <th style={{ padding: '14px 20px', fontWeight: 800, width: '27%', whiteSpace: 'nowrap' }}>Phase & Deliverable</th>
              <th style={{ padding: '14px 18px', fontWeight: 800, width: '22%', whiteSpace: 'nowrap' }}>Project</th>
              <th style={{ padding: '14px 16px', fontWeight: 800, width: '15%', whiteSpace: 'nowrap' }}>Section</th>
              <th style={{ padding: '14px 16px', fontWeight: 800, width: '13%', whiteSpace: 'nowrap' }}>Lead Engineer</th>
              <th style={{ padding: '14px 16px', fontWeight: 800, width: '11%', whiteSpace: 'nowrap' }}>Target Deadline</th>
              <th style={{ padding: '14px 14px', fontWeight: 800, width: '8%', whiteSpace: 'nowrap' }}>Days Left</th>
              <th style={{ padding: '14px 14px', fontWeight: 800, width: '9%', whiteSpace: 'nowrap' }}>Status</th>
              <th style={{ padding: '14px 20px', fontWeight: 800, width: '8%', textAlign: 'right', whiteSpace: 'nowrap' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDeadlines.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: '40px 20px', textAlign: 'center', color: '#71717a' }}>
                  No project phases match the selected criteria.
                </td>
              </tr>
            ) : (
              filteredDeadlines.map((item) => (
                <tr
                  key={`${item.projectId}-${item.phaseId}`}
                  style={{
                    borderBottom: '1px solid #f0f0f0',
                    backgroundColor: '#ffffff',
                    transition: 'background-color 0.12s ease',
                  }}
                >
                  {/* Phase & Deliverable - Single line phase title + single line metadata */}
                  <td style={{ padding: '14px 20px' }}>
                    <div
                      style={{
                        fontWeight: 700,
                        color: '#000000',
                        fontSize: '0.86rem',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '280px',
                      }}
                      title={item.phaseName}
                    >
                      {item.phaseName}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px', whiteSpace: 'nowrap' }}>
                      <span style={{ fontSize: '0.74rem', color: '#71717a', whiteSpace: 'nowrap' }}>
                        Phase {item.phaseNumber}
                      </span>
                      {item.deliverables.length > 0 && (
                        <>
                          <span style={{ fontSize: '0.7rem', color: '#a1a1aa' }}>•</span>
                          <button
                            onClick={() => setSelectedItemDeliverables({ name: item.phaseName, deliverables: item.deliverables })}
                            style={{
                              fontSize: '0.74rem',
                              color: '#000000',
                              textDecoration: 'underline',
                              fontWeight: 600,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            <FileCheck size={12} style={{ color: '#000000' }} />
                            <span>{item.deliverables.length} Deliverables</span>
                          </button>
                        </>
                      )}
                    </div>
                  </td>

                  {/* Project - Single line title + single line code */}
                  <td style={{ padding: '14px 18px' }}>
                    <div
                      style={{
                        fontWeight: 600,
                        color: '#000000',
                        fontSize: '0.85rem',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '240px',
                      }}
                      title={item.projectTitle}
                    >
                      {item.projectTitle}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#71717a', marginTop: '2px', whiteSpace: 'nowrap' }}>
                      {item.projectCode}
                    </div>
                  </td>

                  {/* Section - Single line pill */}
                  <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                    {getDisciplineBadge(item.assignedSection)}
                  </td>

                  {/* Lead - Single line */}
                  <td style={{ padding: '14px 16px', color: '#27272a', fontWeight: 500, fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                    {item.leadPerson}
                  </td>

                  {/* Target Deadline Date - Single line with date + icon */}
                  <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 600, fontSize: '0.82rem', color: '#000000', whiteSpace: 'nowrap' }}>
                      <Calendar size={13} style={{ color: '#000000', flexShrink: 0 }} />
                      <span style={{ whiteSpace: 'nowrap' }}>{item.deadline}</span>
                    </div>
                  </td>

                  {/* Days Left badge - Single line */}
                  <td style={{ padding: '14px 14px', whiteSpace: 'nowrap' }}>
                    {item.status === 'Completed' ? (
                      <span style={{ fontSize: '0.76rem', color: '#000000', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
                        <CheckCircle2 size={13} style={{ color: '#000000' }} /> Done
                      </span>
                    ) : item.isOverdue ? (
                      <span className="badge badge-dark" style={{ fontWeight: 700, whiteSpace: 'nowrap', fontSize: '0.72rem', padding: '2px 7px' }}>
                        Overdue {Math.abs(item.daysRemaining)}d
                      </span>
                    ) : item.isUrgent ? (
                      <span
                        style={{
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          backgroundColor: '#000000',
                          color: '#ffffff',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          whiteSpace: 'nowrap',
                          display: 'inline-block',
                        }}
                      >
                        {item.daysRemaining}d Left
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.78rem', color: '#27272a', fontWeight: 600, whiteSpace: 'nowrap' }}>
                        {item.daysRemaining}d
                      </span>
                    )}
                  </td>

                  {/* Status - Single line pill */}
                  <td style={{ padding: '14px 14px', whiteSpace: 'nowrap' }}>
                    {getStatusBadge(item.status)}
                  </td>

                  {/* Actions - Single line button */}
                  <td style={{ padding: '14px 20px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'inline-flex', gap: '6px', whiteSpace: 'nowrap' }}>
                      {item.status !== 'Completed' ? (
                        <button
                          onClick={() => handleStatusChange(item.projectId, item.phaseId, 'Completed')}
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '0.74rem', padding: '4px 10px', whiteSpace: 'nowrap' }}
                          title="Mark Phase as Completed"
                        >
                          <CheckCircle2 size={12} style={{ color: '#000000' }} />
                          <span>Complete</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStatusChange(item.projectId, item.phaseId, 'In Progress')}
                          className="btn btn-ghost btn-sm"
                          style={{ fontSize: '0.72rem', padding: '4px 8px', color: '#71717a', whiteSpace: 'nowrap' }}
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
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e4e4e7' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#000000' }}>
                Phase Deliverables Checklist
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#52525b', marginTop: '2px' }}>
                {selectedItemDeliverables.name}
              </p>
            </div>
            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {selectedItemDeliverables.deliverables.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 12px',
                    backgroundColor: '#fafafa',
                    border: '1px solid #e4e4e7',
                    borderRadius: '6px',
                    fontSize: '0.84rem',
                    color: '#000000',
                    fontWeight: 600,
                  }}
                >
                  <CheckCircle2 size={15} style={{ color: '#000000', flexShrink: 0 }} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div style={{ padding: '14px 24px', borderTop: '1px solid #e4e4e7', textAlign: 'right', backgroundColor: '#fafafa' }}>
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
