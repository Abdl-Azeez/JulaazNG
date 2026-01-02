import { useEffect, useMemo, useState } from 'react'
import { LayoutGrid, List, MapPin, SlidersHorizontal, Sparkles } from 'lucide-react'
import { Header } from '@/widgets/header'
import { Footer } from '@/widgets/footer'
import { SearchBar } from '@/widgets/search-bar'
import { PropertyCard } from '@/widgets/property-card'
import { AuthDialog } from '@/widgets/auth-dialog'
import { Sidebar } from '@/widgets/sidebar'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { sampleProperties } from '@/__mocks__/data/properties.mock'
import { ROUTES } from '@/shared/constants/routes'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/shared/store/auth.store'
import { cn } from '@/shared/lib/utils/cn'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import toast from 'react-hot-toast'
import type { RentTerm } from '@/shared/types/property.types'
import { addRentRequest } from '@/shared/lib/rent-requests'

type LayoutType = 'grid' | 'row'

export function PropertiesPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [layout, setLayout] = useState<LayoutType>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [rentalFilter, setRentalFilter] = useState<'all' | 'long_term' | 'shortlet'>('all')
  const [isRentRequestOpen, setIsRentRequestOpen] = useState(false)
  const [rentRequestForm, setRentRequestForm] = useState({
    location: '',
    rooms: 2,
    rentTerm: 'monthly' as RentTerm,
    furnished: false,
    budgetRange: 'any',
  })
  const [suggestedPropertyIds, setSuggestedPropertyIds] = useState<string[]>([])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const shouldOpen = window.sessionStorage.getItem('openRentRequest')
    if (shouldOpen === '1') {
      window.sessionStorage.removeItem('openRentRequest')
      setIsRentRequestOpen(true)
    }
  }, [])

  const filteredProperties = useMemo(() => {
    return sampleProperties.filter((property) => {
      if (rentalFilter === 'all') return true
      return property.rentalCategories.includes(rentalFilter === 'long_term' ? 'long_term' : 'shortlet')
    })
  }, [rentalFilter])

  const rentalFilterOptions: Array<{ label: string; value: typeof rentalFilter }> = [
    { label: 'All stays', value: 'all' },
    { label: 'Annual lease', value: 'long_term' },
    { label: 'Shortlet ready', value: 'shortlet' },
  ]

  const suggestedProperties = useMemo(() => {
    if (suggestedPropertyIds.length === 0) return []
    const index = new Map(sampleProperties.map((property) => [property.id, property]))
    return suggestedPropertyIds
      .map((id) => index.get(id))
      .filter((property): property is (typeof sampleProperties)[number] => Boolean(property))
  }, [suggestedPropertyIds])

  const handleSearch = (query: string) => {
    navigate(`${ROUTES.PROPERTY_SEARCH}?q=${encodeURIComponent(query)}`)
  }

  const handleShare = (propertyId: string) => {
    const shareUrl = `${window.location.origin}${ROUTES.PROPERTY_DETAILS(propertyId)}`
    if (navigator.share) {
      navigator.share({
        title: 'Check out this property on JulaazNG',
        text: 'I found this amazing property!',
        url: shareUrl,
      })
    } else {
      navigator.clipboard.writeText(shareUrl)
    }
  }

  const handleRequestViewing = (propertyId: string) => {
    if (!isAuthenticated) {
      // Store the intended destination (booking page) for post-login redirect
      const bookingUrl = ROUTES.PROPERTY_BOOKING(propertyId)
      sessionStorage.setItem('intendedDestination', bookingUrl)
      setIsDrawerOpen(true)
      return
    }

    navigate(ROUTES.PROPERTY_BOOKING(propertyId))
  }

  const handleViewDetails = (propertyId: string) => {
    navigate(ROUTES.PROPERTY_DETAILS(propertyId))
  }

  const handleMenuClick = () => {
    setIsSidebarOpen(true)
  }

  const handleProfileClick = () => {
    if (isAuthenticated) {
      navigate(ROUTES.PROFILE)
    } else {
      setIsDrawerOpen(true)
    }
  }

  const handleOpenRentRequest = () => {
    if (!isAuthenticated) {
      setIsDrawerOpen(true)
      toast.error('Please log in to request a rental match')
      return
    }
    setIsRentRequestOpen(true)
  }

  const handleSubmitRentRequest = () => {
    const location = rentRequestForm.location.trim()
    if (!location) {
      toast.error('Please enter a location')
      return
    }

    const request = addRentRequest({
      location,
      rooms: rentRequestForm.rooms,
      rentTerm: rentRequestForm.rentTerm,
      furnished: rentRequestForm.furnished,
      budgetRange: rentRequestForm.budgetRange,
    })

    const wantsFurnished = rentRequestForm.furnished
    const rooms = rentRequestForm.rooms
    const rentTerm = rentRequestForm.rentTerm

    const isFurnishedProperty = (value: { name: string; rentalCategories: string[] }) => {
      return value.rentalCategories.includes('shortlet') || value.name.toLowerCase().includes('furnished')
    }

    const scored = sampleProperties
      .map((property) => {
        const bedroomDelta = Math.abs((property.bedrooms ?? 0) - rooms)
        const matchesRooms = bedroomDelta <= 1
        const allowed = property.allowedRentTerms?.includes(rentTerm) ?? true
        const furnished = isFurnishedProperty(property)
        const matchesFurnished = wantsFurnished ? furnished : true

        let score = 0
        if (matchesRooms) score += 3
        if (allowed) score += 2
        if (wantsFurnished && furnished) score += 2

        return { id: property.id, score, matches: matchesRooms && matchesFurnished && allowed }
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)

    setSuggestedPropertyIds(scored.map((item) => item.id))
    setIsRentRequestOpen(false)
    toast.success('Request submitted — we’ll keep sending matches')
    toast(
      `We’ll reach you constantly with suggestions via ${request.channel}.`,
      { duration: 6000 }
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header onMenuClick={handleMenuClick} onProfileClick={handleProfileClick} />
      
      <div className="flex-1 flex">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block w-80 xl:w-96 border-r border-border bg-surface/30 backdrop-blur-sm sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto p-6 xl:p-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-6">
                <SlidersHorizontal className="h-5 w-5 text-primary" />
                Filters
              </h3>
              
              <div className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Price Range</label>
                  <select className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground hover:border-primary/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50">
                    <option>Any Price</option>
                    <option>₦500K - ₦1M</option>
                    <option>₦1M - ₦2M</option>
                    <option>₦2M - ₦5M</option>
                    <option>₦5M+</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Bedrooms</label>
                  <select className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground hover:border-primary/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50">
                    <option>Any</option>
                    <option>1+</option>
                    <option>2+</option>
                    <option>3+</option>
                    <option>4+</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Bathrooms</label>
                  <select className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground hover:border-primary/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50">
                    <option>Any</option>
                    <option>1+</option>
                    <option>2+</option>
                    <option>3+</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Location</label>
                  <select className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground hover:border-primary/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50">
                    <option>All Areas</option>
                    <option>Lekki</option>
                    <option>Victoria Island</option>
                    <option>Ikoyi</option>
                    <option>Surulere</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Property Type</label>
                  <select className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground hover:border-primary/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50">
                    <option>All Types</option>
                    <option>Apartment</option>
                    <option>House</option>
                    <option>Duplex</option>
                    <option>Studio</option>
                  </select>
                </div>
              </div>
              
              <div className="flex flex-col gap-3 mt-8">
                <Button className="w-full h-11 rounded-xl">Apply Filters</Button>
                <Button variant="outline" className="w-full h-11 rounded-xl">Reset</Button>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 container mx-auto px-4 lg:px-6 xl:px-8 py-6 md:py-8 lg:py-12 max-w-7xl">
        {/* Page Header */}
        <section className="mb-8">
            <div className="flex items-center justify-between mb-6 lg:mb-8">
            <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2">
                Browse Properties
              </h1>
              <p className="text-base md:text-lg text-muted-foreground">
                Find your perfect rental or investment property
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                className="rounded-xl h-11 px-5"
                onClick={handleOpenRentRequest}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Request to rent
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex rounded-full border border-border bg-background p-1 mb-3">
                {rentalFilterOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setRentalFilter(option.value)}
                    className={cn(
                      'px-3 py-1.5 text-xs font-semibold rounded-full transition-colors',
                      rentalFilter === option.value
                        ? option.value === 'shortlet'
                          ? 'bg-emerald-500 text-emerald-50 shadow-sm'
                          : 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-primary'
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                <span>
                  Showing {filteredProperties.length} property{filteredProperties.length !== 1 ? 'ies' : ''}
                  {rentalFilter === 'shortlet'
                    ? ' with shortlet availability'
                    : rentalFilter === 'long_term'
                    ? ' for annual lease'
                    : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Search Bar - Mobile and Tablet */}
          <div className="lg:hidden mb-6">
          <SearchBar 
            onSearch={handleSearch} 
            onFilterClick={() => setShowFilters(!showFilters)} 
          />
            
              {/* Mobile Filter Panel */}
            {showFilters && (
                <Card className="p-4 bg-surface border-0 mt-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFilters(false)}
                  >
                    Close
                  </Button>
                </div>
                  <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Price Range</label>
                    <select className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                      <option>Any Price</option>
                      <option>₦500K - ₦1M</option>
                      <option>₦1M - ₦2M</option>
                      <option>₦2M - ₦5M</option>
                      <option>₦5M+</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Bedrooms</label>
                    <select className="w-full rounded-lg border border-input bg-background px-3 py-2">
                      <option>Any</option>
                      <option>1+</option>
                      <option>2+</option>
                      <option>3+</option>
                      <option>4+</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Bathrooms</label>
                    <select className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                      <option>Any</option>
                      <option>1+</option>
                      <option>2+</option>
                      <option>3+</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Location</label>
                    <select className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                      <option>All Areas</option>
                      <option>Lekki</option>
                      <option>Victoria Island</option>
                      <option>Ikoyi</option>
                      <option>Surulere</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <Button className="flex-1">Apply Filters</Button>
                  <Button variant="outline" className="flex-1">Reset</Button>
                </div>
              </Card>
            )}
          </div>

            {/* Desktop Search Bar */}
            <div className="hidden lg:block mb-8">
              <div className="max-w-2xl">
                <SearchBar 
                  onSearch={handleSearch} 
                  onFilterClick={() => {}} 
                />
              </div>
          </div>
        </section>

        {/* Properties Section */}
        <section>
            <div className="flex items-center justify-between mb-6 lg:mb-8">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
                {filteredProperties.length} Property{filteredProperties.length !== 1 ? 'ies' : ''} Found
              </h2>
            </div>
            
            {/* Layout Toggle - Mobile Only */}
            <div className="flex items-center gap-2 md:hidden">
              <Button
                variant={layout === 'grid' ? 'default' : 'ghost'}
                size="icon"
                className="h-9 w-9 rounded-[10px]"
                onClick={() => setLayout('grid')}
                aria-label="Grid layout"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={layout === 'row' ? 'default' : 'ghost'}
                size="icon"
                className="h-9 w-9 rounded-[10px]"
                onClick={() => setLayout('row')}
                aria-label="Row layout"
              >
                <List className="h-4 w-4 text-foreground" />
              </Button>
            </div>
          </div>
          
          {filteredProperties.length === 0 ? (
            <Card className="p-10 rounded-3xl border border-border bg-surface text-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">No properties match your filters yet</h3>
              <p className="text-sm text-muted-foreground">
                Try switching your rental preference or resetting filters to discover more options.
              </p>
            </Card>
          ) : (
            <>
              {/* Mobile Grid */}
              <div className={`
                ${layout === 'grid' 
                  ? 'grid grid-cols-2 gap-4' 
                  : 'flex flex-col gap-4'
                } 
                  lg:hidden
              `}>
                {filteredProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onRequestViewing={handleRequestViewing}
                    onShare={handleShare}
                    onSelect={handleViewDetails}
                    layout={layout}
                  />
                ))}
              </div>

              {/* Desktop Grid - 3 columns on large screens, 4 on xl */}
              <div className="hidden lg:grid lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                {filteredProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onRequestViewing={handleRequestViewing}
                    onShare={handleShare}
                    onSelect={handleViewDetails}
                    layout="grid"
                />
              ))}
            </div>
          </>
          )}

          {suggestedProperties.length > 0 && (
            <Card className="mt-10 mb-6 p-4 md:p-5 rounded-2xl border border-primary/20 bg-primary/5">
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-foreground">Suggested apartments (near-match)</h2>
                  <p className="text-sm text-muted-foreground">
                    Based on your request, here are options that almost match. We’ll keep sending more via in-app notifications and chat.
                  </p>
                </div>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {suggestedProperties.slice(0, 3).map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onRequestViewing={handleRequestViewing}
                    onShare={handleShare}
                    onSelect={handleViewDetails}
                    layout="grid"
                  />
                ))}
              </div>
            </Card>
          )}
        </section>
      </main>
      </div>

      <Footer />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <AuthDialog open={isDrawerOpen} onOpenChange={setIsDrawerOpen} />

      <Dialog open={isRentRequestOpen} onOpenChange={setIsRentRequestOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Request to rent</DialogTitle>
            <DialogDescription>
              Tell us what you want. We’ll keep sending near-matching apartments via in-app notifications and chat.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-foreground">Preferred location</label>
              <input
                value={rentRequestForm.location}
                onChange={(e) => setRentRequestForm((prev) => ({ ...prev, location: e.target.value }))}
                placeholder="e.g. Lekki Phase 1, Lagos"
                className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-foreground">Number of rooms</label>
              <select
                value={rentRequestForm.rooms}
                onChange={(e) => setRentRequestForm((prev) => ({ ...prev, rooms: Number(e.target.value) }))}
                className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {[1, 2, 3, 4, 5].map((count) => (
                  <option key={count} value={count}>
                    {count}{count === 5 ? '+' : ''} bedroom{count === 1 ? '' : 's'}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-foreground">Rental type</label>
              <select
                value={rentRequestForm.rentTerm}
                onChange={(e) => setRentRequestForm((prev) => ({ ...prev, rentTerm: e.target.value as RentTerm }))}
                className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="six_months">6 months</option>
                <option value="annually">Annual</option>
              </select>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-foreground">Furnished?</label>
              <select
                value={rentRequestForm.furnished ? 'yes' : 'no'}
                onChange={(e) => setRentRequestForm((prev) => ({ ...prev, furnished: e.target.value === 'yes' }))}
                className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="no">Not required</option>
                <option value="yes">Yes, furnished</option>
              </select>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-foreground">Budget range</label>
              <select
                value={rentRequestForm.budgetRange}
                onChange={(e) => setRentRequestForm((prev) => ({ ...prev, budgetRange: e.target.value }))}
                className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="any">Any price</option>
                <option value="0-500k">₦0 - ₦500k</option>
                <option value="500k-1m">₦500k - ₦1M</option>
                <option value="1m-2m">₦1M - ₦2M</option>
                <option value="2m-5m">₦2M - ₦5M</option>
                <option value="5m+">₦5M+</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" className="rounded-xl" onClick={() => setIsRentRequestOpen(false)}>
              Cancel
            </Button>
            <Button className="rounded-xl" onClick={handleSubmitRentRequest}>
              Submit request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

