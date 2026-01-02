import { FormEvent, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Send, ArrowLeft, ChevronLeft, ChevronRight, Plus, X } from 'lucide-react'
import { Header } from '@/widgets/header'
import { Footer } from '@/widgets/footer'
import { Sidebar } from '@/widgets/sidebar'
import { AuthDialog } from '@/widgets/auth-dialog'
import { useAuthStore } from '@/shared/store/auth.store'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/ui/select'
import { samplePropertyDetails } from '@/__mocks__/data/property-details.mock'
import {
  addDays,
  addMonths,
  differenceInHours,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isSameDay,
  isSameMonth,
  startOfDay,
  startOfMonth,
  startOfWeek
} from 'date-fns'
import { ROUTES } from '@/shared/constants/routes'
import { Badge } from '@/shared/ui/badge'
import { cn } from '@/shared/lib/utils/cn'
import toast from 'react-hot-toast'
import { useMessagingStore } from '@/shared/store/messaging.store'
import type { RentTerm } from '@/entities/property/model/types'

const TIME_OPTIONS = [
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '01:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '05:00 PM',
  '06:00 PM'
]

const TENANCY_DURATION_OPTIONS = ['6 months', '12 months', '18 months', '24 months', 'Flexible']
const RENT_TERM_LABELS: Record<RentTerm, string> = {
  monthly: 'Monthly',
  quarterly: 'Quarterly',
  six_months: '6 months',
  annually: 'Annually'
}

const MAX_PREFERRED_SLOTS = 3
const MIN_LEAD_HOURS = 24

interface PreferredSlot {
  id: string
  dateTime: Date
  timeLabel: string
  displayLabel: string
}

