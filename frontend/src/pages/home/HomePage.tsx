import { useState } from 'react'
import { LayoutGrid, List, ShieldCheck, Sparkles, Wrench, Home, Building2, ArrowRight, Clock, CreditCard } from 'lucide-react'
import { Header } from '@/widgets/header'
import { Footer } from '@/widgets/footer'
import { SearchBar } from '@/widgets/search-bar'
import { PropertyCard } from '@/widgets/property-card'
import { AuthDialog } from '@/widgets/auth-dialog'
import { Sidebar } from '@/widgets/sidebar'
import { sampleProperties } from '@/__mocks__/data/properties.mock'
import { ROUTES } from '@/shared/constants/routes'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/shared/store/auth.store'
import { Button } from '@/shared/ui/button'
import { cn } from '@/shared/lib/utils/cn'
import { Card } from '@/shared/ui/card'

type LayoutType = 'grid' | 'row'

export function HomePage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [layout, setLayout] = useState<LayoutType>('grid')

  const handleSearch = (query: string) => {
    // Navigate to search page with query
    if (query.trim()) {
    navigate(`${ROUTES.PROPERTY_SEARCH}?q=${encodeURIComponent(query)}`)
    } else {
      // If empty, just go to properties page
      navigate(ROUTES.PROPERTIES)
    }
  }

  const handleFilterClick = () => {
    // Navigate to properties page where filters are available
    navigate(ROUTES.PROPERTIES)
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

  const handleViewDetails = (propertyId: string) => {
    navigate(ROUTES.PROPERTY_DETAILS(propertyId))
  }

  const handleMenuClick = () => {
    setIsSidebarOpen(true)
  }

  const handleProfileClick = () => {
    if (isAuthenticated) {
      // Navigate to profile if logged in
      navigate(ROUTES.PROFILE)
    } else {
      // Open auth dialog (automatically shows modal on desktop, drawer on mobile)
      setIsAuthOpen(true)
    }
  }

  const handleRequestViewing = (propertyId: string) => {
    if (!isAuthenticated) {
      // Store the intended destination (booking page) for post-login redirect
      const bookingUrl = ROUTES.PROPERTY_BOOKING(propertyId)
      sessionStorage.setItem('intendedDestination', bookingUrl)
      setIsAuthOpen(true)
      return
    }

    navigate(ROUTES.PROPERTY_BOOKING(propertyId))
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header onMenuClick={handleMenuClick} onProfileClick={handleProfileClick} />
      
      <main className="flex-1">
        {/* Hero Section - Enhanced for Desktop */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
          <div className="container mx-auto px-4 lg:px-6 xl:px-8 py-8 md:py-12 lg:py-16 xl:py-20 max-w-7xl relative">
            <div className="max-w-5xl mx-auto">
              {/* Mobile Hero - Creative Design */}
              <div className="lg:hidden mb-10">
                {/* Animated Background Blobs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
                  <div className="absolute top-0 -right-4 w-72 h-72 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
                  <div className="absolute -bottom-8 left-20 w-72 h-72 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
                </div>

                {/* Hero Content */}
                <div className="relative z-10">
                  {/* Floating Badge */}
                  <div className="flex justify-center mb-6 animate-float">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 via-primary/10 to-accent/20 backdrop-blur-xl border border-primary/30 shadow-lg">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                      </span>
                      <span className="text-xs font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        🏠 Nigeria's #1 Property Platform
                      </span>
                    </div>
                  </div>

                  {/* Title with Gradient */}
                  <h1 className="text-center mb-4 animate-fade-in-up">
                    <span className="block text-4xl font-black bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent mb-2">
                      Your Complete Home
                    </span>
                    <span className="block text-4xl font-black bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient-x">
                      Solution Platform
                    </span>
                  </h1>

                  <p className="text-center text-base text-muted-foreground leading-relaxed mb-8 px-4 animate-fade-in-up animation-delay-200">
                    Find your perfect rental, book trusted services, and connect with skilled artisans—all in one place. Nigeria's most trusted property and home services platform.
                  </p>

                  {/* Service Categories - Quick Access */}
                  <div className="grid grid-cols-2 gap-2 px-2 mb-6 animate-fade-in-up animation-delay-200">
                    {[
                      {
                        icon: Home,
                        title: 'Rentals',
                        subtitle: 'Monthly–Annual + Shortlet',
                        color: 'from-blue-500/20 to-blue-500/5',
                        borderColor: 'border-blue-500/30',
                        iconColor: 'text-blue-600',
                        onClick: () => navigate(ROUTES.PROPERTIES),
                      },
                      {
                        icon: Sparkles,
                        title: 'Services',
                        subtitle: 'Cleaning & Moving',
                        color: 'from-purple-500/20 to-purple-500/5',
                        borderColor: 'border-purple-500/30',
                        iconColor: 'text-purple-600',
                        onClick: () => navigate(ROUTES.SERVICES),
                      },
                      {
                        icon: Wrench,
                        title: 'Artisans',
                        subtitle: 'Plumbing & Electrical',
                        color: 'from-amber-500/20 to-amber-500/5',
                        borderColor: 'border-amber-500/30',
                        iconColor: 'text-amber-600',
                        onClick: () => navigate(ROUTES.ARTISANS),
                      },
                      {
                        icon: Building2,
                        title: 'Management',
                        subtitle: 'Property Care',
                        color: 'from-emerald-500/20 to-emerald-500/5',
                        borderColor: 'border-emerald-500/30',
                        iconColor: 'text-emerald-600',
                        onClick: () => navigate(ROUTES.PROPERTY_MANAGEMENT),
                      },
                    ].map((service) => (
                      <button
                        key={service.title}
                        onClick={service.onClick}
                        className={`group relative overflow-hidden p-4 rounded-xl bg-gradient-to-br ${service.color} backdrop-blur-xl border ${service.borderColor} shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300`}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <div className={`h-10 w-10 rounded-full bg-white/50 flex items-center justify-center ${service.iconColor}`}>
                            <service.icon className="h-5 w-5" />
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-bold text-foreground">{service.title}</div>
                            <div className="text-xs text-muted-foreground">{service.subtitle}</div>
                          </div>
                        </div>
                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                      </button>
                    ))}
                  </div>

                  {/* Feature Cards with Glassmorphism */}
                  <div className="space-y-3 px-2 mb-8">
                    {[
                      {
                        icon: ShieldCheck,
                        title: 'Verified & Trusted',
                        desc: 'Every property and service provider is vetted by our team. Background checks, verified listings, and secure payments.',
                        gradient: 'from-primary/20 to-primary/5',
                        delay: '300',
                      },
                      {
                        icon: Clock,
                        title: 'Book in Minutes',
                        desc: 'From property viewings to service appointments—schedule everything instantly with real-time availability.',
                        gradient: 'from-accent/20 to-accent/5',
                        delay: '400',
                      },
                      {
                        icon: CreditCard,
                        title: 'Transparent Pricing',
                        desc: 'No hidden fees. See exact costs upfront with secure payment processing and instant receipts.',
                        gradient: 'from-emerald-500/20 to-emerald-500/5',
                        delay: '500',
                      },
                    ].map((feature) => (
                      <div
                        key={feature.title}
                        className={`group relative overflow-hidden animate-fade-in-up animation-delay-${feature.delay}`}
                      >
                        {/* Hover Gradient Background */}
                        <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                        
                        {/* Card Content */}
                        <div className="relative flex items-start gap-3 p-4 rounded-2xl bg-surface/60 backdrop-blur-xl border border-border/50 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
                          {/* Icon with Animated Ring */}
                          <div className="relative shrink-0">
                            <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping-slow" />
                            <div className="relative h-11 w-11 rounded-full bg-gradient-to-br from-primary/30 to-accent/20 flex items-center justify-center backdrop-blur-sm border border-primary/30 shadow-inner">
                              <feature.icon className="h-5 w-5 text-primary drop-shadow-lg" />
                            </div>
                          </div>
                          
                          {/* Text Content */}
                          <div className="flex-1 space-y-1">
                            <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                              {feature.title}
                            </h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {feature.desc}
                            </p>
                          </div>

                          {/* Shine Effect */}
                          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Trust Indicators */}
                  <div className="flex items-center justify-center gap-4 px-4 mb-6 animate-fade-in-up animation-delay-400">
                    <div className="flex items-center gap-1.5">
                      <CreditCard className="h-4 w-4 text-primary" />
                      <span className="text-xs font-semibold text-foreground">Monthly–Annual terms</span>
                    </div>
                    <div className="h-4 w-px bg-border" />
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-amber-500" />
                      <span className="text-xs font-semibold text-foreground">Points on services</span>
                    </div>
                    <div className="h-4 w-px bg-border" />
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-emerald-600" />
                      <span className="text-xs font-semibold text-foreground">Verified landlords</span>
                    </div>
                  </div>

                  {/* CTA Buttons with 3D Effect */}
                  <div className="flex flex-col gap-3 px-4 animate-fade-in-up animation-delay-600">
                    <button
                      onClick={() => navigate(ROUTES.PROPERTIES)}
                      className="group relative h-14 rounded-2xl bg-gradient-to-r from-primary to-accent overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {/* Animated Background */}
                      <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      {/* Shimmer Effect */}
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                      
                      {/* Button Content */}
                      <span className="relative flex items-center justify-center gap-2 text-base font-bold text-primary-foreground">
                        <Home className="h-5 w-5" />
                        <span>Find Your Perfect Home</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                    </button>

                    <button
                      onClick={() => navigate(ROUTES.SERVICES)}
                      className="group relative h-14 rounded-2xl bg-surface/80 backdrop-blur-xl border-2 border-primary/30 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {/* Hover Background */}
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      {/* Button Content */}
                      <span className="relative flex items-center justify-center gap-2 text-base font-bold text-primary">
                        <Sparkles className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                        <span>Book Home Services</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Desktop Hero */}
              <div className="hidden lg:block">
                <div className="grid lg:grid-cols-2 gap-12 xl:gap-16 items-center">
                  <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary/20 via-primary/10 to-accent/20 px-4 py-2 text-sm font-medium text-primary border border-primary/30">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                      </span>
                      <span>Nigeria's #1 Complete Home Solution Platform</span>
                    </div>
                    <h1 className="text-5xl xl:text-6xl font-bold text-foreground leading-tight">
                      Everything You Need
                      {' '}
                      <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                        For Your Home
                      </span>
                    </h1>
                    <p className="text-lg xl:text-xl text-muted-foreground leading-relaxed">
                      From finding your perfect rental to booking trusted services and connecting with skilled artisans—all in one trusted platform.
                      {' '}
                      <span className="font-semibold text-foreground">Your complete home solution starts here.</span>
                    </p>
                    
                    {/* Service Quick Links */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      {[
                        { icon: Home, label: 'Rentals', desc: 'Monthly–Annual + Shortlet', route: ROUTES.PROPERTIES, color: 'from-blue-500/20 to-blue-500/5 border-blue-500/30' },
                        { icon: Sparkles, label: 'Services', desc: 'Cleaning & Moving', route: ROUTES.SERVICES, color: 'from-purple-500/20 to-purple-500/5 border-purple-500/30' },
                        { icon: Wrench, label: 'Artisans', desc: 'Plumbing & Electrical', route: ROUTES.ARTISANS, color: 'from-amber-500/20 to-amber-500/5 border-amber-500/30' },
                        { icon: Building2, label: 'Management', desc: 'Property Care', route: ROUTES.PROPERTY_MANAGEMENT, color: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/30' },
                      ].map((service) => (
                        <button
                          key={service.label}
                          onClick={() => navigate(service.route)}
                          className={`group p-4 rounded-xl bg-gradient-to-br ${service.color} border backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02] text-left`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="h-10 w-10 rounded-lg bg-white/50 flex items-center justify-center text-primary shrink-0">
                              <service.icon className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="font-semibold text-sm text-foreground">{service.label}</div>
                              <div className="text-xs text-muted-foreground">{service.desc}</div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Trust Indicators */}
                    <div className="flex items-center gap-6 pt-2">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-primary" />
                        <div>
                          <div className="text-sm font-bold text-foreground">Monthly–Annual</div>
                          <div className="text-xs text-muted-foreground">Flexible rent terms</div>
                        </div>
                      </div>
                      <div className="h-12 w-px bg-border" />
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-amber-500" />
                        <div>
                          <div className="text-sm font-bold text-foreground">Points on services</div>
                          <div className="text-xs text-muted-foreground">Earn and redeem faster</div>
                        </div>
                      </div>
                      <div className="h-12 w-px bg-border" />
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-emerald-600" />
                        <div>
                          <div className="text-sm font-bold text-foreground">Verified landlords</div>
                          <div className="text-xs text-muted-foreground">Background-checked</div>
                        </div>
                      </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex gap-4 pt-4">
                      <Button
                        onClick={() => navigate(ROUTES.PROPERTIES)}
                        size="lg"
                        className="h-12 px-6 rounded-xl bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary transition-all shadow-lg"
                      >
                        <Home className="h-4 w-4 mr-2" />
                        Find Properties
                      </Button>
                      <Button
                        onClick={() => navigate(ROUTES.SERVICES)}
                        variant="outline"
                        size="lg"
                        className="h-12 px-6 rounded-xl border-2"
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        Book Services
                      </Button>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-2xl" />
                    <div className="relative bg-surface/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-border/50">
                      <SearchBar onSearch={handleSearch} onFilterClick={handleFilterClick} />
                      <div className="mt-6 grid grid-cols-3 gap-4">
                        <div className="text-center p-4 rounded-xl bg-background/50">
                          <div className="text-2xl font-bold text-primary">1K+</div>
                          <div className="text-xs text-muted-foreground mt-1">Properties</div>
                        </div>
                        <div className="text-center p-4 rounded-xl bg-background/50">
                          <div className="text-2xl font-bold text-primary">500+</div>
                          <div className="text-xs text-muted-foreground mt-1">Active Listings</div>
                        </div>
                        <div className="text-center p-4 rounded-xl bg-background/50">
                          <div className="text-2xl font-bold text-primary">98%</div>
                          <div className="text-xs text-muted-foreground mt-1">Satisfaction</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Julaaz Experience Snapshot */}
        <section className="container mx-auto px-4 lg:px-6 xl:px-8 py-8 md:py-10 max-w-6xl">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Card className="p-5 rounded-2xl border border-border/60 bg-surface shadow-sm">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  Shortlet & annual stays
                </div>
                <h3 className="text-lg font-semibold text-foreground">Stay on your terms</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  From serviced shortlets to long-term family homes, every listing is inspected and furnished with essentials before you move in.
                </p>
              </div>
            </Card>
            <Card className="p-5 rounded-2xl border border-border/60 bg-surface shadow-sm">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-300">
                  Home services
                </div>
                <h3 className="text-lg font-semibold text-foreground">Book trusted experts</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Schedule cleaners, movers, plumbers, and artisans with transparent pricing, live tracking, and secure payments built in.
                </p>
              </div>
            </Card>
            <Card className="p-5 rounded-2xl border border-border/60 bg-surface shadow-sm md:col-span-2 xl:col-span-1">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-primary">
                  Tenant support
                </div>
                <h3 className="text-lg font-semibold text-foreground">Background checks & support</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Submit your verification once and reuse it across bookings. Our support team coordinates move-ins, deposits, and concierge requests.
                </p>
              </div>
            </Card>
          </div>
        </section>

        {/* Trending Properties Section */}
        <section className="container mx-auto px-4 lg:px-6 xl:px-8 py-8 md:py-12 lg:py-16 max-w-7xl">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-6 lg:mb-10 gap-4">
            <div className="space-y-2 lg:flex-1">
              {/* Mobile: Title and Layout Toggle on same row */}
              <div className="flex items-center justify-between gap-4 lg:block">
                <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground">
                  Trending Properties
                </h2>
                
                {/* Mobile Layout Toggle - Same row as title */}
                <div className="flex items-center gap-2 lg:hidden shrink-0">
                  <Button
                    variant={layout === 'grid' ? 'default' : 'ghost'}
                    size="icon"
                    className={cn(
                      "h-9 w-9 rounded-[10px]",
                      layout !== 'grid' && 'text-foreground hover:text-primary'
                    )}
                    onClick={() => setLayout('grid')}
                    aria-label="Grid layout"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={layout === 'row' ? 'default' : 'ghost'}
                    size="icon"
                    className={cn(
                      "h-9 w-9 rounded-[10px]",
                      layout !== 'row' && 'text-foreground hover:text-primary'
                    )}
                    onClick={() => setLayout('row')}
                    aria-label="Row layout"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-sm md:text-base lg:text-lg text-muted-foreground">
                Discover the most popular listings in your area
              </p>
            </div>
            
            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <Button
                variant="outline"
                size="lg"
                className="h-11 px-6 rounded-xl"
                onClick={() => navigate(ROUTES.PROPERTIES)}
              >
                View All Properties
              </Button>
            </div>
          </div>
          
          {/* Mobile Grid */}
          <div className={`
            ${layout === 'grid' 
              ? 'grid grid-cols-2 gap-4' 
              : 'flex flex-col gap-4'
            } 
            lg:hidden
          `}>
            {sampleProperties.slice(0, 4).map((property) => (
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

          {/* Desktop Grid - Enhanced layout */}
          <div className="hidden lg:grid lg:grid-cols-3 xl:grid-cols-4 gap-6 xl:gap-8">
            {sampleProperties.map((property) => (
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
        </section>
      </main>

      <Footer />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <AuthDialog open={isAuthOpen} onOpenChange={setIsAuthOpen} />
    </div>
  )
}
