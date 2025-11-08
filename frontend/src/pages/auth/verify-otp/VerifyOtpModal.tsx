import { useState, useRef, useEffect } from 'react'
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
import { useAuthStore } from '@/shared/store/auth.store'

interface ModalState {
  backgroundLocation?: Location
  modal?: boolean
}

export function VerifyOtpModal() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()
  const modalState = (location.state as ModalState | undefined) ?? undefined
  const backgroundLocation = modalState?.backgroundLocation
  const { login } = useAuthStore()

  const preserveState = modalState ? { ...modalState } : backgroundLocation ? { backgroundLocation, modal: true } : undefined

  const handleClose = () => {
    if (backgroundLocation) {
      navigate(backgroundLocation.pathname + backgroundLocation.search + backgroundLocation.hash, {
        replace: true,
      })
    } else {
      navigate(ROUTES.HOME, { replace: true })
    }
  }

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
    if (value && !/^[0-9]$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    setError('')

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

    await new Promise((resolve) => setTimeout(resolve, 800))

    const mockUser = {
      id: '1',
      name: 'New User',
      email: email,
      phone: phone,
      role: role as 'tenant' | 'landlord',
      isVerified: true,
    }
    login(mockUser, 'mock-token')

    if (backgroundLocation) {
      navigate(backgroundLocation.pathname + backgroundLocation.search + backgroundLocation.hash, {
        replace: true,
      })
    } else {
      navigate(ROUTES.HOME)
    }
  }

  const handleResend = () => {
    setOtp(['', '', '', '', '', ''])
    setTimer(60)
    setCanResend(false)
    setError('')
    inputRefs.current[0]?.focus()
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
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold text-foreground">
                Verify Your Email
              </h1>
              <p className="text-sm text-muted-foreground">
                We've sent a 6-digit verification code to
              </p>
              <p className="text-sm font-semibold text-foreground">{email}</p>
            </div>

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
              {error && <p className="text-xs text-destructive text-center">{error}</p>}
            </div>

            <div className="text-center space-y-2">
              {!canResend ? (
                <p className="text-sm text-muted-foreground">
                  Resend code in {timer}s
                </p>
              ) : (
                <Button variant="link" className="text-primary" onClick={handleResend}>
                  Resend Code
                </Button>
              )}
            </div>

            <Button
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
              onClick={handleVerify}
              disabled={isVerifying || otp.join('').length !== 6}
            >
              {isVerifying ? 'Verifying...' : 'Verify Email'}
            </Button>

            <div className="text-center">
              <Button
                variant="link"
                className="text-sm text-muted-foreground"
                onClick={() => navigate(ROUTES.SIGNUP, { state: preserveState })}
              >
                Change email address
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}


export default VerifyOtpModal
