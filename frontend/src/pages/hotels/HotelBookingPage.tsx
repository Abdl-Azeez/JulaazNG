import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { ArrowLeft, Calendar, Clock, CheckCircle, AlertCircle, CreditCard } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { Header } from '@/widgets/header'
import { Footer } from '@/widgets/footer'
import { Sidebar } from '@/widgets/sidebar'
import { useAuthStore } from '@/shared/store/auth.store'
import { mockHotels, mockHotelRooms } from '@/__mocks__/data/hotels.mock'
import { cn } from '@/shared/lib/utils/cn'
import { ROUTES } from '@/shared/constants/routes'
import toast from 'react-hot-toast'
import { format, differenceInHours } from 'date-fns'
import type { HotelRoom } from '@/shared/types/hotel.types'

export function HotelBookingPage() {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuthStore()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const bookingData = location.state as {
    room: HotelRoom
    checkInDate: string
    checkOutDate: string
    numberOfGuests: number
    numberOfRooms: number
  } | null

  const hotel = mockHotels.find((h) => h.id === id)
  const room = bookingData?.room || (id ? mockHotelRooms[id]?.[0] : null)

  const [bookingStatus, setBookingStatus] = useState<'pending' | 'approved' | 'rejected' | 'payment_pending' | 'payment_completed'>('pending')
  const [paymentDeadline, setPaymentDeadline] = useState<string | null>(null)
  const [timeRemaining, setTimeRemaining] = useState<string>('')

  // Simulate booking submission
  useEffect(() => {
    if (!bookingData) {
      toast.error('Invalid booking data')
      navigate(ROUTES.HOTEL_DETAILS(id!))
      return
    }

    // Simulate API call
    setTimeout(() => {
      setBookingStatus('pending')
      toast.success('Booking request submitted. Waiting for hotel manager approval...')
    }, 1000)
  }, [bookingData, id, navigate])

  // Simulate approval (in real app, this would come from API/webhook)
  useEffect(() => {
    if (bookingStatus === 'pending') {
      // Simulate approval after 3 seconds
      const timer = setTimeout(() => {
        setBookingStatus('approved')
        const deadline = new Date(Date.now() + 48 * 60 * 60 * 1000) // 48 hours
        setPaymentDeadline(deadline.toISOString())
        toast.success('Booking approved! You have 48 hours to complete payment.')
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [bookingStatus])

  // Calculate time remaining for payment
  useEffect(() => {
    if (!paymentDeadline) return

    const interval = setInterval(() => {
      const now = new Date()
      const deadline = new Date(paymentDeadline)
      const hoursRemaining = differenceInHours(deadline, now)

      if (hoursRemaining <= 0) {
        setTimeRemaining('Expired')
        setBookingStatus('rejected')
        return
      }

      const days = Math.floor(hoursRemaining / 24)
      const hours = hoursRemaining % 24
      setTimeRemaining(`${days}d ${hours}h`)
    }, 1000)

    return () => clearInterval(interval)
  }, [paymentDeadline])

  if (!isAuthenticated) {
    navigate(ROUTES.LOGIN)
    return null
  }

  if (!hotel || !room || !bookingData) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className="flex-1 flex items-center justify-center">
          <Card className="p-12 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">Booking not found</h2>
            <Button onClick={() => navigate(ROUTES.HOTELS)}>Browse Hotels</Button>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  const nights = Math.ceil(
    (new Date(bookingData.checkOutDate).getTime() - new Date(bookingData.checkInDate).getTime()) /
      (1000 * 60 * 60 * 24)
  )
  const totalAmount = room.pricePerNight * nights * bookingData.numberOfRooms

  const handlePayment = () => {
    // Simulate payment
    setBookingStatus('payment_completed')
    toast.success('Payment completed successfully! Your booking is confirmed.')
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header onMenuClick={() => setIsSidebarOpen(true)} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1">
        <section className="container mx-auto max-w-4xl px-4 lg:px-6 xl:px-8 py-8 lg:py-12">
          <Button
            variant="ghost"
            className="mb-6 -ml-2"
            onClick={() => navigate(ROUTES.HOTEL_DETAILS(id!))}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Hotel
          </Button>

          <div className="space-y-6">
            {/* Booking Status */}
            <Card className="p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-foreground">Booking Status</h1>
                <Badge
                  className={cn(
                    'rounded-full',
                    bookingStatus === 'pending'
                      ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                      : bookingStatus === 'approved' || bookingStatus === 'payment_pending'
                        ? 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                        : bookingStatus === 'payment_completed'
                          ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                          : 'bg-red-500/10 text-red-600 border-red-500/20'
                  )}
                >
                  {bookingStatus === 'pending' && (
                    <>
                      <Clock className="h-3 w-3 mr-1" />
                      Pending Approval
                    </>
                  )}
                  {bookingStatus === 'approved' && (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Approved
                    </>
                  )}
                  {bookingStatus === 'payment_pending' && (
                    <>
                      <CreditCard className="h-3 w-3 mr-1" />
                      Payment Pending
                    </>
                  )}
                  {bookingStatus === 'payment_completed' && (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Confirmed
                    </>
                  )}
                  {bookingStatus === 'rejected' && (
                    <>
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Rejected
                    </>
                  )}
                </Badge>
              </div>

              {bookingStatus === 'pending' && (
                <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    Your booking request is being reviewed by the hotel manager. You will be notified once it's approved.
                  </p>
                </div>
              )}

              {bookingStatus === 'approved' && paymentDeadline && (
                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-1">
                        Booking Approved!
                      </p>
                      <p className="text-sm text-blue-600 dark:text-blue-400">
                        Complete payment within {timeRemaining} to confirm your booking.
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Time Remaining</p>
                      <p className="text-lg font-bold text-blue-600">{timeRemaining}</p>
                    </div>
                  </div>
                </div>
              )}

              {bookingStatus === 'payment_completed' && (
                <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <p className="text-sm text-emerald-700 dark:text-emerald-300">
                    Your booking is confirmed! You will receive a check-in code via email.
                  </p>
                </div>
              )}
            </Card>

            {/* Booking Details */}
            <Card className="p-6 rounded-2xl">
              <h2 className="text-xl font-bold text-foreground mb-6">Booking Details</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Hotel</p>
                    <p className="font-semibold">{hotel.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Room</p>
                    <p className="font-semibold">{room.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Check-in</p>
                    <p className="font-semibold">{format(new Date(bookingData.checkInDate), 'MMM d, yyyy')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Check-out</p>
                    <p className="font-semibold">{format(new Date(bookingData.checkOutDate), 'MMM d, yyyy')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Guests</p>
                    <p className="font-semibold">{bookingData.numberOfGuests}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Rooms</p>
                    <p className="font-semibold">{bookingData.numberOfRooms}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Payment Summary */}
            <Card className="p-6 rounded-2xl">
              <h2 className="text-xl font-bold text-foreground mb-6">Payment Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Room Rate (per night)</span>
                  <span className="font-semibold">₦{room.pricePerNight.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nights</span>
                  <span className="font-semibold">{nights}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rooms</span>
                  <span className="font-semibold">{bookingData.numberOfRooms}</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-lg font-bold text-primary">₦{totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {(bookingStatus === 'approved' || bookingStatus === 'payment_pending') && (
                <Button
                  className="w-full mt-6"
                  size="lg"
                  onClick={handlePayment}
                  disabled={timeRemaining === 'Expired'}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Complete Payment
                </Button>
              )}

              {timeRemaining === 'Expired' && (
                <div className="mt-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                  <p className="text-sm text-red-600">
                    Payment deadline has expired. Please make a new booking.
                  </p>
                </div>
              )}
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
