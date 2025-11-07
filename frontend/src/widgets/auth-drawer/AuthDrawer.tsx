import { useState } from 'react'
import { ChevronRight, Globe } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
} from '@/shared/ui/sheet'
import { Button } from '@/shared/ui/button'
import { cn } from '@/shared/lib/utils/cn'
import LogoSvg from '@/assets/images/logo.svg?react'
import { ROUTES } from '@/shared/constants/routes'
import { useNavigate } from 'react-router-dom'

interface AuthDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AuthDrawer({ open, onOpenChange }: AuthDrawerProps) {
  const navigate = useNavigate()
  const [selectedRole, setSelectedRole] = useState<'landlord' | 'tenant' | null>(null)
  const [language, setLanguage] = useState('en')


  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="w-full h-[50vh] rounded-t-[20px] sm:rounded-t-[24px] overflow-y-auto">
        <SheetHeader>
          <div className="flex justify-center -mt-6">
            <LogoSvg className="h-32 w-auto text-primary" />
          </div>
        </SheetHeader>

        <div className="space-y-6 -mt-6">
          {/* Role Selection */}
          <div className="space-y-3">
            <Button
              variant="outline"
              className={cn(
                'w-full h-16 justify-center bg-surface hover:bg-primary/80 rounded-xl text-lg',
                selectedRole === 'landlord' && 'border-primary border-2'
              )}
              onClick={() => setSelectedRole('landlord')}
            >
              <span className={selectedRole === 'landlord' ? 'font-semibold' : ''}>
                Landlord
              </span>
            </Button>
            <Button
              variant="outline"
              className={cn(
                'w-full h-16 justify-center bg-surface hover:bg-primary/80 rounded-xl text-lg',
                selectedRole === 'tenant' && 'border-primary border-2'
              )}
              onClick={() => setSelectedRole('tenant')}
            >
              <span className={selectedRole === 'tenant' ? 'font-semibold' : ''}>
                Tenant
              </span>
            </Button>
          </div>

          {/* Language Selection */}
          <Button
            variant="outline"
            className="w-full h-16 justify-between bg-surface hover:bg-primary/80 rounded-xl text-lg"
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

          {/* Login and Signup Buttons */}
          <div className="space-y-3">
            <Button
              className="w-full h-16 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-lg"
              onClick={() => {
                if (selectedRole) {
                  navigate(`${ROUTES.LOGIN}?role=${selectedRole}`, {
                    state: { from: ROUTES.HOME },
                  })
                  onOpenChange(false)
                }
              }}
              disabled={!selectedRole}
            >
              Login
            </Button>
            <Button
              variant="outline"
              className="w-full h-16 bg-surface hover:bg-primary/80 rounded-xl text-lg border-primary"
              onClick={() => {
                if (selectedRole) {
                  navigate(`${ROUTES.SIGNUP}?role=${selectedRole}`, {
                    state: { from: ROUTES.HOME },
                  })
                  onOpenChange(false)
                }
              }}
              disabled={!selectedRole}
            >
              Sign Up
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

