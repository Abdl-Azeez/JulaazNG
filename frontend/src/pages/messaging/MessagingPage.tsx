import { useState } from 'react'
import * as React from 'react'
import { Search, MoreVertical, Image as ImageIcon, Paperclip, Send, Smile, MessageCircle, ArrowLeft } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { Badge } from '@/shared/ui/badge'
import { SharedLayout } from '@/widgets/shared-layout'
import { AuthDialog } from '@/widgets/auth-dialog'
import { LogoLoader } from '@/widgets/logo-loader'
import { useAuthStore } from '@/shared/store/auth.store'
import { ROUTES } from '@/shared/constants/routes'
import { formatDistanceToNow } from 'date-fns'
import { useMessagingStore } from '@/shared/store/messaging.store'
import type { Message } from '@/shared/types/activity.types'

export function MessagingPage() {
  const navigate = useNavigate()
  const { conversationId } = useParams()
  const { user } = useAuthStore()
  const conversations = useMessagingStore((state) => state.conversations)
  const messagesByConversation = useMessagingStore((state) => state.messages)
  const appendMessage = useMessagingStore((state) => state.addMessage)
  const [searchQuery, setSearchQuery] = useState('')
  const [messageInput, setMessageInput] = useState('')
  const [isDesktop, setIsDesktop] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const createMessageId = React.useCallback(
    (prefix: string) => {
      if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
        return `${prefix}_${crypto.randomUUID()}`
      }
      return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`
    },
    []
  )
  
  // Check if desktop on mount and resize
  React.useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }
    checkDesktop()
    window.addEventListener('resize', checkDesktop)
    return () => window.removeEventListener('resize', checkDesktop)
  }, [])
  
  const selectedConversation = conversationId 
    ? conversations.find(c => c.id === conversationId)
    : null
  
  const conversationMessages = conversationId ? (messagesByConversation[conversationId] || []) : []
  
  const filteredConversations = conversations.filter(conv => {
    const label = conv.participantDetails?.[0]?.name ?? 'Conversation'
    return label.toLowerCase().includes(searchQuery.toLowerCase())
  })
  
  // Auto-select first conversation on desktop if none selected
  React.useEffect(() => {
    if (isDesktop && !conversationId && filteredConversations.length > 0) {
      navigate(`/messaging/${filteredConversations[0].id}`, { replace: true })
    }
  }, [isDesktop, conversationId, filteredConversations.length, navigate])

  const handleSendMessage = async () => {
    const trimmed = messageInput.trim()
    if (!trimmed || !conversationId || isSending) return

    setIsSending(true)
    try {
      const senderId = user?.id ?? 'guest'
      const fallbackRecipient = selectedConversation?.participants.find((participant) => participant !== senderId) ?? 'group'
      const message: Message = {
        id: createMessageId('msg'),
        conversationId,
        senderId,
        recipientId: fallbackRecipient,
        type: 'text',
        content: trimmed,
        status: 'sent',
        createdAt: new Date()
      }

      appendMessage(conversationId, message)
      setMessageInput('')
    } finally {
      setIsSending(false)
    }
  }

  const formatTime = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true })
  }

  const formatMessageTime = (date: Date) => {
    const now = new Date()
    const messageDate = new Date(date)
    const isToday = messageDate.toDateString() === now.toDateString()
    
    if (isToday) {
      return messageDate.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })
    }
    return messageDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!conversationId && !isDesktop) {
    // Mobile: Conversation list only
    return (
      <SharedLayout>
        <div className="min-h-screen bg-background flex flex-col">
        
        <div className="flex-1 flex flex-col">
          {/* Messages Header */}
          <header className="sticky top-20 z-10 bg-surface/95 backdrop-blur-sm border-b border-border">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-xl font-bold text-foreground flex-1">Messages</h1>
                <Button variant="ghost" size="icon" className="bg-icon-bg text-foreground hover:bg-primary/10 hover:text-primary transition-colors">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </div>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-surface border border-border shadow-sm text-foreground"
                />
              </div>
            </div>
          </header>

        {/* Conversation List */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 py-2">
            <AnimatePresence>
              {filteredConversations.map((conversation, index) => {
                const participant = conversation.participantDetails?.[0]
                const unreadCount = conversation.unreadCount[user?.id || ''] || 0
                const isUnread = unreadCount > 0
                
                return (
                  <motion.div
                    key={conversation.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => navigate(`/messaging/${conversation.id}`)}
                    className="flex items-center gap-3 p-4 rounded-xl bg-surface hover:bg-surface/95 cursor-pointer transition-colors mb-2"
                  >
                    <div className="relative">
                      <Avatar className="h-14 w-14">
                        <AvatarImage src={participant?.avatar} />
                        <AvatarFallback>{participant?.name?.[0] || 'U'}</AvatarFallback>
                      </Avatar>
                      {participant?.isOnline && (
                        <div className="absolute bottom-0 right-0 h-4 w-4 bg-primary rounded-full border-2 border-background" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={`font-semibold truncate ${isUnread ? 'text-foreground' : 'text-foreground/80'}`}>
                          {participant?.name || 'Unknown'}
                        </h3>
                        {conversation.lastMessage && (
                          <span className="text-xs text-muted-foreground ml-2">
                            {formatTime(conversation.lastMessage.createdAt)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <p className={`text-sm truncate ${isUnread ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                          {conversation.lastMessage?.content || 'No messages yet'}
                        </p>
                        {unreadCount > 0 && (
                          <Badge className="ml-2 bg-primary text-primary-foreground h-5 min-w-5 flex items-center justify-center">
                            {unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
            
            {filteredConversations.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">No conversations found</p>
              </div>
            )}
          </div>
        </main>
        </div>
        
        <AuthDialog open={isDrawerOpen} onOpenChange={setIsDrawerOpen} />
        </div>
      </SharedLayout>
    )
  }

  // Desktop Split View or Mobile Chat View
  return (
    <SharedLayout>
      <div className="min-h-screen bg-background flex flex-col">
      
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Conversation List - Always visible on desktop, hidden on mobile when chat is open */}
        <aside className={`${
          isDesktop || !conversationId 
            ? 'flex flex-col w-full lg:w-96 xl:w-[400px] border-r border-border bg-surface/50 backdrop-blur-sm' 
            : 'hidden'
        }`}>
          {/* Header */}
          <header className="sticky top-20 lg:top-20 z-10 bg-surface/95 backdrop-blur-sm border-b border-border p-4 lg:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold text-foreground">Messages</h1>
              <Button variant="ghost" size="icon" className="bg-icon-bg hover:bg-primary/10 hover:text-primary transition-colors">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-surface border border-border shadow-sm text-foreground"
            />
          </div>
        </header>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            <AnimatePresence>
              {filteredConversations.map((conversation, index) => {
                const participant = conversation.participantDetails?.[0]
                const unreadCount = conversation.unreadCount[user?.id || ''] || 0
                const isUnread = unreadCount > 0
                const isSelected = conversationId === conversation.id
                
                return (
                  <motion.div
                    key={conversation.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => navigate(`/messaging/${conversation.id}`)}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors mb-2 ${
                      isSelected
                        ? 'bg-primary/10 border border-primary/20'
                        : 'bg-surface hover:bg-surface/95'
                    }`}
                  >
                    <div className="relative">
                      <Avatar className="h-14 w-14">
                        <AvatarImage src={participant?.avatar} />
                        <AvatarFallback>{participant?.name?.[0] || 'U'}</AvatarFallback>
                      </Avatar>
                      {participant?.isOnline && (
                        <div className="absolute bottom-0 right-0 h-4 w-4 bg-primary rounded-full border-2 border-background" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={`font-semibold truncate ${isUnread ? 'text-foreground' : 'text-foreground/80'}`}>
                          {participant?.name || 'Unknown'}
                        </h3>
                        {conversation.lastMessage && (
                          <span className="text-xs text-muted-foreground ml-2">
                            {formatTime(conversation.lastMessage.createdAt)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <p className={`text-sm truncate ${isUnread ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                          {conversation.lastMessage?.content || 'No messages yet'}
                        </p>
                        {unreadCount > 0 && (
                          <Badge className="ml-2 bg-primary text-primary-foreground h-5 min-w-5 flex items-center justify-center">
                            {unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
            
            {filteredConversations.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">No conversations found</p>
              </div>
            )}
          </div>
        </div>
      </aside>

        {/* Chat View */}
        <div className="flex-1 flex flex-col min-w-0 bg-background">
          {/* Chat Header */}
          <header className="sticky top-20 lg:top-20 z-10 bg-surface/95 backdrop-blur-sm border-b border-border shadow-sm">
            <div className="px-4 lg:px-6 xl:px-8 py-4 lg:py-5">
              <div className="flex items-center gap-3">
                {!isDesktop && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(ROUTES.MESSAGING)}
                    className="bg-icon-bg text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                )}
              
              {selectedConversation?.participantDetails?.[0] && (
              <>
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedConversation.participantDetails[0].avatar} />
                    <AvatarFallback>
                      {selectedConversation.participantDetails[0].name[0]}
                    </AvatarFallback>
                  </Avatar>
                  {selectedConversation.participantDetails[0].isOnline && (
                    <div className="absolute bottom-0 right-0 h-3 w-3 bg-primary rounded-full border-2 border-background" />
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="font-semibold text-foreground">
                    {selectedConversation.participantDetails[0].name}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {selectedConversation.participantDetails[0].isOnline 
                      ? 'Online' 
                      : `Last seen ${formatTime(selectedConversation.participantDetails[0].lastSeen || new Date())}`
                    }
                  </p>
                </div>
              </>
            )}
            
            <Button variant="ghost" size="icon" className="bg-icon-bg text-foreground hover:bg-primary/10 hover:text-primary transition-colors">
              <MoreVertical className="h-5 w-5" />
            </Button>
            </div>
          </div>
        </header>

        {/* Messages */}
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="px-4 lg:px-8 xl:px-12 py-6 lg:py-8 space-y-4 max-w-4xl mx-auto">
          <AnimatePresence>
            {conversationMessages.map((message, index) => {
              const isOwnMessage = message.senderId === user?.id
              
              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-2 max-w-[80%] ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                    {!isOwnMessage && (
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarImage src={selectedConversation?.participantDetails?.[0]?.avatar} />
                        <AvatarFallback>
                          {selectedConversation?.participantDetails?.[0]?.name[0] || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className={`rounded-2xl px-4 py-2 ${
                      isOwnMessage 
                        ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                        : 'bg-surface text-foreground rounded-tl-sm'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                      <div className={`flex items-center gap-1 mt-1 ${
                        isOwnMessage ? 'justify-end' : 'justify-start'
                      }`}>
                        <span className="text-xs opacity-70">
                          {formatMessageTime(message.createdAt)}
                        </span>
                        {isOwnMessage && (
                          <span className="text-xs opacity-70">
                            {message.status === 'read' ? '✓✓' : message.status === 'delivered' ? '✓' : ''}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
            </AnimatePresence>
          </div>
        </main>

        {/* Message Input */}
        <footer className="sticky bottom-0 bg-surface/95 backdrop-blur-sm border-t border-border shadow-lg p-4 lg:p-6">
          <div className="max-w-4xl mx-auto">
          <div className="flex items-end gap-2">
            <Button variant="ghost" size="icon" className="bg-icon-bg text-foreground hover:bg-primary/10 hover:text-primary transition-colors shrink-0">
              <ImageIcon className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="bg-icon-bg text-foreground hover:bg-primary/10 hover:text-primary transition-colors shrink-0">
              <Paperclip className="h-5 w-5" />
            </Button>
            <div className="flex-1 relative">
              <Input
                placeholder="Type a message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="pr-10 bg-surface border border-border shadow-sm rounded-full text-foreground"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <Smile className="h-4 w-4" />
              </Button>
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!messageInput.trim() || isSending}
              size="icon"
              className="bg-primary text-primary-foreground rounded-full shrink-0 hover:bg-primary/90"
            >
              {isSending ? (
                <LogoLoader size="sm" variant="foreground" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
              </div>
            </div>
          </footer>
        </div>
        
        {/* Empty State for Desktop when no conversation selected */}
        {isDesktop && !conversationId && (
          <div className="flex-1 flex items-center justify-center bg-background/50">
            <div className="text-center max-w-md px-6">
              <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4 mx-auto">
                <MessageCircle className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Select a conversation</h3>
              <p className="text-muted-foreground">Choose a conversation from the list to start messaging</p>
            </div>
          </div>
        )}
      </div>
      
      <AuthDialog open={isDrawerOpen} onOpenChange={setIsDrawerOpen} />
      </div>
    </SharedLayout>
  )
}

