import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import type { Location } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { SplashScreen } from '@/widgets/splash-screen'
import { RoleGuard } from '@/common/guards/RoleGuard'
import { HomePage } from '@/pages/home'
import { PropertiesPage } from '@/pages/properties'
import { PropertyDetailsPage, PropertyViewingPage } from '@/pages/property-details'
import { ProfilePage } from '@/pages/profile'
import { SettingsPage } from '@/pages/settings'
import { ServicesPage, ServiceJourneyPage } from '@/pages/services'
import {
  HandymanDashboardPage,
  HandymanJobsPage,
  UpcomingRotaPage,
  ViewAllAssignmentsPage,
} from '@/pages/handyman'
import { RealtorDashboardPage } from '@/pages/realtor/RealtorDashboardPage'
import { RealtorPropertiesPage } from '@/pages/realtor/properties'
import { RealtorEarningsPage } from '@/pages/realtor/earnings'
import { RealtorTenantsPage } from '@/pages/realtor/tenants'
import {
  HomerunnerDashboardPage,
  HomerunnerInspectionsPage,
  HomerunnerViewingsPage,
  HomerunnerEarningsPage,
} from '@/pages/homerunner'
import {
  AdminDashboardPage,
  AdminApprovalsPage,
  AdminApplicationsPage,
  AdminAnalyticsPage,
  AdminUsersPage,
  AdminPropertiesPage,
  AdminPropertyDetailsPage,
  AdminPaymentsPage,
  AdminDisputesPage,
  AdminServicesPage,
  AdminBackgroundChecksPage,
} from '@/pages/admin'
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
import { NotFoundPage } from '@/pages/not-found'
import { LoginModal } from '@/pages/auth/login/LoginModal'
import { SignupModal } from '@/pages/auth/signup/SignupModal'
import { PasswordModal } from '@/pages/auth/password/PasswordModal'
import { VerifyOtpModal } from '@/pages/auth/verify-otp/VerifyOtpModal'
import { RoleGateway } from '@/widgets/role-gateway/RoleGateway'

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
      staleTime: 5 * 60 * 1000,
    },
  },
})

type ModalLocationState = {
  backgroundLocation?: Location
  modal?: boolean
}

import { useRoleStore } from '@/shared/store/role.store'

interface AppRoutesProps {
  showSplash: boolean
  isMobile: boolean
  onSplashComplete: () => void
}

