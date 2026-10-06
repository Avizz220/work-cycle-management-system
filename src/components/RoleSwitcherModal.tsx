'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Check, Shield, Briefcase, Zap, Building2, Droplets, Compass, X } from 'lucide-react';
import { DisciplineType } from '@/types';

interface RoleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RoleSwitcherModal({ isOpen, onClose }: RoleSwitcherModalProps) {
  const { usersList, currentUser, switchUser } = useAuth();

  if (!isOpen) return null;

  const getDisciplineIcon = (discipline: DisciplineType) => {
    switch (discipline) {
      case 'Management':
        return <Shield size={15} style={{ color: '#0f172a' }} />;
      case 'Electrical':
        return <Zap size={15} style={{ color: '#64748b' }} />;
      case 'Civil':
        return <Building2 size={15} style={{ color: '#64748b' }} />;
      case 'Plumbing':
        return <Droplets size={15} style={{ color: '#64748b' }} />;
      case 'Architectural':
        return <Compass size={15} style={{ color: '#64748b' }} />;
      default:
        return <Briefcase size={15} style={{ color: '#64748b' }} />;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '560px' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
              Quick Demo Role Switcher
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Switch instantly between Project Manager and Discipline Engineers.
            </p>
          </div>
          <button onClick={onClose} style={{ padding: '6px', borderRadius: '6px', color: 'var(--text-muted)' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {usersList.map((user) => {
            const isSelected = currentUser?.id === user.id;
            return (
              <div
                key={user.id}
                onClick={() => {
                  switchUser(user.id);
                  onClose();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: `1px solid ${isSelected ? '#94a3b8' : 'var(--border-light)'}`,
                  backgroundColor: isSelected ? '#f8fafc' : '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={user.avatar}
                    alt={user.name}
                    style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border-light)', flexShrink: 0 }}
                  />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-main)' }}>
                        {user.name}
                      </span>
                      {user.role === 'pm' ? (
                        <span className="badge badge-subtle" style={{ fontSize: '0.66rem' }}>
                          Project Manager
                        </span>
                      ) : user.role === 'hod' ? (
                        <span
                          style={{
                            fontSize: '0.66rem',
                            fontWeight: 700,
                            backgroundColor: '#e0f2fe',
                            color: '#0369a1',
                            border: '1px solid #bae6fd',
                            padding: '1px 6px',
                            borderRadius: '4px',
                          }}
                        >
                          {user.discipline} Head (HOD)
                        </span>
                      ) : (
                        <span className="badge badge-subtle" style={{ fontSize: '0.66rem' }}>
                          {user.discipline} Specialist
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {getDisciplineIcon(user.discipline)}
                      <span>{user.title}</span>
                      <span style={{ color: '#94a3b8' }}>• {user.email}</span>
                    </div>
                  </div>
                </div>

                <div style={{ flexShrink: 0, marginLeft: '12px' }}>
                  {isSelected ? (
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: '#16a34a',
                        fontWeight: 600,
                        fontSize: '0.8rem',
                      }}
                    >
                      <Check size={16} /> Active
                    </span>
                  ) : (
                    <button className="btn btn-secondary btn-sm" style={{ pointerEvents: 'none', fontSize: '0.74rem', padding: '3px 8px' }}>
                      Switch
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            padding: '14px 20px',
            backgroundColor: '#f8fafc',
            borderTop: '1px solid var(--border-light)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.76rem',
            color: 'var(--text-muted)',
            borderBottomLeftRadius: 'var(--radius-xl)',
            borderBottomRightRadius: 'var(--radius-xl)',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          <span>PM: <strong style={{ color: 'var(--text-main)' }}>admin123</strong> • HODs: <strong style={{ color: 'var(--text-main)' }}>lead123</strong> • Members: <strong style={{ color: 'var(--text-main)' }}>user123</strong></span>
          <button className="btn btn-primary btn-sm" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
