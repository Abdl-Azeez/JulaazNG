import { useState } from 'react'
import { LayoutGrid, List } from 'lucide-react'
import { Header } from '@/widgets/header'
import { Footer } from '@/widgets/footer'
import { SearchBar } from '@/widgets/search-bar'
import { PropertyCard } from '@/widgets/property-card'
import { AuthDrawer } from '@/widgets/auth-drawer'
import { Sidebar } from '@/widgets/sidebar'
import { sampleProperties } from './data/sample-properties'
import { ROUTES } from '@/shared/constants/routes'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/shared/store/auth.store'
import { Button } from '@/shared/ui/button'

type LayoutType = 'grid' | 'row'

export function HomePage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [layout, setLayout] = useState<LayoutType>('grid')

  const handleSearch = (query: string) => {
    // Navigate to search page with query
    navigate(`${ROUTES.PROPERTY_SEARCH}?q=${encodeURIComponent(query)}`)
  }

  const handleChat = (_propertyId: string) => {
    // Navigate to chat/messaging
    navigate(ROUTES.MESSAGING)
  }

  const handleShare = (propertyId: string) => {
    // Share functionality
    if (navigator.share) {
      navigator.share({
        title: 'Check out this property on JulaazNG',
        text: 'I found this amazing property!',
        url: `${window.location.origin}${ROUTES.PROPERTY_DETAILS(propertyId)}`,
      })
    } else {
      // Fallback: copy to clipboard
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
      // Navigate to profile if logged in
      navigate(ROUTES.PROFILE)
    } else {
      // Open drawer if not logged in
      setIsDrawerOpen(true)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header onMenuClick={handleMenuClick} onProfileClick={handleProfileClick} />
      
      <main className="flex-1 container mx-auto px-4 py-6 md:py-8">
        {/* Hero Section */}
        <section className="mb-8 md:mb-12">
          <SearchBar onSearch={handleSearch} onFilterClick={() => console.log('Filter clicked')} />
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 mt-6">
            Find Your Next Home
          </h1>
          <p className="text-base md:text-lg text-muted-foreground">
            The best place to find rentals and services in Nigeria
          </p>
        </section>

        {/* Trending Properties Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Trending Properties
            </h2>
            
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
            md:grid md:grid-cols-2 md:gap-6
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
