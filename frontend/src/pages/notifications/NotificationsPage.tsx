import { useState } from 'react'
import { Bell, Check, Trash2, MoreVertical, Settings, Trash } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import { cn } from '@/shared/lib/utils/cn'
import { Header } from '@/widgets/header'
import { Sidebar } from '@/widgets/sidebar'
import { AuthDialog } from '@/widgets/auth-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/shared/ui/dropdown-menu'
import toast from 'react-hot-toast'
import {
  CalendarCheck,
  MessageCircle,
  Sparkles,
  Home,
  AlertCircle,
  Star,
  FileCheck,
  CreditCard,
} from 'lucide-react'
import { sampleNotifications } from '@/__mocks__/data/notifications.mock'
import { Notification } from '@/shared/types/activity.types'
import { useAuthStore } from '@/shared/store/auth.store'
import { ROUTES } from '@/shared/constants/routes'
import { formatDistanceToNow } from 'date-fns'

const getNotificationIcon = (type: Notification['type']) => {
  const iconClass = 'h-5 w-5'
  switch (type) {
    case 'booking_confirmed':
    case 'viewing_scheduled':
      return <CalendarCheck className={iconClass} />
    case 'payment_received':
    case 'payment_reminder':
      return <CreditCard className={iconClass} />
    case 'message_received':
      return <MessageCircle className={iconClass} />
    case 'service_booked':
    case 'service_completed':
      return <Sparkles className={iconClass} />
    case 'property_matched':
      return <Home className={iconClass} />
    case 'rent_due':
      return <AlertCircle className={iconClass} />
    case 'review_request':
      return <Star className={iconClass} />
    case 'document_approved':
    case 'document_rejected':
      return <FileCheck className={iconClass} />
    default:
      return <Bell className={iconClass} />
  }
}

const getNotificationColor = (type: Notification['type']) => {
  switch (type) {
    case 'booking_confirmed':
    case 'viewing_scheduled':
      return 'bg-blue-100 text-blue-600'
    case 'payment_received':
      return 'bg-primary/10 text-primary'
    case 'payment_reminder':
    case 'rent_due':
      return 'bg-orange-100 text-orange-600'
    case 'message_received':
      return 'bg-purple-100 text-purple-600'
    case 'service_booked':
    case 'service_completed':
      return 'bg-pink-100 text-pink-600'
    case 'property_matched':
      return 'bg-cyan-100 text-cyan-600'
    case 'review_request':
      return 'bg-yellow-100 text-yellow-600'
    case 'document_approved':
      return 'bg-primary/10 text-primary'
    case 'document_rejected':
      return 'bg-red-100 text-red-600'
    default:
      return 'bg-muted/50 text-muted-foreground'
  }
}

