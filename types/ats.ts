export interface ATSSuggestion {
  section: string
  issue: string
  fix: string
  priority: 'high' | 'medium' | 'low'
}

export interface SectionScore {
  name: string
  score: number
  maxScore: number
  issues: string[]
}

export interface KeywordMatch {
  keyword: string;
  found: boolean;
  frequency: number;
}

export interface SectionCompletenessItem {
  section: string;
  score: number;
  maxScore: number;
  issues: string[];
}

export interface FormattingIssue {
  type: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
}

export interface ATSResult {
  id?: string;
  overallScore: number;
  keywordScore: number;
  completenessScore: number;
  formattingScore: number;
  keywords: KeywordMatch[];
  completeness: SectionCompletenessItem[];
  formatting: FormattingIssue[];
  suggestions: ATSSuggestion[];
  jobTitle?: string;
  analyzedAt?: string;
}