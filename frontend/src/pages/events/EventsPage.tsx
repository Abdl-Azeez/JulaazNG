import { useState } from 'react'
import { Calendar, Filter, MapPin, Clock, Users, CheckCircle2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { cn } from '@/shared/lib/utils/cn'
import { Header } from '@/widgets/header'
import { Sidebar } from '@/widgets/sidebar'
import { AuthDialog } from '@/widgets/auth-dialog'
import { sampleEvents } from './data/sample-events'
import { Event } from '@/shared/types/activity.types'
import { useAuthStore } from '@/shared/store/auth.store'
import { ROUTES } from '@/shared/constants/routes'
import { format, isPast, isToday, isTomorrow } from 'date-fns'

const getEventIcon = (type: Event['type']) => {
  const iconClass = 'h-5 w-5'
  switch (type) {
    case 'viewing':
      return <Calendar className={iconClass} />
    case 'service':
      return <CheckCircle2 className={iconClass} />
    case 'payment':
      return <Calendar className={iconClass} />
    case 'maintenance':
      return <CheckCircle2 className={iconClass} />
    default:
      return <Calendar className={iconClass} />
  }
}

const getEventColor = (status: Event['status']) => {
  switch (status) {
    case 'confirmed':
      return 'bg-primary/10 text-primary border-primary/20'
    case 'scheduled':
      return 'bg-accent/10 text-accent border-accent/20'
    case 'completed':
      return 'bg-muted text-muted-foreground border-border'
    case 'cancelled':
      return 'bg-destructive/10 text-destructive border-destructive/20'
    case 'rescheduled':
      return 'bg-warning/10 text-warning border-warning/20'
    default:
      return 'bg-muted text-muted-foreground border-border'
  }
}

const formatEventDate = (date: Date) => {
  if (isToday(date)) return 'Today'
  if (isTomorrow(date)) return 'Tomorrow'
  return format(date, 'MMM d, yyyy')
}

const formatEventTime = (date: Date) => {
  return format(date, 'h:mm a')
}

export function EventsPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

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

  const handleEventClick = (event: Event) => {
    // Navigate to appropriate page based on event type and related data
    switch (event.type) {
      case 'viewing':
        if (event.relatedTo?.type === 'property' && event.relatedTo?.id) {
          // Navigate to property details if we have the property ID
          navigate(ROUTES.PROPERTY_DETAILS(event.relatedTo.id))
        } else {
          // Fallback to My Bookings page
          navigate(ROUTES.MY_BOOKINGS)
        }
        break
      case 'service':
        if (event.relatedTo?.type === 'service') {
          navigate(ROUTES.MY_SERVICES)
        } else {
          navigate(ROUTES.MY_SERVICES)
        }
        break
      case 'payment':
        // Navigate to Payments page or My Bookings for payment-related events
        if (event.relatedTo?.type === 'booking' && event.relatedTo?.id) {
          navigate(ROUTES.MY_BOOKINGS)
        } else {
          navigate(ROUTES.PAYMENTS || ROUTES.MY_BOOKINGS)
        }
        break
      case 'maintenance':
        // Navigate to property details or My Services
        if (event.relatedTo?.type === 'property' && event.relatedTo?.id) {
          navigate(ROUTES.PROPERTY_DETAILS(event.relatedTo.id))
        } else {
          navigate(ROUTES.MY_SERVICES)
        }
        break
      default:
        // Default navigation - could go to events detail page or home
        navigate(ROUTES.HOME)
        break
    }
  }

  const filteredEvents = sampleEvents.filter(event => {
    if (filter === 'upcoming') return !isPast(event.startDate) && event.status !== 'cancelled'
    if (filter === 'past') return isPast(event.startDate) || event.status === 'completed' || event.status === 'cancelled'
    return true
  }).sort((a, b) => {
    // Sort by date: upcoming first, then past
    if (isPast(a.startDate) && !isPast(b.startDate)) return 1
    if (!isPast(a.startDate) && isPast(b.startDate)) return -1
    return b.startDate.getTime() - a.startDate.getTime()
  })

  const groupedEvents = filteredEvents.reduce((acc, event) => {
    const dateKey = format(event.startDate, 'yyyy-MM-dd')
    if (!acc[dateKey]) {
      acc[dateKey] = []
    }
    acc[dateKey].push(event)
    return acc
  }, {} as Record<string, Event[]>)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header onMenuClick={handleMenuClick} onProfileClick={handleProfileClick} />
      
      {/* Events Header */}
      <header className="sticky z-10 bg-surface/95 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="container mx-auto px-4 lg:px-6 xl:px-8 py-4 lg:py-6 max-w-7xl">
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground">Events</h1>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">Your scheduled activities</p>
            </div>
            <Button variant="ghost" size="icon" className="bg-icon-bg text-foreground hover:bg-primary/10 hover:text-primary transition-colors">
              <Filter className="h-5 w-5" />
            </Button>
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
              variant={filter === 'upcoming' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('upcoming')}
              className={cn(
                "rounded-full text-xs md:text-sm",
                filter !== 'upcoming' && 'text-foreground border border-border hover:border-primary/50 hover:text-surface'
              )}
            >
              Upcoming
            </Button>
            <Button
              variant={filter === 'past' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('past')}
              className={cn(
                "rounded-full text-xs md:text-sm",
                filter !== 'past' && 'text-foreground border border-border hover:border-primary/50 hover:text-surface'
              )}
            >
              Past
            </Button>
          </div>
        </div>
      </header>

      {/* Events List */}
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 lg:px-6 xl:px-8 py-6 lg:py-8 max-w-5xl">
          {filteredEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">
                {filter === 'upcoming' 
                  ? 'No upcoming events' 
                  : filter === 'past'
                  ? 'No past events'
                  : 'No events scheduled'}
              </p>
            </div>
          ) : (
            Object.entries(groupedEvents).map(([dateKey, events], groupIndex) => {
              const eventDate = new Date(dateKey)
              const isEventDateToday = isToday(eventDate)
              const isEventDatePast = isPast(eventDate) && !isToday(eventDate)
              
              return (
                <motion.div
                  key={dateKey}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: groupIndex * 0.1 }}
                  className="mb-6"
                >
                  {/* Date Header */}
                  <div className="flex items-center gap-2 mb-3">
                    <h2 className={`text-sm font-semibold ${
                      isEventDateToday 
                        ? 'text-primary' 
                        : isEventDatePast
                        ? 'text-muted-foreground'
                        : 'text-foreground'
                    }`}>
                      {formatEventDate(eventDate)}
                    </h2>
                    {isEventDateToday && (
                      <Badge className="bg-primary text-primary-foreground text-xs">Today</Badge>
                    )}
                  </div>

                  {/* Events for this date */}
                  <div className="space-y-3 lg:space-y-4">
                    {events.map((event, index) => {
                      const isPastEvent = isPast(event.startDate) || event.status === 'completed' || event.status === 'cancelled'
                      
                      return (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: (groupIndex * 0.1) + (index * 0.05) }}
                          onClick={() => handleEventClick(event)}
                          className={`p-4 lg:p-6 rounded-xl border-2 transition-all hover:shadow-md cursor-pointer ${
                            isPastEvent 
                              ? 'bg-surface/50 border-border/50 opacity-75' 
                              : 'bg-surface border-border hover:border-primary/20'
                          }`}
                        >
                          <div className="flex gap-3">
                            {/* Time Indicator */}
                            <div className="flex-shrink-0">
                              <div className={cn(
                                'h-12 w-12 rounded-lg flex items-center justify-center border-2',
                                isPastEvent 
                                  ? 'bg-muted text-muted-foreground border-border/50' 
                                  : getEventColor(event.status)
                              )}>
                                {getEventIcon(event.type)}
                              </div>
                            </div>

                            {/* Event Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <h3 className="font-semibold text-foreground mb-1">{event.title}</h3>
                                  {event.description && (
                                    <p className="text-sm text-muted-foreground line-clamp-1">{event.description}</p>
                                  )}
                                </div>
                                <Badge className={`${getEventColor(event.status)} text-xs`}>
                                  {event.status}
                                </Badge>
                              </div>

                              {/* Event Details */}
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Clock className="h-4 w-4" />
                                  <span>
                                    {formatEventTime(event.startDate)} - {formatEventTime(event.endDate)}
                                  </span>
                                </div>
                                
                                {event.location && (
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <MapPin className="h-4 w-4" />
                                    <span className="truncate">{event.location}</span>
                                  </div>
                                )}

                                {event.attendees && event.attendees.length > 0 && (
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Users className="h-4 w-4" />
                                    <span>{event.attendees.length} attendee{event.attendees.length > 1 ? 's' : ''}</span>
                                    <div className="flex -space-x-2 ml-2">
                                      {event.attendees.slice(0, 3).map((attendee) => (
                                        <Avatar key={attendee.id} className="h-6 w-6 border-2 border-background">
                                          <AvatarImage src={attendee.avatar} />
                                          <AvatarFallback>{attendee.name[0]}</AvatarFallback>
                                        </Avatar>
                                      ))}
                                      {event.attendees.length > 3 && (
                                        <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs">
                                          +{event.attendees.length - 3}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {event.relatedTo && (
                                  <div className="pt-2 border-t border-border/50">
                                    <p className="text-xs text-muted-foreground">
                                      Related to: <span className="font-medium text-foreground">{event.relatedTo.title}</span>
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </motion.div>
              )
            })
          )}
        </div>
      </main>
      
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <AuthDialog open={isDrawerOpen} onOpenChange={setIsDrawerOpen} />
    </div>
  )
}

