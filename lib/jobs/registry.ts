import { JobProvider } from './provider';
import { LinkedInJobProvider } from './providers/linkedin';
import { NaukriJobProvider } from './providers/naukri';
import { Job, JobSearchParams, JobSearchResult } from './types';

export class JobProviderRegistry {
  private providers: JobProvider[] = [];

  constructor() {
    this.providers.push(new LinkedInJobProvider());
    this.providers.push(new NaukriJobProvider());
  }

  getProviders(): JobProvider[] {
    return this.providers;
  }

  async searchAll(params: JobSearchParams): Promise<JobSearchResult> {
    const { page = 1, limit = 10 } = params;

    // Fetch from all providers in parallel with a buffer limit to ensure full page sizes after filtering
    const searchPromises = this.providers.map((provider) =>
      provider
        .searchJobs({
          ...params,
          page,
          limit: Math.max(10, limit * 2),
        })
        .catch((err) => {
          console.error(`Provider ${provider.name} failed:`, err);
          return { jobs: [], total: 0, page, totalPages: 0 };
        })
    );

    const results = await Promise.all(searchPromises);

    // Merge jobs and sum up totals
    const mergedJobs: Job[] = [];
    let originalTotal = 0;

    results.forEach((r) => {
      mergedJobs.push(...r.jobs);
      originalTotal += r.total;
    });

    // Filter jobs: onsite and hybrid must be in Delhi/NCR; remote is unrestricted across India
    const filteredJobs = mergedJobs.filter((job) => {
      const loc = job.location.toLowerCase();
      // If it's a remote job, it can be located anywhere
      if (loc.includes('remote')) {
        return true;
      }
      // If it's onsite or hybrid, it must be restricted to Delhi and NCR
      const delhiNcrKeywords = ['delhi', 'ncr', 'noida', 'gurgaon', 'gurugram', 'faridabad', 'ghaziabad'];
      return delhiNcrKeywords.some((k) => loc.includes(k));
    });

    // Sort by posted date descending
    filteredJobs.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());

    // Scale the estimated total based on the filter pass rate of the current page
    const passRate = mergedJobs.length > 0 ? filteredJobs.length / mergedJobs.length : 1;
    const estimatedTotal = Math.round(originalTotal * passRate);

    const totalPages = Math.max(1, Math.ceil(estimatedTotal / limit));

    return {
      jobs: filteredJobs.slice(0, limit),
      total: estimatedTotal,
      page,
      totalPages,
    };
  }

  async getJobById(id: string): Promise<Job | null> {
    for (const provider of this.providers) {
      if (
        (id.startsWith('linkedin-') && provider.name === 'LinkedIn') ||
        (id.startsWith('naukri-') && provider.name === 'Naukri.com')
      ) {
        const job = await provider.getJobById(id);
        if (job) return job;
      }
    }

    for (const provider of this.providers) {
      const job = await provider.getJobById(id);
      if (job) return job;
    }

    return null;
  }
}

export const jobRegistry = new JobProviderRegistry();
