import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  X,
  CheckCircle2,
  Building2,
  ShieldCheck,
  Video,
  Image as ImageIcon,
  Plus,
  Trash2,
} from 'lucide-react'
import { Header } from '@/widgets/header'
import { Sidebar } from '@/widgets/sidebar'
import { Footer } from '@/widgets/footer'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Textarea } from '@/shared/ui/textarea'
import { Checkbox } from '@/shared/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'
import { ROUTES } from '@/shared/constants/routes'
import { cn } from '@/shared/lib/utils/cn'
import toast from 'react-hot-toast'
import type { HotelRoom } from '@/shared/types/hotel.types'

type StepKey = 'basic' | 'facilities' | 'rooms' | 'media' | 'summary'

interface HotelFormState {
  name: string
  address: string
  city: string
  state: string
  country: string
  description: string
  facilities: string[]
  isHalal: boolean
  halalFeatures: string[]
  images: Array<{ id: string; url: string; file?: File }>
  videos: Array<{ id: string; url: string; file?: File }>
  rooms: Array<{
    id: string
    type: HotelRoom['type']
    name: string
    description: string
    maxOccupancy: number
    bedType: string
    size: string
    pricePerNight: number
    totalRooms: number
    amenities: string[]
    availableServices: string[]
    images: Array<{ id: string; url: string; file?: File }>
  }>
}

const stepOrder: StepKey[] = ['basic', 'facilities', 'rooms', 'media', 'summary']

const stepMeta: Record<StepKey, { title: string; subtitle: string }> = {
  basic: {
    title: 'Basic Information',
    subtitle: 'Hotel name, address, and description',
  },
  facilities: {
    title: 'Facilities & Features',
    subtitle: 'Available facilities and halal certification',
  },
  rooms: {
    title: 'Room Types',
    subtitle: 'Add room types with pricing and amenities',
  },
  media: {
    title: 'Hotel Media',
    subtitle: 'Upload photos and videos of your hotel',
  },
  summary: {
    title: 'Review & Submit',
    subtitle: 'Review all details before submitting',
  },
}

const facilityOptions = [
  'WiFi',
  'Swimming Pool',
  'Gym',
  'Restaurant',
  'Spa',
  'Parking',
  'Room Service',
  'Concierge',
  'Business Center',
  'Conference Rooms',
  'Laundry',
  'Bar',
  'Beach Access',
]

const halalFeatureOptions = [
  'No pork served',
  'Muslim-friendly toilets',
  'Prayer room available',
  'No nightclubs nearby',
  'Halal-certified kitchen',
  'Qibla direction indicated',
]

const roomTypeOptions: Array<{ value: HotelRoom['type']; label: string }> = [
  { value: 'standard', label: 'Standard' },
  { value: 'deluxe', label: 'Deluxe' },
  { value: 'suite', label: 'Suite' },
  { value: 'executive', label: 'Executive' },
  { value: 'presidential', label: 'Presidential' },
  { value: 'family', label: 'Family' },
  { value: 'studio', label: 'Studio' },
]

const roomAmenityOptions = ['WiFi', 'TV', 'AC', 'Mini Bar', 'Safe', 'Balcony', 'Work Desk', 'Kitchenette', 'Jacuzzi', 'Living Room']
const serviceOptions = ['Room Service', 'Laundry', 'Wake-up Call', 'Concierge', 'Butler Service', 'Business Center Access', 'Meeting Room Booking', 'Beach Access', 'Towel Service']

