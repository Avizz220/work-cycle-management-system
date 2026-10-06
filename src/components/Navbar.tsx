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
  const { urgentDeadlines } = useProjects();
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const getDisciplineIcon = () => {
    switch (currentUser?.discipline) {
      case 'Management':
        return <Shield size={14} style={{ color: '#000000' }} />;
      case 'Electrical':
        return <Zap size={14} style={{ color: '#000000' }} />;
      case 'Civil':
        return <Building2 size={14} style={{ color: '#000000' }} />;
      case 'Plumbing':
        return <Droplets size={14} style={{ color: '#000000' }} />;
      case 'Architectural':
        return <Compass size={14} style={{ color: '#000000' }} />;
      default:
        return null;
    }
  };

  return (
    <>
      <header
        style={{
          height: '72px',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e4e4e7',
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
          <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#000000', lineHeight: 1.2 }}>
            {pageTitle}
          </h1>
          {subtitle && (
            <p style={{ fontSize: '0.8rem', color: '#52525b', marginTop: '2px' }}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Right: Quick Controls & Role Banner */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Quick Search */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#ffffff',
              border: '1px solid #d4d4d8',
              borderRadius: 'var(--radius-md)',
              padding: '7px 12px',
              width: '230px',
            }}
          >
            <Search size={16} style={{ color: '#71717a' }} />
            <input
              type="text"
              placeholder="Search projects, drawings..."
              style={{
                border: 'none',
                background: 'transparent',
                fontSize: '0.82rem',
                width: '100%',
                color: '#000000',
              }}
            />
          </div>

          {/* New Project Quick Button (If PM) */}
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

          {/* Urgent Deadlines Notification Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              style={{
                position: 'relative',
                padding: '8px',
                borderRadius: '8px',
                border: '1px solid #000000',
                backgroundColor: '#ffffff',
                color: '#000000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease',
              }}
              title="Project Deadlines Notification"
            >
              <Bell size={18} />
              {urgentDeadlines.length > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-5px',
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    borderRadius: '9999px',
                    minWidth: '18px',
                    height: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 4px',
                    border: '1px solid #ffffff',
                  }}
                >
                  {urgentDeadlines.length}
                </span>
              )}
            </button>

            {/* Notification Menu */}
            {showNotifications && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '46px',
                  width: '360px',
                  backgroundColor: '#ffffff',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                  border: '1px solid #000000',
                  padding: '16px',
                  zIndex: 50,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '12px',
                    paddingBottom: '8px',
                    borderBottom: '1px solid #e4e4e7',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, fontSize: '0.9rem', color: '#000000' }}>
                    <AlertTriangle size={16} style={{ color: '#000000' }} />
                    <span>Deadlines Alert</span>
                  </div>
                  <span className="badge badge-dark" style={{ fontSize: '0.7rem' }}>
                    {urgentDeadlines.length} Priority Items
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '280px', overflowY: 'auto' }}>
                  {urgentDeadlines.map((dl) => (
                    <div
                      key={dl.phaseId}
                      style={{
                        padding: '10px 12px',
                        backgroundColor: '#fbfbfb',
                        borderRadius: '6px',
                        borderTop: '1px solid #e4e4e7',
                        borderRight: '1px solid #e4e4e7',
                        borderBottom: '1px solid #e4e4e7',
                        borderLeft: '4px solid #000000',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#000000' }}>
                          {dl.phaseName}
                        </span>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            color: '#000000',
                            backgroundColor: '#e4e4e7',
                            padding: '1px 6px',
                            borderRadius: '4px',
                          }}
                        >
                          {dl.isOverdue ? `Overdue (${Math.abs(dl.daysRemaining)}d)` : `${dl.daysRemaining}d left`}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#52525b', marginTop: '4px' }}>
                        {dl.projectCode} • Section: <strong>{dl.assignedSection}</strong>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid #e4e4e7', textAlign: 'center' }}>
                  <Link
                    href="/deadlines"
                    onClick={() => setShowNotifications(false)}
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: '#000000',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Clock size={14} /> View Master Schedule →
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
              gap: '10px',
              backgroundColor: '#ffffff',
              border: '1px solid #000000',
              borderRadius: 'var(--radius-md)',
              padding: '6px 12px',
              cursor: 'pointer',
              transition: 'background 0.15s ease',
            }}
            title="Click to switch role / user"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={currentUser?.name || 'User'}
              style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #000000' }}
            />
            <div style={{ lineHeight: 1.2 }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#000000' }}>
                {currentUser?.name?.split(' ')[0]} {currentUser?.name?.split(' ')[1]}
              </div>
              <div
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: '#52525b',
                }}
              >
                {getDisciplineIcon()}
                <span>{isPM ? 'Project Manager' : `${currentUser?.discipline} Engineer`}</span>
              </div>
            </div>
            <ChevronDown size={14} style={{ color: '#000000' }} />
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
