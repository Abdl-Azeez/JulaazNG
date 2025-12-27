/**
 * Messages/Chat Mock Data
 * Matches backend API specification from BACKEND_API_SPEC.md Section 2.4
 */

import type { ApiResponse } from '@/shared/types/common.types'
import type {
  Conversation,
  Message,
  MessageParticipant,
} from '@/shared/types/message.types'
import { mockUsers } from './auth.mock'

// Sample participants
export const mockParticipants: MessageParticipant[] = [
  {
    userId: mockUsers.tenant1.id,
    firstName: mockUsers.tenant1.firstName,
    lastName: mockUsers.tenant1.lastName,
    avatar: mockUsers.tenant1.profilePicture,
    role: 'tenant',
    isOnline: true,
    lastSeen: new Date().toISOString(),
  },
  {
    userId: mockUsers.landlord1.id,
    firstName: mockUsers.landlord1.firstName,
    lastName: mockUsers.landlord1.lastName,
    avatar: mockUsers.landlord1.profilePicture,
    role: 'landlord',
    isOnline: false,
    lastSeen: '2024-02-13T18:30:00Z',
  },
  {
    userId: 'user_sp_001',
    firstName: 'Emmanuel',
    lastName: 'Adeyemi',
    avatar: 'https://i.pravatar.cc/150?img=12',
    role: 'handyman',
    isOnline: true,
    lastSeen: new Date().toISOString(),
  },
]

// Sample messages (API spec compliant)
export const mockMessages: Message[] = [
  {
    id: 'msg_001',
    conversationId: 'conv_001',
    senderId: mockUsers.landlord1.id,
    content: 'Hello! Thank you for your interest in the Marina apartment. The viewing is confirmed for February 15 at 10:00 AM.',
    messageType: 'text',
    attachments: [],
    isRead: true,
    readAt: '2024-02-10T15:00:00Z',
    metadata: {
      propertyId: 'prop_001',
      bookingId: 'book_001',
    },
    createdAt: '2024-02-10T14:45:00Z',
    updatedAt: '2024-02-10T15:00:00Z',
  },
  {
    id: 'msg_002',
    conversationId: 'conv_001',
    senderId: mockUsers.tenant1.id,
    content: 'Perfect! Thank you so much. Is parking available?',
    messageType: 'text',
    attachments: [],
    isRead: true,
    readAt: '2024-02-10T15:30:00Z',
    createdAt: '2024-02-10T15:15:00Z',
    updatedAt: '2024-02-10T15:30:00Z',
  },
  {
    id: 'msg_003',
    conversationId: 'conv_001',
    senderId: mockUsers.landlord1.id,
    content: 'Yes, there are 2 dedicated parking spaces included.',
    messageType: 'text',
    attachments: [],
    isRead: true,
    readAt: '2024-02-10T16:00:00Z',
    createdAt: '2024-02-10T15:45:00Z',
    updatedAt: '2024-02-10T16:00:00Z',
  },
  {
    id: 'msg_004',
    conversationId: 'conv_001',
    senderId: mockUsers.tenant1.id,
    content: 'Great! See you on the 15th.',
    messageType: 'text',
    attachments: [],
    isRead: false,
    readAt: null,
    createdAt: '2024-02-10T16:10:00Z',
    updatedAt: '2024-02-10T16:10:00Z',
  },
  {
    id: 'msg_005',
    conversationId: 'conv_002',
    senderId: 'user_sp_001',
    content: 'Hi! I received your service request for the plumbing repair. I can come tomorrow at 9 AM. Does that work for you?',
    messageType: 'text',
    attachments: [],
    isRead: true,
    readAt: '2024-02-13T15:00:00Z',
    metadata: {
      serviceBookingId: 'sb_001',
    },
    createdAt: '2024-02-13T14:30:00Z',
    updatedAt: '2024-02-13T15:00:00Z',
  },
  {
    id: 'msg_006',
    conversationId: 'conv_002',
    senderId: mockUsers.tenant1.id,
    content: 'Yes, that works perfectly! Thank you.',
    messageType: 'text',
    attachments: [],
    isRead: true,
    readAt: '2024-02-13T15:10:00Z',
    createdAt: '2024-02-13T15:05:00Z',
    updatedAt: '2024-02-13T15:10:00Z',
  },
  {
    id: 'msg_007',
    conversationId: 'conv_002',
    senderId: 'user_sp_001',
    content: 'Great! See you tomorrow.',
    messageType: 'text',
    attachments: [],
    isRead: false,
    readAt: null,
    createdAt: '2024-02-13T15:12:00Z',
    updatedAt: '2024-02-13T15:12:00Z',
  },
]

