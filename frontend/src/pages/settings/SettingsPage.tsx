import { useState } from 'react'
import { Save, Eye, EyeOff } from 'lucide-react'
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
import { SharedLayout } from '@/widgets/shared-layout'
import { AuthDialog } from '@/widgets/auth-dialog'
import { useThemeStore, themes } from '@/shared/store/theme.store'
import { LogoLoader } from '@/widgets/logo-loader'
import toast from 'react-hot-toast'

export function SettingsPage() {
  const { theme, setTheme: setThemeStore } = useThemeStore()
  const [isLoading, setIsLoading] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  
  // Language settings
  const [language, setLanguage] = useState('en')
  
  // Handle theme change
  const handleThemeChange = (newTheme: string) => {
    setThemeStore(newTheme as any)
  }
  
  // Password change
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  // Errors
  const [errors, setErrors] = useState<{
    currentPassword?: string
    newPassword?: string
    confirmPassword?: string
  }>({})

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'yo', label: 'Yoruba' },
    { value: 'ha', label: 'Hausa' },
    { value: 'ig', label: 'Igbo' },
  ]


  const validatePasswordChange = () => {
    const newErrors: typeof errors = {}

    if (currentPassword || newPassword || confirmPassword) {
      if (!currentPassword) {
        newErrors.currentPassword = 'Current password is required'
      }

      if (!newPassword) {
        newErrors.newPassword = 'New password is required'
      } else if (newPassword.length < 8) {
        newErrors.newPassword = 'Password must be at least 8 characters'
      }

      if (!confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password'
      } else if (newPassword !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    // Validate password change if any password field is filled
    if (currentPassword || newPassword || confirmPassword) {
      if (!validatePasswordChange()) {
        return
      }
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Save settings (language, theme, password if changed)
      // In real app, make API call here
      
      toast.success('Settings saved successfully!')
      
      // Clear password fields after successful change
      if (currentPassword || newPassword || confirmPassword) {
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        toast.success('Password changed successfully!')
      }
    } catch (error) {
      toast.error(`Failed to save settings: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SharedLayout>
      <div className="min-h-screen bg-background">
      
      {/* Settings Header */}
      {/* <header className="sticky top-20 z-40 w-full border-b bg-surface/95 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 lg:px-6 xl:px-8 h-16 lg:h-20 flex items-center justify-between max-w-7xl">
          <div className="flex items-center gap-3">
            <Settings className="h-6 w-6 lg:h-7 lg:w-7 text-primary" />
            <h1 className="text-xl lg:text-2xl font-bold text-foreground">Settings</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="bg-icon-bg text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
            onClick={() => navigate(ROUTES.PROFILE)}
            aria-label="Back to Profile"
          >
            <ArrowLeft className="h-5 w-5 lg:h-6 lg:w-6" />
          </Button>
        </div>
      </header> */}

      <div className="container mx-auto px-4 lg:px-6 xl:px-8 py-6 lg:py-12 space-y-6 lg:space-y-8 pb-24 lg:pb-12 max-w-4xl">
        <div className="space-y-2">
          <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-foreground">Settings</h1>
          <p className="text-sm lg:text-base text-muted-foreground">Manage your account preferences and security</p>
        </div>

        {/* Language Settings */}
        <Card className="p-6 lg:p-8 bg-surface border border-border/50 hover:shadow-lg transition-shadow space-y-4 lg:space-y-6">
          <h2 className="text-lg lg:text-xl font-semibold text-foreground">Language</h2>
          <div className="space-y-2">
            <Label htmlFor="language" className="text-sm text-muted-foreground">
              Select your preferred language
            </Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger id="language">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Theme Settings */}
        <Card className="p-6 lg:p-8 bg-surface border border-border/50 hover:shadow-lg transition-shadow space-y-4 lg:space-y-6">
          <h2 className="text-lg lg:text-xl font-semibold text-foreground">Theme</h2>
          <div className="space-y-4">
            <Label htmlFor="theme" className="text-sm text-muted-foreground">
              Choose your app theme
            </Label>
            <Select value={theme} onValueChange={handleThemeChange}>
              <SelectTrigger id="theme">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                {themes.map((th) => (
                  <SelectItem key={th.id} value={th.id}>
                    <span className="flex items-center gap-2">
                      <span>{th.emoji}</span>
                      <span>{th.displayName}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Theme Preview Grid */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              {themes.map((th) => {
                const isActive = theme === th.id
                const themeColors = {
                  'naija-fresh': 'bg-gradient-to-br from-green-500 to-green-600',
                  'eko-luxe': 'bg-gradient-to-br from-emerald-700 to-teal-800',
                  'arewa-calm': 'bg-gradient-to-br from-amber-600 to-yellow-700',
                  'ulo-oma': 'bg-gradient-to-br from-red-500 to-red-600',
                  'rainy-9ja': 'bg-gradient-to-br from-blue-500 to-sky-600',
                  'ajebo-blend': 'bg-gradient-to-br from-purple-500 to-violet-600',
                }
                
                return (
                  <button
                    key={th.id}
                    onClick={() => handleThemeChange(th.id)}
                    className={`
                      relative p-3 rounded-lg border-2 transition-all
                      ${isActive 
                        ? 'border-primary shadow-md scale-105' 
                        : 'border-border hover:border-primary/50'
                      }
                    `}
                    aria-label={`Select ${th.displayName} theme`}
                  >
                    <div className={`w-full h-16 rounded-md mb-2 ${themeColors[th.id] || 'bg-muted'}`} />
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-lg">{th.emoji}</span>
                      <span className={`text-xs font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                        {th.displayName}
                      </span>
                    </div>
                    {isActive && (
                      <div className="absolute top-1 right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-primary-foreground text-[10px]">✓</span>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </Card>

        {/* Change Password */}
        <Card className="p-6 lg:p-8 bg-surface border border-border/50 hover:shadow-lg transition-shadow space-y-4 lg:space-y-6">
          <h2 className="text-lg lg:text-xl font-semibold text-foreground">Change Password</h2>
          
          {/* Current Password */}
          <div className="space-y-2">
            <Label htmlFor="current-password" className="text-sm text-muted-foreground">
              Current Password
            </Label>
            <div className="relative">
              <Input
                id="current-password"
                type={showCurrentPassword ? 'text' : 'password'}
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value)
                  if (errors.currentPassword) {
                    setErrors({ ...errors, currentPassword: undefined })
                  }
                }}
                className={errors.currentPassword ? 'border-destructive pr-10' : 'pr-10'}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-xs text-destructive">{errors.currentPassword}</p>
            )}
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="new-password" className="text-sm text-muted-foreground">
              New Password
            </Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showNewPassword ? 'text' : 'password'}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => {
                  const value = e.target.value
                  setNewPassword(value)
                  if (errors.newPassword) {
                    setErrors({ ...errors, newPassword: undefined })
                  }
                  // Re-validate confirm password
                  if (confirmPassword && value !== confirmPassword) {
                    setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }))
                  } else if (confirmPassword && value === confirmPassword) {
                    setErrors(prev => ({ ...prev, confirmPassword: undefined }))
                  }
                }}
                className={errors.newPassword ? 'border-destructive pr-10' : 'pr-10'}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-xs text-destructive">{errors.newPassword}</p>
            )}
            {newPassword && newPassword.length < 8 && !errors.newPassword && (
              <p className="text-xs text-muted-foreground">Password must be at least 8 characters</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirm-new-password" className="text-sm text-muted-foreground">
              Confirm New Password
            </Label>
            <div className="relative">
              <Input
                id="confirm-new-password"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => {
                  const value = e.target.value
                  setConfirmPassword(value)
                  // Real-time validation
                  if (newPassword && value && newPassword !== value) {
                    setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }))
                  } else {
                    setErrors(prev => ({ ...prev, confirmPassword: undefined }))
                  }
                }}
                className={errors.confirmPassword ? 'border-destructive pr-10' : 'pr-10'}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-destructive">{errors.confirmPassword}</p>
            )}
            {confirmPassword && newPassword && confirmPassword === newPassword && (
              <p className="text-xs text-success">Passwords match ✓</p>
            )}
          </div>
        </Card>
      </div>

      {/* Fixed Save Button - Mobile Only */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-surface/95 backdrop-blur-sm border-t lg:hidden z-50">
        <Button
          className="w-full max-w-2xl mx-auto h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
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
      </div>

      {/* Desktop Save Button */}
      <div className="hidden lg:flex justify-end max-w-4xl mx-auto px-4 lg:px-6 xl:px-8 pb-8">
        <Button
          size="lg"
          className="h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
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
      </div>
      
      <AuthDialog open={isDrawerOpen} onOpenChange={setIsDrawerOpen} />
      </div>
    </SharedLayout>
  )
}

