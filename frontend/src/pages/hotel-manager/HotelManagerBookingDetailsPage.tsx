import { useState, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Bed,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Key,
  FileText,
} from 'lucide-react'
import { Header } from '@/widgets/header'
import { Sidebar } from '@/widgets/sidebar'
import { Footer } from '@/widgets/footer'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { Input } from '@/shared/ui/input'
import { Textarea } from '@/shared/ui/textarea'
import { mockHotelBookings, mockHotels, mockHotelRooms } from '@/__mocks__/data/hotels.mock'
import { ROUTES } from '@/shared/constants/routes'
import { cn } from '@/shared/lib/utils/cn'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import type { HotelBooking } from '@/shared/types/hotel.types'

export function HotelManagerBookingDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [checkInCode, setCheckInCode] = useState('')
  const [rejectionReason, setRejectionReason] = useState('')
  const [isCheckInDialogOpen, setIsCheckInDialogOpen] = useState(false)
  const [isCheckOutDialogOpen, setIsCheckOutDialogOpen] = useState(false)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)

  const booking = useMemo(() => {
    return mockHotelBookings.find((b) => b.id === id)
  }, [id])

  const hotel = useMemo(() => {
    if (!booking) return null
    return mockHotels.find((h) => h.id === booking.hotelId)
  }, [booking])

  const room = useMemo(() => {
    if (!booking) return null
    const hotelRooms = mockHotelRooms[booking.hotelId] || []
    return hotelRooms.find((r) => r.id === booking.roomId)
  }, [booking])

  const handleProfileClick = () => {
    navigate(ROUTES.PROFILE)
  }

  const handleApproveBooking = () => {
    if (!booking) return
    toast.success('Booking approved. User has 48 hours to complete payment.')
    // In real app, this would update the booking via API
  }

  const handleRejectBooking = () => {
    if (!booking || !rejectionReason.trim()) {
      toast.error('Please provide a rejection reason')
      return
    }
    toast.success('Booking rejected')
    setIsRejectDialogOpen(false)
    setRejectionReason('')
  }

  const handleCheckIn = () => {
    if (!booking) return

    if (checkInCode !== booking.checkInCode) {
      toast.error('Invalid check-in code')
      return
    }

    toast.success('Guest checked in successfully')
    setIsCheckInDialogOpen(false)
    setCheckInCode('')
    // In real app, this would update the booking status via API
  }

  const handleCheckOut = () => {
    if (!booking) return
    toast.success('Guest checked out successfully')
    setIsCheckOutDialogOpen(false)
    // In real app, this would update the booking status via API
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header onMenuClick={() => setIsSidebarOpen(true)} onProfileClick={handleProfileClick} />
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className="flex-1 flex items-center justify-center">
          <Card className="p-12 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">Booking not found</h2>
            <Button onClick={() => navigate(ROUTES.HOTEL_MANAGER_BOOKINGS)}>Back to Bookings</Button>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  const statusColors: Record<HotelBooking['status'], string> = {
    pending: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    approved: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    rejected: 'bg-red-500/10 text-red-600 border-red-500/20',
    payment_pending: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
    payment_completed: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    checked_in: 'bg-green-500/10 text-green-600 border-green-500/20',
    checked_out: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
    cancelled: 'bg-red-500/10 text-red-600 border-red-500/20',
  }

  const numberOfNights = Math.ceil(
    (new Date(booking.checkOutDate).getTime() - new Date(booking.checkInDate).getTime()) /
      (1000 * 60 * 60 * 24)
  )

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header onMenuClick={() => setIsSidebarOpen(true)} onProfileClick={handleProfileClick} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1">
        {/* Header */}
        <section className="border-b border-border/60 bg-gradient-to-br from-primary/5 via-background to-background">
          <div className="container mx-auto max-w-7xl px-4 lg:px-6 xl:px-8 py-8">
            <Button
              variant="ghost"
              className="mb-4 -ml-2"
              onClick={() => navigate(ROUTES.HOTEL_MANAGER_BOOKINGS)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Bookings
            </Button>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Booking Details</h1>
                  <Badge className={cn('rounded-full', statusColors[booking.status])}>
                    {booking.status.replace('_', ' ')}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">Booking ID: {booking.id}</p>
              </div>
              <div className="flex gap-2">
                {booking.approvalStatus === 'pending' && (
                  <>
                    <Button variant="outline" onClick={handleApproveBooking}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsRejectDialogOpen(true)}
                      className="text-destructive hover:text-destructive"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </>
                )}
                {booking.status === 'payment_completed' && (
                  <Button variant="outline" onClick={() => setIsCheckInDialogOpen(true)}>
                    <Key className="h-4 w-4 mr-2" />
                    Check In
                  </Button>
                )}
                {booking.status === 'checked_in' && (
                  <Button variant="outline" onClick={() => setIsCheckOutDialogOpen(true)}>
                    Check Out
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="container mx-auto max-w-7xl px-4 lg:px-6 xl:px-8 py-8 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Guest Information */}
              <Card className="p-6 rounded-2xl">
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Guest Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Full Name</p>
                    <p className="font-semibold">{booking.userName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Email</p>
                    <p className="font-semibold flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {booking.userEmail}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Phone</p>
                    <p className="font-semibold flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {booking.userPhone}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Number of Guests</p>
                    <p className="font-semibold flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {booking.numberOfGuests}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Booking Details */}
              <Card className="p-6 rounded-2xl">
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Booking Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Hotel</p>
                    <p className="font-semibold flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      {booking.hotelName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Room</p>
                    <p className="font-semibold flex items-center gap-2">
                      <Bed className="h-4 w-4" />
                      {booking.roomName} ({booking.roomType})
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Check-in Date</p>
                    <p className="font-semibold">{format(new Date(booking.checkInDate), 'EEEE, MMMM d, yyyy')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Check-out Date</p>
                    <p className="font-semibold">{format(new Date(booking.checkOutDate), 'EEEE, MMMM d, yyyy')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Number of Nights</p>
                    <p className="font-semibold">{numberOfNights} night{numberOfNights !== 1 ? 's' : ''}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Number of Rooms</p>
                    <p className="font-semibold">{booking.numberOfRooms}</p>
                  </div>
                </div>
              </Card>

              {/* Payment Information */}
              <Card className="p-6 rounded-2xl">
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Payment Information
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Amount</p>
                      <p className="text-2xl font-bold">₦{booking.totalAmount.toLocaleString()}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        booking.paymentStatus === 'completed'
                          ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                      )}
                    >
                      {booking.paymentStatus}
                    </Badge>
                  </div>
                  {booking.paymentCompletedAt && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Payment Date</p>
                      <p className="font-semibold">{format(new Date(booking.paymentCompletedAt), 'MMMM d, yyyy h:mm a')}</p>
                    </div>
                  )}
                  {booking.paymentDeadline && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Payment Deadline</p>
                      <p className="font-semibold flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {format(new Date(booking.paymentDeadline), 'MMMM d, yyyy h:mm a')}
                      </p>
                    </div>
                  )}
                </div>
              </Card>

              {/* Special Requests */}
              {booking.specialRequests && (
                <Card className="p-6 rounded-2xl">
                  <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Special Requests
                  </h2>
                  <p className="text-muted-foreground">{booking.specialRequests}</p>
                </Card>
              )}

              {/* Rejection Reason */}
              {booking.rejectionReason && (
                <Card className="p-6 rounded-2xl border-red-500/20 bg-red-500/5">
                  <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-red-600" />
                    Rejection Reason
                  </h2>
                  <p className="text-muted-foreground">{booking.rejectionReason}</p>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Booking Status */}
              <Card className="p-6 rounded-2xl">
                <h3 className="font-semibold text-foreground mb-4">Booking Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge className={cn('rounded-full', statusColors[booking.status])}>
                      {booking.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Approval Status</span>
                    <Badge
                      variant="outline"
                      className={cn(
                        booking.approvalStatus === 'approved'
                          ? 'bg-emerald-500/10 text-emerald-600'
                          : booking.approvalStatus === 'rejected'
                            ? 'bg-red-500/10 text-red-600'
                            : 'bg-amber-500/10 text-amber-600'
                      )}
                    >
                      {booking.approvalStatus}
                    </Badge>
                  </div>
                  {booking.approvedBy && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Approved By</span>
                      <span className="text-sm font-semibold">{booking.approvedBy}</span>
                    </div>
                  )}
                  {booking.approvedAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Approved At</span>
                      <span className="text-sm font-semibold">
                        {format(new Date(booking.approvedAt), 'MMM d, yyyy')}
                      </span>
                    </div>
                  )}
                  {booking.checkedInAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Checked In At</span>
                      <span className="text-sm font-semibold">
                        {format(new Date(booking.checkedInAt), 'MMM d, yyyy h:mm a')}
                      </span>
                    </div>
                  )}
                  {booking.checkedOutAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Checked Out At</span>
                      <span className="text-sm font-semibold">
                        {format(new Date(booking.checkedOutAt), 'MMM d, yyyy h:mm a')}
                      </span>
                    </div>
                  )}
                </div>
              </Card>

              {/* Check-in Code */}
              {booking.status === 'payment_completed' && booking.checkInCode && (
                <Card className="p-6 rounded-2xl border-primary/20 bg-primary/5">
                  <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Key className="h-4 w-4" />
                    Check-in Code
                  </h3>
                  <p className="text-2xl font-mono font-bold text-center py-4 bg-background rounded-lg border border-border/60">
                    {booking.checkInCode}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Guest should provide this code during check-in
                  </p>
                </Card>
              )}

              {/* Booking Timeline */}
              <Card className="p-6 rounded-2xl">
                <h3 className="font-semibold text-foreground mb-4">Timeline</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Created</p>
                    <p className="text-sm font-semibold">{format(new Date(booking.createdAt), 'MMM d, yyyy h:mm a')}</p>
                  </div>
                  {booking.approvedAt && (
                    <div>
                      <p className="text-xs text-muted-foreground">Approved</p>
                      <p className="text-sm font-semibold">{format(new Date(booking.approvedAt), 'MMM d, yyyy h:mm a')}</p>
                    </div>
                  )}
                  {booking.paymentCompletedAt && (
                    <div>
                      <p className="text-xs text-muted-foreground">Payment Completed</p>
                      <p className="text-sm font-semibold">
                        {format(new Date(booking.paymentCompletedAt), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                  )}
                  {booking.checkedInAt && (
                    <div>
                      <p className="text-xs text-muted-foreground">Checked In</p>
                      <p className="text-sm font-semibold">{format(new Date(booking.checkedInAt), 'MMM d, yyyy h:mm a')}</p>
                    </div>
                  )}
                  {booking.checkedOutAt && (
                    <div>
                      <p className="text-xs text-muted-foreground">Checked Out</p>
                      <p className="text-sm font-semibold">
                        {format(new Date(booking.checkedOutAt), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Check-in Dialog */}
      <Dialog open={isCheckInDialogOpen} onOpenChange={setIsCheckInDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Guest Check-in</DialogTitle>
            <DialogDescription>
              Enter the check-in code provided by the guest for booking #{booking.id.slice(0, 8)}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Check-in Code</label>
              <Input
                placeholder="Enter check-in code"
                value={checkInCode}
                onChange={(e) => setCheckInCode(e.target.value.toUpperCase())}
                className="mt-1 text-center text-2xl font-mono tracking-widest"
                maxLength={10}
              />
              <p className="text-xs text-muted-foreground mt-2">
                Expected code: <span className="font-mono font-semibold">{booking.checkInCode}</span>
              </p>
            </div>
            {booking && (
              <div className="text-sm text-muted-foreground space-y-1 p-4 bg-muted rounded-lg">
                <p>Guest: {booking.userName}</p>
                <p>Room: {booking.roomName}</p>
                <p>Check-in: {format(new Date(booking.checkInDate), 'MMM d, yyyy')}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCheckInDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCheckIn}>Check In</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Check-out Dialog */}
      <Dialog open={isCheckOutDialogOpen} onOpenChange={setIsCheckOutDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Guest Check-out</DialogTitle>
            <DialogDescription>
              Are you sure you want to check out {booking.userName} from {booking.roomName}?
            </DialogDescription>
          </DialogHeader>
          {booking && (
            <div className="text-sm text-muted-foreground space-y-1 p-4 bg-muted rounded-lg">
              <p>Guest: {booking.userName}</p>
              <p>Room: {booking.roomName}</p>
              <p>Check-in: {format(new Date(booking.checkInDate), 'MMM d, yyyy')}</p>
              <p>Check-out: {format(new Date(booking.checkOutDate), 'MMM d, yyyy')}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCheckOutDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCheckOut}>Check Out</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Booking Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Booking</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this booking. The guest will be notified.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Rejection Reason</label>
              <Textarea
                placeholder="e.g., Room unavailable, dates conflict, etc."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="mt-1"
                rows={4}
              />
            </div>
            {booking && (
              <div className="text-sm text-muted-foreground space-y-1 p-4 bg-muted rounded-lg">
                <p>Guest: {booking.userName}</p>
                <p>Room: {booking.roomName}</p>
                <p>
                  Dates: {format(new Date(booking.checkInDate), 'MMM d')} -{' '}
                  {format(new Date(booking.checkOutDate), 'MMM d, yyyy')}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRejectBooking}>
              Reject Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
