'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Project, ProjectPhase, DisciplineType } from '@/types';
import { INITIAL_PROJECTS } from '@/data/mockData';

export interface DeadlineItem {
  projectId: string;
  projectCode: string;
  projectTitle: string;
  phaseId: string;
  phaseName: string;
  phaseNumber: number;
  assignedSection: DisciplineType | 'All';
  leadPerson: string;
  deadline: string;
  status: string;
  progress: number;
  daysRemaining: number;
  isUrgent: boolean;
  isOverdue: boolean;
  deliverables: string[];
}

interface ProjectContextType {
  projects: Project[];
  addProject: (project: Omit<Project, 'id' | 'overallProgress'>) => Project;
  updatePhaseStatus: (projectId: string, phaseId: string, status: ProjectPhase['status'], progress: number) => void;
  deleteProject: (projectId: string) => void;
  allDeadlines: DeadlineItem[];
  urgentDeadlines: DeadlineItem[];
  getDeadlinesByDiscipline: (discipline?: DisciplineType | 'All') => DeadlineItem[];
  totalStats: {
    totalProjects: number;
    activeProjects: number;
    totalPhases: number;
    completedPhases: number;
    criticalDeadlinesCount: number;
  };
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('dg5_projects');
      if (stored) {
        setProjects(JSON.parse(stored));
      }
    } catch {
      setProjects(INITIAL_PROJECTS);
    }
    setIsLoaded(true);
  }, []);

  const saveProjects = (updated: Project[]) => {
    setProjects(updated);
    try {
      localStorage.setItem('dg5_projects', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  };

  const addProject = (projectData: Omit<Project, 'id' | 'overallProgress'>): Project => {
    // Calculate overall progress based on phase completion
    const totalPhases = projectData.phases.length;
    const completedPhases = projectData.phases.filter((p) => p.status === 'Completed').length;
    const progress = totalPhases > 0 ? Math.round((completedPhases / totalPhases) * 100) : 0;

    const newProject: Project = {
      ...projectData,
      id: `prj-dg5-${Date.now()}`,
      overallProgress: progress,
    };

    const updated = [newProject, ...projects];
    saveProjects(updated);
    return newProject;
  };

  const updatePhaseStatus = (
    projectId: string,
    phaseId: string,
    status: ProjectPhase['status'],
    progress: number
  ) => {
    const updated = projects.map((prj) => {
      if (prj.id !== projectId) return prj;

      const updatedPhases = prj.phases.map((ph) => {
        if (ph.id !== phaseId) return ph;
        return {
          ...ph,
          status,
          progress: Math.min(100, Math.max(0, progress)),
        };
      });

      // Recalculate project progress
      const totalPhaseCount = updatedPhases.length;
      const totalProgressSum = updatedPhases.reduce((acc, curr) => acc + curr.progress, 0);
      const overallProgress = totalPhaseCount > 0 ? Math.round(totalProgressSum / totalPhaseCount) : 0;

      return {
        ...prj,
        phases: updatedPhases,
        overallProgress,
      };
    });

    saveProjects(updated);
  };

  const deleteProject = (projectId: string) => {
    const updated = projects.filter((p) => p.id !== projectId);
    saveProjects(updated);
  };

  // Compile all deadlines across all projects and phases
  const allDeadlines = useMemo<DeadlineItem[]>(() => {
    const today = new Date('2026-10-06'); // Reference baseline matching system time
    const list: DeadlineItem[] = [];

    projects.forEach((prj) => {
      prj.phases.forEach((phase) => {
        const deadlineDate = new Date(phase.deadline);
        const diffTime = deadlineDate.getTime() - today.getTime();
        const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const isOverdue = daysRemaining < 0 && phase.status !== 'Completed';
        const isUrgent = daysRemaining <= 10 && phase.status !== 'Completed';

        list.push({
          projectId: prj.id,
          projectCode: prj.code,
          projectTitle: prj.title,
          phaseId: phase.id,
          phaseName: phase.name,
          phaseNumber: phase.phaseNumber,
          assignedSection: phase.assignedSection,
          leadPerson: phase.leadPerson,
          deadline: phase.deadline,
          status: phase.status,
          progress: phase.progress,
          daysRemaining,
          isUrgent,
          isOverdue,
          deliverables: phase.deliverables,
        });
      });
    });

    // Sort by urgent / upcoming first
    return list.sort((a, b) => a.daysRemaining - b.daysRemaining);
  }, [projects]);

  const urgentDeadlines = useMemo(() => {
    return allDeadlines.filter((d) => d.status !== 'Completed' && (d.isUrgent || d.isOverdue));
  }, [allDeadlines]);

  const getDeadlinesByDiscipline = (discipline?: DisciplineType | 'All') => {
    if (!discipline || discipline === 'All') return allDeadlines;
    return allDeadlines.filter((d) => d.assignedSection === discipline || d.assignedSection === 'All');
  };

  const totalStats = useMemo(() => {
    let totalPhases = 0;
    let completedPhases = 0;

    projects.forEach((prj) => {
      totalPhases += prj.phases.length;
      completedPhases += prj.phases.filter((p) => p.status === 'Completed').length;
    });

    return {
      totalProjects: projects.length,
      activeProjects: projects.filter((p) => p.status === 'Active').length,
      totalPhases,
      completedPhases,
      criticalDeadlinesCount: urgentDeadlines.length,
    };
  }, [projects, urgentDeadlines]);

  if (!isLoaded) return null;

  return (
    <ProjectContext.Provider
      value={{
        projects,
        addProject,
        updatePhaseStatus,
        deleteProject,
        allDeadlines,
        urgentDeadlines,
        getDeadlinesByDiscipline,
        totalStats,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
}
