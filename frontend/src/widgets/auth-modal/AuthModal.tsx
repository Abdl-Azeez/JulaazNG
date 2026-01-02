import { useState } from 'react'
import { ChevronRight, Globe, Mail } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from '@/shared/ui/dialog'
import { Button } from '@/shared/ui/button'
import LogoSvg from '@/assets/images/logo.svg?react'
import { ROUTES } from '@/shared/constants/routes'
import { useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const baseState = { backgroundLocation: location, modal: true }
  const [language, setLanguage] = useState('en')

  const handleGmailSSO = () => {
    const apiUrl = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '')
    if (!apiUrl) {
      toast.error('SSO is not configured')
      return
    }

    const next = encodeURIComponent(sessionStorage.getItem('intendedDestination') || ROUTES.HOME)
    window.location.assign(`${apiUrl}/auth/google?next=${next}`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center">
            <LogoSvg className="h-40 w-40 md:h-44 md:w-44 text-primary" />
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Language Selection */}
          <Button
            variant="outline"
            className="w-full h-14 justify-between bg-surface hover:bg-primary/80 rounded-xl text-base"
            onClick={() => {
              // Handle language selection
              const languages = ['en', 'yo', 'ha', 'ig']
              const currentIndex = languages.indexOf(language)
              const nextIndex = (currentIndex + 1) % languages.length
              setLanguage(languages[nextIndex])
            }}
          >
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span>Language - {language}</span>
            </div>
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* SSO */}
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full h-14 justify-center rounded-xl text-base"
              onClick={() => {
                handleGmailSSO()
                onOpenChange(false)
              }}
            >
              <Mail className="h-4 w-4 mr-2" />
              Continue with Gmail
            </Button>
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">or</span>
              <div className="h-px flex-1 bg-border" />
            </div>
          </div>

          {/* Login and Signup Buttons */}
          <div className="space-y-3">
            <Button
              className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-base font-semibold"
              onClick={() => {
                navigate(ROUTES.LOGIN, {
                    state: baseState,
                  })
                  onOpenChange(false)
              }}
            >
              Login
            </Button>
            <Button
              variant="outline"
              className="w-full h-14 bg-surface hover:bg-primary/80 rounded-xl text-base border-primary font-semibold"
              onClick={() => {
                navigate(ROUTES.SIGNUP, {
                    state: baseState,
                  })
                  onOpenChange(false)
              }}
            >
              Sign Up
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

