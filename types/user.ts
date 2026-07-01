export type UserRole = 'STUDENT' | 'OFFICER';

export interface UserSession {
  userId: string;
  role: UserRole;
  name: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  studentId?: string | null;
  batch?: string | null;
  course?: string | null;
  avatarUrl?: string | null;
  phone?: string | null;
  linkedIn?: string | null;
  github?: string | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}