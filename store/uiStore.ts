import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'

export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

interface UIState {
  toasts: Toast[]
  sidebarOpen: boolean
  isSidebarOpen: boolean
  mobileTab: 'editor' | 'preview' | 'insights'
  isDownloading: boolean
  
  // Single toast compatibility mapping
  toast: Toast | null
  
  setSidebarOpen: (v: boolean) => void
  toggleSidebar: () => void
  setMobileTab: (tab: 'editor' | 'preview' | 'insights') => void
  setIsDownloading: (v: boolean) => void
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void
  dismissToast: (id: string) => void
  clearToast: () => void
}

export const useUIStore = create<UIState>((set) => ({
  toasts: [],
  sidebarOpen: true,
  isSidebarOpen: true,
  mobileTab: 'editor',
  isDownloading: false,
  toast: null,

  setSidebarOpen: (v) => set({ sidebarOpen: v, isSidebarOpen: v }),
  toggleSidebar: () => set((state) => {
    const next = !state.sidebarOpen
    return { sidebarOpen: next, isSidebarOpen: next }
  }),
  setMobileTab: (tab) => set({ mobileTab: tab }),
  setIsDownloading: (v) => set({ isDownloading: v }),

  showToast: (message, type = 'info') => {
    const id = uuidv4()
    const newToast: Toast = { id, message, type }
    
    set((state) => {
      const updatedToasts = [...state.toasts, newToast]
      return {
        toasts: updatedToasts,
        toast: newToast // single toast compatibility
      }
    })

    // Auto dismiss after 3500ms
    setTimeout(() => {
      set((state) => {
        const remainingToasts = state.toasts.filter((t) => t.id !== id)
        return {
          toasts: remainingToasts,
          toast: remainingToasts[remainingToasts.length - 1] ?? null
        }
      })
    }, 3500)
  },

  dismissToast: (id) => {
    set((state) => {
      const remainingToasts = state.toasts.filter((t) => t.id !== id)
      return {
        toasts: remainingToasts,
        toast: remainingToasts[remainingToasts.length - 1] ?? null
      }
    })
  },

  clearToast: () => {
    set({ toasts: [], toast: null })
  }
}))