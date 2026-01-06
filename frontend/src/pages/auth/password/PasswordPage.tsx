import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { LoginBanner } from '@/widgets/login-banner'
import { ROUTES } from '@/shared/constants/routes'
import { useAuthStore } from '@/shared/store/auth.store'
import { Card } from '@/shared/ui/card'
import LogoSvg from '@/assets/images/logo.svg?react'
import { useRoleStore, type UserRole, type RoleType } from '@/shared/store/role.store'
import { findSampleUser } from '@/__mocks__/data/users.mock'
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'

export function PasswordPage() {
  const [isDesktop, setIsDesktop] = useState(false)

  // Detect screen size
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 768)
    }
    checkDesktop()
    window.addEventListener('resize', checkDesktop)
    return () => window.removeEventListener('resize', checkDesktop)
  }, [])
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const { setRoles, setActiveRole, openRoleSwitcher } = useRoleStore()
  const phone = searchParams.get('phone') || ''
  const email = searchParams.get('email') || ''
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

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

    const identifier = email || phone
    if (!identifier) {
      setError('No email or phone provided')
      return
    }

    const sampleUser = findSampleUser(identifier)

    if (!sampleUser) {
      setError('No matching account. Use one of the demo credentials.')
      return
    }

    if (sampleUser.password !== password) {
      setError('Incorrect password for this account.')
      return
    }

    const preferredRole =
      sampleUser.preferredRole ??
      sampleUser.roles.find((r) => r.lastUsed)?.type ??
      sampleUser.roles[0]?.type ??
      'tenant'

    login(
      {
        id: sampleUser.id,
        name: sampleUser.name,
        email: sampleUser.email,
        phone: sampleUser.phone,
        role: preferredRole,
        roles: sampleUser.roles.map((r) => r.type),
      isVerified: true,
      },
      `${sampleUser.id}-token`
    )

    const resolvedRoles: UserRole[] = sampleUser.roles.length
      ? sampleUser.roles
      : [
          {
            type: preferredRole,
            priority: 'primary',
            lastUsed: true,
          },
        ]

    setRoles(resolvedRoles)

    // Get intended destination from location state or sessionStorage
    const locationState = (window.history.state?.usr as { intendedDestination?: string }) ?? {}
    const intendedDestination = locationState.intendedDestination || sessionStorage.getItem('intendedDestination')
    if (intendedDestination) {
      sessionStorage.removeItem('intendedDestination')
    }

    if (resolvedRoles.length === 1) {
      const active = resolvedRoles[0].type
      setActiveRole(active)
      const roleToRoute: Record<RoleType, string> = {
        tenant: ROUTES.HOME,
        landlord: ROUTES.LANDLORD_PROPERTIES,
        service_provider: ROUTES.MY_SERVICES,
        artisan: ROUTES.MY_SERVICES,
        property_manager: ROUTES.HOME,
        admin: ROUTES.ADMIN_DASHBOARD,
        handyman: ROUTES.HANDYMAN_DASHBOARD,
        homerunner: ROUTES.HOMERUNNER_DASHBOARD,
      }
      
      // For admin, homerunner, and handyman, always go to their dashboard
      const forceDashboardRoles: RoleType[] = ['admin', 'homerunner', 'handyman']
      if (forceDashboardRoles.includes(active)) {
        navigate(roleToRoute[active] ?? ROUTES.HOME, { replace: true })
      } else if (intendedDestination && active === 'tenant') {
        // For tenants, navigate to intended destination if available
        navigate(intendedDestination, { replace: true })
      } else {
        navigate(roleToRoute[active] ?? ROUTES.HOME, { replace: true })
      }
    } else {
      openRoleSwitcher()
      // For multi-role users, check if there's an intended destination
      if (intendedDestination) {
        navigate(intendedDestination, { replace: true })
      } else {
        navigate(ROUTES.HOME, { replace: true })
      }
    }
  }

  const handleGoBack = () => {
    navigate(ROUTES.LOGIN, { replace: true })
  }

  // Desktop Modal Layout
  if (isDesktop) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-6">
        <Card className="w-full max-w-md p-8 shadow-2xl">
          <div className="flex justify-center mb-6">
            <LogoSvg className="h-40 w-40 md:h-44 md:w-44 text-primary" />
          </div>
          
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
            <h1 className="text-2xl font-bold text-foreground text-center">
              Enter Password
            </h1>

            {/* Password Input */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-foreground">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
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
                  className={`w-full pr-10 ${error ? 'border-destructive' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
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
        </Card>
      </div>
    )
  }

  // Mobile Drawer Layout
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <LoginBanner />
      
      <div className="flex-1 bg-surface rounded-t-[24px] -mt-6 relative z-10 px-6 py-8">
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
          <h1 className="text-2xl font-bold text-foreground text-center">
            Enter Password
          </h1>

          {/* Password Input */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-semibold text-foreground">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
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
                className={`w-full pr-10 ${error ? 'border-destructive' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
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