export function NotificationsPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const [notifications, setNotifications] = useState(sampleNotifications)
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return notif.status !== 'read'
    if (filter === 'read') return notif.status === 'read'
    return true
  })

  const unreadCount = notifications.filter(n => n.status !== 'read').length

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, status: 'read' as const, readAt: new Date() } : notif
      )
    )
  }

  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({
        ...notif,
        status: 'read' as const,
        readAt: notif.readAt || new Date(),
      }))
    )
  }

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id))
  }

  const handleDeleteAllRead = () => {
    const readCount = notifications.filter(n => n.status === 'read').length
    if (readCount === 0) {
      toast.error('No read notifications to delete')
      return
    }
    setNotifications(prev => prev.filter(notif => notif.status !== 'read'))
    toast.success(`Deleted ${readCount} read notification${readCount !== 1 ? 's' : ''}`)
  }

  const handleDeleteAll = () => {
    if (notifications.length === 0) {
      toast.error('No notifications to delete')
      return
    }
    setNotifications([])
    toast.success('All notifications deleted')
  }

  const handleMenuClick = () => {
    setIsSidebarOpen(true)
  }

  const handleProfileClick = () => {
    if (isAuthenticated) {
      navigate(ROUTES.PROFILE)
    } else {
      setIsDrawerOpen(true)
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    handleMarkAsRead(notification.id)
    
    // Navigate based on notification type and data
    if (notification.actionUrl) {
      navigate(notification.actionUrl)
      return
    }

    // Fallback navigation based on notification type
    switch (notification.type) {
      case 'booking_confirmed':
      case 'viewing_scheduled':
        if (notification.data?.bookingId) {
          navigate(ROUTES.MY_BOOKINGS)
        } else if (notification.data?.propertyId) {
          navigate(ROUTES.PROPERTY_DETAILS(notification.data.propertyId))
        } else {
          navigate(ROUTES.MY_BOOKINGS)
        }
        break
      case 'payment_received':
      case 'payment_reminder':
      case 'rent_due':
        navigate(ROUTES.PAYMENTS || ROUTES.MY_BOOKINGS)
        break
      case 'message_received':
        if (notification.data?.conversationId) {
          navigate(ROUTES.MESSAGING_CHAT(notification.data.conversationId))
        } else {
          navigate(ROUTES.MESSAGING)
        }
        break
      case 'service_booked':
      case 'service_completed':
        navigate(ROUTES.MY_SERVICES)
        break
      case 'property_matched':
        navigate(ROUTES.PROPERTIES)
        break
      case 'review_request':
        navigate(ROUTES.MY_SERVICES)
        break
      case 'document_approved':
      case 'document_rejected':
        navigate(`${ROUTES.PROFILE}#verification`)
        break
      default:
        // Do nothing if no action available
        break
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header onMenuClick={handleMenuClick} onProfileClick={handleProfileClick} />
      
      {/* Notifications Header */}
      <header className="sticky z-10 bg-surface/95 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="container mx-auto px-4 lg:px-6 xl:px-8 py-4 lg:py-6 max-w-7xl">
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground">Notifications</h1>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">
                {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  className="text-xs md:text-sm"
                >
                  Mark all read
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="bg-icon-bg text-foreground hover:bg-primary/10 hover:text-primary transition-colors">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 rounded-2xl border-border/60">
                  <DropdownMenuItem
                    className="gap-2 cursor-pointer"
                    onClick={handleMarkAllAsRead}
                    disabled={unreadCount === 0}
                  >
                    <Check className="h-4 w-4" />
                    Mark all as read
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                    onClick={handleDeleteAllRead}
                    disabled={notifications.filter(n => n.status === 'read').length === 0}
                  >
                    <Trash className="h-4 w-4" />
                    Delete all read
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                    onClick={handleDeleteAll}
                    disabled={notifications.length === 0}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete all
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="gap-2 cursor-pointer"
                    onClick={() => {
                      // Navigate to notification settings if available
                      toast('Notification settings coming soon');
                    }}
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('all')}
              className={cn(
                "rounded-full text-xs md:text-sm",
                filter !== 'all' && 'text-foreground border border-border hover:border-primary/50 hover:text-primary'
              )}
            >
              All
            </Button>
            <Button
              variant={filter === 'unread' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('unread')}
              className={cn(
                "rounded-full text-xs md:text-sm",
                filter !== 'unread' && 'text-foreground border border-border hover:border-primary/50 hover:text-primary'
              )}
            >
              Unread
              {filteredNotifications.filter(n => n.status !== 'read').length > 0 && (
                <Badge className="ml-2 bg-primary text-primary-foreground">
                  {filteredNotifications.filter(n => n.status !== 'read').length}
                </Badge>
              )}
            </Button>
            <Button
              variant={filter === 'read' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('read')}
              className={cn(
                "rounded-full text-xs md:text-sm",
                filter !== 'read' && 'text-foreground border border-border hover:border-primary/50 hover:text-primary'
              )}
            >
              Read
            </Button>
          </div>
        </div>
      </header>

      {/* Notifications List */}
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 lg:px-6 xl:px-8 py-6 lg:py-8 max-w-4xl">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Bell className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">
                {filter === 'unread' 
                  ? 'No unread notifications' 
                  : filter === 'read'
                  ? 'No read notifications'
                  : 'No notifications yet'}
              </p>
            </div>
          ) : (
            <AnimatePresence>
              {filteredNotifications.map((notification, index) => {
                const isUnread = notification.status !== 'read'
                
                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: index * 0.03 }}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 lg:p-5 rounded-xl lg:rounded-2xl mb-3 cursor-pointer transition-all hover:shadow-md ${
                      isUnread 
                        ? 'bg-primary/5 border-2 border-primary/20 shadow-sm' 
                        : 'bg-surface hover:bg-surface/95 border border-border/50'
                    }`}
                  >
                    <div className="flex gap-3">
                      {/* Icon */}
                      <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${getNotificationColor(notification.type)}`}>
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className={`font-semibold text-sm ${isUnread ? 'text-foreground' : 'text-foreground/80'}`}>
                            {notification.title}
                          </h3>
                          {isUnread && (
                            <div className="h-2 w-2 rounded-full bg-primary ml-2 flex-shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                          </span>
                          <div className="flex items-center gap-2">
                            {isUnread && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 hover:border-primary/30 transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleMarkAsRead(notification.id)
                                }}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-foreground hover:text-destructive hover:bg-destructive/10 border border-border/50 hover:border-destructive/50 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDelete(notification.id)
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          )}
        </div>
      </main>
      
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <AuthDialog open={isDrawerOpen} onOpenChange={setIsDrawerOpen} />
    </div>
  )
}

