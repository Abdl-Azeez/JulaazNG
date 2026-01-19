import { useMemo, useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '@/widgets/header'
import { Sidebar } from '@/widgets/sidebar'
import { Footer } from '@/widgets/footer'
import { AuthDialog } from '@/widgets/auth-dialog'
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
import {
  Upload,
  CheckCircle2,
  Building2,
  Video,
  Sparkles,
  ArrowLeft,
  MapPin,
  Home,
  ShieldCheck,
  Coins,
  Image as ImageIcon,
  Info,
  CalendarRange,
  FileText,
} from 'lucide-react'

type StepKey = 'address' | 'details' | 'pricing' | 'media' | 'summary'

interface FormState {
  propertyUse: 'rental' | 'shortlet'
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
  nearby: string[]
  utilities: {
    electricity: string
    water: string
    internet: string
    security: string
  }
  electricityType: '' | 'generator' | 'solar' | 'government'
  allowShortlet: boolean
  rentAmount: string
  negotiable: boolean
  tenancyDurations: string[]
  preferredPayment: '' | 'monthly' | 'quarterly' | 'six-monthly' | 'annually'
  description: string
  images: Array<{ id: string; url: string; file?: File }>
  video?: { id: string; url: string; file?: File }
  agreementType: 'julaaz' | 'custom'
  customAgreement?: File
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

const propertyUseOptions: Array<{ value: FormState['propertyUse']; label: string; helper: string }> = [
  { value: 'rental', label: 'Rental', helper: 'Annual or multi-month stays, can also allow shortlet' },
  { value: 'shortlet', label: 'Shortlet', helper: 'Nightly/weekly bookings, must have essential utilities' },
]
const propertyTypes = ['Apartment', 'Highrise', 'Townhouse', 'Duplex', 'Bungalow', 'Studio']
const carparks = ['0', '1', '2', '3', '4+']
const bedroomOptions = ['1 Bedroom', '2 Bedrooms', '3 Bedrooms', '4 Bedrooms', '5+ Bedrooms']
const bathroomOptions = ['1 Bathroom', '2 Bathrooms', '3 Bathrooms', '4 Bathrooms', '5+ Bathrooms']
const furnishingOptions = ['Furnished', 'Semi-furnished', 'Unfurnished']
const facilityOptions = ['Gym', 'Pool', '24/7 Power', 'Concierge', 'Smart Access', 'Workspace']
const utilityOptions = ['Yes', 'No', 'Included in Rent']
const electricityTypeOptions: Array<{ value: FormState['electricityType']; label: string }> = [
  { value: 'generator', label: 'Generator' },
  { value: 'solar', label: 'Solar' },
  { value: 'government', label: 'Government electricity' },
]
const tenancyDurations = ['3 months', '6 months', '9 months', '12 months', '24 months']
const preferredPaymentOptions: Array<{ value: FormState['preferredPayment']; label: string }> = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'six-monthly', label: 'Every 6 months' },
  { value: 'annually', label: 'Annually' },
]
const nearbyOptions = [
  'School (basic or higher)',
  'Church',
  'Mosque',
  'Open Market',
  'Supermarket',
  'Mall',
  'Cinema',
  'Hospital',
  'Pharmacy',
  'Restaurant',
  'Children Playground',
  'Public Transport / BRT',
  'Police Station',
  'Park / Garden',
]

const defaultState: FormState = {
  propertyUse: 'rental',
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
  nearby: [],
  utilities: {
    electricity: 'Yes',
    water: 'Yes',
    internet: 'Yes',
    security: 'Yes',
  },
  electricityType: 'government',
  allowShortlet: false,
  rentAmount: '',
  negotiable: false,
  tenancyDurations: [],
  preferredPayment: 'annually',
  description: '',
  images: [],
  agreementType: 'julaaz',
}

