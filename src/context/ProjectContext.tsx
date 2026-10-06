'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Project,
  ProjectPhase,
  DisciplineType,
  PMNotification,
  PhaseDeliverableItem,
  DeliverableNoticeComment,
} from '@/types';
import {
  INITIAL_PROJECTS,
  INITIAL_PM_NOTIFICATIONS,
  INITIAL_USERS,
  buildPhaseDeliverables,
} from '@/data/mockData';

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
  pmNotifications: PMNotification[];
  addProject: (project: Omit<Project, 'id' | 'overallProgress'>) => Project;
  updatePhaseStatus: (projectId: string, phaseId: string, status: ProjectPhase['status'], progress: number) => void;
  deleteProject: (projectId: string) => void;
  assignMembersToProject: (projectId: string, memberIds: string[]) => void;
  assignDivisionToProject: (projectId: string, discipline: DisciplineType) => void;
  removeMemberFromProject: (projectId: string, memberId: string) => void;
  assignMembersToPhase: (projectId: string, phaseId: string, memberIds: string[]) => void;
  markSectionCompleted: (
    projectId: string,
    phaseId: string,
    section: DisciplineType,
    completed: boolean
  ) => void;
  addDeliverableComment: (
    projectId: string,
    phaseId: string,
    deliverableId: string,
    comment: string,
    isNotice?: boolean
  ) => void;
  markNotificationRead: (notificationId: string) => void;
  clearAllNotifications: () => void;
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
  const [pmNotifications, setPmNotifications] = useState<PMNotification[]>(INITIAL_PM_NOTIFICATIONS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedProjects = localStorage.getItem('dg5_projects_v2');
      if (storedProjects) {
        setProjects(JSON.parse(storedProjects));
      } else {
        setProjects(INITIAL_PROJECTS);
      }

      const storedNotifs = localStorage.getItem('dg5_pm_notifications_v2');
      if (storedNotifs) {
        setPmNotifications(JSON.parse(storedNotifs));
      } else {
        setPmNotifications(INITIAL_PM_NOTIFICATIONS);
      }
    } catch {
      setProjects(INITIAL_PROJECTS);
      setPmNotifications(INITIAL_PM_NOTIFICATIONS);
    }
    setIsLoaded(true);
  }, []);

  const saveProjects = (updated: Project[]) => {
    setProjects(updated);
    try {
      localStorage.setItem('dg5_projects_v2', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  };

  const saveNotifications = (updated: PMNotification[]) => {
    setPmNotifications(updated);
    try {
      localStorage.setItem('dg5_pm_notifications_v2', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save notifications', e);
    }
  };

  const addProject = (projectData: Omit<Project, 'id' | 'overallProgress'>): Project => {
    const totalPhases = projectData.phases.length;
    const completedPhases = projectData.phases.filter((p) => p.status === 'Completed').length;
    const progress = totalPhases > 0 ? Math.round((completedPhases / totalPhases) * 100) : 0;

    // Ensure phases have deliverable items and section completions
    const enhancedPhases = projectData.phases.map((ph) => {
      const deliverableItems =
        ph.deliverableItems ||
        buildPhaseDeliverables(projectData.code, ph.phaseNumber, ph.name, ph.status === 'Completed');
      const sectionCompletion =
        ph.sectionCompletion ||
        (ph.status === 'Completed'
          ? { Electrical: true, Civil: true, Plumbing: true, Architectural: true }
          : { Electrical: false, Civil: false, Plumbing: false, Architectural: false });

      return {
        ...ph,
        deliverableItems,
        sectionCompletion,
        assignedMemberIds: ph.assignedMemberIds || [],
      };
    });

    const newProject: Project = {
      ...projectData,
      id: `prj-dg5-${Date.now()}`,
      overallProgress: progress,
      phases: enhancedPhases,
      assignedMemberIds: projectData.assignedMemberIds || ['usr-pm-1', 'usr-elec-1', 'usr-civil-1'],
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

  // Team Assignment Helpers
  const assignMembersToProject = (projectId: string, memberIds: string[]) => {
    const updated = projects.map((prj) => {
      if (prj.id !== projectId) return prj;
      const current = prj.assignedMemberIds || [];
      const merged = Array.from(new Set([...current, ...memberIds]));
      return { ...prj, assignedMemberIds: merged };
    });
    saveProjects(updated);
  };

  const assignDivisionToProject = (projectId: string, discipline: DisciplineType) => {
    const divisionUsers = INITIAL_USERS.filter((u) => u.discipline === discipline);
    const divisionUserIds = divisionUsers.map((u) => u.id);
    assignMembersToProject(projectId, divisionUserIds);
  };

  const removeMemberFromProject = (projectId: string, memberId: string) => {
    const updated = projects.map((prj) => {
      if (prj.id !== projectId) return prj;
      const current = prj.assignedMemberIds || [];
      return {
        ...prj,
        assignedMemberIds: current.filter((id) => id !== memberId),
      };
    });
    saveProjects(updated);
  };

  const assignMembersToPhase = (projectId: string, phaseId: string, memberIds: string[]) => {
    const updated = projects.map((prj) => {
      if (prj.id !== projectId) return prj;
      const updatedPhases = prj.phases.map((ph) => {
        if (ph.id !== phaseId) return ph;
        return { ...ph, assignedMemberIds: memberIds };
      });
      return { ...prj, phases: updatedPhases };
    });
    saveProjects(updated);
  };

  // Section completion approval & automatic phase/project completion
  const markSectionCompleted = (
    projectId: string,
    phaseId: string,
    section: DisciplineType,
    completed: boolean
  ) => {
    let phaseJustCompleted = false;
    let completedPhaseName = '';
    let targetProjectCode = '';
    let targetProjectTitle = '';
    let projectJustCompleted = false;

    const updated = projects.map((prj) => {
      if (prj.id !== projectId) return prj;
      targetProjectCode = prj.code;
      targetProjectTitle = prj.title;

      const updatedPhases = prj.phases.map((ph) => {
        if (ph.id !== phaseId) return ph;

        const currentSectionCompletion = ph.sectionCompletion || {
          Electrical: false,
          Civil: false,
          Plumbing: false,
          Architectural: false,
        };

        const newSectionCompletion = {
          ...currentSectionCompletion,
          [section]: completed,
        };

        // Standard 4 multidisciplinary sections: Electrical, Civil, Plumbing, Architectural
        const disciplines: (keyof typeof newSectionCompletion)[] = [
          'Electrical',
          'Civil',
          'Plumbing',
          'Architectural',
        ];
        const completedCount = disciplines.filter((d) => newSectionCompletion[d]).length;
        const newProgress = Math.round((completedCount / disciplines.length) * 100);

        let newStatus: ProjectPhase['status'] = 'In Progress';
        if (completedCount === disciplines.length) {
          newStatus = 'Completed';
          if (ph.status !== 'Completed') {
            phaseJustCompleted = true;
            completedPhaseName = ph.name;
          }
        } else if (completedCount === 0) {
          newStatus = 'Pending';
        }

        // Also update deliverable item status within that discipline
        const updatedDeliverables = (ph.deliverableItems || []).map((item) => {
          if (item.discipline === section) {
            return {
              ...item,
              status: completed ? ('Approved' as const) : ('Pending Review' as const),
            };
          }
          return item;
        });

        return {
          ...ph,
          sectionCompletion: newSectionCompletion,
          progress: newProgress,
          status: newStatus,
          deliverableItems: updatedDeliverables,
        };
      });

      // Recalculate project overallProgress
      const totalPhases = updatedPhases.length;
      const completedPhasesCount = updatedPhases.filter((p) => p.status === 'Completed').length;
      const overallProgress =
        totalPhases > 0 ? Math.round((completedPhasesCount / totalPhases) * 100) : 0;

      let newProjectStatus = prj.status;
      if (completedPhasesCount === totalPhases && totalPhases > 0) {
        newProjectStatus = 'Completed';
        if (prj.status !== 'Completed') {
          projectJustCompleted = true;
        }
      } else if (newProjectStatus === 'Completed' && completedPhasesCount < totalPhases) {
        newProjectStatus = 'Active';
      }

      return {
        ...prj,
        phases: updatedPhases,
        overallProgress,
        status: newProjectStatus,
      };
    });

    saveProjects(updated);

    // If a phase was just completed, generate PM-ONLY notification
    if (phaseJustCompleted) {
      const newNotif: PMNotification = {
        id: `notif-${Date.now()}-ph`,
        type: 'phase_completed',
        title: `Phase Completed: ${completedPhaseName}`,
        message: `All 4 engineering sections in Phase "${completedPhaseName}" were approved and marked 100% Completed for project ${targetProjectCode}.`,
        timestamp: 'Just now',
        projectId,
        projectCode: targetProjectCode,
        phaseId,
        read: false,
      };
      saveNotifications([newNotif, ...pmNotifications]);
    }

    // If whole project was completed, generate PM-ONLY notification
    if (projectJustCompleted) {
      const projectNotif: PMNotification = {
        id: `notif-${Date.now()}-prj`,
        type: 'project_completed',
        title: `Contract Fully Completed: ${targetProjectCode}`,
        message: `All phase milestones and engineering deliverables are complete. Project "${targetProjectTitle}" is 100% finished!`,
        timestamp: 'Just now',
        projectId,
        projectCode: targetProjectCode,
        read: false,
      };
      saveNotifications([projectNotif, ...pmNotifications]);
    }
  };

  // Add Comment / Notice to specific deliverable
  const addDeliverableComment = (
    projectId: string,
    phaseId: string,
    deliverableId: string,
    comment: string,
    isNotice = false
  ) => {
    const updated = projects.map((prj) => {
      if (prj.id !== projectId) return prj;

      const updatedPhases = prj.phases.map((ph) => {
        if (ph.id !== phaseId) return ph;

        const updatedDeliverables = (ph.deliverableItems || []).map((del) => {
          if (del.id !== deliverableId) return del;

          const newComment: DeliverableNoticeComment = {
            id: `cmt-${Date.now()}`,
            authorId: 'usr-pm-1',
            authorName: 'Arch. Samantha Reed',
            authorRole: 'Project Manager',
            recipientName: del.uploadedBy.name,
            content: comment,
            timestamp: 'Just now',
            isNotice,
          };

          return {
            ...del,
            status: isNotice ? ('Needs Revision' as const) : del.status,
            comments: [...(del.comments || []), newComment],
          };
        });

        return { ...ph, deliverableItems: updatedDeliverables };
      });

      return { ...prj, phases: updatedPhases };
    });

    saveProjects(updated);
  };

  const markNotificationRead = (notificationId: string) => {
    const updated = pmNotifications.map((n) =>
      n.id === notificationId ? { ...n, read: true } : n
    );
    saveNotifications(updated);
  };

  const clearAllNotifications = () => {
    saveNotifications([]);
  };

  // Compile all deadlines across all projects and phases
  const allDeadlines = useMemo<DeadlineItem[]>(() => {
    const today = new Date('2026-10-06');
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

    return list.sort((a, b) => a.daysRemaining - b.daysRemaining);
  }, [projects]);

  const urgentDeadlines = useMemo(() => {
    return allDeadlines.filter((d) => d.status !== 'Completed' && (d.isUrgent || d.isOverdue));
  }, [allDeadlines]);

  const getDeadlinesByDiscipline = (discipline?: DisciplineType | 'All') => {
    if (!discipline || discipline === 'All') return allDeadlines;
    return allDeadlines.filter(
      (d) => d.assignedSection === discipline || d.assignedSection === 'All'
    );
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
        pmNotifications,
        addProject,
        updatePhaseStatus,
        deleteProject,
        assignMembersToProject,
        assignDivisionToProject,
        removeMemberFromProject,
        assignMembersToPhase,
        markSectionCompleted,
        addDeliverableComment,
        markNotificationRead,
        clearAllNotifications,
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