// Sample conversations (API spec compliant)
export const mockConversations: Conversation[] = [
  {
    id: 'conv_001',
    participants: [mockParticipants[0], mockParticipants[1]],
    conversationType: 'viewing_request',
    relatedPropertyId: 'prop_001',
    relatedBookingId: 'book_001',
    lastMessageAt: '2024-02-10T16:10:00Z',
    lastMessagePreview: 'Great! See you on the 15th.',
    lastMessage: mockMessages[3],
    unreadCount: 0,
    metadata: {
      propertyTitle: 'Luxury 3BR Apartment in Marina',
    },
    createdAt: '2024-02-10T14:45:00Z',
    updatedAt: '2024-02-10T16:10:00Z',
  },
  {
    id: 'conv_002',
    participants: [mockParticipants[0], mockParticipants[2]],
    conversationType: 'general',
    lastMessageAt: '2024-02-13T15:12:00Z',
    lastMessagePreview: 'Great! See you tomorrow.',
    lastMessage: mockMessages[6],
    unreadCount: 1,
    metadata: {
      serviceBookingId: 'sb_001',
      providerId: 'sp_001',
      providerName: 'Quick Fix Plumbing',
    },
    createdAt: '2024-02-13T14:30:00Z',
    updatedAt: '2024-02-13T15:12:00Z',
  },
  {
    id: 'conv_003',
    participants: [mockParticipants[0].userId, 'admin_001'],
    conversationType: 'support',
    lastMessageAt: '2024-02-14T10:00:00Z',
    lastMessagePreview: 'Thank you for contacting support. How can we help?',
    unreadCount: 1,
    createdAt: '2024-02-14T09:55:00Z',
    updatedAt: '2024-02-14T10:00:00Z',
  },
]

// API Response Mocks
export const mockConversationsResponse: ApiResponse<{
  conversations: Conversation[]
  totalUnread: number
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
    conversations: mockConversations,
    totalUnread: mockConversations.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0),
    pagination: {
      page: 1,
      limit: 20,
      total: mockConversations.length,
      totalPages: 1,
      hasNext: false,
      hasPrevious: false,
    },
  },
  message: 'Conversations retrieved successfully',
  timestamp: new Date().toISOString(),
}

export const mockConversationDetailResponse: ApiResponse<{
  conversation: Conversation
  messages: Message[]
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
    conversation: mockConversations[0],
    messages: mockMessages.filter((m) => m.conversationId === 'conv_001'),
    pagination: {
      page: 1,
      limit: 50,
      total: 4,
      totalPages: 1,
      hasNext: false,
      hasPrevious: false,
    },
  },
  message: 'Conversation details retrieved successfully',
  timestamp: new Date().toISOString(),
}

