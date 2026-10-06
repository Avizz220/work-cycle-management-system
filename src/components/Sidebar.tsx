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
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const { currentUser, isPM, logout } = useAuth();
  const { urgentDeadlines } = useProjects();
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

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
      badge: isPM ? 'PM Action' : 'PM Only',
      badgeClass: isPM ? 'badge-dark' : 'badge-subtle',
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
          width: '270px',
          backgroundColor: '#ffffff',
          borderRight: '1px solid #e4e4e7',
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
            padding: '24px 20px',
            borderBottom: '1px solid #e4e4e7',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/resources/Main-LOGO.png"
              alt="DG 5 The Design Group Five"
              style={{
                height: '46px',
                width: 'auto',
                objectFit: 'contain',
              }}
            />
          </Link>
          <div
            style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#000000',
              backgroundColor: '#f4f4f5',
              border: '1px solid #d4d4d8',
              padding: '3px 8px',
              borderRadius: '4px',
              display: 'inline-block',
              alignSelf: 'flex-start',
            }}
          >
            Work Management System
          </div>
        </div>

        {/* Navigation links */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
        >
          <div
            style={{
              padding: '6px 12px',
              fontSize: '0.72rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: '#71717a',
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
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  color: isActive ? '#000000' : '#52525b',
                  backgroundColor: isActive ? '#f4f4f5' : 'transparent',
                  fontWeight: isActive ? 800 : 500,
                  fontSize: '0.88rem',
                  transition: 'all 0.15s ease',
                  borderLeft: isActive ? '3px solid #000000' : '3px solid transparent',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: '#000000' }}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.urgentCount !== undefined && item.urgentCount > 0 && (
                  <span
                    className="badge badge-dark"
                    style={{ fontSize: '0.68rem', padding: '2px 7px' }}
                    title={`${item.urgentCount} Urgent Deadlines`}
                  >
                    {item.urgentCount}
                  </span>
                )}

                {item.badge && (
                  <span
                    className={`badge ${item.badgeClass}`}
                    style={{ fontSize: '0.68rem', padding: '2px 6px' }}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          {/* Department Hubs Section */}
          <div
            style={{
              marginTop: '20px',
              padding: '6px 12px',
              fontSize: '0.72rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: '#71717a',
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
              borderRadius: '6px',
              fontSize: '0.84rem',
              color: '#27272a',
              transition: 'background 0.15s ease',
            }}
          >
            <Zap size={15} style={{ color: '#000000' }} />
            <span>Electrical Systems</span>
          </Link>

          <Link
            href="/disciplines?tab=Civil"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 12px',
              borderRadius: '6px',
              fontSize: '0.84rem',
              color: '#27272a',
              transition: 'background 0.15s ease',
            }}
          >
            <Building2 size={15} style={{ color: '#000000' }} />
            <span>Civil & Structural</span>
          </Link>

          <Link
            href="/disciplines?tab=Plumbing"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 12px',
              borderRadius: '6px',
              fontSize: '0.84rem',
              color: '#27272a',
              transition: 'background 0.15s ease',
            }}
          >
            <Droplets size={15} style={{ color: '#000000' }} />
            <span>Plumbing & MEP</span>
          </Link>

          <Link
            href="/disciplines?tab=Architectural"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 12px',
              borderRadius: '6px',
              fontSize: '0.84rem',
              color: '#27272a',
              transition: 'background 0.15s ease',
            }}
          >
            <Compass size={15} style={{ color: '#000000' }} />
            <span>Architecture & Façade</span>
          </Link>
        </div>

        {/* User Card & Role Switcher Bar */}
        <div
          style={{
            padding: '16px',
            borderTop: '1px solid #e4e4e7',
            backgroundColor: '#ffffff',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                alt={currentUser?.name || 'User'}
                style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #000000' }}
              />
              <div style={{ lineHeight: 1.2 }}>
                <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#000000' }}>
                  {currentUser?.name || 'Guest User'}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#71717a' }}>
                  {isPM ? 'Project Manager' : `${currentUser?.discipline} Engineer`}
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
                color: '#000000',
                display: 'flex',
                alignItems: 'center',
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
              fontSize: '0.78rem',
              fontWeight: 700,
            }}
          >
            <RefreshCw size={13} />
            <span>Switch Role (PM / Employee)</span>
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
