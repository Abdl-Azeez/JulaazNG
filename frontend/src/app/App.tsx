import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { SplashScreen } from '@/widgets/splash-screen'
import { HomePage } from '@/pages/home'
import { PropertiesPage } from '@/pages/properties'
import { PropertyDetailsPage, PropertyViewingPage } from '@/pages/property-details'
import { ProfilePage } from '@/pages/profile'
import { SettingsPage } from '@/pages/settings'
import { ServicesPage } from '@/pages/services'
import { LoginPage } from '@/pages/auth/login'
import { PasswordPage } from '@/pages/auth/password'
import { SignupPage } from '@/pages/auth/signup'
import { VerifyOtpPage } from '@/pages/auth/verify-otp'
import { MessagingPage } from '@/pages/messaging'
import { NotificationsPage } from '@/pages/notifications'
import { EventsPage } from '@/pages/events'
import { FavouritesPage } from '@/pages/favourites'
import { AgreementsPage } from '@/pages/tenant/agreements'
import { PaymentsPage } from '@/pages/tenant/payments'
import { MyBookingsPage } from '@/pages/my-bookings'
import { MyServicesPage } from '@/pages/my-services'
import {
  LandlordPropertiesPage,
  LandlordPropertyCreatePage,
  LandlordPropertyDetailsPage,
  LandlordPropertyInsightsPage,
  LandlordPropertyManagePage,
} from '@/pages/landlord/properties'
import { LandlordApplicationsPage } from '@/pages/landlord/applications'
import { LandlordEarningsPage } from '@/pages/landlord/earnings'
import { ROUTES } from '@/shared/constants/routes'
import { useThemeStore } from '@/shared/store/theme.store'
import { AboutPage, LandlordFaqPage, SitemapPage, BuildingsPage, TermsPage, CookiesPage, DisclaimerPage, ContactPage } from '@/pages/info'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname])

  return null
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

function App() {
  const [showSplash, setShowSplash] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const { theme } = useThemeStore()

  // Initialize theme on mount
  useEffect(() => {
    // Get theme from store (will use persisted value or default)
    const currentTheme = useThemeStore.getState().theme
    // Apply theme to document immediately
    document.documentElement.setAttribute('data-theme', currentTheme)
    const selectedTheme = useThemeStore.getState().getTheme()
    if (selectedTheme) {
      if (selectedTheme.type === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }, [])

  // Update theme when it changes
  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme)
    const selectedTheme = useThemeStore.getState().getTheme()
    if (selectedTheme) {
      if (selectedTheme.type === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }, [theme])

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      // If not mobile, skip splash screen
      if (!mobile) {
        setShowSplash(false)
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleSplashComplete = () => {
    setShowSplash(false)
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ScrollToTop />
        {showSplash && isMobile ? (
          <SplashScreen onComplete={handleSplashComplete} />
        ) : (
          <Routes>
            <Route path={ROUTES.HOME} element={<HomePage />} />
            <Route path={ROUTES.PROPERTIES} element={<PropertiesPage />} />
            <Route path="/properties/:id" element={<PropertyDetailsPage />} />
            <Route path="/properties/:id/booking" element={<PropertyViewingPage />} />
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.LOGIN_PASSWORD} element={<PasswordPage />} />
            <Route path={ROUTES.SIGNUP} element={<SignupPage />} />
            <Route path={ROUTES.VERIFY_OTP} element={<VerifyOtpPage />} />
            <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
            <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
            <Route path={ROUTES.SERVICES} element={<ServicesPage />} />
            <Route path={ROUTES.MESSAGING} element={<MessagingPage />} />
            <Route path="/messaging/:conversationId" element={<MessagingPage />} />
            <Route path={ROUTES.NOTIFICATIONS} element={<NotificationsPage />} />
            <Route path={ROUTES.EVENTS} element={<EventsPage />} />
            <Route path={ROUTES.FAVOURITES} element={<FavouritesPage />} />
            <Route path={ROUTES.MY_BOOKINGS} element={<MyBookingsPage />} />
            <Route path={ROUTES.MY_SERVICES} element={<MyServicesPage />} />
            <Route path={ROUTES.AGREEMENTS} element={<AgreementsPage />} />
            <Route path={ROUTES.PAYMENTS} element={<PaymentsPage />} />
            <Route path={ROUTES.LANDLORD_PROPERTIES} element={<LandlordPropertiesPage />} />
            <Route path={ROUTES.LANDLORD_PROPERTY_CREATE} element={<LandlordPropertyCreatePage />} />
            <Route path="/landlord/properties/:id" element={<LandlordPropertyDetailsPage />} />
            <Route path={ROUTES.LANDLORD_APPLICATIONS} element={<LandlordApplicationsPage />} />
            <Route path={ROUTES.LANDLORD_EARNINGS} element={<LandlordEarningsPage />} />
            <Route path="/landlord/properties/:id/insights" element={<LandlordPropertyInsightsPage />} />
            <Route path="/landlord/properties/:id/manage" element={<LandlordPropertyManagePage />} />
            <Route path={ROUTES.ABOUT} element={<AboutPage />} />
            <Route path={ROUTES.LANDLORD_FAQ} element={<LandlordFaqPage />} />
            <Route path={ROUTES.SITEMAP} element={<SitemapPage />} />
            <Route path={ROUTES.BUILDINGS} element={<BuildingsPage />} />
            <Route path={ROUTES.TERMS} element={<TermsPage />} />
            <Route path={ROUTES.COOKIES} element={<CookiesPage />} />
            <Route path={ROUTES.DISCLAIMER} element={<DisclaimerPage />} />
            <Route path={ROUTES.CONTACT} element={<ContactPage />} />
            <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
          </Routes>
        )}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'hsl(var(--card))',
              color: 'hsl(var(--card-foreground))',
              border: '1px solid hsl(var(--border))',
            },
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