export function HotelManagerHotelCreatePage() {
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState<StepKey>('basic')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [confirmAccuracy, setConfirmAccuracy] = useState(false)

  const [form, setForm] = useState<HotelFormState>({
    name: '',
    address: '',
    city: '',
    state: '',
    country: 'Nigeria',
    description: '',
    facilities: [],
    isHalal: false,
    halalFeatures: [],
    images: [],
    videos: [],
    rooms: [],
  })

  const currentStepIndex = stepOrder.indexOf(currentStep)
  const canGoNext = currentStepIndex < stepOrder.length - 1
  const canGoPrev = currentStepIndex > 0

  const handleNext = () => {
    if (canGoNext) {
      setCurrentStep(stepOrder[currentStepIndex + 1])
    }
  }

  const handlePrev = () => {
    if (canGoPrev) {
      setCurrentStep(stepOrder[currentStepIndex - 1])
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'hotel' | 'room', roomId?: string) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    files.forEach((file) => {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 10MB limit`)
        return
      }

      const id = `img-${Date.now()}-${Math.random()}`
      const url = URL.createObjectURL(file)

      if (type === 'hotel') {
        setForm((prev) => ({
          ...prev,
          images: [...prev.images, { id, url, file }],
        }))
      } else if (roomId) {
        setForm((prev) => ({
          ...prev,
          rooms: prev.rooms.map((room) =>
            room.id === roomId
              ? { ...room, images: [...room.images, { id, url, file }] }
              : room
          ),
        }))
      }
    })

    e.target.value = ''
  }

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 50 * 1024 * 1024) {
      toast.error('Video exceeds 50MB limit')
      return
    }

    const id = `vid-${Date.now()}-${Math.random()}`
    const url = URL.createObjectURL(file)

    setForm((prev) => ({
      ...prev,
      videos: [...prev.videos, { id, url, file }],
    }))

    e.target.value = ''
  }

  const handleRemoveImage = (imageId: string, type: 'hotel' | 'room', roomId?: string) => {
    if (type === 'hotel') {
      setForm((prev) => ({
        ...prev,
        images: prev.images.filter((img) => img.id !== imageId),
      }))
    } else if (roomId) {
      setForm((prev) => ({
        ...prev,
        rooms: prev.rooms.map((room) =>
          room.id === roomId
            ? { ...room, images: room.images.filter((img) => img.id !== imageId) }
            : room
        ),
      }))
    }
  }

  const handleRemoveVideo = (videoId: string) => {
    setForm((prev) => ({
      ...prev,
      videos: prev.videos.filter((vid) => vid.id !== videoId),
    }))
  }

  const handleAddRoom = () => {
    const newRoom = {
      id: `room-${Date.now()}`,
      type: 'standard' as HotelRoom['type'],
      name: '',
      description: '',
      maxOccupancy: 2,
      bedType: '',
      size: '',
      pricePerNight: 0,
      totalRooms: 1,
      amenities: [],
      availableServices: [],
      images: [],
    }
    setForm((prev) => ({
      ...prev,
      rooms: [...prev.rooms, newRoom],
    }))
  }

  const handleRemoveRoom = (roomId: string) => {
    setForm((prev) => ({
      ...prev,
      rooms: prev.rooms.filter((room) => room.id !== roomId),
    }))
  }

  const handleRoomChange = (roomId: string, field: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      rooms: prev.rooms.map((room) =>
        room.id === roomId ? { ...room, [field]: value } : room
      ),
    }))
  }

  const validateForm = () => {
    const errors: string[] = []

    // Basic Information Validation
    if (!form.name || form.name.trim().length < 3) {
      errors.push('Hotel name is required and must be at least 3 characters')
    }
    if (!form.address || form.address.trim().length < 5) {
      errors.push('Address is required and must be at least 5 characters')
    }
    if (!form.city || form.city.trim().length < 2) {
      errors.push('City is required and must be at least 2 characters')
    }
    if (!form.state || form.state.trim().length < 2) {
      errors.push('State is required and must be at least 2 characters')
    }
    if (!form.country || form.country.trim().length < 2) {
      errors.push('Country is required and must be at least 2 characters')
    }
    if (!form.description || form.description.trim().length < 20) {
      errors.push('Description is required and must be at least 20 characters')
    }

    // Facilities Validation
    if (form.facilities.length === 0) {
      errors.push('Please select at least one facility')
    }

    // Halal Validation
    if (form.isHalal && form.halalFeatures.length === 0) {
      errors.push('Please select at least one halal feature if hotel is marked as Muslim-friendly')
    }

    // Media Validation
    if (form.images.length < 4) {
      errors.push('Please upload at least 4 hotel images (minimum requirement)')
    }

    // Rooms Validation
    if (form.rooms.length === 0) {
      errors.push('Please add at least one room type')
    } else {
      form.rooms.forEach((room, index) => {
        if (!room.name || room.name.trim().length < 2) {
          errors.push(`Room ${index + 1}: Name is required and must be at least 2 characters`)
        }
        if (!room.description || room.description.trim().length < 10) {
          errors.push(`Room ${index + 1}: Description is required and must be at least 10 characters`)
        }
        if (!room.type) {
          errors.push(`Room ${index + 1}: Room type is required`)
        }
        if (!room.pricePerNight || room.pricePerNight <= 0) {
          errors.push(`Room ${index + 1}: Valid price per night is required`)
        }
        if (!room.maxOccupancy || room.maxOccupancy < 1) {
          errors.push(`Room ${index + 1}: Maximum occupancy must be at least 1`)
        }
        if (!room.bedType || room.bedType.trim().length < 2) {
          errors.push(`Room ${index + 1}: Bed type is required`)
        }
        if (!room.size || room.size.trim().length < 2) {
          errors.push(`Room ${index + 1}: Room size is required`)
        }
        if (!room.totalRooms || room.totalRooms < 1) {
          errors.push(`Room ${index + 1}: Total rooms must be at least 1`)
        }
        if (room.amenities.length === 0) {
          errors.push(`Room ${index + 1}: Please select at least one amenity`)
        }
      })
    }

    return errors
  }

  const validateForSubmission = () => {
    const errors = validateForm()
    // Add confirmation check only when submitting
    if (!confirmAccuracy) {
      errors.push('Please confirm that all information provided is accurate and authentic')
    }
    return errors
  }

  const handleSubmit = async () => {
    const validationErrors = validateForSubmission()
    
    if (validationErrors.length > 0) {
      toast.error(`Please fix the following issues:\n${validationErrors.slice(0, 3).join('\n')}${validationErrors.length > 3 ? `\n...and ${validationErrors.length - 3} more` : ''}`)
      return
    }

    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      toast.success('Hotel submitted for review!')
      navigate(ROUTES.HOTEL_MANAGER_HOTELS)
    } catch {
      toast.error('Failed to submit hotel')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleProfileClick = () => {
    navigate(ROUTES.PROFILE)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header onMenuClick={() => setIsSidebarOpen(true)} onProfileClick={handleProfileClick} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1">
        {/* Header */}
        <section className="border-b border-border/60 bg-gradient-to-br from-primary/5 via-background to-background">
          <div className="container mx-auto max-w-4xl px-4 lg:px-6 xl:px-8 py-8">
            <Button
              variant="ghost"
              className="mb-4 -ml-2"
              onClick={() => navigate(ROUTES.HOTEL_MANAGER_HOTELS)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Hotels
            </Button>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Add New Hotel</h1>
            <p className="text-sm text-muted-foreground mt-1">Create a new hotel listing</p>
          </div>
        </section>

        {/* Progress Steps */}
        <section className="border-b border-border/60 bg-muted/30">
          <div className="container mx-auto max-w-4xl px-4 lg:px-6 xl:px-8 py-6">
            <div className="flex items-center justify-between w-full">
              {stepOrder.map((step, index) => {
                const isActive = step === currentStep
                const isCompleted = stepOrder.indexOf(step) < currentStepIndex
                return (
                  <div key={step} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1 relative z-10">
                      <div
                        className={cn(
                          'h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all bg-background',
                          isActive
                            ? 'bg-primary text-primary-foreground border-primary'
                            : isCompleted
                              ? 'bg-emerald-500 text-white border-emerald-500'
                              : 'bg-background text-muted-foreground border-border'
                        )}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <span className="font-semibold">{index + 1}</span>
                        )}
                      </div>
                      <p
                        className={cn(
                          'text-xs mt-2 text-center max-w-[100px]',
                          isActive ? 'font-semibold text-foreground' : 'text-muted-foreground'
                        )}
                      >
                        {stepMeta[step].title}
                      </p>
                    </div>
                    {index < stepOrder.length - 1 && (
                      <div className="flex-1 mx-2 relative">
                        <div className="absolute top-5 left-0 right-0 h-0.5 -translate-y-1/2">
                          <div
                            className={cn(
                              'h-full w-full',
                              isCompleted ? 'bg-emerald-500' : 'bg-border'
                            )}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Form Content */}
        <section className="container mx-auto max-w-4xl px-4 lg:px-6 xl:px-8 py-8 lg:py-12">
          <Card className="p-6 lg:p-8 rounded-2xl">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-foreground">{stepMeta[currentStep].title}</h2>
              <p className="text-sm text-muted-foreground mt-1">{stepMeta[currentStep].subtitle}</p>
            </div>

            {/* Basic Information Step */}
            {currentStep === 'basic' && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="hotel-name">Hotel Name *</Label>
                  <Input
                    id="hotel-name"
                    value={form.name}
                    onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Grand Luxury Hotel"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      value={form.address}
                      onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
                      placeholder="Street address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={form.city}
                      onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))}
                      placeholder="City"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={form.state}
                      onChange={(e) => setForm((prev) => ({ ...prev, state: e.target.value }))}
                      placeholder="State"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Input
                      id="country"
                      value={form.country}
                      onChange={(e) => setForm((prev) => ({ ...prev, country: e.target.value }))}
                      placeholder="Country"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={form.description}
                    onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your hotel..."
                    className="min-h-[120px]"
                  />
                </div>
              </div>
            )}

            {/* Facilities Step */}
            {currentStep === 'facilities' && (
              <div className="space-y-6">
                <div>
                  <Label className="mb-3 block">Available Facilities</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {facilityOptions.map((facility) => (
                      <div key={facility} className="flex items-center space-x-2">
                        <Checkbox
                          id={`facility-${facility}`}
                          checked={form.facilities.includes(facility)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setForm((prev) => ({
                                ...prev,
                                facilities: [...prev.facilities, facility],
                              }))
                            } else {
                              setForm((prev) => ({
                                ...prev,
                                facilities: prev.facilities.filter((f) => f !== facility),
                              }))
                            }
                          }}
                        />
                        <Label htmlFor={`facility-${facility}`} className="cursor-pointer text-sm">
                          {facility}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-border">
                  <Card className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900">
                    <div className="flex items-start space-x-3">
                      <ShieldCheck className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center space-x-2">
                        <Checkbox
                          id="is-halal"
                          checked={form.isHalal}
                          onChange={(e) =>
                            setForm((prev) => ({ ...prev, isHalal: e.target.checked }))
                          }
                        />
                          <Label htmlFor="is-halal" className="cursor-pointer font-semibold flex items-center gap-2">
                            This hotel is Muslim-friendly (Halal certified)
                          </Label>
                        </div>
                        <p className="text-xs text-muted-foreground ml-6">
                          By checking this, you confirm that your hotel adheres to Islamic principles and provides a
                          comfortable environment for Muslim guests. This includes ensuring no pork is served, having
                          Muslim-friendly facilities, and maintaining an environment suitable for Islamic practices. Only
                          check this if you can genuinely provide these services.
                        </p>
                        <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 ml-6">
                          ⚠️ False claims may result in account suspension. Please ensure all information is accurate.
                        </p>
                      </div>
                    </div>
                  </Card>

                  {form.isHalal && (
                    <div className="ml-6 space-y-3">
                      <Label className="text-sm font-semibold">Select Halal Features Available</Label>
                      <p className="text-xs text-muted-foreground mb-3">
                        Select all features that apply to your hotel. Be honest and accurate in your selection.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {halalFeatureOptions.map((feature) => (
                          <div key={feature} className="flex items-center space-x-2">
                            <Checkbox
                              id={`halal-${feature}`}
                              checked={form.halalFeatures.includes(feature)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setForm((prev) => ({
                                    ...prev,
                                    halalFeatures: [...prev.halalFeatures, feature],
                                  }))
                                } else {
                                  setForm((prev) => ({
                                    ...prev,
                                    halalFeatures: prev.halalFeatures.filter((f) => f !== feature),
                                  }))
                                }
                              }}
                            />
                            <Label htmlFor={`halal-${feature}`} className="cursor-pointer text-sm">
                              {feature}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Rooms Step */}
            {currentStep === 'rooms' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <Label>Room Types</Label>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddRoom}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Room Type
                  </Button>
                </div>

                {form.rooms.length === 0 ? (
                  <Card className="p-12 text-center border-dashed">
                    <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No room types added yet</p>
                    <Button variant="outline" onClick={handleAddRoom}>
                      Add Your First Room Type
                    </Button>
                  </Card>
                ) : (
                  <div className="space-y-6">
                    {form.rooms.map((room, index) => (
                      <Card key={room.id} className="p-6 border border-border/60">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold text-foreground">Room Type {index + 1}</h3>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveRoom(room.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Room Type *</Label>
                              <Select
                                value={room.type}
                                onValueChange={(value) =>
                                  handleRoomChange(room.id, 'type', value)
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {roomTypeOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Room Name *</Label>
                              <Input
                                value={room.name}
                                onChange={(e) => handleRoomChange(room.id, 'name', e.target.value)}
                                placeholder="e.g., Standard Room"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Description *</Label>
                            <Textarea
                              value={room.description}
                              onChange={(e) => handleRoomChange(room.id, 'description', e.target.value)}
                              placeholder="Describe this room type..."
                              className="min-h-[80px]"
                            />
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="space-y-2">
                              <Label>Max Occupancy *</Label>
                              <Input
                                type="number"
                                min="1"
                                value={room.maxOccupancy}
                                onChange={(e) =>
                                  handleRoomChange(room.id, 'maxOccupancy', parseInt(e.target.value) || 1)
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Bed Type *</Label>
                              <Input
                                value={room.bedType}
                                onChange={(e) => handleRoomChange(room.id, 'bedType', e.target.value)}
                                placeholder="e.g., 1 King Bed"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Size *</Label>
                              <Input
                                value={room.size}
                                onChange={(e) => handleRoomChange(room.id, 'size', e.target.value)}
                                placeholder="e.g., 25 sqm"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Total Rooms *</Label>
                              <Input
                                type="number"
                                min="1"
                                value={room.totalRooms}
                                onChange={(e) =>
                                  handleRoomChange(room.id, 'totalRooms', parseInt(e.target.value) || 1)
                                }
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Price Per Night (₦) *</Label>
                            <Input
                              type="number"
                              min="0"
                              value={room.pricePerNight}
                              onChange={(e) =>
                                handleRoomChange(room.id, 'pricePerNight', parseFloat(e.target.value) || 0)
                              }
                              placeholder="0"
                            />
                          </div>

                          <div>
                            <Label className="mb-3 block">Room Amenities</Label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                              {roomAmenityOptions.map((amenity) => (
                                <div key={amenity} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`${room.id}-amenity-${amenity}`}
                                    checked={room.amenities.includes(amenity)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        handleRoomChange(room.id, 'amenities', [...room.amenities, amenity])
                                      } else {
                                        handleRoomChange(
                                          room.id,
                                          'amenities',
                                          room.amenities.filter((a) => a !== amenity)
                                        )
                                      }
                                    }}
                                  />
                                  <Label
                                    htmlFor={`${room.id}-amenity-${amenity}`}
                                    className="cursor-pointer text-sm"
                                  >
                                    {amenity}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <Label className="mb-3 block">Available Services</Label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                              {serviceOptions.map((service) => (
                                <div key={service} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`${room.id}-service-${service}`}
                                    checked={room.availableServices.includes(service)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        handleRoomChange(room.id, 'availableServices', [
                                          ...room.availableServices,
                                          service,
                                        ])
                                      } else {
                                        handleRoomChange(
                                          room.id,
                                          'availableServices',
                                          room.availableServices.filter((s) => s !== service)
                                        )
                                      }
                                    }}
                                  />
                                  <Label
                                    htmlFor={`${room.id}-service-${service}`}
                                    className="cursor-pointer text-sm"
                                  >
                                    {service}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <Label className="mb-3 block">Room Images</Label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                              {room.images.map((img) => (
                                <div key={img.id} className="relative group">
                                  <img
                                    src={img.url}
                                    alt="Room"
                                    className="w-full h-24 object-cover rounded-lg"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveImage(img.id, 'room', room.id)}
                                    className="absolute top-1 right-1 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                            <label className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-4 py-2 cursor-pointer hover:bg-muted">
                              <ImageIcon className="h-4 w-4 mr-2" />
                              Upload Room Images
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={(e) => handleImageUpload(e, 'room', room.id)}
                              />
                            </label>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Media Step */}
            {currentStep === 'media' && (
              <div className="space-y-6">
                <div>
                  <Label className="mb-3 block">Hotel Images * (Minimum 4)</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                    {form.images.map((img) => (
                      <div key={img.id} className="relative group">
                        <img
                          src={img.url}
                          alt="Hotel"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(img.id, 'hotel')}
                          className="absolute top-1 right-1 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <label className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-4 py-2 cursor-pointer hover:bg-muted">
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Upload Images
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, 'hotel')}
                    />
                  </label>
                  <p className="text-xs text-muted-foreground mt-2">
                    {form.images.length} of 4 minimum images uploaded
                  </p>
                </div>

                <div>
                  <Label className="mb-3 block">Hotel Videos (Optional)</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                    {form.videos.map((vid) => (
                      <div key={vid.id} className="relative group">
                        <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center">
                          <Video className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveVideo(vid.id)}
                          className="absolute top-1 right-1 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <label className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-4 py-2 cursor-pointer hover:bg-muted">
                    <Video className="h-4 w-4 mr-2" />
                    Upload Video
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={handleVideoUpload}
                    />
                  </label>
                </div>
              </div>
            )}

            {/* Summary Step */}
            {currentStep === 'summary' && (
              <div className="space-y-6">
                {/* Validation Summary */}
                {(() => {
                  const validationErrors = validateForm()
                  if (validationErrors.length > 0) {
                    return (
                      <Card className="p-6 border-amber-500/50 bg-amber-50/50 dark:bg-amber-950/20">
                        <div className="flex items-start gap-3">
                          <div className="h-5 w-5 rounded-full bg-amber-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold">!</span>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground mb-2">Please Review and Complete the Following:</h3>
                            <ul className="space-y-1.5 text-sm">
                              {validationErrors.map((error, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <span className="text-amber-600 dark:text-amber-400 mt-1">•</span>
                                  <span className="text-muted-foreground">{error}</span>
                                </li>
                              ))}
                            </ul>
                            <p className="text-xs text-muted-foreground mt-3">
                              Please go back to previous steps to complete all required information before submitting.
                            </p>
                          </div>
                        </div>
                      </Card>
                    )
                  }
                  return (
                    <Card className="p-6 border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-950/20">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-1">All Information Verified</h3>
                          <p className="text-sm text-muted-foreground">
                            All required fields have been completed. Please review the information below and confirm that all details are accurate before submitting.
                          </p>
                        </div>
                      </div>
                    </Card>
                  )
                })()}

                <Card className="p-6 border border-border/60">
                  <h3 className="font-semibold text-foreground mb-4">Basic Information</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Hotel Name:</span>
                      <span className={cn("ml-2 font-medium", !form.name && "text-amber-600")}>
                        {form.name || '⚠️ Not set'}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Address:</span>
                      <span className={cn("ml-2 font-medium", (!form.address || !form.city || !form.state) && "text-amber-600")}>
                        {form.address || '⚠️ Not set'}, {form.city || '⚠️ Not set'}, {form.state || '⚠️ Not set'}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Country:</span>
                      <span className={cn("ml-2 font-medium", !form.country && "text-amber-600")}>
                        {form.country || '⚠️ Not set'}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Description:</span>
                      <p className={cn("mt-1", !form.description ? "text-amber-600" : "text-muted-foreground")}>
                        {form.description || '⚠️ Not set'}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 border border-border/60">
                  <h3 className="font-semibold text-foreground mb-4">Facilities</h3>
                  <div className="flex flex-wrap gap-2">
                    {form.facilities.length > 0 ? (
                      form.facilities.map((facility) => (
                        <Badge key={facility} variant="outline">
                          {facility}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-amber-600">⚠️ No facilities added (required)</span>
                    )}
                  </div>
                  {form.isHalal && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                        <span className="font-semibold text-sm">Halal Certified</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {form.halalFeatures.map((feature) => (
                          <Badge key={feature} variant="outline" className="bg-emerald-500/10">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>

                <Card className="p-6 border border-border/60">
                  <h3 className="font-semibold text-foreground mb-4">
                    Room Types ({form.rooms.length})
                    {form.rooms.length === 0 && <span className="text-amber-600 text-sm ml-2">⚠️ At least one room required</span>}
                  </h3>
                  <div className="space-y-3">
                    {form.rooms.length > 0 ? (
                      form.rooms.map((room) => {
                        const roomErrors: string[] = []
                        if (!room.name || room.name.trim().length < 2) roomErrors.push('Name')
                        if (!room.description || room.description.trim().length < 10) roomErrors.push('Description')
                        if (!room.type) roomErrors.push('Type')
                        if (!room.pricePerNight || room.pricePerNight <= 0) roomErrors.push('Price')
                        if (!room.maxOccupancy || room.maxOccupancy < 1) roomErrors.push('Max Occupancy')
                        if (!room.bedType || room.bedType.trim().length < 2) roomErrors.push('Bed Type')
                        if (!room.size || room.size.trim().length < 2) roomErrors.push('Size')
                        if (!room.totalRooms || room.totalRooms < 1) roomErrors.push('Total Rooms')
                        if (room.amenities.length === 0) roomErrors.push('Amenities')

                        return (
                          <div key={room.id} className={cn("p-3 rounded-lg", roomErrors.length > 0 ? "bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900" : "bg-muted")}>
                            <div className="flex items-center justify-between mb-2">
                              <span className={cn("font-medium", !room.name && "text-amber-600")}>
                                {room.name || '⚠️ Unnamed Room'}
                              </span>
                              <span className={cn("text-sm font-semibold", (!room.pricePerNight || room.pricePerNight <= 0) ? "text-amber-600" : "text-primary")}>
                                {room.pricePerNight > 0 ? `₦${room.pricePerNight.toLocaleString()}/night` : '⚠️ Invalid price'}
                              </span>
                            </div>
                            <p className={cn("text-xs", !room.description ? "text-amber-600" : "text-muted-foreground")}>
                              {room.description || '⚠️ No description'}
                            </p>
                            {roomErrors.length > 0 && (
                              <p className="text-xs text-amber-600 mt-2">
                                Missing: {roomErrors.join(', ')}
                              </p>
                            )}
                          </div>
                        )
                      })
                    ) : (
                      <div className="p-4 text-center text-muted-foreground border border-dashed rounded-lg">
                        <p>No room types added</p>
                      </div>
                    )}
                  </div>
                </Card>

                <Card className="p-6 border border-border/60">
                  <h3 className="font-semibold text-foreground mb-4">Media</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-muted-foreground">Images: </span>
                      <span className={cn("text-sm font-medium", form.images.length < 4 && "text-amber-600")}>
                        {form.images.length} uploaded {form.images.length < 4 && `(⚠️ Minimum 4 required)`}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Videos: </span>
                      <span className="text-sm font-medium">{form.videos.length} uploaded (optional)</span>
                    </div>
                  </div>
                </Card>

                {/* Final Confirmation */}
                {(() => {
                  const validationErrors = validateForm()
                  const hasErrors = validationErrors.length > 0
                  const needsConfirmation = !confirmAccuracy
                  
                  // Show confirmation card only when other validations pass
                  if (hasErrors) return null
                  
                  return (
                    <Card className="p-6 border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-950/20">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-2">Ready to Submit</h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            All required information has been provided. Please confirm that:
                          </p>
                          <ul className="text-sm text-muted-foreground space-y-1.5 mb-4">
                            <li className="flex items-start gap-2">
                              <span className="text-emerald-600 mt-1">✓</span>
                              <span>All information provided is accurate and genuine</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-emerald-600 mt-1">✓</span>
                              <span>Hotel images are authentic and represent your property</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-emerald-600 mt-1">✓</span>
                              <span>Pricing and room details are correct</span>
                            </li>
                            {form.isHalal && (
                              <li className="flex items-start gap-2">
                                <span className="text-emerald-600 mt-1">✓</span>
                                <span>Muslim-friendly features are accurately represented</span>
                              </li>
                            )}
                          </ul>
                          <div className="p-3 bg-background rounded-lg border border-border mb-4">
                            <p className="text-xs text-muted-foreground">
                              <strong>Note:</strong> Your submission will be reviewed by our admin team. False or misleading information may result in account suspension or listing removal.
                            </p>
                          </div>
                          
                          {/* Confirmation Checkbox */}
                          <div className={cn(
                            "p-4 rounded-lg border-2 transition-colors",
                            needsConfirmation 
                              ? "border-amber-500/50 bg-amber-50/50 dark:bg-amber-950/20" 
                              : "border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-950/20"
                          )}>
                            <div className="flex items-start gap-3">
                              <Checkbox
                                id="confirm-accuracy"
                                checked={confirmAccuracy}
                                onChange={(e) => setConfirmAccuracy(e.target.checked)}
                                className="mt-0.5"
                              />
                              <div className="flex-1">
                                <Label htmlFor="confirm-accuracy" className="cursor-pointer font-semibold text-foreground">
                                  I confirm that all information provided is accurate and authentic
                                </Label>
                                <p className="text-xs text-muted-foreground mt-1">
                                  By checking this box, you acknowledge that all hotel details, images, pricing, facilities, and features (including Muslim-friendly claims if applicable) are genuine and accurate. You understand that providing false or misleading information may result in account suspension or listing removal.
                                </p>
                                {needsConfirmation && (
                                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 font-medium">
                                    ⚠️ Please confirm to proceed with submission
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )
                })()}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrev}
                disabled={!canGoPrev}
              >
                Previous
              </Button>
              {canGoNext ? (
                <Button onClick={handleNext}>Next</Button>
              ) : (
                <Button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting || !confirmAccuracy || validateForm().length > 0}
                  className={cn(
                    !confirmAccuracy && validateForm().length === 0 && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Hotel'}
                </Button>
              )}
            </div>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  )
}
