'use client'
import { useUIStore } from '@/store/uiStore'

export function Toast() {
  const { toasts, dismissToast } = useUIStore()
  if (toasts.length === 0) return null

  const colors = {
    success: 'bg-green-600 shadow-md',
    error: 'bg-red-600 shadow-md',
    info: 'bg-blue-600 shadow-md',
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((t) => (
        <div 
          key={t.id}
          onClick={() => dismissToast(t.id)}
          className={`px-4 py-3 rounded-lg text-white text-sm shadow-lg cursor-pointer ${colors[t.type] || 'bg-blue-600'} transition-all transform hover:scale-[1.02] active:scale-[0.98] animate-in slide-in-from-bottom-3 duration-250`}
        >
          {t.message}
        </div>
      ))}
    </div>
  )
}

