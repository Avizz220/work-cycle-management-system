export type UserRole = 'pm' | 'hod' | 'employee';

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
  // Role-specific profile attributes
  specialization?: string;
  reportingHOD?: string;
  experienceLevel?: string;
  employeeId?: string;
  primaryTool?: string;
  deptOffice?: string;
  approvalCode?: string;
  managementExperience?: string;
  teamCapacity?: string;
  projectPortfolio?: string;
  pmpLicense?: string;
  executiveKey?: string;
  officeExtension?: string;
}

export type PhaseStatus = 'Pending' | 'In Progress' | 'Under Review' | 'Completed';

export interface DeliverableNoticeComment {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  recipientName: string;
  content: string;
  timestamp: string;
  isNotice?: boolean;
}

export interface PhaseDeliverableItem {
  id: string;
  name: string;
  discipline: DisciplineType; // 'Electrical' | 'Civil' | 'Plumbing' | 'Architectural'
  fileName: string;
  fileSize: string;
  fileType: FileType;
  version: string;
  uploadedBy: {
    id: string;
    name: string;
    title: string;
    avatar: string;
    discipline: DisciplineType;
  };
  uploadDate: string;
  status: 'Pending Review' | 'Approved' | 'Needs Revision';
  comments?: DeliverableNoticeComment[];
}

export interface SectionCompletionStatus {
  Electrical?: boolean;
  Civil?: boolean;
  Plumbing?: boolean;
  Architectural?: boolean;
  [key: string]: boolean | undefined;
}

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
  deliverableItems?: PhaseDeliverableItem[];
  sectionCompletion?: SectionCompletionStatus;
  assignedMemberIds?: string[];
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
  assignedMemberIds?: string[];
}

export interface PMNotification {
  id: string;
  type: 'phase_completed' | 'project_completed' | 'notice_sent';
  title: string;
  message: string;
  timestamp: string;
  projectId: string;
  projectCode: string;
  phaseId?: string;
  read: boolean;
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

