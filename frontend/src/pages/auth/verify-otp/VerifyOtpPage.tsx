import { useState, useRef, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { LoginBanner } from '@/widgets/login-banner'
import { ROUTES } from '@/shared/constants/routes'
import { useAuthStore } from '@/shared/store/auth.store'

export function VerifyOtpPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const email = searchParams.get('email') || ''
  const phone = searchParams.get('phone') || ''
  const role = searchParams.get('role') || 'tenant'
  
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState('')
  const [timer, setTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus()
  }, [])

  useEffect(() => {
    if (timer > 0 && !canResend) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [timer, canResend])

  const handleOtpChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^[0-9]$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    setError('')

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').trim()
    if (/^[0-9]{6}$/.test(pastedData)) {
      const newOtp = pastedData.split('')
      setOtp(newOtp)
      inputRefs.current[5]?.focus()
    }
  }

  const handleVerify = async () => {
    const otpString = otp.join('')
    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit code')
      return
    }

    setIsVerifying(true)
    setError('')

    // Mock OTP verification - in real app, this would call the API
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock: Accept any 6-digit code for now
    // In real app, verify with backend
    if (otpString.length === 6) {
      const mockUser = {
        id: '1',
        name: 'New User',
        email: email,
        phone: phone,
        role: role as 'tenant' | 'landlord',
        isVerified: true,
      }
      login(mockUser, 'mock-token')
      // Navigate to home screen after successful verification
      navigate(ROUTES.HOME)
    } else {
      setError('Invalid verification code. Please try again.')
      setIsVerifying(false)
    }
  }

  const handleResend = () => {
    // Mock resend OTP - in real app, this would call the API
    setOtp(['', '', '', '', '', ''])
    setTimer(60)
    setCanResend(false)
    setError('')
    inputRefs.current[0]?.focus()
    // In real app, trigger API call to resend OTP
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <LoginBanner />
      
      <div className="flex-1 bg-surface rounded-t-[24px] -mt-6 relative z-10 px-6 py-8">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-foreground">
              Verify Your Email
            </h1>
            <p className="text-sm text-muted-foreground">
              We've sent a 6-digit verification code to
            </p>
            <p className="text-sm font-semibold text-foreground">{email}</p>
          </div>

          {/* OTP Input Fields */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-foreground text-center block">
              Enter Verification Code
            </Label>
            <div className="flex justify-center gap-2" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 text-center text-xl font-semibold"
                />
              ))}
            </div>
            {error && (
              <p className="text-xs text-destructive text-center">{error}</p>
            )}
          </div>

          {/* Resend Code */}
          <div className="text-center space-y-2">
            {!canResend ? (
              <p className="text-sm text-muted-foreground">
                Resend code in {timer}s
              </p>
            ) : (
              <Button
                variant="link"
                className="text-primary"
                onClick={handleResend}
              >
                Resend Code
              </Button>
            )}
          </div>

          {/* Verify Button */}
          <Button
            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
            onClick={handleVerify}
            disabled={isVerifying || otp.join('').length !== 6}
          >
            {isVerifying ? 'Verifying...' : 'Verify Email'}
          </Button>

          {/* Change Email Link */}
          <div className="text-center">
            <Button
              variant="link"
              className="text-sm text-muted-foreground"
              onClick={() => navigate(ROUTES.SIGNUP)}
            >
              Change email address
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

