'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useProjects } from '@/context/ProjectContext';
import RoleSwitcherModal from './RoleSwitcherModal';
import {
  Bell,
  Search,
  Shield,
  Zap,
  Building2,
  Droplets,
  Compass,
  ChevronDown,
  AlertTriangle,
  FolderPlus,
  Clock,
} from 'lucide-react';

interface NavbarProps {
  pageTitle?: string;
  subtitle?: string;
}

export default function Navbar({ pageTitle = 'Dashboard Overview', subtitle }: NavbarProps) {
  const { currentUser, isPM } = useAuth();
  const { urgentDeadlines, pmNotifications, markNotificationRead } = useProjects();
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifTab, setNotifTab] = useState<'completions' | 'deadlines'>('completions');

  const unreadPMCount = isPM ? pmNotifications.filter((n) => !n.read).length : 0;
  const totalNotificationBadge = isPM ? unreadPMCount + urgentDeadlines.length : urgentDeadlines.length;

  const getDisciplineIcon = () => {
    switch (currentUser?.discipline) {
      case 'Management':
        return <Shield size={13} style={{ color: '#64748b' }} />;
      case 'Electrical':
        return <Zap size={13} style={{ color: '#64748b' }} />;
      case 'Civil':
        return <Building2 size={13} style={{ color: '#64748b' }} />;
      case 'Plumbing':
        return <Droplets size={13} style={{ color: '#64748b' }} />;
      case 'Architectural':
        return <Compass size={13} style={{ color: '#64748b' }} />;
      default:
        return null;
    }
  };

  return (
    <>
      <header
        style={{
          height: '66px',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
          position: 'sticky',
          top: 0,
          zIndex: 30,
        }}
      >
        {/* Left: Page Title */}
        <div>
          <h1 style={{ fontSize: '1.18rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.2 }}>
            {pageTitle}
          </h1>
          {subtitle && (
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Right: Controls & Role Banner */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Search bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#f8fafc',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-md)',
              padding: '6px 12px',
              width: '230px',
            }}
          >
            <Search size={15} style={{ color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search projects, drawings..."
              style={{
                border: 'none',
                background: 'transparent',
                fontSize: '0.82rem',
                width: '100%',
                color: 'var(--text-main)',
              }}
            />
          </div>

          {/* New Project Button */}
          {isPM && (
            <Link
              href="/projects/new"
              className="btn btn-primary btn-sm"
              style={{ gap: '6px' }}
            >
              <FolderPlus size={15} />
              <span>Add Project</span>
            </Link>
          )}

          {/* Notification Bell */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              style={{
                position: 'relative',
                padding: '7px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
                backgroundColor: '#ffffff',
                color: '#475569',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease',
              }}
              title={isPM ? "Project Notifications & Deadlines" : "Deadlines Notification"}
            >
              <Bell size={17} />
              {totalNotificationBadge > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    backgroundColor: unreadPMCount > 0 ? '#166534' : '#0f172a',
                    color: '#ffffff',
                    fontSize: '0.64rem',
                    fontWeight: 700,
                    borderRadius: '9999px',
                    minWidth: '16px',
                    height: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 3px',
                    border: '1px solid #ffffff',
                  }}
                >
                  {totalNotificationBadge}
                </span>
              )}
            </button>

            {/* Notification Menu */}
            {showNotifications && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '42px',
                  width: '380px',
                  backgroundColor: '#ffffff',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-lg)',
                  border: '1px solid var(--border-light)',
                  padding: '16px',
                  zIndex: 50,
                }}
              >
                {/* Header & Tabs for PM */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '10px',
                    paddingBottom: '8px',
                    borderBottom: '1px solid var(--border-light)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, fontSize: '0.86rem', color: 'var(--text-main)' }}>
                    <Bell size={15} style={{ color: '#0f172a' }} />
                    <span>{isPM ? 'Notifications & Milestones' : 'Project Deadlines Alert'}</span>
                  </div>

                  {isPM && (
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        type="button"
                        onClick={() => setNotifTab('completions')}
                        style={{
                          fontSize: '0.72rem',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontWeight: notifTab === 'completions' ? 600 : 500,
                          backgroundColor: notifTab === 'completions' ? '#0f172a' : '#f1f5f9',
                          color: notifTab === 'completions' ? '#ffffff' : '#475569',
                        }}
                      >
                        Completions ({unreadPMCount})
                      </button>
                      <button
                        type="button"
                        onClick={() => setNotifTab('deadlines')}
                        style={{
                          fontSize: '0.72rem',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontWeight: notifTab === 'deadlines' ? 600 : 500,
                          backgroundColor: notifTab === 'deadlines' ? '#0f172a' : '#f1f5f9',
                          color: notifTab === 'deadlines' ? '#ffffff' : '#475569',
                        }}
                      >
                        Deadlines ({urgentDeadlines.length})
                      </button>
                    </div>
                  )}
                </div>

                {/* Body: PM Completion Notifications (Exclusive to Project Manager) */}
                {isPM && notifTab === 'completions' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto' }}>
                    {pmNotifications.length === 0 ? (
                      <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                        No completion notifications yet.
                      </div>
                    ) : (
                      pmNotifications.map((notif) => (
                        <div
                          key={notif.id}
                          style={{
                            padding: '10px 12px',
                            backgroundColor: notif.read ? '#f8fafc' : '#f0fdf4',
                            borderRadius: '6px',
                            border: `1px solid ${notif.read ? 'var(--border-light)' : '#bbf7d0'}`,
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '6px' }}>
                            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: notif.read ? 'var(--text-main)' : '#166534' }}>
                              {notif.title}
                            </span>
                            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                              {notif.timestamp}
                            </span>
                          </div>

                          <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
                            {notif.message}
                          </p>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                            <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 500 }}>
                              Contract: <strong>{notif.projectCode}</strong>
                            </span>
                            {!notif.read && (
                              <button
                                type="button"
                                onClick={() => markNotificationRead(notif.id)}
                                style={{ fontSize: '0.7rem', color: '#166534', fontWeight: 600, textDecoration: 'underline' }}
                              >
                                Mark read
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                ) : (
                  /* Body: Deadlines List (Shown for Employees and PM deadlines tab) */
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto' }}>
                    {urgentDeadlines.length === 0 ? (
                      <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                        No urgent deadlines approaching!
                      </div>
                    ) : (
                      urgentDeadlines.map((dl) => (
                        <div
                          key={dl.phaseId}
                          style={{
                            padding: '9px 12px',
                            backgroundColor: '#f8fafc',
                            borderRadius: '6px',
                            border: '1px solid var(--border-light)',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }}>
                              {dl.phaseName}
                            </span>
                            <span
                              style={{
                                fontSize: '0.68rem',
                                fontWeight: 600,
                                color: dl.isOverdue ? '#991b1b' : '#92400e',
                                backgroundColor: dl.isOverdue ? '#fef2f2' : '#fffbeb',
                                padding: '1px 5px',
                                borderRadius: '4px',
                              }}
                            >
                              {dl.isOverdue ? `Overdue ${Math.abs(dl.daysRemaining)}d` : `${dl.daysRemaining}d left`}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                            {dl.projectCode} • Section: <strong>{dl.assignedSection}</strong>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px solid var(--border-light)', textAlign: 'center' }}>
                  <Link
                    href="/deadlines"
                    onClick={() => setShowNotifications(false)}
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: '#2563eb',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Clock size={13} /> View Master Deadlines Timeline →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Quick Active Role Pill */}
          <div
            onClick={() => setIsRoleModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#f8fafc',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-md)',
              padding: '5px 10px',
              cursor: 'pointer',
              transition: 'background 0.15s ease',
            }}
            title="Click to switch role / user"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={currentUser?.name || 'User'}
              style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border-light)' }}
            />
            <div style={{ lineHeight: 1.2 }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }}>
                {currentUser?.name?.split(' ')[0]} {currentUser?.name?.split(' ')[1]}
              </div>
              <div
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                  color: 'var(--text-muted)',
                }}
              >
                {getDisciplineIcon()}
                <span>{isPM ? 'Project Manager' : `${currentUser?.discipline} Engineer`}</span>
              </div>
            </div>
            <ChevronDown size={13} style={{ color: '#94a3b8' }} />
          </div>
        </div>
      </header>

      <RoleSwitcherModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
      />
    </>
  );
}
