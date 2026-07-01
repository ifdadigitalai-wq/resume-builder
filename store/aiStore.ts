import { create } from 'zustand'

export type AIStatus = 'idle' | 'loading' | 'success' | 'error';

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

interface AIState {
  // New requirements
  status: AIStatus
  textResult: string | null
  error: string | null
  setStatus: (s: AIStatus) => void
  setTextResult: (text: string | null) => void
  setError: (err: string | null) => void

  // Chat message history
  messages: ChatMessage[]
  addMessage: (msg: ChatMessage) => void
  updateLastMessage: (text: string) => void
  clearMessages: () => void

  // Compatibility fields
  isOpen: boolean
  isLoading: boolean
  suggestion: string | null
  originalText: string | null
  context: string | null   // which section triggered AI
  onApply: ((text: string) => void) | null
  open: (original: string, context: string, onApply?: (text: string) => void) => void
  close: () => void
  setSuggestion: (s: string) => void
  setLoading: (v: boolean) => void
}

export const useAIStore = create<AIState>((set) => ({
  status: 'idle',
  textResult: null,
  error: null,
  
  setStatus: (s) => set({ status: s }),
  setTextResult: (text) => set({ textResult: text }),
  setError: (err) => set({ error: err, status: 'error' }),

  messages: [],
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
  updateLastMessage: (text) => set((state) => {
    const next = [...state.messages];
    if (next.length > 0 && next[next.length - 1].sender === 'ai') {
      next[next.length - 1] = { ...next[next.length - 1], text };
    }
    return { messages: next };
  }),
  clearMessages: () => set({ messages: [] }),

  isOpen: false,
  isLoading: false,
  suggestion: null,
  originalText: null,
  context: null,
  onApply: null,

  open: (original, context, onApply) =>
    set((state) => ({ 
      isOpen: true, 
      originalText: original, 
      context, 
      suggestion: null, 
      onApply: onApply ?? null,
      status: 'idle',
      textResult: null,
      error: null,
      messages: original 
        ? [{ sender: 'user', text: `Optimize this content: "${original}"` }, { sender: 'ai', text: '' }] 
        : state.messages.length > 0 ? state.messages : []
    })),
  close: () => set({ 
    isOpen: false, 
    suggestion: null, 
    originalText: null, 
    context: null, 
    onApply: null,
    status: 'idle',
    textResult: null,
    error: null,
    // Keep messages history in the session
  }),
  setSuggestion: (s) => set({ 
    suggestion: s, 
    isLoading: false, 
    textResult: s,
    status: 'success',
    error: null
  }),
  setLoading: (v) => set({ 
    isLoading: v, 
    status: v ? 'loading' : 'idle' 
  }),
}))