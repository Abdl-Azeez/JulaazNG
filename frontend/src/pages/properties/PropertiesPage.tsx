import { useState } from 'react'
import { LayoutGrid, List, Filter, MapPin, SlidersHorizontal } from 'lucide-react'
import { Header } from '@/widgets/header'
import { Footer } from '@/widgets/footer'
import { SearchBar } from '@/widgets/search-bar'
import { PropertyCard } from '@/widgets/property-card'
import { AuthDrawer } from '@/widgets/auth-drawer'
import { Sidebar } from '@/widgets/sidebar'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { sampleProperties } from '@/pages/home/data/sample-properties'
import { ROUTES } from '@/shared/constants/routes'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/shared/store/auth.store'

type LayoutType = 'grid' | 'row'

export function PropertiesPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [layout, setLayout] = useState<LayoutType>('grid')
  const [showFilters, setShowFilters] = useState(false)

  const handleSearch = (query: string) => {
    navigate(`${ROUTES.PROPERTY_SEARCH}?q=${encodeURIComponent(query)}`)
  }

  const handleChat = (_propertyId: string) => {
    navigate(ROUTES.MESSAGING)
  }

  const handleShare = (propertyId: string) => {
    if (navigator.share) {
      navigator.share({
        title: 'Check out this property on JulaazNG',
        text: 'I found this amazing property!',
        url: `${window.location.origin}${ROUTES.PROPERTY_DETAILS(propertyId)}`,
      })
    } else {
      navigator.clipboard.writeText(
        `${window.location.origin}${ROUTES.PROPERTY_DETAILS(propertyId)}`
      )
    }
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header onMenuClick={handleMenuClick} onProfileClick={handleProfileClick} />
      
      <main className="flex-1 container mx-auto px-4 py-6 md:py-8">
        {/* Page Header */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Browse Properties
              </h1>
              <p className="text-base md:text-lg text-muted-foreground">
                Find your perfect rental or investment property
              </p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="space-y-4">
            <SearchBar 
              onSearch={handleSearch} 
              onFilterClick={() => setShowFilters(!showFilters)} 
            />
            
            {/* Filter Panel */}
            {showFilters && (
              <Card className="p-4 bg-surface border-0">
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
        </section>

        {/* Properties Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-xl md:text-2xl font-bold text-foreground">
                {sampleProperties.length} Properties Found
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
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className={`
            ${layout === 'grid' 
              ? 'grid grid-cols-2 gap-4' 
              : 'flex flex-col gap-4'
            } 
            md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6
          `}>
            {sampleProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onChat={handleChat}
                onShare={handleShare}
                layout={layout}
              />
            ))}
          </div>
        </section>
      </main>

      <Footer />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <AuthDrawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} />
    </div>
  )
}

