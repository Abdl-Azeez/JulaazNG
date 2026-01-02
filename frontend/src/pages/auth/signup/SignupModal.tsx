import { useMemo, useState } from 'react'
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom'
import type { Location } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
} from '@/shared/ui/dialog'
import { RadioGroup, RadioGroupItem } from '@/shared/ui/radio-group'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'
import LogoSvg from '@/assets/images/logo.svg?react'
import { ROUTES } from '@/shared/constants/routes'
import { Textarea } from '@/shared/ui/textarea'
import { serviceCategories } from '@/__mocks__/data/services.mock'
import { Mail } from 'lucide-react'
import toast from 'react-hot-toast'

interface ModalState {
  backgroundLocation?: Location
  modal?: boolean
  intendedDestination?: string
}

export function SignupModal() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()
  const modalState = (location.state as ModalState | undefined) ?? undefined
  const backgroundLocation = modalState?.backgroundLocation

  const handleClose = () => {
    if (backgroundLocation) {
      navigate(backgroundLocation.pathname + backgroundLocation.search + backgroundLocation.hash, {
        replace: true,
      })
    } else {
      navigate(ROUTES.HOME, { replace: true })
    }
  }

  const role = searchParams.get('role') || 'tenant'

  const availableUserTypes = ['tenant', 'landlord', 'handyman'] as const
  type UserType = (typeof availableUserTypes)[number]

  const defaultRole: UserType = availableUserTypes.includes(role as UserType)
    ? (role as UserType)
    : 'tenant'

  const [userType, setUserType] = useState<UserType>(defaultRole)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [ageRange, setAgeRange] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [handymanJobType, setHandymanJobType] = useState('')
  const [handymanExperienceYears, setHandymanExperienceYears] = useState('')
  const [handymanWorkshopAddress, setHandymanWorkshopAddress] = useState('')
  const [handymanWorkshopCity, setHandymanWorkshopCity] = useState('')
  const [errors, setErrors] = useState<{
    userType?: string
    firstName?: string
    lastName?: string
    ageRange?: string
    email?: string
    phone?: string
    password?: string
    confirmPassword?: string
    handymanJobType?: string
    handymanExperienceYears?: string
    handymanWorkshopAddress?: string
    handymanWorkshopCity?: string
  }>({})

  const jobOptions = useMemo(
    () =>
      serviceCategories.flatMap((category) =>
        category.services.map((service) => ({
          id: service.id,
          title: service.title,
          category: category.name,
        }))
      ),
    []
  )

  const ageRangeOptions = [
    { value: 'below-18', label: 'Below 18' },
    { value: '18-25', label: '18 - 25' },
    { value: '26-35', label: '26 - 35' },
    { value: '36-45', label: '36 - 45' },
    { value: '46-60', label: '46 - 60' },
    { value: '60-plus', label: '60+' },
  ]

  const validateForm = () => {
    const newErrors: typeof errors = {}

    if (!userType) {
      newErrors.userType = 'Select your user type'
    }

    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }

    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }

    if (!ageRange.trim()) {
      newErrors.ageRange = 'Select your age range'
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!phoneNumber.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^[0-9]{10,11}$/.test(phoneNumber.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number'
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required'
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (userType === 'handyman') {
      if (!handymanJobType) {
        newErrors.handymanJobType = 'Select your primary job type'
      }

      const experienceNumber = Number(handymanExperienceYears)
      if (!handymanExperienceYears.trim()) {
        newErrors.handymanExperienceYears = 'Share your years of experience'
      } else if (Number.isNaN(experienceNumber) || experienceNumber < 1) {
        newErrors.handymanExperienceYears = 'Experience must be at least 1 year'
      }

      if (!handymanWorkshopAddress.trim()) {
        newErrors.handymanWorkshopAddress = 'Workshop address is required'
      }

      if (!handymanWorkshopCity.trim()) {
        newErrors.handymanWorkshopCity = 'City / state is required'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const preserveState = modalState ? { ...modalState } : backgroundLocation ? { backgroundLocation, modal: true } : undefined

  const handleGoogleSSO = () => {
    if (!userType) {
      toast.error('Select user type first')
      setErrors((prev) => ({ ...prev, userType: 'Select your user type' }))
      return
    }

    const apiUrl = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '')
    if (!apiUrl) {
      toast.error('SSO is not configured')
      return
    }

    const next = encodeURIComponent(
      modalState?.intendedDestination || sessionStorage.getItem('intendedDestination') || ROUTES.HOME
    )
    window.location.assign(`${apiUrl}/auth/google?role=${encodeURIComponent(userType)}&next=${next}`)
  }

  const handleSignup = () => {
    if (validateForm()) {
      const params = new URLSearchParams({
        email: email,
        phone: phoneNumber,
        role: userType,
        firstName: firstName,
        lastName: lastName,
        ageRange: ageRange,
        nationality: 'Nigeria',
      })

      if (userType === 'handyman') {
        params.set('jobType', handymanJobType)
        params.set('experienceYears', handymanExperienceYears)
        params.set('workshopAddress', handymanWorkshopAddress)
        params.set('workshopCity', handymanWorkshopCity)
      }
      navigate(`${ROUTES.VERIFY_OTP}?${params.toString()}`, {
        state: preserveState,
      })
    }
  }

  return (
    <Dialog open onOpenChange={(open) => {
      if (!open) {
        handleClose()
      }
    }}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto p-6">
        <div className="flex flex-col items-center gap-6">
          <LogoSvg className="h-40 w-40 md:h-44 md:w-44 text-primary" />
          <div className="w-full space-y-6">
            <h1 className="text-2xl font-bold text-foreground text-center">
              Create your Account
            </h1>

            {/* User Type Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-foreground">Select User Type</Label>
              <RadioGroup
                value={userType}
                onValueChange={(value) => {
                  const nextValue = value as UserType
                  setUserType(nextValue)
                  if (nextValue !== 'handyman') {
                    setHandymanJobType('')
                    setHandymanExperienceYears('')
                    setHandymanWorkshopAddress('')
                    setHandymanWorkshopCity('')
                    setErrors((prev) => ({
                      ...prev,
                      handymanJobType: undefined,
                      handymanExperienceYears: undefined,
                      handymanWorkshopAddress: undefined,
                      handymanWorkshopCity: undefined,
                    }))
                  }
                }}
                className="flex flex-wrap gap-4"
              >
                <div className="flex items-center space-x-2 flex-1">
                  <RadioGroupItem value="tenant" id="modal-signup-tenant" />
                  <Label htmlFor="modal-signup-tenant" className="font-normal cursor-pointer">
                    Tenant
                  </Label>
                </div>
                <div className="flex items-center space-x-2 flex-1">
                  <RadioGroupItem value="landlord" id="modal-signup-landlord" />
                  <Label htmlFor="modal-signup-landlord" className="font-normal cursor-pointer">
                    Landlord
                  </Label>
                </div>
                <div className="flex items-center space-x-2 flex-1">
                  <RadioGroupItem value="handyman" id="modal-signup-handyman" />
                  <Label htmlFor="modal-signup-handyman" className="font-normal cursor-pointer">
                    Handyman / Service Pro
                  </Label>
                </div>
              </RadioGroup>
              {errors.userType && (
                <p className="text-xs text-destructive">{errors.userType}</p>
              )}
            </div>

            {/* SSO (requires user type) */}
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full h-12 rounded-lg focus-visible:ring-1 focus-visible:ring-offset-1"
                onClick={handleGoogleSSO}
              >
                <Mail className="h-4 w-4 mr-2" />
                Continue with Gmail
              </Button>
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground">or</span>
                <div className="h-px flex-1 bg-border" />
              </div>
            </div>

            {userType === 'handyman' && (
              <div className="rounded-2xl border border-border/60 bg-muted/40 p-4 space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Handyman onboarding</h3>
                  <p className="text-xs text-muted-foreground">
                    Help us match you with the right jobs. These details stay private and guide background screening.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-foreground">Primary job type</Label>
                  <Select
                    value={handymanJobType}
                    onValueChange={(value) => {
                      setHandymanJobType(value)
                      if (errors.handymanJobType) {
                        setErrors((prev) => ({ ...prev, handymanJobType: undefined }))
                      }
                    }}
                  >
                    <SelectTrigger className={errors.handymanJobType ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Select what you specialise in" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobOptions.map((job) => (
                        <SelectItem key={job.id} value={job.title}>
                          {job.title} • {job.category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.handymanJobType && (
                    <p className="text-xs text-destructive">{errors.handymanJobType}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="modal-handyman-experience" className="text-sm font-semibold text-foreground">
                    Years of experience
                  </Label>
                  <Input
                    id="modal-handyman-experience"
                    type="number"
                    min={1}
                    placeholder="e.g. 5"
                    value={handymanExperienceYears}
                    onChange={(event) => {
                      setHandymanExperienceYears(event.target.value)
                      if (errors.handymanExperienceYears) {
                        setErrors((prev) => ({ ...prev, handymanExperienceYears: undefined }))
                      }
                    }}
                    className={errors.handymanExperienceYears ? 'border-destructive' : ''}
                  />
                  {errors.handymanExperienceYears && (
                    <p className="text-xs text-destructive">{errors.handymanExperienceYears}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="modal-handyman-address" className="text-sm font-semibold text-foreground">
                    Workshop address
                  </Label>
                  <Textarea
                    id="modal-handyman-address"
                    rows={3}
                    placeholder="Tell us where your workshop or office is located"
                    value={handymanWorkshopAddress}
                    onChange={(event) => {
                      setHandymanWorkshopAddress(event.target.value)
                      if (errors.handymanWorkshopAddress) {
                        setErrors((prev) => ({ ...prev, handymanWorkshopAddress: undefined }))
                      }
                    }}
                    className={errors.handymanWorkshopAddress ? 'border-destructive' : ''}
                  />
                  {errors.handymanWorkshopAddress && (
                    <p className="text-xs text-destructive">{errors.handymanWorkshopAddress}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="modal-handyman-city" className="text-sm font-semibold text-foreground">
                    City / State
                  </Label>
                  <Input
                    id="modal-handyman-city"
                    type="text"
                    placeholder="e.g. Yaba, Lagos"
                    value={handymanWorkshopCity}
                    onChange={(event) => {
                      setHandymanWorkshopCity(event.target.value)
                      if (errors.handymanWorkshopCity) {
                        setErrors((prev) => ({ ...prev, handymanWorkshopCity: undefined }))
                      }
                    }}
                    className={errors.handymanWorkshopCity ? 'border-destructive' : ''}
                  />
                  {errors.handymanWorkshopCity && (
                    <p className="text-xs text-destructive">{errors.handymanWorkshopCity}</p>
                  )}
                </div>
              </div>
            )}

            {/* First Name Input */}
            <div className="space-y-2">
              <Label htmlFor="modal-first-name" className="text-sm font-semibold text-foreground">
                First Name
              </Label>
              <Input
                id="modal-first-name"
                type="text"
                placeholder="Enter your first name"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value)
                  if (errors.firstName) setErrors({ ...errors, firstName: undefined })
                }}
                className={errors.firstName ? 'border-destructive' : ''}
              />
              {errors.firstName && <p className="text-xs text-destructive">{errors.firstName}</p>}
            </div>

            {/* Last Name Input */}
            <div className="space-y-2">
              <Label htmlFor="modal-last-name" className="text-sm font-semibold text-foreground">
                Last Name
              </Label>
              <Input
                id="modal-last-name"
                type="text"
                placeholder="Enter your last name"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value)
                  if (errors.lastName) setErrors({ ...errors, lastName: undefined })
                }}
                className={errors.lastName ? 'border-destructive' : ''}
              />
              {errors.lastName && <p className="text-xs text-destructive">{errors.lastName}</p>}
            </div>

            {/* Age Range Input */}
            <div className="space-y-2">
              <Label htmlFor="modal-age-range" className="text-sm font-semibold text-foreground">
                Age Range
              </Label>
              <Select
                value={ageRange}
                onValueChange={(value) => {
                  setAgeRange(value)
                  if (errors.ageRange) setErrors({ ...errors, ageRange: undefined })
                }}
              >
                <SelectTrigger id="modal-age-range" className={errors.ageRange ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select your age range" />
                </SelectTrigger>
                <SelectContent>
                  {ageRangeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.ageRange && <p className="text-xs text-destructive">{errors.ageRange}</p>}
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="modal-signup-email" className="text-sm font-semibold text-foreground">
                Email Address
              </Label>
              <Input
                id="modal-signup-email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (errors.email) setErrors({ ...errors, email: undefined })
                }}
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>

            {/* Phone Number Input */}
            <div className="space-y-2">
              <Label htmlFor="modal-signup-phone" className="text-sm font-semibold text-foreground">
                Phone Number
              </Label>
              <div className="flex gap-2">
                <div className="flex items-center gap-2 px-3 border border-input rounded-lg bg-background">
                  <span className="text-2xl">🇳🇬</span>
                  <span className="text-sm font-medium">+234</span>
                </div>
                <Input
                  id="modal-signup-phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '')
                    setPhoneNumber(value)
                    if (errors.phone) setErrors({ ...errors, phone: undefined })
                  }}
                  className={`flex-1 ${errors.phone ? 'border-destructive' : ''}`}
                />
              </div>
              {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <Label htmlFor="modal-signup-password" className="text-sm font-semibold text-foreground">
                Password
              </Label>
              <Input
                id="modal-signup-password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  const newPassword = e.target.value
                  setPassword(newPassword)
                  if (errors.password) {
                    setErrors({ ...errors, password: undefined })
                  }
                  if (confirmPassword && newPassword !== confirmPassword) {
                    setErrors((prev) => ({ ...prev, confirmPassword: 'Passwords do not match' }))
                  } else if (confirmPassword && newPassword === confirmPassword) {
                    setErrors((prev) => ({ ...prev, confirmPassword: undefined }))
                  }
                }}
                onBlur={() => {
                  if (password && password.length < 8) {
                    setErrors((prev) => ({ ...prev, password: 'Password must be at least 8 characters' }))
                  }
                }}
                className={errors.password ? 'border-destructive' : ''}
              />
              {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
              {password && password.length < 8 && !errors.password && (
                <p className="text-xs text-muted-foreground">Password must be at least 8 characters</p>
              )}
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-2">
              <Label htmlFor="modal-confirm-password" className="text-sm font-semibold text-foreground">
                Confirm Password
              </Label>
              <Input
                id="modal-confirm-password"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => {
                  const newConfirmPassword = e.target.value
                  setConfirmPassword(newConfirmPassword)
                  if (password && newConfirmPassword && password !== newConfirmPassword) {
                    setErrors((prev) => ({ ...prev, confirmPassword: 'Passwords do not match' }))
                  } else {
                    setErrors((prev) => ({ ...prev, confirmPassword: undefined }))
                  }
                }}
                className={errors.confirmPassword ? 'border-destructive' : ''}
              />
              {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword}</p>}
              {confirmPassword && password && confirmPassword === password && (
                <p className="text-xs text-success">Passwords match ✓</p>
              )}
            </div>

            {/* Sign Up Button */}
            <Button
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
              onClick={handleSignup}
            >
              Sign Up
            </Button>

            {/* Terms and Privacy */}
            <p className="text-xs text-center text-muted-foreground">
              By continuing you agree to the{' '}
              <a href="#" className="font-bold underline">
                Terms of Use
              </a>{' '}
              and{' '}
              <a href="#" className="font-bold underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SignupModal
