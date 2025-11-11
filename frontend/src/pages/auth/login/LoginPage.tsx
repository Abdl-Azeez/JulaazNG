import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { LoginBanner } from '@/widgets/login-banner'
import { ROUTES } from '@/shared/constants/routes'
import { Card } from '@/shared/ui/card'
import LogoSvg from '@/assets/images/logo.svg?react'
import { sampleUsers } from '@/shared/data/sample-users'
import {
  Dialog,
  DialogContent,
} from '@/shared/ui/dialog'

export function LoginPage() {
  const [isDesktop, setIsDesktop] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const [inputValue, setInputValue] = useState('')
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone' | null>(null)
  const [error, setError] = useState('')

  // Detect screen size
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 768)
    }
    checkDesktop()
    window.addEventListener('resize', checkDesktop)
    return () => window.removeEventListener('resize', checkDesktop)
  }, [])

  // Check if we should show as modal (desktop) or full page
  const shouldShowAsModal = isDesktop
  const backgroundLocation = (location.state as { backgroundLocation?: Location })?.backgroundLocation

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleContinue = () => {
    if (!validateInput()) return

    if (loginMethod === 'email') {
      navigate(`${ROUTES.LOGIN_PASSWORD}?email=${encodeURIComponent(inputValue)}`)
    } else if (loginMethod === 'phone') {
      navigate(`${ROUTES.LOGIN_PASSWORD}?phone=${encodeURIComponent(inputValue)}`)
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

  const renderDemoCredentials = () => (
    <div className="rounded-xl border border-dashed border-muted-foreground/40 bg-muted/30 p-4 text-sm">
      <h2 className="font-semibold text-foreground mb-2">Demo Accounts</h2>
      <ul className="space-y-2 text-muted-foreground">
        {sampleUsers.map((demo) => (
          <li key={demo.id} className="leading-snug">
            <span className="font-medium text-foreground">{demo.name}</span> ·{' '}
            <span>{demo.email}</span> · <span>{demo.password}</span>
            <br />
            <span className="capitalize text-xs">
              Roles: {demo.roles.map((role) => role.type.replace(/_/g, ' ')).join(', ')}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )

  // Desktop Modal Layout
  if (shouldShowAsModal) {
    const loginContent = (
      <div className="space-y-6">
        <div className="flex justify-center mb-6">
          <LogoSvg className="h-40 w-40 md:h-44 md:w-44 text-primary" />
        </div>
        
        <h1 className="text-2xl font-bold text-foreground text-center">
          Login to your Account
        </h1>

        {/* Email/Phone Input */}
        <div className="space-y-2">
          <Label htmlFor="login-input" className="text-sm font-semibold text-foreground">
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
                id="login-input"
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
              id="login-input"
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
          {error && (
            <p className="text-xs text-destructive">{error}</p>
          )}
        </div>

        {/* Login Button */}
        <Button
          className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
          onClick={handleContinue}
        >
          Continue
        </Button>

        {/* Sign Up Link */}
        <p className="text-sm text-center text-muted-foreground">
          Don't have an account?{' '}
          <button
            onClick={() => navigate(ROUTES.SIGNUP)}
            className="font-semibold text-primary hover:underline"
          >
            Sign up
          </button>
        </p>

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

        {renderDemoCredentials()}
      </div>
    )

    return (
      <Dialog 
        open={true} 
        onOpenChange={(open) => {
          if (!open) {
            // Navigate back to previous page or home
            if (backgroundLocation) {
              navigate(backgroundLocation.pathname + backgroundLocation.search, { replace: true })
            } else {
              navigate(ROUTES.HOME, { replace: true })
            }
          }
        }}
      >
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto [&>button]:hidden">
          {loginContent}
        </DialogContent>
        <style>{`
          [data-radix-dialog-overlay] {
            backdrop-filter: blur(8px) !important;
            -webkit-backdrop-filter: blur(8px) !important;
            background-color: hsl(var(--foreground) / 0.5) !important;
          }
        `}</style>
      </Dialog>
    )
  }

  // Mobile Drawer Layout
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <LoginBanner />
      
      <div className="flex-1 bg-surface rounded-t-[24px] -mt-6 relative z-10 px-6 py-8">
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-foreground text-center">
            Login to your Account
          </h1>

          {/* Email/Phone Input */}
          <div className="space-y-2">
            <Label htmlFor="login-input" className="text-sm font-semibold text-foreground">
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
                id="login-input"
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
                id="login-input"
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
            {error && (
              <p className="text-xs text-destructive">{error}</p>
            )}
          </div>

          {/* Login Button */}
          <Button
            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
            onClick={handleContinue}
          >
            Continue
          </Button>

          {/* Sign Up Link */}
          <p className="text-sm text-center text-muted-foreground">
            Don't have an account?{' '}
            <button
              onClick={() => navigate(ROUTES.SIGNUP)}
              className="font-semibold text-primary hover:underline"
            >
              Sign up
            </button>
          </p>

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

          {renderDemoCredentials()}
        </div>
      </div>
    </div>
  )
}

