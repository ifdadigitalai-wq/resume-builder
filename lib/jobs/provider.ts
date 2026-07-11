import { Job, JobSearchParams, JobSearchResult } from './types';

export interface JobProvider {
  name: string;
  searchJobs(params: JobSearchParams): Promise<JobSearchResult>;
  getJobById(id: string): Promise<Job | null>;
}
