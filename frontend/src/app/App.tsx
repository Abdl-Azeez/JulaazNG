import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { SplashScreen } from '@/widgets/splash-screen'
import { HomePage } from '@/pages/home'
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
