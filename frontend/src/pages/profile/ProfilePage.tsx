import { useState, useRef } from 'react'
import { Check, Home, MessageCircle, MapPin, LogOut, Settings, Camera, X, Save } from 'lucide-react'
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
import { Header } from '@/widgets/header'
import { Sidebar } from '@/widgets/sidebar'
import { AuthDrawer } from '@/widgets/auth-drawer'
import { useAuthStore } from '@/shared/store/auth.store'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/shared/constants/routes'
import { LogoLoader } from '@/widgets/logo-loader'
import toast from 'react-hot-toast'

export function ProfilePage() {
  const navigate = useNavigate()
  const { user, logout, isAuthenticated } = useAuthStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  
  // Edit mode
  const [isEditing, setIsEditing] = useState(false)
  
  // Profile data
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Abdulraheem Abdulsalam',
    email: user?.email || 'abdulraheemabdulsalam@gmail.com',
    phone: user?.phone || '+2347010087586',
    dateOfBirth: '2001-07-14',
    gender: 'male',
    nationality: 'Nigerian',
    isVerified: user?.isVerified || true,
    profileImage: null as string | null,
  })

  const [editData, setEditData] = useState({ ...profileData })

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

  const handleMenuClick = () => {
    setIsSidebarOpen(true)
  }

  const handleProfileClick = () => {
    if (isAuthenticated) {
      // Already on profile page
    } else {
      setIsDrawerOpen(true)
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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuClick={handleMenuClick} onProfileClick={handleProfileClick} />
      
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

        {/* Background Check Section */}
        {!isEditing && (
          <div className="space-y-6 pt-6 lg:pt-8">
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

            {/* Get Verified Card */}
            <Card className="p-6 lg:p-8 bg-gradient-to-br from-primary/5 via-surface to-surface border border-primary/20 hover:shadow-lg transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-center lg:text-left text-center space-y-4 lg:space-y-0 lg:space-x-6">
                <div className="flex-shrink-0 flex justify-center lg:justify-start">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-primary flex items-center justify-center shadow-lg">
                    <Check className="h-8 w-8 lg:h-10 lg:w-10 text-primary-foreground" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg lg:text-xl font-bold text-foreground mb-2">Get Verified</h3>
                  <p className="text-sm lg:text-base text-muted-foreground mb-4">
                    Complete the following steps to check eligibility and boost your credibility
                  </p>
                  <ul className="space-y-2 lg:space-y-3 mb-6 lg:mb-0">
                    <li className="flex items-center gap-3 text-sm lg:text-base text-foreground">
                      <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></div>
                      <span>Credit Check</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm lg:text-base text-foreground">
                      <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></div>
                      <span>Upload Document</span>
                    </li>
                  </ul>
                </div>
                <div className="lg:flex-shrink-0">
                  <Button className="w-full lg:w-auto lg:px-8 h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl">
                    Perform background check
                  </Button>
                </div>
              </div>
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
      
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <AuthDrawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} />
    </div>
  )
}
