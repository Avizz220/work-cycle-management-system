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
        return <Zap size={14} style={{ color: '#000000', flexShrink: 0 }} />;
      case 'Civil':
        return <Building2 size={14} style={{ color: '#000000', flexShrink: 0 }} />;
      case 'Plumbing':
        return <Droplets size={14} style={{ color: '#000000', flexShrink: 0 }} />;
      case 'Architectural':
        return <Compass size={14} style={{ color: '#000000', flexShrink: 0 }} />;
      default:
        return <Clock size={14} style={{ color: '#000000', flexShrink: 0 }} />;
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
        border: '1px solid #000000',
        borderRadius: 'var(--radius-lg)',
        padding: '18px 24px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
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
          <AlertCircle size={24} style={{ color: '#000000', flexShrink: 0 }} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#000000', margin: 0, whiteSpace: 'nowrap' }}>
                {isPM
                  ? `Notice: ${urgentDeadlines.length} Critical Project Deadlines Approaching`
                  : sectionDeadlines.length > 0
                  ? `Immediate Priority: ${sectionDeadlines.length} ${currentUser?.discipline} Phase Deadlines Due Soon`
                  : `Notice: ${urgentDeadlines.length} Company-wide Deadlines Approaching`}
              </h2>
              <span className="badge badge-dark" style={{ fontSize: '0.68rem', padding: '2px 8px', whiteSpace: 'nowrap' }}>
                Priority Action
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#52525b', marginTop: '3px' }}>
              Review the delivery schedule and coordinate technical documentation across engineering sections.
            </p>
          </div>
        </div>

        <Link
          href="/deadlines"
          className="btn btn-secondary btn-sm"
          style={{
            fontWeight: 700,
            gap: '6px',
            whiteSpace: 'nowrap',
          }}
        >
          <span>View Master Schedule</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Quick Pills Carousel of approaching deadlines - Clean Single Line Layout */}
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
              backgroundColor: '#fafafa',
              border: '1px solid #e4e4e7',
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
                <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#000000' }}>
                  {item.assignedSection}
                </span>
                <span style={{ fontSize: '0.72rem', color: '#71717a' }}>• {item.projectCode}</span>
              </div>
              <div
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: '#000000',
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
              <span
                style={{
                  display: 'inline-block',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  backgroundColor: '#000000',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  whiteSpace: 'nowrap',
                }}
              >
                {item.isOverdue ? `Overdue ${Math.abs(item.daysRemaining)}d` : `${item.daysRemaining}d Left`}
              </span>
              <div style={{ fontSize: '0.7rem', color: '#71717a', marginTop: '2px', whiteSpace: 'nowrap' }}>
                {item.deadline}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
