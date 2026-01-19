import { useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Building2,
  Users,
  Wallet,
  Calendar,
  Eye,
  FileText,
  MessageCircle,
  Bell,
  Settings,
  User,
  LogOut,
  X,
} from 'lucide-react'
import { ROUTES } from '@/shared/constants/routes'
import { useAuthStore } from '@/shared/store/auth.store'
import { cn } from '@/shared/lib/utils/cn'

interface RealtorMobileSidebarProps {
  className?: string
  onClose: () => void
}

export function RealtorMobileSidebar({ className, onClose }: RealtorMobileSidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    useAuthStore.getState().clearAuth()
    navigate(ROUTES.HOME)
    onClose()
  }

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path)
  }

  const go = (path: string) => {
    navigate(path)
    onClose()
  }

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-50 w-[80vw] max-w-xs bg-background/95 border-r border-border flex flex-col shadow-2xl',
        'backdrop-blur-xl',
        className
      )}
    >
      {/* Header */}
      <div className="px-4 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-md">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight">Realtor Studio</span>
            <span className="text-[11px] text-muted-foreground uppercase tracking-[0.18em]">
              Rentals &amp; Shortlets
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="h-8 w-8 rounded-full flex items-center justify-center border border-border bg-background hover:bg-muted transition-colors"
          aria-label="Close menu"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        <div className="space-y-2">
          <p className="px-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.18em]">
            Overview
          </p>
          <div className="space-y-1">
            <button
              onClick={() => go(ROUTES.REALTOR_DASHBOARD)}
              className={cn(
                'w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm',
                isActive(ROUTES.REALTOR_DASHBOARD)
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-muted-foreground hover:bg-muted'
              )}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Realtor Hub</span>
            </button>
            <button
              onClick={() => go(ROUTES.REALTOR_EARNINGS)}
              className={cn(
                'w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm',
                isActive(ROUTES.REALTOR_EARNINGS)
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-muted-foreground hover:bg-muted'
              )}
            >
              <Wallet className="h-4 w-4" />
              <span>Performance</span>
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <p className="px-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.18em]">
            Portfolio
          </p>
          <div className="space-y-1">
            <button
              onClick={() => go(ROUTES.REALTOR_PROPERTIES)}
              className={cn(
                'w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm',
                isActive(ROUTES.REALTOR_PROPERTIES)
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-muted-foreground hover:bg-muted'
              )}
            >
              <Building2 className="h-4 w-4" />
              <span>Managed Listings</span>
            </button>
            <button
              onClick={() => go(ROUTES.REALTOR_TENANTS)}
              className={cn(
                'w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm',
                isActive(ROUTES.REALTOR_TENANTS)
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-muted-foreground hover:bg-muted'
              )}
            >
              <Users className="h-4 w-4" />
              <span>Landlords & Tenants</span>
            </button>
            <button
              onClick={() => go(ROUTES.EVENTS)}
              className={cn(
                'w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm',
                isActive(ROUTES.EVENTS)
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-muted-foreground hover:bg-muted'
              )}
            >
              <Calendar className="h-4 w-4" />
              <span>Viewings & Renewals</span>
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <p className="px-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.18em]">
            Operations
          </p>
          <div className="space-y-1">
            <button
              onClick={() => go(ROUTES.REALTOR_EARNINGS)}
              className={cn(
                'w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm',
                isActive(ROUTES.REALTOR_EARNINGS)
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-muted-foreground hover:bg-muted'
              )}
            >
              <Wallet className="h-4 w-4" />
              <span>Income vs Expenses</span>
            </button>
            <button
              onClick={() => go(ROUTES.LANDLORD_APPLICATIONS)}
              className={cn(
                'w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm',
                isActive(ROUTES.LANDLORD_APPLICATIONS)
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-muted-foreground hover:bg-muted'
              )}
            >
              <FileText className="h-4 w-4" />
              <span>Applications</span>
            </button>
            <button
              onClick={() => go(ROUTES.REALTOR_DASHBOARD)}
              className={cn(
                'w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm',
                isActive(ROUTES.REALTOR_DASHBOARD)
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-muted-foreground hover:bg-muted'
              )}
            >
              <Eye className="h-4 w-4" />
              <span>Pipeline</span>
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <p className="px-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.18em]">
            Account
          </p>
          <div className="space-y-1">
            <button
              onClick={() => go(ROUTES.MESSAGING)}
              className={cn(
                'w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm',
                isActive(ROUTES.MESSAGING)
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-muted-foreground hover:bg-muted'
              )}
            >
              <MessageCircle className="h-4 w-4" />
              <span>Messages</span>
            </button>
            <button
              onClick={() => go(ROUTES.NOTIFICATIONS)}
              className={cn(
                'w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm',
                isActive(ROUTES.NOTIFICATIONS)
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-muted-foreground hover:bg-muted'
              )}
            >
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
            </button>
            <button
              onClick={() => go(ROUTES.PROFILE)}
              className={cn(
                'w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm',
                isActive(ROUTES.PROFILE)
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-muted-foreground hover:bg-muted'
              )}
            >
              <User className="h-4 w-4" />
              <span>Profile</span>
            </button>
            <button
              onClick={() => go(ROUTES.SETTINGS)}
              className={cn(
                'w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm',
                isActive(ROUTES.SETTINGS)
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-muted-foreground hover:bg-muted'
              )}
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-border flex items-center justify-between">
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 text-sm text-destructive hover:text-destructive/80"
        >
          <LogOut className="h-4 w-4" />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  )
}

