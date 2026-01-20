import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Building2,
  MapPin,
  Star,
  ShieldCheck,
  Edit,
  Eye,
  Calendar,
  Image as ImageIcon,
  Plus,
} from 'lucide-react'
import { Header } from '@/widgets/header'
import { Sidebar } from '@/widgets/sidebar'
import { Footer } from '@/widgets/footer'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { Checkbox } from '@/shared/ui/checkbox'
import { mockHotels, mockHotelRooms } from '@/__mocks__/data/hotels.mock'
import { ROUTES } from '@/shared/constants/routes'
import { cn } from '@/shared/lib/utils/cn'

export function HotelManagerHotelDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  const hotel = mockHotels.find((h) => h.id === id)
  const rooms = id ? mockHotelRooms[id] || [] : []

  const handleProfileClick = () => {
    navigate(ROUTES.PROFILE)
  }

  if (!hotel) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header onMenuClick={() => setIsSidebarOpen(true)} onProfileClick={handleProfileClick} />
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className="flex-1 flex items-center justify-center">
          <Card className="p-12 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">Hotel not found</h2>
            <Button onClick={() => navigate(ROUTES.HOTEL_MANAGER_HOTELS)}>Back to Hotels</Button>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  const images = hotel.images || []
  const hasMultipleImages = images.length > 1

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
              onClick={() => navigate(ROUTES.HOTEL_MANAGER_HOTELS)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Hotels
            </Button>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl lg:text-3xl font-bold text-foreground">{hotel.name}</h1>
                  {hotel.isHalal && (
                    <Badge className="bg-emerald-500/90 text-white border-0 flex items-center gap-1">
                      <ShieldCheck className="h-4 w-4" />
                      Halal
                    </Badge>
                  )}
                  <Badge
                    className={cn(
                      'rounded-full',
                      hotel.status === 'active'
                        ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                        : hotel.status === 'pending'
                          ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                          : 'bg-red-500/10 text-red-600 border-red-500/20'
                    )}
                  >
                    {hotel.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{hotel.address}, {hotel.city}, {hotel.state}</span>
                </div>
              </div>
              <Button onClick={() => navigate(ROUTES.HOTEL_MANAGER_HOTEL_CREATE)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Hotel
              </Button>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="container mx-auto max-w-7xl px-4 lg:px-6 xl:px-8 py-8 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Images */}
              <Card className="p-6 rounded-2xl">
                <h2 className="text-xl font-bold text-foreground mb-4">Hotel Images</h2>
                {images.length > 0 ? (
                  <div className="space-y-4">
                    <div className="relative h-64 rounded-lg overflow-hidden">
                      <img
                        src={images[activeImageIndex]}
                        alt={hotel.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {hasMultipleImages && (
                      <div className="grid grid-cols-4 gap-2">
                        {images.map((img, index) => (
                          <button
                            key={index}
                            onClick={() => setActiveImageIndex(index)}
                            className={cn(
                              'relative h-20 rounded-lg overflow-hidden border-2 transition-all',
                              index === activeImageIndex
                                ? 'border-primary'
                                : 'border-transparent opacity-60 hover:opacity-100'
                            )}
                          >
                            <img src={img} alt={`${hotel.name} ${index + 1}`} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-64 rounded-lg bg-muted flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </Card>

              {/* Description */}
              <Card className="p-6 rounded-2xl">
                <h2 className="text-xl font-bold text-foreground mb-4">Description</h2>
                <p className="text-muted-foreground leading-relaxed">{hotel.description}</p>
              </Card>

              {/* Facilities */}
              <Card className="p-6 rounded-2xl">
                <h2 className="text-xl font-bold text-foreground mb-4">Facilities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {hotel.facilities.map((facility) => (
                    <div key={facility} className="flex items-center gap-2">
                      <Checkbox checked readOnly />
                      <span className="text-sm">{facility}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Halal Features */}
              {hotel.isHalal && hotel.halalFeatures && hotel.halalFeatures.length > 0 && (
                <Card className="p-6 rounded-2xl border-emerald-500/20 bg-emerald-500/5">
                  <div className="flex items-center gap-2 mb-4">
                    <ShieldCheck className="h-5 w-5 text-emerald-600" />
                    <h2 className="text-xl font-bold text-foreground">Halal Features</h2>
                  </div>
                  <ul className="space-y-2">
                    {hotel.halalFeatures.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              {/* Rooms */}
              <Card className="p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-foreground">Room Types</h2>
                  <Button size="sm" variant="outline" onClick={() => navigate(ROUTES.HOTEL_MANAGER_HOTEL_CREATE)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Room
                  </Button>
                </div>
                <div className="space-y-4">
                  {rooms.map((room) => (
                    <div key={room.id} className="p-4 rounded-xl border border-border/60">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-foreground">{room.name}</h3>
                          <p className="text-sm text-muted-foreground">{room.description}</p>
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {room.type}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Price:</span>
                          <p className="font-semibold">₦{room.pricePerNight.toLocaleString()}/night</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Max Guests:</span>
                          <p className="font-semibold">{room.maxOccupancy}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Bed Type:</span>
                          <p className="font-semibold">{room.bedType}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Available:</span>
                          <p className="font-semibold">
                            {room.availableRooms} / {room.totalRooms}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {rooms.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No room types added yet</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Quick Stats */}
              <Card className="p-6 rounded-2xl">
                <h3 className="font-semibold text-foreground mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Total Rooms</span>
                    <p className="text-2xl font-bold">
                      {rooms.reduce((sum, r) => sum + r.totalRooms, 0)}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Available Rooms</span>
                    <p className="text-2xl font-bold">
                      {rooms.reduce((sum, r) => sum + r.availableRooms, 0)}
                    </p>
                  </div>
                  {hotel.rating && (
                    <div>
                      <span className="text-sm text-muted-foreground">Rating</span>
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <p className="text-2xl font-bold">{hotel.rating.toFixed(1)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {/* Actions */}
              <Card className="p-6 rounded-2xl">
                <h3 className="font-semibold text-foreground mb-4">Actions</h3>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate(ROUTES.HOTEL_MANAGER_BOOKINGS)}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    View Bookings
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate(ROUTES.HOTEL_MANAGER_HOTEL_CREATE)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Hotel
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate(ROUTES.HOTEL_DETAILS(hotel.id))}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Public Page
                  </Button>
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
