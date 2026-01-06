import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom'
import type { Location } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
} from '@/shared/ui/dialog'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import LogoSvg from '@/assets/images/logo.svg?react'
import { ROUTES } from '@/shared/constants/routes'
import { ArrowLeft, Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface ModalState {
  backgroundLocation?: Location
  intendedDestination?: string
  modal?: boolean
}

export function ResetPasswordModal() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const modalState = (location.state as ModalState | undefined) ?? undefined
  const backgroundLocation = modalState?.backgroundLocation
  const intendedDestination = modalState?.intendedDestination

  const handleClose = () => {
    if (backgroundLocation) {
      navigate(backgroundLocation.pathname + backgroundLocation.search + backgroundLocation.hash, {
        replace: true,
      })
    } else {
      navigate(ROUTES.HOME, { replace: true })
    }
  }

  const handleGoBack = () => {
    navigate(ROUTES.FORGOT_PASSWORD, {
      state: {
        backgroundLocation,
        intendedDestination,
      },
      replace: true,
    })
  }

  const token = searchParams.get('token') || ''
  const email = searchParams.get('email') || ''
  const phone = searchParams.get('phone') || ''

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Password strength indicators
  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  })

  useEffect(() => {
    if (!token) {
      toast.error('Invalid or missing reset token')
      navigate(ROUTES.FORGOT_PASSWORD, {
        state: {
          backgroundLocation,
          intendedDestination,
          modal: true,
        },
      })
    }
  }, [token, navigate, backgroundLocation, intendedDestination])

  useEffect(() => {
    setPasswordStrength({
      hasMinLength: newPassword.length >= 8,
      hasUpperCase: /[A-Z]/.test(newPassword),
      hasLowerCase: /[a-z]/.test(newPassword),
      hasNumber: /\d/.test(newPassword),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
    })
  }, [newPassword])

  const isPasswordStrong = Object.values(passwordStrength).every((val) => val)

  const handleResetPassword = async () => {
    setError('')

    if (!newPassword.trim()) {
      setError('New password is required')
      return
    }

    if (!isPasswordStrong) {
      setError('Password does not meet all requirements')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast.success('Password reset successful!', {
        duration: 3000,
        icon: '✅',
      })
      
      // Navigate to login modal
      navigate(ROUTES.LOGIN, {
        state: {
          backgroundLocation,
          intendedDestination,
          modal: true,
        },
        replace: true,
      })
    }, 1500)
  }

  const PasswordRequirement = ({ met, text }: { met: boolean; text: string }) => (
    <div className="flex items-center gap-2 text-xs">
      <CheckCircle2
        className={`h-4 w-4 ${met ? 'text-green-500' : 'text-muted-foreground'}`}
      />
      <span className={met ? 'text-foreground' : 'text-muted-foreground'}>
        {text}
      </span>
    </div>
  )

  return (
    <Dialog open onOpenChange={(open) => {
      if (!open) {
        handleClose()
      }
    }}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto p-6">
        <div className="flex flex-col items-center">
          <LogoSvg className="h-40 w-40 md:h-44 md:w-44 text-primary -mt-16" />
          <div className="w-full space-y-6 -mt-8">
            <div className="flex items-center gap-3 w-full">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleGoBack}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground text-center">
                Reset Password
              </h1>
              <p className="text-sm text-muted-foreground text-center">
                {email ? `For ${email}` : phone ? `For ${phone}` : 'Create a new password'}
              </p>
            </div>

            {/* New Password Input */}
            <div className="space-y-2">
              <Label htmlFor="modal-new-password" className="text-sm font-semibold text-foreground">
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="modal-new-password"
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value)
                    if (error) setError('')
                  }}
                  className={`w-full pr-10 ${error ? 'border-destructive' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
                  aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            {newPassword && (
              <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
                <p className="text-xs font-semibold text-foreground mb-2">
                  Password Requirements:
                </p>
                <PasswordRequirement
                  met={passwordStrength.hasMinLength}
                  text="At least 8 characters"
                />
                <PasswordRequirement
                  met={passwordStrength.hasUpperCase}
                  text="One uppercase letter"
                />
                <PasswordRequirement
                  met={passwordStrength.hasLowerCase}
                  text="One lowercase letter"
                />
                <PasswordRequirement
                  met={passwordStrength.hasNumber}
                  text="One number"
                />
                <PasswordRequirement
                  met={passwordStrength.hasSpecialChar}
                  text="One special character"
                />
              </div>
            )}

            {/* Confirm Password Input */}
            <div className="space-y-2">
              <Label htmlFor="modal-confirm-password" className="text-sm font-semibold text-foreground">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="modal-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    if (error) setError('')
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleResetPassword()
                    }
                  }}
                  className={`w-full pr-10 ${error ? 'border-destructive' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {error && <p className="text-xs text-destructive">{error}</p>}
            </div>

            {/* Reset Password Button */}
            <Button
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
              onClick={handleResetPassword}
              disabled={isLoading || !isPasswordStrong}
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </Button>

            {/* Back to Login Link */}
            <div className="text-center">
              <button
                onClick={() => navigate(ROUTES.LOGIN, {
                  state: {
                    backgroundLocation,
                    intendedDestination,
                    modal: true,
                  },
                })}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ResetPasswordModal
