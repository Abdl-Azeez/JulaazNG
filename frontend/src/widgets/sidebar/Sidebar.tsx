import { X, Home, Building2, MessageCircle, Bell, Calendar, User, LogOut, Settings, Heart, FileText, Briefcase, Wrench, Zap, Droplet, Sparkles, Paintbrush, Clock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/shared/store/auth.store'
import { ROUTES } from '@/shared/constants/routes'
import { cn } from '@/shared/lib/utils/cn'
import { trackServiceEvent } from '@/shared/lib/analytics/service-analytics'
import './Sidebar.css'

interface SidebarProps {
  readonly isOpen: boolean
  readonly onClose: () => void
}

interface MenuItem {
  icon: React.ElementType
  label: string
  path: string
  requiresAuth?: boolean
  roles?: ('tenant' | 'landlord' | 'artisan')[]
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuthStore()

  const publicMenuItems: MenuItem[] = [
    { icon: Home, label: 'Home', path: ROUTES.HOME },
    { icon: Building2, label: 'Properties', path: ROUTES.PROPERTIES },
    { icon: Wrench, label: 'Services', path: ROUTES.SERVICES },
  ]

  const authenticatedMenuItems: MenuItem[] = [
    { icon: MessageCircle, label: 'Messages', path: ROUTES.MESSAGING, requiresAuth: true },
    { icon: Bell, label: 'Notifications', path: ROUTES.NOTIFICATIONS, requiresAuth: true },
    { icon: Calendar, label: 'Events', path: '/events', requiresAuth: true },
    { icon: Heart, label: 'Favorites', path: '/favorites', requiresAuth: true },
  ]

  const tenantMenuItems: MenuItem[] = [
    { icon: FileText, label: 'My Bookings', path: ROUTES.MY_BOOKINGS, requiresAuth: true, roles: ['tenant'] },
    { icon: Briefcase, label: 'My Services', path: ROUTES.SERVICE_BOOKINGS, requiresAuth: true, roles: ['tenant'] },
  ]

  const landlordMenuItems: MenuItem[] = [
    { icon: Building2, label: 'My Properties', path: ROUTES.PROPERTY_MANAGEMENT, requiresAuth: true, roles: ['landlord'] },
    { icon: FileText, label: 'Bookings', path: ROUTES.MY_BOOKINGS, requiresAuth: true, roles: ['landlord'] },
  ]

  const bottomMenuItems: MenuItem[] = [
    { icon: User, label: 'Profile', path: ROUTES.PROFILE, requiresAuth: true },
    { icon: Settings, label: 'Settings', path: ROUTES.SETTINGS, requiresAuth: true },
  ]

  // Quick Service Chips - Most Popular Services
  const quickServices = [
    { 
      id: 'electrician', 
      name: 'Electrician', 
      icon: Zap, 
      priceFrom: 15000, 
      responseTime: '90min',
      category: 'repairs',
      badge: '24/7'
    },
    { 
      id: 'plumber', 
      name: 'Plumber', 
      icon: Droplet, 
      priceFrom: 12000, 
      responseTime: '90min',
      category: 'repairs',
      badge: '24/7'
    },
    { 
      id: 'deep-clean', 
      name: 'Deep Clean', 
      icon: Sparkles, 
      priceFrom: 18000, 
      responseTime: '2hrs',
      category: 'wellness',
      badge: 'Popular'
    },
    { 
      id: 'painting', 
      name: 'Painting', 
      icon: Paintbrush, 
      priceFrom: 25000, 
      responseTime: '24hrs',
      category: 'finishing'
    },
  ]

  const handleNavigation = (path: string) => {
    navigate(path)
    onClose()
  }

  const handleQuickServiceClick = (service: typeof quickServices[0]) => {
    trackServiceEvent('quick_service_chip_clicked', {
      serviceId: service.id,
      serviceName: service.name,
      category: service.category,
      source: 'sidebar',
    })
    navigate(`${ROUTES.SERVICES}?quick=${service.id}&category=${service.category}`)
    onClose()
  }

  const handleLogout = () => {
    useAuthStore.getState().clearAuth()
    navigate(ROUTES.HOME)
    onClose()
  }

  const shouldShowItem = (item: MenuItem) => {
    if (item.requiresAuth && !isAuthenticated) return false
    if (item.roles && user?.role && !item.roles.includes(user.role as any)) return false
    return true
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-foreground/40 backdrop-blur-sm z-40 transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === 'Escape') onClose()
        }}
        role="button"
        tabIndex={0}
        aria-label="Close sidebar"
      />

      {/* Sidebar */}
      <aside
        className={cn(
          'sidebar',
          isOpen ? 'sidebar--open' : ''
        )}
      >
        {/* Header */}
        <div className="sidebar__header">
          <div className="sidebar__header-content">
            <h2 className="text-xl font-bold text-foreground">Menu</h2>
            <button
              onClick={onClose}
              className="sidebar__close-btn"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="sidebar__accent-line" />
        </div>

        {/* Navigation */}
        <nav className="sidebar__nav">
          {/* Public Menu Items */}
          <div className="sidebar__section">
            <h3 className="sidebar__section-title">Explore</h3>
            {publicMenuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className="sidebar__item"
              >
                <item.icon className="sidebar__item-icon" />
                <span className="sidebar__item-label">{item.label}</span>
                <div className="sidebar__item-shine" />
              </button>
            ))}
          </div>

          {/* Quick Services Chips */}
          <div className="sidebar__section">
            <h3 className="sidebar__section-title">Quick Services</h3>
            <div className="grid grid-cols-2 gap-2 px-2">
              {quickServices.map((service) => (
                <button
                  key={service.id}
                  onClick={() => handleQuickServiceClick(service)}
                  className="sidebar__quick-service"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <service.icon className="h-4 w-4 text-primary" />
                    <span className="text-xs font-semibold text-foreground">{service.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground">
                      From ₦{(service.priceFrom / 1000).toFixed(0)}K
                    </span>
                    {service.badge && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                        {service.badge}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground">{service.responseTime}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Authenticated Items */}
          {isAuthenticated && (
            <>
              <div className="sidebar__section">
                <h3 className="sidebar__section-title">Activity</h3>
                {authenticatedMenuItems.filter(shouldShowItem).map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className="sidebar__item"
                  >
                    <item.icon className="sidebar__item-icon" />
                    <span className="sidebar__item-label">{item.label}</span>
                    <div className="sidebar__item-shine" />
                  </button>
                ))}
              </div>

              {/* Role-specific Items */}
              {user?.role === 'tenant' && tenantMenuItems.some(shouldShowItem) && (
                <div className="sidebar__section">
                  <h3 className="sidebar__section-title">Tenant</h3>
                  {tenantMenuItems.filter(shouldShowItem).map((item) => (
                    <button
                      key={item.path}
                      onClick={() => handleNavigation(item.path)}
                      className="sidebar__item"
                    >
                      <item.icon className="sidebar__item-icon" />
                      <span className="sidebar__item-label">{item.label}</span>
                      <div className="sidebar__item-shine" />
                    </button>
                  ))}
                </div>
              )}

              {user?.role === 'landlord' && landlordMenuItems.some(shouldShowItem) && (
                <div className="sidebar__section">
                  <h3 className="sidebar__section-title">Landlord</h3>
                  {landlordMenuItems.filter(shouldShowItem).map((item) => (
                    <button
                      key={item.path}
                      onClick={() => handleNavigation(item.path)}
                      className="sidebar__item"
                    >
                      <item.icon className="sidebar__item-icon" />
                      <span className="sidebar__item-label">{item.label}</span>
                      <div className="sidebar__item-shine" />
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Bottom Section */}
          {isAuthenticated && (
            <div className="sidebar__section sidebar__section--bottom">
              <h3 className="sidebar__section-title">Account</h3>
              {bottomMenuItems.filter(shouldShowItem).map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className="sidebar__item"
                >
                  <item.icon className="sidebar__item-icon" />
                  <span className="sidebar__item-label">{item.label}</span>
                  <div className="sidebar__item-shine" />
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="sidebar__item sidebar__item--danger"
              >
                <LogOut className="sidebar__item-icon" />
                <span className="sidebar__item-label">Logout</span>
                <div className="sidebar__item-shine" />
              </button>
            </div>
          )}
        </nav>

        {/* Decorative Elements */}
        <div className="sidebar__decoration sidebar__decoration--top" />
        <div className="sidebar__decoration sidebar__decoration--bottom" />
      </aside>
    </>
  )
}

