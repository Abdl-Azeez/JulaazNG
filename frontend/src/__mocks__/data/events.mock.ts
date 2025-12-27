/**
 * Mock data for Events & Calendar
 * Migrated from: pages/events/data/sample-events.ts
 */

import type { Event } from '@/shared/types/activity.types'

export const mockEvents: Event[] = [
  {
    id: '1',
    userId: 'user1',
    type: 'viewing',
    title: 'Property Viewing - 3 Bedroom Apartment',
    description: 'Viewing appointment for the property in Ikeja',
    status: 'confirmed',
    startDate: new Date('2024-01-25T14:00:00'),
    endDate: new Date('2024-01-25T15:00:00'),
    location: 'Ikeja, Lagos',
    attendees: [
      {
        id: 'user1',
        name: 'You',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You',
        role: 'Tenant',
      },
      {
        id: 'user2',
        name: 'John Adekunle',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
        role: 'Landlord',
      },
    ],
    relatedTo: {
      type: 'property',
      id: 'prop1',
      title: '3 Bedroom Apartment in Ikeja',
    },
    reminder: {
      enabled: true,
      minutesBefore: 60,
    },
    createdAt: new Date('2024-01-20T10:00:00'),
    updatedAt: new Date('2024-01-20T10:00:00'),
  },
  {
    id: '2',
    userId: 'user1',
    type: 'service',
    title: 'Deep Cleaning Service',
    description: 'Professional deep cleaning service for apartment',
    status: 'confirmed',
    startDate: new Date('2024-01-21T10:00:00'),
    endDate: new Date('2024-01-21T14:00:00'),
    location: 'Your Apartment, Lekki',
    attendees: [
      {
        id: 'user1',
        name: 'You',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You',
        role: 'Customer',
      },
      {
        id: 'user3',
        name: 'CleanPro Services',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CleanPro',
        role: 'Service Provider',
      },
    ],
    relatedTo: {
      type: 'service',
      id: 'service1',
      title: 'Deep Cleaning Service',
    },
    reminder: {
      enabled: true,
      minutesBefore: 30,
    },
    createdAt: new Date('2024-01-20T16:45:00'),
    updatedAt: new Date('2024-01-20T16:45:00'),
  },
  {
    id: '3',
    userId: 'user1',
    type: 'payment',
    title: 'Rent Payment Due',
    description: 'Monthly rent payment of ₦200,000',
    status: 'scheduled',
    startDate: new Date('2024-01-23T00:00:00'),
    endDate: new Date('2024-01-23T23:59:59'),
    relatedTo: {
      type: 'booking',
      id: 'booking2',
      title: 'Monthly Rent',
    },
    reminder: {
      enabled: true,
      minutesBefore: 1440, // 24 hours
    },
    createdAt: new Date('2024-01-01T00:00:00'),
    updatedAt: new Date('2024-01-01T00:00:00'),
  },
  {
    id: '4',
    userId: 'user1',
    type: 'maintenance',
    title: 'AC Maintenance',
    description: 'Scheduled maintenance for air conditioning unit',
    status: 'scheduled',
    startDate: new Date('2024-01-28T09:00:00'),
    endDate: new Date('2024-01-28T11:00:00'),
    location: 'Your Apartment, Lekki',
    relatedTo: {
      type: 'property',
      id: 'prop2',
      title: '2 Bedroom Apartment',
    },
    reminder: {
      enabled: true,
      minutesBefore: 60,
    },
    createdAt: new Date('2024-01-19T12:00:00'),
    updatedAt: new Date('2024-01-19T12:00:00'),
  },
  {
    id: '5',
    userId: 'user1',
    type: 'viewing',
    title: 'Property Viewing - 2 Bedroom Apartment',
    description: 'Viewing appointment cancelled',
    status: 'cancelled',
    startDate: new Date('2024-01-22T10:00:00'),
    endDate: new Date('2024-01-22T11:00:00'),
    location: 'Victoria Island, Lagos',
    relatedTo: {
      type: 'property',
      id: 'prop3',
      title: '2 Bedroom Apartment in VI',
    },
    createdAt: new Date('2024-01-18T08:00:00'),
    updatedAt: new Date('2024-01-19T14:00:00'),
  },
]

// Alias for backward compatibility
export const sampleEvents = mockEvents
