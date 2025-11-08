import { useLocation, useNavigate } from 'react-router-dom'
import { Building2, FileText, Wallet, MessageCircle } from 'lucide-react'
import { ROUTES } from '@/shared/constants/routes'
import { cn } from '@/shared/lib/utils/cn'

const navItems = [
  { label: 'My Property', icon: Building2, path: ROUTES.LANDLORD_PROPERTIES },
  { label: 'Applications', icon: FileText, path: ROUTES.LANDLORD_APPLICATIONS },
  { label: 'Payment', icon: Wallet, path: ROUTES.LANDLORD_EARNINGS },
  { label: 'Chat', icon: MessageCircle, path: ROUTES.MESSAGING },
]

interface Props {
  showMobile?: boolean
}

export function LandlordNav({ showMobile = false }: Props) {
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path: string) => location.pathname.startsWith(path)

  return (
    <>
      {/* Desktop pills */}
      <div className="hidden lg:flex items-center gap-3 bg-surface border border-border/60 rounded-2xl px-4 py-2 shadow-lg">
        {navItems.slice(0, 3).map((item) => {
          const active = isActive(item.path)
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all',
                active
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-transparent text-muted-foreground hover:text-primary hover:bg-primary/10'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          )
        })}
      </div>

      {/* Mobile floating nav - render only when explicitly enabled */}
      {showMobile && (
        <nav className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[92%] shadow-2xl">
          <div className="flex items-center justify-between rounded-3xl bg-surface/95 backdrop-blur-xl border border-border/60 px-2 py-1">
            {navItems.map((item) => {
              const active = isActive(item.path)
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    'flex flex-col items-center justify-center gap-1 flex-1 py-2 rounded-2xl transition-all duration-200',
                    active ? 'bg-primary/10 text-primary shadow-inner' : 'text-muted-foreground hover:text-primary'
                  )}
                >
                  <item.icon className={cn('h-5 w-5', active && 'scale-110')} />
                  <span className="text-[11px] font-semibold">{item.label}</span>
                </button>
              )
            })}
          </div>
        </nav>
      )}
    </>
  )
}

