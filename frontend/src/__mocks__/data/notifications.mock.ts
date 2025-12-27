/**
 * Notifications Mock Data
 * Matches backend API specification from BACKEND_API_SPEC.md Section 2.5
 */

import type { ApiResponse } from '@/shared/types/common.types'
import type {
  Notification,
  NotificationPreferences,
  NotificationType,
} from '@/shared/types/notification.types'
import { mockUsers } from './auth.mock'

// Sample notifications matching API spec
export const mockNotifications: Notification[] = [
  {
    id: 'notif_001',
    userId: mockUsers.tenant1.id,
    type: 'viewing_approved',
    title: 'Viewing Confirmed',
    message: 'Your property viewing at Marina Apartment has been confirmed for Feb 15, 2024 at 10:00 AM',
    icon: 'calendar-check',
    relatedEntityType: 'booking',
    relatedEntityId: 'book_001',
    isRead: false,
    readAt: null,
    actionUrl: '/bookings/book_001',
    createdAt: '2024-02-10T14:20:00Z',
    data: {
      bookingId: 'book_001',
      propertyId: 'prop_001',
      propertyTitle: 'Luxury 3BR Apartment in Marina',
      viewingDate: '2024-02-15T10:00:00Z',
    },
  },
  {
    id: 'notif_002',
    userId: mockUsers.tenant1.id,
    type: 'application_update',
    title: 'Application Under Review',
    message: 'Your application for Modern 2BR in Lekki is being reviewed by the landlord',
    icon: 'file-text',
    relatedEntityType: 'booking',
    relatedEntityId: 'book_002',
    isRead: false,
    readAt: null,
    actionUrl: '/bookings/book_002',
    createdAt: '2024-02-12T14:00:00Z',
    data: {
      bookingId: 'book_002',
      propertyId: 'prop_002',
      propertyTitle: 'Modern 2BR in Lekki Phase 1',
      status: 'under_review',
    },
  },
  {
    id: 'notif_003',
    userId: mockUsers.tenant1.id,
    type: 'payment_received',
    title: 'Payment Successful',
    message: 'Your payment of ₦1,500,000 for Marina Apartment has been confirmed',
    icon: 'check-circle',
    relatedEntityType: 'payment',
    relatedEntityId: 'pay_001',
    isRead: true,
    readAt: '2024-02-11T09:00:00Z',
    actionUrl: '/payments/pay_001',
    createdAt: '2024-02-11T08:30:00Z',
    data: {
      paymentId: 'pay_001',
      amount: 1500000,
      currency: 'NGN',
      propertyId: 'prop_001',
    },
  },
  {
    id: 'notif_004',
    userId: mockUsers.tenant1.id,
    type: 'message_received',
    title: 'New Message from Landlord',
    message: 'Adebayo Okonkwo sent you a message about your viewing request',
    icon: 'message-circle',
    relatedEntityType: 'message',
    relatedEntityId: 'conv_001',
    isRead: true,
    readAt: '2024-02-10T15:00:00Z',
    actionUrl: '/messages/conv_001',
    createdAt: '2024-02-10T14:45:00Z',
    data: {
      conversationId: 'conv_001',
      senderId: mockUsers.landlord1.id,
      senderName: 'Adebayo Okonkwo',
    },
  },
  {
    id: 'notif_005',
    userId: mockUsers.tenant1.id,
    type: 'viewing_request',
    title: 'Service Scheduled',
    message: 'Your plumbing repair service is scheduled for Feb 16, 2024 at 9:00 AM',
    icon: 'wrench',
    relatedEntityType: 'booking',
    relatedEntityId: 'sb_001',
    isRead: false,
    readAt: null,
    actionUrl: '/services/sb_001',
    createdAt: '2024-02-13T14:30:00Z',
    data: {
      serviceBookingId: 'sb_001',
      providerId: 'sp_001',
      providerName: 'Quick Fix Plumbing',
      scheduledDate: '2024-02-16T09:00:00Z',
    },
  },
  {
    id: 'notif_006',
    userId: mockUsers.tenant1.id,
    type: 'system',
    title: 'Review Your Service',
    message: 'How was your experience with Bright Spark Electrical? Leave a review',
    icon: 'star',
    isRead: false,
    readAt: null,
    actionUrl: '/services/sb_002/review',
    createdAt: '2024-02-10T15:00:00Z',
    data: {
      serviceBookingId: 'sb_002',
      providerId: 'sp_002',
      providerName: 'Bright Spark Electrical',
    },
  },
  {
    id: 'notif_007',
    userId: mockUsers.tenant1.id,
    type: 'system',
    title: 'New Property Match',
    message: 'A new property matching your preferences is now available in Lekki',
    icon: 'home',
    relatedEntityType: 'property',
    relatedEntityId: 'prop_004',
    isRead: true,
    readAt: '2024-02-09T10:00:00Z',
    actionUrl: '/properties/prop_004',
    createdAt: '2024-02-09T09:30:00Z',
    data: {
      propertyId: 'prop_004',
      propertyTitle: 'Cozy 1BR Apartment',
      location: 'Lekki Phase 1',
      price: 800000,
    },
  },
  {
    id: 'notif_008',
    userId: mockUsers.tenant1.id,
    type: 'system',
    title: 'New Feature: Video Tours',
    message: 'Now you can take virtual tours of properties from the comfort of your home!',
    icon: 'video',
    isRead: true,
    readAt: '2024-02-08T11:00:00Z',
    actionUrl: '/features/video-tours',
    createdAt: '2024-02-08T08:00:00Z',
    data: {
      feature: 'video-tours',
      learnMoreUrl: '/features/video-tours',
    },
  },
  {
    id: 'notif_009',
    userId: mockUsers.tenant1.id,
    type: 'document_approved',
    title: 'Document Approved',
    message: 'Your identity verification document has been approved',
    icon: 'file-check',
    isRead: false,
    readAt: null,
    actionUrl: '/profile/verification',
    createdAt: '2024-02-14T10:00:00Z',
    data: {
      documentId: 'doc_001',
      documentType: 'identity',
    },
  },
  {
    id: 'notif_010',
    userId: mockUsers.tenant1.id,
    type: 'agreement_sent',
    title: 'Tenancy Agreement Ready',
    message: 'Your tenancy agreement for Marina Apartment is ready for review and signature',
    icon: 'file-signature',
    relatedEntityType: 'agreement',
    relatedEntityId: 'agree_001',
    isRead: false,
    readAt: null,
    actionUrl: '/agreements/agree_001',
    createdAt: '2024-02-15T09:00:00Z',
    data: {
      agreementId: 'agree_001',
      propertyId: 'prop_001',
      propertyTitle: 'Luxury 3BR Apartment in Marina',
    },
  },
  {
    id: 'notif_011',
    userId: mockUsers.tenant1.id,
    type: 'payment_due',
    title: 'Payment Due Soon',
    message: 'Your rent payment of ₦1,200,000 is due in 3 days',
    icon: 'calendar-alert',
    relatedEntityType: 'payment',
    relatedEntityId: 'pay_002',
    isRead: false,
    readAt: null,
    actionUrl: '/payments/pay_002',
    createdAt: '2024-02-16T08:00:00Z',
    data: {
      paymentId: 'pay_002',
      amount: 1200000,
      dueDate: '2024-02-19',
      propertyId: 'prop_001',
    },
  },
]

