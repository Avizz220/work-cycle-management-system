'use client';

import React from 'react';
import Link from 'next/link';
import { useProjects } from '@/context/ProjectContext';
import { useAuth } from '@/context/AuthContext';
import { AlertCircle, ArrowRight, Zap, Building2, Droplets, Compass, Clock } from 'lucide-react';
import { DisciplineType } from '@/types';

export default function DeadlinesAlertBanner() {
  const { urgentDeadlines, getDeadlinesByDiscipline } = useProjects();
  const { currentUser, isPM } = useAuth();

  // Find deadlines specific to this logged in employee's section
  const sectionDeadlines = !isPM && currentUser
    ? getDeadlinesByDiscipline(currentUser.discipline).filter(
        (d) => d.status !== 'Completed' && (d.isUrgent || d.isOverdue)
      )
    : [];

  const getDisciplineIcon = (disc: DisciplineType | 'All') => {
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
        return <Clock size={14} style={{ color: '#64748b', flexShrink: 0 }} />;
    }
  };

  if (urgentDeadlines.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        marginBottom: '24px',
        backgroundColor: '#ffffff',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-lg)',
        padding: '18px 24px',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        {/* Pure black icon with NO background box */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <AlertCircle size={22} style={{ color: '#0f172a', flexShrink: 0 }} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-main)', margin: 0, whiteSpace: 'nowrap' }}>
                {isPM
                  ? `Notice: ${urgentDeadlines.length} Critical Project Deadlines Approaching`
                  : sectionDeadlines.length > 0
                  ? `Immediate Priority: ${sectionDeadlines.length} ${currentUser?.discipline} Phase Deadlines Due Soon`
                  : `Notice: ${urgentDeadlines.length} Company-wide Deadlines Approaching`}
              </h2>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  backgroundColor: '#f1f5f9',
                  color: '#475569',
                  border: '1px solid var(--border-light)',
                  padding: '1px 8px',
                  borderRadius: '9999px',
                  whiteSpace: 'nowrap',
                }}
              >
                Priority Action
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Review the delivery schedule and coordinate technical documentation across engineering sections.
            </p>
          </div>
        </div>

        <Link
          href="/deadlines"
          className="btn btn-secondary btn-sm"
          style={{
            fontWeight: 600,
            gap: '6px',
            whiteSpace: 'nowrap',
          }}
        >
          <span>View Master Schedule</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Quick Pills Carousel of approaching deadlines - Soft Light Ash Pills (No Dark Blobs!) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '12px',
        }}
      >
        {urgentDeadlines.slice(0, 3).map((item) => (
          <div
            key={item.phaseId}
            style={{
              backgroundColor: '#f8fafc',
              border: '1px solid var(--border-light)',
              borderRadius: '8px',
              padding: '10px 14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
                {getDisciplineIcon(item.assignedSection)}
                <span style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  {item.assignedSection}
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>• {item.projectCode}</span>
              </div>
              <div
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  marginTop: '2px',
                }}
                title={item.phaseName}
              >
                {item.phaseName}
              </div>
            </div>

            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              {/* Soft Light Ash Pill instead of Dark Blob */}
              <span
                style={{
                  display: 'inline-block',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: item.isOverdue ? '#991b1b' : '#92400e',
                  backgroundColor: item.isOverdue ? '#fef2f2' : '#fffbeb',
                  border: `1px solid ${item.isOverdue ? '#fecaca' : '#fde68a'}`,
                  padding: '2px 8px',
                  borderRadius: '4px',
                  whiteSpace: 'nowrap',
                }}
              >
                {item.isOverdue ? `Overdue ${Math.abs(item.daysRemaining)}d` : `${item.daysRemaining}d Left`}
              </span>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px', whiteSpace: 'nowrap' }}>
                {item.deadline}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
