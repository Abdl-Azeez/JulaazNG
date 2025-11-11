import { useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Dialog, DialogContent, DialogHeader } from '@/shared/ui/dialog'
import { Card } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { cn } from '@/shared/lib/utils/cn'
import { ROUTES } from '@/shared/constants/routes'
import { useAuthStore } from '@/shared/store/auth.store'
import { useRoleStore, type RoleType } from '@/shared/store/role.store'
import { Home, Building2, Wrench, ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'

type RoleMeta = {
  label: string
  description: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  to: string
}

const roleCatalog: Record<RoleType, RoleMeta> = {
  tenant: {
    label: 'Tenant',
    description: 'Search, book, and manage your rentals',
    icon: Home,
    to: ROUTES.HOME,
  },
  landlord: {
    label: 'Landlord',
    description: 'List, manage properties and track earnings',
    icon: Building2,
    to: ROUTES.LANDLORD_PROPERTIES,
  },
  service_provider: {
    label: 'Service Provider',
    description: 'Manage service bookings and offers',
    icon: Wrench,
    to: ROUTES.MY_SERVICES,
  },
  artisan: {
    label: 'Artisan',
    description: 'Get matched and deliver artisan jobs',
    icon: Wrench,
    to: ROUTES.MY_SERVICES,
  },
  property_manager: {
    label: 'Property Manager',
    description: 'Manage properties on behalf of landlords',
    icon: ShieldCheck,
    to: ROUTES.HOME,
  },
  admin: {
    label: 'Admin',
    description: 'Administer the platform',
    icon: ShieldCheck,
    to: ROUTES.HOME,
  },
  handyman: {
    label: 'Handyman',
    description: 'Accept and complete handyman requests',
    icon: Wrench,
    to: ROUTES.MY_SERVICES,
  },
  homerunner: {
    label: 'Homerunner',
    description: 'Inspect and guide property viewings',
    icon: Wrench,
    to: ROUTES.MY_SERVICES,
  },
}

export function RoleGateway() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated } = useAuthStore()
  const { roles, activeRole, suggestedRole, isRoleSwitcherOpen, setActiveRole, closeRoleSwitcher } =
    useRoleStore()

  const shouldOpen = useMemo(() => {
    if (!isAuthenticated) return false
    if (isRoleSwitcherOpen) return true
    // If no active role and multiple roles, open
    return activeRole == null && roles.length > 1
  }, [isAuthenticated, isRoleSwitcherOpen, activeRole, roles.length])

  useEffect(() => {
    // Auto-focus suggested role if we ever need that behavior in the future
  }, [suggestedRole])

  const onSelectRole = (role: RoleType) => {
    setActiveRole(role)
    const to = roleCatalog[role]?.to ?? ROUTES.HOME
    // maintain background location state for modal-based routes
    navigate(to, { replace: location.pathname === to })
    toast.success(`Switched to ${roleCatalog[role]?.label ?? 'role'}`)
  }

  if (!shouldOpen) return null

  return (
    <Dialog open={true} onOpenChange={(open) => !open && closeRoleSwitcher()}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <h2 className="text-xl font-semibold">Choose how you want to continue</h2>
          <p className="text-sm text-muted-foreground">
            You have multiple workspaces. Pick a role to tailor your experience.
          </p>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
          {roles.map((r) => {
            const meta = roleCatalog[r.type]
            const Icon = meta?.icon ?? Home
            const isSuggested = suggestedRole === r.type
            return (
              <Card
                key={r.type}
                className={cn(
                  'p-4 border hover:border-primary transition-colors rounded-xl',
                  isSuggested && 'border-primary'
                )}
              >
                <button
                  onClick={() => onSelectRole(r.type)}
                  className="w-full text-left flex items-start gap-3"
                >
                  <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center bg-primary/10 text-primary')}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{meta?.label ?? r.type}</span>
                      {isSuggested && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                          Suggested
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{meta?.description}</p>
                  </div>
                </button>
              </Card>
            )
          })}
        </div>

        <div className="mt-2">
          <Button variant="ghost" className="w-full" onClick={() => closeRoleSwitcher()}>
            Continue later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}