// Notification types for preferences (API spec types)
const notificationTypes: NotificationType[] = [
  'viewing_request',
  'viewing_approved',
  'viewing_rejected',
  'application_update',
  'payment_due',
  'payment_received',
  'message_received',
  'document_approved',
  'document_rejected',
  'agreement_sent',
  'system',
]

// Sample notification preferences
export const mockNotificationPreferences: NotificationPreferences = {
  userId: mockUsers.tenant1.id,
  channels: {
    inApp: true,
    email: true,
    sms: false,
    push: true,
  },
  types: notificationTypes.reduce(
    (acc, type) => ({
      ...acc,
      [type]: {
        inApp: true,
        email: type !== 'system',
        sms: ['payment_due', 'payment_received', 'application_update'].includes(type),
        push: type !== 'system',
      },
    }),
    {} as NotificationPreferences['types']
  ),
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-02-10T00:00:00Z',
}

// API Response Mocks
export const mockNotificationsResponse: ApiResponse<{
  notifications: Notification[]
  unreadCount: number
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
    notifications: mockNotifications,
    unreadCount: mockNotifications.filter((n) => !n.isRead).length,
    pagination: {
      page: 1,
      limit: 20,
      total: mockNotifications.length,
      totalPages: 1,
      hasNext: false,
      hasPrevious: false,
    },
  },
  message: 'Notifications retrieved successfully',
  timestamp: new Date().toISOString(),
}

export const mockUnreadCountResponse: ApiResponse<{ count: number }> = {
  success: true,
  data: {
    count: mockNotifications.filter((n) => !n.isRead).length,
  },
  message: 'Unread count retrieved successfully',
  timestamp: new Date().toISOString(),
}

export const mockMarkAsReadResponse: ApiResponse<Notification> = {
  success: true,
  data: { ...mockNotifications[0], isRead: true, readAt: new Date().toISOString() },
  message: 'Notification marked as read',
  timestamp: new Date().toISOString(),
}

export const mockMarkAllAsReadResponse: ApiResponse<{ count: number }> = {
  success: true,
  data: { count: mockNotifications.filter((n) => !n.isRead).length },
  message: 'All notifications marked as read',
  timestamp: new Date().toISOString(),
}

export const mockNotificationPreferencesResponse: ApiResponse<NotificationPreferences> = {
  success: true,
  data: mockNotificationPreferences,
  message: 'Notification preferences retrieved successfully',
  timestamp: new Date().toISOString(),
}

export const mockUpdatePreferencesResponse: ApiResponse<NotificationPreferences> = {
  success: true,
  data: mockNotificationPreferences,
  message: 'Notification preferences updated successfully',
  timestamp: new Date().toISOString(),
}

