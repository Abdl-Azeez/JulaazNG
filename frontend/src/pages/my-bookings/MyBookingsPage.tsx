import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Home,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  CreditCard,
  MapPin,
  Bed,
  Bath,
  ChevronRight,
  Filter,
  Eye,
  Download,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react'
import { format } from 'date-fns'
import { Header } from '@/widgets/header'
import { Sidebar } from '@/widgets/sidebar'
import { AuthDialog } from '@/widgets/auth-dialog'
import { Footer } from '@/widgets/footer'
import { ReportButton } from '@/widgets/report-button'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { useAuthStore } from '@/shared/store/auth.store'
import { ROUTES } from '@/shared/constants/routes'
import { cn } from '@/shared/lib/utils/cn'
import { samplePropertyBookings } from '@/__mocks__/data/bookings.mock'
import type { PropertyBooking, BookingStatus } from '@/shared/types/booking.types'

const formatCurrency = (value: number) =>
  `₦${new Intl.NumberFormat('en-NG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)}`

const getStatusConfig = (status: BookingStatus) => {
  const configs: Record<
    BookingStatus,
    { label: string; icon: typeof Clock; className: string; description: string }
  > = {
    pending: {
      label: 'Pending',
      icon: Clock,
      className: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
      description: 'Awaiting landlord response',
    },
    viewing_scheduled: {
      label: 'Viewing Scheduled',
      icon: Calendar,
      className: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      description: 'Property viewing scheduled',
    },
    viewing_completed: {
      label: 'Viewing Done',
      icon: CheckCircle2,
      className: 'bg-primary/10 text-primary border-primary/20',
      description: 'Viewing completed - decide to proceed or decline',
    },
    inspection_completed: {
      label: 'Inspection Completed',
      icon: CheckCircle2,
      className: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
      description: 'Inspection completed - proceeding with application',
    },
    inspection_declined: {
      label: 'Inspection Declined',
      icon: XCircle,
      className: 'bg-muted text-muted-foreground border-border',
      description: 'You declined to proceed after inspection',
    },
    sign_off_fee_pending: {
      label: 'Sign-off Fee Due',
      icon: CreditCard,
      className: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
      description: 'Pay sign-off fee to proceed',
    },
    sign_off_fee_completed: {
      label: 'Sign-off Fee Paid',
      icon: CheckCircle2,
      className: 'bg-primary/10 text-primary border-primary/20',
      description: 'Sign-off fee paid - proceed with rental payment',
    },
    rental_payment_pending: {
      label: 'Rental Payment Due',
      icon: CreditCard,
      className: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
      description: 'Pay rental amount to proceed',
    },
    application_submitted: {
      label: 'Application Sent',
      icon: FileText,
      className: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      description: 'Application submitted',
    },
    approved: {
      label: 'Approved',
      icon: CheckCircle2,
      className: 'bg-primary/10 text-primary border-primary/20',
      description: 'Application approved',
    },
    agreement_sent: {
      label: 'Agreement Sent',
      icon: FileText,
      className: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      description: 'Rental agreement sent',
    },
    agreement_signed: {
      label: 'Agreement Signed',
      icon: CheckCircle2,
      className: 'bg-primary/10 text-primary border-primary/20',
      description: 'Agreement signed by both parties',
    },
    payment_pending: {
      label: 'Payment Due',
      icon: CreditCard,
      className: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
      description: 'Payment required',
    },
    payment_completed: {
      label: 'Payment Done',
      icon: CheckCircle2,
      className: 'bg-primary/10 text-primary border-primary/20',
      description: 'Payment completed',
    },
    active: {
      label: 'Active',
      icon: Home,
      className: 'bg-primary/10 text-primary border-primary/20',
      description: 'Currently renting',
    },
    completed: {
      label: 'Completed',
      icon: CheckCircle2,
      className: 'bg-muted text-muted-foreground border-border',
      description: 'Tenancy ended',
    },
    cancelled: {
      label: 'Cancelled',
      icon: XCircle,
      className: 'bg-muted text-muted-foreground border-border',
      description: 'Booking cancelled',
    },
    rejected: {
      label: 'Rejected',
      icon: XCircle,
      className: 'bg-destructive/10 text-destructive border-destructive/20',
      description: 'Application rejected',
    },
  }
  return configs[status]
}

