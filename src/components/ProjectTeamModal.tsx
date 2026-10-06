'use client';

import React, { useState } from 'react';
import { useProjects } from '@/context/ProjectContext';
import { useAuth } from '@/context/AuthContext';
import { Project, DisciplineType, User } from '@/types';
import {
  X,
  Search,
  UserPlus,
  Trash2,
  Check,
  Zap,
  Building2,
  Droplets,
  Compass,
  Users,
  Shield,
  Layers,
} from 'lucide-react';

interface ProjectTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

export default function ProjectTeamModal({
  isOpen,
  onClose,
  project,
}: ProjectTeamModalProps) {
  const { assignMembersToProject, removeMemberFromProject, assignMembersToPhase } = useProjects();
  const { usersList } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhaseId, setSelectedPhaseId] = useState<string>(project.phases[0]?.id || '');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentAssignedIds = project.assignedMemberIds || [];

  const assignedUsers = usersList.filter((u) => currentAssignedIds.includes(u.id));

  const availableUsers = usersList.filter(
    (u) =>
      !currentAssignedIds.includes(u.id) &&
      (u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.discipline.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleAddMember = (user: User) => {
    assignMembersToProject(project.id, [user.id]);
    showToast(`Added ${user.name} to ${project.code}.`);
  };

  const handleRemoveMember = (user: User) => {
    removeMemberFromProject(project.id, user.id);
    showToast(`Removed ${user.name} from project roster.`);
  };

  // Bulk add whole division
  const handleBulkAddDivision = (discipline: DisciplineType) => {
    const divisionUsers = usersList.filter((u) => u.discipline === discipline);
    const divisionIds = divisionUsers.map((u) => u.id);
    assignMembersToProject(project.id, divisionIds);
    showToast(`Added all ${divisionUsers.length} members of ${discipline} Division.`);
  };

  const getDisciplineIcon = (disc: DisciplineType) => {
    switch (disc) {
      case 'Electrical':
        return <Zap size={13} style={{ color: '#64748b' }} />;
      case 'Civil':
        return <Building2 size={13} style={{ color: '#64748b' }} />;
      case 'Plumbing':
        return <Droplets size={13} style={{ color: '#64748b' }} />;
      case 'Architectural':
        return <Compass size={13} style={{ color: '#64748b' }} />;
      default:
        return <Shield size={13} style={{ color: '#64748b' }} />;
    }
  };

  const currentPhase = project.phases.find((p) => p.id === selectedPhaseId);
  const phaseAssignedIds = currentPhase?.assignedMemberIds || [];

  const handleTogglePhaseMember = (userId: string) => {
    if (!currentPhase) return;
    const isAssigned = phaseAssignedIds.includes(userId);
    const nextIds = isAssigned
      ? phaseAssignedIds.filter((id) => id !== userId)
      : [...phaseAssignedIds, userId];

    assignMembersToPhase(project.id, currentPhase.id, nextIds);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '780px',
          width: '95%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-light)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-light)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            backgroundColor: '#ffffff',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  backgroundColor: '#f1f5f9',
                  color: '#334155',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  border: '1px solid var(--border-light)',
                }}
              >
                {project.code}
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {project.title}
              </span>
            </div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
              Assign Multidisciplinary Project Team & Phase Tasks
            </h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Assign individual engineers, add entire engineering divisions with 1-click, or map engineers to specific phases.
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              padding: '6px',
              borderRadius: '6px',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              border: 'none',
              background: 'transparent',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Toast alert banner */}
        {toastMessage && (
          <div
            style={{
              padding: '8px 24px',
              backgroundColor: '#f0fdf4',
              borderBottom: '1px solid #bbf7d0',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8rem',
              color: '#166534',
              fontWeight: 600,
            }}
          >
            <Check size={14} />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Content body */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            backgroundColor: '#f8fafc',
          }}
        >
          {/* Quick-Add Entire Division Buttons */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ fontSize: '0.76rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '0.04em' }}>
              1-Click Bulk Add Engineering Divisions
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => handleBulkAddDivision('Electrical')}
                className="btn btn-secondary btn-sm"
                style={{ gap: '6px', fontSize: '0.76rem' }}
              >
                <Zap size={13} style={{ color: '#64748b' }} />
                <span>+ Add All Electrical Team (3)</span>
              </button>

              <button
                type="button"
                onClick={() => handleBulkAddDivision('Civil')}
                className="btn btn-secondary btn-sm"
                style={{ gap: '6px', fontSize: '0.76rem' }}
              >
                <Building2 size={13} style={{ color: '#64748b' }} />
                <span>+ Add All Civil Team (3)</span>
              </button>

              <button
                type="button"
                onClick={() => handleBulkAddDivision('Plumbing')}
                className="btn btn-secondary btn-sm"
                style={{ gap: '6px', fontSize: '0.76rem' }}
              >
                <Droplets size={13} style={{ color: '#64748b' }} />
                <span>+ Add All Plumbing Team (3)</span>
              </button>

              <button
                type="button"
                onClick={() => handleBulkAddDivision('Architectural')}
                className="btn btn-secondary btn-sm"
                style={{ gap: '6px', fontSize: '0.76rem' }}
              >
                <Compass size={13} style={{ color: '#64748b' }} />
                <span>+ Add All Architecture Team (3)</span>
              </button>
            </div>
          </div>

          {/* Search & Add Specific Members */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ fontSize: '0.76rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '0.04em' }}>
              Search & Add Individual Engineers
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#f8fafc',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                padding: '6px 12px',
                marginBottom: '12px',
              }}
            >
              <Search size={14} style={{ color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search by name, role, or discipline (e.g. Kevin, Civil, Substation)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  fontSize: '0.82rem',
                  width: '100%',
                  color: 'var(--text-main)',
                  outline: 'none',
                }}
              />
            </div>

            {/* Filtered available members */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '180px', overflowY: 'auto' }}>
              {availableUsers.length === 0 ? (
                <div style={{ padding: '16px', textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {searchQuery ? 'No unassigned members match your search.' : 'All registered engineers are currently assigned.'}
                </div>
              ) : (
                availableUsers.map((user) => (
                  <div
                    key={user.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid var(--border-light)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={user.avatar}
                        alt={user.name}
                        style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border-light)' }}
                      />
                      <div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)' }}>
                          {user.name}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {user.title} • {user.discipline}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddMember(user)}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.74rem', padding: '3px 8px', gap: '4px' }}
                    >
                      <UserPlus size={12} />
                      <span>Add</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Currently Assigned Project Roster */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ fontSize: '0.76rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
                Active Project Team ({assignedUsers.length} Engineers)
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '8px' }}>
              {assignedUsers.map((user) => (
                <div
                  key={user.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    backgroundColor: '#ffffff',
                    border: '1px solid var(--border-light)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={user.avatar}
                      alt={user.name}
                      style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border-light)', flexShrink: 0 }}
                    />
                    <div style={{ minWidth: 0, lineHeight: 1.2 }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {user.name}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {getDisciplineIcon(user.discipline)}
                        <span>{user.discipline}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveMember(user)}
                    style={{
                      padding: '4px',
                      borderRadius: '4px',
                      color: '#94a3b8',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      flexShrink: 0,
                    }}
                    title="Remove from project"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Map Engineers to Specific Phase Tasks */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ fontSize: '0.76rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '0.04em' }}>
              Assign Engineers to Specific Phase Tasks
            </div>

            {/* Select phase */}
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>Select Project Phase:</label>
              <select
                value={selectedPhaseId}
                onChange={(e) => setSelectedPhaseId(e.target.value)}
                className="select-input"
                style={{
                  width: '100%',
                  marginTop: '4px',
                  padding: '6px 12px',
                  fontSize: '0.82rem',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: '#ffffff',
                }}
              >
                {project.phases.map((ph) => (
                  <option key={ph.id} value={ph.id}>
                    Phase {ph.phaseNumber}: {ph.name} ({ph.assignedSection})
                  </option>
                ))}
              </select>
            </div>

            {/* Checkboxes to toggle engineers for this phase */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '6px' }}>
              {assignedUsers.map((u) => {
                const isSelected = phaseAssignedIds.includes(u.id);
                return (
                  <label
                    key={u.id}
                    onClick={() => handleTogglePhaseMember(u.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '6px 10px',
                      borderRadius: '4px',
                      border: `1px solid ${isSelected ? '#94a3b8' : 'var(--border-light)'}`,
                      backgroundColor: isSelected ? '#f1f5f9' : '#ffffff',
                      cursor: 'pointer',
                      fontSize: '0.78rem',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      readOnly
                      style={{ cursor: 'pointer' }}
                    />
                    <span style={{ fontWeight: isSelected ? 600 : 400, color: 'var(--text-main)' }}>
                      {u.name} ({u.discipline})
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '14px 24px',
            backgroundColor: '#ffffff',
            borderTop: '1px solid var(--border-light)',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            className="btn btn-primary btn-sm"
            style={{ padding: '6px 18px' }}
          >
            Save & Finish
          </button>
        </div>
      </div>
    </div>
  );
}
