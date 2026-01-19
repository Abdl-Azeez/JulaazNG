import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  DollarSign,
  TrendingUp,
  Calendar,
  Download,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Header } from '@/widgets/header'
import { Sidebar } from '@/widgets/sidebar'
import { Footer } from '@/widgets/footer'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
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
import { mockHotelBookings, mockHotels } from '@/__mocks__/data/hotels.mock'
import { ROUTES } from '@/shared/constants/routes'
// import { cn } from '@/shared/lib/utils/cn'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
// import type { HotelBooking } from '@/shared/types/hotel.types'

const ITEMS_PER_PAGE = 10

export function HotelManagerEarningsPage() {
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [periodFilter, setPeriodFilter] = useState<'all' | 'today' | 'week' | 'month' | 'year'>('all')
  const [hotelFilter, setHotelFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)

  const handleProfileClick = () => {
    navigate(ROUTES.PROFILE)
  }

  // Filter bookings for current hotel manager
  const currentManagerId = 'manager-1' // This should come from auth store
  const myHotelIds = useMemo(() => {
    return mockHotels.filter((h) => h.hotelManagerId === currentManagerId).map((h) => h.id)
  }, [currentManagerId])

  const bookings = useMemo(() => {
    return mockHotelBookings.filter(
      (b) => b.paymentStatus === 'completed' && myHotelIds.includes(b.hotelId)
    )
  }, [myHotelIds])

  const filteredBookings = useMemo(() => {
    let filtered = bookings

    if (hotelFilter !== 'all') {
      filtered = filtered.filter((b) => b.hotelId === hotelFilter)
    }

    if (periodFilter === 'all') {
      return filtered.sort((a, b) => {
        const dateA = new Date(b.paymentCompletedAt || b.createdAt)
        const dateB = new Date(a.paymentCompletedAt || a.createdAt)
        return dateA.getTime() - dateB.getTime()
      })
    }

    // Helper function to extract date string (YYYY-MM-DD) from ISO date string
    const getDateStringFromISO = (isoString: string): string => {
      return isoString.split('T')[0] // Extract YYYY-MM-DD from ISO string
    }

    // Helper function to get date string from Date object (using UTC to avoid timezone issues)
    const getDateString = (date: Date): string => {
      const year = date.getUTCFullYear()
      const month = String(date.getUTCMonth() + 1).padStart(2, '0')
      const day = String(date.getUTCDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }

    const now = new Date()
    const todayStr = getDateString(now)
    
    if (periodFilter === 'today') {
      filtered = filtered.filter((b) => {
        const dateStr = b.paymentCompletedAt || b.createdAt
        const paymentDateStr = getDateStringFromISO(dateStr)
        return paymentDateStr === todayStr
      })
    } else if (periodFilter === 'week') {
      const weekAgo = new Date(now)
      weekAgo.setUTCDate(weekAgo.getUTCDate() - 7)
      const weekAgoStr = getDateString(weekAgo)
      
      filtered = filtered.filter((b) => {
        const dateStr = b.paymentCompletedAt || b.createdAt
        const paymentDateStr = getDateStringFromISO(dateStr)
        return paymentDateStr >= weekAgoStr && paymentDateStr <= todayStr
      })
    } else if (periodFilter === 'month') {
      const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
      const startOfMonthStr = getDateString(startOfMonth)
      
      filtered = filtered.filter((b) => {
        const dateStr = b.paymentCompletedAt || b.createdAt
        const paymentDateStr = getDateStringFromISO(dateStr)
        return paymentDateStr >= startOfMonthStr && paymentDateStr <= todayStr
      })
    } else if (periodFilter === 'year') {
      const startOfYear = new Date(Date.UTC(now.getUTCFullYear(), 0, 1))
      const startOfYearStr = getDateString(startOfYear)
      
      filtered = filtered.filter((b) => {
        const dateStr = b.paymentCompletedAt || b.createdAt
        const paymentDateStr = getDateStringFromISO(dateStr)
        return paymentDateStr >= startOfYearStr && paymentDateStr <= todayStr
      })
    }

    // Sort by payment date (newest first)
    return filtered.sort((a, b) => {
      const dateA = new Date(b.paymentCompletedAt || b.createdAt)
      const dateB = new Date(a.paymentCompletedAt || a.createdAt)
      return dateA.getTime() - dateB.getTime()
    })
  }, [bookings, periodFilter, hotelFilter])

  const stats = useMemo(() => {
    const totalRevenue = filteredBookings.reduce((sum, b) => sum + b.totalAmount, 0)
    const totalBookings = filteredBookings.length
    const averageBooking = totalBookings > 0 ? totalRevenue / totalBookings : 0

    return {
      totalRevenue,
      totalBookings,
      averageBooking,
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
  }, [periodFilter, hotelFilter])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header onMenuClick={() => setIsSidebarOpen(true)} onProfileClick={handleProfileClick} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1">
        {/* Header Section */}
        <section className="border-b border-border/60 bg-gradient-to-br from-emerald-500/5 via-background to-background">
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
                <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Earnings</h1>
                <p className="text-sm text-muted-foreground mt-1">Track your hotel revenue and bookings</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Cards */}
        <section className="container mx-auto max-w-7xl px-4 lg:px-6 xl:px-8 py-6">
          <div className="grid gap-4 sm:grid-cols-3 mb-6">
            <Card className="p-4 rounded-xl border border-border/60">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <DollarSign className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">₦{(stats.totalRevenue / 1000).toFixed(0)}K</p>
                  <p className="text-xs text-muted-foreground">Total Revenue</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 rounded-xl border border-border/60">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalBookings}</p>
                  <p className="text-xs text-muted-foreground">Total Bookings</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 rounded-xl border border-border/60">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">₦{Math.round(stats.averageBooking).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Average Booking</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <Select value={periodFilter} onValueChange={(val) => setPeriodFilter(val as typeof periodFilter)}>
              <SelectTrigger className="w-[150px] rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Select value={hotelFilter} onValueChange={setHotelFilter}>
              <SelectTrigger className="w-[200px] rounded-xl">
                <SelectValue placeholder="All Hotels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Hotels</SelectItem>
                {mockHotels
                  .filter((h) => h.hotelManagerId === currentManagerId)
                  .map((hotel) => (
                    <SelectItem key={hotel.id} value={hotel.id}>
                      {hotel.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Button variant="outline" className="rounded-xl" onClick={() => toast.success('Exporting CSV...')}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>

          {/* Bookings Table */}
          <Card className="rounded-2xl border border-border/60 overflow-hidden">
            <div className="p-6 border-b border-border/60">
              <h2 className="text-xl font-bold text-foreground">Payment History</h2>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Guest</TableHead>
                    <TableHead>Hotel</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Check-in</TableHead>
                    <TableHead>Check-out</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        {booking.paymentCompletedAt
                          ? format(new Date(booking.paymentCompletedAt), 'MMM d, yyyy')
                          : format(new Date(booking.createdAt), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{booking.userName}</p>
                          <p className="text-xs text-muted-foreground">{booking.userEmail}</p>
                        </div>
                      </TableCell>
                      <TableCell>{booking.hotelName}</TableCell>
                      <TableCell>{booking.roomName}</TableCell>
                      <TableCell>{format(new Date(booking.checkInDate), 'MMM d, yyyy')}</TableCell>
                      <TableCell>{format(new Date(booking.checkOutDate), 'MMM d, yyyy')}</TableCell>
                      <TableCell className="text-right font-semibold">
                        ₦{booking.totalAmount.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredBookings.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                        No payments found for this period
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
                  transactions
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
    </div>
  )
}
