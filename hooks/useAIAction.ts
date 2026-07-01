'use client'
import { useAIStore } from '@/store/aiStore'
import { useResumeStore } from '@/store/resumeStore'
import { useUIStore } from '@/store/uiStore'
import { useNotificationStore } from '@/store/notificationStore'

export type AIAction =
  | 'enhance_bullet'
  | 'generate_summary'
  | 'improve_description'
  | 'suggest_skills'
  | 'suggest_certifications'
  | 'suggest_highlights'
  | 'categorise_skills'
  | 'suggest_title'
  | 'chat'

interface UseAIActionOptions {
  onApply?: (text: string) => void
}

export function useAIAction(options?: UseAIActionOptions) {
  const aiStore = useAIStore()
  const resume = useResumeStore(s => s.resume)
  const showToast = useUIStore(s => s.showToast)
  const addNotification = useNotificationStore(s => s.addNotification)

  async function trigger(action: AIAction, input: string, context?: string, onApplyOverride?: (text: string) => void) {
    let customApply = onApplyOverride || options?.onApply

    if (!customApply) {
      if (action === 'generate_summary') {
        customApply = (text) => {
          useResumeStore.getState().updateSummary(text)
          showToast('Summary updated!', 'success')
        }
      } else if (action === 'suggest_skills') {
        customApply = (text) => {
          const skillsList = text.split(',').map(s => s.trim()).filter(Boolean)
          const resumeStore = useResumeStore.getState()
          const currentSkills = resumeStore.resume.skills ?? []
          const updatedSkills = Array.from(new Set([...currentSkills, ...skillsList]))
          resumeStore.updateSection('skills', updatedSkills)
          showToast(`Added ${skillsList.length} skills!`, 'success')
        }
      }
    }

    aiStore.open(input, context ?? action, customApply)
    aiStore.setLoading(true)

    try {
      const res = await fetch('/api/ai/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          input,
          context: {
            name: resume.personal.fullName,
            role: resume.experience[0]?.role ?? '',
            skills: (resume.skills as any[] || []).map(s => typeof s === 'string' ? s : (s as any).skills?.join(', ') || '').join(', '),
          },
        }),
      })

      if (!res.ok) throw new Error('AI request failed')
      
      const reader = res.body?.getReader()
      if (!reader) throw new Error('No reader found')

      const decoder = new TextDecoder()
      let done = false
      let streamText = ''

      while (!done) {
        const { value, done: doneReading } = await reader.read()
        done = doneReading
        if (value) {
          const chunk = decoder.decode(value, { stream: !done })
          streamText += chunk
          useAIStore.setState({
            suggestion: streamText,
            textResult: streamText,
          })
          aiStore.updateLastMessage(streamText)
        }
      }

      useAIStore.setState({
        isLoading: false,
        status: 'success',
      })
    } catch {
      aiStore.close()
      showToast('AI enhancement failed. Please try again.', 'error')
    }
  }

  function accept() {
    if (aiStore.suggestion && aiStore.onApply) {
      aiStore.onApply(aiStore.suggestion)
      const friendlyContext = (aiStore.context ?? 'AI enhancement').replace('_', ' ')
      addNotification(
        `Successfully updated the ${friendlyContext} with AI content.`,
        'success'
      )
    }
    aiStore.close()
  }

  function discard() {
    aiStore.close()
  }

  return {
    trigger,
    accept,
    discard,
    isOpen: aiStore.isOpen,
    isLoading: aiStore.isLoading,
    suggestion: aiStore.suggestion,
    originalText: aiStore.originalText,
  }
}