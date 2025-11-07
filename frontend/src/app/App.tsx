import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { SplashScreen } from '@/widgets/splash-screen'
import { HomePage } from '@/pages/home'
import { PropertiesPage } from '@/pages/properties'
import { ProfilePage } from '@/pages/profile'
import { SettingsPage } from '@/pages/settings'
import { ServicesPage } from '@/pages/services'
import { LoginPage } from '@/pages/auth/login'
import { PasswordPage } from '@/pages/auth/password'
import { SignupPage } from '@/pages/auth/signup'
import { VerifyOtpPage } from '@/pages/auth/verify-otp'
import { ROUTES } from '@/shared/constants/routes'

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
        {showSplash && isMobile ? (
          <SplashScreen onComplete={handleSplashComplete} />
        ) : (
          <Routes>
            <Route path={ROUTES.HOME} element={<HomePage />} />
            <Route path={ROUTES.PROPERTIES} element={<PropertiesPage />} />
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.LOGIN_PASSWORD} element={<PasswordPage />} />
            <Route path={ROUTES.SIGNUP} element={<SignupPage />} />
            <Route path={ROUTES.VERIFY_OTP} element={<VerifyOtpPage />} />
            <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
            <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
            <Route path={ROUTES.SERVICES} element={<ServicesPage />} />
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
