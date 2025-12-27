/**
 * Notification Type Definitions
 * Matches backend API spec from BACKEND_API_SPEC.md Section 2.5 Notifications
 */

// API Spec: type: enum ['viewing_request', 'viewing_approved', 'viewing_rejected', 'application_update', 'payment_due', 'payment_received', 'message_received', 'document_approved', 'document_rejected', 'agreement_sent', 'system']
export type NotificationType =
  | 'viewing_request'
  | 'viewing_approved'
  | 'viewing_rejected'
  | 'application_update'
  | 'payment_due'
  | 'payment_received'
  | 'message_received'
  | 'document_approved'
  | 'document_rejected'
  | 'agreement_sent'
  | 'system'

// API Spec: relatedEntityType: enum ['property', 'booking', 'payment', 'agreement', 'message']
export type RelatedEntityType = 'property' | 'booking' | 'payment' | 'agreement' | 'message'

export type NotificationChannel = 'in_app' | 'email' | 'sms' | 'push'

// Legacy uppercase types for backward compatibility
export type LegacyNotificationType =
  | 'BOOKING_CONFIRMED'
  | 'APPLICATION_STATUS'
  | 'PAYMENT_RECEIVED'
  | 'NEW_MESSAGE'
  | 'SERVICE_SCHEDULED'
  | 'REVIEW_REQUEST'
  | 'PROPERTY_ALERT'
  | 'SYSTEM_ANNOUNCEMENT'

export type LegacyNotificationChannel = 'IN_APP' | 'EMAIL' | 'SMS' | 'PUSH'

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  icon?: string
  relatedEntityType?: RelatedEntityType
  relatedEntityId?: string
  isRead: boolean
  readAt: string | null
  actionUrl?: string
  createdAt: string
  // Additional fields for UI compatibility
  data?: Record<string, unknown>
  channel?: NotificationChannel
  updatedAt?: string
}

export interface NotificationPreferences {
  userId: string
  channels: {
    inApp: boolean
    email: boolean
    sms: boolean
    push: boolean
  }
  types: Record<
    NotificationType,
    {
      inApp: boolean
      email: boolean
      sms: boolean
      push: boolean
    }
  >
  createdAt: string
  updatedAt: string
}
