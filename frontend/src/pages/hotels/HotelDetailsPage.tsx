import { useState, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Share2,
  MapPin,
  Star,
  ShieldCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Bed,
  Users,
  Wifi,
  Car,
  Utensils,
  Dumbbell,
  Waves,
//   Calendar,
//   Clock,
} from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import { Card } from '@/shared/ui/card'
import { Footer } from '@/widgets/footer'
import { Sidebar } from '@/widgets/sidebar'
import { AuthDialog } from '@/widgets/auth-dialog'
import { Header } from '@/widgets/header'
import { useAuthStore } from '@/shared/store/auth.store'
import { mockHotels, mockHotelRooms } from '@/__mocks__/data/hotels.mock'
import { cn } from '@/shared/lib/utils/cn'
import { ROUTES } from '@/shared/constants/routes'
import toast from 'react-hot-toast'
import type { HotelRoom } from '@/shared/types/hotel.types'

const facilityIcons: Record<string, React.ReactNode> = {
  WiFi: <Wifi className="h-4 w-4" />,
  Parking: <Car className="h-4 w-4" />,
  Restaurant: <Utensils className="h-4 w-4" />,
  Gym: <Dumbbell className="h-4 w-4" />,
  'Swimming Pool': <Waves className="h-4 w-4" />,
}

