import { useState, useEffect, useRef } from 'react'
import type { ElementType } from 'react'
import {
  Menu,
  User,
  Home,
  Building2,
  Wrench,
  MessageCircle,
  Bell,
  Calendar,
  Heart,
  FileText,
  Briefcase,
  CreditCard,
  RefreshCcw as RefreshCw,
  ChevronDown,
  LayoutGrid,
  HardHat,
} from 'lucide-react'
import { Button } from '@/shared/ui/button'
import LogoSvg from '@/assets/images/logo.svg?react'
import { cn } from '@/shared/lib/utils/cn'
import { useNavigate, useLocation } from 'react-router-dom'
import { ROUTES } from '@/shared/constants/routes'
import { useAuthStore } from '@/shared/store/auth.store'
import { Badge } from '@/shared/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/ui/tooltip'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import { useRoleStore, type RoleType } from '@/shared/store/role.store'

interface HeaderProps {
  readonly onMenuClick?: () => void
  readonly onProfileClick?: () => void
  readonly className?: string
}

type NavigationItem = {
  icon: ElementType
  label: string
  path: string
}

type ActivityItem = NavigationItem & {
  badge?: number
}

export function Header({ onMenuClick, onProfileClick, className }: HeaderProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated } = useAuthStore()
  const { roles, activeRole, openRoleSwitcher } = useRoleStore()
  const [isVisible, setIsVisible] = useState(true)
  const [isLandlordMenuOpen, setLandlordMenuOpen] = useState(false)
  const lastScrollYRef = useRef(0)

  const isLandlordRoute = location.pathname.includes('/landlord')
  const effectiveRole: RoleType | null = isAuthenticated
    ? activeRole ?? null
    : isLandlordRoute
    ? 'landlord'
    : null

  const formatRoleLabel = (role?: string | null) =>
    role
      ? role
          .toLowerCase()
          .split('_')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      : ''

  // Auto-hide header on scroll (applies to all breakpoints with adaptive thresholds)
  useEffect(() => {
    const controlHeader = () => {
      const currentScrollY = window.scrollY
      const lastScrollY = lastScrollYRef.current
      const isDesktop = window.innerWidth >= 1024
      const threshold = isDesktop ? 80 : 100

      // Show header when scrolling up or at the top
      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        setIsVisible(true)
      }
      // Hide header when scrolling down (but not if we're near the top)
      else if (currentScrollY > lastScrollY && currentScrollY > threshold) {
        setIsVisible(false)
      }

      lastScrollYRef.current = currentScrollY
    }

    window.addEventListener('scroll', controlHeader, { passive: true })
    return () => window.removeEventListener('scroll', controlHeader)
  }, [])

  const buildNavItems = (role?: RoleType | null, includeLandlordNav = false): NavigationItem[] => {
    if (role === 'landlord' || includeLandlordNav) {
      return [
    { icon: Home, label: 'Home', path: ROUTES.HOME },
      { icon: Building2, label: 'My Properties', path: ROUTES.LANDLORD_PROPERTIES },
      { icon: FileText, label: 'Applications', path: ROUTES.LANDLORD_APPLICATIONS },
      { icon: CreditCard, label: 'Earnings', path: ROUTES.LANDLORD_EARNINGS },
      ]
    }

    if (role === 'handyman') {
      return [
        { icon: Home, label: 'Home', path: ROUTES.HOME },
        { icon: HardHat, label: 'Handyman HQ', path: ROUTES.HANDYMAN_DASHBOARD },
        { icon: Briefcase, label: 'Job Board', path: ROUTES.HANDYMAN_JOBS },
      ]
    }

    if (role === 'tenant') {
      return [
        { icon: Home, label: 'Home', path: ROUTES.HOME },
        { icon: Building2, label: 'Properties', path: ROUTES.PROPERTIES },
        { icon: Wrench, label: 'Services', path: ROUTES.SERVICES },
      ]
    }

    return [
      { icon: Home, label: 'Home', path: ROUTES.HOME },
      { icon: Building2, label: 'Properties', path: ROUTES.PROPERTIES },
    { icon: Wrench, label: 'Services', path: ROUTES.SERVICES },
  ]
  }

  const buildActivityItems = (role?: RoleType | null): ActivityItem[] => {
    const base: ActivityItem[] = [
    { icon: MessageCircle, label: 'Messages', path: ROUTES.MESSAGING, badge: 2 },
    { icon: Bell, label: 'Notifications', path: ROUTES.NOTIFICATIONS, badge: 5 },
    ]

    if (role === 'landlord') {
      return [
        ...base,
        { icon: Calendar, label: 'Calendar', path: ROUTES.EVENTS },
        { icon: Heart, label: 'Favourites', path: ROUTES.FAVOURITES },
        { icon: Briefcase, label: 'My Services', path: ROUTES.MY_SERVICES },
      ]
    }

    if (role === 'handyman') {
      return [
        ...base,
        { icon: Calendar, label: 'Calendar', path: ROUTES.EVENTS },
      ]
    }

    if (role === 'tenant') {
      return [
        ...base,
    { icon: Calendar, label: 'Calendar', path: ROUTES.EVENTS },
    { icon: Heart, label: 'Favourites', path: ROUTES.FAVOURITES },
    { icon: FileText, label: 'My Bookings', path: ROUTES.MY_BOOKINGS },
    { icon: Briefcase, label: 'My Services', path: ROUTES.MY_SERVICES },
  ]
    }

    return base
  }

  const navItems = buildNavItems(effectiveRole, !isAuthenticated && isLandlordRoute)
  const activityItems = buildActivityItems(effectiveRole)

  const isActive = (path: string) => {
    if (path === ROUTES.HOME) {
      return location.pathname === path
    }
    return location.pathname.startsWith(path)
  }

  return (
    <TooltipProvider>
      <header className={cn(
        'sticky top-0 z-50 w-full border-b bg-surface/95 backdrop-blur-sm shadow-sm transition-transform duration-300',
        !isVisible && 'lg:translate-y-0 -translate-y-full',
        className
      )}>
        <div className="container mx-auto px-4 lg:px-6 xl:px-8 h-16 md:h-20 flex items-center justify-between max-w-7xl">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden bg-icon-bg text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </Button>
        
        {/* Logo */}
        <div className="flex-1 flex justify-center lg:justify-start">
          <button 
            onClick={() => navigate(ROUTES.HOME)} 
            className="cursor-pointer hover:opacity-80 transition-opacity"
          >
            <LogoSvg className="h-32 w-32 md:h-40 md:w-40 lg:h-44 lg:w-44" />
          </button>
        </div>

        {/* Desktop Navigation - Main (Compact with Dropdown for Landlord) */}
        <nav className="hidden lg:flex items-center gap-2 flex-1 justify-end pr-5 max-w-3xl">
          {isAuthenticated && effectiveRole === 'landlord' ? (
            <>
              {/* Home */}
              <Button
                variant={isActive(ROUTES.HOME) ? 'default' : 'ghost'}
                className={cn(
                  'h-10 px-4 rounded-xl font-medium transition-all focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none',
                  isActive(ROUTES.HOME)
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'hover:bg-primary/10 hover:text-primary'
                )}
                onClick={() => navigate(ROUTES.HOME)}
              >
                <Home className="h-4 w-4 lg:mr-2" />
                <span className="hidden xl:inline">Home</span>
              </Button>

              {/* Services */}
              <Button
                variant={isActive(ROUTES.SERVICES) ? 'default' : 'ghost'}
                className={cn(
                  'h-10 px-4 rounded-xl font-medium transition-all focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none',
                  isActive(ROUTES.SERVICES)
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'hover:bg-primary/10 hover:text-primary'
                )}
                onClick={() => navigate(ROUTES.SERVICES)}
              >
                <Wrench className="h-4 w-4 lg:mr-2" />
                <span className="hidden xl:inline">Services</span>
                </Button>
                
              {/* Landlord Menu Dropdown */}
              <DropdownMenu open={isLandlordMenuOpen} onOpenChange={setLandlordMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={
                      location.pathname.includes('/landlord') || isLandlordMenuOpen
                        ? 'default'
                        : 'ghost'
                    }
                    className={cn(
                      'h-10 px-4 rounded-xl font-medium transition-all focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none',
                      location.pathname.includes('/landlord') || isLandlordMenuOpen
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'hover:bg-primary/10 hover:text-primary'
                    )}
                  >
                    <Building2 className="h-4 w-4 lg:mr-2" />
                    <span className="hidden xl:inline">Landlord</span>
                    <ChevronDown
                      className={cn(
                        'h-3 w-3 ml-1 transition-transform duration-200',
                        isLandlordMenuOpen && 'rotate-180'
                      )}
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-56">
                  <DropdownMenuItem
                    onClick={() => {
                      navigate(ROUTES.LANDLORD_PROPERTIES)
                      setLandlordMenuOpen(false)
                    }}
                    className={cn(
                      'cursor-pointer',
                      isActive(ROUTES.LANDLORD_PROPERTIES) && 'bg-primary/10 text-primary'
                    )}
                  >
                    <Building2 className="h-4 w-4 mr-2" />
                    My Properties
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      navigate(ROUTES.LANDLORD_APPLICATIONS)
                      setLandlordMenuOpen(false)
                    }}
                    className={cn(
                      'cursor-pointer',
                      isActive(ROUTES.LANDLORD_APPLICATIONS) && 'bg-primary/10 text-primary'
                    )}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Applications
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      navigate(ROUTES.LANDLORD_EARNINGS)
                      setLandlordMenuOpen(false)
                    }}
                    className={cn(
                      'cursor-pointer',
                      isActive(ROUTES.LANDLORD_EARNINGS) && 'bg-primary/10 text-primary'
                    )}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Earnings
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

            </>
          ) : (
            // Tenant/Other roles - simple nav
            navItems.map((item) => {
            const active = isActive(item.path)
            return (
              <Button
                key={item.path}
                variant={active ? 'default' : 'ghost'}
                className={cn(
                    'h-10 px-4 rounded-xl font-medium transition-all',
                  active 
                    ? 'bg-primary text-primary-foreground shadow-md' 
                    : 'hover:bg-primary/10 hover:text-primary'
                )}
                onClick={() => navigate(item.path)}
              >
                  <item.icon className="h-4 w-4 lg:mr-2" />
                  <span className="hidden xl:inline">{item.label}</span>
              </Button>
            )
            })
          )}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2 lg:gap-3">
          {isAuthenticated && (
            <>
              {/* Desktop - Messages & Notifications (Always visible) */}
              <div className="hidden lg:flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        'bg-icon-bg text-foreground hover:bg-primary/10 hover:text-primary relative transition-colors',
                        isActive(ROUTES.MESSAGING) && 'bg-primary/10 text-primary'
                      )}
                      onClick={() => navigate(ROUTES.MESSAGING)}
                      aria-label="Messages"
                    >
                      <MessageCircle className="h-5 w-5" />
                      <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs bg-primary text-primary-foreground">
                        2
                      </Badge>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Messages</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        'bg-icon-bg hover:bg-primary/10 hover:text-primary relative transition-colors',
                        isActive(ROUTES.NOTIFICATIONS) && 'bg-primary/10 text-primary'
                      )}
                      onClick={() => navigate(ROUTES.NOTIFICATIONS)}
                      aria-label="Notifications"
                    >
                      <Bell className="h-5 w-5" />
                      <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs bg-primary text-primary-foreground">
                        5
                      </Badge>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Notifications</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              {/* Desktop - More Menu (Calendar, Favourites, Bookings, Services) */}
              {activityItems.length > 2 && (
                <>
                  {activityItems.slice(2).length === 1 ? (
                    // Single item - show as icon button
                    (() => {
                      const singleItem = activityItems[2]
                      const Icon = singleItem.icon
                      return (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant={isActive(singleItem.path) ? 'default' : 'ghost'}
                              size="icon"
                              className={cn(
                                'hidden lg:flex bg-icon-bg hover:bg-primary/10 hover:text-primary transition-colors relative',
                                isActive(singleItem.path) && 'bg-primary/10 text-primary'
                              )}
                              onClick={() => navigate(singleItem.path)}
                              aria-label={singleItem.label}
                            >
                              <Icon className="h-5 w-5" />
                              {singleItem.badge && (
                                <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs bg-primary text-primary-foreground">
                                  {singleItem.badge}
                                </Badge>
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{singleItem.label}</p>
                          </TooltipContent>
                        </Tooltip>
                      )
                    })()
                  ) : (
                    // Multiple items - show as dropdown
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant={
                        activityItems
                          .slice(2)
                          .some((item) => isActive(item.path))
                          ? 'default'
                          : 'ghost'
                      }
                      size="icon"
                      className={cn(
                        'hidden lg:flex bg-icon-bg hover:bg-primary/10 hover:text-primary transition-colors',
                        activityItems.slice(2).some((item) => isActive(item.path)) &&
                          'bg-primary/10 text-primary'
                      )}
                      aria-label="Workspace menu"
                    >
                      <LayoutGrid className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {activityItems.slice(2).map((item) => {
                      const isActiveItem = isActive(item.path)
                      return (
                        <DropdownMenuItem
                          key={item.path}
                          onClick={() => navigate(item.path)}
                          className={cn(
                            'cursor-pointer',
                            isActiveItem && 'bg-primary/10 text-primary'
                          )}
                        >
                          <item.icon className="h-4 w-4 mr-2" />
                          {item.label}
                          {item.badge && (
                            <Badge className="ml-auto h-5 w-5 flex items-center justify-center p-0 text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </DropdownMenuItem>
                      )
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
                  )}
                </>
              )}
            </>
          )}
          
          {/* Role Switcher Button (for multi-role users) */}
          {isAuthenticated && roles.length > 1 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden lg:flex items-center gap-2 bg-icon-bg hover:bg-primary/10 hover:text-primary transition-colors px-3"
                  onClick={openRoleSwitcher}
                  aria-label="Switch role"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span className="text-xs text-muted-foreground">Role</span>
              <span className="font-semibold">
                {formatRoleLabel(activeRole ?? roles[0]?.type)}
              </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Switch Role</p>
              </TooltipContent>
            </Tooltip>
          )}

          {/* Mobile Role Switcher */}
          {isAuthenticated && roles.length > 1 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden bg-icon-bg hover:bg-primary/10 hover:text-primary transition-colors"
                  onClick={openRoleSwitcher}
                  aria-label="Switch role"
                >
                  <RefreshCw className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Switch Role</p>
              </TooltipContent>
            </Tooltip>
          )}
          
          {/* Profile Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
            className={cn(
              'bg-icon-bg text-foreground hover:bg-primary/10 hover:text-primary transition-colors',
              isActive(ROUTES.PROFILE) && 'bg-primary/10 text-primary'
            )}
                onClick={onProfileClick}
                aria-label="User profile"
              >
                <User className="h-5 w-5 md:h-6 md:w-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isAuthenticated ? 'Profile' : 'Sign In'}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </header>
    </TooltipProvider>
  )
}

