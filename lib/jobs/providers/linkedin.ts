import { JobProvider } from '../provider';
import { Job, JobSearchParams, JobSearchResult } from '../types';
import { MOCK_JOBS } from '../data/mockJobs';

export class LinkedInJobProvider implements JobProvider {
  name = 'LinkedIn';

  async searchJobs(params: JobSearchParams): Promise<JobSearchResult> {
    const { query = 'Professional', location = 'India', page = 1, limit = 10 } = params;
    const start = (page - 1) * limit;

    try {
      const url = `https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=${encodeURIComponent(
        query
      )}&location=${encodeURIComponent(location)}&start=${start}`;

      const res = await fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9',
        },
      });

      if (!res.ok) {
        throw new Error(`LinkedIn guest search failed with status ${res.status}`);
      }

      const html = await res.text();
      const items = html.split('<li>');
      const jobs: Job[] = [];

      const skillKeywords = [
        'React', 'TypeScript', 'Node.js', 'NodeJS', 'Python', 'Java', 'SQL', 'PostgreSQL',
        'AWS', 'Docker', 'Kubernetes', 'JavaScript', 'HTML', 'CSS', 'Figma', 'UI/UX',
        'Excel', 'Tableau', 'Power BI', 'Git', 'Django', 'FastAPI', 'Spring Boot',
        'Next.js', 'TailwindCSS', 'Go', 'GraphQL', 'Express', 'MongoDB', 'Angular',
        'Ruby', 'Kotlin', 'Swift', 'C++', 'C#', 'QA', 'Testing'
      ];

      for (let i = 1; i < items.length; i++) {
        const block = items[i];

        const idMatch = block.match(/data-entity-urn="urn:li:jobPosting:(\d+)"/);
        const id = idMatch ? 'linkedin-' + idMatch[1] : null;
        if (!id) continue;

        const linkMatch = block.match(/href="([^"]+)"/);
        const applyUrl = linkMatch ? linkMatch[1].replace(/&amp;/g, '&') : '';

        const titleMatch =
          block.match(/<h3 class="[^"]*title[^"]*">([\s\S]*?)<\/h3>/) ||
          block.match(/<span class="sr-only">([\s\S]*?)<\/span>/);
        const title = titleMatch ? titleMatch[1].trim().replace(/<[^>]*>/g, '') : 'Software Engineer';

        const companyMatch =
          block.match(/<h4 class="[^"]*subtitle[^"]*">([\s\S]*?)<\/h4>/) ||
          block.match(/<a[^>]*class="[^"]*subtitle-link[^"]*"[^>]*>([\s\S]*?)<\/a>/);
        const company = companyMatch ? companyMatch[1].trim().replace(/<[^>]*>/g, '').trim() : 'Hiring Company';

        const locationMatch = block.match(/<span class="job-search-card__location">([\s\S]*?)<\/span>/);
        const jobLocation = locationMatch ? locationMatch[1].trim().replace(/<[^>]*>/g, '') : location;

        const dateMatch = block.match(/<time[^>]*datetime="([^"]+)"[^>]*>([\s\S]*?)<\/time>/);
        const postedAt = dateMatch ? new Date(dateMatch[1]).toISOString() : new Date().toISOString();

        // Extract skills based on title match
        const jobSkills = skillKeywords.filter((skill) =>
          title.toLowerCase().includes(skill.toLowerCase())
        );
        if (jobSkills.length === 0) {
          const titleWords = title.split(/[\s,.\-\/()]+/).filter(w => w.length > 3 && !['hiring', 'manager', 'associate', 'senior', 'junior', 'officer', 'executive', 'lead', 'specialist', 'analyst', 'developer', 'engineer', 'professional'].includes(w.toLowerCase()));
          jobSkills.push(...titleWords.slice(0, 3));
          if (query && query !== 'Professional' && !jobSkills.some(s => s.toLowerCase() === query.toLowerCase())) {
            jobSkills.push(query);
          }
        }

        // Determine experience from title
        let experience = '1-3 years';
        const titleLower = title.toLowerCase();
        if (
          titleLower.includes('junior') ||
          titleLower.includes('jr') ||
          titleLower.includes('intern') ||
          titleLower.includes('fresher') ||
          titleLower.includes('associate')
        ) {
          experience = 'Freshers';
        } else if (
          titleLower.includes('senior') ||
          titleLower.includes('sr') ||
          titleLower.includes('lead') ||
          titleLower.includes('principal') ||
          titleLower.includes('manager')
        ) {
          experience = '5+ years';
        }

        jobs.push({
          id,
          title,
          company,
          location: jobLocation,
          description: '', // Loaded dynamically in getJobById
          skills: jobSkills,
          experience,
          salary: 'Competitive Salary',
          postedAt,
          applyUrl,
          source: 'LinkedIn',
        });
      }

      return {
        jobs,
        total: jobs.length * 5,
        page,
        totalPages: 5,
      };
    } catch (err) {
      console.error('LinkedIn Guest Scraper Error:', err);
      const filtered = MOCK_JOBS.filter(j => 
        j.source === 'linkedin' && 
        (query === 'Professional' || 
         j.title.toLowerCase().includes(query.toLowerCase()) || 
         j.description.toLowerCase().includes(query.toLowerCase()))
      );
      return {
        jobs: filtered.slice(start, start + limit),
        total: filtered.length,
        page,
        totalPages: Math.ceil(filtered.length / limit) || 1
      };
    }
  }

  async getJobById(id: string): Promise<Job | null> {
    const mockJob = MOCK_JOBS.find(j => j.id === id);
    if (mockJob) return mockJob;

    const numericId = id.replace('linkedin-', '');

    try {
      const url = `https://www.linkedin.com/jobs-guest/jobs/api/jobPosting/${numericId}`;
      const res = await fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      });

      let description = '';
      let title = '';
      let company = '';
      let location = '';
      let applyUrl = `https://www.linkedin.com/jobs/view/${numericId}`;
      let jobSkills: string[] = [];
      let experience = '1-3 years';

      if (res.status === 200) {
        const html = await res.text();

        // Extract Description from HTML content
        const descMatch =
          html.match(/<div class="description__text[^>]*>([\s\S]*?)<\/div>/) ||
          html.match(/<section class="description">([\s\S]*?)<\/section>/) ||
          html.match(/<div class="show-more-less-html__markup[^>]*>([\s\S]*?)<\/div>/);

        if (descMatch) {
          description = descMatch[1]
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<\/p>/gi, '\n')
            .replace(/<li[^>]*>/gi, '• ')
            .replace(/<\/li>/gi, '\n')
            .replace(/<[^>]*>/g, '')
            .trim();
        }

        // Extract Title
        const titleMatch = html.match(/<h1 class="top-card-layout__title[^>]*>([\s\S]*?)<\/h1>/);
        if (titleMatch) title = titleMatch[1].trim().replace(/<[^>]*>/g, '');

        // Extract Company
        const companyMatch =
          html.match(/<a[^>]*class="topcard__org-name-link"[^>]*>([\s\S]*?)<\/a>/) ||
          html.match(/<span class="topcard__flavor">([\s\S]*?)<\/span>/);
        if (companyMatch) company = companyMatch[1].trim().replace(/<[^>]*>/g, '').trim();

        // Extract Location
        const locMatch = html.match(/<span class="topcard__flavor topcard__flavor--bullet">([\s\S]*?)<\/span>/);
        if (locMatch) location = locMatch[1].trim().replace(/<[^>]*>/g, '');

        // Extract skills
        const skillKeywords = [
          'React', 'TypeScript', 'Node.js', 'Python', 'Java', 'SQL', 'PostgreSQL',
          'AWS', 'Docker', 'Kubernetes', 'JavaScript', 'HTML', 'CSS', 'Figma', 'UI/UX',
          'Excel', 'Tableau', 'Power BI', 'Git', 'Django', 'FastAPI', 'Spring Boot',
          'Next.js', 'TailwindCSS', 'Go', 'GraphQL', 'Express', 'MongoDB'
        ];
        const descLower = description.toLowerCase();
        const detected = skillKeywords.filter((skill) => descLower.includes(skill.toLowerCase()));
        if (detected.length > 0) jobSkills = detected;

        // Determine experience
        const titleLower = title.toLowerCase();
        if (
          titleLower.includes('junior') ||
          titleLower.includes('jr') ||
          titleLower.includes('intern') ||
          titleLower.includes('fresher')
        ) {
          experience = 'Freshers';
        } else if (
          titleLower.includes('senior') ||
          titleLower.includes('sr') ||
          titleLower.includes('lead')
        ) {
          experience = '5+ years';
        }
      }

      // If parsing failed or details are empty, return null so that registry.ts
      // can gracefully fall back to returning the correct job info from the search cache.
      if (!description || !title) {
        return null;
      }

      return {
        id,
        title,
        company,
        location,
        description,
        skills: jobSkills,
        experience,
        salary: 'Competitive Salary',
        postedAt: new Date().toISOString(),
        applyUrl,
        source: 'LinkedIn',
      };
    } catch (e) {
      console.error('LinkedIn Detail Scrape Error:', e);
      return null;
    }
  }
}