export function LandlordPropertyCreatePage() {
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const [step, setStep] = useState<StepKey>('address')
  const [form, setForm] = useState<FormState>(defaultState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [confirmAccurate, setConfirmAccurate] = useState(false)
  const [nearbyCustom, setNearbyCustom] = useState('')
  const stepContentRef = useRef<HTMLDivElement | null>(null)

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

  const toggleNearby = (place: string) => {
    setForm((prev) => ({
      ...prev,
      nearby: prev.nearby.includes(place)
        ? prev.nearby.filter((p) => p !== place)
        : [...prev.nearby, place],
    }))
  }

  const handleAddCustomNearby = () => {
    const trimmed = nearbyCustom.trim()
    if (!trimmed) return
    if (!form.nearby.includes(trimmed)) {
      setForm((prev) => ({ ...prev, nearby: [...prev.nearby, trimmed] }))
    }
    setNearbyCustom('')
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    const incomingFiles = Array.from(files)
    setForm((prev) => {
      const existing = prev.images ?? []
      const existingIds = new Set(existing.map((image) => image.id))
      const newImages = incomingFiles.reduce<Array<{ id: string; url: string; file: File }>>((acc, file) => {
        const id = `${file.name}-${file.size}-${file.lastModified}`
        if (existingIds.has(id)) {
          return acc
        }
        acc.push({
          id,
          url: URL.createObjectURL(file),
          file,
        })
        return acc
      }, [])
      return {
        ...prev,
        images: [...existing, ...newImages],
      }
    })

    event.target.value = ''
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

  const propertyUseLabel = useMemo(() => {
    return form.propertyUse.charAt(0).toUpperCase() + form.propertyUse.slice(1)
  }, [form.propertyUse])

  const formattedRentAmount = useMemo(() => {
    if (!form.rentAmount) return 'Not provided'
    const numeric = Number(form.rentAmount)
    if (Number.isNaN(numeric)) return form.rentAmount
    return `₦${numeric.toLocaleString('en-NG')}`
  }, [form.rentAmount])

  const carparkLabel = useMemo(() => {
    if (!form.carpark) return 'Parking not specified'
    if (form.carpark === '0') return 'No dedicated parking'
    if (form.carpark === '1') return '1 Carpark'
    return `${form.carpark} Carparks`
  }, [form.carpark])

  const preferredPaymentLabel = useMemo(() => {
    const match = preferredPaymentOptions.find((option) => option.value === form.preferredPayment)
    return match?.label ?? 'Not specified'
  }, [form.preferredPayment])

  useEffect(() => {
    setForm((prev) => {
      if (prev.propertyUse === 'shortlet' && !prev.allowShortlet) {
        return { ...prev, allowShortlet: true }
      }
      if (prev.propertyUse === 'hotel' && prev.allowShortlet) {
        return { ...prev, allowShortlet: false }
      }
      return prev
    })
  }, [form.propertyUse])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    const container = stepContentRef.current
    if (!container) return
    const firstInteractive = container.querySelector<HTMLElement>(
      'input:not([type="hidden"]), select, textarea, button'
    )
    if (firstInteractive) {
      requestAnimationFrame(() => {
        firstInteractive.focus({ preventScroll: true })
      })
    }
  }, [step])

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
              onClick={() => navigate("/landlord/properties")}
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
          <div
            ref={stepContentRef}
            className="rounded-3xl border border-border/60 bg-surface/95 backdrop-blur-xl shadow-lg p-6 space-y-6"
          >
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
                <div className="space-y-3">
                  <Label className="text-xs uppercase text-muted-foreground">Listing type</Label>
                  <p className="text-xs text-muted-foreground">Select what you are offering so we can tailor the form. Rentals can also opt into shortlet if utilities qualify.</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {propertyUseOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setField('propertyUse', option.value)}
                        className={cn(
                          'w-full rounded-2xl border px-4 py-3 text-left transition-all',
                          form.propertyUse === option.value
                            ? 'border-primary bg-primary/10 text-primary shadow-lg'
                            : 'border-border text-foreground hover:border-primary/40'
                        )}
                      >
                        <p className="text-sm font-semibold">{option.label}</p>
                        <p className="text-xs text-muted-foreground">{option.helper}</p>
                      </button>
                    ))}
                  </div>
                </div>

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

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-xs uppercase text-muted-foreground">What's nearby (within 2km)</Label>
                      <p className="text-xs text-muted-foreground">Tick what’s reachable within 2km. Add more landmarks relevant to Nigeria.</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[...nearbyOptions, ...form.nearby.filter(p => !nearbyOptions.includes(p))].map((place) => {
                      const active = form.nearby.includes(place)
                      return (
                        <button
                          key={place}
                          className={cn(
                            'px-4 py-2 rounded-2xl text-sm font-semibold border transition-all',
                            active
                              ? 'bg-primary text-primary-foreground border-primary shadow-lg'
                              : 'border-border text-muted-foreground hover:border-primary/40 hover:text-primary'
                          )}
                          onClick={() => toggleNearby(place)}
                          type="button"
                        >
                          {place}
                        </button>
                      )
                    })}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                      value={nearbyCustom}
                      onChange={(e) => setNearbyCustom(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleAddCustomNearby()
                        }
                      }}
                      placeholder="Add another nearby landmark"
                      className="flex-1 rounded-2xl bg-muted/40 border-border/60"
                    />
                    <Button type="button" className="rounded-2xl" onClick={handleAddCustomNearby}>
                      Add
                    </Button>
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

                        {key === 'electricity' && value !== 'No' && (
                          <div className="mt-3 space-y-1">
                            <Label className="text-xs uppercase text-muted-foreground">Electricity type</Label>
                            <Select
                              value={form.electricityType}
                              onValueChange={(val) => setField('electricityType', val as FormState['electricityType'])}
                            >
                              <SelectTrigger className="rounded-2xl bg-muted/40 border-border/60">
                                <SelectValue placeholder="Select electricity type" />
                              </SelectTrigger>
                              <SelectContent>
                                {electricityTypeOptions.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-2xl bg-primary/10 border border-primary/20 text-primary text-sm">
                    <Sparkles className="h-4 w-4" />
                    <p>
                      {form.propertyUse === 'shortlet'
                        ? 'Shortlet selected: ensure power, water, internet, and security are available.'
                        : hasEssentialAmenities
                          ? 'This rental qualifies for shortlet if you opt-in.'
                          : 'Enable essential utilities (power, water, internet, security) to qualify for shortlet bookings.'}
                    </p>
                  </div>
                  {form.propertyUse === 'rental' && (
                    <div className="flex items-start gap-3 p-3 rounded-2xl border border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors">
                      <Checkbox
                        id="allowShortlet"
                        checked={form.allowShortlet}
                        disabled={!hasEssentialAmenities}
                        onChange={(event) => setField('allowShortlet', typeof event.target.checked === 'boolean' ? event.target.checked : false)}
                        className="mt-0.5"
                      />
                      <Label htmlFor="allowShortlet" className="text-sm text-foreground cursor-pointer leading-relaxed flex-1">
                        Allow shortlet bookings while looking for a long-term tenant
                      </Label>
                    </div>
                  )}
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
                  <div className="flex items-center gap-3 p-3 rounded-2xl border border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors">
                    <Checkbox
                      id="negotiable"
                      checked={form.negotiable}
                      onChange={(event) => setField('negotiable', event.target.checked)}
                    />
                    <Label htmlFor="negotiable" className="text-sm text-foreground cursor-pointer flex-1">
                      Negotiable
                    </Label>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-xs uppercase text-muted-foreground">Preferred rental payment duration</Label>
                  <Select
                    value={form.preferredPayment}
                    onValueChange={(value) => setField('preferredPayment', value as FormState['preferredPayment'])}
                  >
                    <SelectTrigger className="rounded-2xl bg-muted/40 border-border/60">
                      <SelectValue placeholder="Select how you want to receive rent" />
                    </SelectTrigger>
                    <SelectContent>
                      {preferredPaymentOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

                <div className="space-y-4 pt-4 border-t border-border/60">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase text-muted-foreground">Tenancy Agreement</Label>
                    <p className="text-xs text-muted-foreground">
                      Choose whether to use Julaaz standard agreement or upload your own custom agreement from your lawyer.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setField('agreementType', 'julaaz')}
                      className={cn(
                        'w-full rounded-2xl border px-4 py-4 text-left transition-all',
                        form.agreementType === 'julaaz'
                          ? 'border-primary bg-primary/10 text-primary shadow-lg'
                          : 'border-border text-foreground hover:border-primary/40'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <ShieldCheck className="h-5 w-5 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-semibold">Use Julaaz Agreement</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Standard legal agreement template used by Julaaz
                          </p>
                        </div>
                        {form.agreementType === 'julaaz' && (
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setField('agreementType', 'custom')}
                      className={cn(
                        'w-full rounded-2xl border px-4 py-4 text-left transition-all',
                        form.agreementType === 'custom'
                          ? 'border-primary bg-primary/10 text-primary shadow-lg'
                          : 'border-border text-foreground hover:border-primary/40'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <FileText className="h-5 w-5 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-semibold">Upload Custom Agreement</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Upload your own agreement from your lawyer (requires admin approval)
                          </p>
                        </div>
                        {form.agreementType === 'custom' && (
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    </button>
                  </div>
                  {form.agreementType === 'custom' && (
                    <div className="space-y-2">
                      <Label className="text-xs uppercase text-muted-foreground">Upload Agreement PDF</Label>
                      <label className="flex flex-col items-center justify-center gap-3 h-32 rounded-2xl border-2 border-dashed border-border/60 bg-muted/40 text-sm text-muted-foreground hover:border-primary/40 cursor-pointer transition-colors">
                        <Upload className="h-5 w-5" />
                        <span>
                          {form.customAgreement 
                            ? form.customAgreement.name 
                            : 'Tap to upload agreement PDF'}
                        </span>
                        <input 
                          type="file" 
                          accept="application/pdf" 
                          className="hidden" 
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              if (file.size > 10 * 1024 * 1024) {
                                toast.error('File size must be less than 10MB')
                                return
                              }
                              setForm(prev => ({ ...prev, customAgreement: file }))
                              toast.success('Agreement uploaded. It will be reviewed by admin before approval.')
                            }
                          }} 
                        />
                      </label>
                      <p className="text-xs text-muted-foreground">
                        Your custom agreement will be reviewed by Julaaz admin team before it can be used.
                      </p>
                    </div>
                  )}
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
              <div className="space-y-6">
                <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-surface/95 to-background p-6 shadow-xl space-y-5">
                  <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                    <Sparkles className="h-4 w-4" />
                    <span>Listing Preview</span>
                  </div>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-2">
                      <h2 className="text-2xl font-semibold text-foreground">
                        {form.propertyName || 'Untitled Property'}
                      </h2>
                      <p className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>{form.address || 'Address will be added before publishing'}</span>
                        {form.postcode && (
                          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground/80">
                            • {form.postcode}
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] shadow">
                        <Home className="h-4 w-4" />
                        <span>{propertyUseLabel}</span>
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-4 py-1 text-xs font-semibold text-foreground">
                        {form.propertyType}
                      </span>
                      {form.propertyUse !== 'hotel' && (
                        <span
                          className={cn(
                            'inline-flex items-center gap-2 rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-[0.15em] border',
                            form.allowShortlet
                              ? 'border-emerald-200 bg-emerald-100 text-emerald-700'
                              : 'border-amber-200 bg-amber-100 text-amber-700'
                          )}
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          <span>{form.allowShortlet ? 'Shortlet Enabled' : 'Long-term Focus'}</span>
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {[
                      { label: 'Bedrooms', value: form.bedrooms || 'Not set' },
                      { label: 'Bathrooms', value: form.bathrooms || 'Not set' },
                      { label: 'Parking', value: carparkLabel },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="rounded-2xl border border-border/60 bg-background/80 px-4 py-3 shadow-sm"
                      >
                        <p className="text-sm font-semibold text-foreground">{item.value}</p>
                        <p className="text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">{item.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-border/60 bg-background/90 p-5 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      <Info className="h-4 w-4 text-primary" />
                      <span>Property Overview</span>
                    </div>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>
                        {form.buildUpSize
                          ? `${form.buildUpSize} sqft of living space`
                          : 'Build-up size not provided yet'}
                      </p>
                      <p>{form.floorLevel ? `Located on ${form.floorLevel}` : 'Floor level not specified'}</p>
                      <p>
                        Nearby highlights:
                        {form.nearby.length ? '' : ' None added'}
                      </p>
                    </div>
                    {form.nearby.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {form.nearby.map((place) => (
                          <span
                            key={place}
                            className="inline-flex items-center rounded-full border border-border/60 bg-muted/30 px-3 py-1 text-xs font-medium text-foreground"
                          >
                            {place}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="rounded-2xl border border-border/60 bg-background/90 p-5 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      <ShieldCheck className="h-4 w-4 text-primary" />
                      <span>Utilities & Comfort</span>
                    </div>
                    <div className="grid gap-2 text-sm">
                      {Object.entries(form.utilities).map(([key, value]) => (
                        <div
                          key={key}
                          className="flex items-center justify-between rounded-2xl border border-border/40 bg-muted/20 px-3 py-2"
                        >
                          <span className="uppercase tracking-[0.15em] text-xs text-muted-foreground">{key}</span>
                          <span className="font-medium text-foreground">{value}</span>
                        </div>
                      ))}
                    </div>
                    {form.utilities.electricity !== 'No' && form.electricityType && (
                      <p className="text-xs text-muted-foreground">
                        Electricity source: {electricityTypeOptions.find((option) => option.value === form.electricityType)?.label}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {form.facilities.length ? (
                        form.facilities.map((facility) => (
                          <span
                            key={facility}
                            className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                          >
                            {facility}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          Add headline facilities to boost tenant interest.
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border/60 bg-background/90 p-5 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      <Coins className="h-4 w-4 text-primary" />
                      <span>Pricing & Payments</span>
                    </div>
                    <div className="grid gap-3">
                      <div className="rounded-2xl border border-primary/30 bg-primary/10 px-4 py-3">
                        <p className="text-2xl font-semibold text-primary">{formattedRentAmount}</p>
                        <p className="text-xs uppercase tracking-[0.2em] text-primary/80">Annual Rent</p>
                      </div>
                      <div className="rounded-2xl border border-border/40 bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <CalendarRange className="h-4 w-4 text-primary" />
                          <span className="font-medium text-foreground">Preferred Tenancy</span>
                        </div>
                        <p className="mt-2">
                          {form.tenancyDurations.length ? form.tenancyDurations.join(', ') : 'Not specified yet'}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                        <span className="inline-flex items-center rounded-full border border-border/40 bg-background/80 px-3 py-1">
                          Payment cadence: {preferredPaymentLabel}
                        </span>
                        <span className="inline-flex items-center rounded-full border border-border/40 bg-background/80 px-3 py-1">
                          {form.negotiable ? 'Open to negotiation' : 'Fixed rate'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border/60 bg-background/90 p-5 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      <ImageIcon className="h-4 w-4 text-primary" />
                      <span>Media & Availability</span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-2 rounded-2xl border border-border/40 bg-muted/20 px-3 py-2">
                        <ImageIcon className="h-4 w-4 text-primary" />
                        <span>{form.images.length} photo(s) uploaded</span>
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-2xl border border-border/40 bg-muted/20 px-3 py-2">
                        <Video className="h-4 w-4 text-primary" />
                        <span>{form.video ? 'Video tour attached' : 'No video yet'}</span>
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Arrange images in your preferred order. Videos appear last in the gallery carousel.
                    </p>
                  </div>
                </div>

                <div className="rounded-3xl border border-border/60 bg-background/90 p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs uppercase text-muted-foreground">Listing Description</Label>
                    <span className="text-xs text-muted-foreground/80">Tell your property's story</span>
                  </div>
                  <Textarea
                    placeholder="Write a detailed description highlighting amenities, neighbourhood, policies…"
                    value={form.description}
                    onChange={(e) => setField('description', e.target.value)}
                    className="min-h-[160px] resize-none rounded-2xl border border-border/40 bg-muted/20"
                  />
                </div>

                <div className="flex items-start gap-3 rounded-3xl border-2 border-primary/30 bg-primary/5 p-4 shadow-sm transition-all hover:border-primary/50 hover:bg-primary/10">
                  <Checkbox
                    id="confirm-accurate"
                    checked={confirmAccurate}
                    onChange={(e) => {
                      const newValue = typeof e.target.checked === 'boolean' ? e.target.checked : false
                      setConfirmAccurate(newValue)
                    }}
                    className="mt-0.5 flex-shrink-0"
                  />
                  <Label htmlFor="confirm-accurate" className="text-sm text-foreground cursor-pointer flex-1 leading-relaxed">
                    I certify that all information provided in this listing is accurate, complete, and compliant with Julaaz's listing guidelines.
                  </Label>
                </div>

                <div className="rounded-3xl border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-5 text-sm text-primary shadow-inner">
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
                className="h-12 rounded-2xl px-6 bg-primary text-primary-foreground shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={handleSubmit}
                disabled={isSubmitting || !confirmAccurate}
              >
                {isSubmitting ? 'Submitting...' : 'Publish'}
              </Button>
            )}
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

