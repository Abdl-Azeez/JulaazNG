import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Building2,
  Users,
  Wallet,
  Calendar,
  Eye,
  FileText,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Bell,
  Settings,
  User,
  LogOut,
} from 'lucide-react'
import { cn } from '@/shared/lib/utils/cn'
import { ROUTES } from '@/shared/constants/routes'
import { useAuthStore } from '@/shared/store/auth.store'
import '@/widgets/admin-sidebar/AdminSidebar.css'

interface RealtorSidebarProps {
  className?: string
}

interface MenuItem {
  icon: React.ElementType
  label: string
  path: string
  group: 'overview' | 'portfolio' | 'operations' | 'account'
}

interface MenuGroup {
  id: string
  title: string
  items: MenuItem[]
}

export function RealtorSidebar({ className }: RealtorSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--admin-sidebar-width',
      isExpanded ? '280px' : '80px'
    )
  }, [isExpanded])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (navRef.current) {
        const activeElement = navRef.current.querySelector('.admin-sidebar__item--active')
        if (activeElement) {
          activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })
        }
      }
    }, 100)
    return () => clearTimeout(timer)
  }, [location.pathname])

  const isActive = (path: string) => {
    if (
      path === ROUTES.REALTOR_DASHBOARD ||
      path === ROUTES.PROFILE ||
      path === ROUTES.SETTINGS ||
      path === ROUTES.NOTIFICATIONS
    ) {
      return location.pathname === path
    }
    return location.pathname.startsWith(path)
  }

  const handleLogout = () => {
    useAuthStore.getState().clearAuth()
    navigate(ROUTES.HOME)
  }

  const menuGroups: MenuGroup[] = [
    {
      id: 'overview',
      title: 'Overview',
      items: [
        {
          icon: LayoutDashboard,
          label: 'Realtor Hub',
          path: ROUTES.REALTOR_DASHBOARD,
          group: 'overview',
        },
        {
          icon: TrendingUp,
          label: 'Performance',
          path: ROUTES.REALTOR_EARNINGS,
          group: 'overview',
        },
      ],
    },
    {
      id: 'portfolio',
      title: 'Portfolio',
      items: [
        {
          icon: Building2,
          label: 'Managed Listings',
          path: ROUTES.REALTOR_PROPERTIES,
          group: 'portfolio',
        },
        {
          icon: Users,
          label: 'Landlords & Tenants',
          path: ROUTES.REALTOR_TENANTS,
          group: 'portfolio',
        },
        {
          icon: Calendar,
          label: 'Viewings & Renewals',
          path: ROUTES.EVENTS,
          group: 'portfolio',
        },
      ],
    },
    {
      id: 'operations',
      title: 'Operations',
      items: [
        {
          icon: Wallet,
          label: 'Income vs Expenses',
          path: ROUTES.REALTOR_EARNINGS,
          group: 'operations',
        },
        {
          icon: FileText,
          label: 'Applications',
          path: ROUTES.LANDLORD_APPLICATIONS,
          group: 'operations',
        },
        {
          icon: Eye,
          label: 'Pipeline',
          path: ROUTES.REALTOR_DASHBOARD,
          group: 'operations',
        },
      ],
    },
    {
      id: 'account',
      title: 'Account',
      items: [
        {
          icon: MessageCircle,
          label: 'Messages',
          path: ROUTES.MESSAGING,
          group: 'account',
        },
        {
          icon: Bell,
          label: 'Notifications',
          path: ROUTES.NOTIFICATIONS,
          group: 'account',
        },
        {
          icon: User,
          label: 'Profile',
          path: ROUTES.PROFILE,
          group: 'account',
        },
        {
          icon: Settings,
          label: 'Settings',
          path: ROUTES.SETTINGS,
          group: 'account',
        },
      ],
    },
  ]

  const handleNavigation = (path: string) => {
    navigate(path)
  }

  return (
    <aside
      className={cn(
        'admin-sidebar',
        isExpanded ? 'admin-sidebar--expanded' : 'admin-sidebar--collapsed',
        className
      )}
      ref={navRef}
    >
      {/* Header */}
      <div className="admin-sidebar__header">
        <div className="admin-sidebar__brand">
          <div className="admin-sidebar__logo">
            <Building2 className="h-6 w-6" />
          </div>
          {isExpanded && (
            <div className="admin-sidebar__brand-text">
              <h2 className="admin-sidebar__title">Realtor Studio</h2>
              <p className="admin-sidebar__subtitle">Rentals & Shortlets</p>
            </div>
          )}
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="admin-sidebar__toggle"
          aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {isExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
      </div>

      {/* Menu */}
      <nav className="admin-sidebar__nav">
        {menuGroups.map((group) => (
          <div key={group.id} className="admin-sidebar__group">
            {isExpanded && <p className="admin-sidebar__group-title">{group.title}</p>}
            <div className="admin-sidebar__group-items">
              {group.items.map((item) => {
                const active = isActive(item.path)
                const Icon = item.icon
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={cn(
                      'admin-sidebar__item',
                      active && 'admin-sidebar__item--active'
                    )}
                  >
                    <span className="admin-sidebar__item-icon-wrapper">
                      <Icon className="admin-sidebar__item-icon" />
                    </span>
                    {isExpanded && <span className="admin-sidebar__item-label">{item.label}</span>}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="admin-sidebar__footer">
        <button
          onClick={handleLogout}
          className="admin-sidebar__item admin-sidebar__item--danger"
        >
          <LogOut className="admin-sidebar__item-icon" />
          {isExpanded && <span className="admin-sidebar__item-label">Log out</span>}
        </button>
      </div>
    </aside>
  )
}

