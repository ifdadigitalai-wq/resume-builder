export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  skills: string[];
  experience: string;
  salary?: string;
  postedAt: string;
  applyUrl: string;
  source: string;
}

export interface JobSearchParams {
  query?: string;
  location?: string;
  experience?: string;
  workmode?: string;
  page?: number;
  limit?: number;
}

export interface JobSearchResult {
  jobs: Job[];
  total: number;
  page: number;
  totalPages: number;
}

export interface AIMatchResult {
  matchScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  suggestions: string[];
}
