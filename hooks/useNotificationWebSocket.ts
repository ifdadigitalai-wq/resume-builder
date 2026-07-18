'use client'
import { useEffect } from 'react'
import { useNotificationStore } from '@/store/notificationStore'
import { useUIStore } from '@/store/uiStore'

export function useNotificationWebSocket() {
  const showToast = useUIStore(s => s.showToast)

  useEffect(() => {
    let socket: WebSocket | null = null
    let reconnectTimeout: ReturnType<typeof setTimeout>
    let isDisposed = false

    async function connect() {
      try {
        const tokenRes = await fetch('/api/auth/token')
        if (!tokenRes.ok) throw new Error('Token fetch failed')
        const { token } = await tokenRes.json()
        if (!token || isDisposed) return

        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
        const wsUrl = `${protocol}//${window.location.host}/api/ws?token=${token}`
        
        socket = new WebSocket(wsUrl)

        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)
            if (data.type === 'notification') {
              const newNotif = data.payload
              
              const currentNotifs = useNotificationStore.getState().notifications
              // Avoid duplicate pushes
              if (!currentNotifs.some(n => n.id === newNotif.id)) {
                const updated = [newNotif, ...currentNotifs]
                useNotificationStore.getState().setNotifications(updated)
                
                // Show notification toast
                showToast(newNotif.message, 'success')
              }
            }
          } catch (e) {
            console.error('Error parsing WS notification message:', e)
          }
        }

        socket.onclose = () => {
          if (!isDisposed) {
            reconnectTimeout = setTimeout(connect, 3000)
          }
        }

        socket.onerror = () => {
          if (socket) socket.close()
        }
      } catch (err) {
        if (!isDisposed) {
          reconnectTimeout = setTimeout(connect, 5000)
        }
      }
    }

    connect()

    return () => {
      isDisposed = true
      if (socket) socket.close()
      clearTimeout(reconnectTimeout)
    }
  }, [showToast])
}
