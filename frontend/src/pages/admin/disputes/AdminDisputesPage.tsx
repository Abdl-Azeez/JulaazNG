import { useState, useMemo } from 'react'
import { AdminLayout } from '@/widgets/admin-layout'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { Input } from '@/shared/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { Textarea } from '@/shared/ui/textarea'
import {
  MessageSquare,
  ArrowLeft,
  Search,
  Filter,
  MoreVertical,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  User,
  Building2,
  CreditCard,
  Eye,
  MessageCircle,
  Scale,
  FileText,
  ThumbsUp,
  ThumbsDown,
  Send,
  Download,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/shared/lib/utils/cn'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/shared/constants/routes'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/shared/ui/dropdown-menu'
import toast from 'react-hot-toast'
import { useMessagingStore } from '@/shared/store/messaging.store'
import { useAuthStore } from '@/shared/store/auth.store'
import type { Conversation, Message } from '@/shared/types/activity.types'
import { adminDisputes, type AdminDispute as Dispute } from '@/__mocks__/data/admin.mock'

const statusColors: Record<Dispute['status'], string> = {
  open: 'bg-blue-500/10 text-blue-600',
  investigating: 'bg-purple-500/10 text-purple-600',
  pending_response: 'bg-amber-500/10 text-amber-600',
  resolved: 'bg-emerald-500/10 text-emerald-600',
  closed: 'bg-gray-500/10 text-gray-600',
}

const statusIcons: Record<Dispute['status'], React.ReactNode> = {
  open: <AlertTriangle className="h-3 w-3" />,
  investigating: <Search className="h-3 w-3" />,
  pending_response: <Clock className="h-3 w-3" />,
  resolved: <CheckCircle className="h-3 w-3" />,
  closed: <XCircle className="h-3 w-3" />,
}

const priorityColors: Record<Dispute['priority'], string> = {
  low: 'bg-gray-500/10 text-gray-600',
  medium: 'bg-amber-500/10 text-amber-600',
  high: 'bg-orange-500/10 text-orange-600',
  critical: 'bg-red-500/10 text-red-600',
}

const typeIcons: Record<Dispute['type'], React.ReactNode> = {
  property: <Building2 className="h-4 w-4 text-blue-600" />,
  service: <Scale className="h-4 w-4 text-purple-600" />,
  payment: <CreditCard className="h-4 w-4 text-emerald-600" />,
  behavior: <User className="h-4 w-4 text-amber-600" />,
}

const ITEMS_PER_PAGE = 10

export function AdminDisputesPage() {
  const navigate = useNavigate()
  const { user: currentUser } = useAuthStore()
  const conversations = useMessagingStore((state) => state.conversations)
  const messagesByConversation = useMessagingStore((state) => state.messages)
  const addConversation = useMessagingStore((state) => state.addConversation)
  const addMessage = useMessagingStore((state) => state.addMessage)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<Dispute['status'] | 'all'>('all')
  const [priorityFilter, setPriorityFilter] = useState<Dispute['priority'] | 'all'>('all')
  const [disputes, setDisputes] = useState<Dispute[]>(adminDisputes)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null)
  const [isCaseDialogOpen, setIsCaseDialogOpen] = useState(false)
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false)
  const [isDocumentsDialogOpen, setIsDocumentsDialogOpen] = useState(false)
  const [messageText, setMessageText] = useState('')
  const [messageRecipients, setMessageRecipients] = useState<'both' | 'complainant' | 'respondent'>('both')

  const filteredDisputes = useMemo(() => {
    return disputes.filter((dispute) => {
      const matchesSearch =
        dispute.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dispute.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dispute.complainant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dispute.respondent.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === 'all' || dispute.status === statusFilter
      const matchesPriority = priorityFilter === 'all' || dispute.priority === priorityFilter
      return matchesSearch && matchesStatus && matchesPriority
    })
  }, [disputes, searchQuery, statusFilter, priorityFilter])

  const totalPages = Math.ceil(filteredDisputes.length / ITEMS_PER_PAGE)
  const paginatedDisputes = filteredDisputes.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1)
  }, [searchQuery, statusFilter, priorityFilter])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleViewCase = (dispute: Dispute) => {
    setSelectedDispute(dispute)
    setIsCaseDialogOpen(true)
  }

  const handleSendMessage = (dispute: Dispute) => {
    setSelectedDispute(dispute)
    setMessageText('')
    setMessageRecipients('both')
    setIsMessageDialogOpen(true)
  }

  const generateId = (prefix: string) => {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return `${prefix}_${crypto.randomUUID()}`
    }
    return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`
  }

  const handleSubmitMessage = () => {
    if (!selectedDispute || !messageText.trim() || !currentUser) return

    const adminId = currentUser.id || 'admin'
    const now = new Date()
    const messageContent = messageText.trim()

    // Generate user IDs from names (in real app, these would come from the dispute data)
    const complainantId = `user-${selectedDispute.complainant.name.toLowerCase().replace(/\s+/g, '-')}`
    const respondentId = `user-${selectedDispute.respondent.name.toLowerCase().replace(/\s+/g, '-')}`

    let conversationId: string | null = null

    if (messageRecipients === 'both') {
      // Create or use existing group chat for the dispute
      const disputeGroupId = selectedDispute.conversationId || `dispute-${selectedDispute.id}`
      
      // Check if group conversation already exists
      const existingGroupConversation = conversations.find(
        (conv) =>
          conv.id === disputeGroupId ||
          (conv.type === 'group' &&
            conv.participants.includes(adminId) &&
            conv.participants.includes(complainantId) &&
            conv.participants.includes(respondentId) &&
            conv.context?.ticketId === selectedDispute.id)
      )

      if (existingGroupConversation) {
        conversationId = existingGroupConversation.id
      } else {
        conversationId = disputeGroupId

        const conversation: Conversation = {
          id: conversationId,
          participants: [adminId, complainantId, respondentId],
          type: 'group',
          context: {
            ticketId: selectedDispute.id,
          },
          status: 'active',
          createdAt: now,
          updatedAt: now,
          unreadCount: {
            [adminId]: 0,
            [complainantId]: 0,
            [respondentId]: 0,
          },
          participantDetails: [
            {
              id: conversationId,
              name: `Admin - ${selectedDispute.reference}`,
              avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(selectedDispute.reference)}`,
            },
            {
              id: complainantId,
              name: selectedDispute.complainant.name,
              avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(selectedDispute.complainant.name)}`,
              isOnline: false,
              lastSeen: new Date(),
            },
            {
              id: respondentId,
              name: selectedDispute.respondent.name,
              avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(selectedDispute.respondent.name)}`,
              isOnline: false,
              lastSeen: new Date(),
            },
            {
              id: adminId,
              name: currentUser.name || currentUser.email || 'Admin',
              avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser.name || currentUser.email || 'Admin')}`,
              isOnline: true,
              lastSeen: now,
            },
          ],
        }

        addConversation(conversation, [])
        
        // Store conversation ID in dispute
        setDisputes((prev) =>
          prev.map((d) => (d.id === selectedDispute.id ? { ...d, conversationId: conversationId || undefined } : d))
        )
      }

      // Create and add the message to group chat
      const message: Message = {
        id: generateId('msg'),
        conversationId,
        senderId: adminId,
        recipientId: 'group',
        type: 'text',
        content: messageContent,
        status: 'sent',
        createdAt: now,
      }

      addMessage(conversationId, message)
    } else {
      // Create direct conversations for single recipient
      const recipient = messageRecipients === 'complainant'
        ? { id: complainantId, name: selectedDispute.complainant.name }
        : { id: respondentId, name: selectedDispute.respondent.name }

      // Check if conversation already exists
      const existingConversation = conversations.find((conv) => {
        const participants = conv.participants
        return (
          participants.includes(adminId) &&
          participants.includes(recipient.id) &&
          conv.type === 'direct' &&
          participants.length === 2
        )
      })

      if (existingConversation) {
        conversationId = existingConversation.id
        // Update existing conversation's participant details
        const updatedParticipantDetails = existingConversation.participantDetails?.map((p) => {
          if (p.id === recipient.id) {
            return { ...p, name: `Admin - ${recipient.name}` }
          }
          return p
        })
        const existingMessages = messagesByConversation[conversationId] || []
        const updatedConversation: Conversation = {
          ...existingConversation,
          participantDetails: updatedParticipantDetails,
        }
        addConversation(updatedConversation, existingMessages)
      } else {
        conversationId = generateId('conv')

        const conversation: Conversation = {
          id: conversationId,
          participants: [adminId, recipient.id],
          type: 'direct',
          status: 'active',
          createdAt: now,
          updatedAt: now,
          unreadCount: {
            [adminId]: 0,
            [recipient.id]: 0,
          },
          participantDetails: [
            {
              id: recipient.id,
              name: `Admin - ${recipient.name}`,
              avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(recipient.name)}`,
              isOnline: false,
              lastSeen: new Date(),
            },
            {
              id: adminId,
              name: currentUser.name || currentUser.email || 'Admin',
              avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser.name || currentUser.email || 'Admin')}`,
              isOnline: true,
              lastSeen: now,
            },
          ],
        }

        addConversation(conversation, [])
      }

      // Create and add the message
      const message: Message = {
        id: generateId('msg'),
        conversationId,
        senderId: adminId,
        recipientId: recipient.id,
        type: 'text',
        content: messageContent,
        status: 'sent',
        createdAt: now,
      }

      addMessage(conversationId, message)
    }

    toast.success(
      messageRecipients === 'both'
        ? 'Message sent to both parties in group chat'
        : `Message sent to ${messageRecipients === 'complainant' ? selectedDispute.complainant.name : selectedDispute.respondent.name}`
    )
    setMessageText('')
    setIsMessageDialogOpen(false)

    // Navigate to the messaging page with the conversation
    if (conversationId) {
      navigate(ROUTES.MESSAGING_CHAT(conversationId))
    }

    // Update message count
    setDisputes((prev) =>
      prev.map((d) => (d.id === selectedDispute.id ? { ...d, messages: d.messages + 1 } : d))
    )
  }

  const handleViewChatHistory = (dispute: Dispute) => {
    if (dispute.conversationId) {
      navigate(ROUTES.MESSAGING_CHAT(dispute.conversationId))
    } else {
      // If no conversation exists yet, prompt to send a message
      toast('No chat history yet. Send a message to start the conversation.', {
        icon: '💬',
      })
    }
  }

  const handleViewDocuments = (dispute: Dispute) => {
    setSelectedDispute(dispute)
    setIsDocumentsDialogOpen(true)
  }

  const handleResolveInFavorOf = (disputeId: string, favor: 'complainant' | 'respondent') => {
    setDisputes((prev) =>
      prev.map((d) => (d.id === disputeId ? { ...d, status: 'resolved' as const } : d))
    )
    toast.success(`Dispute resolved in favor of ${favor === 'complainant' ? 'complainant' : 'respondent'}`)
  }

  const handleCloseWithoutResolution = (disputeId: string) => {
    setDisputes((prev) =>
      prev.map((d) => (d.id === disputeId ? { ...d, status: 'closed' as const } : d))
    )
    toast.success('Dispute closed without resolution')
  }

  const openDisputes = disputes.filter((d) => d.status === 'open' || d.status === 'investigating').length
  const criticalDisputes = disputes.filter(
    (d) => d.priority === 'critical' && d.status !== 'resolved' && d.status !== 'closed'
  ).length

  return (
    <AdminLayout>
      <main className="flex-1">
        {/* Header Section */}
        <section className="border-b border-border/60 bg-gradient-to-br from-red-500/5 via-background to-background">
          <div className="container mx-auto max-w-7xl px-4 lg:px-6 xl:px-8 py-6 lg:py-8">
            <Button
              variant="ghost"
              className="mb-4 -ml-2 text-muted-foreground hover:text-foreground"
              onClick={() => navigate(ROUTES.ADMIN_DASHBOARD)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-red-500/10 text-red-600 flex items-center justify-center">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Dispute Resolution Center</h1>
                    <p className="text-sm text-muted-foreground">
                      {filteredDisputes.length} disputes • Manage and resolve platform disputes
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                {criticalDisputes > 0 && (
                  <Badge className="rounded-full bg-red-500/10 text-red-600 px-3 py-1.5 animate-pulse">
                    <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />
                    {criticalDisputes} Critical
                  </Badge>
                )}
                <Badge className="rounded-full bg-blue-500/10 text-blue-600 px-3 py-1.5">
                  {openDisputes} Open Disputes
                </Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Cards */}
        <section className="container mx-auto max-w-7xl px-4 lg:px-6 xl:px-8 py-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <Card className="p-5 rounded-2xl border border-border/60 bg-gradient-to-br from-blue-500/5 to-background">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-foreground">{disputes.filter((d) => d.status === 'open').length}</p>
                  <p className="text-xs text-muted-foreground mt-1">Open</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6" />
                </div>
              </div>
            </Card>
            <Card className="p-5 rounded-2xl border border-border/60 bg-gradient-to-br from-purple-500/5 to-background">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-foreground">
                    {disputes.filter((d) => d.status === 'investigating').length}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Investigating</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
                  <Search className="h-6 w-6" />
                </div>
              </div>
            </Card>
            <Card className="p-5 rounded-2xl border border-border/60 bg-gradient-to-br from-amber-500/5 to-background">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-foreground">
                    {disputes.filter((d) => d.status === 'pending_response').length}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Awaiting Response</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <Clock className="h-6 w-6" />
                </div>
              </div>
            </Card>
            <Card className="p-5 rounded-2xl border border-border/60 bg-gradient-to-br from-emerald-500/5 to-background">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-foreground">
                    {disputes.filter((d) => d.status === 'resolved').length}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Resolved</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6" />
                </div>
              </div>
            </Card>
            <Card className="p-5 rounded-2xl border border-border/60 bg-gradient-to-br from-red-500/5 to-background">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-foreground">{criticalDisputes}</p>
                  <p className="text-xs text-muted-foreground mt-1">Critical Priority</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-red-500/10 text-red-600 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6" />
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Filters */}
        <section className="container mx-auto max-w-7xl px-4 lg:px-6 xl:px-8 pb-4">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by reference, subject, or parties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-xl h-10"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="rounded-xl h-10">
                  <Filter className="h-4 w-4 mr-2" />
                  Status: {statusFilter === 'all' ? 'All' : statusFilter.replace('_', ' ')}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setStatusFilter('all')}>All Status</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setStatusFilter('open')}>Open</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('investigating')}>Investigating</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('pending_response')}>Pending Response</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('resolved')}>Resolved</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('closed')}>Closed</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="rounded-xl h-10">
                  <Filter className="h-4 w-4 mr-2" />
                  Priority: {priorityFilter === 'all' ? 'All' : priorityFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setPriorityFilter('all')}>All Priorities</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setPriorityFilter('critical')}>Critical</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPriorityFilter('high')}>High</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPriorityFilter('medium')}>Medium</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPriorityFilter('low')}>Low</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </section>

        {/* Disputes List */}
        <section className="container mx-auto max-w-7xl px-4 lg:px-6 xl:px-8 pb-6 lg:pb-10">
          <div className="space-y-4">
            {paginatedDisputes.map((dispute) => (
              <Card
                key={dispute.id}
                className="rounded-2xl border border-border/60 bg-background/80 shadow-sm p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  {/* Left: Icon & Main Info */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center shrink-0">
                      {typeIcons[dispute.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="font-mono text-sm text-muted-foreground">{dispute.reference}</span>
                        <Badge
                          className={cn('rounded-full capitalize flex items-center gap-1', statusColors[dispute.status])}
                        >
                          {statusIcons[dispute.status]}
                          {dispute.status.replace('_', ' ')}
                        </Badge>
                        <Badge className={cn('rounded-full capitalize', priorityColors[dispute.priority])}>
                          {dispute.priority}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">{dispute.subject}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{dispute.description}</p>

                      <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {dispute.complainant.name} ({dispute.complainant.role})
                        </span>
                        <span>vs</span>
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {dispute.respondent.name} ({dispute.respondent.role})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Meta & Actions */}
                  <div className="flex flex-col items-end gap-3 shrink-0">
                    <div className="text-right">
                      {dispute.amount && (
                        <p className="text-lg font-bold text-foreground">{formatPrice(dispute.amount)}</p>
                      )}
                      <p className="text-xs text-muted-foreground">Updated {dispute.lastUpdated}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewChatHistory(dispute)}
                        className={cn(
                          'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-colors',
                          dispute.conversationId
                            ? 'bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 cursor-pointer'
                            : 'bg-muted text-muted-foreground cursor-pointer hover:bg-muted/80'
                        )}
                      >
                        <MessageCircle className="h-3 w-3" />
                        {dispute.messages} messages
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-lg"
                        onClick={() => handleViewCase(dispute)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Case
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="ghost" className="px-2">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleSendMessage(dispute)}>
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Send Message
                          </DropdownMenuItem>
                          {dispute.documents && dispute.documents.length > 0 && (
                            <DropdownMenuItem onClick={() => handleViewDocuments(dispute)}>
                              <FileText className="h-4 w-4 mr-2" />
                              View Documents ({dispute.documents.length})
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          {dispute.status !== 'resolved' && dispute.status !== 'closed' && (
                            <>
                              <DropdownMenuItem
                                className="text-emerald-600"
                                onClick={() => handleResolveInFavorOf(dispute.id, 'complainant')}
                              >
                                <ThumbsUp className="h-4 w-4 mr-2" />
                                Resolve in favor of complainant
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-amber-600"
                                onClick={() => handleResolveInFavorOf(dispute.id, 'respondent')}
                              >
                                <ThumbsDown className="h-4 w-4 mr-2" />
                                Resolve in favor of respondent
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-gray-600"
                                onClick={() => handleCloseWithoutResolution(dispute.id)}
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Close without resolution
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredDisputes.length === 0 && (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No disputes found matching your criteria</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/60">
              <p className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredDisputes.length)} of {filteredDisputes.length} disputes
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 rounded-lg"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum: number
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? 'default' : 'outline'}
                      size="icon"
                      className="h-9 w-9 rounded-lg"
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  )
                })}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 rounded-lg"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* View Case Dialog */}
      <Dialog open={isCaseDialogOpen} onOpenChange={setIsCaseDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedDispute && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  {typeIcons[selectedDispute.type]}
                  {selectedDispute.subject}
                </DialogTitle>
                <DialogDescription>{selectedDispute.reference}</DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                <div className="flex flex-wrap gap-2">
                  <Badge className={cn('rounded-full capitalize', statusColors[selectedDispute.status])}>
                    {statusIcons[selectedDispute.status]}
                    {selectedDispute.status.replace('_', ' ')}
                  </Badge>
                  <Badge className={cn('rounded-full capitalize', priorityColors[selectedDispute.priority])}>
                    {selectedDispute.priority} priority
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4 rounded-xl border border-border/60">
                    <p className="text-xs text-muted-foreground mb-1">Complainant</p>
                    <p className="font-semibold text-foreground">{selectedDispute.complainant.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{selectedDispute.complainant.role.replace('_', ' ')}</p>
                  </Card>
                  <Card className="p-4 rounded-xl border border-border/60">
                    <p className="text-xs text-muted-foreground mb-1">Respondent</p>
                    <p className="font-semibold text-foreground">{selectedDispute.respondent.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{selectedDispute.respondent.role.replace('_', ' ')}</p>
                  </Card>
                </div>

                {selectedDispute.amount && (
                  <Card className="p-4 rounded-xl border border-border/60">
                    <p className="text-xs text-muted-foreground mb-1">Disputed Amount</p>
                    <p className="text-2xl font-bold text-primary">{formatPrice(selectedDispute.amount)}</p>
                  </Card>
                )}

                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{selectedDispute.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Created:</p>
                    <p className="text-foreground">{selectedDispute.createdAt}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Last Updated:</p>
                    <p className="text-foreground">{selectedDispute.lastUpdated}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Messages:</p>
                    <p className="text-foreground">{selectedDispute.messages}</p>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCaseDialogOpen(false)}>
                  Close
                </Button>
                <Button onClick={() => {
                  setIsCaseDialogOpen(false)
                  handleSendMessage(selectedDispute)
                }}>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Send Message Dialog */}
      <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
        <DialogContent className="max-w-2xl">
          {selectedDispute && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <MessageCircle className="h-6 w-6 text-blue-600" />
                  Send Message
                </DialogTitle>
                <DialogDescription>
                  Send a message regarding dispute {selectedDispute.reference}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                <div>
                  <p className="text-sm font-medium text-foreground mb-3">Send to:</p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant={messageRecipients === 'both' ? 'default' : 'outline'}
                      size="sm"
                      className="rounded-lg"
                      onClick={() => setMessageRecipients('both')}
                    >
                      Both Parties
                    </Button>
                    <Button
                      type="button"
                      variant={messageRecipients === 'complainant' ? 'default' : 'outline'}
                      size="sm"
                      className="rounded-lg"
                      onClick={() => setMessageRecipients('complainant')}
                    >
                      {selectedDispute.complainant.name} (Complainant)
                    </Button>
                    <Button
                      type="button"
                      variant={messageRecipients === 'respondent' ? 'default' : 'outline'}
                      size="sm"
                      className="rounded-lg"
                      onClick={() => setMessageRecipients('respondent')}
                    >
                      {selectedDispute.respondent.name} (Respondent)
                    </Button>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Message</p>
                  <Textarea
                    placeholder="Type your message here..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="min-h-[120px] rounded-xl"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsMessageDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmitMessage} disabled={!messageText.trim()}>
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* View Documents Dialog */}
      <Dialog open={isDocumentsDialogOpen} onOpenChange={setIsDocumentsDialogOpen}>
        <DialogContent className="max-w-2xl">
          {selectedDispute && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-purple-600" />
                  Documents
                </DialogTitle>
                <DialogDescription>
                  Documents related to dispute {selectedDispute.reference}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3 mt-4">
                {selectedDispute.documents && selectedDispute.documents.length > 0 ? (
                  selectedDispute.documents.map((doc, idx) => (
                    <Card key={idx} className="p-4 rounded-xl border border-border/60">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="h-10 w-10 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-foreground break-words">{doc}</p>
                            <p className="text-xs text-muted-foreground whitespace-nowrap">Document {idx + 1}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-1.5 shrink-0">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-9 w-9 p-0 text-blue-600 border-blue-600/30 hover:bg-blue-500/20 hover:text-blue-700 dark:hover:text-blue-400 hover:border-blue-600/50"
                            onClick={() => {
                              toast.success(`Opening ${doc} in viewer...`)
                            }}
                            title="View Document"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-9 w-9 p-0 text-muted-foreground border-border hover:bg-muted hover:text-foreground hover:border-border/80"
                            onClick={() => {
                              toast.success(`Downloading ${doc}...`)
                            }}
                            title="Download"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-9 w-9 p-0 text-emerald-600 border-emerald-600/30 hover:bg-emerald-500/20 hover:text-emerald-700 dark:hover:text-emerald-400 hover:border-emerald-600/50"
                            onClick={() => {
                              toast.success(`Approving ${doc}...`)
                            }}
                            title="Approve"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-9 w-9 p-0 text-red-600 border-red-600/30 hover:bg-red-500/20 hover:text-red-700 dark:hover:text-red-400 hover:border-red-600/50"
                            onClick={() => {
                              toast.success(`Rejecting ${doc}...`)
                            }}
                            title="Reject"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground">No documents available for this dispute</p>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button onClick={() => setIsDocumentsDialogOpen(false)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}
