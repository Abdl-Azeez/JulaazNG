/**
 * Mock data for Handyman Dashboard & Jobs
 * Consolidated from inline data in handyman pages
 */

import type { LucideIcon } from 'lucide-react'
import { Star, Clock, ShieldCheck } from 'lucide-react'

// ============================================================
// TYPES
// ============================================================
export interface HandymanJob {
  id: string
  title: string
  client: string
  scheduledFor: string
  location: string
  contact: string
  status: 'enroute' | 'confirmed' | 'pending' | 'completed' | 'cancelled'
  badge: string
  category?: string
}

export interface PerformanceHighlight {
  id: string
  label: string
  value: string
  description: string
  icon: LucideIcon
}

export interface OnboardingChecklistItem {
  id: string
  title: string
  description: string
  completed: boolean
}

export interface JobBoardItem {
  id: string
  category: string
  title: string
  payout: string
  responseWindow: string
  location: string
  shift: string
  badges: string[]
}

export interface HandymanAssignment {
  id: string
  title: string
  client: string
  scheduledFor: string
  location: string
  contact: string
  status: 'enroute' | 'confirmed' | 'pending' | 'completed' | 'cancelled'
  badge: string
  category: string
}

export interface RotaJob {
  id: string
  time: string
  title: string
  client: string
  location: string
  contact: string
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled'
  duration: string
}

export interface RotaDay {
  id: string
  date: string
  day: string
  jobs: RotaJob[]
}

export interface JobCategory {
  id: string
  label: string
}

export interface StatusFilter {
  id: string
  label: string
}

// ============================================================
// MOCK DATA - Dashboard
// ============================================================
export const mockUpcomingJobs: HandymanJob[] = [
  {
    id: 'job-001',
    title: 'Emergency Electrical Diagnostics',
    client: 'Victoria Crest Apartments',
    scheduledFor: 'Today • 4:00 PM',
    location: 'Lekki Phase 1, Lagos',
    contact: '+234 801 234 5678',
    status: 'enroute',
    badge: 'Priority',
  },
  {
    id: 'job-002',
    title: 'HVAC quarterly maintenance',
    client: 'Oasis Co-working',
    scheduledFor: 'Tomorrow • 10:00 AM',
    location: 'Yaba, Lagos',
    contact: '+234 809 234 9090',
    status: 'confirmed',
    badge: 'Recurring',
  },
]

export const mockPerformanceHighlights: PerformanceHighlight[] = [
  {
    id: 'rating',
    label: 'Average rating',
    value: '4.9★',
    description: 'from 128 completed jobs',
    icon: Star,
  },
  {
    id: 'response',
    label: 'Response time',
    value: '28 min',
    description: 'average dispatch acceptance',
    icon: Clock,
  },
  {
    id: 'quality',
    label: 'Quality score',
    value: '98%',
    description: 'based on concierge QA checks',
    icon: ShieldCheck,
  },
]

export const mockHandymanBadgeMetrics = {
  servicesRendered: 128,
  companyRevenueNgn: 2_750_000,
  averageRating: 4.9,
}

export const mockOnboardingChecklist: OnboardingChecklistItem[] = [
  {
    id: 'identity',
    title: 'Identity verification',
    description: "Upload NIN or driver's licence and confirm selfie check.",
    completed: true,
  },
  {
    id: 'competency',
    title: 'Competency proof',
    description: 'Submit trade certifications or apprenticeship references.',
    completed: true,
  },
  {
    id: 'workshop',
    title: 'Workshop address',
    description: 'Share your workshop/service radius so we can assign jobs near you.',
    completed: false,
  },
]

// ============================================================
// MOCK DATA - Jobs Page
// ============================================================
export const jobCategories: JobCategory[] = [
  { id: 'all', label: 'All jobs' },
  { id: 'emergency', label: 'Emergency' },
  { id: 'maintenance', label: 'Maintenance cycles' },
  { id: 'installations', label: 'Installations' },
  { id: 'projects', label: 'Project support' },
]

export const mockJobBoard: JobBoardItem[] = [
  {
    id: 'board-001',
    category: 'emergency',
    title: 'Emergency generator diagnostics',
    payout: '₦75,000',
    responseWindow: 'Dispatch within 45 min',
    location: 'Ikoyi, Lagos',
    shift: 'Today • 8:30 PM',
    badges: ['Priority', 'Requires two-man crew'],
  },
  {
    id: 'board-002',
    category: 'maintenance',
    title: 'Monthly water treatment cycle',
    payout: '₦40,000',
    responseWindow: 'Schedule by 11 AM',
    location: 'Magodo GRA, Lagos',
    shift: 'Tomorrow • 9:00 AM',
    badges: ['Recurring'],
  },
  {
    id: 'board-003',
    category: 'installations',
    title: 'Smart lock & CCTV installation',
    payout: '₦110,000',
    responseWindow: 'Confirm availability before 1 PM',
    location: 'Surulere, Lagos',
    shift: 'In 2 days • 12:00 PM',
    badges: ['Premium client', 'Materials supplied'],
  },
]

