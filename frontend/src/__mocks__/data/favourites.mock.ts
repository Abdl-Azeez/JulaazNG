/**
 * Mock data for Favourites
 * Migrated from: pages/favourites/data/sample-favourites.ts
 */

import type { Favourite } from '@/shared/types/activity.types'

// Import local images for reliable display
import home1 from '@/assets/images/home1.jpg'
import home2 from '@/assets/images/home2.jpg'
import home3 from '@/assets/images/home3.jpg'
import home4 from '@/assets/images/home4.jpg'
import home5 from '@/assets/images/home5.jpg'

export const mockFavourites: Favourite[] = [
  {
    id: 'fav1',
    userId: 'user1',
    type: 'property',
    itemId: 'prop1',
    item: {
      id: 'prop1',
      title: '3 Bedroom Apartment in Ikeja',
      description: 'Beautiful 3-bedroom apartment with modern amenities',
      image: home1,
      price: 200000,
      location: 'Ikeja, Lagos',
      rating: 4.5,
      bedrooms: 3,
      bathrooms: 2,
    },
    createdAt: new Date('2024-01-15T10:00:00'),
  },
  {
    id: 'fav2',
    userId: 'user1',
    type: 'property',
    itemId: 'prop2',
    item: {
      id: 'prop2',
      title: '2 Bedroom Apartment in Lekki',
      description: 'Spacious 2-bedroom apartment with sea view',
      image: home2,
      price: 180000,
      location: 'Lekki, Lagos',
      rating: 4.8,
      bedrooms: 2,
      bathrooms: 2,
    },
    createdAt: new Date('2024-01-16T14:30:00'),
  },
  {
    id: 'fav3',
    userId: 'user1',
    type: 'service',
    itemId: 'service1',
    item: {
      id: 'service1',
      title: 'Deep Cleaning Service',
      description: 'Professional deep cleaning for your home',
      image: home3,
      price: 15000,
      location: 'Lagos',
      rating: 4.7,
      provider: 'CleanPro Services',
    },
    createdAt: new Date('2024-01-18T09:00:00'),
  },
  {
    id: 'fav4',
    userId: 'user1',
    type: 'provider',
    itemId: 'provider1',
    item: {
      id: 'provider1',
      title: 'CleanPro Services',
      description: 'Professional cleaning services with certified staff',
      image: home4,
      rating: 4.9,
      location: 'Lagos',
      servicesCount: 5,
      reviewsCount: 120,
    },
    createdAt: new Date('2024-01-19T11:20:00'),
  },
  {
    id: 'fav5',
    userId: 'user1',
    type: 'property',
    itemId: 'prop3',
    item: {
      id: 'prop3',
      title: '4 Bedroom Duplex in Victoria Island',
      description: 'Luxurious 4-bedroom duplex with premium finishes',
      image: home5,
      price: 500000,
      location: 'Victoria Island, Lagos',
      rating: 4.9,
      bedrooms: 4,
      bathrooms: 4,
    },
    createdAt: new Date('2024-01-17T16:45:00'),
  },
]

// Alias for backward compatibility
export const sampleFavourites = mockFavourites
