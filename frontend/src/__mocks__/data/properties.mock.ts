/**
 * Properties Mock Data
 * Matches: /api/v1/properties endpoints
 * See: Documentation/BACKEND_API_SPEC.md Section 3.2
 */

import { Property, PropertyDetail, PropertyStatus } from '@/shared/types/property.types'
import { ApiResponse, PaginationMeta } from '@/shared/types/common.types'
import home1 from '@/assets/images/home1.jpg'
import home2 from '@/assets/images/home2.jpg'
import home3 from '@/assets/images/home3.jpg'
import home4 from '@/assets/images/home4.jpg'
import home5 from '@/assets/images/home5.jpg'
import home6 from '@/assets/images/home6.jpg'
import home7 from '@/assets/images/home7.jpg'
import home8 from '@/assets/images/home8.jpg'

// GET /properties response (paginated list)
// API Spec compliant: uses propertyType, viewCount, favouriteCount
export const mockPropertiesListResponse: ApiResponse<{
  properties: Property[]
  pagination: PaginationMeta
}> = {
  success: true,
  data: {
    properties: [
      {
        id: 'prop-001',
        title: 'Luxury 2 Bedroom Apartment in Lekki',
        description: 'Modern apartment with stunning waterfront views',
        propertyType: 'apartment',
        bedrooms: 2,
        bathrooms: 2,
        price: 1200000,
        currency: 'NGN',
        priceType: 'annually',
        city: 'Lagos',
        state: 'Lagos',
        neighbourhood: 'Lekki',
        address: '45 Admiralty Way, Lekki Phase 1',
        rentalCategories: ['long_term', 'shortlet'],
        allowedRentTerms: ['monthly', 'quarterly', 'annually'],
        images: [home1, home2, home3],
        thumbnail: home1,
        amenities: ['parking', 'generator', 'security', '24_7_power', 'swimming_pool'],
        isVerified: true,
        isFeatured: false,
        status: 'active' as PropertyStatus,
        viewCount: 1245,
        favouriteCount: 89,
        landlordId: 'user-landlord-001',
        landlordName: 'Adebayo Johnson',
        landlordAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Adebayo',
        landlordRating: 4.8,
        createdAt: new Date('2024-10-15T10:00:00Z'),
        updatedAt: new Date('2024-12-20T14:30:00Z'),
      },
      {
        id: 'prop-002',
        title: '3 Bedroom Duplex in Ikeja GRA',
        description: 'Spacious family home in a serene environment',
        propertyType: 'duplex',
        bedrooms: 3,
        bathrooms: 3,
        price: 1800000,
        currency: 'NGN',
        priceType: 'annually',
        city: 'Lagos',
        state: 'Lagos',
        neighbourhood: 'Ikeja',
        address: '12 Ogudu Road, Ikeja GRA',
        rentalCategories: ['long_term'],
        allowedRentTerms: ['six_months', 'annually'],
        images: [home2, home4, home5],
        thumbnail: home2,
        amenities: ['parking', 'generator', 'security', 'borehole'],
        isVerified: true,
        isFeatured: true,
        status: 'active' as PropertyStatus,
        viewCount: 890,
        favouriteCount: 56,
        landlordId: 'user-landlord-002',
        landlordName: 'Chioma Okafor',
        landlordAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chioma',
        landlordRating: 4.6,
        createdAt: new Date('2024-11-01T08:00:00Z'),
        updatedAt: new Date('2024-12-18T16:00:00Z'),
      },
      {
        id: 'prop-003',
        title: 'Luxury Studio Apartment - Victoria Island Shortlet',
        description: 'Fully furnished studio perfect for short stays',
        propertyType: 'studio',
        bedrooms: 1,
        bathrooms: 1,
        price: 35000,
        currency: 'NGN',
        priceType: 'nightly',
        city: 'Lagos',
        state: 'Lagos',
        neighbourhood: 'Victoria Island',
        address: '89 Adeola Odeku Street, Victoria Island',
        rentalCategories: ['shortlet'],
        images: [home3, home6, home7],
        thumbnail: home3,
        amenities: ['wifi', 'ac', 'smart_tv', 'kitchen', 'gym_access'],
        isVerified: true,
        isFeatured: true,
        status: 'active' as PropertyStatus,
        viewCount: 2341,
        favouriteCount: 178,
        landlordId: 'user-landlord-003',
        landlordName: 'Emeka Nwosu',
        landlordAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emeka',
        landlordRating: 4.9,
        createdAt: new Date('2024-09-20T12:00:00Z'),
        updatedAt: new Date('2024-12-27T10:00:00Z'),
      },
      {
        id: 'prop-004',
        title: '4 Bedroom Terrace in Lekki Phase 2',
        description: 'Elegant terrace house with modern finishes',
        propertyType: 'house',
        bedrooms: 4,
        bathrooms: 4,
        price: 2500000,
        currency: 'NGN',
        priceType: 'annually',
        city: 'Lagos',
        state: 'Lagos',
        neighbourhood: 'Lekki',
        address: '23 Chevron Drive, Lekki Phase 2',
        rentalCategories: ['long_term'],
        allowedRentTerms: ['quarterly', 'annually'],
        images: [home4, home8, home1],
        thumbnail: home4,
        amenities: ['parking', 'generator', 'security', '24_7_power', 'borehole', 'garden'],
        isVerified: true,
        isFeatured: false,
        status: 'active' as PropertyStatus,
        viewCount: 567,
        favouriteCount: 34,
        landlordId: 'user-landlord-004',
        landlordName: 'Funmi Adeleke',
        landlordAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Funmi',
        landlordRating: 4.7,
        createdAt: new Date('2024-12-01T09:00:00Z'),
        updatedAt: new Date('2024-12-15T11:00:00Z'),
      },
      {
        id: 'prop-005',
        title: 'Penthouse Apartment with Rooftop - Banana Island',
        description: 'Ultra-luxury penthouse with panoramic city views',
        propertyType: 'penthouse',
        bedrooms: 5,
        bathrooms: 6,
        price: 8500000,
        currency: 'NGN',
        priceType: 'annually',
        city: 'Lagos',
        state: 'Lagos',
        neighbourhood: 'Ikoyi',
        address: 'Banana Island, Ikoyi',
        rentalCategories: ['long_term', 'shortlet'],
        allowedRentTerms: ['monthly', 'six_months', 'annually'],
        images: [home5, home3, home7],
        thumbnail: home5,
        amenities: [
          'parking',
          'generator',
          'security',
          '24_7_power',
          'swimming_pool',
          'gym',
          'elevator',
          'smart_home',
          'rooftop_lounge',
          'cinema_room',
        ],
        isVerified: true,
        isFeatured: true,
        status: 'active' as PropertyStatus,
        viewCount: 3456,
        favouriteCount: 289,
        landlordId: 'user-landlord-005',
        landlordName: 'Dr. Oluwaseun Akinwale',
        landlordAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Seun',
        landlordRating: 5.0,
        createdAt: new Date('2024-08-10T14:00:00Z'),
        updatedAt: new Date('2024-12-28T08:00:00Z'),
      },
    ],
    pagination: {
      page: 1,
      limit: 20,
      total: 5,
      totalPages: 1,
      hasNext: false,
      hasPrevious: false,
    },
  },
  timestamp: new Date().toISOString(),
}

