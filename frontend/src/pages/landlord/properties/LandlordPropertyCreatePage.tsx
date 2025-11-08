import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '@/widgets/header'
import { Sidebar } from '@/widgets/sidebar'
import { Footer } from '@/widgets/footer'
import { AuthDrawer } from '@/widgets/auth-drawer'
import { useAuthStore } from '@/shared/store/auth.store'
import { ROUTES } from '@/shared/constants/routes'
import { LandlordNav } from '@/widgets/landlord-nav'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Textarea } from '@/shared/ui/textarea'
import { Checkbox } from '@/shared/ui/checkbox'
import { Label } from '@/shared/ui/label'
import { toast } from 'react-hot-toast'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'
import { cn } from '@/shared/lib/utils/cn'
import { Upload, CheckCircle2, Building2, Video, Sparkles, ArrowLeft } from 'lucide-react'

type StepKey = 'address' | 'details' | 'pricing' | 'media' | 'summary'

interface FormState {
  unitNumber: string
  propertyName: string
  address: string
  postcode: string
  propertyType: string
  carpark: string
  bedrooms: string
  bathrooms: string
  floorLevel: string
  buildUpSize: string
  furnishing: string
  facilities: string[]
  utilities: {
    electricity: string
    water: string
    internet: string
    security: string
  }
  allowShortlet: boolean
  rentAmount: string
  negotiable: boolean
  tenancyDurations: string[]
  description: string
  images: Array<{ id: string; url: string; file?: File }>
  video?: { id: string; url: string; file?: File }
}

const essentialAmenities = ['Electricity', 'Water', 'Internet', 'Security']

const stepOrder: StepKey[] = ['address', 'details', 'pricing', 'media', 'summary']

const stepMeta: Record<StepKey, { title: string; subtitle: string }> = {
  address: {
    title: 'Property Address',
    subtitle: 'Tell us where the property is located',
  },
  details: {
    title: 'Property Details',
    subtitle: 'Describe the spaces, amenities, and utilities available',
  },
  pricing: {
    title: 'Rental Agreement',
    subtitle: 'Set rental price, negotiable terms, and tenancy preferences',
  },
  media: {
    title: 'Property Media',
    subtitle: 'Upload at least 4 photos and optionally a walk-through video',
  },
  summary: {
    title: 'Publish Listing',
    subtitle: 'Review details before sending to Julaaz for inspection',
  },
}

const propertyTypes = ['Apartment', 'Highrise', 'Townhouse', 'Duplex', 'Bungalow', 'Studio']
const carparks = ['0', '1', '2', '3', '4+']
const bedroomOptions = ['1 Bedroom', '2 Bedrooms', '3 Bedrooms', '4 Bedrooms', '5+ Bedrooms']
const bathroomOptions = ['1 Bathroom', '2 Bathrooms', '3 Bathrooms', '4 Bathrooms', '5+ Bathrooms']
const furnishingOptions = ['Furnished', 'Semi-furnished', 'Unfurnished']
const facilityOptions = ['Gym', 'Pool', '24/7 Power', 'Concierge', 'Smart Access', 'Workspace']
const utilityOptions = ['Yes', 'No', 'Included in Rent']
const tenancyDurations = ['3 months', '6 months', '9 months', '12 months', '24 months']

const defaultState: FormState = {
  unitNumber: '',
  propertyName: '',
  address: '',
  postcode: '',
  propertyType: propertyTypes[0],
  carpark: carparks[0],
  bedrooms: bedroomOptions[0],
  bathrooms: bathroomOptions[0],
  floorLevel: '',
  buildUpSize: '',
  furnishing: furnishingOptions[0],
  facilities: [],
  utilities: {
    electricity: 'Yes',
    water: 'Yes',
    internet: 'Yes',
    security: 'Yes',
  },
  allowShortlet: false,
  rentAmount: '',
  negotiable: false,
  tenancyDurations: [],
  description: '',
  images: [],
}

