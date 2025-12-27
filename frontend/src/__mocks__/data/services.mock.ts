/**
 * Services Mock Data
 * Matches backend API specification from BACKEND_API_SPEC.md
 * 
 * Includes data migrated from: pages/services/data/sample-services.ts
 */

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
import type { ApiResponse } from '@/shared/types/common.types'
import type {
  ServiceBooking,
  ServiceCategory,
  ServiceProvider,
  ServiceQuote,
} from '@/shared/types/service.types'
import { mockUsers } from './auth.mock'

// ============================================================
// UI SERVICE CATEGORIES (for Services Page)
// Migrated from: pages/services/data/sample-services.ts
// ============================================================
export interface UIServiceCategory {
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

export const serviceCategories: UIServiceCategory[] = [
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

// ============================================================
// API SERVICE CATEGORIES
// ============================================================

// Sample service categories (API format)
// API Spec: category: enum ['cleaning', 'moving', 'plumbing', 'electrical', 'carpentry', 'painting', 'tiling', 'mechanic']
export const mockServiceCategories: ServiceCategory[] = [
  {
    id: 'cat_001',
    name: 'Cleaning',
    slug: 'cleaning',
    description: 'Professional cleaning services',
    icon: 'cleaning',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat_002',
    name: 'Moving',
    slug: 'moving',
    description: 'Professional moving and relocation services',
    icon: 'moving',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat_003',
    name: 'Plumbing',
    slug: 'plumbing',
    description: 'Professional plumbing services',
    icon: 'plumbing',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat_004',
    name: 'Electrical',
    slug: 'electrical',
    description: 'Electrical repairs and installations',
    icon: 'electrical',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat_005',
    name: 'Carpentry',
    slug: 'carpentry',
    description: 'Wood work and furniture services',
    icon: 'carpentry',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat_006',
    name: 'Painting',
    slug: 'painting',
    description: 'Interior and exterior painting',
    icon: 'painting',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat_007',
    name: 'Tiling',
    slug: 'tiling',
    description: 'Floor and wall tiling services',
    icon: 'tiling',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat_008',
    name: 'Mechanic',
    slug: 'mechanic',
    description: 'Auto repair and maintenance services',
    icon: 'mechanic',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
]

// Sample service providers
export const mockServiceProviders: ServiceProvider[] = [
  {
    id: 'sp_001',
    userId: 'user_sp_001',
    businessName: 'Quick Fix Plumbing',
    categories: ['cat_003'],
    description: 'Expert plumbing services for residential and commercial properties',
    yearsOfExperience: 8,
    certifications: ['Licensed Plumber', 'Gas Safe Certified'],
    serviceAreas: ['Lagos', 'Ogun'],
    rating: 4.8,
    totalReviews: 142,
    completedJobs: 238,
    responseTime: '< 2 hours',
    isVerified: true,
    status: 'active',
    avatar: 'https://i.pravatar.cc/150?img=12',
    coverImage: 'https://picsum.photos/seed/plumbing/800/400',
    createdAt: '2023-06-15T00:00:00Z',
    updatedAt: '2024-02-10T00:00:00Z',
  },
  {
    id: 'sp_002',
    userId: 'user_sp_002',
    businessName: 'Bright Spark Electrical',
    categories: ['cat_004'],
    description: 'Professional electrical services and installations',
    yearsOfExperience: 10,
    certifications: ['Licensed Electrician', 'Safety Certified'],
    serviceAreas: ['Lagos', 'Abuja'],
    rating: 4.9,
    totalReviews: 98,
    completedJobs: 156,
    responseTime: '< 1 hour',
    isVerified: true,
    status: 'active',
    avatar: 'https://i.pravatar.cc/150?img=13',
    coverImage: 'https://picsum.photos/seed/electrical/800/400',
    createdAt: '2023-04-20T00:00:00Z',
    updatedAt: '2024-02-10T00:00:00Z',
  },
  {
    id: 'sp_003',
    userId: 'user_sp_003',
    businessName: 'Sparkle Clean Services',
    categories: ['cat_001'],
    description: 'Deep cleaning and maintenance services',
    yearsOfExperience: 5,
    certifications: ['Professional Cleaning Certified'],
    serviceAreas: ['Lagos', 'Ogun', 'Oyo'],
    rating: 4.7,
    totalReviews: 215,
    completedJobs: 412,
    responseTime: '< 3 hours',
    isVerified: true,
    status: 'active',
    avatar: 'https://i.pravatar.cc/150?img=14',
    coverImage: 'https://picsum.photos/seed/cleaning/800/400',
    createdAt: '2023-08-10T00:00:00Z',
    updatedAt: '2024-02-10T00:00:00Z',
  },
]

// Sample service bookings
// API Spec status: enum ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled']
export const mockServiceBookings: ServiceBooking[] = [
  {
    id: 'sb_001',
    userId: mockUsers.tenant1.id,
    providerId: 'sp_001',
    categoryId: 'cat_003',
    title: 'Kitchen sink repair',
    description: 'Leaking kitchen sink needs urgent repair',
    serviceType: 'repair',
    priority: 'high',
    status: 'confirmed',
    scheduledDate: '2024-02-16T09:00:00Z',
    completedDate: null,
    address: {
      street: '15 Admiralty Way',
      city: 'Lagos',
      state: 'Lagos',
      country: 'Nigeria',
    },
    images: ['https://picsum.photos/seed/sink/400/300'],
    estimatedCost: 25000,
    finalCost: null,
    currency: 'NGN',
    rating: null,
    review: null,
    createdAt: '2024-02-12T10:00:00Z',
    updatedAt: '2024-02-13T14:30:00Z',
    provider: mockServiceProviders[0],
    user: {
      id: mockUsers.tenant1.id,
      firstName: mockUsers.tenant1.firstName,
      lastName: mockUsers.tenant1.lastName,
      phoneNumber: mockUsers.tenant1.phoneNumber,
      avatar: mockUsers.tenant1.avatar,
    },
  },
  {
    id: 'sb_002',
    userId: mockUsers.tenant1.id,
    providerId: 'sp_002',
    categoryId: 'cat_004',
    title: 'Install ceiling fan',
    description: 'Need to install 2 ceiling fans in bedrooms',
    serviceType: 'installation',
    priority: 'medium',
    status: 'completed',
    scheduledDate: '2024-02-10T10:00:00Z',
    completedDate: '2024-02-10T14:00:00Z',
    address: {
      street: '15 Admiralty Way',
      city: 'Lagos',
      state: 'Lagos',
      country: 'Nigeria',
    },
    images: [],
    estimatedCost: 35000,
    finalCost: 32000,
    currency: 'NGN',
    rating: 5,
    review: 'Excellent service, very professional',
    createdAt: '2024-02-08T09:00:00Z',
    updatedAt: '2024-02-10T15:00:00Z',
    provider: mockServiceProviders[1],
    user: {
      id: mockUsers.tenant1.id,
      firstName: mockUsers.tenant1.firstName,
      lastName: mockUsers.tenant1.lastName,
      phoneNumber: mockUsers.tenant1.phoneNumber,
      avatar: mockUsers.tenant1.avatar,
    },
  },
  {
    id: 'sb_003',
    userId: mockUsers.tenant1.id,
    providerId: 'sp_003',
    categoryId: 'cat_001',
    title: 'Deep cleaning',
    description: 'Full apartment deep cleaning after moving in',
    serviceType: 'maintenance',
    priority: 'low',
    status: 'pending',
    scheduledDate: null,
    completedDate: null,
    address: {
      street: '15 Admiralty Way',
      city: 'Lagos',
      state: 'Lagos',
      country: 'Nigeria',
    },
    images: [],
    estimatedCost: null,
    finalCost: null,
    currency: 'NGN',
    rating: null,
    review: null,
    createdAt: '2024-02-13T11:00:00Z',
    updatedAt: '2024-02-13T11:00:00Z',
    provider: mockServiceProviders[2],
    user: {
      id: mockUsers.tenant1.id,
      firstName: mockUsers.tenant1.firstName,
      lastName: mockUsers.tenant1.lastName,
      phoneNumber: mockUsers.tenant1.phoneNumber,
      avatar: mockUsers.tenant1.avatar,
    },
  },
]

// Sample service quotes
export const mockServiceQuotes: ServiceQuote[] = [
  {
    id: 'quote_001',
    serviceRequestId: 'sr_001',
    providerId: 'sp_001',
    amount: 25000,
    currency: 'NGN',
    description: 'Kitchen sink repair including parts and labor',
    estimatedDuration: '2-3 hours',
    validUntil: '2024-02-20T00:00:00Z',
    status: 'pending',
    createdAt: '2024-02-12T14:00:00Z',
    updatedAt: '2024-02-12T14:00:00Z',
    provider: mockServiceProviders[0],
  },
  {
    id: 'quote_002',
    serviceRequestId: 'sr_001',
    providerId: 'sp_002',
    amount: 28000,
    currency: 'NGN',
    description: 'Complete plumbing fix with warranty',
    estimatedDuration: '3-4 hours',
    validUntil: '2024-02-20T00:00:00Z',
    status: 'pending',
    createdAt: '2024-02-12T15:30:00Z',
    updatedAt: '2024-02-12T15:30:00Z',
    provider: mockServiceProviders[0],
  },
]

// API Response Mocks
export const mockServiceCategoriesResponse: ApiResponse<ServiceCategory[]> = {
  success: true,
  data: mockServiceCategories,
  message: 'Service categories retrieved successfully',
  timestamp: new Date().toISOString(),
}

export const mockServiceProvidersResponse: ApiResponse<{
  providers: ServiceProvider[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrevious: boolean
  }
}> = {
  success: true,
  data: {
    providers: mockServiceProviders,
    pagination: {
      page: 1,
      limit: 10,
      total: mockServiceProviders.length,
      totalPages: 1,
      hasNext: false,
      hasPrevious: false,
    },
  },
  message: 'Service providers retrieved successfully',
  timestamp: new Date().toISOString(),
}

export const mockMyServicesResponse: ApiResponse<{
  bookings: ServiceBooking[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrevious: boolean
  }
}> = {
  success: true,
  data: {
    bookings: mockServiceBookings,
    pagination: {
      page: 1,
      limit: 10,
      total: mockServiceBookings.length,
      totalPages: 1,
      hasNext: false,
      hasPrevious: false,
    },
  },
  message: 'Service bookings retrieved successfully',
  timestamp: new Date().toISOString(),
}

export const mockServiceDetailResponse: ApiResponse<ServiceBooking> = {
  success: true,
  data: mockServiceBookings[0],
  message: 'Service booking details retrieved successfully',
  timestamp: new Date().toISOString(),
}

export const mockCreateServiceRequestResponse: ApiResponse<ServiceBooking> = {
  success: true,
  data: mockServiceBookings[2],
  message: 'Service request created successfully',
  timestamp: new Date().toISOString(),
}

export const mockServiceQuotesResponse: ApiResponse<ServiceQuote[]> = {
  success: true,
  data: mockServiceQuotes,
  message: 'Service quotes retrieved successfully',
  timestamp: new Date().toISOString(),
}

export const mockAcceptQuoteResponse: ApiResponse<ServiceBooking> = {
  success: true,
  data: { ...mockServiceBookings[2], status: 'confirmed', estimatedCost: 25000 },
  message: 'Quote accepted successfully',
  timestamp: new Date().toISOString(),
}