// GET /properties/:id response (detailed property)
export const mockPropertyDetailResponse: ApiResponse<PropertyDetail> = {
  success: true,
  data: {
    id: 'prop-001',
    title: 'Luxury 2 Bedroom Apartment in Lekki',
    description:
      'Experience waterfront living at its finest in this stunning 2-bedroom apartment. Located in the heart of Lekki Phase 1, this modern residence offers breathtaking views, premium amenities, and a lifestyle of comfort and convenience.',
    propertyType: 'apartment',
    bedrooms: 2,
    bathrooms: 2,
    price: 1200000,
    currency: 'NGN',
    priceType: 'annually',
    city: 'Lagos',
    state: 'Lagos',
    neighbourhood: 'Lekki',
    address: '45 Admiralty Way, Lekki Phase 1',
    landlordId: 'user-landlord-001',
    landlordName: 'Adebayo Johnson',
    coordinates: {
      lat: 6.4281,
      lng: 3.4219,
    },
    rentalCategories: ['long_term', 'shortlet'],
    shortletPrice: 45000,
    shortletPriceType: 'nightly',
    images: [
      { url: home1, caption: 'Living room with waterfront view' },
      { url: home2, caption: 'Master bedroom' },
      { url: home3, caption: 'Modern kitchen' },
      { url: home4, caption: 'Bathroom with premium fittings' },
      { url: home5, caption: 'Balcony with panoramic view' },
      { url: home6, caption: 'Building exterior' },
    ],
    thumbnail: home1,
    amenities: [
      'parking',
      'generator',
      'security',
      '24_7_power',
      'swimming_pool',
      'gym',
      'wifi',
      'ac',
      'smart_tv',
    ],
    isVerified: true,
    isFeatured: false,
    status: 'active' as PropertyStatus,
    viewCount: 1245,
    favouriteCount: 89,
    landlord: {
      id: 'user-landlord-001',
      name: 'Adebayo Johnson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Adebayo',
      phone: '+234 803 456 7890',
      email: 'adebayo.j@example.com',
      rating: 4.8,
      reviewCount: 156,
      propertiesCount: 12,
      verified: true,
      responseTime: '2 hours',
      memberSince: '2023',
    },
    highlights: [
      'Waterfront location',
      'Modern finishes',
      'Secure gated estate',
      'Close to shopping malls',
      'Excellent transport links',
    ],
    moveInBreakdown: [
      { item: 'Annual Rent', amount: 1200000, required: true },
      { item: 'Service Charge', amount: 100000, required: true },
      { item: 'Caution Fee (Refundable)', amount: 200000, required: true },
      { item: 'Legal Fee', amount: 50000, required: true },
      { item: 'Agency Fee', amount: 100000, required: true },
    ],
    area: 120,
    areaUnit: 'sqm',
    parking: 2,
    furnished: true,
    petsAllowed: false,
    availableFrom: new Date('2025-01-15T00:00:00Z'),
    minimumStay: 12,
    minimumStayUnit: 'months',
    reviewSummary: {
      averageRating: 4.7,
      totalReviews: 45,
      ratingBreakdown: {
        5: 28,
        4: 12,
        3: 4,
        2: 1,
        1: 0,
      },
      aspectRatings: {
        cleanliness: 4.8,
        location: 4.9,
        value: 4.5,
        communication: 4.7,
      },
    },
    createdAt: new Date('2024-10-15T10:00:00Z'),
    updatedAt: new Date('2024-12-20T14:30:00Z'),
    publishedAt: new Date('2024-10-16T08:00:00Z'),
  },
  timestamp: new Date().toISOString(),
}

