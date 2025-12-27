import { useState, useMemo } from 'react'
import { ReportButton } from '@/widgets/report-button'
import { useNavigate } from 'react-router-dom'
import {
  Sparkles,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MapPin,
  Phone,
  Star,
  ChevronRight,
  Filter,
  Eye,
  MessageCircle,
} from 'lucide-react'
import { format } from 'date-fns'
import { Header } from '@/widgets/header'
import { Sidebar } from '@/widgets/sidebar'
import { AuthDialog } from '@/widgets/auth-dialog'
import { Footer } from '@/widgets/footer'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { useAuthStore } from '@/shared/store/auth.store'
import { ROUTES } from '@/shared/constants/routes'
import { cn } from '@/shared/lib/utils/cn'
import { sampleServiceBookings } from '@/__mocks__/data/bookings.mock'
import type { ServiceBooking, ServiceBookingStatus } from '@/shared/types/booking.types'

const formatCurrency = (value: number) =>
  `₦${new Intl.NumberFormat('en-NG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)}`

const getStatusConfig = (status: ServiceBookingStatus) => {
  const configs: Record<
    ServiceBookingStatus,
    { label: string; icon: typeof Clock; className: string; description: string }
  > = {
    pending: {
      label: 'Pending',
      icon: Clock,
      className: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
      description: 'Awaiting provider confirmation',
    },
    confirmed: {
      label: 'Confirmed',
      icon: CheckCircle2,
      className: 'bg-primary/10 text-primary border-primary/20',
      description: 'Service booking confirmed',
    },
    in_progress: {
      label: 'In Progress',
      icon: AlertCircle,
      className: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      description: 'Service is currently being performed',
    },
    completed: {
      label: 'Completed',
      icon: CheckCircle2,
      className: 'bg-primary/10 text-primary border-primary/20',
      description: 'Service completed successfully',
    },
    cancelled: {
      label: 'Cancelled',
      icon: XCircle,
      className: 'bg-muted text-muted-foreground border-border',
      description: 'Service booking cancelled',
    },
    rescheduled: {
      label: 'Rescheduled',
      icon: Calendar,
      className: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
      description: 'Service has been rescheduled',
    },
  }
  return configs[status]
}

const getServiceIcon = (_type: ServiceBooking['type']) => {
  // Return appropriate icon based on service type
  // TODO: Add specific icons for each service type
  return Sparkles
}

type FilterType = 'all' | 'upcoming' | 'completed' | 'cancelled'

