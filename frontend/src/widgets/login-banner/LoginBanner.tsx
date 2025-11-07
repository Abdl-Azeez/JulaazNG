import { ArrowLeft } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import LogoSvg from '@/assets/images/logo.svg?react'
import loginBanner from '@/assets/images/loginBanner.jpg'
import { useNavigate, useLocation } from 'react-router-dom'
import { ROUTES } from '@/shared/constants/routes'

interface LoginBannerProps {
  showBackButton?: boolean
}

export function LoginBanner({ showBackButton = true }: LoginBannerProps) {
  const navigate = useNavigate()
  const location = useLocation()

  const handleBack = () => {
    // Check if we came from home page or if there's no history
    const state = location.state as { from?: string } | null
    const from = state?.from
    
    // If we have a specific referrer, go there
    if (from && from !== location.pathname) {
      navigate(from, { replace: true })
    } else {
      // Otherwise, go to home page
      navigate(ROUTES.HOME, { replace: true })
    }
  }

  return (
    <div className="relative h-[50vh] w-full overflow-hidden">
      <img
        src={loginBanner}
        alt="Login banner"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-foreground/20" />
      
      {showBackButton && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4 z-20 bg-background/90 hover:bg-background"
          onClick={handleBack}
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </Button>
      )}
      
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-primary">
          <LogoSvg className="h-20 w-auto drop-shadow-lg" />
        </div>
      </div>
    </div>
  )
}