export function LandlordPropertyCreatePage() {
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const [step, setStep] = useState<StepKey>('address')
  const [form, setForm] = useState<FormState>(defaultState)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const currentStepIndex = useMemo(() => stepOrder.indexOf(step), [step])

  const handleMenuClick = () => setIsSidebarOpen(true)
  const handleProfileClick = () => {
    if (!isAuthenticated) {
      setIsDrawerOpen(true)
    } else {
      navigate(ROUTES.PROFILE)
    }
  }

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const toggleFacility = (facility: string) => {
    setForm((prev) => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter((f) => f !== facility)
        : [...prev.facilities, facility],
    }))
  }

  const toggleTenancyDuration = (duration: string) => {
    setForm((prev) => ({
      ...prev,
      tenancyDurations: prev.tenancyDurations.includes(duration)
        ? prev.tenancyDurations.filter((d) => d !== duration)
        : [...prev.tenancyDurations, duration],
    }))
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return
    const selectedFiles = Array.from(files).slice(0, 4)
    const mapped = selectedFiles.map((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}`,
      url: URL.createObjectURL(file),
      file,
    }))
    setForm((prev) => ({ ...prev, images: mapped }))
  }

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setForm((prev) => ({
      ...prev,
      video: {
        id: `${file.name}-${file.size}-${file.lastModified}`,
        url: URL.createObjectURL(file),
        file,
      },
    }))
  }

  const hasEssentialAmenities = useMemo(() => {
    return essentialAmenities.every((amenity) => {
      const key = amenity.toLowerCase() as keyof typeof form.utilities
      return form.utilities[key as keyof typeof form.utilities] !== 'No'
    })
  }, [form.utilities])

  const goNext = () => {
    if (currentStepIndex === stepOrder.length - 1) return

    if (step === 'media' && form.images.length < 4) {
      toast.error('Please upload at least 4 photos')
      return
    }

    setStep(stepOrder[currentStepIndex + 1])
  }

  const goPrev = () => {
    if (currentStepIndex === 0) return
    setStep(stepOrder[currentStepIndex - 1])
  }

  const handleSubmit = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      toast.success('Listing submitted. Admin will inspect & approve before going live.')
      navigate(ROUTES.LANDLORD_PROPERTIES)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-muted relative">
      <Header onMenuClick={handleMenuClick} onProfileClick={handleProfileClick} />
      <main className="relative z-10 flex-1 pb-28 lg:pb-16">
        <section className="container mx-auto px-4 lg:px-8 xl:px-12 max-w-5xl py-6 space-y-8">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-2xl border border-border/60 hover:bg-primary/10 hover:text-primary"
              onClick={() => navigate(-1)}
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-[0.25em]">
              <Building2 className="h-4 w-4 text-primary" />
              <span>New Listing</span>
            </div>
            <div className="h-10 w-10" />
          </div>

          {/* Step indicator */}
          <div className="flex items-center justify-between px-2">
            {stepOrder.map((key, index) => {
              const completed = index < currentStepIndex
              const active = index === currentStepIndex
              return (
                <div key={key} className="flex-1 flex items-center gap-2">
                  <div
                    className={cn(
                      'h-9 w-9 rounded-full border flex items-center justify-center text-xs font-semibold transition-colors',
                      completed
                        ? 'bg-primary text-primary-foreground border-primary'
                        : active
                          ? 'bg-primary/10 text-primary border-primary/40'
                          : 'bg-muted text-muted-foreground border-border'
                    )}
                  >
                    {completed ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
                  </div>
                  {index < stepOrder.length - 1 && (
                    <div
                      className={cn(
                        'flex-1 h-0.5 rounded-full',
                        completed ? 'bg-primary' : 'bg-border'
                      )}
                    />
                  )}
                </div>
              )
            })}
          </div>
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-bold text-foreground">{stepMeta[step].title}</h1>
            <p className="text-sm text-muted-foreground">{stepMeta[step].subtitle}</p>
          </div>

          {/* Step content */}
          <div className="rounded-3xl border border-border/60 bg-surface/95 backdrop-blur-xl shadow-lg p-6 space-y-6">
            {step === 'address' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="unitNumber" className="text-xs uppercase text-muted-foreground">
                    Unit Number
                  </Label>
                  <Input
                    id="unitNumber"
                    placeholder="Enter unit number"
                    value={form.unitNumber}
                    onChange={(e) => setField('unitNumber', e.target.value)}
                    className="mt-2 rounded-2xl bg-muted/40 border-border/60"
                  />
                </div>
                <div>
                  <Label htmlFor="propertyName" className="text-xs uppercase text-muted-foreground">
                    Property Name
                  </Label>
                  <Input
                    id="propertyName"
                    placeholder="Enter property name"
                    value={form.propertyName}
                    onChange={(e) => setField('propertyName', e.target.value)}
                    className="mt-2 rounded-2xl bg-muted/40 border-border/60"
                  />
                </div>
                <div>
                  <Label htmlFor="address" className="text-xs uppercase text-muted-foreground">
                    Address
                  </Label>
                  <Input
                    id="address"
                    placeholder="Enter address"
                    value={form.address}
                    onChange={(e) => setField('address', e.target.value)}
                    className="mt-2 rounded-2xl bg-muted/40 border-border/60"
                  />
                </div>
                <div>
                  <Label htmlFor="postcode" className="text-xs uppercase text-muted-foreground">
                    Postcode
                  </Label>
                  <Input
                    id="postcode"
                    placeholder="Enter postcode"
                    value={form.postcode}
                    onChange={(e) => setField('postcode', e.target.value)}
                    className="mt-2 rounded-2xl bg-muted/40 border-border/60"
                  />
                </div>
              </div>
            )}

            {step === 'details' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs uppercase text-muted-foreground">Property Type</Label>
                    <Select
                      value={form.propertyType}
                      onValueChange={(value) => setField('propertyType', value)}
                    >
                      <SelectTrigger className="mt-2 rounded-2xl bg-muted/40 border-border/60">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {propertyTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs uppercase text-muted-foreground">Carpark</Label>
                    <Select value={form.carpark} onValueChange={(value) => setField('carpark', value)}>
                      <SelectTrigger className="mt-2 rounded-2xl bg-muted/40 border-border/60">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {carparks.map((item) => (
                          <SelectItem key={item} value={item}>
                            {item} Carpark
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs uppercase text-muted-foreground">Bedrooms</Label>
                    <Select value={form.bedrooms} onValueChange={(value) => setField('bedrooms', value)}>
                      <SelectTrigger className="mt-2 rounded-2xl bg-muted/40 border-border/60">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {bedroomOptions.map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs uppercase text-muted-foreground">Bathrooms</Label>
                    <Select value={form.bathrooms} onValueChange={(value) => setField('bathrooms', value)}>
                      <SelectTrigger className="mt-2 rounded-2xl bg-muted/40 border-border/60">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {bathroomOptions.map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="floorLevel" className="text-xs uppercase text-muted-foreground">
                      Floor Level
                    </Label>
                    <Input
                      id="floorLevel"
                      placeholder="Enter floor level"
                      value={form.floorLevel}
                      onChange={(e) => setField('floorLevel', e.target.value)}
                      className="mt-2 rounded-2xl bg-muted/40 border-border/60"
                    />
                  </div>
                  <div>
                    <Label htmlFor="buildUpSize" className="text-xs uppercase text-muted-foreground">
                      Build-up size (sqft)
                    </Label>
                    <Input
                      id="buildUpSize"
                      placeholder="Enter size"
                      value={form.buildUpSize}
                      onChange={(e) => setField('buildUpSize', e.target.value)}
                      className="mt-2 rounded-2xl bg-muted/40 border-border/60"
                    />
                  </div>
                  <div>
                    <Label className="text-xs uppercase text-muted-foreground">Furnishing</Label>
                    <Select value={form.furnishing} onValueChange={(value) => setField('furnishing', value)}>
                      <SelectTrigger className="mt-2 rounded-2xl bg-muted/40 border-border/60">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {furnishingOptions.map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-xs uppercase text-muted-foreground">Facilities</Label>
                  <div className="flex flex-wrap gap-2">
                    {facilityOptions.map((facility) => {
                      const active = form.facilities.includes(facility)
                      return (
                        <button
                          key={facility}
                          className={cn(
                            'px-4 py-2 rounded-2xl text-sm font-semibold border transition-all',
                            active
                              ? 'bg-primary text-primary-foreground border-primary shadow-lg'
                              : 'border-border text-muted-foreground hover:border-primary/40 hover:text-primary'
                          )}
                          onClick={() => toggleFacility(facility)}
                          type="button"
                        >
                          {facility}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                    Utilities
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Please indicate the availability of essential utilities at this property.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Object.entries(form.utilities).map(([key, value]) => (
                      <div key={key}>
                        <Label className="text-xs uppercase text-muted-foreground">
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </Label>
                        <Select
                          value={value}
                          onValueChange={(val) =>
                            setForm((prev) => ({
                              ...prev,
                              utilities: { ...prev.utilities, [key]: val },
                            }))
                          }
                        >
                          <SelectTrigger className="mt-2 rounded-2xl bg-muted/40 border-border/60">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {utilityOptions.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-2xl bg-primary/10 border border-primary/20 text-primary text-sm">
                    <Sparkles className="h-4 w-4" />
                    <p>
                      {hasEssentialAmenities
                        ? 'This property qualifies for shortlet if you opt-in.'
                        : 'Enable essential utilities (power, water, internet, security) to qualify for shortlet bookings.'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="allowShortlet"
                      checked={form.allowShortlet}
                      disabled={!hasEssentialAmenities}
                      onChange={(event) => setField('allowShortlet', event.target.checked)}
                    />
                    <Label htmlFor="allowShortlet" className="text-sm text-foreground">
                      Allow shortlet bookings while looking for a long-term tenant
                    </Label>
                  </div>
                </div>
              </div>
            )}

            {step === 'pricing' && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-xs uppercase text-muted-foreground">Rental price (annual)</Label>
                  <Input
                    placeholder="Enter amount (e.g. 2400000)"
                    value={form.rentAmount}
                    onChange={(e) => setField('rentAmount', e.target.value)}
                    type="number"
                  />
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="negotiable"
                      checked={form.negotiable}
                      onChange={(event) => setField('negotiable', event.target.checked)}
                    />
                    <Label htmlFor="negotiable" className="text-sm text-foreground">
                      Negotiable
                    </Label>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-xs uppercase text-muted-foreground">Preferred tenancy length</Label>
                  <div className="flex flex-wrap gap-2">
                    {tenancyDurations.map((duration) => {
                      const active = form.tenancyDurations.includes(duration)
                      return (
                        <button
                          key={duration}
                          className={cn(
                            'px-4 py-2 rounded-2xl text-sm font-semibold border transition-all',
                            active
                              ? 'bg-primary text-primary-foreground border-primary shadow-lg'
                              : 'border-border text-muted-foreground hover:border-primary/40 hover:text-primary'
                          )}
                          onClick={() => toggleTenancyDuration(duration)}
                          type="button"
                        >
                          {duration}
                        </button>
                      )
                    })}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Landlord can indicate minimum shortlet nights or monthly leases in advanced settings later.
                  </p>
                </div>
              </div>
            )}

            {step === 'media' && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-xs uppercase text-muted-foreground">Property photos</Label>
                  <p className="text-xs text-muted-foreground">
                    Upload at least four bright, recent photos. Arrange them in the order you want tenants to see.
                  </p>
                  <label className="flex flex-col items-center justify-center gap-3 h-40 rounded-3xl border-2 border-dashed border-border/60 bg-muted/40 text-sm text-muted-foreground hover:border-primary/40 cursor-pointer transition-colors">
                    <Upload className="h-6 w-6" />
                    <span>Tap to upload 4 photos</span>
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                  </label>
                  {form.images.length > 0 && (
                    <div className="grid grid-cols-2 gap-3">
                      {form.images.map((image) => (
                        <div key={image.id} className="relative rounded-2xl overflow-hidden border border-border/60">
                          <img src={image.url} alt="Property preview" className="w-full h-32 object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-xs uppercase text-muted-foreground">Property video (optional)</Label>
                  <p className="text-xs text-muted-foreground">Upload one short tour video. Max size 200MB.</p>
                  <label className="flex flex-col items-center justify-center gap-3 h-32 rounded-3xl border-2 border-dashed border-border/60 bg-muted/40 text-sm text-muted-foreground hover:border-primary/40 cursor-pointer transition-colors">
                    <Video className="h-6 w-6" />
                    <span>{form.video ? 'Replace video' : 'Tap to upload video'}</span>
                    <input type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} />
                  </label>
                  {form.video && (
                    <div className="rounded-2xl overflow-hidden border border-border/60">
                      <video src={form.video.url} controls className="w-full h-40 object-cover" />
                    </div>
                  )}
                </div>

                <p className="text-xs text-muted-foreground">
                  The video will appear last in the gallery slider after the uploaded photos.
                </p>
              </div>
            )}

            {step === 'summary' && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <h2 className="text-base font-semibold text-foreground">Summary</h2>
                  <p className="text-sm text-muted-foreground">
                    Ensure all details are accurate. Once submitted, the listing will be queued for Julaaz inspection
                    before going live.
                  </p>
                </div>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div>
                    <h3 className="font-semibold text-foreground">Address</h3>
                    <p>{form.propertyName}</p>
                    <p>{form.address}</p>
                    <p>{form.postcode}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Details</h3>
                    <p>{form.propertyType} • {form.bedrooms} • {form.bathrooms}</p>
                    <p>{form.buildUpSize ? `${form.buildUpSize} sqft` : 'Size not provided'}</p>
                    <p>Furnishing: {form.furnishing}</p>
                    <p>Facilities: {form.facilities.length ? form.facilities.join(', ') : 'None selected'}</p>
                    <p>Utilities: Electricity {form.utilities.electricity}, Water {form.utilities.water}, Internet {form.utilities.internet}, Security {form.utilities.security}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Pricing</h3>
                    <p>Annual rent: ₦{form.rentAmount || '0'}{form.negotiable ? ' (Negotiable)' : ''}</p>
                    <p>Preferred tenancy: {form.tenancyDurations.length ? form.tenancyDurations.join(', ') : 'Not specified'}</p>
                    <p>Shortlet ready: {form.allowShortlet ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Media</h3>
                    <p>{form.images.length} photo(s) uploaded • {form.video ? '1 video attached' : 'No video'}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase text-muted-foreground">Listing description</Label>
                  <Textarea
                    placeholder="Write a detailed description highlighting amenities, neighbourhood, policies…"
                    value={form.description}
                    onChange={(e) => setField('description', e.target.value)}
                    className="min-h-[140px] resize-none rounded-2xl"
                  />
                </div>
                <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 text-sm text-primary">
                  <p>
                    After submission, a Julaaz inspector will review the property physically. Once approved, the listing
                    will appear in the marketplace. You’ll receive updates in Notifications & Messages.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              className="h-12 rounded-2xl px-6 border border-border/60 hover:border-primary/40 hover:text-primary"
              onClick={goPrev}
              disabled={currentStepIndex === 0}
            >
              Previous
            </Button>
            {step !== 'summary' ? (
              <Button
                className="h-12 rounded-2xl px-6 bg-primary text-primary-foreground shadow-lg hover:shadow-xl"
                onClick={goNext}
              >
                Continue
              </Button>
            ) : (
              <Button
                className="h-12 rounded-2xl px-6 bg-primary text-primary-foreground shadow-lg hover:shadow-xl"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Publish'}
              </Button>
            )}
          </div>
        </section>
      </main>

      <LandlordNav />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <AuthDrawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} />
      <Footer />
    </div>
  )
}