export const mockSendMessageResponse: ApiResponse<Message> = {
  success: true,
  data: {
    id: 'msg_new_001',
    conversationId: 'conv_001',
    senderId: mockUsers.tenant1.id,
    content: 'New message content',
    messageType: 'text',
    attachments: [],
    isRead: false,
    status: 'sent',
    readAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  message: 'Message sent successfully',
  timestamp: new Date().toISOString(),
}

export const mockMessagesMarkAsReadResponse: ApiResponse<{ markedCount: number }> = {
  success: true,
  data: { markedCount: 3 },
  message: 'Messages marked as read',
  timestamp: new Date().toISOString(),
}

export const mockCreateConversationResponse: ApiResponse<Conversation> = {
  success: true,
  data: {
    id: 'conv_new_001',
    participants: [mockParticipants[0], mockParticipants[1]],
    conversationType: 'viewing_request',
    lastMessageAt: new Date().toISOString(),
    lastMessagePreview: '',
    lastMessage: null,
    unreadCount: 0,
    metadata: {
      propertyId: 'prop_002',
      propertyTitle: 'Modern 2BR in Lekki Phase 1',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  message: 'Conversation created successfully',
  timestamp: new Date().toISOString(),
}

export const mockDeleteMessageResponse: ApiResponse<{ deleted: boolean }> = {
  success: true,
  data: { deleted: true },
  message: 'Message deleted successfully',
  timestamp: new Date().toISOString(),
}

export const mockMessagesUnreadCountResponse: ApiResponse<{ totalUnread: number }> = {
  success: true,
  data: {
    totalUnread: mockConversations.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0),
  },
  message: 'Unread count retrieved successfully',
  timestamp: new Date().toISOString(),
}

// ============================================================
// UI CONVERSATIONS (for Messaging Page)
// Migrated from: pages/messaging/data/sample-conversations.ts
// ============================================================
import { Conversation as UIConversation, Message as UIMessage } from '@/shared/types/activity.types'

export const sampleConversations: UIConversation[] = [
  {
    id: '1',
    participants: ['user1', 'user2'],
    type: 'direct',
    context: {
      propertyId: 'prop1',
    },
    status: 'active',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20T14:30:00'),
    lastMessage: {
      id: 'msg1',
      conversationId: '1',
      senderId: 'user2',
      recipientId: 'user1',
      type: 'text',
      content: 'Thanks for your interest! When would you like to schedule a viewing?',
      status: 'read',
      createdAt: new Date('2024-01-20T14:30:00'),
      readAt: new Date('2024-01-20T14:35:00'),
    },
    unreadCount: { user1: 0 },
    participantDetails: [
      {
        id: 'user2',
        name: 'John Adekunle',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
        isOnline: true,
      },
    ],
  },
  {
    id: '2',
    participants: ['user1', 'user3'],
    type: 'direct',
    context: {
      serviceBookingId: 'service1',
    },
    status: 'active',
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-20T16:45:00'),
    lastMessage: {
      id: 'msg2',
      conversationId: '2',
      senderId: 'user3',
      recipientId: 'user1',
      type: 'text',
      content: 'Your cleaning service has been confirmed for tomorrow at 10 AM',
      status: 'delivered',
      createdAt: new Date('2024-01-20T16:45:00'),
    },
    unreadCount: { user1: 2 },
    participantDetails: [
      {
        id: 'user3',
        name: 'CleanPro Services',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CleanPro',
        isOnline: false,
        lastSeen: new Date('2024-01-20T16:00:00'),
      },
    ],
  },
  {
    id: '3',
    participants: ['user1', 'user4'],
    type: 'direct',
    status: 'active',
    createdAt: new Date('2024-01-19'),
    updatedAt: new Date('2024-01-20T12:00:00'),
    lastMessage: {
      id: 'msg3',
      conversationId: '3',
      senderId: 'user1',
      recipientId: 'user4',
      type: 'text',
      content: 'Hi, I saw your property listing and I\'m very interested',
      status: 'read',
      createdAt: new Date('2024-01-20T12:00:00'),
      readAt: new Date('2024-01-20T12:05:00'),
    },
    unreadCount: { user1: 0 },
    participantDetails: [
      {
        id: 'user4',
        name: 'Sarah Okafor',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        isOnline: true,
      },
    ],
  },
]

export const sampleMessages: Record<string, UIMessage[]> = {
  '1': [
    {
      id: 'msg1-1',
      conversationId: '1',
      senderId: 'user1',
      recipientId: 'user2',
      type: 'text',
      content: 'Hi, I\'m interested in the 3-bedroom apartment in Ikeja',
      status: 'read',
      createdAt: new Date('2024-01-20T14:00:00'),
      readAt: new Date('2024-01-20T14:02:00'),
    },
    {
      id: 'msg1-2',
      conversationId: '1',
      senderId: 'user2',
      recipientId: 'user1',
      type: 'text',
      content: 'Hello! Yes, it\'s still available. Are you looking to move in soon?',
      status: 'read',
      createdAt: new Date('2024-01-20T14:05:00'),
      readAt: new Date('2024-01-20T14:07:00'),
    },
    {
      id: 'msg1-3',
      conversationId: '1',
      senderId: 'user1',
      recipientId: 'user2',
      type: 'text',
      content: 'Yes, I\'m planning to move in next month. Can I schedule a viewing?',
      status: 'read',
      createdAt: new Date('2024-01-20T14:10:00'),
      readAt: new Date('2024-01-20T14:12:00'),
    },
    {
      id: 'msg1-4',
      conversationId: '1',
      senderId: 'user2',
      recipientId: 'user1',
      type: 'text',
      content: 'Thanks for your interest! When would you like to schedule a viewing?',
      status: 'read',
      createdAt: new Date('2024-01-20T14:30:00'),
      readAt: new Date('2024-01-20T14:35:00'),
    },
  ],
  '2': [
    {
      id: 'msg2-1',
      conversationId: '2',
      senderId: 'user1',
      recipientId: 'user3',
      type: 'text',
      content: 'I need a deep cleaning service for my apartment',
      status: 'read',
      createdAt: new Date('2024-01-20T10:00:00'),
      readAt: new Date('2024-01-20T10:05:00'),
    },
    {
      id: 'msg2-2',
      conversationId: '2',
      senderId: 'user3',
      recipientId: 'user1',
      type: 'text',
      content: 'Sure! We can provide that. What date works for you?',
      status: 'read',
      createdAt: new Date('2024-01-20T10:10:00'),
      readAt: new Date('2024-01-20T10:15:00'),
    },
    {
      id: 'msg2-3',
      conversationId: '2',
      senderId: 'user1',
      recipientId: 'user3',
      type: 'text',
      content: 'Tomorrow at 10 AM would be perfect',
      status: 'read',
      createdAt: new Date('2024-01-20T16:30:00'),
      readAt: new Date('2024-01-20T16:32:00'),
    },
    {
      id: 'msg2-4',
      conversationId: '2',
      senderId: 'user3',
      recipientId: 'user1',
      type: 'text',
      content: 'Your cleaning service has been confirmed for tomorrow at 10 AM',
      status: 'delivered',
      createdAt: new Date('2024-01-20T16:45:00'),
    },
  ],
}
