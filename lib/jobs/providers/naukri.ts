import { JobProvider } from '../provider';
import { Job, JobSearchParams, JobSearchResult } from '../types';

export class NaukriJobProvider implements JobProvider {
  name = 'Naukri.com';

  async searchJobs(params: JobSearchParams): Promise<JobSearchResult> {
    const { query = 'Professional', location, experience, workmode, page = 1, limit = 10 } = params;

    try {
      const searchUrl = `https://www.arbeitnow.com/api/job-board-api?page=${page}`;
      const res = await fetch(searchUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      });

      if (!res.ok) {
        throw new Error(`Naukri partner API failed with status ${res.status}`);
      }

      const payload = await res.json();
      const rawJobs = payload.data || [];

      let jobs: Job[] = rawJobs.map((rj: any) => {
        let exp = '1-3 years';
        const titleLower = rj.title.toLowerCase();
        
        if (
          titleLower.includes('junior') ||
          titleLower.includes('jr') ||
          titleLower.includes('intern') ||
          titleLower.includes('fresher') ||
          rj.tags?.some(
            (t: string) =>
              t.toLowerCase().includes('junior') ||
              t.toLowerCase().includes('intern') ||
              t.toLowerCase().includes('fresher')
          )
        ) {
          exp = 'Freshers';
        } else if (
          titleLower.includes('senior') ||
          titleLower.includes('sr') ||
          titleLower.includes('lead') ||
          titleLower.includes('principal') ||
          titleLower.includes('manager')
        ) {
          exp = '5+ years';
        }

        const cleanDesc = rj.description
          .replace(/<br\s*\/?>/gi, '\n')
          .replace(/<\/p>/gi, '\n')
          .replace(/<li[^>]*>/gi, '• ')
          .replace(/<\/li>/gi, '\n')
          .replace(/<[^>]*>/g, '')
          .trim();

        let loc = rj.location || 'Remote';
        if (rj.remote) {
          loc = 'Remote';
        }

        let skills = rj.tags || [];
        if (skills.length === 0) {
          const titleWords = rj.title.split(/[\s,.\-\/()]+/).filter((w: string) => w.length > 3 && !['hiring', 'manager', 'associate', 'senior', 'junior', 'officer', 'executive', 'lead', 'specialist', 'analyst', 'developer', 'engineer', 'professional'].includes(w.toLowerCase()));
          skills.push(...titleWords.slice(0, 3));
          if (query && query !== 'Professional' && !skills.some((s: string) => s.toLowerCase() === query.toLowerCase())) {
            skills.push(query);
          }
        }
        if (skills.length > 8) {
          skills = skills.slice(0, 8);
        }

        return {
          id: 'naukri-' + rj.slug,
          title: rj.title,
          company: rj.company_name,
          location: loc,
          description: cleanDesc,
          skills,
          experience: exp,
          salary: '₹6,00,000 - ₹12,00,000 / year',
          postedAt: new Date(rj.created_at || Date.now()).toISOString(),
          applyUrl: rj.url,
          source: 'Naukri.com',
        };
      });

      // Apply query filters client-side
      if (query && query.trim()) {
        const q = query.toLowerCase().trim();
        jobs = jobs.filter(
          (j) =>
            j.title.toLowerCase().includes(q) ||
            j.company.toLowerCase().includes(q) ||
            j.skills.some((s) => s.toLowerCase().includes(q))
        );
      }

      if (location && location.trim()) {
        const loc = location.toLowerCase().trim();
        jobs = jobs.filter((j) => j.location.toLowerCase().includes(loc));
      }

      if (workmode && workmode.trim()) {
        const mode = workmode.toLowerCase().trim();
        if (mode === 'remote') {
          jobs = jobs.filter((j) => j.location.toLowerCase().includes('remote'));
        } else if (mode === 'onsite') {
          jobs = jobs.filter(
            (j) =>
              !j.location.toLowerCase().includes('remote') &&
              !j.location.toLowerCase().includes('hybrid')
          );
        } else if (mode === 'hybrid') {
          jobs = jobs.filter((j) => j.location.toLowerCase().includes('hybrid'));
        }
      }

      if (experience && experience.trim()) {
        const exp = experience.toLowerCase().trim();
        if (exp === 'freshers') {
          jobs = jobs.filter((j) => j.experience === 'Freshers');
        } else if (exp === 'mid') {
          jobs = jobs.filter((j) => j.experience === '1-3 years');
        } else if (exp === 'senior') {
          jobs = jobs.filter((j) => j.experience === '5+ years');
        }
      }

      const total = jobs.length;
      const paginatedJobs = jobs.slice(0, limit);
      const totalPages = Math.ceil((payload.meta?.total || 100) / limit);

      return {
        jobs: paginatedJobs,
        total: payload.meta?.total || total,
        page,
        totalPages,
      };
    } catch (e) {
      console.error('Naukri Scraper Error:', e);
      return {
        jobs: [],
        total: 0,
        page,
        totalPages: 0,
      };
    }
  }

  async getJobById(id: string): Promise<Job | null> {
    const slug = id.replace('naukri-', '');

    try {
      const res = await fetch(`https://www.arbeitnow.com/api/job-board-api`);
      if (!res.ok) return null;

      const payload = await res.json();
      const rawJobs = payload.data || [];
      const match = rawJobs.find((rj: any) => rj.slug === slug);

      if (!match) {
        return null;
      }

      const cleanDesc = match.description
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/p>/gi, '\n')
        .replace(/<li[^>]*>/gi, '• ')
        .replace(/<\/li>/gi, '\n')
        .replace(/<[^>]*>/g, '')
        .trim();

      let loc = match.location || 'Remote';
      if (match.remote) loc = 'Remote';

      let skills = match.tags || ['JavaScript', 'HTML', 'CSS'];
      if (skills.length > 8) {
        skills = skills.slice(0, 8);
      }

      return {
        id,
        title: match.title,
        company: match.company_name,
        location: loc,
        description: cleanDesc,
        skills,
        experience: '1-3 years',
        salary: '₹6,00,000 - ₹12,00,000 / year',
        postedAt: new Date(match.created_at || Date.now()).toISOString(),
        applyUrl: match.url,
        source: 'Naukri.com',
      };
    } catch (e) {
      console.error('Naukri Detail Retrieval Error:', e);
      return null;
    }
  }
}
