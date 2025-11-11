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
import { findSampleUser } from '@/shared/data/sample-users'

interface ModalState {
  backgroundLocation?: Location
  modal?: boolean
}

export function PasswordModal() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()
  const modalState = (location.state as ModalState | undefined) ?? undefined
  const backgroundLocation = modalState?.backgroundLocation
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

  const phone = searchParams.get('phone') || ''
  const email = searchParams.get('email') || ''
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
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

    if (resolvedRoles.length === 1) {
      const active = resolvedRoles[0].type
      setActiveRole(active)
      const roleToRoute: Record<RoleType, string> = {
        tenant: ROUTES.HOME,
        landlord: ROUTES.LANDLORD_PROPERTIES,
        service_provider: ROUTES.MY_SERVICES,
        artisan: ROUTES.MY_SERVICES,
        property_manager: ROUTES.HOME,
        admin: ROUTES.HOME,
        handyman: ROUTES.MY_SERVICES,
        homerunner: ROUTES.MY_SERVICES,
    }
      const targetRoute = roleToRoute[active] ?? ROUTES.HOME
      
      if (backgroundLocation) {
        navigate(backgroundLocation.pathname + backgroundLocation.search + backgroundLocation.hash, {
          replace: true,
        })
      } else {
        navigate(targetRoute)
      }
    } else {
      openRoleSwitcher()
    if (backgroundLocation) {
      navigate(backgroundLocation.pathname + backgroundLocation.search + backgroundLocation.hash, {
        replace: true,
      })
    } else {
      navigate(ROUTES.HOME)
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
        <div className="flex flex-col items-center gap-6">
          <LogoSvg className="h-40 w-40 md:h-44 md:w-44 text-primary" />
          <div className="w-full space-y-6">
            <h1 className="text-2xl font-bold text-foreground text-center">
              Enter Password
            </h1>

            <div className="space-y-2">
              <Label htmlFor="modal-password" className="text-sm font-semibold text-foreground">
                Password
              </Label>
              <Input
                id="modal-password"
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
