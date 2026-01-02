import { useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Input } from '@/shared/ui/input'
import { Badge } from '@/shared/ui/badge'
import { Sparkles, ArrowLeft, Home, Search, Compass } from 'lucide-react'
import { ROUTES } from '@/shared/constants/routes'
import { cn } from '@/shared/lib/utils/cn'

const gradientPills = [
  'from-primary/20 via-primary/10 to-primary/0 text-primary',
  'from-emerald-500/20 via-emerald-500/10 to-emerald-500/0 text-emerald-600',
  'from-amber-500/20 via-amber-500/10 to-amber-500/0 text-amber-600',
  'from-blue-500/20 via-blue-500/10 to-blue-500/0 text-blue-600',
]

const quickLinks = [
  { label: 'Go home', icon: Home, route: ROUTES.HOME },
  { label: 'Find properties', icon: Compass, route: ROUTES.PROPERTIES },
  { label: 'Book a service', icon: Sparkles, route: ROUTES.SERVICES },
]

export function NotFoundPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const pill = useMemo(() => gradientPills[Math.floor(Math.random() * gradientPills.length)], [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center px-4 py-10">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.08),_transparent_35%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(16,185,129,0.08),_transparent_35%)]" />
      </div>

      <Card className="relative w-full max-w-4xl border border-border/60 bg-background/90 backdrop-blur-xl shadow-2xl overflow-hidden">
        <div className="grid lg:grid-cols-[1.2fr,0.8fr]">
          <div className="p-8 lg:p-10 space-y-6 border-r border-border/60">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5" />
              Lost in the grid
            </div>

            <div className="space-y-2">
              <p className="text-sm uppercase tracking-[0.15em] text-muted-foreground">404 • Not found</p>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                We could not find the page you were looking for.
              </h1>
              <p className="text-muted-foreground text-sm lg:text-base max-w-xl">
                The link may be broken or the page may have moved. Use the shortcuts below to jump back into the flow.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {quickLinks.map((item) => {
                const Icon = item.icon
                return (
                  <Button
                    key={item.route}
                    variant="outline"
                    className="rounded-xl h-11 px-4 flex items-center gap-2"
                    onClick={() => navigate(item.route)}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                )
              })}
            </div>

            <div className="rounded-2xl border border-border/60 bg-muted/40 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-primary" />
                <p className="text-sm font-semibold text-foreground">Search or paste a URL</p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Input
                  defaultValue={location.pathname}
                  className="rounded-xl h-11 bg-background"
                  placeholder="Where do you want to go?"
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      const value = (event.target as HTMLInputElement).value.trim()
                      if (value) navigate(value.startsWith('/') ? value : `/${value}`)
                    }
                  }}
                />
                <Button
                  className="rounded-xl h-11 px-4"
                  onClick={() => navigate(ROUTES.HOME)}
                >
                  Back home
                </Button>
              </div>
            </div>
          </div>

          <div className="relative p-8 lg:p-10 space-y-6 bg-gradient-to-br from-primary/5 via-background to-background">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.12),_transparent_55%)]" aria-hidden />
            <div className="relative space-y-4">
              <div className={cn('inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold bg-gradient-to-r', pill)}>
                Not all who wander are lost
              </div>
              <div className="rounded-2xl border border-border/60 bg-background/70 backdrop-blur-sm p-6 space-y-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Suggested destinations</p>
                  <Badge className="rounded-full bg-primary/10 text-primary">Live</Badge>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground">Homes & rentals</span>
                    <Button variant="ghost" size="sm" className="rounded-lg px-3" onClick={() => navigate(ROUTES.PROPERTIES)}>
                      Explore
                    </Button>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground">Book a service</span>
                    <Button variant="ghost" size="sm" className="rounded-lg px-3" onClick={() => navigate(ROUTES.SERVICES)}>
                      Book now
                    </Button>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground">Talk to support</span>
                    <Button variant="ghost" size="sm" className="rounded-lg px-3" onClick={() => navigate(ROUTES.CONTACT)}>
                      Contact
                    </Button>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border/60 bg-primary/10 p-6 space-y-3">
                <p className="text-sm font-semibold text-foreground">Need a human?</p>
                <p className="text-xs text-muted-foreground">
                  Our support team can help you find the right page or action.
                </p>
                <Button
                  variant="outline"
                  className="rounded-xl h-10 px-4 border-primary/40 text-primary hover:bg-primary/10"
                  onClick={() => navigate(ROUTES.CONTACT)}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Message support
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