const generateId = (prefix: string) => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `${prefix}_${crypto.randomUUID()}`
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`
}

export function PropertyViewingPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuthStore()
  const createViewingConversation = useMessagingStore((state) => state.createViewingConversation)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const initialDate = startOfDay(addDays(new Date(), 1))
  const [currentMonth, setCurrentMonth] = useState<Date>(startOfMonth(initialDate))
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate)
  const [selectedTime, setSelectedTime] = useState<string>(TIME_OPTIONS[0])
  const [preferredSlots, setPreferredSlots] = useState<PreferredSlot[]>([])
  const [slotError, setSlotError] = useState<string | null>(null)
  const [note, setNote] = useState<string>('')
  const [moveInDate, setMoveInDate] = useState<string>('')
  const [tenancyDuration, setTenancyDuration] = useState<string>(TENANCY_DURATION_OPTIONS[1])
  const [minimumBudget, setMinimumBudget] = useState<string>('')

  const property = id ? samplePropertyDetails[id] : undefined
  const allowedRentTerms: RentTerm[] = (property?.allowedRentTerms ?? ['annually']) as RentTerm[]

  const [rentalPreference, setRentalPreference] = useState<'long_term' | 'shortlet'>(() => {
    if (property?.rentalCategories.includes('long_term')) {
      return 'long_term'
    }
    if (property?.rentalCategories.includes('shortlet')) {
      return 'shortlet'
    }
    return 'long_term'
  })
  const [rentTerm, setRentTerm] = useState<RentTerm>(allowedRentTerms[0] ?? 'annually')
  const [shortletStayNights, setShortletStayNights] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const earliestSelectableDay = startOfDay(addDays(new Date(), 1))

  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 0 })
    const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 0 })
    return eachDayOfInterval({ start, end })
  }, [currentMonth])

  const isDisabledDay = (day: Date) => isAfter(earliestSelectableDay, day)

  const handleMenuClick = () => setIsSidebarOpen(true)

  const handleProfileClick = () => {
    if (isAuthenticated) {
      navigate(ROUTES.PROFILE)
    } else {
      setIsDrawerOpen(true)
    }
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header className="hidden lg:block" onMenuClick={handleMenuClick} onProfileClick={handleProfileClick} />
        <main className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-4">
          <h1 className="text-2xl font-bold text-foreground">Property not found</h1>
          <p className="text-muted-foreground max-w-md">
            We couldn&apos;t locate this property. It may have been removed or the link is incorrect.
          </p>
          <Button onClick={() => navigate(ROUTES.PROPERTIES)} className="rounded-xl">
            Browse Properties
          </Button>
        </main>
        <Footer />
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <AuthDialog open={isDrawerOpen} onOpenChange={setIsDrawerOpen} />
      </div>
    )
  }

  const hasLongTermOption = property.rentalCategories.includes('long_term')
  const hasShortletOption = property.rentalCategories.includes('shortlet')
  const isShortletPreference = rentalPreference === 'shortlet'
  const shortletOffering = property.shortletOffering

  const handleMonthNavigation = (direction: 'prev' | 'next') => {
    setCurrentMonth((prev) => addMonths(prev, direction === 'prev' ? -1 : 1))
  }

  const handleDateSelect = (day: Date) => {
    if (isDisabledDay(day)) return
    setSelectedDate(day)
    setSlotError(null)
  }

  const createSlotDateTime = (day: Date, timeLabel: string) => {
    const [time, period] = timeLabel.split(' ')
    const [hourStr, minuteStr] = time.split(':')
    let hour = Number(hourStr)
    const minute = Number(minuteStr)
    if (period === 'PM' && hour !== 12) {
      hour += 12
    }
    if (period === 'AM' && hour === 12) {
      hour = 0
    }
    return new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour, minute, 0, 0)
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    setSlotError(null)
  }

  const handleRemoveSlot = (slotId: string) => {
    setPreferredSlots((prev) => prev.filter((slot) => slot.id !== slotId))
  }

  const handleAddPreferredSlot = () => {
    const slotDateTime = createSlotDateTime(selectedDate, selectedTime)

    if (preferredSlots.length >= MAX_PREFERRED_SLOTS) {
      setSlotError(`You can select up to ${MAX_PREFERRED_SLOTS} viewing slots.`)
      return
    }

    if (differenceInHours(slotDateTime, new Date()) < MIN_LEAD_HOURS) {
      setSlotError('Please choose a slot that is at least 24 hours from now.')
      return
    }

    if (slotDateTime.getHours() < 9 || slotDateTime.getHours() > 18) {
      setSlotError('Viewing times are available between 9:00 AM and 6:00 PM.')
      return
    }

    const exists = preferredSlots.some((slot) => slot.dateTime.getTime() === slotDateTime.getTime())
    if (exists) {
      setSlotError('You already added this slot. Please choose a different time.')
      return
    }

    const newSlot: PreferredSlot = {
      id: generateId('slot'),
      dateTime: slotDateTime,
      timeLabel: selectedTime,
      displayLabel: format(slotDateTime, 'EEE, MMM d • h:mm a')
    }

    setPreferredSlots((prev) => [...prev, newSlot].sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime()))
    setSlotError(null)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!isAuthenticated) {
      setIsDrawerOpen(true)
      toast.error('Sign in to request a viewing')
      return
    }

    if (preferredSlots.length === 0) {
      setSlotError('Please add at least one preferred viewing slot before continuing.')
      toast.error('Add at least one preferred slot to continue')
      return
    }

    if (!moveInDate) {
      toast.error(isShortletPreference ? 'Select your preferred check-in date' : 'Select your preferred move-in date')
      return
    }

    if (isShortletPreference) {
      const stayLength = Number(shortletStayNights)
      if (!shortletStayNights || Number.isNaN(stayLength) || stayLength <= 0) {
        toast.error('Tell us how many nights you would like to stay')
        return
      }
    } else {
      if (!tenancyDuration) {
        toast.error('Select how long you plan to stay')
        return
      }
      if (!rentTerm) {
        toast.error('Select a rent payment term')
        return
      }
    }

    const parsedBudget = Number(minimumBudget.replace(/,/g, ''))
    if (!minimumBudget || Number.isNaN(parsedBudget) || parsedBudget <= 0) {
      toast.error(
        isShortletPreference
          ? 'Enter the nightly budget you are comfortable paying'
          : 'Enter the minimum monthly budget you are comfortable paying'
      )
      return
    }

    const stayLengthNights = isShortletPreference ? Number(shortletStayNights) : undefined
    const tenancySummary = isShortletPreference
      ? stayLengthNights
        ? `${stayLengthNights} night stay`
        : 'Shortlet stay'
      : `${tenancyDuration} • ${RENT_TERM_LABELS[rentTerm] ?? rentTerm}`

    setIsSubmitting(true)
    try {
      const { conversationId } = createViewingConversation({
        propertyId: property.id,
        propertyName: property.name,
        propertyImage: property.image,
        ownerName: property.owner.name,
        ownerPhone: property.owner.phone,
        slots: preferredSlots.map((slot) => ({ date: slot.dateTime, label: slot.displayLabel })),
        tenant: {
          id: user?.id ?? 'guest',
          name: user?.name,
          phone: user?.phone,
          email: user?.email,
        },
        moveInDate,
        tenancyDuration: tenancySummary,
        minimumBudget: parsedBudget,
        rentTerm,
        rentalPreference,
        shortletStayLengthNights: stayLengthNights,
        note: note.trim() ? note.trim() : undefined,
      })

      toast.success('Viewing request sent! We created a group chat to coordinate details.')
      navigate(ROUTES.MESSAGING_CHAT(conversationId))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header className="hidden lg:block" onMenuClick={handleMenuClick} onProfileClick={handleProfileClick} />

      <main className="flex-1">
        <div className="container mx-auto px-4 lg:px-6 xl:px-8 py-6 lg:py-10 max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden bg-icon-bg text-foreground hover:bg-primary/10 hover:text-primary rounded-full"
              onClick={() => navigate(-1)}
              aria-label="Back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <p className="text-xs uppercase tracking-wide text-primary">Viewing Request</p>
              <h1 className="text-2xl font-bold text-foreground">Schedule a viewing</h1>
            </div>
          </div>

          <Card className="p-4 md:p-6 rounded-2xl border border-border bg-surface mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="sm:w-40 rounded-xl overflow-hidden bg-muted">
                <img src={property.image} alt={property.name} className="h-full w-full object-cover" loading="lazy" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-semibold text-foreground">{property.name}</h2>
                  <Badge className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs">
                    {property.neighbourhood}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {property.address}, {property.city}
                </p>
                <p className="text-base font-semibold text-primary">
                  ₦{new Intl.NumberFormat('en-NG').format(property.price)}
                </p>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span>{property.bedrooms} Beds</span>
                  <span>|</span>
                  <span>{property.bathrooms} Baths</span>
                  <span>|</span>
                  <span>{property.area} sqft</span>
                </div>
              </div>
            </div>
          </Card>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card className="p-5 rounded-2xl border border-border bg-surface space-y-6">
              {hasLongTermOption && hasShortletOption && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <p className="text-sm font-semibold text-foreground">Select your rental preference</p>
                  <div className="inline-flex rounded-full border border-border bg-background p-1">
                    <button
                      type="button"
                      onClick={() => setRentalPreference('long_term')}
                      className={cn(
                        'px-3 py-1.5 text-xs font-medium rounded-full transition-colors',
                        rentalPreference === 'long_term'
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-primary'
                      )}
                    >
                      Rent
                    </button>
                    <button
                      type="button"
                      onClick={() => setRentalPreference('shortlet')}
                      className={cn(
                        'px-3 py-1.5 text-xs font-medium rounded-full transition-colors',
                        rentalPreference === 'shortlet'
                          ? 'bg-emerald-500 text-emerald-50 shadow-sm'
                          : 'text-muted-foreground hover:text-emerald-600'
                      )}
                    >
                      Serviced shortlet
                    </button>
                  </div>
                </div>
              )}
              <div className="flex flex-col gap-1">
                <h2 className="text-lg font-semibold text-foreground">
                  {isShortletPreference ? 'Stay preferences' : 'Move-in preferences'}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {isShortletPreference
                    ? 'Share your ideal short-stay schedule so we can confirm availability quickly.'
                    : 'Share your expected move-in timeline so the landlord can prepare the apartment for you.'}
                </p>
              </div>
              <div className={cn('grid gap-4', isShortletPreference ? 'sm:grid-cols-2' : 'sm:grid-cols-3')}>
                <div className="space-y-1.5">
                  <Label htmlFor="move-in-date" className="text-sm text-foreground">
                    {isShortletPreference ? 'Preferred check-in date' : 'Preferred move-in date'}
                  </Label>
                  <Input
                    id="move-in-date"
                    type="date"
                    min={startOfDay(new Date()).toISOString().split('T')[0]}
                    value={moveInDate}
                    onChange={(event) => setMoveInDate(event.target.value)}
                    className="h-11 rounded-xl"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  {isShortletPreference ? (
                    <>
                      <Label htmlFor="stay-length" className="text-sm text-foreground">
                        Planned stay length (nights)
                      </Label>
                      <Input
                        id="stay-length"
                        type="number"
                        min={shortletOffering?.minimumStayNights ?? 1}
                        max={shortletOffering?.maximumStayNights}
                        value={shortletStayNights}
                        onChange={(event) => setShortletStayNights(event.target.value)}
                        placeholder={`${shortletOffering?.minimumStayNights ?? 2}`}
                        className="h-11 rounded-xl"
                      />
                      <p className="text-xs text-muted-foreground">
                        {shortletOffering?.minimumStayNights
                          ? `Minimum stay is ${shortletOffering.minimumStayNights} night${shortletOffering.minimumStayNights > 1 ? 's' : ''}.`
                          : 'Let us know how many nights you plan to stay.'}
                      </p>
                    </>
                  ) : (
                    <>
                      <Label htmlFor="tenancy-duration" className="text-sm text-foreground">
                        Tenancy duration
                      </Label>
                      <Select value={tenancyDuration} onValueChange={setTenancyDuration}>
                        <SelectTrigger id="tenancy-duration" className="h-11 rounded-xl">
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          {TENANCY_DURATION_OPTIONS.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </>
                  )}
                </div>

                {!isShortletPreference && (
                  <div className="space-y-1.5">
                    <Label htmlFor="rent-term" className="text-sm text-foreground">
                      Rent term
                    </Label>
                    <Select value={rentTerm} onValueChange={(value) => setRentTerm(value as RentTerm)}>
                      <SelectTrigger id="rent-term" className="h-11 rounded-xl">
                        <SelectValue placeholder="Select rent term" />
                      </SelectTrigger>
                      <SelectContent>
                        {allowedRentTerms.map((term) => (
                          <SelectItem key={term} value={term} className="capitalize">
                            {RENT_TERM_LABELS[term] ?? term.replace('_', ' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="minimum-budget" className="text-sm text-foreground">
                  {isShortletPreference ? 'Budget per night (₦)' : 'Minimum monthly budget (₦)'}
                </Label>
                <Input
                  id="minimum-budget"
                  type="number"
                  min={isShortletPreference ? 10000 : 50000}
                  step={isShortletPreference ? 5000 : 50000}
                  value={minimumBudget}
                  onChange={(event) => setMinimumBudget(event.target.value)}
                  placeholder={
                    isShortletPreference
                      ? `${shortletOffering?.nightlyRate ?? 85000}`
                      : `${property.longTermOffering?.monthlyRent ?? 450000}`
                  }
                  className="h-11 rounded-xl"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Budget reflects what you are comfortable paying {isShortletPreference ? 'per night' : 'each month'}, subject to landlord approval.
                </p>
              </div>
            </Card>

            <Card className="p-5 rounded-2xl border border-border bg-surface space-y-6">
              <div className="flex flex-col gap-1">
                <h2 className="text-lg font-semibold text-foreground">Select preferred viewing slots</h2>
                <p className="text-sm text-muted-foreground">
                  Choose up to three viewing times. We recommend picking alternatives so the landlord can confirm the most convenient option.
                </p>
              </div>

              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
                <div className="rounded-3xl border border-border/60 bg-background/80 p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <button
                      type="button"
                      className="h-9 w-9 rounded-full border border-border text-foreground hover:border-primary/60 hover:text-primary transition-colors"
                      onClick={() => handleMonthNavigation('prev')}
                    >
                      <ChevronLeft className="h-4 w-4 mx-auto" />
                    </button>
                    <div className="text-sm font-semibold text-foreground">
                      {format(currentMonth, 'MMMM yyyy')}
                    </div>
                    <button
                      type="button"
                      className="h-9 w-9 rounded-full border border-border text-foreground hover:border-primary/60 hover:text-primary transition-colors"
                      onClick={() => handleMonthNavigation('next')}
                    >
                      <ChevronRight className="h-4 w-4 mx-auto" />
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground uppercase">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <span key={day}>{day}</span>
                    ))}
                  </div>

                  <div className="mt-2 grid grid-cols-7 gap-1.5">
                    {calendarDays.map((day) => {
                      const outsideMonth = !isSameMonth(day, currentMonth)
                      const disabled = isDisabledDay(day)
                      const isSelected = isSameDay(day, selectedDate)
                      return (
                        <button
                          type="button"
                          key={day.toISOString()}
                          onClick={() => handleDateSelect(day)}
                          disabled={disabled}
                          className={cn(
                            'flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-colors',
                            outsideMonth && 'text-muted-foreground/40',
                            disabled && 'opacity-40 cursor-not-allowed',
                            isSelected ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-primary/10 hover:text-primary'
                          )}
                        >
                          {format(day, 'd')}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-3xl border border-border/60 bg-background/80 p-4 shadow-sm flex flex-col gap-4">
                    <div>
                      <p className="text-sm font-semibold text-foreground">Selected date</p>
                      <p className="text-sm text-muted-foreground">{format(selectedDate, 'EEEE, MMMM d')}</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-foreground">Select time</span>
                        <span className="text-xs text-muted-foreground">9:00 AM – 6:00 PM</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {TIME_OPTIONS.map((slot) => {
                          const active = selectedTime === slot
                          return (
                            <button
                              type="button"
                              key={slot}
                              onClick={() => handleTimeSelect(slot)}
                              className={cn(
                                'rounded-xl border px-3 py-2 text-sm font-medium transition-colors',
                                active
                                  ? 'border-primary bg-primary/10 text-primary shadow-sm'
                                  : 'border-border bg-background text-foreground hover:border-primary/40'
                              )}
                            >
                              {slot}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-muted-foreground">
                      Earliest viewing is 24 hours from now. Add up to three alternatives so everyone can coordinate quickly.
                    </p>
                    <Button
                      type="button"
                      onClick={handleAddPreferredSlot}
                      className="rounded-xl px-4"
                      disabled={preferredSlots.length >= MAX_PREFERRED_SLOTS}
                    >
                      <span className="inline-flex items-center gap-2 text-sm font-medium">
                        <Plus className="h-4 w-4" />
                        Add preferred slot
                      </span>
                    </Button>
                  </div>

                  {slotError && <p className="text-xs text-destructive">{slotError}</p>}

                  {preferredSlots.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-foreground">Preferred slots</p>
                      <div className="space-y-2">
                        {preferredSlots.map((slot) => (
                          <div
                            key={slot.id}
                            className="flex items-center justify-between rounded-2xl border border-border bg-background px-4 py-3 text-sm"
                          >
                            <div>
                              <p className="font-medium text-foreground">{slot.displayLabel}</p>
                              <p className="text-xs text-muted-foreground">Shared with the owner and Julaaz support.</p>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={() => handleRemoveSlot(slot.id)}
                              aria-label="Remove slot"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            <Card className="p-5 rounded-2xl border border-border bg-surface space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-1">Additional details</h2>
                <p className="text-sm text-muted-foreground">Let us know any specific preferences or questions.</p>
              </div>
              <div className="space-y-2">
                <label htmlFor="note" className="block text-sm font-medium text-foreground">
                  Message (optional)
                </label>
                <textarea
                  id="note"
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  rows={4}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="e.g., I’d love to confirm parking availability before the viewing."
                />
              </div>
            </Card>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-xs text-muted-foreground">
                We&apos;ll notify the property manager and confirm the viewing within 24 hours.
              </p>
              <Button
                type="submit"
                className="rounded-xl px-6"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : (
                  <span className="inline-flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    Submit Request
                  </span>
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <AuthDialog open={isDrawerOpen} onOpenChange={setIsDrawerOpen} />
    </div>
  )
}

