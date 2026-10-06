'use client';

import React, { useState } from 'react';
import { useCommunication } from '@/context/CommunicationContext';
import { useProjects } from '@/context/ProjectContext';
import { useAuth } from '@/context/AuthContext';
import { DisciplineType, FileType } from '@/types';
import { UploadCloud, X, FileCheck, CheckCircle2 } from 'lucide-react';

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDiscipline?: DisciplineType;
}

export default function FileUploadModal({
  isOpen,
  onClose,
  defaultDiscipline,
}: FileUploadModalProps) {
  const { uploadFile } = useCommunication();
  const { projects } = useProjects();
  const { currentUser } = useAuth();

  const [title, setTitle] = useState('');
  const [fileName, setFileName] = useState('');
  const [discipline, setDiscipline] = useState<DisciplineType>(
    defaultDiscipline || currentUser?.discipline || 'Electrical'
  );
  const [fileType, setFileType] = useState<FileType>('dwg');
  const [projectId, setProjectId] = useState(projects[0]?.id || '');
  const [version, setVersion] = useState('Rev 1.0 - Draft');
  const [notes, setNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !fileName) return;

    const selectedPrj = projects.find((p) => p.id === projectId);

    uploadFile({
      title,
      fileName,
      fileSize: `${(Math.random() * 12 + 2).toFixed(1)} MB`,
      fileType,
      discipline,
      version,
      uploadedBy: currentUser?.name || 'DG5 Engineer',
      projectId,
      projectTitle: selectedPrj?.title || 'DG5 Project',
      notes: notes || 'Standard multidisciplinary design package submitted for review.',
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
      // Reset form
      setTitle('');
      setFileName('');
      setNotes('');
    }, 1200);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '620px' }}>
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #000000',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: '#000000',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <UploadCloud size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#000000' }}>
                Upload Drawing / Document to Section Vault
              </h2>
              <p style={{ fontSize: '0.8rem', color: '#52525b' }}>
                Share technical CAD files, BIM models, and engineering specifications.
              </p>
            </div>
          </div>

          <button onClick={onClose} style={{ padding: '6px', color: '#000000' }}>
            <X size={20} />
          </button>
        </div>

        {isSuccess ? (
          <div style={{ padding: '48px 24px', textAlign: 'center' }}>
            <CheckCircle2 size={48} style={{ color: '#000000', margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#000000' }}>
              Drawing Uploaded Successfully!
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#52525b', marginTop: '6px' }}>
              Your section team and the Project Manager have been notified.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
            <div className="input-group">
              <label className="input-label">Drawing / Document Title *</label>
              <input
                type="text"
                className="input-text"
                placeholder="e.g. Marina Bay - Substation Single Line & Earthing Grid"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="input-group">
                <label className="input-label">File Name (with extension) *</label>
                <input
                  type="text"
                  className="input-text"
                  placeholder="e.g. DG5-ELEC-SLD-Rev3.dwg"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label">Format / Extension</label>
                <select
                  className="select-input"
                  value={fileType}
                  onChange={(e) => setFileType(e.target.value as FileType)}
                >
                  <option value="dwg">AutoCAD Drawing (.dwg)</option>
                  <option value="pdf">PDF Specification (.pdf)</option>
                  <option value="bim">Revit / BIM Model (.bim/.rvt)</option>
                  <option value="xlsx">Excel / BOQ Schedule (.xlsx)</option>
                  <option value="docx">Word Specification (.docx)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="input-group">
                <label className="input-label">Discipline / Section *</label>
                <select
                  className="select-input"
                  value={discipline}
                  onChange={(e) => setDiscipline(e.target.value as DisciplineType)}
                >
                  <option value="Electrical">Electrical Engineering</option>
                  <option value="Civil">Civil & Structural</option>
                  <option value="Plumbing">Plumbing & MEP</option>
                  <option value="Architectural">Architectural Design</option>
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Revision Version</label>
                <input
                  type="text"
                  className="input-text"
                  placeholder="e.g. Rev 2.1 - Approved for Construction"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Associated Project</label>
              <select
                className="select-input"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.code} - {p.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Engineering Notes & Statutory Remarks</label>
              <textarea
                className="textarea-input"
                rows={3}
                placeholder="Include details about compliance, voltage ratings, concrete mix specs, or revisions..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px',
                marginTop: '12px',
                paddingTop: '16px',
                borderTop: '1px solid #e4e4e7',
              }}
            >
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" style={{ gap: '6px' }}>
                <FileCheck size={16} />
                <span>Upload to Vault</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
