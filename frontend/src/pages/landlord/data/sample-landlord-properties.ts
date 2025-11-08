import type { LandlordProperty } from '@/shared/types/landlord.types'
import home1 from '@/assets/images/home1.jpg'
import home2 from '@/assets/images/home2.jpg'
import home3 from '@/assets/images/home3.jpg'
import home4 from '@/assets/images/home4.jpg'

export const landlordProperties: LandlordProperty[] = [
  {
    id: 'prop-101',
    name: 'Viva Residency',
    image: home1,
    location: 'Lekki Phase 1, Lagos',
    status: 'active',
    applications: 10,
    priceLabel: '₦2.4M / year',
    lastUpdated: '2 hours ago',
    occupancyRate: 95,
  },
  {
    id: 'prop-102',
    name: 'Palmgrove Court',
    image: home2,
    location: 'Victoria Island, Lagos',
    status: 'rented',
    applications: 4,
    priceLabel: '₦1.8M / year',
    lastUpdated: '1 day ago',
    occupancyRate: 100,
  },
  {
    id: 'prop-103',
    name: 'Lekki Haven',
    image: home3,
    location: 'Lekki Phase 2, Lagos',
    status: 'inactive',
    applications: 2,
    priceLabel: '₦950K / year',
    lastUpdated: '5 days ago',
    occupancyRate: 0,
  },
  {
    id: 'prop-104',
    name: 'Ojodu Place',
    image: home4,
    location: 'Ikeja GRA, Lagos',
    status: 'reserved',
    applications: 20,
    priceLabel: '₦1.2M / year',
    lastUpdated: '12 hours ago',
    occupancyRate: 75,
  },
]

