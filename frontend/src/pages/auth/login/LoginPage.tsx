import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { RadioGroup, RadioGroupItem } from '@/shared/ui/radio-group'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { LoginBanner } from '@/widgets/login-banner'
import { ROUTES } from '@/shared/constants/routes'

export function LoginPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const role = searchParams.get('role') || 'tenant'
  const [userType, setUserType] = useState<'tenant' | 'landlord'>(role as 'tenant' | 'landlord')
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
      navigate(`${ROUTES.LOGIN_PASSWORD}?email=${encodeURIComponent(inputValue)}&role=${userType}`)
    } else if (loginMethod === 'phone') {
      navigate(`${ROUTES.LOGIN_PASSWORD}?phone=${encodeURIComponent(inputValue)}&role=${userType}`)
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
    <div className="min-h-screen bg-background flex flex-col">
      <LoginBanner />
      
      <div className="flex-1 bg-surface rounded-t-[24px] -mt-6 relative z-10 px-6 py-8">
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-foreground text-center">
            Login to your Account
          </h1>

          {/* User Type Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-foreground">Select User Type</Label>
            <RadioGroup
              value={userType}
              onValueChange={(value) => setUserType(value as 'tenant' | 'landlord')}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2 flex-1">
                <RadioGroupItem value="tenant" id="tenant" />
                <Label htmlFor="tenant" className="font-normal cursor-pointer">
                  Tenant
                </Label>
              </div>
              <div className="flex items-center space-x-2 flex-1">
                <RadioGroupItem value="landlord" id="landlord" />
                <Label htmlFor="landlord" className="font-normal cursor-pointer">
                  Landlord
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Email/Phone Input */}
          <div className="space-y-2">
            <Label htmlFor="login-input" className="text-sm font-semibold text-foreground">
              {getFieldLabel()}
            </Label>
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
    </div>
  )
}

