export type UserRole = 'pm' | 'employee';

export type DisciplineType =
  | 'Management'
  | 'Electrical'
  | 'Civil'
  | 'Plumbing'
  | 'Architectural'
  | 'Structural';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  discipline: DisciplineType;
  title: string;
  avatar: string;
  phone: string;
}

export type PhaseStatus = 'Pending' | 'In Progress' | 'Under Review' | 'Completed';

export interface ProjectPhase {
  id: string;
  phaseNumber: number;
  name: string;
  assignedSection: DisciplineType | 'All';
  leadPerson: string;
  startDate: string;
  deadline: string;
  status: PhaseStatus;
  progress: number; // 0 - 100
  deliverables: string[];
  critical: boolean;
}

export type ProjectStatus = 'Planning' | 'Active' | 'On Hold' | 'Completed';
export type ProjectCategory = 'Commercial' | 'Residential' | 'Infrastructure' | 'Healthcare' | 'Industrial';

export interface Project {
  id: string;
  code: string;
  title: string;
  client: string;
  location: string;
  category: ProjectCategory;
  budget: string;
  startDate: string;
  targetCompletion: string;
  overallProgress: number;
  status: ProjectStatus;
  projectManager: string;
  description: string;
  phases: ProjectPhase[];
  keyDisciplines: DisciplineType[];
}

export interface SectionMessage {
  id: string;
  discipline: DisciplineType;
  senderId: string;
  senderName: string;
  senderRole: string;
  senderAvatar: string;
  timestamp: string;
  content: string;
  urgent?: boolean;
  attachmentName?: string;
}

export type FileType = 'dwg' | 'pdf' | 'bim' | 'xlsx' | 'docx' | 'image';

export interface SharedFile {
  id: string;
  title: string;
  fileName: string;
  fileSize: string;
  fileType: FileType;
  discipline: DisciplineType;
  version: string;
  uploadedBy: string;
  uploadDate: string;
  projectId: string;
  projectTitle: string;
  notes: string;
  downloadsCount: number;
}
