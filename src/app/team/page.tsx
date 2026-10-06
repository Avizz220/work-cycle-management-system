'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import {
  Mail,
  Phone,
  Shield,
  Zap,
  Building2,
  Droplets,
  Compass,
  Check,
  RefreshCw,
} from 'lucide-react';
import { DisciplineType } from '@/types';

export default function TeamDirectoryPage() {
  const { usersList, currentUser, switchUser } = useAuth();
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('All');

  const filteredTeam = usersList.filter((u) => {
    if (selectedDiscipline === 'All') return true;
    return u.discipline === selectedDiscipline;
  });

  const getDisciplineBadge = (disc: DisciplineType) => {
    switch (disc) {
      case 'Management':
        return <span className="badge badge-subtle"><Shield size={12} style={{ color: '#0f172a' }} /> Management</span>;
      case 'Electrical':
        return <span className="badge badge-subtle"><Zap size={12} style={{ color: '#64748b' }} /> Electrical</span>;
      case 'Civil':
        return <span className="badge badge-subtle"><Building2 size={12} style={{ color: '#64748b' }} /> Civil & Struct.</span>;
      case 'Plumbing':
        return <span className="badge badge-subtle"><Droplets size={12} style={{ color: '#64748b' }} /> Plumbing & MEP</span>;
      case 'Architectural':
        return <span className="badge badge-subtle"><Compass size={12} style={{ color: '#64748b' }} /> Architectural</span>;
      default:
        return <span className="badge badge-subtle">General</span>;
    }
  };

  return (
    <div className="app-container">
      <Sidebar />

      <div className="main-wrapper">
        <Navbar
          pageTitle="Multidisciplinary Engineering Team"
          subtitle="Directory of certified consultants, engineers, and project leads"
        />

        <main className="main-content">
          {/* Filter Pills */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
              marginBottom: '20px',
            }}
          >
            {(['All', 'Management', 'Electrical', 'Civil', 'Plumbing', 'Architectural'] as const).map(
              (disc) => {
                const isSelected = selectedDiscipline === disc;
                return (
                  <button
                    key={disc}
                    onClick={() => setSelectedDiscipline(disc)}
                    style={{
                      padding: '7px 14px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.82rem',
                      fontWeight: isSelected ? 600 : 500,
                      backgroundColor: isSelected ? '#0f172a' : '#ffffff',
                      color: isSelected ? '#ffffff' : '#475569',
                      border: `1px solid ${isSelected ? '#0f172a' : 'var(--border-light)'}`,
                      transition: 'all 0.15s ease',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {disc === 'All' ? 'All Team Members' : `${disc}`}
                  </button>
                );
              }
            )}
          </div>

          {/* Team Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '18px',
            }}
          >
            {filteredTeam.map((user) => {
              const isCurrent = currentUser?.id === user.id;
              return (
                <div
                  key={user.id}
                  className="card card-interactive"
                  style={{
                    padding: '22px',
                    border: `1px solid ${isCurrent ? '#94a3b8' : 'var(--border-light)'}`,
                    backgroundColor: '#ffffff',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={user.avatar}
                      alt={user.name}
                      style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '1px solid var(--border-light)',
                        flexShrink: 0,
                      }}
                    />

                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        <h3 style={{ fontSize: '0.98rem', fontWeight: 600, color: 'var(--text-main)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {user.name}
                        </h3>
                        {isCurrent && (
                          <span
                            style={{
                              fontSize: '0.66rem',
                              fontWeight: 600,
                              backgroundColor: '#eff6ff',
                              color: '#2563eb',
                              border: '1px solid #bfdbfe',
                              padding: '1px 6px',
                              borderRadius: '4px',
                            }}
                          >
                            You
                          </span>
                        )}
                      </div>
                      <div style={{ marginTop: '4px' }}>
                        {getDisciplineBadge(user.discipline)}
                      </div>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '14px' }}>
                    {user.title}
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid var(--border-light)',
                      borderRadius: 'var(--radius-md)',
                      padding: '10px 12px',
                      fontSize: '0.78rem',
                      marginBottom: '14px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                      <Mail size={13} style={{ color: '#64748b', flexShrink: 0 }} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                      <Phone size={13} style={{ color: '#64748b', flexShrink: 0 }} />
                      <span>{user.phone}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      Location: Colombo HQ
                    </span>

                    {!isCurrent && (
                      <button
                        onClick={() => switchUser(user.id)}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.74rem', padding: '3px 10px', gap: '4px' }}
                      >
                        <RefreshCw size={12} />
                        <span>Switch to Profile</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
