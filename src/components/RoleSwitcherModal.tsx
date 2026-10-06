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
        return <Shield size={16} style={{ color: '#000000' }} />;
      case 'Electrical':
        return <Zap size={16} style={{ color: '#000000' }} />;
      case 'Civil':
        return <Building2 size={16} style={{ color: '#000000' }} />;
      case 'Plumbing':
        return <Droplets size={16} style={{ color: '#000000' }} />;
      case 'Architectural':
        return <Compass size={16} style={{ color: '#000000' }} />;
      default:
        return <Briefcase size={16} style={{ color: '#000000' }} />;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid #e4e4e7', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#000000' }}>
              Quick Demo Role Switcher
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#52525b', marginTop: '4px' }}>
              Switch instantly between Project Manager and Discipline Engineers.
            </p>
          </div>
          <button onClick={onClose} style={{ padding: '6px', borderRadius: '6px', color: '#000000' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
                  padding: '14px 18px',
                  borderRadius: '10px',
                  border: isSelected ? '2px solid #000000' : '1px solid #e4e4e7',
                  backgroundColor: isSelected ? '#f4f4f5' : '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={user.avatar}
                    alt={user.name}
                    style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #000000' }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#000000' }}>
                        {user.name}
                      </span>
                      {user.role === 'pm' ? (
                        <span className="badge badge-dark" style={{ fontSize: '0.68rem' }}>
                          Project Manager
                        </span>
                      ) : (
                        <span className="badge badge-subtle" style={{ fontSize: '0.68rem' }}>
                          {user.discipline} Section
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#52525b', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {getDisciplineIcon(user.discipline)}
                      <span>{user.title}</span>
                      <span style={{ color: '#71717a' }}>• {user.email}</span>
                    </div>
                  </div>
                </div>

                <div>
                  {isSelected ? (
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: '#000000',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                      }}
                    >
                      <Check size={18} /> Active
                    </span>
                  ) : (
                    <button className="btn btn-secondary btn-sm" style={{ pointerEvents: 'none' }}>
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
            padding: '16px 24px',
            backgroundColor: '#f4f4f5',
            borderTop: '1px solid #e4e4e7',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.82rem',
            color: '#52525b',
            borderBottomLeftRadius: 'var(--radius-xl)',
            borderBottomRightRadius: 'var(--radius-xl)',
          }}
        >
          <span>Credentials: PM: <strong>admin123</strong> | Employees: <strong>emp123</strong></span>
          <button className="btn btn-primary btn-sm" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