type FilterType = 'all' | 'active' | 'pending' | 'completed'

export function MyBookingsPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [filter, setFilter] = useState<FilterType>('all')
  const [selectedBooking, setSelectedBooking] = useState<PropertyBooking | null>(null)

  const handleMenuClick = () => setIsSidebarOpen(true)
  const handleProfileClick = () => {
    if (!isAuthenticated) {
      setIsDrawerOpen(true)
    } else {
      navigate(ROUTES.PROFILE)
    }
  }

  const filteredBookings = useMemo(() => {
    let filtered = samplePropertyBookings

    if (filter === 'active') {
      filtered = filtered.filter((b) => b.status === 'active' || b.status === 'payment_completed')
    } else if (filter === 'pending') {
      filtered = filtered.filter(
        (b) =>
          b.status === 'pending' ||
          b.status === 'viewing_scheduled' ||
          b.status === 'viewing_completed' ||
          b.status === 'inspection_completed' ||
          b.status === 'sign_off_fee_pending' ||
          b.status === 'sign_off_fee_completed' ||
          b.status === 'rental_payment_pending' ||
          b.status === 'application_submitted' ||
          b.status === 'approved' ||
          b.status === 'agreement_sent' ||
          b.status === 'agreement_signed' ||
          b.status === 'payment_pending'
      )
    } else if (filter === 'completed') {
      filtered = filtered.filter(
        (b) => b.status === 'completed' || b.status === 'cancelled' || b.status === 'rejected' || b.status === 'inspection_declined'
      )
    }

    return filtered.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
  }, [filter])

  const stats = useMemo(() => {
    const active = samplePropertyBookings.filter(
      (b) => b.status === 'active' || b.status === 'payment_completed'
    ).length
    const pending = samplePropertyBookings.filter(
      (b) =>
        b.status === 'pending' ||
        b.status === 'viewing_scheduled' ||
        b.status === 'viewing_completed' ||
        b.status === 'inspection_completed' ||
        b.status === 'sign_off_fee_pending' ||
        b.status === 'sign_off_fee_completed' ||
        b.status === 'rental_payment_pending' ||
        b.status === 'application_submitted' ||
        b.status === 'approved' ||
        b.status === 'agreement_sent' ||
        b.status === 'agreement_signed' ||
        b.status === 'payment_pending'
    ).length
    const completed = samplePropertyBookings.filter(
      (b) => b.status === 'completed' || b.status === 'cancelled' || b.status === 'rejected' || b.status === 'inspection_declined'
    ).length

    return { total: samplePropertyBookings.length, active, pending, completed }
  }, [])

  const handleViewDetails = (booking: PropertyBooking) => {
    setSelectedBooking(booking)
  }

  const handleCloseDetails = () => {
    setSelectedBooking(null)
  }

  const handleViewProperty = (propertyId: string) => {
    navigate(ROUTES.PROPERTY_DETAILS(propertyId))
  }

  const handleContactLandlord = (bookingId: string) => {
    // Navigate to messaging with landlord
    navigate(ROUTES.MESSAGING_CHAT(bookingId))
  }
  
  const handleInspectionDecision = async (booking: PropertyBooking, proceed: boolean) => {
    // Update booking status based on decision
    toast.success(
      proceed
        ? 'Thank you! Proceeding with application...'
        : 'Booking declined. You can browse other properties.'
    )
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    handleCloseDetails()
  }
  
  const handlePaySignOffFee = async (booking: PropertyBooking) => {
    // Navigate to payment page for sign-off fee
    toast.success('Redirecting to payment page...')
    // Simulate navigation
    await new Promise((resolve) => setTimeout(resolve, 500))
    // navigate(ROUTES.PAYMENT(booking.id, 'sign-off-fee'))
  }
  
  const handlePayRental = async (booking: PropertyBooking) => {
    // Navigate to payment page for rental
    toast.success('Redirecting to payment page...')
    // Simulate navigation
    await new Promise((resolve) => setTimeout(resolve, 500))
    // navigate(ROUTES.PAYMENT(booking.id, 'rental'))
  }
  
  const handleViewAgreement = (booking: PropertyBooking) => {
    if (booking.agreement?.documentUrl) {
      // Open agreement PDF in new tab
      window.open(booking.agreement.documentUrl, '_blank')
    } else {
      toast.error('Agreement document not available yet')
    }
  }
  
  const handleDownloadAgreement = (booking: PropertyBooking) => {
    if (booking.agreement?.documentUrl) {
      // Download agreement PDF
      const link = document.createElement('a')
      link.href = booking.agreement.documentUrl
      link.download = `agreement-${booking.id}.pdf`
      link.click()
      toast.success('Agreement downloaded')
    } else {
      toast.error('Agreement document not available yet')
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header onMenuClick={handleMenuClick} onProfileClick={handleProfileClick} />

      <main className="flex-1 pb-24 lg:pb-8">
        <div className="container mx-auto px-4 lg:px-6 xl:px-8 py-6 lg:py-10 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">My Bookings</h1>
            <p className="text-muted-foreground">
              Track your property applications and rental bookings
            </p>
          </div>

          {/* Stats - Mobile */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-4 mb-6 lg:mb-8">
            <Card className="p-4 lg:p-5 bg-surface border-border/50">
              <div className="space-y-1">
                <p className="text-xs lg:text-sm text-muted-foreground">Total</p>
                <p className="text-2xl lg:text-3xl font-bold text-foreground">{stats.total}</p>
              </div>
            </Card>
            <Card className="p-4 lg:p-5 bg-gradient-to-br from-primary/20 to-primary/10 border-primary/30">
              <div className="space-y-1">
                <p className="text-xs lg:text-sm text-foreground/80">Active</p>
                <p className="text-2xl lg:text-3xl font-bold text-foreground">{stats.active}</p>
              </div>
            </Card>
            <Card className="p-4 lg:p-5 bg-gradient-to-br from-amber-500/20 to-amber-600/10 border-amber-500/30">
              <div className="space-y-1">
                <p className="text-xs lg:text-sm text-foreground/80">Pending</p>
                <p className="text-2xl lg:text-3xl font-bold text-foreground">{stats.pending}</p>
              </div>
            </Card>
            <Card className="p-4 lg:p-5 bg-surface border-border/50">
              <div className="space-y-1">
                <p className="text-xs lg:text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl lg:text-3xl font-bold text-foreground">{stats.completed}</p>
              </div>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
              className={cn(
                'shrink-0',
                filter !== 'all' &&
                  'text-foreground border border-border hover:border-primary/50 hover:text-primary hover:bg-primary/10'
              )}
            >
              <Filter className="h-4 w-4 mr-2" />
              All
            </Button>
            <Button
              variant={filter === 'active' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('active')}
              className={cn(
                'shrink-0',
                filter !== 'active' &&
                  'text-foreground border border-border hover:border-primary/50 hover:text-primary hover:bg-primary/10'
              )}
            >
              Active
            </Button>
            <Button
              variant={filter === 'pending' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('pending')}
              className={cn(
                'shrink-0',
                filter !== 'pending' &&
                  'text-foreground border border-border hover:border-primary/50 hover:text-primary hover:bg-primary/10'
              )}
            >
              Pending
            </Button>
            <Button
              variant={filter === 'completed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('completed')}
              className={cn(
                'shrink-0',
                filter !== 'completed' &&
                  'text-foreground border border-border hover:border-primary/50 hover:text-primary hover:bg-primary/10'
              )}
            >
              Completed
            </Button>
          </div>

          {/* Bookings List - Mobile First */}
          <div className="space-y-4 lg:space-y-5">
            {filteredBookings.map((booking) => {
              const statusConfig = getStatusConfig(booking.status)
              const StatusIcon = statusConfig.icon

              return (
                <Card
                  key={booking.id}
                  className="p-4 lg:p-6 bg-surface border-border/50 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => handleViewDetails(booking)}
                >
                  {/* Mobile Layout */}
                  <div className="lg:hidden space-y-4">
                    {/* Property Image */}
                    <div className="relative w-full h-48 rounded-xl overflow-hidden">
                      <img
                        src={booking.property.image}
                        alt={booking.property.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3">
                        <Badge
                          className={cn(
                            'rounded-full px-3 py-1 text-xs font-medium border',
                            statusConfig.className
                          )}
                        >
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusConfig.label}
                        </Badge>
                      </div>
                      {booking.type === 'shortlet' && (
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-accent/90 text-accent-foreground border-0 rounded-full px-3 py-1 text-xs">
                            Shortlet
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Property Info */}
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-1">
                          {booking.property.name}
                        </h3>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>
                            {booking.property.city}, {booking.property.state}
                          </span>
                        </div>
                      </div>

                      {/* Property Details */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Bed className="h-4 w-4" />
                          <span>{booking.property.bedrooms} Beds</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Bath className="h-4 w-4" />
                          <span>{booking.property.bathrooms} Baths</span>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            {booking.property.priceType === 'annually'
                              ? 'Annual Rent'
                              : booking.property.priceType === 'monthly'
                                ? 'Monthly Rent'
                                : 'Per Night'}
                          </p>
                          <p className="text-xl font-bold text-primary">
                            {formatCurrency(booking.property.price)}
                          </p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>

                      {/* Status Description */}
                      <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
                        <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                        <p className="text-xs text-muted-foreground">{statusConfig.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden lg:flex gap-6">
                    {/* Property Image */}
                    <div className="relative w-64 h-48 rounded-xl overflow-hidden shrink-0">
                      <img
                        src={booking.property.image}
                        alt={booking.property.name}
                        className="w-full h-full object-cover"
                      />
                      {booking.type === 'shortlet' && (
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-accent/90 text-accent-foreground border-0 rounded-full px-3 py-1 text-xs">
                            Shortlet
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-xl font-semibold text-foreground mb-1">
                              {booking.property.name}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              <span>
                                {booking.property.address}, {booking.property.city}
                              </span>
                            </div>
                          </div>
                          <Badge
                            className={cn(
                              'rounded-full px-4 py-1.5 text-sm font-medium border shrink-0',
                              statusConfig.className
                            )}
                          >
                            <StatusIcon className="h-4 w-4 mr-1.5" />
                            {statusConfig.label}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Bed className="h-4 w-4" />
                            <span>{booking.property.bedrooms} Bedrooms</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Bath className="h-4 w-4" />
                            <span>{booking.property.bathrooms} Bathrooms</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>Updated {format(booking.updatedAt, 'MMM d, yyyy')}</span>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground">{statusConfig.description}</p>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            {booking.property.priceType === 'annually'
                              ? 'Annual Rent'
                              : booking.property.priceType === 'monthly'
                                ? 'Monthly Rent'
                                : 'Per Night'}
                          </p>
                          <p className="text-2xl font-bold text-primary">
                            {formatCurrency(booking.property.price)}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-border hover:border-primary/50 hover:text-primary"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleViewDetails(booking)
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}

            {filteredBookings.length === 0 && (
              <Card className="p-12 text-center bg-surface border-border/50">
                <Home className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Bookings Found</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  {filter === 'all'
                    ? "You haven't made any property bookings yet"
                    : `No ${filter} bookings found`}
                </p>
                <Button onClick={() => navigate(ROUTES.PROPERTIES)}>
                  <Home className="h-4 w-4 mr-2" />
                  Browse Properties
                </Button>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div
          className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50 flex items-end lg:items-center justify-center p-0 lg:p-4"
          onClick={handleCloseDetails}
        >
          <div
            className="bg-background w-full lg:max-w-3xl lg:rounded-2xl h-[90vh] lg:h-auto lg:max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 lg:p-6 border-b border-border sticky top-0 bg-background z-10">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl lg:text-2xl font-bold text-foreground mb-1">
                    Booking Details
                  </h2>
                  <p className="text-sm text-muted-foreground">ID: {selectedBooking.id}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full text-foreground hover:bg-muted shrink-0"
                  onClick={handleCloseDetails}
                >
                  <XCircle className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-5 lg:p-6 space-y-6">
              {/* Property Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Property Information</h3>
                <div className="flex gap-4">
                  <img
                    src={selectedBooking.property.image}
                    alt={selectedBooking.property.name}
                    className="w-24 h-24 lg:w-32 lg:h-32 rounded-xl object-cover"
                  />
                  <div className="flex-1 space-y-2">
                    <h4 className="text-base lg:text-lg font-semibold text-foreground">
                      {selectedBooking.property.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedBooking.property.address}, {selectedBooking.property.city}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-muted-foreground">
                        {selectedBooking.property.bedrooms} Beds
                      </span>
                      <span className="text-muted-foreground">
                        {selectedBooking.property.bathrooms} Baths
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Landlord Info */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">Landlord</h3>
                  <ReportButton
                    reportedEntity={{
                      id: selectedBooking.landlordId,
                      name: selectedBooking.landlord.name,
                      type: 'user',
                      role: 'landlord',
                    }}
                    reportType="landlord"
                    relatedTo={{
                      type: 'property',
                      id: selectedBooking.propertyId,
                      title: selectedBooking.property.name,
                    }}
                    variant="outline"
                    size="sm"
                    className="border-amber-500/50 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/20"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={selectedBooking.landlord.avatar} />
                    <AvatarFallback>{selectedBooking.landlord.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{selectedBooking.landlord.name}</p>
                    {selectedBooking.landlord.phone && (
                      <p className="text-sm text-muted-foreground">
                        {selectedBooking.landlord.phone}
                      </p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleContactLandlord(selectedBooking.id)}
                    className="border-border hover:border-primary/50 hover:text-primary"
                  >
                    Message
                  </Button>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">Booking Timeline</h3>
                <div className="space-y-3">
                  {selectedBooking.timeline?.map((item, index) => {
                    const config = getStatusConfig(item.status)
                    const Icon = config.icon
                    const isLast = index === (selectedBooking.timeline?.length ?? 0) - 1

                    return (
                      <div key={index} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div
                            className={cn(
                              'h-8 w-8 rounded-full flex items-center justify-center',
                              isLast ? config.className : 'bg-muted text-muted-foreground'
                            )}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          {index < (selectedBooking.timeline?.length ?? 0) - 1 && (
                            <div className="w-0.5 h-full min-h-[24px] bg-border mt-1" />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <p className="font-medium text-foreground text-sm">{config.label}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {format(item.timestamp, 'MMM d, yyyy - h:mm a')}
                          </p>
                          {item.note && (
                            <p className="text-sm text-muted-foreground mt-1">{item.note}</p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Application Details */}
              {selectedBooking.application && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-foreground">Application Details</h3>
                  <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-muted/50">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Move-in Date</p>
                      <p className="text-sm font-medium text-foreground">
                        {format(selectedBooking.application.moveInDate, 'MMM d, yyyy')}
                      </p>
                    </div>
                    {selectedBooking.application.tenancyDuration && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Duration</p>
                        <p className="text-sm font-medium text-foreground">
                          {selectedBooking.application.tenancyDuration} months
                        </p>
                      </div>
                    )}
                    {selectedBooking.application.stayLengthNights && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Stay Length</p>
                        <p className="text-sm font-medium text-foreground">
                          {selectedBooking.application.stayLengthNights} nights
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Budget</p>
                      <p className="text-sm font-medium text-foreground">
                        {formatCurrency(selectedBooking.application.minimumBudget)}
                      </p>
                    </div>
                  </div>
                  {selectedBooking.application.notes && (
                    <div className="p-4 rounded-xl bg-muted/50">
                      <p className="text-xs text-muted-foreground mb-2">Notes</p>
                      <p className="text-sm text-foreground">{selectedBooking.application.notes}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Rejection/Cancellation Reason */}
              {(selectedBooking.rejectionReason || selectedBooking.cancellationReason) && (
                <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                  <p className="text-sm font-medium text-destructive mb-1">
                    {selectedBooking.rejectionReason ? 'Rejection Reason' : 'Cancellation Reason'}
                  </p>
                  <p className="text-sm text-foreground">
                    {selectedBooking.rejectionReason || selectedBooking.cancellationReason}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-5 lg:p-6 border-t border-border bg-background">
              {/* Action Buttons Based on Status */}
              {selectedBooking.status === 'viewing_completed' && (
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                    <p className="text-sm font-semibold text-foreground mb-2">
                      Inspection Completed
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      Would you like to proceed with this property? You'll be required to pay a sign-off fee first.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        variant="outline"
                        className="flex-1 border-destructive/50 text-destructive hover:bg-destructive/10"
                        onClick={() => handleInspectionDecision(selectedBooking, false)}
                      >
                        <ThumbsDown className="h-4 w-4 mr-2" />
                        Decline
                      </Button>
                      <Button
                        className="flex-1 bg-primary hover:bg-primary/90"
                        onClick={() => handleInspectionDecision(selectedBooking, true)}
                      >
                        <ThumbsUp className="h-4 w-4 mr-2" />
                        Proceed with Application
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 border-border hover:border-primary/50 hover:text-primary"
                      onClick={() => handleViewProperty(selectedBooking.property.id)}
                    >
                      <Home className="h-4 w-4 mr-2" />
                      View Property
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-border hover:border-primary/50 hover:text-primary"
                      onClick={() => handleContactLandlord(selectedBooking.id)}
                    >
                      Contact Landlord
                    </Button>
                  </div>
                </div>
              )}
              
              {selectedBooking.status === 'sign_off_fee_pending' && (
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                    <p className="text-sm font-semibold text-foreground mb-2">
                      Sign-off Fee Required
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      Pay the sign-off fee to proceed with your application. This is required before rental payment.
                    </p>
                    {selectedBooking.signOffFee && (
                      <p className="text-lg font-bold text-primary mb-4">
                        {formatCurrency(selectedBooking.signOffFee.amount)}
                      </p>
                    )}
                    <Button
                      className="w-full bg-primary hover:bg-primary/90"
                      onClick={() => handlePaySignOffFee(selectedBooking)}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Pay Sign-off Fee
                    </Button>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 border-border hover:border-primary/50 hover:text-primary"
                      onClick={() => handleViewProperty(selectedBooking.property.id)}
                    >
                      <Home className="h-4 w-4 mr-2" />
                      View Property
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-border hover:border-primary/50 hover:text-primary"
                      onClick={() => handleContactLandlord(selectedBooking.id)}
                    >
                      Contact Landlord
                    </Button>
                  </div>
                </div>
              )}
              
              {selectedBooking.status === 'rental_payment_pending' && (
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                    <p className="text-sm font-semibold text-foreground mb-2">
                      Rental Payment Required
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      Complete your rental payment to proceed. The agreement will be sent after payment.
                    </p>
                    {selectedBooking.payment && (
                      <p className="text-lg font-bold text-primary mb-4">
                        {formatCurrency(selectedBooking.payment.amount)}
                      </p>
                    )}
                    <Button
                      className="w-full bg-primary hover:bg-primary/90"
                      onClick={() => handlePayRental(selectedBooking)}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Pay Rental Amount
                    </Button>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 border-border hover:border-primary/50 hover:text-primary"
                      onClick={() => handleViewProperty(selectedBooking.property.id)}
                    >
                      <Home className="h-4 w-4 mr-2" />
                      View Property
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-border hover:border-primary/50 hover:text-primary"
                      onClick={() => handleContactLandlord(selectedBooking.id)}
                    >
                      Contact Landlord
                    </Button>
                  </div>
                </div>
              )}
              
              {selectedBooking.status === 'agreement_sent' && selectedBooking.agreement && (
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                    <p className="text-sm font-semibold text-foreground mb-2">
                      Agreement Available
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      Your rental agreement is ready. Review and sign to proceed.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        variant="outline"
                        className="flex-1 border-border hover:border-primary/50 hover:text-primary"
                        onClick={() => handleViewAgreement(selectedBooking)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Agreement
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 border-border hover:border-primary/50 hover:text-primary"
                        onClick={() => handleDownloadAgreement(selectedBooking)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 border-border hover:border-primary/50 hover:text-primary"
                      onClick={() => handleViewProperty(selectedBooking.property.id)}
                    >
                      <Home className="h-4 w-4 mr-2" />
                      View Property
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-border hover:border-primary/50 hover:text-primary"
                      onClick={() => handleContactLandlord(selectedBooking.id)}
                    >
                      Contact Landlord
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Default Footer Actions */}
              {!['viewing_completed', 'sign_off_fee_pending', 'rental_payment_pending', 'agreement_sent'].includes(selectedBooking.status) && (
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 border-border hover:border-primary/50 hover:text-primary"
                    onClick={() => handleViewProperty(selectedBooking.property.id)}
                  >
                    <Home className="h-4 w-4 mr-2" />
                    View Property
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => handleContactLandlord(selectedBooking.id)}
                  >
                    Contact Landlord
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <AuthDialog open={isDrawerOpen} onOpenChange={setIsDrawerOpen} />
      <Footer />
    </div>
  )
}

