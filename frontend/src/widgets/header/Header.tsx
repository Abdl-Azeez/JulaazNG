import { Menu, User } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import LogoSvg from '@/assets/images/logo.svg?react'
import { cn } from '@/shared/lib/utils/cn'

interface HeaderProps {
  onMenuClick?: () => void
  onProfileClick?: () => void
  className?: string
}

export function Header({ onMenuClick, onProfileClick, className }: HeaderProps) {
  return (
    <header className={cn('sticky top-0 z-50 w-full border-b bg-surface', className)}>
      <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden bg-icon-bg"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </Button>
        
        <div className="flex-1 flex justify-center md:justify-start">
          <LogoSvg className="h-28 md:h-32 w-auto" />
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="bg-icon-bg"
          onClick={onProfileClick}
          aria-label="User profile"
        >
          <User className="h-6 w-6" />
        </Button>
      </div>
    </header>
  )
}

