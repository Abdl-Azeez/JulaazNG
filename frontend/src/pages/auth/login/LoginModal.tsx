import { useState, useEffect } from 'react'
import type { ChangeEvent } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
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

interface ModalState {
  backgroundLocation?: Location
  modal?: boolean
}

export function LoginModal() {
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

  const [inputValue, setInputValue] = useState('')
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone' | null>(null)
  const [error, setError] = useState('')

  // Detect login method based on first character
  useEffect(() => {
    if (inputValue.length > 0) {
      const firstChar = inputValue[0]
      if (/[0-9]/.test(firstChar)) {
        setLoginMethod('phone')
      } else if (/[a-zA-Z]/.test(firstChar)) {
        setLoginMethod('email')
      }
    } else {
      setLoginMethod(null)
      setError('')
    }
  }, [inputValue])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    if (error) setError('')
  }

  const validateInput = () => {
    if (!inputValue.trim()) {
      setError('This field is required')
      return false
    }

    if (loginMethod === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(inputValue)) {
        setError('Please enter a valid email address')
        return false
      }
    } else if (loginMethod === 'phone') {
      const phoneRegex = /^[0-9]{10,11}$/
      if (!phoneRegex.test(inputValue.replace(/\s/g, ''))) {
        setError('Please enter a valid 10 or 11 digit phone number')
        return false
      }
    }

    return true
  }

  const preserveState = modalState ? { ...modalState } : backgroundLocation ? { backgroundLocation, modal: true } : undefined

  const handleContinue = () => {
    if (!validateInput()) return

    if (loginMethod === 'email') {
      navigate(`${ROUTES.LOGIN_PASSWORD}?email=${encodeURIComponent(inputValue)}`, {
        state: preserveState,
      })
    } else if (loginMethod === 'phone') {
      navigate(`${ROUTES.LOGIN_PASSWORD}?phone=${encodeURIComponent(inputValue)}`, {
        state: preserveState,
      })
    }
  }

  const getFieldLabel = () => {
    if (loginMethod === 'email') return 'Email Address'
    if (loginMethod === 'phone') return 'Phone Number'
    return 'Email/Phone'
  }

  const getPlaceholder = () => {
    if (loginMethod === 'email') return 'Enter your email address'
    if (loginMethod === 'phone') return 'Enter your phone number'
    return 'Enter your email or phone number'
  }

  return (
    <Dialog open onOpenChange={(open) => {
      if (!open) {
        handleClose()
      }
    }}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto p-6">
        <div className="flex flex-col items-center gap-6">
          <LogoSvg className="h-40 w-40 md:h-44 md:w-44 text-primary" />
          <div className="w-full space-y-6">
            <h1 className="text-2xl font-bold text-foreground text-center">
              Login to your Account
            </h1>

            {/* Email/Phone Input */}
            <div className="space-y-2">
              <Label htmlFor="modal-login-input" className="text-sm font-semibold text-foreground">
                {getFieldLabel()}
              </Label>
              <p className="text-xs text-muted-foreground">
                You can sign in with your registered email address or mobile number.
              </p>
              {loginMethod === 'phone' ? (
                <div className="flex gap-2">
                  <div className="flex items-center gap-2 px-3 border border-input rounded-lg bg-background">
                    <span className="text-2xl">🇳🇬</span>
                    <span className="text-sm font-medium">+234</span>
                  </div>
                  <Input
                    id="modal-login-input"
                    type="tel"
                    placeholder={getPlaceholder()}
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleContinue()
                    }}
                    className={`flex-1 ${error ? 'border-destructive' : ''}`}
                  />
                </div>
              ) : (
                <Input
                  id="modal-login-input"
                  type={loginMethod === 'email' ? 'email' : 'text'}
                  placeholder={getPlaceholder()}
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleContinue()
                  }}
                  className={`w-full ${error ? 'border-destructive' : ''}`}
                />
              )}
              {error && <p className="text-xs text-destructive">{error}</p>}
            </div>

            {/* Continue Button */}
            <Button
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
              onClick={handleContinue}
            >
              Continue
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

export default LoginModal
