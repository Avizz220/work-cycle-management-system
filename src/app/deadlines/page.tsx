'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import DeadlinesTable from '@/components/DeadlinesTable';
import { useProjects } from '@/context/ProjectContext';
import {
  Clock,
  AlertTriangle,
  Calendar,
  CheckCircle2,
} from 'lucide-react';

export default function DeadlinesSchedulePage() {
  const { allDeadlines } = useProjects();

  const within7Days = allDeadlines.filter(
    (d) => d.status !== 'Completed' && d.daysRemaining >= 0 && d.daysRemaining <= 7
  );

  const within30Days = allDeadlines.filter(
    (d) => d.status !== 'Completed' && d.daysRemaining > 7 && d.daysRemaining <= 30
  );

  const overdue = allDeadlines.filter((d) => d.status !== 'Completed' && d.daysRemaining < 0);

  return (
    <div className="app-container">
      <Sidebar />

      <div className="main-wrapper">
        <Navbar
          pageTitle="Master Deadlines & Engineering Schedules"
          subtitle="Real-time delivery tracker for all multidisciplinary design phases"
        />

        <main className="main-content">
          {/* Header Summary Cards - Crisp Light White Style with Pure Black Icons */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '16px',
              marginBottom: '24px',
            }}
          >
            {/* Overdue Card */}
            <div
              className="card"
              style={{
                padding: '20px',
                border: '1px solid #000000',
                backgroundColor: '#ffffff',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase', color: '#000000', letterSpacing: '0.04em' }}>
                  Overdue Submissions
                </span>
                <AlertTriangle size={20} style={{ color: '#000000' }} />
              </div>
              <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#000000', marginTop: '6px' }}>
                {overdue.length} Phases
              </div>
              <div style={{ fontSize: '0.75rem', color: '#71717a', marginTop: '4px' }}>
                Requires priority coordination
              </div>
            </div>

            {/* Within 7 Days */}
            <div
              className="card"
              style={{
                padding: '20px',
                border: '1px solid #000000',
                backgroundColor: '#ffffff',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase', color: '#000000', letterSpacing: '0.04em' }}>
                  Due Within 7 Days
                </span>
                <Clock size={20} style={{ color: '#000000' }} />
              </div>
              <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#000000', marginTop: '6px' }}>
                {within7Days.length} Deliverables
              </div>
              <div style={{ fontSize: '0.75rem', color: '#71717a', marginTop: '4px' }}>
                Sprint milestones
              </div>
            </div>

            {/* Within 30 Days */}
            <div className="card" style={{ padding: '20px', border: '1px solid #e4e4e7', backgroundColor: '#ffffff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase', color: '#71717a', letterSpacing: '0.04em' }}>
                  Due Within 30 Days
                </span>
                <Calendar size={20} style={{ color: '#000000' }} />
              </div>
              <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#000000', marginTop: '6px' }}>
                {within30Days.length} Phases
              </div>
              <div style={{ fontSize: '0.75rem', color: '#71717a', marginTop: '4px' }}>
                Upcoming statutory approvals
              </div>
            </div>

            {/* Total Milestones */}
            <div className="card" style={{ padding: '20px', border: '1px solid #e4e4e7', backgroundColor: '#ffffff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase', color: '#71717a', letterSpacing: '0.04em' }}>
                  Total Tracked Phases
                </span>
                <CheckCircle2 size={20} style={{ color: '#000000' }} />
              </div>
              <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#000000', marginTop: '6px' }}>
                {allDeadlines.length}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#71717a', marginTop: '4px' }}>
                Across all DG5 contracts
              </div>
            </div>
          </div>

          {/* Master Deadlines Table */}
          <DeadlinesTable initialDiscipline="All" showFilters={true} />
        </main>
      </div>
    </div>
  );
}