// GET /properties/featured response
export const mockFeaturedPropertiesResponse: ApiResponse<Property[]> = {
  success: true,
  data: mockPropertiesListResponse.data.properties.filter((p) => p.isFeatured),
  timestamp: new Date().toISOString(),
}

// ============================================================
// UI SAMPLE PROPERTIES (for Home Page)
// Migrated from: pages/home/data/sample-properties.ts
// ============================================================
import type { Property as EntityProperty } from '@/entities/property/model/types'
import home9 from '@/assets/images/home9.jpg'
import home10 from '@/assets/images/home10.jpg'

export const sampleProperties: EntityProperty[] = [
  {
    id: '1',
    name: 'Lily Apartment',
    image: home1,
    images: [home1, home3, home5, home7],
    area: 820,
    bedrooms: 3,
    bathrooms: 2,
    parking: 1,
    price: 1100000,
    rentalCategories: ['long_term', 'shortlet'],
    allowedRentTerms: ['monthly', 'quarterly', 'annually'],
    annualRent: 1100000,
    monthlyRent: 1100000 / 12,
    nightlyRate: 90000,
    weeklyRate: 540000,
    minimumStayNights: 3,
    maximumStayNights: 45,
  },
  {
    id: '2',
    name: 'Lagos Villa',
    image: home2,
    images: [home2, home4, home6, home8],
    area: 952,
    bedrooms: 2,
    bathrooms: 2,
    parking: 1,
    price: 900000,
    rentalCategories: ['long_term'],
    allowedRentTerms: ['six_months', 'annually'],
    annualRent: 900000,
    monthlyRent: 900000 / 12,
  },
  {
    id: '3',
    name: 'Union Home',
    image: home3,
    images: [home3, home5, home7, home9],
    area: 800,
    bedrooms: 3,
    bathrooms: 2,
    parking: 1,
    price: 1200000,
    rentalCategories: ['long_term', 'shortlet'],
    allowedRentTerms: ['monthly', 'annually'],
    annualRent: 1200000,
    monthlyRent: 1200000 / 12,
    nightlyRate: 85000,
    weeklyRate: 500000,
    minimumStayNights: 2,
    maximumStayNights: 30,
  },
  {
    id: '4',
    name: 'Viva Residency',
    image: home4,
    images: [home4, home6, home8, home10],
    area: 900,
    bedrooms: 4,
    bathrooms: 3,
    parking: 4,
    price: 2900000,
    rentalCategories: ['long_term'],
    allowedRentTerms: ['quarterly', 'annually'],
    annualRent: 2900000,
    monthlyRent: 2900000 / 12,
  },
  {
    id: '5',
    name: 'Eko Heights',
    image: home5,
    images: [home5, home7, home9, home1],
    area: 1000,
    bedrooms: 3,
    bathrooms: 2,
    parking: 1,
    price: 3000000,
    rentalCategories: ['long_term', 'shortlet'],
    allowedRentTerms: ['monthly', 'six_months', 'annually'],
    annualRent: 3000000,
    monthlyRent: 3000000 / 12,
    nightlyRate: 110000,
    weeklyRate: 680000,
    minimumStayNights: 4,
    maximumStayNights: 60,
  },
  {
    id: '6',
    name: 'Victoria Crest',
    image: home6,
    images: [home6, home8, home10, home2],
    area: 100,
    bedrooms: 4,
    bathrooms: 3,
    parking: 4,
    price: 3000000,
    rentalCategories: ['long_term'],
    allowedRentTerms: ['annually'],
    annualRent: 3000000,
    monthlyRent: 3000000 / 12,
  },
  {
    id: '7',
    name: 'Ojodu Place',
    image: home7,
    images: [home7, home9, home1, home3],
    area: 600,
    bedrooms: 3,
    bathrooms: 2,
    parking: 1,
    price: 1800000,
    rentalCategories: ['long_term'],
    allowedRentTerms: ['quarterly', 'annually'],
    annualRent: 1800000,
    monthlyRent: 1800000 / 12,
  },
  {
    id: '8',
    name: 'Gidi View Apartment',
    image: home8,
    images: [home8, home10, home2, home4],
    area: 700,
    bedrooms: 4,
    bathrooms: 3,
    parking: 4,
    price: 2900000,
    rentalCategories: ['long_term', 'shortlet'],
    annualRent: 2900000,
    monthlyRent: 2900000 / 12,
    nightlyRate: 125000,
    weeklyRate: 780000,
    minimumStayNights: 3,
    maximumStayNights: 40,
  },
  {
    id: '9',
    name: 'Lekki Haven',
    image: home9,
    images: [home9, home1, home3, home5],
    area: 1200,
    bedrooms: 3,
    bathrooms: 2,
    parking: 5,
    price: 4000000,
    rentalCategories: ['long_term'],
    annualRent: 4000000,
    monthlyRent: 4000000 / 12,
  },
  {
    id: '10',
    name: 'Palmgrove Court',
    image: home10,
    images: [home10, home2, home4, home6],
    area: 650,
    bedrooms: 2,
    bathrooms: 3,
    parking: 1,
    price: 2500000,
    rentalCategories: ['shortlet'],
    nightlyRate: 75000,
    weeklyRate: 450000,
    minimumStayNights: 2,
    maximumStayNights: 21,
  },
]

