'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Lock,
  Mail,
  ArrowRight,
  Shield,
  Zap,
  Building2,
  Droplets,
  Compass,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  UserPlus,
} from 'lucide-react';
import { DisciplineType } from '@/types';

export default function LoginPage() {
  const router = useRouter();
  const { login, signup, usersList } = useAuth();

  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('pm@dg5.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Signup fields
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'pm' | 'employee'>('employee');
  const [newDiscipline, setNewDiscipline] = useState<DisciplineType>('Electrical');
  const [newTitle, setNewTitle] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const res = login(email, password);
    if (res.success) {
      router.push('/');
    } else {
      setErrorMsg(res.message || 'Login failed.');
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!newName || !newEmail || !newTitle) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    const res = signup({
      name: newName,
      email: newEmail,
      role: newRole,
      discipline: newRole === 'pm' ? 'Management' : newDiscipline,
      title: newTitle,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      phone: '+94 11 258 4800',
    });

    if (res.success) {
      setSuccessMsg('Account registered successfully! Redirecting to dashboard...');
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } else {
      setErrorMsg(res.message || 'Signup failed.');
    }
  };

  const quickLogin = (userEmail: string, userPass: string) => {
    setEmail(userEmail);
    setPassword(userPass);
    const res = login(userEmail, userPass);
    if (res.success) {
      router.push('/');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
      }}
    >
      <div style={{ maxWidth: '1040px', width: '100%', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-flex',
              padding: '16px 28px',
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid #000000',
              marginBottom: '20px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/resources/Main-LOGO.png"
              alt="DG 5 The Design Group Five International"
              style={{ height: '70px', width: 'auto', objectFit: 'contain' }}
            />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#000000', letterSpacing: '-0.02em' }}>
            Enterprise Multidisciplinary Work Management System
          </h1>
          <p style={{ fontSize: '0.92rem', color: '#52525b', marginTop: '6px' }}>
            The Design Group Five International (Est. 1972) • Architecture & Engineering Management Portal
          </p>
        </div>

        {/* Main Grid: Login Card & Demo Quick Access Box */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(320px, 1.2fr) minmax(320px, 1fr)',
            gap: '28px',
            alignItems: 'start',
          }}
        >
          {/* Card: Auth Form */}
          <div
            className="card"
            style={{
              padding: '36px',
              border: '1px solid #000000',
              borderRadius: 'var(--radius-xl)',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.06)',
            }}
          >
            {/* Tab switch */}
            <div
              style={{
                display: 'flex',
                backgroundColor: '#f4f4f5',
                borderRadius: 'var(--radius-md)',
                padding: '4px',
                marginBottom: '28px',
                border: '1px solid #e4e4e7',
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setActiveTab('login');
                  setErrorMsg('');
                }}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  backgroundColor: activeTab === 'login' ? '#000000' : 'transparent',
                  color: activeTab === 'login' ? '#ffffff' : '#000000',
                  transition: 'all 0.2s ease',
                }}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('signup');
                  setErrorMsg('');
                }}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  backgroundColor: activeTab === 'signup' ? '#000000' : 'transparent',
                  color: activeTab === 'signup' ? '#ffffff' : '#000000',
                  transition: 'all 0.2s ease',
                }}
              >
                Create Account
              </button>
            </div>

            {errorMsg && (
              <div
                style={{
                  backgroundColor: '#f4f4f5',
                  border: '1px solid #000000',
                  color: '#000000',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '20px',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: 600,
                }}
              >
                <AlertCircle size={16} />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div
                style={{
                  backgroundColor: '#f4f4f5',
                  border: '1px solid #000000',
                  color: '#000000',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '20px',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: 600,
                }}
              >
                <CheckCircle2 size={16} />
                <span>{successMsg}</span>
              </div>
            )}

            {activeTab === 'login' ? (
              <form onSubmit={handleLoginSubmit}>
                <div className="input-group">
                  <label className="input-label">Corporate Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="email"
                      className="input-text"
                      placeholder="e.g. pm@dg5.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{ paddingLeft: '40px', borderColor: '#d4d4d8' }}
                      required
                    />
                    <Mail
                      size={17}
                      style={{
                        position: 'absolute',
                        left: '14px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#71717a',
                      }}
                    />
                  </div>
                </div>

                <div className="input-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="input-label">Password</label>
                    <span style={{ fontSize: '0.75rem', color: '#52525b', fontWeight: 600 }}>
                      PM: admin123 | Emp: emp123
                    </span>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="input-text"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{ paddingLeft: '40px', paddingRight: '40px', borderColor: '#d4d4d8' }}
                      required
                    />
                    <Lock
                      size={17}
                      style={{
                        position: 'absolute',
                        left: '14px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#71717a',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '14px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#71717a',
                      }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', marginTop: '16px', gap: '8px', fontWeight: 700 }}
                >
                  <span>Sign In to DG5 Portal</span>
                  <ArrowRight size={18} />
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignupSubmit}>
                <div className="input-group">
                  <label className="input-label">Full Name & Designation *</label>
                  <input
                    type="text"
                    className="input-text"
                    placeholder="e.g. Eng. Amanda Perera"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Corporate Email Address *</label>
                  <input
                    type="email"
                    className="input-text"
                    placeholder="amanda@dg5.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="input-group">
                    <label className="input-label">System Role</label>
                    <select
                      className="select-input"
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value as 'pm' | 'employee')}
                    >
                      <option value="employee">Discipline Engineer</option>
                      <option value="pm">Project Manager</option>
                    </select>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Discipline / Section</label>
                    <select
                      className="select-input"
                      value={newDiscipline}
                      onChange={(e) => setNewDiscipline(e.target.value as DisciplineType)}
                      disabled={newRole === 'pm'}
                    >
                      <option value="Electrical">Electrical Systems</option>
                      <option value="Civil">Civil & Structural</option>
                      <option value="Plumbing">Plumbing & MEP</option>
                      <option value="Architectural">Architecture</option>
                    </select>
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Official Job Title *</label>
                  <input
                    type="text"
                    className="input-text"
                    placeholder="e.g. Senior Electrical Design Specialist"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', marginTop: '16px', gap: '8px' }}
                >
                  <UserPlus size={18} />
                  <span>Register & Enter Portal</span>
                </button>
              </form>
            )}
          </div>

          {/* Card: Hardcoded Testing Credentials & 1-Click Access in Clean Black & White */}
          <div
            className="card"
            style={{
              padding: '32px',
              backgroundColor: '#ffffff',
              border: '1px solid #000000',
              borderRadius: 'var(--radius-xl)',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.06)',
            }}
          >
            <div
              style={{
                display: 'inline-block',
                backgroundColor: '#000000',
                color: '#ffffff',
                fontSize: '0.72rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                padding: '4px 10px',
                borderRadius: '4px',
                marginBottom: '12px',
              }}
            >
              Demo Credentials
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#000000', letterSpacing: '-0.01em' }}>
              1-Click Quick Demo Sign In
            </h2>
            <p style={{ fontSize: '0.84rem', color: '#52525b', marginTop: '4px', marginBottom: '20px' }}>
              Click any profile below to instantly evaluate role-based permissions:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Project Manager */}
              <div
                style={{
                  border: '1px solid #000000',
                  borderRadius: '10px',
                  padding: '14px 16px',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px',
                  transition: 'all 0.2s ease',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Shield size={16} style={{ color: '#000000' }} />
                    <span style={{ fontWeight: 800, fontSize: '0.88rem', color: '#000000' }}>
                      Arch. Samantha Reed
                    </span>
                    <span className="badge badge-dark" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                      Project Manager
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#52525b', marginTop: '4px' }}>
                    pm@dg5.com • Pass: <strong>admin123</strong>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => quickLogin('pm@dg5.com', 'admin123')}
                  style={{ fontSize: '0.78rem', padding: '8px 14px' }}
                >
                  Quick Sign In
                </button>
              </div>

              {/* Electrical Lead */}
              <div
                style={{
                  border: '1px solid #e4e4e7',
                  borderRadius: '10px',
                  padding: '14px 16px',
                  backgroundColor: '#fbfbfb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px',
                  transition: 'all 0.2s ease',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Zap size={16} style={{ color: '#000000' }} />
                    <span style={{ fontWeight: 800, fontSize: '0.88rem', color: '#000000' }}>
                      Eng. Kevin Fernando
                    </span>
                    <span className="badge badge-subtle" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                      Electrical Lead
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#52525b', marginTop: '4px' }}>
                    electrical@dg5.com • Pass: <strong>emp123</strong>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => quickLogin('electrical@dg5.com', 'emp123')}
                  style={{ fontSize: '0.78rem', padding: '8px 14px' }}
                >
                  Quick Sign In
                </button>
              </div>

              {/* Civil Lead */}
              <div
                style={{
                  border: '1px solid #e4e4e7',
                  borderRadius: '10px',
                  padding: '14px 16px',
                  backgroundColor: '#fbfbfb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px',
                  transition: 'all 0.2s ease',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Building2 size={16} style={{ color: '#000000' }} />
                    <span style={{ fontWeight: 800, fontSize: '0.88rem', color: '#000000' }}>
                      Eng. Dilshan Perera
                    </span>
                    <span className="badge badge-subtle" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                      Civil & Structural
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#52525b', marginTop: '4px' }}>
                    civil@dg5.com • Pass: <strong>emp123</strong>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => quickLogin('civil@dg5.com', 'emp123')}
                  style={{ fontSize: '0.78rem', padding: '8px 14px' }}
                >
                  Quick Sign In
                </button>
              </div>

              {/* Plumbing Lead */}
              <div
                style={{
                  border: '1px solid #e4e4e7',
                  borderRadius: '10px',
                  padding: '14px 16px',
                  backgroundColor: '#fbfbfb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px',
                  transition: 'all 0.2s ease',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Droplets size={16} style={{ color: '#000000' }} />
                    <span style={{ fontWeight: 800, fontSize: '0.88rem', color: '#000000' }}>
                      Eng. Kasun Silva
                    </span>
                    <span className="badge badge-subtle" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                      Plumbing & MEP
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#52525b', marginTop: '4px' }}>
                    plumbing@dg5.com • Pass: <strong>emp123</strong>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => quickLogin('plumbing@dg5.com', 'emp123')}
                  style={{ fontSize: '0.78rem', padding: '8px 14px' }}
                >
                  Quick Sign In
                </button>
              </div>

              {/* Architect Lead */}
              <div
                style={{
                  border: '1px solid #e4e4e7',
                  borderRadius: '10px',
                  padding: '14px 16px',
                  backgroundColor: '#fbfbfb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px',
                  transition: 'all 0.2s ease',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Compass size={16} style={{ color: '#000000' }} />
                    <span style={{ fontWeight: 800, fontSize: '0.88rem', color: '#000000' }}>
                      Arch. Nimmi Wickramasinghe
                    </span>
                    <span className="badge badge-subtle" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                      Architecture
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#52525b', marginTop: '4px' }}>
                    architect@dg5.com • Pass: <strong>emp123</strong>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => quickLogin('architect@dg5.com', 'emp123')}
                  style={{ fontSize: '0.78rem', padding: '8px 14px' }}
                >
                  Quick Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
