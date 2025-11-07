import { useState } from 'react'
import { ArrowLeft, Save, Eye, EyeOff } from 'lucide-react'
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
import { useNavigate } from 'react-router-dom'
import LogoSvg from '@/assets/images/logo.svg?react'
import { ROUTES } from '@/shared/constants/routes'
import { LogoLoader } from '@/widgets/logo-loader'
import toast from 'react-hot-toast'

export function SettingsPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  
  // Language settings
  const [language, setLanguage] = useState('en')
  
  // Theme settings
  const [theme, setTheme] = useState('naija-fresh')
  
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

  const themes = [
    { value: 'naija-fresh', label: 'Naija Fresh' },
    { value: 'eko-luxe', label: 'Eko Luxe' },
    { value: 'arewa-calm', label: 'Arewa Calm' },
    { value: 'ulo-oma', label: 'Ulo Oma' },
    { value: 'rainy-9ja', label: 'Rainy 9ja' },
    { value: 'ajebo-blend', label: 'Ajebo Blend' },
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
      toast.error('Failed to save settings')
    } finally {
      setIsLoading(false)
    }
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
            onClick={() => navigate(ROUTES.PROFILE)}
            aria-label="Go back"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="flex-1 flex justify-center">
            <LogoSvg className="h-8 w-auto text-primary" />
          </div>
          <div className="w-10" />
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6 pb-24">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>

        {/* Language Settings */}
        <Card className="p-6 bg-surface border-0 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Language</h2>
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
        <Card className="p-6 bg-surface border-0 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Theme</h2>
          <div className="space-y-2">
            <Label htmlFor="theme" className="text-sm text-muted-foreground">
              Choose your app theme
            </Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger id="theme">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                {themes.map((th) => (
                  <SelectItem key={th.value} value={th.value}>
                    {th.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Change Password */}
        <Card className="p-6 bg-surface border-0 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Change Password</h2>
          
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

      {/* Fixed Save Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-surface border-t">
        <Button
          className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground"
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
    </div>
  )
}

