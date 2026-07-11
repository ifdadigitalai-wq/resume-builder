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

    // Fetch from all providers in parallel
    const searchPromises = this.providers.map((provider) =>
      provider
        .searchJobs({
          ...params,
          page,
          limit: Math.max(5, Math.ceil(limit / this.providers.length)),
        })
        .catch((err) => {
          console.error(`Provider ${provider.name} failed:`, err);
          return { jobs: [], total: 0, page, totalPages: 0 };
        })
    );

    const results = await Promise.all(searchPromises);

    // Merge jobs
    const mergedJobs: Job[] = [];
    let total = 0;

    results.forEach((r) => {
      mergedJobs.push(...r.jobs);
      total += r.total;
    });

    // Sort by posted date descending
    mergedJobs.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return {
      jobs: mergedJobs.slice(0, limit),
      total,
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
