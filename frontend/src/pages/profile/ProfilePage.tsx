import { useState, useRef } from 'react'
import { ArrowLeft, Check, Home, MessageCircle, MapPin, LogOut, Settings, Camera, X, Save } from 'lucide-react'
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
import { useAuthStore } from '@/shared/store/auth.store'
import { useNavigate } from 'react-router-dom'
import LogoSvg from '@/assets/images/logo.svg?react'
import { ROUTES } from '@/shared/constants/routes'
import { LogoLoader } from '@/widgets/logo-loader'
import toast from 'react-hot-toast'

export function ProfilePage() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  
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

  const handleLogout = () => {
    logout()
    navigate(ROUTES.HOME)
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
      toast.error('Failed to update profile')
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
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-surface">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            className="bg-icon-bg"
            onClick={() => navigate(ROUTES.HOME)}
            aria-label="Go back"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="flex-1 flex justify-center">
            <LogoSvg className="h-8 w-auto text-primary" />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="bg-icon-bg"
            onClick={() => navigate(ROUTES.SETTINGS)}
            aria-label="Settings"
          >
            <Settings className="h-6 w-6" />
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6 pb-24">
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-surface flex items-center justify-center overflow-hidden border-2 border-border">
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
        <div className="space-y-3">
          {isEditing ? (
            // Edit Mode
            <>
              <Card className="p-4 bg-surface border-0">
                <Label className="text-xs text-muted-foreground mb-2 block">Full Name</Label>
                <Input
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="font-semibold"
                />
              </Card>

              <Card className="p-4 bg-surface border-0">
                <Label className="text-xs text-muted-foreground mb-2 block">Email Address</Label>
                <Input
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                  className="font-semibold"
                />
              </Card>

              <Card className="p-4 bg-surface border-0">
                <Label className="text-xs text-muted-foreground mb-2 block">Phone Number</Label>
                <Input
                  type="tel"
                  value={editData.phone}
                  onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                  className="font-semibold"
                />
              </Card>

              <Card className="p-4 bg-surface border-0">
                <Label className="text-xs text-muted-foreground mb-2 block">Date of Birth</Label>
                <Input
                  type="date"
                  value={editData.dateOfBirth}
                  onChange={(e) => setEditData({ ...editData, dateOfBirth: e.target.value })}
                  className="font-semibold"
                />
              </Card>

              <Card className="p-4 bg-surface border-0">
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

              <Card className="p-4 bg-surface border-0">
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
              <Card className="p-4 bg-surface border-0">
                <p className="text-xs text-muted-foreground mb-1">Full Name</p>
                <p className="font-semibold text-foreground">{profileData.name}</p>
              </Card>

              <Card className="p-4 bg-surface border-0">
                <p className="text-xs text-muted-foreground mb-1">Email Address</p>
                <p className="font-semibold text-foreground">{profileData.email}</p>
              </Card>

              <Card className="p-4 bg-surface border-0">
                <p className="text-xs text-muted-foreground mb-1">Phone Number</p>
                <p className="font-semibold text-foreground">{profileData.phone}</p>
              </Card>

              <Card className="p-4 bg-surface border-0">
                <p className="text-xs text-muted-foreground mb-1">Date of Birth</p>
                <p className="font-semibold text-foreground">
                  {new Date(profileData.dateOfBirth).toLocaleDateString('en-GB')}
                </p>
              </Card>

              <Card className="p-4 bg-surface border-0">
                <p className="text-xs text-muted-foreground mb-1">Gender</p>
                <p className="font-semibold text-foreground capitalize">{profileData.gender}</p>
              </Card>

              <Card className="p-4 bg-surface border-0">
                <p className="text-xs text-muted-foreground mb-1">Nationality</p>
                <p className="font-semibold text-foreground">{profileData.nationality}</p>
              </Card>
            </>
          )}
        </div>

        {/* Background Check Section */}
        {!isEditing && (
          <div className="space-y-4 pt-4">
            <h2 className="text-xl font-bold text-foreground">Background Check</h2>

            {/* Navigation Icons */}
            <div className="flex justify-center gap-8 pb-4">
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
            <Card className="p-6 bg-surface border-0">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                  <Check className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Get Verified</h3>
                <p className="text-sm text-muted-foreground">
                  Complete the following steps to check eligibility
                </p>
                <ul className="space-y-2 text-left w-full">
                  <li className="flex items-center gap-2 text-sm text-primary">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span>Credit Check</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-primary">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span>Upload Document</span>
                  </li>
                </ul>
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mt-4">
                  Perform background check
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Logout Button */}
        {!isEditing && (
          <div className="pt-4">
            <Button
              variant="outline"
              className="w-full h-12 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        )}
      </div>

      {/* Fixed Edit/Save/Cancel Buttons */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-surface border-t">
        {isEditing ? (
          <div className="flex gap-3">
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
            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </Button>
        )}
      </div>
    </div>
  )
}
