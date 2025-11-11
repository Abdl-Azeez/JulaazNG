import { useState, useMemo } from 'react'
import { ChevronRight, Globe, LogIn } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
} from '@/shared/ui/sheet'
import { Button } from '@/shared/ui/button'
// import { cn } from '@/shared/lib/utils/cn'
import LogoSvg from '@/assets/images/logo.svg?react'
import { ROUTES } from '@/shared/constants/routes'
import { useNavigate } from 'react-router-dom'

interface AuthDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AuthDrawer({ open, onOpenChange }: AuthDrawerProps) {
  const navigate = useNavigate()
  const [language, setLanguage] = useState('en')
  const languageLabel = useMemo(() => {
    const labels: Record<string, string> = {
      en: 'English',
      yo: 'Yorùbá',
      ha: 'Hausa',
      ig: 'Igbo',
    }
    return labels[language] ?? language
  }, [language])


  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="w-full h-[50vh] rounded-t-[20px] sm:rounded-t-[24px] overflow-y-auto">
        <SheetHeader>
          <div className="flex justify-center -mt-12">
            <LogoSvg className="h-32 w-32 md:h-44 md:w-44 text-primary" />
          </div>
        </SheetHeader>

        <div className="flex flex-col">
          <div className="flex-1">
            <div className="space-y-3">
              <Button
                className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-base font-semibold gap-2"
                onClick={() => {
                  navigate(ROUTES.LOGIN)
                  onOpenChange(false)
                }}
              >
                <LogIn className="h-4 w-4" />
                Login to Continue
              </Button>
              <Button
                variant="outline"
                className="w-full h-14 bg-surface hover:bg-primary/10 hover:text-primary rounded-xl text-base font-semibold border-primary/60"
                onClick={() => {
                  navigate(ROUTES.SIGNUP)
                  onOpenChange(false)
                }}
              >
                Create a free account
              </Button>
            </div>
          </div>

          <div className="mt-4">
            <div className="h-px bg-border/60" />
            <Button
              variant="ghost"
              className="w-full justify-between rounded-xl mt-3 px-4 py-3 text-sm text-muted-foreground hover:bg-primary/10 hover:text-primary"
              onClick={() => {
                const languages = ['en', 'yo', 'ha', 'ig']
                const currentIndex = languages.indexOf(language)
                const nextIndex = (currentIndex + 1) % languages.length
                setLanguage(languages[nextIndex])
              }}
            >
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span className="font-medium">Language</span>
              </div>
              <span className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
                {languageLabel}
                <ChevronRight className="h-3 w-3" />
              </span>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