// ============================================================
// MOCK DATA - Assignments Page
// ============================================================
export const mockAllAssignments: HandymanAssignment[] = [
  {
    id: 'assign-001',
    title: 'Emergency Electrical Diagnostics',
    client: 'Victoria Crest Apartments',
    scheduledFor: 'Today • 4:00 PM',
    location: 'Lekki Phase 1, Lagos',
    contact: '+234 801 234 5678',
    status: 'enroute',
    badge: 'Priority',
    category: 'emergency',
  },
  {
    id: 'assign-002',
    title: 'HVAC quarterly maintenance',
    client: 'Oasis Co-working',
    scheduledFor: 'Tomorrow • 10:00 AM',
    location: 'Yaba, Lagos',
    contact: '+234 809 234 9090',
    status: 'confirmed',
    badge: 'Recurring',
    category: 'maintenance',
  },
  {
    id: 'assign-003',
    title: 'Generator Service',
    client: 'Tech Hub Building',
    scheduledFor: 'Jan 16 • 10:00 AM',
    location: 'Ikeja, Lagos',
    contact: '+234 802 345 6789',
    status: 'pending',
    badge: 'Standard',
    category: 'maintenance',
  },
  {
    id: 'assign-004',
    title: 'Smart Lock & CCTV Installation',
    client: 'Surulere Complex',
    scheduledFor: 'Jan 17 • 1:00 PM',
    location: 'Surulere, Lagos',
    contact: '+234 804 567 8901',
    status: 'confirmed',
    badge: 'Premium',
    category: 'installations',
  },
  {
    id: 'assign-005',
    title: 'Water Treatment Cycle',
    client: 'Magodo GRA',
    scheduledFor: 'Jan 17 • 8:00 AM',
    location: 'Magodo, Lagos',
    contact: '+234 803 456 7890',
    status: 'confirmed',
    badge: 'Recurring',
    category: 'maintenance',
  },
]

export const statusFilters: StatusFilter[] = [
  { id: 'all', label: 'All' },
  { id: 'enroute', label: 'En Route' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'pending', label: 'Pending' },
]

// ============================================================
// MOCK DATA - Rota Page
// ============================================================
export const mockRotaData: RotaDay[] = [
  {
    id: 'rota-001',
    date: '2024-01-15',
    day: 'Monday',
    jobs: [
      {
        id: 'job-001',
        time: '09:00 AM',
        title: 'Emergency Electrical Diagnostics',
        client: 'Victoria Crest Apartments',
        location: 'Lekki Phase 1, Lagos',
        contact: '+234 801 234 5678',
        status: 'confirmed',
        duration: '2-3 hours',
      },
      {
        id: 'job-002',
        time: '02:00 PM',
        title: 'HVAC Maintenance Check',
        client: 'Oasis Co-working',
        location: 'Yaba, Lagos',
        contact: '+234 809 234 9090',
        status: 'confirmed',
        duration: '1-2 hours',
      },
    ],
  },
  {
    id: 'rota-002',
    date: '2024-01-16',
    day: 'Tuesday',
    jobs: [
      {
        id: 'job-003',
        time: '10:00 AM',
        title: 'Generator Service',
        client: 'Tech Hub Building',
        location: 'Ikeja, Lagos',
        contact: '+234 802 345 6789',
        status: 'pending',
        duration: '3-4 hours',
      },
    ],
  },
  {
    id: 'rota-003',
    date: '2024-01-17',
    day: 'Wednesday',
    jobs: [
      {
        id: 'job-004',
        time: '08:00 AM',
        title: 'Water Treatment Cycle',
        client: 'Magodo GRA',
        location: 'Magodo, Lagos',
        contact: '+234 803 456 7890',
        status: 'confirmed',
        duration: '2 hours',
      },
      {
        id: 'job-005',
        time: '01:00 PM',
        title: 'Smart Lock Installation',
        client: 'Surulere Complex',
        location: 'Surulere, Lagos',
        contact: '+234 804 567 8901',
        status: 'confirmed',
        duration: '3-4 hours',
      },
    ],
  },
]

// ============================================================
// ALIASES - Backward compatibility
// ============================================================
export const upcomingJobs = mockUpcomingJobs
export const performanceHighlights = mockPerformanceHighlights
export const onboardingChecklist = mockOnboardingChecklist
export const jobBoard = mockJobBoard
export const allAssignments = mockAllAssignments
export const rotaData = mockRotaData
