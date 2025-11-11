import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRoleStore, type RoleType } from '@/shared/store/role.store'
import { ROUTES } from '@/shared/constants/routes'
import toast from 'react-hot-toast'

interface RoleGuardProps {
  readonly children: React.ReactNode
  readonly allowedRoles?: RoleType[]
  readonly disallowedRoles?: RoleType[]
  readonly redirectTo?: string
  readonly allowUnauthenticated?: boolean
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
    if (isBlocked) {
      toast.error(`This page is not accessible in ${activeRole} mode`)
      navigate(redirectTo ?? ROUTES.HOME, { replace: true })
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