export function HotelDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [selectedRoom, setSelectedRoom] = useState<HotelRoom | null>(null)
  const [checkInDate, setCheckInDate] = useState('')
  const [checkOutDate, setCheckOutDate] = useState('')
  const [numberOfGuests, setNumberOfGuests] = useState(1)
  const [numberOfRooms, setNumberOfRooms] = useState(1)

  const hotel = useMemo(() => {
    return mockHotels.find((h) => h.id === id)
  }, [id])

  const rooms = useMemo(() => {
    if (!id) return []
    return mockHotelRooms[id] || []
  }, [id])

  const images = hotel?.images || []
  const videos = hotel?.videos || []
  const media = [...images, ...videos]
  const hasMultipleMedia = media.length > 1

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1))
  }

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1))
  }

  const handleBookRoom = (room: HotelRoom) => {
    if (!isAuthenticated) {
      setIsDrawerOpen(true)
      return
    }

    if (!checkInDate || !checkOutDate) {
      toast.error('Please select check-in and check-out dates')
      return
    }

    if (new Date(checkOutDate) <= new Date(checkInDate)) {
      toast.error('Check-out date must be after check-in date')
      return
    }

    if (numberOfRooms > room.availableRooms) {
      toast.error(`Only ${room.availableRooms} room(s) available`)
      return
    }

    // Navigate to booking page
    navigate(ROUTES.HOTEL_BOOKING(id!), {
      state: {
        room,
        checkInDate,
        checkOutDate,
        numberOfGuests,
        numberOfRooms,
      },
    })
  }

  const handleShare = () => {
    const shareUrl = `${window.location.origin}${ROUTES.HOTEL_DETAILS(id!)}`
    if (navigator.share) {
      navigator.share({
        title: `Check out ${hotel?.name} on JulaazNG`,
        text: hotel?.description,
        url: shareUrl,
      })
    } else {
      navigator.clipboard.writeText(shareUrl)
      toast.success('Link copied to clipboard')
    }
  }

  if (!hotel) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className="flex-1 flex items-center justify-center">
          <Card className="p-12 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">Hotel not found</h2>
            <p className="text-muted-foreground mb-4">The hotel you're looking for doesn't exist.</p>
            <Button onClick={() => navigate(ROUTES.HOTELS)}>Browse Hotels</Button>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  const nights = checkInDate && checkOutDate
    ? Math.ceil((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24))
    : 0

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header onMenuClick={() => setIsSidebarOpen(true)} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1">
        {/* Hero Image Section */}
        <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
          {media[activeImageIndex] && (
            <img
              src={media[activeImageIndex]}
              alt={hotel.name}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

          {/* Navigation */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            <Button
              variant="secondary"
              size="icon"
              onClick={() => navigate(ROUTES.HOTELS)}
              className="bg-background/90 backdrop-blur-sm"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={handleShare}
              className="bg-background/90 backdrop-blur-sm"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Image Navigation */}
          {hasMultipleMedia && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 z-10"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 z-10"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {media.map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      'h-2 rounded-full transition-all',
                      index === activeImageIndex ? 'w-8 bg-white' : 'w-2 bg-white/50'
                    )}
                  />
                ))}
              </div>
            </>
          )}

          {/* Hotel Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
            <div className="container mx-auto max-w-7xl">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground">{hotel.name}</h1>
                {hotel.isHalal && (
                  <Badge className="bg-emerald-500/90 text-white border-0 shadow-lg flex items-center gap-1">
                    <ShieldCheck className="h-4 w-4" />
                    Halal Certified
                  </Badge>
                )}
                {hotel.rating && (
                  <Badge className="bg-background/90 backdrop-blur-sm flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    {hotel.rating.toFixed(1)}
                    {hotel.reviewCount && ` (${hotel.reviewCount})`}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-foreground/90">
                <MapPin className="h-4 w-4" />
                <span>{hotel.address}, {hotel.city}, {hotel.state}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="container mx-auto max-w-7xl px-4 lg:px-6 xl:px-8 py-8 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <Card className="p-6 rounded-2xl">
                <h2 className="text-2xl font-bold text-foreground mb-4">About</h2>
                <p className="text-muted-foreground leading-relaxed">{hotel.description}</p>
              </Card>

              {/* Halal Features */}
              {hotel.isHalal && hotel.halalFeatures && hotel.halalFeatures.length > 0 && (
                <Card className="p-6 rounded-2xl border-emerald-500/20 bg-emerald-500/5">
                  <div className="flex items-center gap-2 mb-4">
                    <ShieldCheck className="h-5 w-5 text-emerald-600" />
                    <h2 className="text-2xl font-bold text-foreground">Halal Features</h2>
                  </div>
                  <ul className="space-y-2">
                    {hotel.halalFeatures.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              {/* Facilities */}
              <Card className="p-6 rounded-2xl">
                <h2 className="text-2xl font-bold text-foreground mb-4">Facilities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {hotel.facilities.map((facility) => (
                    <div key={facility} className="flex items-center gap-2">
                      {facilityIcons[facility] || <CheckCircle2 className="h-4 w-4 text-primary" />}
                      <span className="text-sm text-muted-foreground">{facility}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Rooms */}
              <Card className="p-6 rounded-2xl">
                <h2 className="text-2xl font-bold text-foreground mb-6">Available Rooms</h2>
                <div className="space-y-6">
                  {rooms.map((room) => (
                    <div
                      key={room.id}
                      className={cn(
                        'p-6 rounded-xl border transition-all',
                        selectedRoom?.id === room.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/40'
                      )}
                    >
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Room Image */}
                        {room.images.length > 0 && (
                          <div className="lg:w-48 h-32 rounded-lg overflow-hidden">
                            <img
                              src={room.images[0]}
                              alt={room.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        {/* Room Details */}
                        <div className="flex-1 space-y-4">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-xl font-semibold text-foreground">{room.name}</h3>
                              <Badge variant="outline" className="capitalize">
                                {room.type}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{room.description}</p>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Bed className="h-4 w-4" />
                                {room.bedType}
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                Up to {room.maxOccupancy} guests
                              </div>
                              <span>{room.size}</span>
                            </div>
                          </div>

                          {/* Amenities */}
                          {room.amenities.length > 0 && (
                            <div>
                              <p className="text-sm font-semibold text-foreground mb-2">Room Amenities:</p>
                              <div className="flex flex-wrap gap-2">
                                {room.amenities.map((amenity) => (
                                  <Badge key={amenity} variant="outline" className="text-xs">
                                    {amenity}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Available Services */}
                          {room.availableServices.length > 0 && (
                            <div>
                              <p className="text-sm font-semibold text-foreground mb-2">Available Services:</p>
                              <div className="flex flex-wrap gap-2">
                                {room.availableServices.map((service) => (
                                  <Badge key={service} variant="outline" className="text-xs bg-primary/5">
                                    {service}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Availability */}
                          <div className="flex items-center justify-between pt-4 border-t border-border">
                            <div>
                              <p className="text-sm text-muted-foreground">
                                {room.availableRooms} of {room.totalRooms} rooms available
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-primary">
                                ₦{room.pricePerNight.toLocaleString()}
                                <span className="text-sm font-normal text-muted-foreground">/night</span>
                              </p>
                              {nights > 0 && (
                                <p className="text-sm text-muted-foreground">
                                  Total: ₦{(room.pricePerNight * nights * numberOfRooms).toLocaleString()} ({nights} nights)
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Booking Sidebar */}
            <div className="lg:col-span-1">
              <Card className="p-6 rounded-2xl sticky top-4">
                <h3 className="text-xl font-bold text-foreground mb-6">Book Your Stay</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-foreground mb-2 block">Check-in</label>
                    <input
                      type="date"
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-foreground mb-2 block">Check-out</label>
                    <input
                      type="date"
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      min={checkInDate || new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-foreground mb-2 block">Guests</label>
                    <input
                      type="number"
                      min="1"
                      value={numberOfGuests}
                      onChange={(e) => setNumberOfGuests(parseInt(e.target.value) || 1)}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-foreground mb-2 block">Rooms</label>
                    <input
                      type="number"
                      min="1"
                      value={numberOfRooms}
                      onChange={(e) => setNumberOfRooms(parseInt(e.target.value) || 1)}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background"
                    />
                  </div>
                  {rooms.length > 0 && (
                    <div>
                      <label className="text-sm font-semibold text-foreground mb-2 block">Select Room</label>
                      <select
                        value={selectedRoom?.id || ''}
                        onChange={(e) => {
                          const room = rooms.find((r) => r.id === e.target.value)
                          setSelectedRoom(room || null)
                        }}
                        className="w-full px-4 py-2 rounded-lg border border-border bg-background"
                      >
                        <option value="">Select a room</option>
                        {rooms.map((room) => (
                          <option key={room.id} value={room.id}>
                            {room.name} - ₦{room.pricePerNight.toLocaleString()}/night
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={() => {
                      if (selectedRoom) {
                        handleBookRoom(selectedRoom)
                      } else {
                        toast.error('Please select a room')
                      }
                    }}
                    disabled={!selectedRoom || !checkInDate || !checkOutDate}
                  >
                    Book Now
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Booking requires approval from hotel manager
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <AuthDialog open={isDrawerOpen} onOpenChange={setIsDrawerOpen} />
    </div>
  )
}
