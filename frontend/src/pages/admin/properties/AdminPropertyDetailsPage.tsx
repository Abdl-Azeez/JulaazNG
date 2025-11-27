import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Bath,
  Bed,
  Car,
  MapPin,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Edit,
  Trash2,
  Ban,
  User,
} from 'lucide-react'
import HouseIcon from '@/assets/icons/house.svg?react'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import { Card } from '@/shared/ui/card'
import { Avatar, AvatarFallback } from '@/shared/ui/avatar'
import { Footer } from '@/widgets/footer'
import { Sidebar } from '@/widgets/sidebar'
import { Header } from '@/widgets/header'
import { samplePropertyDetails } from '@/pages/property-details/data/sample-property-details'
import { cn } from '@/shared/lib/utils/cn'
import type { PropertyDetail } from '@/entities/property/model/types'
import { ROUTES } from '@/shared/constants/routes'
import toast from 'react-hot-toast'

const formatCurrency = (value: number) =>
  `₦${new Intl.NumberFormat('en-NG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)}`

export function AdminPropertyDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [propertyStatus, setPropertyStatus] = useState<'active' | 'pending' | 'suspended' | 'rejected'>('pending')

  // Try to get property from samplePropertyDetails first, then fallback to admin properties
  const property: PropertyDetail | undefined = id ? samplePropertyDetails[id] : undefined

  const galleryImages = useMemo(() => {
    if (!property) return []
    if (property.images && property.images.length > 0) {
      return property.images
    }
    return property.image ? [property.image] : []
  }, [property])

  const [activeImageIndex, setActiveImageIndex] = useState(0)

  useEffect(() => {
    setActiveImageIndex(0)
  }, [galleryImages.length])

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1))
  }

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1))
  }

  const handleSelectImage = (index: number) => {
    setActiveImageIndex(index)
  }

  const breadcrumbItems = ['Admin', 'Properties', property?.name || 'Property Details']
  const specs = useMemo(
    () => [
      {
        label: `${property?.area ?? 0} sqft`,
        icon: HouseIcon,
      },
      {
        label: `${property?.bedrooms ?? 0} Beds`,
        icon: Bed,
      },
      {
        label: `${property?.bathrooms ?? 0} Baths`,
        icon: Bath,
      },
      {
        label: `${property?.parking ?? 0} Parking`,
        icon: Car,
      },
    ],
    [property?.area, property?.bathrooms, property?.bedrooms, property?.parking]
  )

  const handleBack = () => {
    navigate(ROUTES.ADMIN_PROPERTIES)
  }

  const handleApprove = () => {
    setPropertyStatus('active')
    toast.success('Property approved and activated')
  }

  const handleReject = () => {
    setPropertyStatus('rejected')
    toast.success('Property rejected')
  }

  const handleSuspend = () => {
    setPropertyStatus('suspended')
    toast.success('Property suspended')
  }

  const handleReactivate = () => {
    setPropertyStatus('active')
    toast.success('Property reactivated')
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      toast.success('Property deleted')
      navigate(ROUTES.ADMIN_PROPERTIES)
    }
  }

  const handleEdit = () => {
    toast.success('Opening edit page...')
    // TODO: Navigate to edit page
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header
          className="hidden lg:block"
          onMenuClick={() => setIsSidebarOpen(true)}
          onProfileClick={() => navigate(ROUTES.PROFILE)}
        />
        <main className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-4">
          <h1 className="text-2xl font-bold text-foreground">Property not found</h1>
          <p className="text-muted-foreground max-w-md">
            We couldn&apos;t locate this property. It may have been removed or the link is incorrect.
          </p>
          <div className="flex gap-3">
            <Button onClick={handleBack} variant="outline" className="rounded-xl">
              Go Back
            </Button>
            <Button onClick={() => navigate(ROUTES.ADMIN_PROPERTIES)} className="rounded-xl">
              View All Properties
            </Button>
          </div>
        </main>
        <Footer />
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      </div>
    )
  }

  const rentalCategories = property.rentalCategories ?? []
  const hasLongTerm = rentalCategories.includes('long_term')
  const hasShortlet = rentalCategories.includes('shortlet')
  const longTermOffering = property.longTermOffering
  const shortletOffering = property.shortletOffering
  const heroImage = galleryImages[activeImageIndex]
  const hasMultipleImages = galleryImages.length > 1

  const statusColors: Record<typeof propertyStatus, string> = {
    active: 'bg-emerald-500/10 text-emerald-600',
    pending: 'bg-amber-500/10 text-amber-600',
    suspended: 'bg-red-500/10 text-red-600',
    rejected: 'bg-gray-500/10 text-gray-600',
  }

  const statusIcons: Record<typeof propertyStatus, React.ReactNode> = {
    active: <CheckCircle className="h-3 w-3" />,
    pending: <Clock className="h-3 w-3" />,
    suspended: <AlertTriangle className="h-3 w-3" />,
    rejected: <XCircle className="h-3 w-3" />,
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        className="hidden lg:block"
        onMenuClick={() => setIsSidebarOpen(true)}
        onProfileClick={() => navigate(ROUTES.PROFILE)}
      />

      {/* Hero / Gallery */}
      <section className="relative">
        <div className="relative aspect-[16/11] w-full overflow-hidden bg-muted lg:aspect-[16/7]">
          {heroImage && (
            <img
              src={heroImage}
              alt={`${property.name} - Image ${activeImageIndex + 1}`}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          )}

          {hasMultipleImages && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/80 text-foreground backdrop-blur hover:bg-background transition-colors shadow-lg flex items-center justify-center"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/80 text-foreground backdrop-blur hover:bg-background transition-colors shadow-lg flex items-center justify-center"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 hidden sm:flex gap-2 px-3 py-2 rounded-full bg-background/80 backdrop-blur-sm shadow-lg">
                {galleryImages.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    onClick={() => handleSelectImage(index)}
                    className={cn(
                      'h-2.5 w-2.5 rounded-full transition-all',
                      index === activeImageIndex ? 'bg-primary w-4' : 'bg-muted-foreground/40'
                    )}
                    aria-label={`Show image ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}

          <div className="absolute top-3 left-0 right-0 px-4 flex items-center justify-between lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full bg-background text-foreground shadow-lg hover:bg-primary/10 hover:text-primary transition-colors"
              onClick={handleBack}
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Badge className={cn('rounded-full flex items-center gap-1 shadow-sm', statusColors[propertyStatus])}>
              {statusIcons[propertyStatus]}
              {propertyStatus}
            </Badge>
          </div>

          {hasMultipleImages && (
            <div className="absolute inset-x-0 bottom-2 px-4 sm:hidden">
              <div className="flex items-center justify-center gap-1.5">
                {galleryImages.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    onClick={() => handleSelectImage(index)}
                    className={cn(
                      'h-2 w-2 rounded-full transition-all',
                      index === activeImageIndex ? 'bg-primary w-4' : 'bg-background/80'
                    )}
                    aria-label={`Show image ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <main className="flex-1">
        <div className="container mx-auto px-4 lg:px-6 xl:px-8 py-6 lg:py-10 max-w-5xl">
          {/* Mobile Breadcrumb */}
          <div className="lg:hidden mb-5">
            <div className="inline-flex items-center gap-1 rounded-full bg-surface border border-border px-3 py-2 text-xs text-muted-foreground">
              {breadcrumbItems.map((item, index) => (
                <span key={item} className="flex items-center gap-1">
                  <span className={cn(index === breadcrumbItems.length - 1 && 'text-foreground font-medium')}>
                    {item}
                  </span>
                  {index < breadcrumbItems.length - 1 && <ChevronRight className="h-3 w-3 opacity-70" />}
                </span>
              ))}
            </div>
          </div>

          {/* Breadcrumb */}
          <div className="hidden lg:flex items-center justify-between mb-6">
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Properties
            </button>
            <nav className="flex items-center text-sm text-muted-foreground">
              {breadcrumbItems.map((item, index) => (
                <span key={item} className="flex items-center">
                  <span className={cn(index === breadcrumbItems.length - 1 && 'text-foreground font-medium')}>
                    {item}
                  </span>
                  {index < breadcrumbItems.length - 1 && <ChevronRight className="h-4 w-4 mx-2 opacity-70" />}
                </span>
              ))}
            </nav>
          </div>

          {/* Admin Actions Bar */}
          <div className="mb-6 p-4 rounded-2xl border border-border/60 bg-surface flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Badge className={cn('rounded-full capitalize', statusColors[propertyStatus])}>
                {statusIcons[propertyStatus]}
                {propertyStatus}
              </Badge>
              {property.owner.verified && (
                <Badge className="rounded-full bg-emerald-500/10 text-emerald-600">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified Owner
                </Badge>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {propertyStatus === 'pending' && (
                <>
                  <Button
                    className="rounded-xl bg-emerald-600 hover:bg-emerald-700"
                    onClick={handleApprove}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-xl text-red-600 border-red-600/30 hover:bg-red-50"
                    onClick={handleReject}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </>
              )}
              {propertyStatus === 'active' && (
                <Button
                  variant="outline"
                  className="rounded-xl text-amber-600 border-amber-600/30 hover:bg-amber-50"
                  onClick={handleSuspend}
                >
                  <Ban className="h-4 w-4 mr-2" />
                  Suspend
                </Button>
              )}
              {propertyStatus === 'suspended' && (
                <Button
                  variant="outline"
                  className="rounded-xl text-emerald-600 border-emerald-600/30 hover:bg-emerald-50"
                  onClick={handleReactivate}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Reactivate
                </Button>
              )}
              <Button variant="outline" className="rounded-xl" onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                className="rounded-xl text-red-600 border-red-600/30 hover:bg-red-50"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>

          {/* Price & Specs */}
          <div className="space-y-4 lg:space-y-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    {property.transactionType}
                  </p>
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground">{property.name}</h1>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className="rounded-full bg-primary/10 text-primary px-3 py-1 text-xs">
                    {property.propertyType}
                  </Badge>
                  <Badge className="rounded-full bg-surface/70 text-foreground px-3 py-1 text-xs">
                    {property.neighbourhood}, {property.city}
                  </Badge>
                  {hasShortlet && (
                    <Badge className="rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 px-3 py-1 text-xs">
                      Shortlet Ready
                    </Badge>
                  )}
                </div>
                <div className="flex flex-col items-start sm:items-end">
                  {hasLongTerm && longTermOffering && (
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold text-primary">{formatCurrency(longTermOffering.annualRent)}</p>
                      <span className="text-sm text-muted-foreground">per year</span>
                    </div>
                  )}
                  {shortletOffering && (
                    <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-300">
                      {hasLongTerm ? 'Shortlet from ' : 'From '}
                      {formatCurrency(shortletOffering.nightlyRate)}
                      <span className="text-muted-foreground"> / night</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 lg:gap-6">
              {specs.map((spec) => (
                <div key={spec.label} className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <spec.icon className="h-4 w-4" />
                  <span className="text-foreground">{spec.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {hasLongTerm && longTermOffering && (
              <Card className="p-4 rounded-2xl border border-border bg-surface">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Move-In Breakdown</p>
                    <p className="text-lg font-semibold text-foreground">
                      {formatCurrency(
                        property.moveInBreakdown?.reduce((sum, item) => sum + item.amount, 0) || 0
                      )}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    className="rounded-xl text-sm font-medium text-primary hover:bg-primary/10"
                    onClick={() =>
                      document
                        .getElementById('property-movein')
                        ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }
                  >
                    View Details
                  </Button>
                </div>
              </Card>
            )}

            {hasShortlet && shortletOffering && (
              <Card className="p-4 rounded-2xl border border-border bg-surface">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Shortlet Summary</p>
                    <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-300">
                      {formatCurrency(shortletOffering.nightlyRate)} / night
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Min {shortletOffering.minimumStayNights} nights • Max {shortletOffering.maxGuests ?? 4} guests
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    className="rounded-xl text-sm font-medium text-emerald-600 dark:text-emerald-300 hover:bg-emerald-500/10"
                    onClick={() =>
                      document
                        .getElementById('property-shortlet-details')
                        ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }
                  >
                    Explore
                  </Button>
                </div>
              </Card>
            )}

            <Card className="p-4 rounded-2xl border border-border bg-surface">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">Amenities</p>
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <span className="flex items-center gap-1 text-primary">
                      <span className="h-2 w-2 rounded-full bg-primary" />
                      {property.furnishingNotes ?? (property.isFurnished ? 'Fully Furnished' : 'Unfurnished')}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  className="rounded-xl text-sm font-medium text-primary hover:bg-primary/10"
                  onClick={() =>
                    document
                      .getElementById('property-amenities')
                      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }
                >
                  Explore
                </Button>
              </div>
            </Card>

            <Card className="p-4 rounded-2xl border border-border bg-surface">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="text-sm font-medium text-foreground flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-primary" />
                    {property.address}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  className="rounded-xl text-sm font-medium text-primary hover:bg-primary/10"
                  onClick={() =>
                    document
                      .getElementById('property-location')
                      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }
                >
                  View Map
                </Button>
              </div>
            </Card>
          </div>

          {/* Rental Options - Same as tenant view */}
          {(hasLongTerm && longTermOffering) || (hasShortlet && shortletOffering) ? (
            <section id="property-rental-options" className="mt-10 space-y-6">
              <div className="flex flex-col gap-2">
                <h2 className="text-xl lg:text-2xl font-semibold text-foreground">Rental options</h2>
                <p className="text-sm text-muted-foreground">
                  Choose the plan that suits your stay. We support flexible short-term bookings alongside traditional
                  annual leases where available.
                </p>
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                {hasLongTerm && longTermOffering && (
                  <Card className="p-5 lg:p-6 rounded-2xl border border-border bg-surface space-y-4">
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-wide font-semibold text-primary">Annual lease</p>
                      <h3 className="text-lg font-semibold text-foreground">
                        {formatCurrency(longTermOffering.annualRent)} per year
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Approx.{' '}
                        {formatCurrency(
                          longTermOffering.monthlyRent ?? Math.round(longTermOffering.annualRent / 12)
                        )}{' '}
                        per month • Minimum stay {longTermOffering.minimumTermMonths}+ months
                      </p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-2">Payment plan</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          {(longTermOffering.paymentPlan ?? []).map((plan) => (
                            <li key={plan} className="flex items-start gap-2">
                              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary/70" />
                              <span>{plan}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-2">Utilities included</h4>
                        <div className="flex flex-wrap gap-2">
                          {(longTermOffering.utilitiesIncluded ?? []).map((utility) => (
                            <span
                              key={utility}
                              className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium"
                            >
                              {utility}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    {longTermOffering.notes && (
                      <div className="rounded-xl bg-primary/5 border border-primary/10 p-3 text-xs text-primary/80">
                        {longTermOffering.notes}
                      </div>
                    )}
                  </Card>
                )}

                {hasShortlet && shortletOffering && (
                  <Card
                    id="property-shortlet-details"
                    className="p-5 lg:p-6 rounded-2xl border border-border bg-surface space-y-4"
                  >
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-wide font-semibold text-emerald-600 dark:text-emerald-300">
                        Shortlet stay
                      </p>
                      <h3 className="text-lg font-semibold text-foreground">{shortletOffering.headline}</h3>
                      <p className="text-sm text-muted-foreground">
                        From {formatCurrency(shortletOffering.nightlyRate)} per night • Minimum stay{' '}
                        {shortletOffering.minimumStayNights} night{shortletOffering.minimumStayNights > 1 ? 's' : ''}{' '}
                        • Max {shortletOffering.maxGuests ?? 4} guests
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Check-in {shortletOffering.checkInWindow} • Check-out {shortletOffering.checkOutTime}
                      </p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-2">Services included</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          {(shortletOffering.servicesIncluded ?? []).slice(0, 5).map((service) => (
                            <li key={service} className="flex items-start gap-2">
                              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              <span>{service}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-2">Facilities</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          {(shortletOffering.facilities ?? []).slice(0, 5).map((facility) => (
                            <li key={facility} className="flex items-start gap-2">
                              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              <span>{facility}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-2">House rules</h4>
                      <ul className="grid gap-2 sm:grid-cols-2 text-xs text-muted-foreground">
                        {(shortletOffering.houseRules ?? []).slice(0, 6).map((rule) => (
                          <li key={rule} className="flex items-start gap-2">
                            <span className="mt-1 h-1 w-1 rounded-full bg-emerald-500" />
                            <span>{rule}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                      {shortletOffering.cleaningFee && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 px-3 py-1">
                          Cleaning fee {formatCurrency(shortletOffering.cleaningFee)}
                        </span>
                      )}
                      {shortletOffering.securityDeposit && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 px-3 py-1">
                          Security deposit {formatCurrency(shortletOffering.securityDeposit)}
                        </span>
                      )}
                      {shortletOffering.weeklyRate && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 px-3 py-1">
                          Weekly {formatCurrency(shortletOffering.weeklyRate)}
                        </span>
                      )}
                      {shortletOffering.monthlyRate && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 px-3 py-1">
                          Monthly {formatCurrency(shortletOffering.monthlyRate)}
                        </span>
                      )}
                    </div>
                  </Card>
                )}
              </div>
            </section>
          ) : null}

          {/* Owner Section */}
          <section className="mt-8">
            <Card className="p-5 rounded-2xl border border-border bg-surface">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {property.owner.initials ?? property.owner.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-xs uppercase text-muted-foreground tracking-wide">Property Owner</p>
                    <p className="text-base font-semibold text-foreground flex items-center gap-1">
                      {property.owner.name}
                      {property.owner.verified && (
                        <CheckCircle className="h-4 w-4 text-primary" aria-hidden="true" />
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground">{property.propertyType}</p>
                  </div>
                </div>
              </div>
            </Card>
          </section>

          {/* About Property */}
          <section className="mt-6 space-y-6 lg:space-y-8">
            <Card className="p-5 rounded-2xl border border-border bg-surface">
              <h2 className="text-lg font-semibold text-foreground mb-3">About Property</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{property.description}</p>
              <ul className="space-y-2">
                {property.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-2 text-sm text-foreground">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary/70 shrink-0" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card id="property-amenities" className="p-5 rounded-2xl border border-border bg-surface">
              <h2 className="text-lg font-semibold text-foreground mb-3">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </Card>

            {hasLongTerm && (
              <Card id="property-movein" className="p-5 rounded-2xl border border-border bg-surface">
                <h2 className="text-lg font-semibold text-foreground mb-3">Move-In Breakdown</h2>
                <div className="space-y-3">
                  {property.moveInBreakdown.map((item) => (
                    <div key={item.label} className="flex items-center justify-between text-sm">
                      <span className="text-foreground">{item.label}</span>
                      <span className="font-semibold text-foreground">{formatCurrency(item.amount)}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            <Card id="property-location" className="p-5 rounded-2xl border border-border bg-surface space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Location</h2>
                  <p className="text-sm text-muted-foreground">{property.address}</p>
                </div>
              </div>
              <p className="text-sm text-foreground leading-relaxed">{property.locationDescription}</p>
              {property.mapUrl && (
                <Button variant="outline" className="rounded-xl" onClick={() => window.open(property.mapUrl, '_blank')}>
                  View on Maps
                </Button>
              )}
            </Card>
          </section>
        </div>
      </main>

      <Footer />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </div>
  )
}

