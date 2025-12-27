import { useMemo, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Input } from '@/shared/ui/input'
import { LogoLoader } from '@/widgets/logo-loader'
import { Header } from '@/widgets/header'
import { Footer } from '@/widgets/footer'
import { Sidebar } from '@/widgets/sidebar'
import { AuthDialog } from '@/widgets/auth-dialog'
import LogoSvg from '@/assets/images/logo.svg?react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ROUTES } from '@/shared/constants/routes'
import { useAuthStore } from '@/shared/store/auth.store'
import { serviceCategories } from '@/__mocks__/data/services.mock'
import {
  trackServicePageView,
  trackServiceCategoryClick,
  trackServiceCardView,
  trackBookingInitiated,
} from '@/shared/lib/analytics/service-analytics'
import { Sparkles, ShieldCheck, Clock, ArrowRight, PhoneCall, BadgeCheck, Search } from 'lucide-react'
import { howItWorksSteps } from './data/how-it-works'

const badges = [
  { id: 'response', label: 'Under 90 min response', icon: Clock },
  { id: 'vetted', label: 'Vetted artisans only', icon: ShieldCheck },
  { id: 'guarantee', label: '14-day workmanship guarantee', icon: BadgeCheck },
]

export function ServicesPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { isAuthenticated } = useAuthStore()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState(serviceCategories[0].id)
  const [isBooking, setIsBooking] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Track page view on mount
  useEffect(() => {
    // const quickService = searchParams.get('quick')
    const category = searchParams.get('category')
    
    trackServicePageView(category || undefined)
    
    // If coming from quick service chip, auto-select category
    if (category) {
      setSelectedCategoryId(category)
    }
  }, [searchParams])

  const selectedCategory = useMemo(
    () => serviceCategories.find((category) => category.id === selectedCategoryId) ?? serviceCategories[0],
    [selectedCategoryId]
  )

  // Filter services based on search query - search across all categories
  const filteredServices = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()
    
    // If no search query, return services from selected category with consistent structure
    if (!query) {
      return selectedCategory.services.map(service => ({
        service,
        category: selectedCategory
      }))
    }
    
    // Search through all categories
    const results: Array<{
      service: typeof selectedCategory.services[0]
      category: typeof selectedCategory
    }> = []
    
    serviceCategories.forEach((category) => {
      category.services.forEach((service) => {
        if (
          service.title.toLowerCase().includes(query) ||
          service.summary.toLowerCase().includes(query) ||
          category.name.toLowerCase().includes(query) ||
          category.description.toLowerCase().includes(query)
        ) {
          results.push({ service, category })
        }
      })
    })
    
    return results
  }, [selectedCategory, searchQuery])

  const handleCategoryChange = (categoryId: string) => {
    const category = serviceCategories.find(c => c.id === categoryId)
    if (category) {
      trackServiceCategoryClick(categoryId, category.name)
      setSelectedCategoryId(categoryId)
    }
  }

  const handleServiceCardClick = (serviceId: string, serviceName: string) => {
    trackServiceCardView(serviceId, serviceName, selectedCategoryId)
  }

  const handleBookNow = async (source: string = 'hero_cta') => {
    trackBookingInitiated(
      selectedCategory.services[0]?.id || 'unknown',
      selectedCategory.services[0]?.title || 'Unknown Service',
      selectedCategoryId,
      source
    )
    
    setIsBooking(true)
    // simulate pre-booking flow then navigate to services route (placeholder for now)
    await new Promise((resolve) => setTimeout(resolve, 1200))
    setIsBooking(false)
    navigate(`${ROUTES.SERVICES}?start=booking&category=${selectedCategoryId}`)
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
      <Header onMenuClick={handleMenuClick} onProfileClick={handleProfileClick} className="lg:shadow-sm" />
      
      <div className="flex-1 text-foreground">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
        <div className="container mx-auto px-4 lg:px-6 xl:px-8 pt-12 md:pt-16 lg:pt-20 pb-12 md:pb-14 lg:pb-20 relative z-10 max-w-7xl">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-center">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                <Sparkles className="h-4 w-4" />
                Services Concierge
              </div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Elite artisans on speed dial for every home, estate and workspace.
              </h1>
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl">
                From emergency fixes to full renovations, JulaazNG curates the top 5% of technicians,
                artisans and service partners across Nigeria. We verify every background, track every job
                and protect your property like ours.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  className="rounded-[12px] h-12 px-6"
                onClick={() => handleBookNow('hero_cta')}
                  disabled={isBooking}
                >
                  {isBooking ? (
                    <LogoLoader size="sm" variant="foreground" className="mr-2" />
                  ) : (
                    <PhoneCall className="h-4 w-4 mr-2" />
                  )}
                  {isBooking ? 'Linking you with a specialist...' : 'Book a trusted pro'}
                </Button>
                <Button
                  variant="outline"
                  className="rounded-[12px] h-12 px-6"
                  onClick={() => navigate(ROUTES.SERVICE_MAINTENANCE_PLANS)}
                >
                  Explore maintenance plans
                </Button>
              </div>
              <div className="flex flex-wrap gap-3 pt-4">
                {badges.map(({ id, label, icon: Icon }) => (
                  <span
                    key={id}
                    className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-3 py-2 text-xs font-medium"
                  >
                    <Icon className="h-4 w-4 text-primary" />
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <motion.div
              className="flex-1 max-w-xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
            >
              <div className="relative rounded-[32px] border border-border/60 bg-surface/80 backdrop-blur-lg p-8 overflow-hidden shadow-2xl">
                <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
                <div className="absolute -bottom-28 -left-28 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center justify-between">
                    <LogoSvg className="h-40 w-40 md:h-44 md:w-44 text-primary" />
                    <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Service Desk</span>
                  </div>
                  <div className="rounded-2xl border border-border/50 bg-background/80 p-4 shadow-inner">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      “As a landlord with multiple units across Lagos, JulaazNG has become my service command
                      center. One tap and vetted technicians appear on-site, share photo updates and close jobs
                      with digital reports. It feels premium, yet so effortless.”
                    </p>
                    <div className="mt-4 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                        AO
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Anita Okon</p>
                        <p className="text-xs text-muted-foreground">Landlord • Victoria Island</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div>
                      <p className="text-2xl font-bold text-foreground">4.9★</p>
                      <p>Average rating from 8,000+ verified jobs.</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">24/7</p>
                      <p>Concierge available round the clock for emergencies.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Category Explorer */}
      <section className="container mx-auto px-4 lg:px-6 xl:px-8 py-12 lg:py-16 space-y-8 max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">What do you need help with today?</h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
              Browse curated crews for every maintenance, upgrade or emergency scenario. We assign dedicated
              field supervisors for multi-day projects.
            </p>
          </div>
          <Button
            variant="ghost"
            className="rounded-full border border-border/60 px-4"
            onClick={() => navigate(ROUTES.SERVICE_VETTED_PARTNER)}
          >
            Become a vetted partner
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        {/* Search Bar */}
        <div className="space-y-2">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
            <Input
              type="search"
              placeholder="Search for services... (e.g., plumbing, painting, cleaning, electrical)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 h-12 rounded-xl border border-border/60 bg-surface/80 backdrop-blur-sm shadow-sm focus:shadow-md focus:border-primary/50 transition-all text-foreground"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            💡 Tip: Search by service name, category, or description to quickly find what you need
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {serviceCategories.map(({ id, name }) => {
            const isActive = id === selectedCategoryId
            return (
              <button
                key={id}
                onClick={() => handleCategoryChange(id)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                {name}
              </button>
            )
          })}
        </div>

        <motion.div
          key={searchQuery.trim() ? 'search' : selectedCategory.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]"
        >
          <Card className="border-0 bg-surface/80 backdrop-blur p-6 shadow-xl">
            {searchQuery.trim() ? (
              <div className="rounded-3xl bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 p-1 mb-6">
                <div className="rounded-[28px] bg-background/80 p-6">
                  <div className="flex items-center gap-3">
                    <Search className="h-10 w-10 text-primary" />
                    <div>
                      <h3 className="text-xl font-semibold">Search Results</h3>
                      <p className="text-sm text-muted-foreground">
                        Found {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''} matching "{searchQuery}"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
            <div
              className={`rounded-3xl bg-gradient-to-br ${selectedCategory.color} p-1 mb-6`}
            >
              <div className="rounded-[28px] bg-background/80 p-6">
                <div className="flex items-center gap-3">
                  <selectedCategory.icon className="h-10 w-10 text-primary" />
                  <div>
                    <h3 className="text-xl font-semibold">{selectedCategory.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedCategory.description}</p>
                  </div>
                </div>
              </div>
            </div>
            )}

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredServices.length > 0 ? (
                filteredServices.map((item) => {
                  const { service, category } = item
                  
                  return (
                <motion.div
                      key={`${category.id}-${service.id}`}
                  whileHover={{ translateY: -4 }}
                  className="rounded-2xl border border-border/60 bg-background/80 p-5 shadow-sm"
                >
                      {searchQuery.trim() && (
                        <div className="mb-2">
                          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                            <category.icon className="h-3 w-3" />
                            {category.name}
                          </span>
                        </div>
                      )}
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-foreground">
                      {service.title}
                    </h4>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      From ₦{service.priceFrom.toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {service.summary}
                  </p>
                  <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-medium">{service.rating}★ satisfaction</span>
                    <span>{service.jobsCompleted.toLocaleString()} jobs completed</span>
                  </div>
                  <Button
                    variant="ghost"
                    className="mt-4 w-full rounded-xl border border-border/60"
                    onClick={() => {
                      handleServiceCardClick(service.id, service.title)
                      navigate(ROUTES.SERVICE_REQUEST(service.id))
                    }}
                  >
                    Request this crew
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </motion.div>
                  )
                })
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground mb-2">
                    No services found matching "{searchQuery}"
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Try a different search term or browse the categories above
                  </p>
                </div>
              )}
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="border-0 bg-surface/90 p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-foreground">How it works</h3>
              <div className="mt-4 space-y-4">
                {howItWorksSteps.map(({ id, title, description, icon: Icon }) => (
                  <div key={id} className="flex gap-3">
                    <div className="mt-1 rounded-2xl bg-primary/10 p-2 text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground">{title}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="border-0 bg-primary text-primary-foreground rounded-[28px] overflow-hidden shadow-lg">
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-7 w-7" />
                  <div>
                    <p className="text-sm uppercase tracking-wide font-medium text-primary-foreground/80">
                      Assurance
                    </p>
                    <h4 className="text-xl font-semibold">The JulaazNG Promise</h4>
                  </div>
                </div>
                <ul className="space-y-3 text-sm">
                  <li>• Dedicated service concierge from booking to sign-off.</li>
                  <li>• Photo/video proof of work with digital service reports.</li>
                  <li>• Insurance cover and rework guarantee on every job.</li>
                </ul>
                <Button
                  variant="secondary"
                  className="w-full rounded-xl"
                  onClick={() => navigate(`${ROUTES.SERVICES}?start=promise`)}
                >
                  View SLA & coverage
                </Button>
              </div>
            </Card>
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-background to-background" />
        <div className="container mx-auto px-4 lg:px-6 xl:px-8 py-12 md:py-16 lg:py-20 relative z-10 max-w-7xl">
          <div className="rounded-[32px] border border-primary/20 bg-background/80 backdrop-blur-xl p-10 shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-10">
              <div className="max-w-3xl space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-primary">
                  Concierge for landlords, tenants & facility teams
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
                  Let us run the service bench while you focus on living.
                </h2>
                <p className="text-base md:text-lg text-muted-foreground">
                  Get quarterly maintenance calendars, emergency response, digital documentation and Verified-by-
                  JulaazNG artisans on-demand. We are building the nervous system for seamless living.
                </p>
              </div>
              <div className="flex flex-col gap-3 w-full md:w-auto">
                <Button
                  className="rounded-2xl h-12 px-6"
                  onClick={() => handleBookNow('cta_section')}
                  disabled={isBooking}
                >
                  {isBooking ? (
                    <LogoLoader size="sm" variant="foreground" className="mr-2" />
                  ) : (
                    <PhoneCall className="h-4 w-4 mr-2" />
                  )}
                  {isBooking ? 'Connecting you...' : 'Schedule a concierge call'}
                </Button>
                <Button
                  variant="outline"
                  className="rounded-2xl h-12 px-6"
                  onClick={() => navigate(`${ROUTES.SERVICES}?start=demo`)}
                >
                  Watch how the command center works
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>

      <Footer />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <AuthDialog open={isDrawerOpen} onOpenChange={setIsDrawerOpen} />
    </div>
  )
}
