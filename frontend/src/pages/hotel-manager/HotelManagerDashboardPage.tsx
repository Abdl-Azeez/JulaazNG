import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Building2,
  Calendar,
  Clock,
  DollarSign,
  TrendingUp,
  Users,
  Plus,
  ArrowRight,
  Hotel,
  Key,
  CheckCircle,
  XCircle,
  BarChart3,
  Activity,
} from 'lucide-react'
import { Header } from '@/widgets/header'
import { Sidebar } from '@/widgets/sidebar'
import { Footer } from '@/widgets/footer'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { mockHotelBookings, mockHotels, mockHotelRooms } from '@/__mocks__/data/hotels.mock'
import { ROUTES } from '@/shared/constants/routes'
import { cn } from '@/shared/lib/utils/cn'
import { format } from 'date-fns'
import type { HotelBooking } from '@/shared/types/hotel.types'

export function HotelManagerDashboardPage() {
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // In real app, this would use the current logged-in hotel manager's ID
  const currentManagerId = 'manager-1' // This should come from auth store
  const myHotels = useMemo(() => {
    return mockHotels.filter((h) => h.hotelManagerId === currentManagerId)
  }, [currentManagerId])

  const myHotelIds = useMemo(() => {
    return myHotels.map((h) => h.id)
  }, [myHotels])

  const bookings = useMemo(() => {
    return mockHotelBookings.filter((b) => myHotelIds.includes(b.hotelId))
  }, [myHotelIds])

  const handleProfileClick = () => {
    navigate(ROUTES.PROFILE)
  }

  // Calculate stats
  const stats = useMemo(() => {
    const totalBookings = bookings.length
    const pendingApproval = bookings.filter((b) => b.approvalStatus === 'pending').length
    const approved = bookings.filter((b) => b.approvalStatus === 'approved').length
    const checkedIn = bookings.filter((b) => b.status === 'checked_in').length
    const checkedOut = bookings.filter((b) => b.status === 'checked_out').length
    const totalRevenue = bookings
      .filter((b) => b.paymentStatus === 'completed')
      .reduce((sum, b) => sum + b.totalAmount, 0)
    const monthlyRevenue = bookings
      .filter((b) => {
        if (b.paymentStatus !== 'completed' || !b.paymentCompletedAt) return false
        const paymentDate = new Date(b.paymentCompletedAt)
        const now = new Date()
        return paymentDate.getMonth() === now.getMonth() && paymentDate.getFullYear() === now.getFullYear()
      })
      .reduce((sum, b) => sum + b.totalAmount, 0)

    // Calculate occupancy rate
    const totalRooms = myHotels.reduce((sum, hotel) => {
      const hotelRooms = mockHotelRooms[hotel.id] || []
      return sum + hotelRooms.reduce((roomSum, room) => roomSum + room.totalRooms, 0)
    }, 0)
    const occupiedRooms = checkedIn
    const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0

    return {
      totalBookings,
      pendingApproval,
      approved,
      checkedIn,
      checkedOut,
      totalRevenue,
      monthlyRevenue,
      occupancyRate,
      totalHotels: myHotels.length,
      totalRooms,
    }
  }, [bookings, myHotels])

  // Recent bookings (last 5)
  const recentBookings = useMemo(() => {
    return bookings
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
  }, [bookings])

  // Upcoming check-ins (next 7 days)
  const upcomingCheckIns = useMemo(() => {
    const today = new Date()
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    return bookings
      .filter((b) => {
        const checkInDate = new Date(b.checkInDate)
        return checkInDate >= today && checkInDate <= nextWeek && b.status !== 'checked_in' && b.status !== 'checked_out' && b.status !== 'cancelled'
      })
      .sort((a, b) => new Date(a.checkInDate).getTime() - new Date(b.checkInDate).getTime())
      .slice(0, 5)
  }, [bookings])

  // Revenue trend (last 6 months - simulated)
  const revenueTrend = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    return months.map((month, index) => {
      // Simulate revenue data
      const baseRevenue = stats.monthlyRevenue
      const variation = (Math.random() * 0.3 - 0.15) * baseRevenue // ±15% variation
      return {
        month,
        revenue: Math.max(0, baseRevenue + variation),
      }
    })
  }, [stats.monthlyRevenue])

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
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Dashboard</h1>
                <p className="text-sm text-muted-foreground mt-1">Overview of your hotel operations</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => navigate(ROUTES.HOTEL_MANAGER_HOTELS)}>
                  <Building2 className="h-4 w-4 mr-2" />
                  My Hotels
                </Button>
                <Button onClick={() => navigate(ROUTES.HOTEL_MANAGER_HOTEL_CREATE)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Hotel
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Cards */}
        <section className="container mx-auto max-w-7xl px-4 lg:px-6 xl:px-8 py-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
            <Card className="p-5 rounded-xl border border-border/60 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="h-12 w-12 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                  <Calendar className="h-6 w-6" />
                </div>
                <Badge variant="outline" className="text-xs">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12%
                </Badge>
              </div>
              <p className="text-2xl font-bold text-foreground">{stats.totalBookings}</p>
              <p className="text-xs text-muted-foreground mt-1">Total Bookings</p>
            </Card>

            <Card className="p-5 rounded-xl border border-border/60 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="h-12 w-12 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <Clock className="h-6 w-6" />
                </div>
                <Badge variant="outline" className="text-xs bg-amber-500/10 text-amber-600">
                  {stats.pendingApproval} pending
                </Badge>
              </div>
              <p className="text-2xl font-bold text-foreground">{stats.pendingApproval}</p>
              <p className="text-xs text-muted-foreground mt-1">Pending Approval</p>
            </Card>

            <Card className="p-5 rounded-xl border border-border/60 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="h-12 w-12 rounded-lg bg-green-500/10 text-green-600 flex items-center justify-center">
                  <Users className="h-6 w-6" />
                </div>
                <Badge variant="outline" className="text-xs bg-green-500/10 text-green-600">
                  {stats.occupancyRate}%
                </Badge>
              </div>
              <p className="text-2xl font-bold text-foreground">{stats.checkedIn}</p>
              <p className="text-xs text-muted-foreground mt-1">Currently Checked In</p>
            </Card>

            <Card className="p-5 rounded-xl border border-border/60 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="h-12 w-12 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <DollarSign className="h-6 w-6" />
                </div>
                <Badge variant="outline" className="text-xs">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +8%
                </Badge>
              </div>
              <p className="text-2xl font-bold text-foreground">₦{(stats.monthlyRevenue / 1000).toFixed(0)}K</p>
              <p className="text-xs text-muted-foreground mt-1">Monthly Revenue</p>
            </Card>
          </div>

          {/* Secondary Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
            <Card className="p-4 rounded-xl border border-border/60">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
                  <Hotel className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xl font-bold">{stats.totalHotels}</p>
                  <p className="text-xs text-muted-foreground">Total Hotels</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 rounded-xl border border-border/60">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xl font-bold">{stats.totalRooms}</p>
                  <p className="text-xs text-muted-foreground">Total Rooms</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 rounded-xl border border-border/60">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-teal-500/10 text-teal-600 flex items-center justify-center">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xl font-bold">{stats.occupancyRate}%</p>
                  <p className="text-xs text-muted-foreground">Occupancy Rate</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 rounded-xl border border-border/60">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xl font-bold">₦{(stats.totalRevenue / 1000000).toFixed(1)}M</p>
                  <p className="text-xs text-muted-foreground">Total Revenue</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left Column - 2/3 width */}
            <div className="lg:col-span-2 space-y-6">
              {/* Revenue Trend Chart */}
              <Card className="rounded-2xl border border-border/60 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Revenue Trend</h3>
                    <p className="text-sm text-muted-foreground">Last 6 months</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.HOTEL_MANAGER_EARNINGS)}>
                    View Details
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
                <div className="h-64 flex items-end justify-between gap-2">
                  {revenueTrend.map((item, index) => {
                    const maxRevenue = Math.max(...revenueTrend.map((r) => r.revenue))
                    const height = (item.revenue / maxRevenue) * 100
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full flex items-end justify-center" style={{ height: '200px' }}>
                          <div
                            className="w-full rounded-t-lg bg-gradient-to-t from-primary/80 to-primary/40 min-h-[20px] transition-all hover:from-primary to-primary/60"
                            style={{ height: `${Math.max(height, 10)}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">{item.month}</p>
                        <p className="text-xs font-semibold">₦{(item.revenue / 1000).toFixed(0)}K</p>
                      </div>
                    )
                  })}
                </div>
              </Card>

              {/* Recent Bookings */}
              <Card className="rounded-2xl border border-border/60 overflow-hidden">
                <div className="p-6 border-b border-border/60 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Recent Bookings</h3>
                    <p className="text-sm text-muted-foreground">Latest booking activities</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.HOTEL_MANAGER_BOOKINGS)}>
                    View All
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
                <div className="divide-y divide-border/60">
                  {recentBookings.length > 0 ? (
                    recentBookings.map((booking) => (
                      <div key={booking.id} className="p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold text-foreground">{booking.userName}</p>
                              <Badge className={cn('rounded-full text-xs', statusColors[booking.status])}>
                                {booking.status.replace('_', ' ')}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{booking.hotelName} • {booking.roomName}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {format(new Date(booking.checkInDate), 'MMM d')} - {format(new Date(booking.checkOutDate), 'MMM d, yyyy')}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-foreground">₦{booking.totalAmount.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">{format(new Date(booking.createdAt), 'MMM d')}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-muted-foreground">
                      <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No bookings yet</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Right Column - 1/3 width */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card className="rounded-2xl border border-border/60 p-6">
                <h3 className="text-lg font-bold text-foreground mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate(ROUTES.HOTEL_MANAGER_BOOKINGS)}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Manage Bookings
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate(ROUTES.HOTEL_MANAGER_HOTELS)}
                  >
                    <Building2 className="h-4 w-4 mr-2" />
                    My Hotels
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate(ROUTES.HOTEL_MANAGER_EARNINGS)}
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    View Earnings
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate(ROUTES.HOTEL_MANAGER_HOTEL_CREATE)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Hotel
                  </Button>
                </div>
              </Card>

              {/* Upcoming Check-ins */}
              <Card className="rounded-2xl border border-border/60 overflow-hidden">
                <div className="p-6 border-b border-border/60">
                  <h3 className="text-lg font-bold text-foreground">Upcoming Check-ins</h3>
                  <p className="text-sm text-muted-foreground">Next 7 days</p>
                </div>
                <div className="divide-y divide-border/60">
                  {upcomingCheckIns.length > 0 ? (
                    upcomingCheckIns.map((booking) => (
                      <div key={booking.id} className="p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-semibold text-foreground text-sm">{booking.userName}</p>
                          <Badge variant="outline" className="text-xs">
                            {format(new Date(booking.checkInDate), 'MMM d')}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{booking.hotelName}</p>
                        <p className="text-xs text-muted-foreground">{booking.roomName}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-muted-foreground">
                      <Key className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No upcoming check-ins</p>
                    </div>
                  )}
                </div>
              </Card>

              {/* My Hotels Summary */}
              <Card className="rounded-2xl border border-border/60 overflow-hidden">
                <div className="p-6 border-b border-border/60 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-foreground">My Hotels</h3>
                  <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.HOTEL_MANAGER_HOTELS)}>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="divide-y divide-border/60">
                  {myHotels.slice(0, 3).map((hotel) => (
                    <div key={hotel.id} className="p-4 hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => navigate(ROUTES.HOTEL_MANAGER_HOTEL_DETAILS(hotel.id))}>
                      <div className="flex items-center gap-3">
                        {hotel.images[0] && (
                          <img
                            src={hotel.images[0]}
                            alt={hotel.name}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-foreground text-sm truncate">{hotel.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{hotel.city}, {hotel.state}</p>
                          <Badge
                            variant="outline"
                            className={cn(
                              'mt-1 text-xs',
                              hotel.status === 'active'
                                ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                                : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                            )}
                          >
                            {hotel.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                  {myHotels.length === 0 && (
                    <div className="p-6 text-center text-muted-foreground">
                      <Hotel className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No hotels yet</p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-3"
                        onClick={() => navigate(ROUTES.HOTEL_MANAGER_HOTEL_CREATE)}
                      >
                        Add Your First Hotel
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
