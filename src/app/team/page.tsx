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
        return <span className="badge badge-dark"><Shield size={12} /> Management</span>;
      case 'Electrical':
        return <span className="badge badge-subtle"><Zap size={12} style={{ color: '#000000' }} /> Electrical</span>;
      case 'Civil':
        return <span className="badge badge-subtle"><Building2 size={12} style={{ color: '#000000' }} /> Civil & Struct.</span>;
      case 'Plumbing':
        return <span className="badge badge-subtle"><Droplets size={12} style={{ color: '#000000' }} /> Plumbing & MEP</span>;
      case 'Architectural':
        return <span className="badge badge-subtle"><Compass size={12} style={{ color: '#000000' }} /> Architectural</span>;
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
              marginBottom: '24px',
            }}
          >
            {(['All', 'Management', 'Electrical', 'Civil', 'Plumbing', 'Architectural'] as const).map(
              (disc) => (
                <button
                  key={disc}
                  onClick={() => setSelectedDiscipline(disc)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    backgroundColor: selectedDiscipline === disc ? '#000000' : '#ffffff',
                    color: selectedDiscipline === disc ? '#ffffff' : '#000000',
                    border: '1px solid #000000',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {disc === 'All' ? 'All Team Members' : `${disc}`}
                </button>
              )
            )}
          </div>

          {/* Team Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '20px',
            }}
          >
            {filteredTeam.map((user) => {
              const isCurrent = currentUser?.id === user.id;
              return (
                <div
                  key={user.id}
                  className="card card-interactive"
                  style={{
                    padding: '24px',
                    border: isCurrent ? '2px solid #000000' : '1px solid #e4e4e7',
                    backgroundColor: isCurrent ? '#f4f4f5' : '#ffffff',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={user.avatar}
                      alt={user.name}
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid #000000',
                      }}
                    />

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#000000' }}>
                          {user.name}
                        </h3>
                      </div>
                      <div style={{ marginTop: '3px' }}>
                        {getDisciplineBadge(user.discipline)}
                      </div>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.84rem', fontWeight: 600, color: '#52525b', marginBottom: '16px' }}>
                    {user.title}
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #e4e4e7',
                      borderRadius: '8px',
                      padding: '12px 14px',
                      fontSize: '0.8rem',
                      marginBottom: '16px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#27272a' }}>
                      <Mail size={14} style={{ color: '#000000' }} />
                      <span>{user.email}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#27272a' }}>
                      <Phone size={14} style={{ color: '#000000' }} />
                      <span>{user.phone}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.74rem', color: '#71717a' }}>
                      Soft Pass: <strong>{user.role === 'pm' ? 'admin123' : 'emp123'}</strong>
                    </span>

                    {isCurrent ? (
                      <span
                        style={{
                          fontSize: '0.78rem',
                          fontWeight: 800,
                          color: '#000000',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <Check size={16} /> Currently Active
                      </span>
                    ) : (
                      <button
                        onClick={() => switchUser(user.id)}
                        className="btn btn-secondary btn-sm"
                        style={{ gap: '6px', fontSize: '0.78rem' }}
                      >
                        <RefreshCw size={13} />
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
