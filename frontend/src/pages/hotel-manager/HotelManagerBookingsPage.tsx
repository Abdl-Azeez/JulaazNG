import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  Filter,
  Search,
  Eye,
  Key,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Header } from '@/widgets/header'
import { Sidebar } from '@/widgets/sidebar'
import { Footer } from '@/widgets/footer'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { Input } from '@/shared/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { Textarea } from '@/shared/ui/textarea'
import { mockHotelBookings, mockHotels } from '@/__mocks__/data/hotels.mock'
import { ROUTES } from '@/shared/constants/routes'
import { cn } from '@/shared/lib/utils/cn'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import type { HotelBooking } from '@/shared/types/hotel.types'

const ITEMS_PER_PAGE = 10

export function HotelManagerBookingsPage() {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState<HotelBooking[]>(mockHotelBookings)
  const [selectedBooking, setSelectedBooking] = useState<HotelBooking | null>(null)
  const [checkInCode, setCheckInCode] = useState('')
  const [rejectionReason, setRejectionReason] = useState('')
  const [isCheckInDialogOpen, setIsCheckInDialogOpen] = useState(false)
  const [isCheckOutDialogOpen, setIsCheckOutDialogOpen] = useState(false)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [hotelFilter, setHotelFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)

  const handleProfileClick = () => {
    navigate(ROUTES.PROFILE)
  }

  // Filter bookings by hotel manager's hotels
  // In real app, this would use the current logged-in hotel manager's ID
  const currentManagerId = 'manager-1' // This should come from auth store
  const myHotelIds = useMemo(() => {
    return mockHotels.filter((h) => h.hotelManagerId === currentManagerId).map((h) => h.id)
  }, [currentManagerId])

  const myBookings = useMemo(() => {
    return bookings.filter((b) => myHotelIds.includes(b.hotelId))
  }, [bookings, myHotelIds])

  const filteredBookings = useMemo(() => {
    let filtered = myBookings

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (b) =>
          b.userName.toLowerCase().includes(query) ||
          b.userEmail.toLowerCase().includes(query) ||
          b.hotelName.toLowerCase().includes(query) ||
          b.roomName.toLowerCase().includes(query) ||
          b.id.toLowerCase().includes(query)
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((b) => b.status === statusFilter)
    }

    if (hotelFilter !== 'all') {
      filtered = filtered.filter((b) => b.hotelId === hotelFilter)
    }

    return filtered.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  }, [myBookings, searchQuery, statusFilter, hotelFilter])

  const stats = useMemo(() => {
    return {
      total: filteredBookings.length,
      pending: filteredBookings.filter((b) => b.approvalStatus === 'pending').length,
      approved: filteredBookings.filter((b) => b.approvalStatus === 'approved').length,
      checkedIn: filteredBookings.filter((b) => b.status === 'checked_in').length,
      checkedOut: filteredBookings.filter((b) => b.status === 'checked_out').length,
    }
  }, [filteredBookings])

  // Pagination
  const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE)
  const paginatedBookings = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredBookings.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filteredBookings, currentPage])

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, statusFilter, hotelFilter])

  const handleApproveBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              approvalStatus: 'approved' as const,
              status: 'payment_pending' as const,
              approvedBy: 'hotel_manager',
              approvedAt: new Date().toISOString(),
              paymentDeadline: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // 48 hours
            }
          : b
      )
    )
    toast.success('Booking approved. User has 48 hours to complete payment.')
  }

  const handleRejectBooking = () => {
    if (!selectedBooking || !rejectionReason.trim()) {
      toast.error('Please provide a rejection reason')
      return
    }

    setBookings((prev) =>
      prev.map((b) =>
        b.id === selectedBooking.id
          ? {
              ...b,
              approvalStatus: 'rejected' as const,
              status: 'rejected' as const,
              rejectionReason: rejectionReason,
            }
          : b
      )
    )
    toast.success('Booking rejected')
    setIsRejectDialogOpen(false)
    setRejectionReason('')
    setSelectedBooking(null)
  }

  const handleCheckIn = () => {
    if (!selectedBooking) return

    if (checkInCode !== selectedBooking.checkInCode) {
      toast.error('Invalid check-in code')
      return
    }

    setBookings((prev) =>
      prev.map((b) =>
        b.id === selectedBooking.id
          ? {
              ...b,
              status: 'checked_in' as const,
              checkedInAt: new Date().toISOString(),
              checkedInBy: 'hotel_manager',
            }
          : b
      )
    )
    toast.success('Guest checked in successfully')
    setIsCheckInDialogOpen(false)
    setCheckInCode('')
    setSelectedBooking(null)
  }

  const handleCheckOut = () => {
    if (!selectedBooking) return

    setBookings((prev) =>
      prev.map((b) =>
        b.id === selectedBooking.id
          ? {
              ...b,
              status: 'checked_out' as const,
              checkedOutAt: new Date().toISOString(),
            }
          : b
      )
    )
    toast.success('Guest checked out successfully')
    setIsCheckOutDialogOpen(false)
    setSelectedBooking(null)
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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header onMenuClick={() => setIsSidebarOpen(true)} onProfileClick={handleProfileClick} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1">
        {/* Header Section */}
        <section className="border-b border-border/60 bg-gradient-to-br from-primary/5 via-background to-background">
          <div className="container mx-auto max-w-7xl px-4 lg:px-6 xl:px-8 py-8 lg:py-10">
            <Button
              variant="ghost"
              className="mb-4 -ml-2"
              onClick={() => navigate(ROUTES.HOTEL_MANAGER_DASHBOARD)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Bookings Management</h1>
                <p className="text-sm text-muted-foreground mt-1">Manage all hotel bookings and guest check-ins</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Cards */}
        <section className="container mx-auto max-w-7xl px-4 lg:px-6 xl:px-8 py-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 mb-6">
            <Card className="p-4 rounded-xl border border-border/60">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">Total Bookings</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 rounded-xl border border-border/60">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                  <p className="text-xs text-muted-foreground">Pending Approval</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 rounded-xl border border-border/60">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.approved}</p>
                  <p className="text-xs text-muted-foreground">Approved</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 rounded-xl border border-border/60">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-green-500/10 text-green-600 flex items-center justify-center">
                  <Key className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.checkedIn}</p>
                  <p className="text-xs text-muted-foreground">Checked In</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 rounded-xl border border-border/60">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gray-500/10 text-gray-600 flex items-center justify-center">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.checkedOut}</p>
                  <p className="text-xs text-muted-foreground">Checked Out</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Filters */}
          <Card className="p-4 rounded-xl border border-border/60 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search bookings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="payment_pending">Payment Pending</SelectItem>
                  <SelectItem value="payment_completed">Payment Completed</SelectItem>
                  <SelectItem value="checked_in">Checked In</SelectItem>
                  <SelectItem value="checked_out">Checked Out</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={hotelFilter} onValueChange={setHotelFilter}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Filter by hotel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Hotels</SelectItem>
                  {mockHotels
                    .filter((h) => myHotelIds.includes(h.id))
                    .map((hotel) => (
                      <SelectItem key={hotel.id} value={hotel.id}>
                        {hotel.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('')
                  setStatusFilter('all')
                  setHotelFilter('all')
                }}
                className="rounded-xl"
              >
                <Filter className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </Card>

          {/* Bookings Table */}
          <Card className="rounded-2xl border border-border/60 overflow-hidden">
            <div className="p-6 border-b border-border/60">
              <h2 className="text-xl font-bold text-foreground">All Bookings</h2>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Guest</TableHead>
                    <TableHead>Hotel</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Check-in</TableHead>
                    <TableHead>Check-out</TableHead>
                    <TableHead>Guests</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-mono text-xs">{booking.id.slice(0, 8)}...</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{booking.userName}</p>
                          <p className="text-xs text-muted-foreground">{booking.userEmail}</p>
                        </div>
                      </TableCell>
                      <TableCell>{booking.hotelName}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{booking.roomName}</p>
                          <p className="text-xs text-muted-foreground capitalize">{booking.roomType}</p>
                        </div>
                      </TableCell>
                      <TableCell>{format(new Date(booking.checkInDate), 'MMM d, yyyy')}</TableCell>
                      <TableCell>{format(new Date(booking.checkOutDate), 'MMM d, yyyy')}</TableCell>
                      <TableCell>{booking.numberOfGuests}</TableCell>
                      <TableCell className="font-semibold">₦{booking.totalAmount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge className={cn('rounded-full', statusColors[booking.status])}>
                          {booking.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {booking.approvalStatus === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleApproveBooking(booking.id)}
                                className="h-8"
                              >
                                <CheckCircle className="h-3.5 w-3.5 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedBooking(booking)
                                  setIsRejectDialogOpen(true)
                                }}
                                className="h-8 text-destructive hover:text-destructive"
                              >
                                <XCircle className="h-3.5 w-3.5 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}
                          {booking.status === 'payment_completed' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedBooking(booking)
                                setIsCheckInDialogOpen(true)
                              }}
                              className="h-8"
                            >
                              <Key className="h-3.5 w-3.5 mr-1" />
                              Check In
                            </Button>
                          )}
                          {booking.status === 'checked_in' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedBooking(booking)
                                setIsCheckOutDialogOpen(true)
                              }}
                              className="h-8"
                            >
                              Check Out
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => navigate(ROUTES.HOTEL_MANAGER_BOOKING_DETAILS(booking.id))}
                            className="h-8"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredBookings.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-12 text-muted-foreground">
                        No bookings found matching your criteria
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-border/60">
                <p className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
                  {Math.min(currentPage * ITEMS_PER_PAGE, filteredBookings.length)} of {filteredBookings.length}{' '}
                  bookings
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
          </Card>
        </section>
      </main>

      <Footer />

      {/* Check-in Dialog */}
      <Dialog open={isCheckInDialogOpen} onOpenChange={setIsCheckInDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Guest Check-in</DialogTitle>
            <DialogDescription>
              Enter the check-in code provided by the guest for booking #{selectedBooking?.id.slice(0, 8)}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Check-in Code</label>
              <Input
                placeholder="Enter check-in code"
                value={checkInCode}
                onChange={(e) => setCheckInCode(e.target.value)}
                className="mt-1"
              />
            </div>
            {selectedBooking && (
              <div className="text-sm text-muted-foreground">
                <p>Guest: {selectedBooking.userName}</p>
                <p>Room: {selectedBooking.roomName}</p>
                <p>Check-in: {format(new Date(selectedBooking.checkInDate), 'MMM d, yyyy')}</p>
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
              Are you sure you want to check out {selectedBooking?.userName} from {selectedBooking?.roomName}?
            </DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Guest: {selectedBooking.userName}</p>
              <p>Room: {selectedBooking.roomName}</p>
              <p>Check-in: {format(new Date(selectedBooking.checkInDate), 'MMM d, yyyy')}</p>
              <p>Check-out: {format(new Date(selectedBooking.checkOutDate), 'MMM d, yyyy')}</p>
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
            {selectedBooking && (
              <div className="text-sm text-muted-foreground">
                <p>Guest: {selectedBooking.userName}</p>
                <p>Room: {selectedBooking.roomName}</p>
                <p>Dates: {format(new Date(selectedBooking.checkInDate), 'MMM d')} - {format(new Date(selectedBooking.checkOutDate), 'MMM d, yyyy')}</p>
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
