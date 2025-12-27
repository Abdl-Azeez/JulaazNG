import { useEffect, useState } from 'react'
import { Header } from '@/widgets/header'
import { Sidebar } from '@/widgets/sidebar'
import { Footer } from '@/widgets/footer'
import { ReportButton } from '@/widgets/report-button'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { Label } from '@/shared/ui/label'
import { Textarea } from '@/shared/ui/textarea'
import { Input } from '@/shared/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'
import {
  Eye,
  MapPin,
  Calendar,
  ArrowLeft,
  CheckCircle2,
  Clock,
  MessageCircle,
  User,
  Users,
  TrendingUp,
  ArrowRight,
  Send,
  Search,
  X,
} from 'lucide-react'
import { cn } from '@/shared/lib/utils/cn'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/shared/constants/routes'
import { sampleViewings, type PropertyViewing } from '@/__mocks__/data/homerunner.mock'
import { useMessagingStore } from '@/shared/store/messaging.store'
import { useAuthStore } from '@/shared/store/auth.store'
import toast from 'react-hot-toast'

type FilterStatus = 'all' | 'scheduled' | 'confirmed' | 'completed'

export function HomerunnerViewingsPage() {
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [viewings, setViewings] = useState(() =>
    sampleViewings.map((viewing) => ({ ...viewing }))
  )
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedViewing, setSelectedViewing] = useState<PropertyViewing | null>(null)
  const [statusForm, setStatusForm] = useState<{ status: PropertyViewing['status']; comments: string }>(
    { status: 'scheduled', comments: '' }
  )
  const [messageViewing, setMessageViewing] = useState<PropertyViewing | null>(null)
  const [messageBody, setMessageBody] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const ITEMS_PER_PAGE = 3

  const statusOptions: PropertyViewing['status'][] = [
    'scheduled',
    'confirmed',
    'in_progress',
    'completed',
    'rented',
    'no_show',
    'cancelled',
  ]

  const statusLabels: Record<PropertyViewing['status'], string> = {
    scheduled: 'Scheduled',
    confirmed: 'Confirmed',
    in_progress: 'In progress',
    completed: 'Viewed / completed',
    rented: 'Rented / tenant signed',
    no_show: 'No show',
    cancelled: 'Cancelled',
  }

  const filteredViewings = viewings.filter((viewing) => {
    // Status filter
    const matchesStatus = filterStatus === 'all' || viewing.status === filterStatus
    
    // Search filter
    const matchesSearch = !searchTerm.trim() || 
      viewing.propertyTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      viewing.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      viewing.landlordName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      viewing.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      viewing.tenantPhone.includes(searchTerm)
    
    return matchesStatus && matchesSearch
  })

  const statusCounts = {
    all: viewings.length,
    scheduled: viewings.filter((v) => v.status === 'scheduled').length,
    confirmed: viewings.filter((v) => v.status === 'confirmed').length,
    completed: viewings.filter((v) => v.status === 'completed').length,
  }

  const totalPotentialCommission = viewings.reduce(
    (sum, v) => sum + v.commissionPotential,
    0
  )

  const totalPages = Math.max(1, Math.ceil(filteredViewings.length / ITEMS_PER_PAGE))
  const paginatedViewings = filteredViewings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  useEffect(() => {
    setCurrentPage((prev) => Math.min(prev, totalPages))
  }, [totalPages])

  const handleFilterChange = (status: FilterStatus) => {
    setFilterStatus(status)
    setCurrentPage(1)
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const clearSearch = () => {
    setSearchTerm('')
    setCurrentPage(1)
  }

  const openStatusDialog = (viewing: PropertyViewing) => {
    setSelectedViewing(viewing)
    setStatusForm({ status: viewing.status, comments: viewing.notes || '' })
  }

  const handleStatusSubmit = () => {
    if (!selectedViewing) return
    setViewings((prev) =>
      prev.map((viewing) =>
        viewing.id === selectedViewing.id
          ? { ...viewing, status: statusForm.status, notes: statusForm.comments }
          : viewing
      )
    )
    toast.success('Viewing status updated successfully.')
    setSelectedViewing(null)
    setStatusForm({ status: 'scheduled', comments: '' })
  }

  const handleQuickConfirm = (viewingId: string) => {
    setViewings((prev) =>
      prev.map((viewing) =>
        viewing.id === viewingId ? { ...viewing, status: 'confirmed' } : viewing
      )
    )
    toast.success('Viewing confirmed. Tenant has been notified!')
  }

  const openMessageDialog = (viewing: PropertyViewing) => {
    setMessageViewing(viewing)
    setMessageBody('Hello! Just a quick reminder that I am en route for our viewing. See you soon.')
  }

  const conversations = useMessagingStore((state) => state.conversations)
  const addConversation = useMessagingStore((state) => state.addConversation)
  const addMessage = useMessagingStore((state) => state.addMessage)
  const { user } = useAuthStore()

  const handleSendMessage = () => {
    if (!messageViewing || !user) return

    // Find existing conversation by propertyId (created when tenant requested viewing)
    // The conversation context should have the propertyId
    let existingConversation = conversations.find(
      (conv) =>
        conv.context?.propertyId === messageViewing.propertyId &&
        conv.type === 'group' &&
        conv.participants.includes('julaaz-admin')
    )

    // If conversation exists but homerunner is not a participant, add them
    if (existingConversation && !existingConversation.participants.includes(user.id)) {
      const updatedConversation = {
        ...existingConversation,
        participants: [...existingConversation.participants, user.id],
        participantDetails: [
          ...(existingConversation.participantDetails || []),
          {
            id: user.id,
            name: user.name || 'Homerunner',
            avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name || 'Homerunner')}`,
          },
        ],
      }
      addConversation(updatedConversation, [])
      existingConversation = updatedConversation
    }

    const conversationId = existingConversation?.id || `viewing-${messageViewing.propertyId}-${Date.now()}`

    if (existingConversation) {
      // Add message to existing conversation
      const message = {
        id: `msg-${Date.now()}`,
        conversationId,
        senderId: user.id,
        recipientId: 'group',
        type: 'text' as const,
        content: messageBody,
        status: 'sent' as const,
        createdAt: new Date(),
      }
      addMessage(conversationId, message)
      toast.success(`Message sent to ${messageViewing.tenantName}.`)
      navigate(ROUTES.MESSAGING_CHAT(conversationId))
    } else {
      // Create new group conversation with tenant, landlord, admin, and homerunner
      const conversation = {
        id: conversationId,
        participants: [
          `tenant-${messageViewing.propertyId}`,
          `landlord-${messageViewing.propertyId}`,
          'julaaz-admin',
          user.id,
        ],
        type: 'group' as const,
        context: {
          propertyId: messageViewing.propertyId,
          bookingId: `viewing-${messageViewing.id}`,
        },
        status: 'active' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastMessage: {
          id: `msg-${Date.now()}`,
          conversationId,
          senderId: user.id,
          recipientId: 'group',
          type: 'text' as const,
          content: messageBody,
          status: 'sent' as const,
          createdAt: new Date(),
        },
        unreadCount: {},
        participantDetails: [
          {
            id: conversationId,
            name: `${messageViewing.propertyTitle} Viewing`,
            avatar: messageViewing.propertyImage,
          },
          {
            id: `landlord-${messageViewing.propertyId}`,
            name: messageViewing.landlordName,
            avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(messageViewing.landlordName)}`,
          },
          {
            id: 'julaaz-admin',
            name: 'Julaaz Support',
            avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Julaaz%20Support',
          },
          {
            id: user.id,
            name: user.name || 'Homerunner',
            avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name || 'Homerunner')}`,
          },
          {
            id: `tenant-${messageViewing.propertyId}`,
            name: messageViewing.tenantName,
            avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(messageViewing.tenantName)}`,
          },
        ],
      }

      const initialMessage = {
        id: `msg-${Date.now()}`,
        conversationId,
        senderId: user.id,
        recipientId: 'group',
        type: 'text' as const,
        content: messageBody,
        status: 'sent' as const,
        createdAt: new Date(),
      }

      addConversation(conversation, [initialMessage])
      toast.success(`Message sent to ${messageViewing.tenantName}.`)
      navigate(ROUTES.MESSAGING_CHAT(conversationId))
    }

    setMessageViewing(null)
    setMessageBody('')
  }

  const getStatusBadge = (status: PropertyViewing['status']) => {
    const styles = {
      scheduled: 'bg-blue-500/10 text-blue-600',
      confirmed: 'bg-emerald-500/10 text-emerald-600',
      in_progress: 'bg-amber-500/10 text-amber-600',
      completed: 'bg-primary/10 text-primary',
      no_show: 'bg-red-500/10 text-red-600',
      cancelled: 'bg-muted text-muted-foreground',
      rented: 'bg-emerald-600/10 text-emerald-700',
    }
    const labels = {
      scheduled: 'Scheduled',
      confirmed: 'Confirmed',
      in_progress: 'In Progress',
      completed: 'Completed',
      no_show: 'No Show',
      cancelled: 'Cancelled',
      rented: 'Rented',
    }
    return (
      <Badge className={cn('rounded-full px-3 py-1 text-xs font-medium', styles[status])}>
        {labels[status]}
      </Badge>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        onMenuClick={() => setIsSidebarOpen(true)}
        onProfileClick={() => navigate(ROUTES.PROFILE)}
        className="lg:shadow-sm"
      />

      <main className="flex-1">
        {/* Header Section */}
        <section className="border-b border-border/60 bg-gradient-to-br from-purple-500/5 via-background to-background">
          <div className="container mx-auto max-w-6xl px-4 lg:px-6 xl:px-8 py-8 lg:py-10">
            <Button
              variant="ghost"
              className="mb-4 -ml-2 text-muted-foreground hover:text-foreground"
              onClick={() => navigate(ROUTES.HOMERUNNER_DASHBOARD)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
                    <Eye className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                      Property Viewings
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      Take potential tenants to view properties and earn commissions
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="px-4 py-2 rounded-xl bg-purple-500/10 text-purple-600 text-sm">
                  <TrendingUp className="h-4 w-4 inline mr-2" />
                  ₦{totalPotentialCommission.toLocaleString()} potential commission
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="container mx-auto max-w-6xl px-4 lg:px-6 xl:px-8 py-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by property, tenant, landlord, location, or phone..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 pr-10 rounded-xl h-11"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Status Filters */}
            <div className="flex flex-wrap gap-2">
              {(['all', 'scheduled', 'confirmed', 'completed'] as FilterStatus[]).map((status) => (
                <button
                  key={status}
                  onClick={() => handleFilterChange(status)}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-medium transition-all',
                    filterStatus === status
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:text-foreground'
                  )}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)} ({statusCounts[status]})
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Viewings List */}
        <section className="container mx-auto max-w-6xl px-4 lg:px-6 xl:px-8 pb-8 lg:pb-12">
          <div className="space-y-4">
            {paginatedViewings.map((viewing) => (
              <Card
                key={viewing.id}
                className="rounded-2xl border border-border/60 bg-background/80 shadow-sm overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    {/* Property Image */}
                    <div className="w-full lg:w-48 h-32 rounded-xl bg-muted flex items-center justify-center overflow-hidden">
                      <img
                        src={viewing.propertyImage}
                        alt={viewing.propertyTitle}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                          e.currentTarget.parentElement!.innerHTML = `<div class="flex flex-col items-center justify-center text-muted-foreground"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg><span class="text-xs mt-2">No image</span></div>`
                        }}
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        {getStatusBadge(viewing.status)}
                        <span className="text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3 inline mr-1" />
                          {viewing.scheduledFor}
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold text-foreground">
                        {viewing.propertyTitle}
                      </h3>

                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-primary" />
                          {viewing.location}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 p-3 bg-muted/50 rounded-xl">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-xs text-muted-foreground">Tenant</p>
                            <ReportButton
                              reportedEntity={{
                                id: viewing.propertyId + '-tenant',
                                name: viewing.tenantName,
                                type: 'user',
                                role: 'tenant',
                              }}
                              reportType="tenant"
                              relatedTo={{
                                type: 'property',
                                id: viewing.propertyId,
                                title: viewing.propertyTitle,
                              }}
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs text-amber-600 hover:bg-amber-500/15 hover:text-amber-700 dark:hover:bg-amber-950/30 dark:hover:text-amber-500"
                            />
                          </div>
                          <p className="text-sm font-medium flex items-center gap-2">
                            <User className="h-4 w-4 text-purple-600" />
                            {viewing.tenantName}
                          </p>
                          <p className="text-xs text-muted-foreground">{viewing.tenantPhone}</p>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-xs text-muted-foreground">Landlord</p>
                            <ReportButton
                              reportedEntity={{
                                id: viewing.propertyId + '-landlord',
                                name: viewing.landlordName,
                                type: 'user',
                                role: 'landlord',
                              }}
                              reportType="landlord"
                              relatedTo={{
                                type: 'property',
                                id: viewing.propertyId,
                                title: viewing.propertyTitle,
                              }}
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs text-amber-600 hover:bg-amber-500/15 hover:text-amber-700 dark:hover:bg-amber-950/30 dark:hover:text-amber-500"
                            />
                          </div>
                          <p className="text-sm font-medium flex items-center gap-2">
                            <Users className="h-4 w-4 text-blue-600" />
                            {viewing.landlordName}
                          </p>
                        </div>
                      </div>

                      {viewing.notes && (
                        <p className="text-sm text-muted-foreground italic">
                          📝 {viewing.notes}
                        </p>
                      )}
                    </div>

                    {/* Actions & Earnings */}
                    <div className="flex flex-col items-end gap-3 min-w-[160px]">
                      <div className="text-right space-y-1">
                        <div>
                          <p className="text-xs text-muted-foreground">Viewing fee</p>
                          <p className="text-lg font-bold text-foreground">
                            ₦{viewing.earnAmount.toLocaleString()}
                          </p>
                        </div>
                        <div className="border-t border-border/60 pt-1">
                          <p className="text-xs text-muted-foreground">If tenant signs</p>
                          <p className="text-lg font-bold text-emerald-600">
                            +₦{viewing.commissionPotential.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 w-full">
                        {viewing.status === 'scheduled' && (
                          <Button
                            className="rounded-xl w-full bg-emerald-600 hover:bg-emerald-700"
                            onClick={() => handleQuickConfirm(viewing.id)}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Confirm
                          </Button>
                        )}
                        {viewing.status !== 'cancelled' && (
                          <Button
                            className="rounded-xl w-full"
                            onClick={() => openStatusDialog(viewing)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            {viewing.status === 'confirmed'
                              ? 'Update progress'
                              : viewing.status === 'in_progress'
                              ? 'Update progress'
                              : 'Update status'}
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          className="rounded-xl w-full"
                          onClick={() => openMessageDialog(viewing)}
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Message Tenant
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {filteredViewings.length > 0 && totalPages > 1 && (
              <div className="flex flex-col gap-3 pt-6 lg:flex-row lg:items-center lg:justify-between">
                <p className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="rounded-xl"
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-xl"
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {filteredViewings.length === 0 && (
              <Card className="rounded-2xl border border-border/60 bg-background/80 shadow-sm p-12 text-center">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No viewings found</h3>
                <p className="text-muted-foreground">
                  There are no {filterStatus !== 'all' ? filterStatus : ''} viewings at the moment.
                </p>
              </Card>
            )}
          </div>
        </section>
      </main>

      <Footer />
      <Dialog
        open={Boolean(selectedViewing)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedViewing(null)
            setStatusForm({ status: 'scheduled', comments: '' })
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update viewing status</DialogTitle>
            <DialogDescription>
              {selectedViewing?.propertyTitle} • Tenant {selectedViewing?.tenantName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="viewing-status">Viewing status</Label>
              <Select
                value={statusForm.status}
                onValueChange={(value) =>
                  setStatusForm((prev) => ({ ...prev, status: value as PropertyViewing['status'] }))
                }
              >
                <SelectTrigger id="viewing-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {statusLabels[status]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="viewing-comments">Comments</Label>
              <Textarea
                id="viewing-comments"
                placeholder="Add context for the landlord or tenant..."
                value={statusForm.comments}
                onChange={(event) =>
                  setStatusForm((prev) => ({ ...prev, comments: event.target.value }))
                }
              />
              <p className="text-xs text-muted-foreground">
                Share a quick summary so the support team knows the outcome of this viewing.
              </p>
            </div>
          </div>
          <DialogFooter className="pt-2">
            <Button
              variant="ghost"
              onClick={() => {
                setSelectedViewing(null)
                setStatusForm({ status: 'scheduled', comments: '' })
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleStatusSubmit}
              disabled={statusForm.comments.trim().length < 5 && statusForm.status !== 'confirmed'}
            >
              Save status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(messageViewing)}
        onOpenChange={(open) => {
          if (!open) {
            setMessageViewing(null)
            setMessageBody('')
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Message tenant</DialogTitle>
            <DialogDescription>
              {messageViewing?.tenantName} • {messageViewing?.tenantPhone}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Textarea
              value={messageBody}
              onChange={(event) => setMessageBody(event.target.value)}
              placeholder="Hi Adaobi, I am 10 minutes away. Please wait at the gate so I can sign you in."
            />
            <p className="text-xs text-muted-foreground">
              A push notification + SMS reminder will be sent immediately.
            </p>
          </div>
          <DialogFooter className="pt-2">
            <Button
              variant="ghost"
              onClick={() => {
                setMessageViewing(null)
                setMessageBody('')
              }}
            >
              Cancel
            </Button>
            <Button
              className="gap-2"
              onClick={handleSendMessage}
              disabled={messageBody.trim().length < 3}
            >
              <Send className="h-4 w-4" />
              Send message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </div>
  )
}