function AppRoutes({ showSplash, isMobile, onSplashComplete }: AppRoutesProps) {
  const location = useLocation()
  const state = location.state as ModalLocationState | undefined
  const showModalOverlay = Boolean(!isMobile && state?.modal && state.backgroundLocation)
  const routesLocation = showModalOverlay && state?.backgroundLocation ? state.backgroundLocation : location
  const { activeRole } = useRoleStore()

  if (showSplash && isMobile) {
    return <SplashScreen onComplete={onSplashComplete} />
  }

  const homeElement =
    activeRole === 'realtor' ? <Navigate to={ROUTES.REALTOR_DASHBOARD} replace /> : <HomePage />

  return (
    <>
      <Routes location={routesLocation}>
        <Route path={ROUTES.HOME} element={homeElement} />
        <Route
          path={ROUTES.PROPERTIES}
          element={
            <RoleGuard disallowedRoles={['landlord']} allowUnauthenticated redirectTo={ROUTES.HOME}>
              <PropertiesPage />
            </RoleGuard>
          }
        />
        <Route
          path="/properties/:id"
          element={
            <RoleGuard allowUnauthenticated redirectTo={ROUTES.HOME}>
              <PropertyDetailsPage />
            </RoleGuard>
          }
        />
        <Route
          path="/properties/:id/booking"
          element={
            <RoleGuard allowedRoles={['tenant']} redirectTo={ROUTES.HOME}>
              <PropertyViewingPage />
            </RoleGuard>
          }
        />
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.LOGIN_PASSWORD} element={<PasswordPage />} />
        <Route path={ROUTES.SIGNUP} element={<SignupPage />} />
        <Route path={ROUTES.VERIFY_OTP} element={<VerifyOtpPage />} />
        <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
        <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
        <Route path={ROUTES.SERVICES} element={<ServicesPage />} />
        <Route path={ROUTES.SERVICE_JOURNEY(':journeySlug')} element={<ServiceJourneyPage />} />
        <Route path={ROUTES.MESSAGING} element={<MessagingPage />} />
        <Route path="/messaging/:conversationId" element={<MessagingPage />} />
        <Route path={ROUTES.NOTIFICATIONS} element={<NotificationsPage />} />
        <Route path={ROUTES.EVENTS} element={<EventsPage />} />
        <Route
          path={ROUTES.FAVOURITES}
          element={
            <RoleGuard allowedRoles={['tenant', 'landlord']} redirectTo={ROUTES.HOME}>
              <FavouritesPage />
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.MY_BOOKINGS}
          element={
            <RoleGuard allowedRoles={['tenant']} redirectTo={ROUTES.HOME}>
              <MyBookingsPage />
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.MY_SERVICES}
          element={
            <RoleGuard allowedRoles={['tenant', 'landlord']} redirectTo={ROUTES.HOME}>
              <MyServicesPage />
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.HANDYMAN_DASHBOARD}
          element={
            <RoleGuard allowedRoles={['handyman']} redirectTo={ROUTES.HOME}>
              <HandymanDashboardPage />
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.HANDYMAN_JOBS}
          element={
            <RoleGuard allowedRoles={['handyman']} redirectTo={ROUTES.HANDYMAN_DASHBOARD}>
              <HandymanJobsPage />
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.HANDYMAN_UPCOMING_ROTA}
          element={
            <RoleGuard allowedRoles={['handyman']} redirectTo={ROUTES.HANDYMAN_DASHBOARD}>
              <UpcomingRotaPage />
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.HANDYMAN_ASSIGNMENTS}
          element={
            <RoleGuard allowedRoles={['handyman']} redirectTo={ROUTES.HANDYMAN_DASHBOARD}>
              <ViewAllAssignmentsPage />
            </RoleGuard>
          }
        />
        {/* Homerunner Routes */}
        <Route
          path={ROUTES.HOMERUNNER_DASHBOARD}
          element={
            <RoleGuard allowedRoles={['homerunner']} redirectTo={ROUTES.HOME}>
              <HomerunnerDashboardPage />
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.HOMERUNNER_INSPECTIONS}
          element={
            <RoleGuard allowedRoles={['homerunner']} redirectTo={ROUTES.HOMERUNNER_DASHBOARD}>
              <HomerunnerInspectionsPage />
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.HOMERUNNER_VIEWINGS}
          element={
            <RoleGuard allowedRoles={['homerunner']} redirectTo={ROUTES.HOMERUNNER_DASHBOARD}>
              <HomerunnerViewingsPage />
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.HOMERUNNER_EARNINGS}
          element={
            <RoleGuard allowedRoles={['homerunner']} redirectTo={ROUTES.HOMERUNNER_DASHBOARD}>
              <HomerunnerEarningsPage />
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.HOMERUNNER_SCHEDULE}
          element={
            <RoleGuard allowedRoles={['homerunner']} redirectTo={ROUTES.HOMERUNNER_DASHBOARD}>
              <HomerunnerDashboardPage />
            </RoleGuard>
          }
        />
        {/* Realtor Routes */}
        <Route
          path={ROUTES.REALTOR_DASHBOARD}
          element={
            <RoleGuard allowedRoles={['realtor']} redirectTo={ROUTES.HOME}>
              <RealtorDashboardPage />
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.REALTOR_PROPERTIES}
          element={
            <RoleGuard allowedRoles={['realtor']} redirectTo={ROUTES.REALTOR_DASHBOARD}>
              <RealtorPropertiesPage />
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.REALTOR_EARNINGS}
          element=
          {
            <RoleGuard allowedRoles={['realtor']} redirectTo={ROUTES.REALTOR_DASHBOARD}>
              <RealtorEarningsPage />
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.REALTOR_TENANTS}
          element={
            <RoleGuard allowedRoles={['realtor']} redirectTo={ROUTES.REALTOR_DASHBOARD}>
              <RealtorTenantsPage />
            </RoleGuard>
          }
        />
        {/* Admin Routes */}
        <Route
          path={ROUTES.ADMIN}
          element={
            <RoleGuard allowedRoles={['admin']} redirectTo={ROUTES.HOME}>
              <AdminDashboardPage />
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.ADMIN_DASHBOARD}
          element={
            <RoleGuard allowedRoles={['admin']} redirectTo={ROUTES.HOME}>
              <AdminDashboardPage />
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.ADMIN_APPROVALS}
          element={
            <RoleGuard allowedRoles={['admin']} redirectTo={ROUTES.ADMIN_DASHBOARD}>
              <AdminApprovalsPage />
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.ADMIN_APPLICATIONS}
          element={
            <RoleGuard allowedRoles={['admin']} redirectTo={ROUTES.ADMIN_DASHBOARD}>
              <AdminApplicationsPage />
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.ADMIN_ANALYTICS}
          element={
            <RoleGuard allowedRoles={['admin']} redirectTo={ROUTES.ADMIN_DASHBOARD}>
              <AdminAnalyticsPage />
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.ADMIN_USERS}
          element={
            <RoleGuard allowedRoles={['admin']} redirectTo={ROUTES.ADMIN_DASHBOARD}>
              <AdminUsersPage />
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.ADMIN_PROPERTIES}
          element={
            <RoleGuard allowedRoles={['admin']} redirectTo={ROUTES.ADMIN_DASHBOARD}>
              <AdminPropertiesPage />
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.ADMIN_PROPERTY_DETAILS(':id')}
          element={
            <RoleGuard allowedRoles={['admin']} redirectTo={ROUTES.ADMIN_DASHBOARD}>
              <AdminPropertyDetailsPage />
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.ADMIN_SERVICES}
          element={
            <RoleGuard allowedRoles={['admin']} redirectTo={ROUTES.ADMIN_DASHBOARD}>
              <AdminServicesPage />
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.ADMIN_PAYMENTS}
          element={
            <RoleGuard allowedRoles={['admin']} redirectTo={ROUTES.ADMIN_DASHBOARD}>
              <AdminPaymentsPage />
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.ADMIN_DISPUTES}
          element={
            <RoleGuard allowedRoles={['admin']} redirectTo={ROUTES.ADMIN_DASHBOARD}>
              <AdminDisputesPage />
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.ADMIN_BACKGROUND_CHECKS}
          element={
            <RoleGuard allowedRoles={['admin']} redirectTo={ROUTES.ADMIN_DASHBOARD}>
              <AdminBackgroundChecksPage />
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.AGREEMENTS}
          element={
            <RoleGuard allowedRoles={['tenant']} redirectTo={ROUTES.HOME}>
              <AgreementsPage />
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.PAYMENTS}
          element={
            <RoleGuard allowedRoles={['tenant']} redirectTo={ROUTES.HOME}>
              <PaymentsPage />
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.LANDLORD_PROPERTIES}
          element={
            <RoleGuard allowedRoles={['landlord']} redirectTo={ROUTES.HOME}>
              <LandlordPropertiesPage />
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.LANDLORD_PROPERTY_CREATE}
          element={
            <RoleGuard allowedRoles={['landlord']} redirectTo={ROUTES.HOME}>
              <LandlordPropertyCreatePage />
            </RoleGuard>
          }
        />
        <Route
          path="/landlord/properties/:id"
          element={
            <RoleGuard allowedRoles={['landlord']} redirectTo={ROUTES.HOME}>
              <LandlordPropertyDetailsPage />
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.LANDLORD_APPLICATIONS}
          element={
            <RoleGuard allowedRoles={['landlord']} redirectTo={ROUTES.HOME}>
              <LandlordApplicationsPage />
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.LANDLORD_EARNINGS}
          element={
            <RoleGuard allowedRoles={['landlord']} redirectTo={ROUTES.HOME}>
              <LandlordEarningsPage />
            </RoleGuard>
          }
        />
        <Route
          path="/landlord/properties/:id/insights"
          element={
            <RoleGuard allowedRoles={['landlord']} redirectTo={ROUTES.HOME}>
              <LandlordPropertyInsightsPage />
            </RoleGuard>
          }
        />
        <Route
          path="/landlord/properties/:id/manage"
          element={
            <RoleGuard allowedRoles={['landlord']} redirectTo={ROUTES.HOME}>
              <LandlordPropertyManagePage />
            </RoleGuard>
          }
        />
        <Route path={ROUTES.ABOUT} element={<AboutPage />} />
        <Route path={ROUTES.LANDLORD_FAQ} element={<LandlordFaqPage />} />
        <Route path={ROUTES.SITEMAP} element={<SitemapPage />} />
        <Route path={ROUTES.BUILDINGS} element={<BuildingsPage />} />
        <Route path={ROUTES.TERMS} element={<TermsPage />} />
        <Route path={ROUTES.COOKIES} element={<CookiesPage />} />
        <Route path={ROUTES.DISCLAIMER} element={<DisclaimerPage />} />
        <Route path={ROUTES.CONTACT} element={<ContactPage />} />
        <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to={ROUTES.NOT_FOUND} replace />} />
      </Routes>

      {showModalOverlay && (
        <Routes>
          <Route path={ROUTES.LOGIN} element={<LoginModal />} />
          <Route path={ROUTES.SIGNUP} element={<SignupModal />} />
          <Route path={ROUTES.LOGIN_PASSWORD} element={<PasswordModal />} />
          <Route path={ROUTES.VERIFY_OTP} element={<VerifyOtpModal />} />
        </Routes>
      )}
    </>
  )
}

function App() {
  const [showSplash, setShowSplash] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const { theme } = useThemeStore()

  useEffect(() => {
    const currentTheme = useThemeStore.getState().theme
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

  useEffect(() => {
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
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
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
        <AppRoutes showSplash={showSplash} isMobile={isMobile} onSplashComplete={handleSplashComplete} />
        <RoleGateway />
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
