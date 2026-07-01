'use client'
import { useState } from 'react'

const WIZARD_STEPS: Array<{ key: string; label: string }> = [
  { key: 'personal', label: 'Personal Info' },
  { key: 'summary', label: 'Summary' },
  { key: 'experience', label: 'Experience' },
  { key: 'education', label: 'Education' },
  { key: 'skills', label: 'Skills' },
  { key: 'projects', label: 'Projects' },
  { key: 'certifications', label: 'Certifications' },
]

export function useWizardStep(customSteps?: Array<{ key: string; label: string }>) {
  const steps = customSteps ?? WIZARD_STEPS
  const [currentStep, setCurrentStep] = useState(0)

  const step = steps[currentStep]
  const isFirst = currentStep === 0
  const isLast = currentStep === steps.length - 1

  function next() { if (!isLast) setCurrentStep(s => s + 1) }
  function prev() { if (!isFirst) setCurrentStep(s => s - 1) }
  function goTo(idx: number) { setCurrentStep(idx) }

  return { currentStep, step, steps, isFirst, isLast, next, prev, goTo }
}