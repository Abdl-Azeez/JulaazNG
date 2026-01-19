import { useState } from 'react'
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
import { useRoleStore, type RoleType, type UserRole } from '@/shared/store/role.store'
import { findSampleUser } from '@/__mocks__/data/users.mock'
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'

interface ModalState {
  backgroundLocation?: Location
  intendedDestination?: string
  modal?: boolean
}

export function PasswordModal() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()
  const modalState = (location.state as ModalState | undefined) ?? undefined
  const backgroundLocation = modalState?.backgroundLocation
  const intendedDestination = modalState?.intendedDestination
  const { login } = useAuthStore()

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
    navigate(ROUTES.LOGIN, {
      state: {
        backgroundLocation,
        intendedDestination,
      },
      replace: true,
    })
  }

  const phone = searchParams.get('phone') || ''
  const email = searchParams.get('email') || ''
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { setRoles, setActiveRole, openRoleSwitcher } = useRoleStore()

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

    // Get intended destination from state or sessionStorage
    const finalIntendedDestination = intendedDestination || sessionStorage.getItem('intendedDestination')
    if (finalIntendedDestination) {
      sessionStorage.removeItem('intendedDestination')
    }

    if (resolvedRoles.length === 1) {
      const active = resolvedRoles[0].type
      setActiveRole(active)
      const roleToRoute: Record<RoleType, string> = {
        tenant: ROUTES.HOME,
        landlord: ROUTES.LANDLORD_PROPERTIES,
        realtor: ROUTES.REALTOR_DASHBOARD,
        service_provider: ROUTES.MY_SERVICES,
        artisan: ROUTES.MY_SERVICES,
        property_manager: ROUTES.HOME,
        admin: ROUTES.ADMIN_DASHBOARD,
        handyman: ROUTES.HANDYMAN_DASHBOARD,
        homerunner: ROUTES.HOMERUNNER_DASHBOARD,
        hotel_manager: ROUTES.HOTEL_MANAGER_DASHBOARD,
      }
      
      // For admin, realtor, homerunner, handyman, and hotel_manager, always go to their dashboard
      const forceDashboardRoles: RoleType[] = ['admin', 'realtor', 'homerunner', 'handyman', 'hotel_manager']
      if (forceDashboardRoles.includes(active)) {
        navigate(roleToRoute[active] ?? ROUTES.HOME, { replace: true })
      } else if (finalIntendedDestination && active === 'tenant') {
        // For tenants, navigate to intended destination if available
        navigate(finalIntendedDestination, { replace: true })
      } else {
        navigate(roleToRoute[active] ?? ROUTES.HOME, { replace: true })
      }
    } else {
      openRoleSwitcher()
      // For multi-role users, check if there's an intended destination
      if (finalIntendedDestination) {
        navigate(finalIntendedDestination, { replace: true })
      } else {
        navigate(ROUTES.HOME, { replace: true })
      }
    }
  }

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
            <h1 className="text-2xl font-bold text-foreground text-center">
              Enter Password
            </h1>

            <div className="space-y-2">
              <Label htmlFor="modal-password" className="text-sm font-semibold text-foreground">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="modal-password"
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
              {error && <p className="text-xs text-destructive">{error}</p>}
            </div>

            <Button
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
              onClick={handleContinue}
            >
              Continue
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PasswordModal
