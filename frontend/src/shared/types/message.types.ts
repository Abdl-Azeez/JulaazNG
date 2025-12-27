/**
 * Message/Chat Type Definitions
 * Matches backend Prisma schema
 */

export type MessageType = 'TEXT' | 'IMAGE' | 'DOCUMENT' | 'SYSTEM'

export type MessageStatus = 'SENT' | 'DELIVERED' | 'READ'

export type ConversationType = 'PROPERTY_INQUIRY' | 'SERVICE_REQUEST' | 'GENERAL'

export interface MessageParticipant {
  userId: string
  firstName: string
  lastName: string
  avatar?: string
  role: string
  isOnline: boolean
  lastSeen: string
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  receiverId: string
  content: string
  type: MessageType
  status: MessageStatus
  readAt: string | null
  metadata?: Record<string, any>
  createdAt: string
  updatedAt: string
}

export interface Conversation {
  id: string
  participants: MessageParticipant[]
  lastMessage: Message | null
  unreadCount: number
  type: ConversationType
  metadata?: Record<string, any>
  createdAt: string
  updatedAt: string
}
