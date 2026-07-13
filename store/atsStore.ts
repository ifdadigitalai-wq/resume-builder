import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ATSResult } from '@/types/ats'

export interface JobDescriptionHistoryItem {
  id: string
  title: string
  text: string
  timestamp: string
}

interface ATSState {
  result: ATSResult | null
  jobDescription: string
  isAnalyzing: boolean
  error: string | null
  history: JobDescriptionHistoryItem[]
  activeTitle: string | null
  activeResumeId: string | null
  setJobDescription: (jd: string) => void
  setResult: (r: any) => void
  setAnalyzing: (v: boolean) => void
  setError: (e: string | null) => void
  addHistory: (text: string) => void
  setActiveTitle: (title: string | null) => void
  setActiveResumeId: (id: string | null) => void
  clearHistory: () => void
  reset: () => void
}

export const useATSStore = create<ATSState>()(
  persist(
    (set) => ({
      result: null,
      jobDescription: '',
      isAnalyzing: false,
      error: null,
      history: [],
      activeTitle: null,
      activeResumeId: null,

      setJobDescription: (jd) => set({ jobDescription: jd }),
      setResult: (r) => set((state) => {
        if (!r) return { result: null, isAnalyzing: false, error: null };

        let mappedResult = { ...r };

        // 1. If result.keywords is in API object format { matched, missing }, map to KeywordMatch[]
        if (r.keywords && !Array.isArray(r.keywords) && typeof r.keywords === 'object') {
          const matched = (r.keywords.matched || []).map((k: string) => ({
            keyword: k,
            found: true,
            frequency: 1,
          }));
          const missing = (r.keywords.missing || []).map((k: string) => ({
            keyword: k,
            found: false,
            frequency: 0,
          }));
          mappedResult.keywords = [...matched, ...missing];
        }

        // 2. If result.sections is present, map to result.completeness (SectionCompletenessItem[])
        if (r.sections && Array.isArray(r.sections)) {
          mappedResult.completeness = r.sections.map((s: any) => ({
            section: s.name,
            score: s.score,
            maxScore: s.maxScore,
            issues: s.issues || [],
          }));
        }

        // 3. Make sure formatting is present
        if (!mappedResult.formatting) {
          mappedResult.formatting = [];
        }

        return { result: mappedResult, isAnalyzing: false, error: null };
      }),
      setAnalyzing: (v) => set({ isAnalyzing: v }),
      setError: (e) => set({ error: e, isAnalyzing: false }),
      setActiveTitle: (title) => set({ activeTitle: title }),
      setActiveResumeId: (id) => set({ activeResumeId: id }),
      addHistory: (text) => set((state) => {
        if (!text || !text.trim()) return {};
        const normalizedText = text.trim();
        
        // Derive title from first line
        const firstLine = normalizedText.split('\n')[0].trim();
        const cleanTitle = firstLine.replace(/^[#\s\-*•◦▪]+/, '').trim();
        const derivedTitle = cleanTitle.length > 45 
          ? cleanTitle.substring(0, 42) + '...' 
          : cleanTitle || 'Untitled Description';

        // Check if identical description already exists
        const existingIndex = state.history.findIndex((h) => h.text.trim() === normalizedText);
        let updatedHistory = [...state.history];
        
        if (existingIndex >= 0) {
          // Move existing to the top
          const [item] = updatedHistory.splice(existingIndex, 1);
          updatedHistory = [item, ...updatedHistory];
        } else {
          // Add new item
          const newItem: JobDescriptionHistoryItem = {
            id: Math.random().toString(36).substring(2, 11),
            title: derivedTitle,
            text: normalizedText,
            timestamp: new Date().toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          };
          updatedHistory = [newItem, ...updatedHistory].slice(0, 10);
        }

        return { history: updatedHistory, activeTitle: derivedTitle };
      }),
      clearHistory: () => set({ history: [], activeTitle: null }),
      reset: () => set({ result: null, jobDescription: '', error: null, activeTitle: null, activeResumeId: null }),
    }),
    { name: 'ats-store' }
  )
)