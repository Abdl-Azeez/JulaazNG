import type { LandlordPropertyDetail } from '@/shared/types/landlord.types'
import home1 from '@/assets/images/home1.jpg'
import home2 from '@/assets/images/home2.jpg'
import home3 from '@/assets/images/home3.jpg'
import home4 from '@/assets/images/home4.jpg'

export const landlordPropertyDetails: Record<string, LandlordPropertyDetail> = {
  'prop-101': {
    id: 'prop-101',
    name: 'Viva Residency',
    image: home1,
    gallery: [home1, home2, home3],
    price: 2400000,
    address: '12 Olaiya Street, Lekki Phase 1, Lagos, Nigeria',
    type: 'Apartment',
    size: 820,
    bedrooms: 4,
    bathrooms: 3,
    parking: 2,
    description:
      'A contemporary serviced apartment with panoramic lagoon views, chef-ready kitchen, and concierge support.',
    applicationsCount: 3,
    latestApplicant: {
      name: 'John Doe',
      status: 'pending',
    },
    tenant: {
      name: 'Jane Smith',
      period: 'Jan - Dec 2025',
      contactMethod: 'Chat',
    },
    payment: {
      lastPaymentStatus: 'Paid (Sep 2025)',
      lastPaymentDate: '2025-09-02',
    },
    documents: [
      { id: 'doc-1', name: 'Tenancy_Agreement.pdf' },
      { id: 'doc-2', name: 'Utility_Bill_August.pdf' },
    ],
  },
  'prop-102': {
    id: 'prop-102',
    name: 'Palmgrove Court',
    image: home2,
    gallery: [home2, home4, home1],
    price: 1800000,
    address: '88 Adetokunbo Ademola, Victoria Island, Lagos',
    type: 'Penthouse',
    size: 540,
    bedrooms: 3,
    bathrooms: 2,
    parking: 1,
    description:
      'Stylish penthouse with skyline terrace, smart lighting, and weekly housekeeping for corporate tenants.',
    applicationsCount: 1,
    latestApplicant: {
      name: 'Ibukun Awosika',
      status: 'approved',
    },
    tenant: {
      name: 'Kingsley Ade',
      period: 'Apr 2024 - Mar 2025',
      contactMethod: 'Chat',
    },
    payment: {
      lastPaymentStatus: 'Paid (Aug 2025)',
      lastPaymentDate: '2025-08-28',
    },
    documents: [
      { id: 'doc-1', name: 'Signed_Agreement.pdf' },
      { id: 'doc-2', name: 'Inventory_Checklist.pdf' },
    ],
  },
  'prop-103': {
    id: 'prop-103',
    name: 'Lekki Haven',
    image: home3,
    gallery: [home3, home2, home4],
    price: 950000,
    address: '2 Prince Adelowo Adedeji, Lekki Phase 2, Lagos',
    type: 'Townhouse',
    size: 600,
    bedrooms: 3,
    bathrooms: 3,
    parking: 1,
    description:
      'Townhouse in a gated estate with solar backup, dedicated workspace, and children play area.',
    applicationsCount: 0,
    latestApplicant: null,
    tenant: undefined,
    payment: undefined,
    documents: [{ id: 'doc-1', name: 'Listing_Brochure.pdf' }],
  },
  'prop-104': {
    id: 'prop-104',
    name: 'Ojodu Place',
    image: home4,
    gallery: [home4, home1, home2],
    price: 1200000,
    address: '15 Isaac John Street, Ikeja GRA, Lagos',
    type: 'Duplex',
    size: 760,
    bedrooms: 4,
    bathrooms: 4,
    parking: 3,
    description:
      'Family-friendly duplex with landscaped garden, smart gate access, and backup water treatment.',
    applicationsCount: 5,
    latestApplicant: {
      name: 'Gloria Nwachukwu',
      status: 'pending',
    },
    tenant: {
      name: 'Obinna Okoye',
      period: 'Jul 2024 - Jun 2025',
      contactMethod: 'Chat',
    },
    payment: {
      lastPaymentStatus: 'Upcoming (Oct 2025)',
      lastPaymentDate: '2025-07-01',
    },
    documents: [
      { id: 'doc-1', name: 'Maintenance_Report.pdf' },
      { id: 'doc-2', name: 'Insurance_Cover_Nov.pdf' },
    ],
  },
}

