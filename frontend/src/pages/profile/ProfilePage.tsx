import { useState, useRef, useEffect, ChangeEvent, FormEvent, useMemo } from 'react'
import { Check, Home, MessageCircle, MapPin, LogOut, Settings, Camera, X, Save, Upload, Trash2, AlertCircle, FileText, Star, Sparkles } from 'lucide-react'
import BackgroundCheckIcon from '@/assets/icons/background_check.svg?react'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'
import { Badge } from '@/shared/ui/badge'
import { SharedLayout } from '@/widgets/shared-layout'
import { AuthDialog } from '@/widgets/auth-dialog'
import { useAuthStore } from '@/shared/store/auth.store'
import { useRoleStore } from '@/shared/store/role.store'
import { cn } from '@/shared/lib/utils/cn'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/shared/constants/routes'
import { LogoLoader } from '@/widgets/logo-loader'
import toast from 'react-hot-toast'
import { calculateHandymanBadge, handymanBadgeTiers } from '@/shared/lib/badge-config'
import { mockHandymanBadgeMetrics } from '@/__mocks__/data/handyman.mock'

export function ProfilePage() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const { activeRole } = useRoleStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  
  // Edit mode
  const [isEditing, setIsEditing] = useState(false)
  
  // Profile data
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dateOfBirth: '2001-07-14',
    gender: 'male',
    nationality: 'Nigerian',
    isVerified: user?.isVerified ?? false,
    profileImage: null as string | null,
  })

  const [editData, setEditData] = useState({ ...profileData })

  // Sync profile data when user changes
  useEffect(() => {
    if (user) {
      setProfileData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        isVerified: user.isVerified ?? prev.isVerified,
      }))
      setEditData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        isVerified: user.isVerified ?? prev.isVerified,
      }))
    }
  }, [user])

  const [backgroundStatus, setBackgroundStatus] = useState<'not_started' | 'submitted' | 'verified'>(
    profileData.isVerified ? 'verified' : 'not_started'
  )
  const effectiveRole = activeRole ?? user?.role ?? null
  const isHandyman =
    effectiveRole === 'handyman' || effectiveRole === 'service_provider' || effectiveRole === 'artisan'
  const isAdmin = effectiveRole === 'admin'

  const [backgroundForm, setBackgroundForm] = useState({
    monthlyIncome: '',
    occupation: '',
    employer: '',
    employmentLength: '',
    financialCommitments: '',
    identityNumber: '',
    competencyEvidence: '',
    authenticityNotes: '',
    workshopAddress: '',
  })
  const [documentFiles, setDocumentFiles] = useState<File[]>([])
  const [isSubmittingBackground, setIsSubmittingBackground] = useState(false)

  const averageRating = user?.averageRating ?? 5
  const ratingCount = user?.ratingCount ?? 0
  const pointsBalance = user?.pointsBalance ?? 0
  const lifetimePoints = user?.lifetimePoints ?? pointsBalance
  const handymanBadge = useMemo(
    () => (isHandyman ? calculateHandymanBadge(mockHandymanBadgeMetrics) : null),
    [isHandyman]
  )

  useEffect(() => {
    if (user) {
      setProfileData((prev) => ({
        ...prev,
        name: user.name ?? prev.name,
        email: user.email ?? prev.email,
        phone: user.phone ?? prev.phone,
        isVerified: user.isVerified ?? prev.isVerified,
      }))
    }
  }, [user])

  useEffect(() => {
    setEditData({ ...profileData })
  }, [profileData])

  useEffect(() => {
    if (profileData.isVerified) {
      setBackgroundStatus('verified')
    }
  }, [profileData.isVerified])

  // Scroll to background check section if hash is present
  useEffect(() => {
    if (window.location.hash === '#background-check') {
      setTimeout(() => {
        const element = document.getElementById('background-check')
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 300)
    }
  }, [])

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      logout()
      navigate(ROUTES.HOME)
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setEditData({ ...editData, profileImage: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Update profile data
      setProfileData({ ...editData })
      setIsEditing(false)
      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error(`Failed to update profile: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setEditData({ ...profileData })
    setIsEditing(false)
  }

  const handleBackgroundInputChange = (
    field: keyof typeof backgroundForm,
    value: string
  ) => {
    setBackgroundForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleDocumentUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
    if (!files.length) return

    const validFiles = files.filter((file) => {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 10MB limit`)
        return false
      }
      return true
    })

    if (!validFiles.length) {
      event.target.value = ''
      return
    }

    setDocumentFiles((prev) => [...prev, ...validFiles])
    toast.success(`${validFiles.length} document${validFiles.length !== 1 ? 's' : ''} added`)
    event.target.value = ''
  }

  const handleRemoveDocument = (index: number) => {
    setDocumentFiles((prev) => prev.filter((_, itemIndex) => itemIndex !== index))
  }

  const handleBackgroundSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (isHandyman) {
      if (!backgroundForm.identityNumber.trim()) {
        toast.error('Provide your government-issued ID details')
        return
      }

      if (!backgroundForm.competencyEvidence.trim()) {
        toast.error('Tell us about your trade competency or certifications')
        return
      }

      if (!backgroundForm.authenticityNotes.trim()) {
        toast.error('Share references or proof of past work to verify authenticity')
        return
      }

      if (!backgroundForm.workshopAddress.trim()) {
        toast.error('Tell us where your workshop is located')
        return
      }
    } else {
    if (!backgroundForm.monthlyIncome || Number(backgroundForm.monthlyIncome) <= 0) {
      toast.error('Enter your estimated monthly income')
      return
    }

    if (!backgroundForm.occupation) {
      toast.error('Tell us about your occupation')
      return
    }

    if (!backgroundForm.employer) {
      toast.error('Share your employer or business name')
      return
    }

    if (!backgroundForm.employmentLength) {
      toast.error('Let us know how long you have been employed')
      return
      }
    }

    if (documentFiles.length === 0) {
      toast.error('Upload supporting documents for verification')
      return
    }

    setIsSubmittingBackground(true)
    try {
      setBackgroundStatus('submitted')
      toast.success('Background check details submitted. We will verify shortly.')

      await new Promise((resolve) => setTimeout(resolve, 2500))

      setBackgroundStatus('verified')
      setProfileData((prev) => ({ ...prev, isVerified: true }))
      setEditData((prev) => ({ ...prev, isVerified: true }))
      setDocumentFiles([])
      setBackgroundForm({
        monthlyIncome: '',
        occupation: '',
        employer: '',
        employmentLength: '',
        financialCommitments: '',
        identityNumber: '',
        competencyEvidence: '',
        authenticityNotes: '',
        workshopAddress: '',
      })
      toast.success('Background check verified!')
    } finally {
      setIsSubmittingBackground(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <SharedLayout>
      <div className="min-h-screen bg-background">
        {/* Profile Header with Settings Button */}
        <header className="sticky z-40 w-full border-b bg-surface/95 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 lg:px-6 xl:px-8 h-16 lg:h-20 flex items-center justify-end max-w-7xl">
          <Button
            variant="ghost"
            size="icon"
            className="bg-icon-bg text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
            onClick={() => navigate(ROUTES.SETTINGS)}
            aria-label="Settings"
          >
            <Settings className="h-5 w-5 lg:h-6 lg:w-6" />
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 lg:px-6 xl:px-8 py-6 lg:py-12 space-y-6 lg:space-y-8 pb-24 lg:pb-12 max-w-6xl">
        {/* Desktop Profile Header */}
        <div className="hidden lg:block">
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-2xl p-8 mb-8">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-surface flex items-center justify-center overflow-hidden border-4 border-background shadow-lg">
                  {(isEditing ? editData.profileImage : profileData.profileImage) ? (
                    <img
                      src={isEditing ? editData.profileImage! : profileData.profileImage!}
                      alt={profileData.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-bold text-primary">
                      {getInitials(profileData.name)}
                    </span>
                  )}
                </div>
                {profileData.isVerified && (
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary flex items-center justify-center border-4 border-background shadow-md">
                    <Check className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-foreground mb-2">{profileData.name}</h1>
                <p className="text-muted-foreground mb-4">{profileData.email}</p>
                {profileData.isVerified && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                    <Check className="h-4 w-4" />
                    Verified Account
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Picture Section - Mobile */}
        <div className="flex flex-col lg:hidden lg:flex-row lg:items-start lg:gap-8 items-center space-y-4 lg:space-y-0">
          <div className="relative">
            <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-surface flex items-center justify-center overflow-hidden border-2 border-border">
              {(isEditing ? editData.profileImage : profileData.profileImage) ? (
                <img
                  src={isEditing ? editData.profileImage! : profileData.profileImage!}
                  alt={profileData.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-primary">
                  {getInitials(profileData.name)}
                </span>
              )}
            </div>
            {profileData.isVerified && (
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center border-2 border-background">
                <Check className="h-3 w-3 text-primary-foreground" />
              </div>
            )}
            {isEditing && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary hover:bg-primary/90 flex items-center justify-center border-2 border-background"
                aria-label="Upload photo"
              >
                <Camera className="h-4 w-4 text-primary-foreground" />
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Ratings and Points */}
        <Card className="p-4 lg:p-5 rounded-2xl border border-border bg-surface">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background px-4 py-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Your rating</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-foreground">{averageRating.toFixed(1)}</span>
                  <span className="text-sm text-muted-foreground">({ratingCount} reviews)</span>
                </div>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <Star className="h-5 w-5 fill-primary/80" />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background px-4 py-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Loyalty points</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-foreground">{pointsBalance.toLocaleString('en-NG')}</span>
                  <span className="text-sm text-muted-foreground">of {lifetimePoints.toLocaleString('en-NG')} earned</span>
                </div>
              </div>
              <div className="h-10 w-10 rounded-full bg-accent/10 text-accent flex items-center justify-center">
                <Sparkles className="h-5 w-5" />
              </div>
            </div>
          </div>
        </Card>

        {isHandyman && handymanBadge && (
          <Card className="p-4 lg:p-5 rounded-2xl border border-border bg-surface space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Handyman badge</p>
                <div className="flex items-center gap-2">
                  <Badge className={cn('rounded-full px-3 py-1 text-xs font-semibold', handymanBadge.className)}>
                    {handymanBadge.label}
                  </Badge>
                  <span className="text-xs text-muted-foreground">Score {handymanBadge.score}/{handymanBadge.totalPossible}</span>
                </div>
                {handymanBadge.nextTier && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Next: {handymanBadge.nextTier.label} — close the gaps below to upgrade.
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Live progress from your handyman dashboard
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {handymanBadge.progress.map((item) => {
                const targetLabel = item.target ? `${item.current}${item.unit ?? ''} / ${item.target}${item.unit ?? ''}` : `${item.current}${item.unit ?? ''}`
                const completion = item.target ? Math.min(100, Math.round((item.current / item.target) * 100)) : 100
                return (
                  <div key={item.key} className="rounded-xl border border-border/60 bg-background p-3 space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{item.label}</span>
                      <span className="font-medium text-foreground">{targetLabel}</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-muted/60 overflow-hidden">
                      <div
                        className={cn('h-full rounded-full transition-all', item.met ? 'bg-primary' : 'bg-primary/60')}
                        style={{ width: `${completion}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-foreground uppercase tracking-wide">Badge roadmap</p>
              <div className="grid gap-3 md:grid-cols-2">
                {handymanBadgeTiers.map((tier) => (
                  <div key={tier.id} className="rounded-xl border border-border/60 bg-muted/40 p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-foreground">{tier.label}</span>
                      <Badge className={cn('rounded-full px-2.5 py-0.5 text-[11px]', tier.className)}>{tier.label}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{tier.description}</p>
                    <ul className="text-[11px] text-muted-foreground space-y-1">
                      {tier.requirements.map((req) => (
                        <li key={req} className="flex items-start gap-2">
                          <Check className="h-3.5 w-3.5 text-primary mt-0.5" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* User Information Cards */}
        <div className="grid lg:grid-cols-2 gap-4 lg:gap-6">
          {isEditing ? (
              // Edit Mode
              <>
                <Card className="p-4 lg:p-6 bg-surface border border-border/50 hover:shadow-md transition-shadow">
                <Label className="text-xs text-muted-foreground mb-2 block">Full Name</Label>
                <Input
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="font-semibold"
                />
              </Card>

              <Card className="p-4 lg:p-6 bg-surface border border-border/50 hover:shadow-md transition-shadow">
                <Label className="text-xs text-muted-foreground mb-2 block">Email Address</Label>
                <Input
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                  className="font-semibold"
                />
              </Card>

              <Card className="p-4 lg:p-6 bg-surface border border-border/50 hover:shadow-md transition-shadow">
                <Label className="text-xs text-muted-foreground mb-2 block">Phone Number</Label>
                <Input
                  type="tel"
                  value={editData.phone}
                  onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                  className="font-semibold"
                />
              </Card>

              <Card className="p-4 lg:p-6 bg-surface border border-border/50 hover:shadow-md transition-shadow">
                <Label className="text-xs text-muted-foreground mb-2 block">Date of Birth</Label>
                <Input
                  type="date"
                  value={editData.dateOfBirth}
                  onChange={(e) => setEditData({ ...editData, dateOfBirth: e.target.value })}
                  className="font-semibold"
                />
              </Card>

              <Card className="p-4 lg:p-6 bg-surface border border-border/50 hover:shadow-md transition-shadow">
                <Label className="text-xs text-muted-foreground mb-2 block">Gender</Label>
                <Select value={editData.gender} onValueChange={(value) => setEditData({ ...editData, gender: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </Card>

              <Card className="p-4 lg:p-6 bg-surface border border-border/50 hover:shadow-md transition-shadow">
                <Label className="text-xs text-muted-foreground mb-2 block">Nationality</Label>
                <Input
                  value={editData.nationality}
                  onChange={(e) => setEditData({ ...editData, nationality: e.target.value })}
                  className="font-semibold"
                />
              </Card>
            </>
          ) : (
            // View Mode
            <>
              <Card className="p-4 lg:p-6 bg-surface border border-border/50 hover:shadow-md transition-shadow">
                <p className="text-xs text-muted-foreground mb-1">Full Name</p>
                <p className="font-semibold text-foreground">{profileData.name}</p>
              </Card>

              <Card className="p-4 lg:p-6 bg-surface border border-border/50 hover:shadow-md transition-shadow">
                <p className="text-xs text-muted-foreground mb-1">Email Address</p>
                <p className="font-semibold text-foreground">{profileData.email}</p>
              </Card>

              <Card className="p-4 lg:p-6 bg-surface border border-border/50 hover:shadow-md transition-shadow">
                <p className="text-xs text-muted-foreground mb-1">Phone Number</p>
                <p className="font-semibold text-foreground">{profileData.phone}</p>
              </Card>

              <Card className="p-4 lg:p-6 bg-surface border border-border/50 hover:shadow-md transition-shadow">
                <p className="text-xs text-muted-foreground mb-1">Date of Birth</p>
                <p className="font-semibold text-foreground">
                  {new Date(profileData.dateOfBirth).toLocaleDateString('en-GB')}
                </p>
              </Card>

              <Card className="p-4 lg:p-6 bg-surface border border-border/50 hover:shadow-md transition-shadow">
                <p className="text-xs text-muted-foreground mb-1">Gender</p>
                <p className="font-semibold text-foreground capitalize">{profileData.gender}</p>
              </Card>

              <Card className="p-4 lg:p-6 bg-surface border border-border/50 hover:shadow-md transition-shadow">
                <p className="text-xs text-muted-foreground mb-1">Nationality</p>
                <p className="font-semibold text-foreground">{profileData.nationality}</p>
              </Card>
            </>
          )}
        </div>

        {/* Background Check Section - Hidden for Admin */}
        {!isEditing && !isAdmin && (
          <div id="background-check" className="space-y-6 pt-6 lg:pt-8">
            <h2 className="text-xl lg:text-2xl font-bold text-foreground">Background Check</h2>

            {/* Navigation Icons - Desktop Enhanced */}
            <div className="hidden lg:flex justify-start gap-6 lg:gap-8 pb-6">
              <button className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-surface transition-colors group">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                  <Home className="h-6 w-6 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">Home</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-surface transition-colors group">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                  <MessageCircle className="h-6 w-6 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">Chat</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-surface transition-colors group">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">Property</span>
              </button>
            </div>

            {/* Mobile Navigation Icons */}
            <div className="flex lg:hidden justify-center gap-8 pb-4">
              <div className="flex flex-col items-center gap-1">
                <Home className="h-6 w-6 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Home</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <MessageCircle className="h-6 w-6 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Chat</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <MapPin className="h-6 w-6 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Property</span>
              </div>
            </div>

            {/* Background Check Workflow */}
            <Card className="p-6 lg:p-8 bg-surface border border-border/60 rounded-2xl space-y-6">
              {backgroundStatus === 'verified' ? (
                <div className="flex flex-col lg:flex-row lg:items-center gap-5 text-center lg:text-left">
                  <div className="mx-auto lg:mx-0 flex h-32 w-32 items-center justify-center rounded-full bg-primary/10">
                    <BackgroundCheckIcon className="h-40 w-40 text-primary" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-center lg:justify-start gap-2">
                      <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                        <Check className="h-4 w-4" />
                        Verified
                      </span>
                    </div>
                    <h3 className="text-lg lg:text-xl font-semibold text-foreground">Background check completed</h3>
                    <p className="text-sm text-muted-foreground">
                      Your profile is now verified. Landlords will see your trusted status when reviewing applications.
                    </p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <FileText className="mt-0.5 h-4 w-4 text-primary" />
                        <span>
                          {isHandyman
                            ? 'Identity and workshop details securely stored.'
                            : 'Identity and employment documents securely stored.'}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 text-primary" />
                        <span>
                          {isHandyman
                            ? 'Trade competency evidence reviewed by the Julaaz service quality team.'
                            : 'Financial information reviewed by Julaaz compliance team.'}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleBackgroundSubmit} className="space-y-6">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4 lg:gap-6">
                    <div className="mx-auto lg:mx-0 flex h-28 w-28 items-center justify-center rounded-2xl bg-primary/10">
                      <BackgroundCheckIcon className="h-32 w-32 text-primary" />
                    </div>
                    <div className="flex-1 space-y-2 text-center lg:text-left">
                      <h3 className="text-lg lg:text-xl font-semibold text-foreground">Perform background check</h3>
                      <p className="text-sm text-muted-foreground">
                        {isHandyman
                          ? 'Provide a few extra details so we can confirm your identity, trade competency and workshop authenticity. We’ll only use this information for verification.'
                          : 'Provide a few extra details so we can confirm your identity and tenancy eligibility. We’ll only use this information for verification.'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide">Personal information</h4>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label htmlFor="bc-full-name" className="text-sm text-muted-foreground">
                          Full name
                        </Label>
                        <Input
                          id="bc-full-name"
                          value={profileData.name}
                          disabled
                          className="h-11 rounded-xl bg-muted/60 text-foreground"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="bc-email" className="text-sm text-muted-foreground">
                          Email address
                        </Label>
                        <Input
                          id="bc-email"
                          value={profileData.email}
                          disabled
                          className="h-11 rounded-xl bg-muted/60 text-foreground"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="bc-phone" className="text-sm text-muted-foreground">
                          Phone number
                        </Label>
                        <Input
                          id="bc-phone"
                          value={profileData.phone}
                          disabled
                          className="h-11 rounded-xl bg-muted/60 text-foreground"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="bc-nationality" className="text-sm text-muted-foreground">
                          Nationality
                        </Label>
                        <Input
                          id="bc-nationality"
                          value={profileData.nationality}
                          disabled
                          className="h-11 rounded-xl bg-muted/60 text-foreground"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                      {isHandyman ? 'Trade verification' : 'Employment information'}
                    </h4>
                    {isHandyman ? (
                      <>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-1.5">
                            <Label htmlFor="bc-identity" className="text-sm text-foreground">
                              Identity details
                            </Label>
                            <Input
                              id="bc-identity"
                              value={backgroundForm.identityNumber}
                              onChange={(event) => handleBackgroundInputChange('identityNumber', event.target.value)}
                              placeholder="e.g. NIN: 12345678901 or Driver's Licence: ABC12345"
                              className="h-11 rounded-xl"
                            />
                            <p className="text-xs text-muted-foreground">
                              We only store this securely to confirm you are who you say you are.
                            </p>
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="bc-workshop" className="text-sm text-foreground">
                              Workshop / office address
                            </Label>
                            <Input
                              id="bc-workshop"
                              value={backgroundForm.workshopAddress}
                              onChange={(event) => handleBackgroundInputChange('workshopAddress', event.target.value)}
                              placeholder="20, Iwaya Road, Yaba, Lagos"
                              className="h-11 rounded-xl"
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="bc-competency" className="text-sm text-foreground">
                            Competency proof
                          </Label>
                          <textarea
                            id="bc-competency"
                            value={backgroundForm.competencyEvidence}
                            onChange={(event) => handleBackgroundInputChange('competencyEvidence', event.target.value)}
                            rows={3}
                            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                            placeholder="List certifications, training, apprenticeships, or notable projects."
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="bc-authenticity" className="text-sm text-foreground">
                            Authenticity & references
                          </Label>
                          <textarea
                            id="bc-authenticity"
                            value={backgroundForm.authenticityNotes}
                            onChange={(event) => handleBackgroundInputChange('authenticityNotes', event.target.value)}
                            rows={3}
                            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                            placeholder="Share referees, portfolio links, workshop social media, or past client testimonials."
                          />
                        </div>
                      </>
                    ) : (
                      <>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label htmlFor="bc-income" className="text-sm text-foreground">
                          Monthly income (₦)
                        </Label>
                        <Input
                          id="bc-income"
                          type="number"
                          min={50000}
                          step={5000}
                          value={backgroundForm.monthlyIncome}
                          onChange={(event) => handleBackgroundInputChange('monthlyIncome', event.target.value)}
                          placeholder="450000"
                          className="h-11 rounded-xl"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="bc-occupation" className="text-sm text-foreground">
                          Occupation / role
                        </Label>
                        <Input
                          id="bc-occupation"
                          value={backgroundForm.occupation}
                          onChange={(event) => handleBackgroundInputChange('occupation', event.target.value)}
                          placeholder="Product Designer"
                          className="h-11 rounded-xl"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="bc-employer" className="text-sm text-foreground">
                          Employer / business name
                        </Label>
                        <Input
                          id="bc-employer"
                          value={backgroundForm.employer}
                          onChange={(event) => handleBackgroundInputChange('employer', event.target.value)}
                          placeholder="Julaaz NG"
                          className="h-11 rounded-xl"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="bc-employment-length" className="text-sm text-foreground">
                          Length of employment
                        </Label>
                        <Input
                          id="bc-employment-length"
                          value={backgroundForm.employmentLength}
                          onChange={(event) => handleBackgroundInputChange('employmentLength', event.target.value)}
                          placeholder="2 years"
                          className="h-11 rounded-xl"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="bc-finances" className="text-sm text-foreground">
                        Financial commitments or notes
                      </Label>
                      <textarea
                        id="bc-finances"
                        value={backgroundForm.financialCommitments}
                        onChange={(event) => handleBackgroundInputChange('financialCommitments', event.target.value)}
                        rows={3}
                        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="Tell us about any loans, dependents, or other commitments"
                      />
                    </div>
                      </>
                    )}
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide">Required documents</h4>
                    <p className="text-xs text-muted-foreground">
                      {isHandyman
                        ? "Valid government ID • Trade certificate or apprenticeship letter • Photos of recent work or workshop • References. Upload PDF, JPG, or PNG files up to 10MB each."
                        : "Valid ID (Driver's License, National ID, or Passport) • Proof of Income • Employment letter or contract. Upload PDF, JPG, or PNG files up to 10MB each."}
                    </p>
                    <div className="rounded-2xl border-2 border-dashed border-border bg-background/60 p-6 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Upload className="h-6 w-6 text-primary" />
                        <p className="text-sm text-foreground">Drag & drop files here or click to upload</p>
                        <label
                          htmlFor="bc-documents"
                          className="inline-flex items-center justify-center rounded-full border border-primary/40 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 cursor-pointer"
                        >
                          Select files
                        </label>
                        <Input
                          id="bc-documents"
                          type="file"
                          accept="application/pdf,image/png,image/jpeg"
                          className="hidden"
                          multiple
                          onChange={handleDocumentUpload}
                        />
                      </div>
                    </div>
                    {documentFiles.length > 0 && (
                      <ul className="space-y-2">
                        {documentFiles.map((file, index) => (
                          <li
                            key={`${file.name}-${index}`}
                            className="flex items-center justify-between rounded-xl border border-border bg-background px-3 py-2 text-sm"
                          >
                            <div className="flex items-center gap-3">
                              <FileText className="h-4 w-4 text-primary" />
                              <div className="flex flex-col">
                                <span className="font-medium text-foreground">{file.name}</span>
                                <span className="text-xs text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveDocument(index)}
                              className="rounded-full p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                              aria-label="Remove document"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-2 rounded-xl bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-200 border border-amber-500/20">
                      <AlertCircle className="mt-0.5 h-4 w-4" />
                      <p>
                        Once submitted, our compliance team reviews your information within 24 hours. You will receive an email once the background check is complete.
                      </p>
                    </div>
                    <Button
                      type="submit"
                      className="w-full lg:w-auto lg:px-8 h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
                      disabled={isSubmittingBackground}
                    >
                      {isSubmittingBackground ? (
                        <span className="inline-flex items-center gap-2">
                          <LogoLoader size="sm" variant="white" />
                          Submitting...
                        </span>
                      ) : backgroundStatus === 'submitted' ? (
                        'Submitted for review'
                      ) : (
                        'Submit for verification'
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </Card>
          </div>
        )}

        {/* Logout Button */}
        {!isEditing && (
          <div className="pt-6 lg:pt-8">
            <div className="max-w-md lg:max-w-none">
              <Button
                variant="outline"
                size="lg"
                className="w-full lg:w-auto lg:px-8 h-12 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground rounded-xl"
                onClick={handleLogout}
                disabled={isLoading}
              >
                {isLoading ? (
                  <LogoLoader size="sm" variant="primary" className="mr-2" />
                ) : (
                  <LogOut className="h-4 w-4 mr-2" />
                )}
                {isLoading ? 'Logging out...' : 'Logout'}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Fixed Edit/Save/Cancel Buttons - Mobile Only */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-surface/95 backdrop-blur-sm border-t lg:hidden z-50">
        {isEditing ? (
          <div className="flex gap-3 max-w-2xl mx-auto">
            <Button
              variant="outline"
              className="flex-1 h-12"
              onClick={handleCancel}
              disabled={isLoading}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              className="flex-1 h-12 bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? (
                <LogoLoader size="sm" variant="foreground" className="mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        ) : (
          <Button
            className="w-full max-w-2xl mx-auto h-12 bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </Button>
        )}
      </div>

      {/* Desktop Action Buttons */}
      <div className="hidden lg:flex gap-4 justify-end max-w-6xl mx-auto px-4 lg:px-6 xl:px-8 pb-8">
        {isEditing ? (
          <>
            <Button
              variant="outline"
              size="lg"
              className="h-12 px-8"
              onClick={handleCancel}
              disabled={isLoading}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              size="lg"
              className="h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? (
                <LogoLoader size="sm" variant="foreground" className="mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </>
        ) : (
          <Button
            size="lg"
            className="h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </Button>
        )}
      </div>
      
        <AuthDialog open={isDrawerOpen} onOpenChange={setIsDrawerOpen} />
      </div>
    </SharedLayout>
  )
}