// Export convenience functions
export const getMockProperty = (id: string): Property | undefined => {
  return mockPropertiesListResponse.data.properties.find((p) => p.id === id)
}

export const getMockProperties = (filters?: {
  city?: string
  type?: string
  minPrice?: number
  maxPrice?: number
  bedrooms?: number
}): Property[] => {
  let filtered = [...mockPropertiesListResponse.data.properties]

  if (filters?.city) {
    filtered = filtered.filter((p) => p.city === filters.city)
  }
  if (filters?.type) {
    filtered = filtered.filter((p) => p.propertyType === filters.type)
  }
  if (filters?.minPrice !== undefined) {
    filtered = filtered.filter((p) => (p.price ?? 0) >= filters.minPrice!)
  }
  if (filters?.maxPrice !== undefined) {
    filtered = filtered.filter((p) => (p.price ?? Infinity) <= filters.maxPrice!)
  }
  if (filters?.bedrooms !== undefined) {
    filtered = filtered.filter((p) => p.bedrooms === filters.bedrooms)
  }

  return filtered
}

// Alias for backward compatibility
export const mockPropertiesData = mockPropertiesListResponse.data.properties

// For UI property details (entity-style with transactionType, propertyType, owner, etc.), use:
// import { samplePropertyDetails } from '@/__mocks__/data/property-details.mock'
