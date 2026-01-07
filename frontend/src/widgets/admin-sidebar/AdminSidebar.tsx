import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  ShieldCheck, 
  BarChart3, 
  Users, 
  Building2, 
  CheckCircle, 
  FileText, 
  CreditCard, 
  AlertCircle,
  Wrench,
  Settings,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  UserCheck,
  TrendingUp,
  Bell,
  MessageCircle,
  LogOut,
  User
} from 'lucide-react'
import { cn } from '@/shared/lib/utils/cn'
import { ROUTES } from '@/shared/constants/routes'
import { useAuthStore } from '@/shared/store/auth.store'
import './AdminSidebar.css'

interface AdminSidebarProps {
  className?: string
}

interface MenuItem {
  icon: React.ElementType
  label: string
  path: string
  badge?: number | string
  group: 'overview' | 'management' | 'operations' | 'system'
}

interface MenuGroup {
  id: string
  title: string
  items: MenuItem[]
}

export function AdminSidebar({ className }: AdminSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()
  const navRef = useRef<HTMLElement>(null)

  // Update CSS custom property when expansion state changes
  useEffect(() => {
    document.documentElement.style.setProperty(
      '--admin-sidebar-width',
      isExpanded ? '280px' : '80px'
    )
  }, [isExpanded])

  // Scroll active item into view when location changes
  useEffect(() => {
    // Use setTimeout to ensure DOM has updated after navigation
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
    // Exact match for dashboard, profile, settings, notifications to avoid conflicts
    if (
      path === ROUTES.ADMIN_DASHBOARD ||
      path === ROUTES.PROFILE ||
      path === ROUTES.SETTINGS ||
      path === ROUTES.NOTIFICATIONS
    ) {
      return location.pathname === path
    }
    // For other paths (including messaging with conversations), use startsWith for matching nested routes
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
          label: 'Dashboard',
          path: ROUTES.ADMIN_DASHBOARD,
          group: 'overview',
        },
        {
          icon: BarChart3,
          label: 'Analytics',
          path: ROUTES.ADMIN_ANALYTICS,
          group: 'overview',
        },
      ],
    },
    {
      id: 'management',
      title: 'Management',
      items: [
        {
          icon: Users,
          label: 'Users',
          path: ROUTES.ADMIN_USERS,
          group: 'management',
        },
        {
          icon: Building2,
          label: 'Properties',
          path: ROUTES.ADMIN_PROPERTIES,
          group: 'management',
        },
        {
          icon: Wrench,
          label: 'Services',
          path: ROUTES.ADMIN_SERVICES,
          group: 'management',
        },
      ],
    },
    {
      id: 'operations',
      title: 'Operations',
      items: [
        {
          icon: CheckCircle,
          label: 'Approvals',
          path: ROUTES.ADMIN_APPROVALS,
          badge: 12, // This would come from API/state
          group: 'operations',
        },
        {
          icon: FileText,
          label: 'Applications',
          path: ROUTES.ADMIN_APPLICATIONS,
          badge: 8,
          group: 'operations',
        },
        {
          icon: UserCheck,
          label: 'Background Checks',
          path: ROUTES.ADMIN_BACKGROUND_CHECKS,
          badge: 5,
          group: 'operations',
        },
        {
          icon: AlertCircle,
          label: 'Disputes',
          path: ROUTES.ADMIN_DISPUTES,
          badge: 3,
          group: 'operations',
        },
        {
          icon: CreditCard,
          label: 'Payments',
          path: ROUTES.ADMIN_PAYMENTS,
          group: 'operations',
        },
      ],
    },
    {
      id: 'system',
      title: 'System',
      items: [
        {
          icon: MessageCircle,
          label: 'Messages',
          path: ROUTES.MESSAGING,
          group: 'system',
        },
        {
          icon: Bell,
          label: 'Notifications',
          path: ROUTES.NOTIFICATIONS,
          group: 'system',
        },
        {
          icon: User,
          label: 'Profile',
          path: ROUTES.PROFILE,
          group: 'system',
        },
        {
          icon: Settings,
          label: 'Settings',
          path: ROUTES.SETTINGS,
          group: 'system',
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
    >
      {/* Header */}
      <div className="admin-sidebar__header">
        <div className="admin-sidebar__brand">
          <div className="admin-sidebar__logo">
            <ShieldCheck className="h-6 w-6" />
          </div>
          {isExpanded && (
            <div className="admin-sidebar__brand-text">
              <h2 className="admin-sidebar__title">Admin Portal</h2>
              <p className="admin-sidebar__subtitle">Control Center</p>
            </div>
          )}
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="admin-sidebar__toggle"
          aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {isExpanded ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Quick Stats */}
      {isExpanded && (
        <div className="admin-sidebar__stats">
          <div className="admin-sidebar__stat">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <div className="admin-sidebar__stat-content">
              <span className="admin-sidebar__stat-value">+12%</span>
              <span className="admin-sidebar__stat-label">Growth</span>
            </div>
          </div>
          <div className="admin-sidebar__stat">
            <Users className="h-4 w-4 text-blue-500" />
            <div className="admin-sidebar__stat-content">
              <span className="admin-sidebar__stat-value">1,247</span>
              <span className="admin-sidebar__stat-label">Active Users</span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="admin-sidebar__nav" ref={navRef}>
        {menuGroups.map((group) => (
          <div key={group.id} className="admin-sidebar__group">
            {isExpanded && (
              <h3 className="admin-sidebar__group-title">{group.title}</h3>
            )}
            {!isExpanded && (
              <div className="admin-sidebar__group-divider" />
            )}
            <div className="admin-sidebar__menu">
              {group.items.map((item) => {
                const active = isActive(item.path)
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={cn(
                      'admin-sidebar__item',
                      active && 'admin-sidebar__item--active'
                    )}
                    title={!isExpanded ? item.label : undefined}
                  >
                    <div className="admin-sidebar__item-icon-wrapper">
                      <item.icon className="admin-sidebar__item-icon" />
                      {item.badge && !isExpanded && (
                        <span className="admin-sidebar__item-badge-mini" />
                      )}
                    </div>
                    {isExpanded && (
                      <>
                        <span className="admin-sidebar__item-label">
                          {item.label}
                        </span>
                        {item.badge && (
                          <span className="admin-sidebar__item-badge">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                    {active && <div className="admin-sidebar__item-indicator" />}
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
          className="admin-sidebar__logout"
          title={!isExpanded ? 'Logout' : undefined}
        >
          <LogOut className="h-5 w-5" />
          {isExpanded && <span>Logout</span>}
        </button>
      </div>
    </aside>
  )
}
