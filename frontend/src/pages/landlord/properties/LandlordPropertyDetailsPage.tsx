import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Header } from '@/widgets/header'
import { Sidebar } from '@/widgets/sidebar'
import { Footer } from '@/widgets/footer'
import { AuthDialog } from '@/widgets/auth-dialog'
import { useAuthStore } from '@/shared/store/auth.store'
import { ROUTES } from '@/shared/constants/routes'
import { landlordPropertyDetails } from '@/__mocks__/data/landlord.mock'
import { LandlordNav } from '@/widgets/landlord-nav'
import { ArrowLeft, MapPin, Bed, Bath, ParkingCircle, FileText, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import { cn } from '@/shared/lib/utils/cn'
import { format } from 'date-fns'

export function LandlordPropertyDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const property = useMemo(() => (id ? landlordPropertyDetails[id] : undefined), [id])

  const handleMenuClick = () => setIsSidebarOpen(true)
  const handleProfileClick = () => {
    if (!isAuthenticated) setIsDrawerOpen(true)
    else navigate(ROUTES.PROFILE)
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header onMenuClick={handleMenuClick} onProfileClick={handleProfileClick} />
        <main className="flex-1 px-6 py-16 flex flex-col items-center justify-center text-center space-y-4">
          <p className="text-2xl font-semibold text-foreground">Property not found</p>
          <p className="text-muted-foreground">The listing you are looking for no longer exists.</p>
          <Button onClick={() => navigate(ROUTES.LANDLORD_PROPERTIES)}>Back to My Properties</Button>
        </main>
        <Footer />
      </div>
    )
  }

  const gallery = property.gallery && property.gallery.length > 0 ? property.gallery : [property.image]
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const handlePrev = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-muted relative">
      <Header onMenuClick={handleMenuClick} onProfileClick={handleProfileClick} />
      <main className="relative z-10 flex-1 pb-28 lg:pb-16">
        <section className="container mx-auto px-4 lg:px-6 xl:px-8 max-w-5xl py-5 space-y-6">
          <div className="relative rounded-3xl overflow-hidden shadow-xl">
            <img src={gallery[currentImageIndex]} alt={`${property.name} ${currentImageIndex + 1}`} className="w-full h-56 sm:h-72 object-cover transition-transform duration-500" />
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-2xl bg-background/80 backdrop-blur-md border border-border/40 hover:bg-primary/10 hover:text-primary"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </div>
            {gallery.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background text-foreground rounded-full p-1.5"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background text-foreground rounded-full p-1.5"
                  aria-label="Next photo"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                  {gallery.map((_, index) => (
                    <span
                      key={index}
                      className={cn(
                        'h-1.5 rounded-full transition-all',
                        index === currentImageIndex ? 'w-4 bg-background' : 'w-1.5 bg-background/50'
                      )}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="rounded-3xl border border-border/60 bg-surface/95 backdrop-blur-xl shadow-lg p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h1 className="text-2xl font-semibold text-foreground">{property.name}</h1>
                <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                  <MapPin className="h-4 w-4 text-primary" />
                  {property.address}
                </p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-lg font-bold text-primary">₦{(property.price / 1_000_000).toFixed(1)}M</p>
                <p className="text-xs text-muted-foreground">Annual lease baseline</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Bed className="h-4 w-4" /> {property.bedrooms} Bedroom
              </span>
              <span className="flex items-center gap-1">
                <Bath className="h-4 w-4" /> {property.bathrooms} Bathroom
              </span>
              <span className="flex items-center gap-1">
                <ParkingCircle className="h-4 w-4" /> {property.parking} Parking Space
              </span>
              <span className="flex items-center gap-1">
                <FileText className="h-4 w-4" /> {property.size} sqft
              </span>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <section className="rounded-3xl border border-border/60 bg-surface/95 backdrop-blur-xl shadow-lg p-5 space-y-2">
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Info</h2>
              <div className="text-sm text-muted-foreground grid gap-1">
                <p>
                  <span className="font-semibold text-foreground">Type:</span> {property.type}
                </p>
                <p>
                  <span className="font-semibold text-foreground">Description:</span> {property.description}
                </p>
              </div>
            </section>

            <section className="rounded-3xl border border-border/60 bg-surface/95 backdrop-blur-xl shadow-lg p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Applications</h2>
                <Badge className="rounded-full bg-primary/10 text-primary border-0">
                  {property.applicationsCount} total
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>
                  <span className="font-semibold text-foreground">Latest applicant:</span>{' '}
                  {property.latestApplicant
                    ? `${property.latestApplicant.name} (${property.latestApplicant.status})`
                    : 'No active applications'}
                </p>
              </div>
              <Button
                variant="ghost"
                className="justify-between rounded-2xl border border-transparent hover:border-primary/40 hover:text-primary"
                onClick={() => navigate(ROUTES.LANDLORD_APPLICATIONS)}
              >
                <span>View all applications</span>
                <MessageCircle className="h-4 w-4" />
              </Button>
            </section>

            <section className="rounded-3xl border border-border/60 bg-surface/95 backdrop-blur-xl shadow-lg p-5 space-y-2">
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Tenant</h2>
              {property.tenant ? (
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>
                    <span className="font-semibold text-foreground">Tenant name:</span> {property.tenant.name}
                  </p>
                  <p>
                    <span className="font-semibold text-foreground">Rental period:</span> {property.tenant.period}
                  </p>
                  <p>
                    <span className="font-semibold text-foreground">Contact:</span> {property.tenant.contactMethod}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No active tenant.</p>
              )}
            </section>

            <section className="rounded-3xl border border-border/60 bg-surface/95 backdrop-blur-xl shadow-lg p-5 space-y-2">
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Payment</h2>
              {property.payment ? (
                <>
                  <p className="text-sm text-muted-foreground">
                    Latest Payment: <span className="font-semibold text-foreground">
                      {property.payment.lastPaymentStatus}
                    </span>
                  </p>
                  {property.payment.lastPaymentDate && (
                    <p className="text-xs text-muted-foreground">
                      {`Last transaction: ${format(new Date(property.payment.lastPaymentDate), 'd MMM yyyy')}`}
                    </p>
                  )}
                  <Button
                    variant="ghost"
                    className="justify-between rounded-2xl border border-transparent hover:border-primary/40 hover:text-primary mt-2"
                    onClick={() => navigate(ROUTES.LANDLORD_EARNINGS)}
                  >
                    <span>View payment history</span>
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">No payment records.</p>
              )}
            </section>

            <section className="rounded-3xl border border-border/60 bg-surface/95 backdrop-blur-xl shadow-lg p-5 space-y-3 lg:col-span-2">
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Docs</h2>
              <div className="grid gap-2">
                {property.documents.map((doc) => (
                  <button
                    key={doc.id}
                    className="w-full flex items-center justify-between px-4 py-3 bg-background rounded-2xl border border-border/40 text-sm font-medium text-foreground hover:border-primary/50 hover:text-primary transition-colors"
                  >
                    {doc.name}
                    <FileText className="h-4 w-4" />
                  </button>
                ))}
              </div>
            </section>
          </div>
        </section>
      </main>

      <LandlordNav />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <AuthDialog open={isDrawerOpen} onOpenChange={setIsDrawerOpen} />
      <Footer />
    </div>
  )
}

