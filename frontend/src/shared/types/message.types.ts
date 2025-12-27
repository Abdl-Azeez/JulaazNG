/**
 * Message/Chat Type Definitions
 * Matches backend API spec from BACKEND_API_SPEC.md Section 2.4
 */

// API Spec: messageType: enum ['text', 'image', 'document', 'system']
export type MessageType = 'text' | 'image' | 'document' | 'system'

// API Spec: conversationType: enum ['viewing_request', 'general', 'support']
export type ConversationType = 'viewing_request' | 'general' | 'support'

// Status is derived from isRead field in API spec
export type MessageStatus = 'sent' | 'delivered' | 'read'

// Legacy uppercase types for backward compatibility
export type LegacyMessageType = 'TEXT' | 'IMAGE' | 'DOCUMENT' | 'SYSTEM'
export type LegacyMessageStatus = 'SENT' | 'DELIVERED' | 'READ'
export type LegacyConversationType = 'PROPERTY_INQUIRY' | 'SERVICE_REQUEST' | 'GENERAL'

export interface MessageParticipant {
  userId: string
  firstName: string
  lastName: string
  avatar?: string
  role: string
  isOnline: boolean
  lastSeen: string
}

// API Spec compliant Message
export interface Message {
  id: string
  conversationId: string
  senderId: string
  content: string
  messageType: MessageType
  attachments?: string[]
  isRead: boolean
  readAt: string | null
  createdAt: string
  updatedAt: string
  // Additional UI fields
  receiverId?: string
  status?: MessageStatus
  metadata?: Record<string, unknown>
}

// API Spec compliant Conversation
export interface Conversation {
  id: string
  participants: string[] | MessageParticipant[]
  conversationType: ConversationType
  relatedPropertyId?: string
  relatedBookingId?: string
  lastMessageAt: string
  lastMessagePreview: string
  createdAt: string
  updatedAt: string
  // Additional UI fields
  lastMessage?: Message | null
  unreadCount?: number
  metadata?: Record<string, unknown>
}
