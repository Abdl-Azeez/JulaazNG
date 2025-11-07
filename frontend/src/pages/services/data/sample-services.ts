import type { LucideIcon } from 'lucide-react'
import {
  Wrench,
  Paintbrush,
  Droplets,
  Shield,
  Hammer,
  Sparkles,
  Fan,
  RadioTower,
} from 'lucide-react'

export interface ServiceCategory {
  id: string
  name: string
  description: string
  icon: LucideIcon
  color: string
  services: Array<{
    id: string
    title: string
    summary: string
    rating: number
    jobsCompleted: number
    priceFrom: number
  }>
}

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'repairs',
    name: 'Quick Repairs',
    description: 'Electricians, plumbers and technicians on standby for urgent fixes.',
    icon: Wrench,
    color: 'from-primary/20 via-primary/10 to-primary/5',
    services: [
      {
        id: 'electrician',
        title: 'Licensed Electricians',
        summary: 'Wiring, installations and emergency repairs within 90 minutes.',
        rating: 4.9,
        jobsCompleted: 1280,
        priceFrom: 15000,
      },
      {
        id: 'plumber',
        title: 'Professional Plumbers',
        summary: 'Leak fixes, pipe replacements and bathroom fittings.',
        rating: 4.8,
        jobsCompleted: 980,
        priceFrom: 12000,
      },
    ],
  },
  {
    id: 'finishing',
    name: 'Finishing & Facelift',
    description: 'Give your space a premium finish with painters, tilers and decorators.',
    icon: Paintbrush,
    color: 'from-accent/20 via-accent/10 to-accent/5',
    services: [
      {
        id: 'painting',
        title: 'Creative Painting Crew',
        summary: 'Interior & exterior painting with colour consultation.',
        rating: 4.7,
        jobsCompleted: 720,
        priceFrom: 25000,
      },
      {
        id: 'tiling',
        title: 'Floor & Wall Tilers',
        summary: 'Precision tiling for kitchens, bathrooms and outdoor spaces.',
        rating: 4.85,
        jobsCompleted: 540,
        priceFrom: 32000,
      },
    ],
  },
  {
    id: 'wellness',
    name: 'Home Wellness',
    description: 'Keep your home fresh with cleaning, fumigation & maintenance plans.',
    icon: Sparkles,
    color: 'from-emerald-400/20 via-emerald-300/10 to-emerald-200/5',
    services: [
      {
        id: 'deep-clean',
        title: 'Signature Deep Cleaning',
        summary: '5-star cleaning teams with eco products and fabric care.',
        rating: 4.95,
        jobsCompleted: 1640,
        priceFrom: 18000,
      },
      {
        id: 'fumigation',
        title: 'Integrated Fumigation',
        summary: 'Odourless pest control with 30-day guarantee.',
        rating: 4.88,
        jobsCompleted: 860,
        priceFrom: 22000,
      },
    ],
  },
  {
    id: 'comfort',
    name: 'Comfort Systems',
    description: 'AC engineers and smart home specialists keeping you comfortable.',
    icon: Fan,
    color: 'from-sky-400/20 via-sky-300/10 to-sky-200/5',
    services: [
      {
        id: 'hvac',
        title: 'HVAC Engineers',
        summary: 'Servicing, installation and duct cleaning for split & central units.',
        rating: 4.92,
        jobsCompleted: 1430,
        priceFrom: 26000,
      },
      {
        id: 'smart-home',
        title: 'Smart Home Setup',
        summary: 'Automate lighting, surveillance and entertainment in one visit.',
        rating: 4.86,
        jobsCompleted: 480,
        priceFrom: 40000,
      },
    ],
  },
  {
    id: 'security',
    name: 'Security & Safety',
    description: 'Background-checked guards, alarm installers and smart locks.',
    icon: Shield,
    color: 'from-amber-400/25 via-amber-300/10 to-amber-200/5',
    services: [
      {
        id: 'guards',
        title: 'Certified Security Guards',
        summary: 'Residential & estate guards trained in modern surveillance tools.',
        rating: 4.83,
        jobsCompleted: 670,
        priceFrom: 35000,
      },
      {
        id: 'alarms',
        title: 'Alarm & CCTV Installers',
        summary: '360° surveillance set-up with remote monitoring support.',
        rating: 4.9,
        jobsCompleted: 720,
        priceFrom: 42000,
      },
    ],
  },
  {
    id: 'outdoor',
    name: 'Outdoor & Water',
    description: 'Borehole experts, landscapers and pool maintenance on-demand.',
    icon: Droplets,
    color: 'from-cyan-400/20 via-cyan-300/10 to-cyan-200/5',
    services: [
      {
        id: 'borehole',
        title: 'Borehole Technicians',
        summary: 'Diagnosis, flushing and pump replacements with 7-day warranty.',
        rating: 4.78,
        jobsCompleted: 510,
        priceFrom: 55000,
      },
      {
        id: 'pool',
        title: 'Pool Care Squad',
        summary: 'Weekly treatments, balancing and equipment servicing.',
        rating: 4.82,
        jobsCompleted: 460,
        priceFrom: 38000,
      },
    ],
  },
  {
    id: 'restoration',
    name: 'Restoration & Projects',
    description: 'Structural repairs, renovations and project management.',
    icon: Hammer,
    color: 'from-zinc-400/20 via-zinc-300/10 to-zinc-200/5',
    services: [
      {
        id: 'renovation',
        title: 'Renovation Managers',
        summary: 'From concept to handover with transparent costing.',
        rating: 4.91,
        jobsCompleted: 390,
        priceFrom: 95000,
      },
      {
        id: 'structural',
        title: 'Structural Repair Team',
        summary: 'Foundation, roofing and damp-proofing specialists.',
        rating: 4.87,
        jobsCompleted: 280,
        priceFrom: 120000,
      },
    ],
  },
  {
    id: 'connectivity',
    name: 'Connectivity',
    description: 'Internet, satellite and renewable power technicians.',
    icon: RadioTower,
    color: 'from-purple-400/25 via-purple-300/10 to-purple-200/5',
    services: [
      {
        id: 'internet',
        title: 'Internet Installers',
        summary: 'Fiber, microwave and LTE setups with coverage optimisation.',
        rating: 4.84,
        jobsCompleted: 610,
        priceFrom: 28000,
      },
      {
        id: 'solar',
        title: 'Solar Engineers',
        summary: 'Hybrid solar systems with energy audits and maintenance.',
        rating: 4.89,
        jobsCompleted: 455,
        priceFrom: 75000,
      },
    ],
  },
]
