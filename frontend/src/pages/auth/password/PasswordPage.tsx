import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { LoginBanner } from '@/widgets/login-banner'
import { ROUTES } from '@/shared/constants/routes'
import { useAuthStore } from '@/shared/store/auth.store'

export function PasswordPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const phone = searchParams.get('phone') || ''
  const email = searchParams.get('email') || ''
  const role = searchParams.get('role') || 'tenant'
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const validatePassword = () => {
    if (!password.trim()) {
      setError('Password is required')
      return false
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return false
    }
    return true
  }

  const handleContinue = () => {
    if (!validatePassword()) return

    // Mock login - in real app, this would call the API
    const mockUser = {
      id: '1',
      name: 'Abdulraheem Abdulsalam',
      email: email || undefined,
      phone: phone || undefined,
      role: role as 'tenant' | 'landlord',
      isVerified: true,
    }
    login(mockUser, 'mock-token')
    // Navigate to home screen after login
    navigate(ROUTES.HOME)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <LoginBanner />
      
      <div className="flex-1 bg-surface rounded-t-[24px] -mt-6 relative z-10 px-6 py-8">
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-foreground text-center">
            Enter Password
          </h1>

          {/* Password Input */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-semibold text-foreground">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter Your Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (error) setError('')
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleContinue()
                }
              }}
              className={`w-full ${error ? 'border-destructive' : ''}`}
            />
            {error && (
              <p className="text-xs text-destructive">{error}</p>
            )}
          </div>

          {/* Forgot Password Link */}
          <div className="flex justify-end">
            <a
              href={ROUTES.FORGOT_PASSWORD}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Forget Password?
            </a>
          </div>

          {/* Continue Button */}
          <Button
            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
            onClick={handleContinue}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  )
}

