export interface StudentRecord {
  id: string
  name: string
  email: string
  enrollmentNo?: string
  department?: string
  batch?: string
  resumeCount: number
  latestAtsScore?: number
  placementStatus: 'Not Started' | 'In Progress' | 'Ready' | 'Placed'
  lastActive: string
}

export interface OfficerStudent {
  id: string
  initials: string
  name: string
  branch: string
  year: string
  resumeStatus: 'Submitted' | 'Draft' | 'Not Started'
  atsScore: number
  placementReady: boolean
  lastUpdated: string
}

export interface JobPosting {
  id: string
  title: string
  company: string
  description: string
  location?: string
  type: string
  package?: string
  deadline?: string
  isActive: boolean
  createdAt: string
}

export interface OfficerStats {
  totalStudents: number
  resumesCreated: number
  avgAtsScore: number
  readyForPlacement: number
}

export type PlacementStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'READY' | 'PLACED';

export interface StudentSummary {
  id: string;
  name: string;
  email: string;
  studentId?: string | null;
  batch?: string | null;
  course?: string | null;
  placementStatus: PlacementStatus;
  resumeCount: number;
  latestAtsScore?: number | null;
  lastActive?: string | Date;
}