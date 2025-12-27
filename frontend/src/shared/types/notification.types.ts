/**
 * Notification Type Definitions
 * Matches backend Prisma schema
 */

export type NotificationType =
  | 'BOOKING_CONFIRMED'
  | 'APPLICATION_STATUS'
  | 'PAYMENT_RECEIVED'
  | 'NEW_MESSAGE'
  | 'SERVICE_SCHEDULED'
  | 'REVIEW_REQUEST'
  | 'PROPERTY_ALERT'
  | 'SYSTEM_ANNOUNCEMENT'

export type NotificationChannel = 'IN_APP' | 'EMAIL' | 'SMS' | 'PUSH'

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  data?: Record<string, any>
  channel: NotificationChannel
  isRead: boolean
  readAt: string | null
  actionUrl?: string
  createdAt: string
  updatedAt: string
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
