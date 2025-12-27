import { create } from 'zustand'
import { Conversation, Message } from '@/shared/types/activity.types'
import { sampleConversations, sampleMessages } from '@/__mocks__/data/messages.mock'
import { format } from 'date-fns'
import type { RentalCategory } from '@/entities/property/model/types'

type ViewingSlotPayload = {
  date: Date
  label: string
}

type ViewingConversationPayload = {
  propertyId: string
  propertyName: string
  propertyImage?: string
  ownerName: string
  ownerPhone?: string
  ownerId?: string
  tenant: {
    id: string
    name?: string
    phone?: string
    email?: string
  }
  slots: ViewingSlotPayload[]
  moveInDate: string
  tenancyDuration: string
  minimumBudget: number
  rentalPreference: RentalCategory
  shortletStayLengthNights?: number
  note?: string
}

interface MessagingState {
  conversations: Conversation[]
  messages: Record<string, Message[]>
  addConversation: (conversation: Conversation, initialMessages?: Message[]) => string
  addMessage: (conversationId: string, message: Message) => void
  createViewingConversation: (payload: ViewingConversationPayload) => { conversationId: string }
}

const ADMIN_PARTICIPANT = {
  id: 'julaaz-admin',
  name: 'Julaaz Support',
  avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Julaaz%20Support'
}

const generateId = (prefix: string) => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `${prefix}_${crypto.randomUUID()}`
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`
}

export const useMessagingStore = create<MessagingState>((set, get) => ({
  conversations: sampleConversations,
  messages: sampleMessages,
  addConversation: (conversation, initialMessages = []) => {
    set((state) => {
      const filtered = state.conversations.filter((item) => item.id !== conversation.id)
      const conversations = [conversation, ...filtered].sort(
        (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
      )
      return {
        conversations,
        messages: {
          ...state.messages,
          [conversation.id]: initialMessages
        }
      }
    })
    return conversation.id
  },
  addMessage: (conversationId, message) => {
    set((state) => {
      const existingMessages = state.messages[conversationId] ?? []
      const updatedMessages = [...existingMessages, message]
      const conversations = state.conversations
        .map((conversation) =>
          conversation.id === conversationId
            ? {
                ...conversation,
                lastMessage: message,
                updatedAt: message.createdAt
              }
            : conversation
        )
        .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())

      return {
        messages: {
          ...state.messages,
          [conversationId]: updatedMessages
        },
        conversations
      }
    })
  },
  createViewingConversation: ({
    propertyId,
    propertyName,
    propertyImage,
    ownerName,
    ownerPhone,
    ownerId,
    tenant,
    slots,
    moveInDate,
    tenancyDuration,
    minimumBudget,
    rentalPreference,
    shortletStayLengthNights,
    note
  }) => {
    const conversationId = generateId('conv')
    const now = new Date()
    const tenantId = tenant.id || 'guest'
    const ownerParticipantId = ownerId ?? `owner-${propertyId}`

    const slotSummary = slots
      .map((slot, index) => `${index + 1}. ${format(slot.date, 'EEEE, MMM d @ h:mm a')}`)
      .join('\n')

    const messageLines = [
      `Viewing request for ${propertyName}`,
      '',
      `Tenant: ${tenant.name ?? 'Guest user'}`
    ]

    if (tenant.phone) {
      messageLines.push(`Phone: ${tenant.phone}`)
    }

    if (tenant.email) {
      messageLines.push(`Email: ${tenant.email}`)
    }

    if (ownerPhone) {
      messageLines.push(`Owner Contact: ${ownerPhone}`)
    }

    const formattedMoveInDate = moveInDate ? format(new Date(moveInDate), 'MMMM dd, yyyy') : null
    const formattedBudget = new Intl.NumberFormat('en-NG', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(minimumBudget)

    messageLines.push(
      '',
      `Rental preference: ${rentalPreference === 'shortlet' ? 'Serviced shortlet stay' : 'Annual lease'}`
    )

    if (rentalPreference === 'shortlet') {
      messageLines.push(
        '',
        'Stay details:',
        formattedMoveInDate ? `• Preferred check-in date: ${formattedMoveInDate}` : '• Check-in date: Flexible',
        shortletStayLengthNights
          ? `• Stay length: ${shortletStayLengthNights} night${shortletStayLengthNights > 1 ? 's' : ''}`
          : '• Stay length: Not specified',
        `• Budget: ₦${formattedBudget} per night`
      )
    } else {
      messageLines.push(
        '',
        'Move-in preferences:',
        formattedMoveInDate ? `• Move-in date: ${formattedMoveInDate}` : '• Move-in date: Not specified',
        `• Tenancy duration: ${tenancyDuration}`,
        `• Budget: ₦${formattedBudget} per month`
      )
    }

    messageLines.push('', 'Preferred slots:', slotSummary)

    if (note) {
      messageLines.push('', 'Additional notes:', note)
    }

    const initialMessage: Message = {
      id: generateId('msg'),
      conversationId,
      senderId: tenantId,
      recipientId: 'group',
      type: 'text',
      content: messageLines.join('\n'),
      status: 'sent',
      createdAt: now
    }

    const conversation: Conversation = {
      id: conversationId,
      participants: [tenantId, ownerParticipantId, ADMIN_PARTICIPANT.id],
      type: 'group',
      context: {
        propertyId,
        bookingId: `${propertyId}-viewing-${Date.now()}`
      },
      status: 'active',
      createdAt: now,
      updatedAt: now,
      lastMessage: initialMessage,
      unreadCount: {
        [tenantId]: 0
      },
      participantDetails: [
        {
          id: conversationId,
          name: `${propertyName} Viewing`,
          avatar: propertyImage
        },
        {
          id: ownerParticipantId,
          name: ownerName,
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(ownerName)}`
        },
        ADMIN_PARTICIPANT,
        {
          id: tenantId,
          name: tenant.name ?? 'You',
          avatar: tenant.name
            ? `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(tenant.name)}`
            : undefined
        }
      ]
    }

    get().addConversation(conversation, [initialMessage])

    return { conversationId }
  }
}))
