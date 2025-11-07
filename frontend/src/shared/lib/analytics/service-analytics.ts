/**
 * Service Analytics Tracking
 * Tracks user interactions throughout the service booking flow
 */

interface AnalyticsEvent {
  event: string
  properties?: Record<string, any>
  timestamp?: number
  userId?: string
  sessionId?: string
}

// Get or create session ID
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('analytics_session_id')
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`
    sessionStorage.setItem('analytics_session_id', sessionId)
  }
  return sessionId
}

// Get current user ID from auth store
const getCurrentUserId = (): string | undefined => {
  try {
    const authData = localStorage.getItem('auth-storage')
    if (authData) {
      const parsed = JSON.parse(authData)
      return parsed?.state?.user?.id
    }
  } catch (error) {
    console.warn('Failed to get user ID from storage:', error)
  }
  return undefined
}

// Store events locally (can be sent to analytics service later)
const eventQueue: AnalyticsEvent[] = []

// Send event to analytics service (placeholder - replace with actual analytics provider)
const sendToAnalytics = (event: AnalyticsEvent) => {
  // In production, replace this with your analytics provider:
  // - Google Analytics: gtag('event', event.event, event.properties)
  // - Mixpanel: mixpanel.track(event.event, event.properties)
  // - Amplitude: amplitude.track(event.event, event.properties)
  
  // For now, log to console and store locally
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Analytics Event:', event)
  }
  
  // Store in queue (could be sent to backend in batches)
  eventQueue.push(event)
  
  // In production, you might want to:
  // 1. Send immediately to analytics service
  // 2. Batch and send periodically
  // 3. Send to your backend API endpoint
}

/**
 * Track a service-related event
 */
export const trackServiceEvent = (
  event: string,
  properties?: Record<string, any>
): void => {
  const eventData: AnalyticsEvent = {
    event,
    properties: {
      ...properties,
      page: globalThis.location.pathname,
      referrer: globalThis.document.referrer,
    },
    timestamp: Date.now(),
    userId: getCurrentUserId(),
    sessionId: getSessionId(),
  }

  sendToAnalytics(eventData)
}

/**
 * Track service page view
 */
export const trackServicePageView = (category?: string) => {
  trackServiceEvent('service_page_view', {
    category,
    url: globalThis.location.href,
  })
}

/**
 * Track service category click
 */
export const trackServiceCategoryClick = (categoryId: string, categoryName: string) => {
  trackServiceEvent('service_category_click', {
    categoryId,
    categoryName,
  })
}

/**
 * Track service card view
 */
export const trackServiceCardView = (serviceId: string, serviceName: string, category: string) => {
  trackServiceEvent('service_card_view', {
    serviceId,
    serviceName,
    category,
  })
}

/**
 * Track booking initiation
 */
export const trackBookingInitiated = (
  serviceId: string,
  serviceName: string,
  category: string,
  source: string
) => {
  trackServiceEvent('service_booking_initiated', {
    serviceId,
    serviceName,
    category,
    source, // 'hero_cta', 'quick_chip', 'service_card', etc.
  })
}

/**
 * Track form field interaction
 */
export const trackFormFieldInteraction = (
  field: string,
  action: 'focused' | 'changed' | 'blurred'
) => {
  trackServiceEvent(`service_booking_form_field_${action}`, {
    field,
  })
}

/**
 * Track form abandonment
 */
export const trackFormAbandoned = (step: string, fieldsCompleted: number) => {
  trackServiceEvent('service_booking_form_abandoned', {
    step,
    fieldsCompleted,
  })
}

/**
 * Track form completion
 */
export const trackFormCompleted = (serviceId: string, timeSpent: number) => {
  trackServiceEvent('service_booking_form_completed', {
    serviceId,
    timeSpent, // in milliseconds
  })
}

/**
 * Track booking confirmation
 */
export const trackBookingConfirmed = (bookingId: string, serviceId: string, amount: number) => {
  trackServiceEvent('service_booking_confirmed', {
    bookingId,
    serviceId,
    amount,
  })
}

/**
 * Get analytics queue (for debugging or batch sending)
 */
export const getAnalyticsQueue = (): AnalyticsEvent[] => {
  return [...eventQueue]
}

/**
 * Clear analytics queue
 */
export const clearAnalyticsQueue = (): void => {
  eventQueue.length = 0
}

