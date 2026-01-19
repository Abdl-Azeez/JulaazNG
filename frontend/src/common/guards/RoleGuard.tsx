import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRoleStore, type RoleType } from '@/shared/store/role.store'
import { ROUTES } from '@/shared/constants/routes'

interface RoleGuardProps {
  readonly children: React.ReactNode
  readonly allowedRoles?: RoleType[]
  readonly disallowedRoles?: RoleType[]
  readonly redirectTo?: string
  readonly allowUnauthenticated?: boolean
}

// Map roles to their default dashboard routes
const roleToDashboard: Record<RoleType, string> = {
  tenant: ROUTES.HOME,
  landlord: ROUTES.LANDLORD_PROPERTIES,
  realtor: ROUTES.REALTOR_DASHBOARD,
  service_provider: ROUTES.HANDYMAN_DASHBOARD,
  artisan: ROUTES.HANDYMAN_DASHBOARD,
  property_manager: ROUTES.HOME,
  admin: ROUTES.ADMIN_DASHBOARD,
  handyman: ROUTES.HANDYMAN_DASHBOARD,
  homerunner: ROUTES.HOMERUNNER_DASHBOARD,
  hotel_manager: ROUTES.HOTEL_MANAGER_DASHBOARD,
}

export function RoleGuard({
  children,
  allowedRoles,
  disallowedRoles,
  redirectTo,
  allowUnauthenticated = false,
}: RoleGuardProps) {
  const navigate = useNavigate()
  const { activeRole } = useRoleStore()

  const isBlocked =
    (disallowedRoles && activeRole && disallowedRoles.includes(activeRole)) ||
    (allowedRoles && activeRole && !allowedRoles.includes(activeRole))

  useEffect(() => {
    if (isBlocked && activeRole) {
      // Use custom redirectTo if provided, otherwise use role-specific dashboard
      const targetRoute = redirectTo ?? roleToDashboard[activeRole] ?? ROUTES.HOME
      navigate(targetRoute, { replace: true })
    }
  }, [activeRole, disallowedRoles, allowedRoles, isBlocked, navigate, redirectTo])

  if (!activeRole) {
    return allowUnauthenticated ? <>{children}</> : null
  }

  if (isBlocked) {
    return null
  }

  if (allowedRoles && !allowedRoles.includes(activeRole)) {
    return null
  }

  return <>{children}</>
}

