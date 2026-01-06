import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { LoginBanner } from '@/widgets/login-banner'
import { ROUTES } from '@/shared/constants/routes'
import { Card } from '@/shared/ui/card'
import LogoSvg from '@/assets/images/logo.svg?react'
import { ArrowLeft, Mail, Phone } from 'lucide-react'
import toast from 'react-hot-toast'

export function ForgotPasswordPage() {
  const [isDesktop, setIsDesktop] = useState(false)
  const navigate = useNavigate()

  // Detect screen size
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 768)
    }
    checkDesktop()
    window.addEventListener('resize', checkDesktop)
    return () => window.removeEventListener('resize', checkDesktop)
  }, [])

  const [contactMethod, setContactMethod] = useState<'email' | 'phone'>('email')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone: string) => {
    const phoneRegex = /^(\+?234|0)[789]\d{9}$/
    return phoneRegex.test(phone.replace(/\s/g, ''))
  }

  const handleSendResetLink = async () => {
    setError('')

    if (contactMethod === 'email') {
      if (!email.trim()) {
        setError('Email is required')
        return
      }
      if (!validateEmail(email)) {
        setError('Please enter a valid email address')
        return
      }
    } else {
      if (!phone.trim()) {
        setError('Phone number is required')
        return
      }
      if (!validatePhone(phone)) {
        setError('Please enter a valid Nigerian phone number')
        return
      }
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast.success(
        `Password reset link sent to your ${contactMethod === 'email' ? 'email' : 'phone'}!`,
        {
          duration: 4000,
          icon: '✅',
        }
      )
      
      // Navigate to reset password page with token (in real app, user would click link in email/SMS)
      const resetToken = 'demo-reset-token-' + Date.now()
      navigate(`${ROUTES.RESET_PASSWORD}?token=${resetToken}&${contactMethod}=${contactMethod === 'email' ? email : phone}`)
    }, 1500)
  }

  const handleGoBack = () => {
    navigate(ROUTES.LOGIN, { replace: true })
  }

  const renderContent = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
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
          Forgot Password?
        </h1>
        <p className="text-sm text-muted-foreground text-center">
          No worries, we'll send you reset instructions
        </p>
      </div>

      {/* Contact Method Selection */}
      <div className="space-y-4">
        <Label className="text-sm font-semibold text-foreground">
          How would you like to receive the reset link?
        </Label>
        <div className="flex gap-3">
          <Button
            type="button"
            variant={contactMethod === 'email' ? 'default' : 'outline'}
            className="flex-1 h-12"
            onClick={() => {
              setContactMethod('email')
              setError('')
            }}
          >
            <Mail className="h-4 w-4 mr-2" />
            Email
          </Button>
          <Button
            type="button"
            variant={contactMethod === 'phone' ? 'default' : 'outline'}
            className="flex-1 h-12"
            onClick={() => {
              setContactMethod('phone')
              setError('')
            }}
          >
            <Phone className="h-4 w-4 mr-2" />
            Phone
          </Button>
        </div>
      </div>

      {/* Email Input */}
      {contactMethod === 'email' && (
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-semibold text-foreground">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (error) setError('')
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSendResetLink()
              }
            }}
            className={`w-full ${error ? 'border-destructive' : ''}`}
          />
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
      )}

      {/* Phone Input */}
      {contactMethod === 'phone' && (
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-semibold text-foreground">
            Phone Number
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="0801 234 5678"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value)
              if (error) setError('')
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSendResetLink()
              }
            }}
            className={`w-full ${error ? 'border-destructive' : ''}`}
          />
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
      )}

      {/* Send Reset Link Button */}
      <Button
        className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
        onClick={handleSendResetLink}
        disabled={isLoading}
      >
        {isLoading ? 'Sending...' : 'Send Reset Link'}
      </Button>

      {/* Back to Login Link */}
      <div className="text-center">
        <button
          onClick={() => navigate(ROUTES.LOGIN)}
          className="text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          Back to Login
        </button>
      </div>
    </div>
  )

  // Desktop Modal Layout
  if (isDesktop) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-6">
        <Card className="w-full max-w-md p-8 shadow-2xl">
          <div className="flex justify-center mb-6">
            <LogoSvg className="h-40 w-40 md:h-44 md:w-44 text-primary" />
          </div>
          {renderContent()}
        </Card>
      </div>
    )
  }

  // Mobile Drawer Layout
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <LoginBanner />
      
      <div className="flex-1 bg-surface rounded-t-[24px] -mt-6 relative z-10 px-6 py-8">
        {renderContent()}
      </div>
    </div>
  )
}

export default ForgotPasswordPage