export const mockDeleteNotificationResponse: ApiResponse<{ deleted: boolean }> = {
  success: true,
  data: { deleted: true },
  message: 'Notification deleted successfully',
  timestamp: new Date().toISOString(),
}

// ============================================================
// UI-SPECIFIC NOTIFICATIONS DATA
// Migrated from: pages/notifications/data/sample-notifications.ts
// Uses activity.types Notification (snake_case types, Date objects)
// ============================================================

import type { Notification as UINotification } from '@/shared/types/activity.types'

export const sampleNotifications: UINotification[] = [
  {
    id: '1',
    userId: 'user1',
    type: 'booking_confirmed',
    title: 'Booking Confirmed',
    message: 'Your viewing appointment for 3-bedroom apartment in Ikeja has been confirmed for Jan 25, 2024 at 2:00 PM',
    data: { bookingId: 'booking1', propertyId: 'prop1', date: '2024-01-25T14:00:00' },
    channels: { inApp: true, email: true, sms: false, push: true, whatsapp: false },
    status: 'read',
    createdAt: new Date('2024-01-20T10:00:00'),
    readAt: new Date('2024-01-20T10:05:00'),
    actionUrl: '/my-bookings/booking1',
    icon: 'calendar-check',
  },
  {
    id: '2',
    userId: 'user1',
    type: 'payment_received',
    title: 'Payment Received',
    message: 'Your payment of ₦150,000 for security deposit has been received successfully',
    data: { paymentId: 'pay1', amount: 150000, currency: 'NGN' },
    channels: { inApp: true, email: true, sms: true, push: true, whatsapp: false },
    status: 'read',
    createdAt: new Date('2024-01-20T09:30:00'),
    readAt: new Date('2024-01-20T09:35:00'),
    actionUrl: '/payments/pay1',
    icon: 'check-circle',
  },
  {
    id: '3',
    userId: 'user1',
    type: 'message_received',
    title: 'New Message',
    message: 'John Adekunle sent you a message about the property viewing',
    data: { conversationId: 'conv1', senderId: 'user2' },
    channels: { inApp: true, email: false, sms: false, push: true, whatsapp: false },
    status: 'delivered',
    createdAt: new Date('2024-01-20T14:30:00'),
    actionUrl: '/messaging/conv1',
    icon: 'message-circle',
  },
  {
    id: '4',
    userId: 'user1',
    type: 'service_booked',
    title: 'Service Booked',
    message: 'Your cleaning service has been confirmed for Jan 21, 2024 at 10:00 AM',
    data: { serviceBookingId: 'service1', serviceName: 'Deep Cleaning', date: '2024-01-21T10:00:00' },
    channels: { inApp: true, email: true, sms: false, push: true, whatsapp: false },
    status: 'read',
    createdAt: new Date('2024-01-20T16:45:00'),
    readAt: new Date('2024-01-20T17:00:00'),
    actionUrl: '/services/bookings/service1',
    icon: 'sparkles',
  },
  {
    id: '5',
    userId: 'user1',
    type: 'property_matched',
    title: 'New Property Match',
    message: 'We found 3 new properties that match your search criteria',
    data: { propertyIds: ['prop2', 'prop3', 'prop4'] },
    channels: { inApp: true, email: true, sms: false, push: true, whatsapp: false },
    status: 'delivered',
    createdAt: new Date('2024-01-19T08:00:00'),
    actionUrl: '/properties/search',
    icon: 'home',
  },
  {
    id: '6',
    userId: 'user1',
    type: 'rent_due',
    title: 'Rent Due Reminder',
    message: 'Your monthly rent of ₦200,000 is due in 3 days (Jan 23, 2024)',
    data: { bookingId: 'booking2', amount: 200000, dueDate: '2024-01-23' },
    channels: { inApp: true, email: true, sms: true, push: true, whatsapp: false },
    status: 'read',
    createdAt: new Date('2024-01-20T07:00:00'),
    readAt: new Date('2024-01-20T08:00:00'),
    actionUrl: '/my-bookings/booking2/payment',
    icon: 'calendar-alert',
  },
  {
    id: '7',
    userId: 'user1',
    type: 'review_request',
    title: 'Leave a Review',
    message: 'How was your experience with CleanPro Services? Share your feedback',
    data: { serviceBookingId: 'service2', providerId: 'user3' },
    channels: { inApp: true, email: true, sms: false, push: false, whatsapp: false },
    status: 'delivered',
    createdAt: new Date('2024-01-18T12:00:00'),
    actionUrl: '/services/bookings/service2/review',
    icon: 'star',
  },
  {
    id: '8',
    userId: 'user1',
    type: 'document_approved',
    title: 'Document Approved',
    message: 'Your identity verification document has been approved',
    data: { documentId: 'doc1', documentType: 'identity' },
    channels: { inApp: true, email: true, sms: false, push: true, whatsapp: false },
    status: 'read',
    createdAt: new Date('2024-01-17T15:00:00'),
    readAt: new Date('2024-01-17T16:00:00'),
    actionUrl: '/profile/verification',
    icon: 'file-check',
  },
]
