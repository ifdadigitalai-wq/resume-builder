export type ResumeStatus = 'DRAFT' | 'COMPLETE' | 'SUBMITTED';

export interface Socials {
  linkedIn?: string;
  github?: string;
  portfolio?: string;
}

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  socials?: Socials;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  cgpa?: string;
  highlights?: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  link?: string;
  startDate?: string;
  endDate?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
}

export interface ResumeSections {
  personal: PersonalInfo;
  summary: string;
  education: Education[];
  experience: WorkExperience[];
  projects: Project[];
  skills: string[];
  certifications: Certification[];
}

export interface ResumeLayoutOptions {
  themeColor: string;
  fontSize: 'sm' | 'md' | 'lg';
  fontFamily: 'sans' | 'serif' | 'mono' | 'display';
  lineHeight: 'compact' | 'normal' | 'loose';
  spacing: 'compact' | 'normal' | 'loose';
}

export interface ResumeData extends ResumeSections {
  id?: string;
  userId?: string;
  title: string;
  status: ResumeStatus;
  completionScore: number;
  atsScore?: number | null;
  deletedAt?: string | Date | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  sections?: ResumeSections;
  layout?: ResumeLayoutOptions;
}

export type SectionKey = keyof ResumeSections;