export function MyServicesPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [filter, setFilter] = useState<FilterType>('all')
  const [selectedBooking, setSelectedBooking] = useState<ServiceBooking | null>(null)

  const handleMenuClick = () => setIsSidebarOpen(true)
  const handleProfileClick = () => {
    if (!isAuthenticated) {
      setIsDrawerOpen(true)
    } else {
      navigate(ROUTES.PROFILE)
    }
  }

  const filteredBookings = useMemo(() => {
    let filtered = sampleServiceBookings

    if (filter === 'upcoming') {
      filtered = filtered.filter(
        (b) =>
          b.status === 'pending' ||
          b.status === 'confirmed' ||
          b.status === 'in_progress' ||
          b.status === 'rescheduled'
      )
    } else if (filter === 'completed') {
      filtered = filtered.filter((b) => b.status === 'completed')
    } else if (filter === 'cancelled') {
      filtered = filtered.filter((b) => b.status === 'cancelled')
    }

    return filtered.sort((a, b) => b.scheduledDate.getTime() - a.scheduledDate.getTime())
  }, [filter])

  const stats = useMemo(() => {
    const upcoming = sampleServiceBookings.filter(
      (b) =>
        b.status === 'pending' ||
        b.status === 'confirmed' ||
        b.status === 'in_progress' ||
        b.status === 'rescheduled'
    ).length
    const completed = sampleServiceBookings.filter((b) => b.status === 'completed').length
    const cancelled = sampleServiceBookings.filter((b) => b.status === 'cancelled').length

    return { total: sampleServiceBookings.length, upcoming, completed, cancelled }
  }, [])

  const handleViewDetails = (booking: ServiceBooking) => {
    setSelectedBooking(booking)
  }

  const handleCloseDetails = () => {
    setSelectedBooking(null)
  }

  const handleContactProvider = (bookingId: string) => {
    // Navigate to messaging with provider
    navigate(ROUTES.MESSAGING_CHAT(bookingId))
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header onMenuClick={handleMenuClick} onProfileClick={handleProfileClick} />

      <main className="flex-1 pb-24 lg:pb-8">
        <div className="container mx-auto px-4 lg:px-6 xl:px-8 py-6 lg:py-10 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">My Services</h1>
            <p className="text-muted-foreground">
              Track your service bookings and appointments
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
            <Card className="p-4 lg:p-5 bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-blue-500/30">
              <div className="space-y-1">
                <p className="text-xs lg:text-sm text-foreground/80">Upcoming</p>
                <p className="text-2xl lg:text-3xl font-bold text-foreground">{stats.upcoming}</p>
              </div>
            </Card>
            <Card className="p-4 lg:p-5 bg-gradient-to-br from-primary/20 to-primary/10 border-primary/30">
              <div className="space-y-1">
                <p className="text-xs lg:text-sm text-foreground/80">Completed</p>
                <p className="text-2xl lg:text-3xl font-bold text-foreground">{stats.completed}</p>
              </div>
            </Card>
            <Card className="p-4 lg:p-5 bg-surface border-border/50">
              <div className="space-y-1">
                <p className="text-xs lg:text-sm text-muted-foreground">Cancelled</p>
                <p className="text-2xl lg:text-3xl font-bold text-foreground">{stats.cancelled}</p>
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
              variant={filter === 'upcoming' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('upcoming')}
              className={cn(
                'shrink-0',
                filter !== 'upcoming' &&
                  'text-foreground border border-border hover:border-primary/50 hover:text-primary hover:bg-primary/10'
              )}
            >
              Upcoming
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
            <Button
              variant={filter === 'cancelled' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('cancelled')}
              className={cn(
                'shrink-0',
                filter !== 'cancelled' &&
                  'text-foreground border border-border hover:border-primary/50 hover:text-primary hover:bg-primary/10'
              )}
            >
              Cancelled
            </Button>
          </div>

          {/* Service Bookings List - Mobile First */}
          <div className="space-y-4 lg:space-y-5">
            {filteredBookings.map((booking) => {
              const statusConfig = getStatusConfig(booking.status)
              const StatusIcon = statusConfig.icon
              const ServiceIcon = getServiceIcon(booking.type)

              return (
                <Card
                  key={booking.id}
                  className="p-4 lg:p-6 bg-surface border-border/50 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => handleViewDetails(booking)}
                >
                  {/* Mobile Layout */}
                  <div className="lg:hidden space-y-4">
                    {/* Service Header */}
                    <div className="flex items-start gap-3">
                      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <ServiceIcon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-foreground mb-1 truncate">
                          {booking.service.name}
                        </h3>
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
                    </div>

                    {/* Service Details */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 shrink-0" />
                        <span>{format(booking.scheduledDate, 'MMM d, yyyy')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 shrink-0" />
                        <span>{booking.scheduledTime}</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">
                          {booking.address}, {booking.city}
                        </span>
                      </div>
                    </div>

                    {/* Provider Info */}
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={booking.provider.avatar} />
                        <AvatarFallback>{booking.provider.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {booking.provider.name}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                          <span>{booking.provider.rating}</span>
                          <span>·</span>
                          <span>{booking.provider.completedJobs} jobs</span>
                        </div>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <div>
                        <p className="text-xs text-muted-foreground">Service Fee</p>
                        <p className="text-xl font-bold text-primary">
                          {formatCurrency(booking.payment.amount)}
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden lg:flex gap-6">
                    {/* Service Icon */}
                    <div className="h-20 w-20 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <ServiceIcon className="h-10 w-10 text-primary" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-xl font-semibold text-foreground mb-1">
                              {booking.service.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {booking.service.description}
                            </p>
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
                            <Calendar className="h-4 w-4" />
                            <span>{format(booking.scheduledDate, 'MMM d, yyyy')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{booking.scheduledTime}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>
                              {booking.city}, {booking.state}
                            </span>
                          </div>
                        </div>

                        {/* Provider */}
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={booking.provider.avatar} />
                            <AvatarFallback>{booking.provider.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {booking.provider.name}
                            </p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                              <span>{booking.provider.rating}</span>
                              <span>·</span>
                              <span>{booking.provider.completedJobs} completed jobs</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Service Fee</p>
                          <p className="text-2xl font-bold text-primary">
                            {formatCurrency(booking.payment.amount)}
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
                <Sparkles className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No Service Bookings Found
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  {filter === 'all'
                    ? "You haven't booked any services yet"
                    : `No ${filter} service bookings found`}
                </p>
                <Button onClick={() => navigate(ROUTES.SERVICES)}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Browse Services
                </Button>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Service Booking Details Modal */}
      {selectedBooking && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end lg:items-center justify-center p-0 lg:p-4"
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
                    Service Details
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
              {/* Service Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Service Information</h3>
                <div className="flex gap-4">
                  <div className="h-20 w-20 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Sparkles className="h-10 w-10 text-primary" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h4 className="text-base lg:text-lg font-semibold text-foreground">
                      {selectedBooking.service.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedBooking.service.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-muted-foreground">
                        Duration: {selectedBooking.service.duration}h
                      </span>
                      <span className="text-primary font-semibold">
                        {formatCurrency(selectedBooking.service.price)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Schedule */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">Schedule</h3>
                <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-muted/50">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Date</p>
                    <p className="text-sm font-medium text-foreground">
                      {format(selectedBooking.scheduledDate, 'MMM d, yyyy')}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Time</p>
                    <p className="text-sm font-medium text-foreground">
                      {selectedBooking.scheduledTime}
                    </p>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">Location</h3>
                <div className="p-4 rounded-xl bg-muted/50">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{selectedBooking.address}</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedBooking.city}, {selectedBooking.state}
                      </p>
                    </div>
                  </div>
                  {selectedBooking.propertyName && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Property: {selectedBooking.propertyName}
                    </p>
                  )}
                </div>
              </div>

              {/* Provider Info */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">Service Provider</h3>
                  <ReportButton
                    reportedEntity={{
                      id: selectedBooking.provider.id || selectedBooking.providerId,
                      name: selectedBooking.provider.name,
                      type: 'user',
                      role: 'service_provider',
                    }}
                    reportType="service_provider"
                    relatedTo={{
                      type: 'service_booking',
                      id: selectedBooking.id,
                      title: selectedBooking.service.name,
                    }}
                    variant="outline"
                    size="sm"
                    className="border-amber-500/50 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/20"
                  />
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={selectedBooking.provider.avatar} />
                    <AvatarFallback>{selectedBooking.provider.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{selectedBooking.provider.name}</p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                      <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                      <span>{selectedBooking.provider.rating} rating</span>
                      <span>·</span>
                      <span>{selectedBooking.provider.completedJobs} jobs completed</span>
                    </div>
                    {selectedBooking.provider.phone && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <Phone className="h-3.5 w-3.5" />
                        <span>{selectedBooking.provider.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedBooking.notes && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-foreground">Notes</h3>
                  <div className="p-4 rounded-xl bg-muted/50">
                    <p className="text-sm text-foreground">{selectedBooking.notes}</p>
                  </div>
                </div>
              )}

              {/* Status Timeline */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">Booking Timeline</h3>
                <div className="space-y-3">
                  {selectedBooking.timeline.map((item, index) => {
                    const config = getStatusConfig(item.status)
                    const Icon = config.icon
                    const isLast = index === selectedBooking.timeline.length - 1

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
                          {index < selectedBooking.timeline.length - 1 && (
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

              {/* Review (if completed) */}
              {selectedBooking.status === 'completed' && selectedBooking.rating && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-foreground">Your Review</h3>
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                    <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={cn(
                            'h-5 w-5',
                            star <= selectedBooking.rating!
                              ? 'fill-amber-500 text-amber-500'
                              : 'text-muted-foreground'
                          )}
                        />
                      ))}
                    </div>
                    {selectedBooking.review && (
                      <p className="text-sm text-foreground">{selectedBooking.review}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Cancellation Reason */}
              {selectedBooking.cancellationReason && (
                <div className="p-4 rounded-xl bg-muted border border-border">
                  <p className="text-sm font-medium text-foreground mb-1">Cancellation Reason</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedBooking.cancellationReason}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-5 lg:p-6 border-t border-border bg-background">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-border hover:border-primary/50 hover:text-primary"
                  onClick={() => handleContactProvider(selectedBooking.id)}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact Provider
                </Button>
                {selectedBooking.status === 'completed' && !selectedBooking.rating && (
                  <Button className="flex-1">
                    <Star className="h-4 w-4 mr-2" />
                    Leave Review
                  </Button>
                )}
              </div>
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

