import { useEffect, useMemo, useState } from 'react'
import { LayoutGrid, List, MapPin, SlidersHorizontal, ShieldCheck } from 'lucide-react'
import { Header } from '@/widgets/header'
import { Footer } from '@/widgets/footer'
import { SearchBar } from '@/widgets/search-bar'
import { HotelCard } from '@/widgets/hotel-card'
import { AuthDialog } from '@/widgets/auth-dialog'
import { Sidebar } from '@/widgets/sidebar'
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
import { Checkbox } from '@/shared/ui/checkbox'
import { mockHotels } from '@/__mocks__/data/hotels.mock'
import { ROUTES } from '@/shared/constants/routes'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/shared/store/auth.store'
import { cn } from '@/shared/lib/utils/cn'
import type { Hotel, HotelSearchFilters } from '@/shared/types/hotel.types'

type LayoutType = 'grid' | 'row'

export function HotelsPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [layout, setLayout] = useState<LayoutType>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<HotelSearchFilters>({
    city: '',
    isHalal: undefined,
    rating: undefined,
  })

  // Get user location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.error('Error getting location:', error)
          setLocationError('Unable to get your location')
        }
      )
    } else {
      setLocationError('Geolocation is not supported by your browser')
    }
  }, [])

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371 // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLng = ((lng2 - lng1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const filteredAndSortedHotels = useMemo(() => {
    let filtered = [...mockHotels]

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (hotel) =>
          hotel.name.toLowerCase().includes(query) ||
          hotel.address.toLowerCase().includes(query) ||
          hotel.city.toLowerCase().includes(query) ||
          hotel.description.toLowerCase().includes(query)
      )
    }

    // Filter by city
    if (filters.city) {
      filtered = filtered.filter((hotel) => hotel.city.toLowerCase() === filters.city?.toLowerCase())
    }

    // Filter by halal
    if (filters.isHalal !== undefined) {
      filtered = filtered.filter((hotel) => hotel.isHalal === filters.isHalal)
    }

    // Filter by rating
    if (filters.rating) {
      filtered = filtered.filter((hotel) => hotel.rating && hotel.rating >= filters.rating!)
    }

    // Sort hotels
    if (userLocation) {
      // Sort by distance from user location
      filtered = filtered
        .map((hotel) => {
          if (hotel.latitude && hotel.longitude) {
            const distance = calculateDistance(
              userLocation.lat,
              userLocation.lng,
              hotel.latitude,
              hotel.longitude
            )
            return { hotel, distance }
          }
          return { hotel, distance: Infinity }
        })
        .sort((a, b) => a.distance - b.distance)
        .map((item) => item.hotel)
    } else {
      // Sort by most booked (using rating as proxy) or random
      filtered.sort((a, b) => {
        const aRating = a.rating || 0
        const bRating = b.rating || 0
        return bRating - aRating
      })
    }

    return filtered
  }, [searchQuery, filters, userLocation])

  const uniqueCities = useMemo(() => {
    const cities = new Set(mockHotels.map((hotel) => hotel.city))
    return Array.from(cities).sort()
  }, [])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleHotelSelect = (hotelId: string) => {
    navigate(ROUTES.HOTEL_DETAILS(hotelId))
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header onMenuClick={() => setIsSidebarOpen(true)} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="border-b border-border/60 bg-gradient-to-br from-primary/5 via-background to-background">
          <div className="container mx-auto max-w-7xl px-4 lg:px-6 xl:px-8 py-8 lg:py-12">
            <div className="space-y-6">
              <div className="text-center space-y-3">
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
                  Find Your Perfect Hotel Stay
                </h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Discover amazing hotels with premium amenities, comfortable rooms, and excellent service
                </p>
              </div>

              {/* Search Bar */}
              <div className="max-w-3xl mx-auto">
                <SearchBar
                  placeholder="Search hotels by name, location, or city..."
                  onSearch={handleSearch}
                  value={searchQuery}
                  onChange={setSearchQuery}
                />
              </div>

              {/* Quick Filters */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Select
                  value={filters.city || 'all'}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, city: value === 'all' ? undefined : value }))
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Cities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cities</SelectItem>
                    {uniqueCities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  variant={filters.isHalal === true ? 'default' : 'outline'}
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      isHalal: prev.isHalal === true ? undefined : true,
                    }))
                  }
                  className="gap-2"
                >
                  <ShieldCheck className="h-4 w-4" />
                  Halal Only
                </Button>

                <Button
                  variant={showFilters ? 'default' : 'outline'}
                  onClick={() => setShowFilters(!showFilters)}
                  className="gap-2"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  More Filters
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    variant={layout === 'grid' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setLayout('grid')}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={layout === 'row' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setLayout('row')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Location Status */}
              {userLocation && (
                <div className="text-center">
                  <Badge variant="outline" className="gap-2">
                    <MapPin className="h-3 w-3" />
                    Showing hotels near you
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Filters Panel */}
        {showFilters && (
          <section className="border-b border-border/60 bg-muted/30">
            <div className="container mx-auto max-w-7xl px-4 lg:px-6 xl:px-8 py-6">
              <Card className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <label className="text-sm font-semibold">Minimum Rating</label>
                    <Select
                      value={filters.rating?.toString() || 'all'}
                      onValueChange={(value) =>
                        setFilters((prev) => ({
                          ...prev,
                          rating: value === 'all' ? undefined : parseFloat(value),
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Any Rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any Rating</SelectItem>
                        <SelectItem value="4.5">4.5+ Stars</SelectItem>
                        <SelectItem value="4.0">4.0+ Stars</SelectItem>
                        <SelectItem value="3.5">3.5+ Stars</SelectItem>
                        <SelectItem value="3.0">3.0+ Stars</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-semibold">Facilities</label>
                    <div className="space-y-2">
                      {['WiFi', 'Swimming Pool', 'Gym', 'Restaurant', 'Spa', 'Parking'].map((facility) => (
                        <div key={facility} className="flex items-center gap-2">
                          <Checkbox id={`facility-${facility}`} />
                          <label htmlFor={`facility-${facility}`} className="text-sm cursor-pointer">
                            {facility}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-semibold">Price Range</label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        className="flex-1"
                        onChange={(e) => {
                          const value = e.target.value ? parseFloat(e.target.value) : undefined
                          setFilters((prev) => ({ ...prev, minPrice: value }))
                        }}
                      />
                      <Input
                        type="number"
                        placeholder="Max"
                        className="flex-1"
                        onChange={(e) => {
                          const value = e.target.value ? parseFloat(e.target.value) : undefined
                          setFilters((prev) => ({ ...prev, maxPrice: value }))
                        }}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </section>
        )}

        {/* Hotels Grid/List */}
        <section className="container mx-auto max-w-7xl px-4 lg:px-6 xl:px-8 py-8 lg:py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              {filteredAndSortedHotels.length} {filteredAndSortedHotels.length === 1 ? 'Hotel' : 'Hotels'} Found
            </h2>
          </div>

          {filteredAndSortedHotels.length > 0 ? (
            <div
              className={cn(
                'gap-6',
                layout === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                  : 'flex flex-col'
              )}
            >
              {filteredAndSortedHotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} onSelect={handleHotelSelect} layout={layout} />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No hotels found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or filters
              </p>
            </Card>
          )}
        </section>
      </main>

      <Footer />
      <AuthDialog open={isDrawerOpen} onOpenChange={setIsDrawerOpen} />
    </div>
  )
}
