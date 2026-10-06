'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ArchitecturalBackground from '@/components/ArchitecturalBackground';
import {
  Lock,
  Mail,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  UserPlus,
  LogIn,
  ShieldCheck,
  Building2,
  Users,
  Award,
  Briefcase,
  Layers,
  Wrench,
  Key,
  BadgeCheck,
} from 'lucide-react';
import { DisciplineType, UserRole } from '@/types';

export default function LoginPage() {
  const router = useRouter();
  const { login, signup } = useAuth();

  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

  // Login form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Universal Signup fields
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('employee');
  const [newPhone, setNewPhone] = useState('+94 11 258 4800');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Normal Team Member role-specific fields
  const [empDiscipline, setEmpDiscipline] = useState<DisciplineType>('Electrical');
  const [empTitle, setEmpTitle] = useState('Senior CAD Drafter');
  const [empReportingHOD, setEmpReportingHOD] = useState('Eng. Samantha Silva (HOD Electrical)');
  const [empId, setEmpId] = useState('DG5-ENG-402');
  const [empExperienceLevel, setEmpExperienceLevel] = useState('Intermediate Specialist (2-5 Yrs)');
  const [empPrimaryTool, setEmpPrimaryTool] = useState('Autodesk Revit & BIM');

  // HOD role-specific fields
  const [hodDiscipline, setHodDiscipline] = useState<DisciplineType>('Electrical');
  const [hodTitle, setHodTitle] = useState('Head of Electrical Engineering');
  const [hodOffice, setHodOffice] = useState('DG5 HQ - Level 3 MEP Wing');
  const [hodAuthCode, setHodAuthCode] = useState('HOD-DEPT-AUTH-2026');
  const [hodLeadershipExp, setHodLeadershipExp] = useState('8 - 12 Years Leadership');
  const [hodTeamCapacity, setHodTeamCapacity] = useState('14 Drafters & Engineers');

  // PM role-specific fields
  const [pmTitle, setPmTitle] = useState('Chief Project Manager');
  const [pmPortfolio, setPmPortfolio] = useState('Commercial Towers & Mixed-Use');
  const [pmPmpLicense, setPmPmpLicense] = useState('PMP-849201 / Chartered Eng');
  const [pmExecutiveKey, setPmExecutiveKey] = useState('DG5-PM-DIRECTOR');
  const [pmExtension, setPmExtension] = useState('Directorate Suite 401 / Ext: 802');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const res = login(email, password);
    if (res.success) {
      setSuccessMsg('Authentication verified. Redirecting to workspace...');
      setTimeout(() => {
        router.push('/');
      }, 500);
    } else {
      setErrorMsg(res.message || 'Invalid email or password. Please verify your credentials.');
    }
  };


  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!newName.trim() || !newEmail.trim() || !newPassword.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    let finalTitle = '';
    let finalDiscipline: DisciplineType = 'Electrical';
    let extraData: Record<string, string> = {};

    if (newRole === 'employee') {
      finalTitle = empTitle;
      finalDiscipline = empDiscipline;
      extraData = {
        specialization: empPrimaryTool,
        reportingHOD: empReportingHOD,
        experienceLevel: empExperienceLevel,
        employeeId: empId,
        primaryTool: empPrimaryTool,
      };
    } else if (newRole === 'hod') {
      finalTitle = hodTitle;
      finalDiscipline = hodDiscipline;
      extraData = {
        deptOffice: hodOffice,
        approvalCode: hodAuthCode,
        managementExperience: hodLeadershipExp,
        teamCapacity: hodTeamCapacity,
      };
    } else if (newRole === 'pm') {
      finalTitle = pmTitle;
      finalDiscipline = 'Management';
      extraData = {
        projectPortfolio: pmPortfolio,
        pmpLicense: pmPmpLicense,
        executiveKey: pmExecutiveKey,
        officeExtension: pmExtension,
      };
    }

    const res = signup({
      name: newName,
      email: newEmail,
      role: newRole,
      discipline: finalDiscipline,
      title: finalTitle,
      avatar:
        newRole === 'pm'
          ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
          : newRole === 'hod'
          ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
          : 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
      phone: newPhone || '+94 11 258 4800',
      ...extraData,
    });

    if (res.success) {
      setSuccessMsg(`Welcome aboard, ${newName}! Account activated. Redirecting...`);
      setTimeout(() => {
        router.push('/');
      }, 800);
    } else {
      setErrorMsg(res.message || 'Registration failed.');
    }
  };

  return (
    <ArchitecturalBackground>

      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 20px',
        }}
      >
        <div
          style={{
            maxWidth: activeTab === 'login' ? '520px' : '760px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transition: 'max-width 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Main Card */}
          <div
            style={{
              width: '100%',
              padding: '38px 42px',
              border: '1px solid #000000',
              borderRadius: '24px',
              backgroundColor: '#ffffff',
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.35)',
              transition: 'all 0.3s ease',
            }}
          >
            {/* Logo inside form */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/resources/Main-LOGO.png"
                alt="DG 5 The Design Group Five International"
                style={{ height: '52px', width: 'auto', objectFit: 'contain' }}
              />
            </div>
            {/* Tab Pill Switcher */}
            <div
              style={{
                display: 'flex',
                backgroundColor: '#f1f5f9',
                borderRadius: '14px',
                padding: '4px',
                marginBottom: '26px',
                border: '1px solid #e2e8f0',
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setActiveTab('login');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                style={{
                  flex: 1,
                  padding: '11px 20px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  backgroundColor: activeTab === 'login' ? '#000000' : 'transparent',
                  color: activeTab === 'login' ? '#ffffff' : '#64748b',
                  boxShadow:
                    activeTab === 'login'
                      ? '0 4px 12px rgba(0, 0, 0, 0.15)'
                      : 'none',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <LogIn size={16} />
                <span>Sign In to Portal</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('signup');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                style={{
                  flex: 1,
                  padding: '11px 20px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  backgroundColor: activeTab === 'signup' ? '#000000' : 'transparent',
                  color: activeTab === 'signup' ? '#ffffff' : '#64748b',
                  boxShadow:
                    activeTab === 'signup'
                      ? '0 4px 12px rgba(0, 0, 0, 0.15)'
                      : 'none',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <UserPlus size={16} />
                <span>Create Role Account</span>
              </button>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #000000',
                  color: '#000000',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  marginBottom: '22px',
                  fontSize: '0.84rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontWeight: 600,
                  animation: 'fadeIn 0.2s ease',
                }}
              >
                <AlertCircle size={17} style={{ flexShrink: 0, color: '#000000' }} />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Success Message */}
            {successMsg && (
              <div
                style={{
                  backgroundColor: '#000000',
                  border: '1px solid #000000',
                  color: '#ffffff',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  marginBottom: '22px',
                  fontSize: '0.84rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontWeight: 600,
                  animation: 'fadeIn 0.2s ease',
                }}
              >
                <CheckCircle2 size={17} style={{ flexShrink: 0, color: '#ffffff' }} />
                <span>{successMsg}</span>
              </div>
            )}

            {/* ===================== TAB: LOGIN ===================== */}
            {activeTab === 'login' ? (
              <form onSubmit={handleLoginSubmit}>
                <div className="input-group" style={{ marginBottom: '18px' }}>
                  <label
                    className="input-label"
                    style={{ fontSize: '0.84rem', fontWeight: 600, color: '#334155' }}
                  >
                    Corporate Email Address
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="email"
                      className="input-text"
                      placeholder="e.g. pm@dg5.com or your registered email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{
                        paddingLeft: '40px',
                        height: '48px',
                        fontSize: '0.92rem',
                        borderRadius: '10px',
                      }}
                      required
                    />
                    <Mail
                      size={18}
                      style={{
                        position: 'absolute',
                        left: '13px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#94a3b8',
                      }}
                    />
                  </div>
                </div>

                <div className="input-group" style={{ marginBottom: '18px' }}>
                  <label
                    className="input-label"
                    style={{ fontSize: '0.84rem', fontWeight: 600, color: '#334155' }}
                  >
                    Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="input-text"
                      placeholder="Enter your security password..."
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{
                        paddingLeft: '40px',
                        paddingRight: '42px',
                        height: '48px',
                        fontSize: '0.92rem',
                        borderRadius: '10px',
                      }}
                      required
                    />
                    <Lock
                      size={18}
                      style={{
                        position: 'absolute',
                        left: '13px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#94a3b8',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#94a3b8',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                      }}
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '24px',
                    fontSize: '0.82rem',
                    color: '#000000',
                  }}
                >
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      style={{ accentColor: '#000000', width: '15px', height: '15px' }}
                    />
                    <span>Keep me logged in</span>
                  </label>
                  <span
                    style={{
                      color: '#000000',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textDecoration: 'underline',
                    }}
                    onClick={() =>
                      alert('Default Passwords:\n• Chief PM: admin123\n• Division HOD: lead123\n• Team Member: emp123')
                    }
                  >
                    Forgot Password?
                  </span>
                </div>

                <button
                  type="submit"
                  style={{
                    width: '100%',
                    height: '50px',
                    fontSize: '0.96rem',
                    fontWeight: 700,
                    borderRadius: '12px',
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    border: '1px solid #000000',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#1e293b';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#000000';
                  }}
                >
                  <LogIn size={18} />
                  <span>Sign In to DG5 Portal</span>
                  <ArrowRight size={17} />
                </button>
              </form>
            ) : (
              /* ===================== TAB: SIGNUP ===================== */
              <form onSubmit={handleSignupSubmit}>
                {/* 1. Interactive Role Selector Cards */}
                <div style={{ marginBottom: '22px' }}>
                  <label
                    style={{
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      color: '#1e293b',
                      marginBottom: '10px',
                      display: 'block',
                    }}
                  >
                    Select System Role & Access Privilege *
                  </label>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '10px',
                    }}
                  >
                    {/* Role Card: Employee */}
                    <div
                      onClick={() => setNewRole('employee')}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '12px',
                        border: '2px solid #000000',
                        backgroundColor: newRole === 'employee' ? '#000000' : '#ffffff',
                        color: newRole === 'employee' ? '#ffffff' : '#000000',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          color: newRole === 'employee' ? '#ffffff' : '#000000',
                          fontWeight: 700,
                          fontSize: '0.84rem',
                          marginBottom: '4px',
                        }}
                      >
                        <Users size={16} />
                        <span>Team Member</span>
                      </div>
                      <div
                        style={{
                          fontSize: '0.72rem',
                          color: newRole === 'employee' ? '#d4d4d8' : '#71717a',
                          lineHeight: 1.35,
                        }}
                      >
                        Drafter, Specialist or Engineer
                      </div>
                    </div>

                    {/* Role Card: HOD */}
                    <div
                      onClick={() => setNewRole('hod')}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '12px',
                        border: '2px solid #000000',
                        backgroundColor: newRole === 'hod' ? '#000000' : '#ffffff',
                        color: newRole === 'hod' ? '#ffffff' : '#000000',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          color: newRole === 'hod' ? '#ffffff' : '#000000',
                          fontWeight: 700,
                          fontSize: '0.84rem',
                          marginBottom: '4px',
                        }}
                      >
                        <Award size={16} />
                        <span>Department Head</span>
                      </div>
                      <div
                        style={{
                          fontSize: '0.72rem',
                          color: newRole === 'hod' ? '#d4d4d8' : '#71717a',
                          lineHeight: 1.35,
                        }}
                      >
                        Division HOD / Team Lead
                      </div>
                    </div>

                    {/* Role Card: PM */}
                    <div
                      onClick={() => setNewRole('pm')}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '12px',
                        border: '2px solid #000000',
                        backgroundColor: newRole === 'pm' ? '#000000' : '#ffffff',
                        color: newRole === 'pm' ? '#ffffff' : '#000000',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          color: newRole === 'pm' ? '#ffffff' : '#000000',
                          fontWeight: 700,
                          fontSize: '0.84rem',
                          marginBottom: '4px',
                        }}
                      >
                        <Briefcase size={16} />
                        <span>Project Manager</span>
                      </div>
                      <div
                        style={{
                          fontSize: '0.72rem',
                          color: newRole === 'pm' ? '#d4d4d8' : '#71717a',
                          lineHeight: 1.35,
                        }}
                      >
                        Chief PM & Directorate
                      </div>
                    </div>
                  </div>
                </div>

                {/* Role Privilege Banner */}
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: '10px',
                    backgroundColor: '#fafafa',
                    border: '1px solid #000000',
                    marginBottom: '20px',
                    fontSize: '0.78rem',
                    color: '#000000',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <ShieldCheck size={16} style={{ flexShrink: 0, color: '#000000' }} />
                  <span>
                    {newRole === 'employee' &&
                      'Team Member Access: Work on assigned phases, submit CAD/BIM drawing revisions, review feedback.'}
                    {newRole === 'hod' &&
                      'Department Head Access: Review division deliverables, approve/reject drawings, issue phase notices to PM.'}
                    {newRole === 'pm' &&
                      'Project Manager Access: Full administrative oversight, project creation, budget and deadline control.'}
                  </span>
                </div>

                {/* Common Section: Core Identity */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '14px',
                    marginBottom: '14px',
                  }}
                >
                  <div className="input-group">
                    <label className="input-label" style={{ fontWeight: 600 }}>
                      Full Name & Salutation *
                    </label>
                    <input
                      type="text"
                      className="input-text"
                      placeholder="e.g. Eng. Amanda Perera"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      required
                      style={{ height: '44px', borderRadius: '8px' }}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label" style={{ fontWeight: 600 }}>
                      Corporate Email Address *
                    </label>
                    <input
                      type="email"
                      className="input-text"
                      placeholder="amanda.p@dg5.com"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      required
                      style={{ height: '44px', borderRadius: '8px' }}
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '14px',
                    marginBottom: '18px',
                  }}
                >
                  <div className="input-group">
                    <label className="input-label" style={{ fontWeight: 600 }}>
                      Contact Phone Number
                    </label>
                    <input
                      type="text"
                      className="input-text"
                      placeholder="+94 11 258 4800"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      style={{ height: '44px', borderRadius: '8px' }}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label" style={{ fontWeight: 600 }}>
                      Account Password *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        className="input-text"
                        placeholder="Choose a strong password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        style={{ height: '44px', borderRadius: '8px', paddingRight: '40px' }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        style={{
                          position: 'absolute',
                          right: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          color: '#94a3b8',
                          cursor: 'pointer',
                        }}
                      >
                        {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* ================= SECTION: DYNAMIC ROLE-SPECIFIC FIELDS ================= */}
                <div
                  style={{
                    padding: '16px',
                    borderRadius: '14px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    marginBottom: '22px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      color: '#475569',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      marginBottom: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <BadgeCheck size={14} style={{ color: '#000000' }} />
                    <span>
                      {newRole === 'employee' && 'Team Member Technical Credentials'}
                      {newRole === 'hod' && 'Department Leadership & Office Verification'}
                      {newRole === 'pm' && 'Executive Project Directorate Governance'}
                    </span>
                  </div>

                  {/* 1. FIELDS FOR NORMAL TEAM MEMBER */}
                  {newRole === 'employee' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '12px',
                        }}
                      >
                        <div className="input-group">
                          <label className="input-label">Engineering Discipline / Dept *</label>
                          <select
                            className="select-input"
                            value={empDiscipline}
                            onChange={(e) => setEmpDiscipline(e.target.value as DisciplineType)}
                            style={{ height: '42px', borderRadius: '8px' }}
                          >
                            <option value="Electrical">Electrical Systems</option>
                            <option value="Civil">Civil & Structural</option>
                            <option value="Plumbing">Plumbing & MEP</option>
                            <option value="Architectural">Architectural Design</option>
                          </select>
                        </div>

                        <div className="input-group">
                          <label className="input-label">Technical Designation / Role *</label>
                          <input
                            type="text"
                            className="input-text"
                            placeholder="e.g. Senior CAD Drafter"
                            value={empTitle}
                            onChange={(e) => setEmpTitle(e.target.value)}
                            required
                            style={{ height: '42px', borderRadius: '8px' }}
                          />
                        </div>
                      </div>

                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '12px',
                        }}
                      >
                        <div className="input-group">
                          <label className="input-label">Assigned Division HOD / Supervisor</label>
                          <select
                            className="select-input"
                            value={empReportingHOD}
                            onChange={(e) => setEmpReportingHOD(e.target.value)}
                            style={{ height: '42px', borderRadius: '8px' }}
                          >
                            <option value="Eng. Samantha Silva (HOD Electrical)">
                              Eng. Samantha Silva (HOD Electrical)
                            </option>
                            <option value="Eng. Rohan De Silva (HOD Civil & Structural)">
                              Eng. Rohan De Silva (HOD Civil)
                            </option>
                            <option value="Eng. Nimali Perera (HOD Plumbing & MEP)">
                              Eng. Nimali Perera (HOD MEP)
                            </option>
                            <option value="Arch. Kamal Wickramasinghe (Lead Architect)">
                              Arch. Kamal Wickramasinghe (Arch Lead)
                            </option>
                          </select>
                        </div>

                        <div className="input-group">
                          <label className="input-label">Staff / Member ID *</label>
                          <input
                            type="text"
                            className="input-text"
                            placeholder="e.g. DG5-ENG-402"
                            value={empId}
                            onChange={(e) => setEmpId(e.target.value)}
                            style={{ height: '42px', borderRadius: '8px' }}
                          />
                        </div>
                      </div>

                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '12px',
                        }}
                      >
                        <div className="input-group">
                          <label className="input-label">Technical Experience Level</label>
                          <select
                            className="select-input"
                            value={empExperienceLevel}
                            onChange={(e) => setEmpExperienceLevel(e.target.value)}
                            style={{ height: '42px', borderRadius: '8px' }}
                          >
                            <option value="Junior / Trainee Specialist (0-2 Yrs)">
                              Junior / Trainee Specialist (0-2 Yrs)
                            </option>
                            <option value="Intermediate Specialist (2-5 Yrs)">
                              Intermediate Specialist (2-5 Yrs)
                            </option>
                            <option value="Senior Specialist / Lead Drafter (5+ Yrs)">
                              Senior Specialist / Lead Drafter (5+ Yrs)
                            </option>
                          </select>
                        </div>

                        <div className="input-group">
                          <label className="input-label">Primary CAD / BIM Tool</label>
                          <select
                            className="select-input"
                            value={empPrimaryTool}
                            onChange={(e) => setEmpPrimaryTool(e.target.value)}
                            style={{ height: '42px', borderRadius: '8px' }}
                          >
                            <option value="Autodesk Revit & BIM">Autodesk Revit & BIM</option>
                            <option value="AutoCAD 2D & 3D">AutoCAD 2D & 3D</option>
                            <option value="ETABS & Structural Analysis">
                              ETABS & Structural Analysis
                            </option>
                            <option value="Dialux & Electrical MEP CAD">
                              Dialux & Electrical MEP CAD
                            </option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 2. FIELDS FOR DEPARTMENT HEAD (HOD) */}
                  {newRole === 'hod' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '12px',
                        }}
                      >
                        <div className="input-group">
                          <label className="input-label">Department Under Leadership *</label>
                          <select
                            className="select-input"
                            value={hodDiscipline}
                            onChange={(e) => setHodDiscipline(e.target.value as DisciplineType)}
                            style={{ height: '42px', borderRadius: '8px' }}
                          >
                            <option value="Electrical">Electrical Systems Division</option>
                            <option value="Civil">Civil & Structural Division</option>
                            <option value="Plumbing">Plumbing & MEP Division</option>
                            <option value="Architectural">Architectural Studio</option>
                          </select>
                        </div>

                        <div className="input-group">
                          <label className="input-label">Official HOD Title *</label>
                          <input
                            type="text"
                            className="input-text"
                            placeholder="e.g. Head of Electrical Engineering"
                            value={hodTitle}
                            onChange={(e) => setHodTitle(e.target.value)}
                            required
                            style={{ height: '42px', borderRadius: '8px' }}
                          />
                        </div>
                      </div>

                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '12px',
                        }}
                      >
                        <div className="input-group">
                          <label className="input-label">Division Studio / Office Location</label>
                          <input
                            type="text"
                            className="input-text"
                            placeholder="e.g. DG5 HQ - Level 3 MEP Wing"
                            value={hodOffice}
                            onChange={(e) => setHodOffice(e.target.value)}
                            style={{ height: '42px', borderRadius: '8px' }}
                          />
                        </div>

                        <div className="input-group">
                          <label className="input-label">HOD Authorization PIN / Code *</label>
                          <input
                            type="text"
                            className="input-text"
                            placeholder="e.g. HOD-DEPT-AUTH-2026"
                            value={hodAuthCode}
                            onChange={(e) => setHodAuthCode(e.target.value)}
                            required
                            style={{ height: '42px', borderRadius: '8px' }}
                          />
                        </div>
                      </div>

                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '12px',
                        }}
                      >
                        <div className="input-group">
                          <label className="input-label">Management Experience</label>
                          <select
                            className="select-input"
                            value={hodLeadershipExp}
                            onChange={(e) => setHodLeadershipExp(e.target.value)}
                            style={{ height: '42px', borderRadius: '8px' }}
                          >
                            <option value="5 - 8 Years Leadership">5 - 8 Years Leadership</option>
                            <option value="8 - 12 Years Leadership">8 - 12 Years Leadership</option>
                            <option value="12+ Years Enterprise Leadership">
                              12+ Years Enterprise Leadership
                            </option>
                          </select>
                        </div>

                        <div className="input-group">
                          <label className="input-label">Division Team Capacity</label>
                          <input
                            type="text"
                            className="input-text"
                            placeholder="e.g. 14 Drafters & Engineers"
                            value={hodTeamCapacity}
                            onChange={(e) => setHodTeamCapacity(e.target.value)}
                            style={{ height: '42px', borderRadius: '8px' }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 3. FIELDS FOR PROJECT MANAGER (PM) */}
                  {newRole === 'pm' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '12px',
                        }}
                      >
                        <div className="input-group">
                          <label className="input-label">Executive PM Title *</label>
                          <input
                            type="text"
                            className="input-text"
                            placeholder="e.g. Chief Project Manager"
                            value={pmTitle}
                            onChange={(e) => setPmTitle(e.target.value)}
                            required
                            style={{ height: '42px', borderRadius: '8px' }}
                          />
                        </div>

                        <div className="input-group">
                          <label className="input-label">Assigned Project Portfolio *</label>
                          <select
                            className="select-input"
                            value={pmPortfolio}
                            onChange={(e) => setPmPortfolio(e.target.value)}
                            style={{ height: '42px', borderRadius: '8px' }}
                          >
                            <option value="Commercial Towers & Mixed-Use">
                              Commercial Towers & Mixed-Use
                            </option>
                            <option value="Industrial Mega-Structures & Ports">
                              Industrial Mega-Structures & Ports
                            </option>
                            <option value="Hospitality & Luxury Resorts">
                              Hospitality & Luxury Resorts
                            </option>
                            <option value="All DG5 Enterprise Portfolios">
                              All DG5 Enterprise Portfolios
                            </option>
                          </select>
                        </div>
                      </div>

                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '12px',
                        }}
                      >
                        <div className="input-group">
                          <label className="input-label">PMP / Chartered License ID *</label>
                          <input
                            type="text"
                            className="input-text"
                            placeholder="e.g. PMP-849201 / Chartered Eng"
                            value={pmPmpLicense}
                            onChange={(e) => setPmPmpLicense(e.target.value)}
                            required
                            style={{ height: '42px', borderRadius: '8px' }}
                          />
                        </div>

                        <div className="input-group">
                          <label className="input-label">Executive Directorate Passcode *</label>
                          <input
                            type="text"
                            className="input-text"
                            placeholder="e.g. DG5-PM-DIRECTOR"
                            value={pmExecutiveKey}
                            onChange={(e) => setPmExecutiveKey(e.target.value)}
                            required
                            style={{ height: '42px', borderRadius: '8px' }}
                          />
                        </div>
                      </div>

                      <div className="input-group">
                        <label className="input-label">Directorate Office / Extension</label>
                        <input
                          type="text"
                          className="input-text"
                          placeholder="e.g. Directorate Suite 401 / Ext: 802"
                          value={pmExtension}
                          onChange={(e) => setPmExtension(e.target.value)}
                          style={{ height: '42px', borderRadius: '8px' }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Register Button */}
                <button
                  type="submit"
                  style={{
                    width: '100%',
                    height: '50px',
                    fontSize: '0.96rem',
                    fontWeight: 700,
                    borderRadius: '12px',
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    border: '1px solid #000000',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#1e293b';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#000000';
                  }}
                >
                  <UserPlus size={18} />
                  <span>Register {newRole.toUpperCase()} Account & Enter Portal</span>
                  <ArrowRight size={17} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </ArchitecturalBackground>
  );
}
