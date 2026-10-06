'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { useProjects } from '@/context/ProjectContext';
import { useAuth } from '@/context/AuthContext';
import {
  FolderPlus,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import { DisciplineType, ProjectCategory, ProjectPhase } from '@/types';

export default function AddProjectPage() {
  const router = useRouter();
  const { addProject } = useProjects();
  const { isPM, currentUser, switchUser, usersList } = useAuth();

  // Project General Details
  const [code, setCode] = useState('DG5-PRJ-2026-05');
  const [title, setTitle] = useState('');
  const [client, setClient] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState<ProjectCategory>('Commercial');
  const [budget, setBudget] = useState('');
  const [startDate, setStartDate] = useState('2026-10-15');
  const [targetCompletion, setTargetCompletion] = useState('2027-12-20');
  const [description, setDescription] = useState('');

  // Phases Builder State
  const [phases, setPhases] = useState<ProjectPhase[]>([
    {
      id: 'ph-init-1',
      phaseNumber: 1,
      name: 'Concept Architecture & Site Feasibility',
      assignedSection: 'Architectural',
      leadPerson: 'Arch. Nimmi Wickramasinghe',
      startDate: '2026-10-15',
      deadline: '2026-11-30',
      status: 'Pending',
      progress: 0,
      deliverables: ['Massing Study', 'Solar Orientation Report'],
      critical: false,
    },
    {
      id: 'ph-init-2',
      phaseNumber: 2,
      name: 'Substructure & Structural Civil Engineering',
      assignedSection: 'Civil',
      leadPerson: 'Eng. Dilshan Perera',
      startDate: '2026-12-01',
      deadline: '2027-02-15',
      status: 'Pending',
      progress: 0,
      deliverables: ['Foundation Calculations', 'Piling Schedule'],
      critical: true,
    },
    {
      id: 'ph-init-3',
      phaseNumber: 3,
      name: 'MEP Electrical & Power Distribution Reticulation',
      assignedSection: 'Electrical',
      leadPerson: 'Eng. Kevin Fernando',
      startDate: '2027-01-10',
      deadline: '2027-03-30',
      status: 'Pending',
      progress: 0,
      deliverables: ['Single Line Diagrams', 'Substation Layout'],
      critical: true,
    },
    {
      id: 'ph-init-4',
      phaseNumber: 4,
      name: 'High-Rise Sanitary & Stormwater Hydraulics',
      assignedSection: 'Plumbing',
      leadPerson: 'Eng. Kasun Silva',
      startDate: '2027-02-01',
      deadline: '2027-04-20',
      status: 'Pending',
      progress: 0,
      deliverables: ['Water Storage Tanks', 'Drainage Riser Plan'],
      critical: false,
    },
  ]);

  const [deliverableInput, setDeliverableInput] = useState<{ [phaseId: string]: string }>({});
  const [isSuccess, setIsSuccess] = useState(false);

  // Add a new blank phase
  const handleAddPhase = () => {
    const nextNumber = phases.length + 1;
    const newPhase: ProjectPhase = {
      id: `ph-new-${Date.now()}`,
      phaseNumber: nextNumber,
      name: `Phase ${nextNumber} - Engineering Deliverable`,
      assignedSection: 'Civil',
      leadPerson: 'Lead Engineer',
      startDate: '2027-03-01',
      deadline: '2027-05-30',
      status: 'Pending',
      progress: 0,
      deliverables: ['Technical Specification Sheet'],
      critical: false,
    };
    setPhases([...phases, newPhase]);
  };

  const handleRemovePhase = (phaseId: string) => {
    if (phases.length <= 1) return;
    const updated = phases
      .filter((p) => p.id !== phaseId)
      .map((p, idx) => ({ ...p, phaseNumber: idx + 1 }));
    setPhases(updated);
  };

  const handleUpdatePhase = (phaseId: string, field: keyof ProjectPhase, value: any) => {
    setPhases(
      phases.map((p) => {
        if (p.id !== phaseId) return p;
        return { ...p, [field]: value };
      })
    );
  };

  const handleAddDeliverable = (phaseId: string) => {
    const text = deliverableInput[phaseId]?.trim();
    if (!text) return;

    setPhases(
      phases.map((p) => {
        if (p.id !== phaseId) return p;
        return { ...p, deliverables: [...p.deliverables, text] };
      })
    );

    setDeliverableInput({ ...deliverableInput, [phaseId]: '' });
  };

  const handleRemoveDeliverable = (phaseId: string, deliverableIndex: number) => {
    setPhases(
      phases.map((p) => {
        if (p.id !== phaseId) return p;
        return {
          ...p,
          deliverables: p.deliverables.filter((_, idx) => idx !== deliverableIndex),
        };
      })
    );
  };

  // Preset Template Loader for rapid convenience
  const handleLoadTemplate = () => {
    setTitle('Havelock City Mixed Commercial Complex');
    setClient('Mirascon Real Estate Investments Ltd');
    setLocation('Havelock Road, Colombo 05');
    setCategory('Commercial');
    setBudget('$38,000,000 USD');
    setDescription(
      'Multi-disciplinary commercial hub comprising 24 floors of prime corporate offices, automated mechanical ventilation, substation transformers, and sewage treatment plants.'
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !client) return;

    const keyDisciplines: DisciplineType[] = Array.from(
      new Set(
        phases
          .map((p) => p.assignedSection)
          .filter((s): s is DisciplineType => s !== 'All')
      )
    );

    addProject({
      code,
      title,
      client,
      location: location || 'Colombo, Sri Lanka',
      category,
      budget: budget || '$10,000,000 USD',
      startDate,
      targetCompletion,
      status: 'Active',
      projectManager: currentUser?.name || 'Arch. Samantha Reed',
      description: description || 'Standard DG5 multidisciplinary design contract.',
      phases,
      keyDisciplines,
    });

    setIsSuccess(true);
    setTimeout(() => {
      router.push('/projects');
    }, 1200);
  };

  return (
    <div className="app-container">
      <Sidebar />

      <div className="main-wrapper">
        <Navbar
          pageTitle="Add Company Project & Phases"
          subtitle="Project Manager Dedicated Phase Creation Wizard"
        />

        <main className="main-content">
          {/* Permission Guard / Warning if currently switched to an Employee role */}
          {!isPM && (
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-lg)',
                padding: '16px 20px',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldAlert size={20} style={{ color: '#0f172a', flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                    Project Manager Role Feature
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    You are currently viewing as <strong>{currentUser?.name} ({currentUser?.discipline} Engineer)</strong>.
                    Project Managers configure new contracts and phases.
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => {
                  const pmUser = usersList.find((u) => u.role === 'pm');
                  if (pmUser) switchUser(pmUser.id);
                }}
              >
                Switch to Project Manager (1-Click)
              </button>
            </div>
          )}

          {isSuccess ? (
            <div className="card" style={{ padding: '48px 24px', textAlign: 'center', border: '1px solid var(--border-light)', backgroundColor: '#ffffff' }}>
              <CheckCircle2 size={48} style={{ color: '#16a34a', margin: '0 auto 14px' }} />
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Project & All Phases Successfully Registered!
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginTop: '6px', fontSize: '0.9rem' }}>
                Project Code: <strong>{code}</strong> • {phases.length} Multidisciplinary Phases Configured.
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '4px' }}>
                Redirecting to Project Directory...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(0, 1.8fr) minmax(320px, 1fr)',
                  gap: '24px',
                  alignItems: 'start',
                }}
              >
                {/* Left Column: Form Details & Phase Builder */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                  {/* Step 1: Project Metadata Card */}
                  <div className="card" style={{ padding: '24px', border: '1px solid var(--border-light)', backgroundColor: '#ffffff' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '18px',
                        borderBottom: '1px solid var(--border-light)',
                        paddingBottom: '14px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          style={{
                            width: '30px',
                            height: '30px',
                            borderRadius: '50%',
                            border: '1.5px solid #cbd5e1',
                            backgroundColor: '#f8fafc',
                            color: '#0f172a',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.84rem',
                          }}
                        >
                          1
                        </div>
                        <div>
                          <h3 style={{ fontSize: '1.08rem', fontWeight: 700, color: 'var(--text-main)' }}>
                            Project Contract Overview
                          </h3>
                          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            Fundamental project details, client metadata, and budget
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleLoadTemplate}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.76rem', gap: '6px' }}
                      >
                        <Sparkles size={13} style={{ color: '#64748b' }} />
                        <span>Fill Sample Data</span>
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '14px' }}>
                      <div className="input-group">
                        <label className="input-label">Project Code *</label>
                        <input
                          type="text"
                          className="input-text"
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          required
                        />
                      </div>

                      <div className="input-group">
                        <label className="input-label">Official Project Title *</label>
                        <input
                          type="text"
                          className="input-text"
                          placeholder="e.g. Marina Bay Commercial Hub & Tower"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                      <div className="input-group">
                        <label className="input-label">Client / Developer Entity *</label>
                        <input
                          type="text"
                          className="input-text"
                          placeholder="e.g. Apex Horizon Capital Group"
                          value={client}
                          onChange={(e) => setClient(e.target.value)}
                          required
                        />
                      </div>

                      <div className="input-group">
                        <label className="input-label">Site Location</label>
                        <input
                          type="text"
                          className="input-text"
                          placeholder="e.g. Port City Financial Precinct, Colombo"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
                      <div className="input-group">
                        <label className="input-label">Category</label>
                        <select
                          className="select-input"
                          value={category}
                          onChange={(e) => setCategory(e.target.value as ProjectCategory)}
                        >
                          <option value="Commercial">Commercial</option>
                          <option value="Residential">Residential</option>
                          <option value="Infrastructure">Infrastructure</option>
                          <option value="Healthcare">Healthcare</option>
                          <option value="Industrial">Industrial</option>
                        </select>
                      </div>

                      <div className="input-group">
                        <label className="input-label">Contract Budget</label>
                        <input
                          type="text"
                          className="input-text"
                          placeholder="$25,000,000 USD"
                          value={budget}
                          onChange={(e) => setBudget(e.target.value)}
                        />
                      </div>

                      <div className="input-group">
                        <label className="input-label">Target Completion</label>
                        <input
                          type="date"
                          className="input-text"
                          value={targetCompletion}
                          onChange={(e) => setTargetCompletion(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="input-group" style={{ marginBottom: 0 }}>
                      <label className="input-label">Engineering Scope Summary</label>
                      <textarea
                        className="textarea-input"
                        rows={2}
                        placeholder="Brief summary of architectural, structural, civil, and MEP requirements..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Step 2: Multidisciplinary Phases & Deadlines Builder */}
                  <div className="card" style={{ padding: '24px', border: '1px solid var(--border-light)', backgroundColor: '#ffffff' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '18px',
                        borderBottom: '1px solid var(--border-light)',
                        paddingBottom: '14px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          style={{
                            width: '30px',
                            height: '30px',
                            borderRadius: '50%',
                            border: '1.5px solid #cbd5e1',
                            backgroundColor: '#f8fafc',
                            color: '#0f172a',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.84rem',
                          }}
                        >
                          2
                        </div>
                        <div>
                          <h3 style={{ fontSize: '1.08rem', fontWeight: 700, color: 'var(--text-main)' }}>
                            Phase Breakdown & Deadlines ({phases.length} Phases)
                          </h3>
                          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            Assign engineering sections, deadlines, and deliverables for each milestone
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleAddPhase}
                        className="btn btn-secondary btn-sm"
                        style={{ gap: '6px' }}
                      >
                        <Plus size={14} />
                        <span>Add Another Phase</span>
                      </button>
                    </div>

                    {/* Phase Cards List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {phases.map((ph) => (
                        <div
                          key={ph.id}
                          style={{
                            border: '1px solid var(--border-light)',
                            borderRadius: 'var(--radius-md)',
                            padding: '16px 18px',
                            backgroundColor: '#f8fafc',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              marginBottom: '12px',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <span
                                style={{
                                  backgroundColor: '#ffffff',
                                  color: '#334155',
                                  fontSize: '0.72rem',
                                  fontWeight: 600,
                                  padding: '2px 8px',
                                  borderRadius: '4px',
                                  border: '1px solid var(--border-light)',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                Phase {ph.phaseNumber}
                              </span>
                              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                                <input
                                  type="checkbox"
                                  checked={ph.critical}
                                  onChange={(e) => handleUpdatePhase(ph.id, 'critical', e.target.checked)}
                                />
                                <span style={{ fontWeight: ph.critical ? 600 : 400, color: ph.critical ? '#991b1b' : 'var(--text-secondary)' }}>
                                  Critical Path Milestone
                                </span>
                              </label>
                            </div>

                            {phases.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemovePhase(ph.id)}
                                style={{
                                  color: '#94a3b8',
                                  padding: '4px',
                                  borderRadius: '4px',
                                  transition: 'color 0.15s ease',
                                }}
                                title="Remove phase"
                              >
                                <Trash2 size={15} />
                              </button>
                            )}
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '12px', marginBottom: '10px' }}>
                            <div>
                              <label className="input-label" style={{ fontSize: '0.76rem' }}>Phase Name *</label>
                              <input
                                type="text"
                                className="input-text"
                                value={ph.name}
                                onChange={(e) => handleUpdatePhase(ph.id, 'name', e.target.value)}
                                required
                              />
                            </div>

                            <div>
                              <label className="input-label" style={{ fontSize: '0.76rem' }}>Assigned Section *</label>
                              <select
                                className="select-input"
                                value={ph.assignedSection}
                                onChange={(e) => handleUpdatePhase(ph.id, 'assignedSection', e.target.value as DisciplineType)}
                              >
                                <option value="Architectural">Architectural</option>
                                <option value="Civil">Civil & Structural</option>
                                <option value="Electrical">Electrical</option>
                                <option value="Plumbing">Plumbing & MEP</option>
                                <option value="All">All Disciplines</option>
                              </select>
                            </div>

                            <div>
                              <label className="input-label" style={{ fontSize: '0.76rem' }}>Lead Person</label>
                              <input
                                type="text"
                                className="input-text"
                                value={ph.leadPerson}
                                onChange={(e) => handleUpdatePhase(ph.id, 'leadPerson', e.target.value)}
                              />
                            </div>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                            <div>
                              <label className="input-label" style={{ fontSize: '0.76rem' }}>Start Date</label>
                              <input
                                type="date"
                                className="input-text"
                                value={ph.startDate}
                                onChange={(e) => handleUpdatePhase(ph.id, 'startDate', e.target.value)}
                              />
                            </div>

                            <div>
                              <label className="input-label" style={{ fontSize: '0.76rem' }}>Target Phase Deadline *</label>
                              <input
                                type="date"
                                className="input-text"
                                value={ph.deadline}
                                onChange={(e) => handleUpdatePhase(ph.id, 'deadline', e.target.value)}
                                required
                              />
                            </div>
                          </div>

                          {/* Deliverables tags & input */}
                          <div>
                            <label className="input-label" style={{ fontSize: '0.76rem' }}>
                              Deliverables & Submissions ({ph.deliverables.length})
                            </label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                              {ph.deliverables.map((item, dIdx) => (
                                <span
                                  key={dIdx}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    backgroundColor: '#ffffff',
                                    border: '1px solid var(--border-light)',
                                    borderRadius: '4px',
                                    padding: '2px 8px',
                                    fontSize: '0.72rem',
                                    color: '#334155',
                                    fontWeight: 500,
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  <span>{item}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveDeliverable(ph.id, dIdx)}
                                    style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1 }}
                                  >
                                    ×
                                  </button>
                                </span>
                              ))}
                            </div>

                            <div style={{ display: 'flex', gap: '8px' }}>
                              <input
                                type="text"
                                className="input-text"
                                style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                                placeholder="Add deliverable (e.g. Diaphragm Wall Drawings) and press Add"
                                value={deliverableInput[ph.id] || ''}
                                onChange={(e) =>
                                  setDeliverableInput({ ...deliverableInput, [ph.id]: e.target.value })
                                }
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddDeliverable(ph.id);
                                  }
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => handleAddDeliverable(ph.id)}
                                className="btn btn-secondary btn-sm"
                                style={{ fontSize: '0.75rem' }}
                              >
                                Add
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Live Summary Preview Card */}
                <div style={{ position: 'sticky', top: '90px' }}>
                  <div
                    className="card"
                    style={{
                      padding: '22px',
                      border: '1px solid var(--border-light)',
                      backgroundColor: '#ffffff',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        color: 'var(--text-muted)',
                        marginBottom: '6px',
                        letterSpacing: '0.04em',
                      }}
                    >
                      Summary Preview
                    </div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '3px' }}>
                      {title || 'Untitled Project'}
                    </h3>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                      Code: <strong>{code}</strong> • {category}
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        backgroundColor: '#f8fafc',
                        borderRadius: 'var(--radius-md)',
                        padding: '12px 14px',
                        marginBottom: '16px',
                        fontSize: '0.8rem',
                        border: '1px solid var(--border-light)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Client:</span>
                        <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{client || 'Not specified'}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Location:</span>
                        <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{location || 'Colombo'}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Budget:</span>
                        <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{budget || '$0'}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Target Completion:</span>
                        <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{targetCompletion}</span>
                      </div>
                    </div>

                    <div style={{ marginBottom: '18px' }}>
                      <div
                        style={{
                          fontSize: '0.74rem',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          color: 'var(--text-muted)',
                          marginBottom: '8px',
                          letterSpacing: '0.02em',
                        }}
                      >
                        Configured Phases ({phases.length})
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', maxHeight: '200px', overflowY: 'auto' }}>
                        {phases.map((p) => (
                          <div
                            key={p.id}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              fontSize: '0.75rem',
                              padding: '6px 8px',
                              backgroundColor: '#ffffff',
                              border: '1px solid var(--border-light)',
                              borderRadius: '4px',
                            }}
                          >
                            <span style={{ fontWeight: 500, color: 'var(--text-secondary)', maxWidth: '60%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              P{p.phaseNumber}: {p.name}
                            </span>
                            <span style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap', fontSize: '0.72rem' }}>{p.deadline}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary btn-lg"
                      style={{ width: '100%', gap: '8px', fontWeight: 600 }}
                    >
                      <FolderPlus size={16} />
                      <span>Save & Publish Project</span>
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}
        </main>
      </div>
    </div>
  );
}
