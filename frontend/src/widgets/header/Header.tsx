import { Menu, User, Home, Building2, Wrench, MessageCircle, Bell, Calendar, Heart, FileText, Briefcase } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import LogoSvg from '@/assets/images/logo.svg?react'
import { cn } from '@/shared/lib/utils/cn'
import { useNavigate, useLocation } from 'react-router-dom'
import { ROUTES } from '@/shared/constants/routes'
import { useAuthStore } from '@/shared/store/auth.store'
import { Badge } from '@/shared/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/ui/tooltip'

interface HeaderProps {
  onMenuClick?: () => void
  onProfileClick?: () => void
  className?: string
}

export function Header({ onMenuClick, onProfileClick, className }: HeaderProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, user } = useAuthStore()

  const hideTenantFeatures = user?.role === 'landlord' || location.pathname.includes('/landlord')

  const navItems = [
    { icon: Home, label: 'Home', path: ROUTES.HOME },
    // Hide tenant 'Properties' page for landlords or while within landlord area
    ...(!hideTenantFeatures ? [{ icon: Building2, label: 'Properties', path: ROUTES.PROPERTIES }] : []),
    { icon: Wrench, label: 'Services', path: ROUTES.SERVICES },
  ]

  const baseActivityItems = [
    { icon: MessageCircle, label: 'Messages', path: ROUTES.MESSAGING, badge: 2 },
    { icon: Bell, label: 'Notifications', path: ROUTES.NOTIFICATIONS, badge: 5 },
    { icon: Calendar, label: 'Calendar', path: ROUTES.EVENTS },
    { icon: Heart, label: 'Favourites', path: ROUTES.FAVOURITES },
    { icon: FileText, label: 'My Bookings', path: ROUTES.MY_BOOKINGS },
    { icon: Briefcase, label: 'My Services', path: ROUTES.MY_SERVICES },
  ]
  const activityItems = hideTenantFeatures
    ? baseActivityItems.filter(
        (item) => item.path !== ROUTES.MY_BOOKINGS && item.path !== ROUTES.MY_SERVICES
      )
    : baseActivityItems

  const isActive = (path: string) => {
    if (path === ROUTES.HOME) {
      return location.pathname === path
    }
    return location.pathname.startsWith(path)
  }

  return (
    <TooltipProvider>
      <header className={cn('sticky top-0 z-50 w-full border-b bg-surface/95 backdrop-blur-sm shadow-sm', className)}>
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
            <LogoSvg className="h-14 md:h-18 lg:h-20 w-auto" />
          </button>
        </div>

        {/* Desktop Navigation - Main */}
        <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center max-w-2xl">
          {navItems.map((item) => {
            const active = isActive(item.path)
            return (
              <Button
                key={item.path}
                variant={active ? 'default' : 'ghost'}
                className={cn(
                  'h-10 px-5 rounded-xl font-medium transition-all',
                  active 
                    ? 'bg-primary text-primary-foreground shadow-md' 
                    : 'hover:bg-primary/10 hover:text-primary'
                )}
                onClick={() => navigate(item.path)}
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.label}
              </Button>
            )
          })}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2 lg:gap-3">
          {isAuthenticated && (
            <>
              {/* Desktop Activity Icons */}
              <div className="hidden xl:flex items-center gap-1 border-r border-border pr-3 mr-1">
                {activityItems.map((item) => {
                  const active = isActive(item.path)
                  return (
                    <Tooltip key={item.path}>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn(
                            'h-10 w-10 relative transition-colors',
                            active ? 'bg-primary/10 text-primary' : 'bg-icon-bg text-foreground hover:bg-primary/10 hover:text-primary'
                          )}
                          onClick={() => navigate(item.path)}
                          aria-label={item.label}
                        >
                          <item.icon className="h-5 w-5" />
                          {item.badge && (
                            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary text-primary-foreground">
                              {item.badge}
                            </Badge>
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{item.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  )
                })}
              </div>
              
              {/* Tablet Activity Icons (Messages & Notifications only) */}
              <div className="hidden lg:flex xl:hidden items-center gap-1">
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
            </>
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

