import { create } from 'zustand'

export interface Notification {
  id: string
  userId: string
  type: string
  message: string
  isRead: boolean
  createdAt: string
}

interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  isLoading: boolean
  fetchNotifications: () => Promise<void>
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  addNotification: (message: string, type?: string) => void
  setNotifications: (notifications: Notification[]) => void
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  setNotifications: (notifications) => {
    set({
      notifications,
      unreadCount: notifications.filter(n => !n.isRead).length
    })
  },

  fetchNotifications: async () => {
    set({ isLoading: true })
    try {
      const res = await fetch('/api/notifications')
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      const notifications = data.result ?? []
      set({ 
        notifications, 
        unreadCount: notifications.filter((n: any) => !n.isRead).length,
        isLoading: false 
      })
    } catch {
      set({ isLoading: false })
    }
  },

  markAsRead: async (id) => {
    // Optimistic update
    set((state) => {
      const updated = state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      )
      return {
        notifications: updated,
        unreadCount: updated.filter(n => !n.isRead).length
      }
    })

    try {
      const res = await fetch(`/api/notifications/${id}/read`, {
        method: 'PATCH',
      })
      if (!res.ok) throw new Error()
    } catch {
      // Revert if failed
      get().fetchNotifications()
    }
  },

  markAllAsRead: async () => {
    // Optimistic update
    set((state) => {
      const updated = state.notifications.map((n) => ({ ...n, isRead: true }))
      return {
        notifications: updated,
        unreadCount: 0
      }
    })

    try {
      const res = await fetch('/api/notifications/read-all', {
        method: 'POST',
      })
      if (!res.ok) throw new Error()
    } catch {
      get().fetchNotifications()
    }
  },

  addNotification: (message, type = 'info') => {
    const newNotif: Notification = {
      id: Math.random().toString(),
      userId: 'local',
      type,
      message,
      isRead: false,
      createdAt: new Date().toISOString(),
    }
    set((state) => {
      const updated = [newNotif, ...state.notifications]
      return {
        notifications: updated,
        unreadCount: updated.filter(n => !n.isRead).length
      }
    })
  },
}))
