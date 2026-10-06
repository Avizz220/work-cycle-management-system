'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useProjects } from '@/context/ProjectContext';
import RoleSwitcherModal from './RoleSwitcherModal';
import {
  LayoutDashboard,
  FolderGit2,
  FolderPlus,
  Clock,
  MessageSquare,
  Users,
  LogOut,
  RefreshCw,
  Zap,
  Building2,
  Droplets,
  Compass,
  PlayCircle,
} from 'lucide-react';
import DG5SplashIntro from './DG5SplashIntro';

export default function Sidebar() {
  const pathname = usePathname();
  const { currentUser, isPM, logout } = useAuth();
  const { urgentDeadlines } = useProjects();
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(false);

  const navItems = [
    {
      label: 'Dashboard',
      href: '/',
      icon: <LayoutDashboard size={18} />,
    },
    {
      label: 'Projects Directory',
      href: '/projects',
      icon: <FolderGit2 size={18} />,
    },
    {
      label: 'Add Project & Phases',
      href: '/projects/new',
      icon: <FolderPlus size={18} />,
      badge: isPM ? 'PM' : undefined,
    },
    {
      label: 'Deadlines & Schedules',
      href: '/deadlines',
      icon: <Clock size={18} />,
      urgentCount: urgentDeadlines.length,
    },
    {
      label: 'Discipline Hubs',
      href: '/disciplines',
      icon: <MessageSquare size={18} />,
    },
    {
      label: 'Team Directory',
      href: '/team',
      icon: <Users size={18} />,
    },
  ];

  return (
    <>
      <aside
        style={{
          width: '260px',
          backgroundColor: '#ffffff',
          borderRight: '1px solid var(--border-light)',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          height: '100vh',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}
      >
        {/* Brand Header */}
        <div
          style={{
            padding: '20px 20px 16px',
            borderBottom: '1px solid var(--border-light)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/resources/Main-LOGO.png"
              alt="DG 5 The Design Group Five"
              style={{
                height: '42px',
                width: 'auto',
                objectFit: 'contain',
              }}
            />
          </Link>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div
              style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                color: 'var(--text-muted)',
                letterSpacing: '0.02em',
              }}
            >
              Work Management System
            </div>
            <button
              type="button"
              onClick={() => setShowSplash(true)}
              title="Play Creative DG5 Brand Intro Animation"
              style={{
                background: 'none',
                border: 'none',
                color: '#0284c7',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
                fontSize: '0.68rem',
                fontWeight: 600,
                padding: '2px 6px',
                borderRadius: '4px',
                backgroundColor: '#f0f9ff',
              }}
            >
              <PlayCircle size={11} />
              <span>Intro</span>
            </button>
          </div>
        </div>

        {showSplash && <DG5SplashIntro forceShow onComplete={() => setShowSplash(false)} />}

        {/* Navigation links */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '3px',
          }}
        >
          <div
            style={{
              padding: '6px 12px 4px',
              fontSize: '0.72rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--text-muted)',
            }}
          >
            Menu
          </div>

          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-md)',
                  color: isActive ? '#0f172a' : '#475569',
                  backgroundColor: isActive ? '#eff6ff' : 'transparent',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.86rem',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: isActive ? '#2563eb' : '#64748b' }}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {item.badge && (
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 600,
                        backgroundColor: '#f1f5f9',
                        color: '#475569',
                        border: '1px solid var(--border-light)',
                        padding: '1px 6px',
                        borderRadius: '4px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {item.badge}
                    </span>
                  )}

                  {item.urgentCount !== undefined && item.urgentCount > 0 && (
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        backgroundColor: '#f1f5f9',
                        color: '#334155',
                        border: '1px solid var(--border-light)',
                        padding: '1px 7px',
                        borderRadius: '10px',
                        minWidth: '18px',
                        textAlign: 'center',
                      }}
                      title={`${item.urgentCount} Upcoming Deadlines`}
                    >
                      {item.urgentCount}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}

          {/* Department Hubs Section */}
          <div
            style={{
              marginTop: '20px',
              padding: '6px 12px 4px',
              fontSize: '0.72rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--text-muted)',
            }}
          >
            Sections / Disciplines
          </div>

          <Link
            href="/disciplines?tab=Electrical"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 12px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.84rem',
              color: '#475569',
              transition: 'background 0.15s ease',
            }}
          >
            <Zap size={16} style={{ color: '#64748b' }} />
            <span>Electrical Systems</span>
          </Link>

          <Link
            href="/disciplines?tab=Civil"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 12px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.84rem',
              color: '#475569',
              transition: 'background 0.15s ease',
            }}
          >
            <Building2 size={16} style={{ color: '#64748b' }} />
            <span>Civil & Structural</span>
          </Link>

          <Link
            href="/disciplines?tab=Plumbing"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 12px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.84rem',
              color: '#475569',
              transition: 'background 0.15s ease',
            }}
          >
            <Droplets size={16} style={{ color: '#64748b' }} />
            <span>Plumbing & MEP</span>
          </Link>

          <Link
            href="/disciplines?tab=Architectural"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 12px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.84rem',
              color: '#475569',
              transition: 'background 0.15s ease',
            }}
          >
            <Compass size={16} style={{ color: '#64748b' }} />
            <span>Architecture & Façade</span>
          </Link>
        </div>

        {/* User Card & Role Switcher Bar */}
        <div
          style={{
            padding: '14px 16px',
            borderTop: '1px solid var(--border-light)',
            backgroundColor: '#ffffff',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                alt={currentUser?.name || 'User'}
                style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border-light)', flexShrink: 0 }}
              />
              <div style={{ lineHeight: 1.2, minWidth: 0 }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {currentUser?.name || 'Guest User'}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {isPM
                    ? 'Project Manager'
                    : currentUser?.role === 'hod'
                    ? `${currentUser?.discipline} Head (HOD)`
                    : `${currentUser?.discipline} Specialist`}
                </div>
              </div>
            </div>

            <Link
              href="/login"
              onClick={logout}
              title="Sign Out"
              style={{
                padding: '6px',
                borderRadius: '6px',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                flexShrink: 0,
              }}
            >
              <LogOut size={16} />
            </Link>
          </div>

          {/* 1-Click Role Switch button */}
          <button
            onClick={() => setIsRoleModalOpen(true)}
            className="btn btn-secondary btn-sm"
            style={{
              width: '100%',
              fontSize: '0.76rem',
              fontWeight: 600,
              gap: '6px',
            }}
          >
            <RefreshCw size={12} />
            <span>Switch Role (PM / Lead / Member)</span>
          </button>
        </div>
      </aside>

      <RoleSwitcherModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
      />
    </>
  );
}
