import { Header } from '@/widgets/header'
import { Footer } from '@/widgets/footer'
import { SearchBar } from '@/widgets/search-bar'
import { PropertyCard } from '@/widgets/property-card'
import { sampleProperties } from './data/sample-properties'
import { ROUTES } from '@/shared/constants/routes'
import { useNavigate } from 'react-router-dom'

export function HomePage() {
  const navigate = useNavigate()

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
    // Open sidebar/menu
    console.log('Menu clicked')
  }

  const handleProfileClick = () => {
    // Navigate to profile
    navigate(ROUTES.PROFILE)
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
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
            Trending Properties
          </h2>
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            {sampleProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onChat={handleChat}
                onShare={handleShare}
              />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
