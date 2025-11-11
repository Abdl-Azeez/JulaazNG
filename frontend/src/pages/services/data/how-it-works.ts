import type { LucideIcon } from 'lucide-react'
import { ShieldCheck, Sparkles, Stars } from 'lucide-react'

export type HowItWorksStepId = 'connect' | 'track' | 'support'

export interface HowItWorksStep {
  id: HowItWorksStepId
  title: string
  description: string
  icon: LucideIcon
}

export const howItWorksSteps: HowItWorksStep[] = [
  {
    id: 'connect',
    title: 'Tap + Match',
    description:
      'Tell us the task, upload photos or voice notes and get matched with the right artisan instantly.',
    icon: Sparkles,
  },
  {
    id: 'track',
    title: 'Track + Review',
    description:
      'Watch job progress, approve milestones and release payments securely from the app.',
    icon: Stars,
  },
  {
    id: 'support',
    title: 'Support + Scale',
    description:
      'Need long-term maintenance? Set recurring visits, get project managers and warranty coverage.',
    icon: ShieldCheck,
  },
]
