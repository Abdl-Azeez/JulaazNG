import { useState } from 'react'
import { Header } from '@/widgets/header'
import { Sidebar } from '@/widgets/sidebar'
import { Footer } from '@/widgets/footer'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import {
  Calendar,
  ClipboardCheck,
  MapPin,
  Phone,
  Wrench,
  CheckCircle2,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/shared/lib/utils/cn'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/shared/constants/routes'
import {
  JobChecklistDrawer,
  JobSheetDrawer,
} from './components'

import {
  upcomingJobs,
  performanceHighlights,
  onboardingChecklist,
} from '@/__mocks__/data/handyman.mock'

export function HandymanDashboardPage() {
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isChecklistOpen, setIsChecklistOpen] = useState(false)
  const [isJobSheetOpen, setIsJobSheetOpen] = useState(false)
  const [selectedJobId, setSelectedJobId] = useState<string | undefined>()

  const handleProfileClick = () => {
    navigate(ROUTES.PROFILE)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        onMenuClick={() => setIsSidebarOpen(true)}
        onProfileClick={handleProfileClick}
        className="lg:shadow-sm"
      />

      <main className="flex-1">
        <section className="border-b border-border/60 bg-gradient-to-br from-primary/5 via-background to-background">
          <div className="container mx-auto max-w-6xl px-4 lg:px-6 xl:px-8 py-10 lg:py-14">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="space-y-3">
                <Badge className="rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold">
                  Handyman HQ
                </Badge>
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground">Welcome back, pro.</h1>
                <p className="text-muted-foreground max-w-2xl">
                  Track active assignments, confirm upcoming jobs and access the resources you need to deliver
                  premium service on every call-out.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button
                    className="rounded-xl h-11 px-5 flex items-center gap-2"
                    onClick={() => setIsChecklistOpen(true)}
                  >
                    <ClipboardCheck className="h-4 w-4" />
                    View job checklist
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-xl h-11 px-5 flex items-center gap-2"
                    onClick={() => navigate(ROUTES.HANDYMAN_UPCOMING_ROTA)}
                  >
                    <Calendar className="h-4 w-4" />
                    Upcoming rota
                  </Button>
                </div>
              </div>
              <Card className="w-full max-w-sm rounded-2xl border-border/60 bg-background/80 shadow-lg p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Today’s focus</p>
                    <p className="text-sm font-semibold text-foreground">
                      2 emergency tickets • 1 maintenance cycle
                    </p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Confirm readiness 30 minutes before each dispatch. Update job notes at every milestone to
                  maintain your elite score.
                </p>
              </Card>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 mt-6">
              <Card className="rounded-2xl border border-border/60 bg-primary/5 p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-primary font-semibold">Ratings fuel referrals</p>
                    <p className="text-sm text-muted-foreground">Keep a 4.7★+ average to stay in priority rotation.</p>
                  </div>
                  <Badge className="bg-primary text-primary-foreground">Elite target: 4.7★</Badge>
                </div>
              </Card>
              <Card className="rounded-2xl border border-border/60 bg-amber-50 p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-amber-700 font-semibold">Service points</p>
                    <p className="text-sm text-muted-foreground">Earn 1pt per ₦10k job value; redeem for tools & boosts.</p>
                  </div>
                  <Badge className="bg-amber-600 text-amber-50">Points apply to services</Badge>
                </div>
              </Card>
            </div>
          </div>
        </section>

        <section className="container mx-auto max-w-6xl px-4 lg:px-6 xl:px-8 py-8 lg:py-12 flex flex-col gap-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {performanceHighlights.map((highlight) => {
              const Icon = highlight.icon
              return (
                <Card
                  key={highlight.id}
                  className="p-5 rounded-2xl border border-border/60 bg-background/80 shadow-sm space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">{highlight.label}</p>
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-2xl font-semibold text-foreground">{highlight.value}</p>
                  <p className="text-xs text-muted-foreground">{highlight.description}</p>
                </Card>
              )
            })}
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
            <Card className="rounded-2xl border border-border/60 bg-background/80 shadow-sm">
              <div className="p-5 border-b border-border/50 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Upcoming assignments</h2>
                  <p className="text-xs text-muted-foreground">
                    Confirm attendance and update status as you are en route.
                  </p>
                </div>
                <Button
                  variant="ghost"
                  className="rounded-xl text-sm"
                  onClick={() => navigate(ROUTES.HANDYMAN_ASSIGNMENTS)}
                >
                  View all
                </Button>
              </div>
              <div className="divide-y divide-border/60">
                {upcomingJobs.map((job) => (
                  <div key={job.id} className="p-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge
                          className={cn(
                            'rounded-full px-2.5 py-0.5 text-[11px]',
                            job.badge === 'Priority'
                              ? 'bg-destructive/10 text-destructive'
                              : 'bg-primary/10 text-primary'
                          )}
                        >
                          {job.badge}
                        </Badge>
                        <p className="text-xs text-muted-foreground">{job.scheduledFor}</p>
                      </div>
                      <h3 className="text-base font-semibold text-foreground">{job.title}</h3>
                      <p className="text-sm text-muted-foreground">{job.client}</p>
                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-primary" />
                          {job.location}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Phone className="h-3.5 w-3.5 text-primary" />
                          {job.contact}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col lg:items-end gap-2">
                      <Badge
                        className={cn(
                          'rounded-full px-3 py-1 text-xs font-medium',
                          job.status === 'enroute'
                            ? 'bg-amber-500/10 text-amber-600'
                            : 'bg-emerald-500/10 text-emerald-600'
                        )}
                      >
                        {job.status === 'enroute' ? 'En route' : 'Confirmed'}
                      </Badge>
                      <Button
                        className="rounded-xl h-10 px-4 text-sm"
                        onClick={() => {
                          setSelectedJobId(job.id)
                          setIsJobSheetOpen(true)
                        }}
                      >
                        Open job sheet
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <div className="space-y-6">
              <Card className="rounded-2xl border border-border/60 bg-background/80 shadow-sm p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">Build your elite badge</h2>
                </div>
                <p className="text-xs text-muted-foreground">
                  Complete the checklist to unlock “Julaaz Elite” badge. This gives you priority access to
                  high-value emergency jobs and concierge referrals.
                </p>
                <div className="space-y-3">
                  {onboardingChecklist.map((item) => (
                    <div
                      key={item.id}
                      className={cn(
                        'rounded-xl border px-3 py-2 text-sm flex items-start gap-3',
                        item.completed ? 'border-primary/30 bg-primary/5' : 'border-border bg-background'
                      )}
                    >
                      {item.completed ? (
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border border-border mt-0.5" />
                      )}
                      <div>
                        <p className="font-medium text-foreground">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  className="rounded-xl h-10 px-4 text-sm"
                  onClick={() => {
                    navigate(`${ROUTES.PROFILE}#background-check`)
                    // Scroll to background check section after navigation
                    setTimeout(() => {
                      const element = document.getElementById('background-check')
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                      }
                    }, 100)
                  }}
                >
                  Continue verification
                </Button>
              </Card>

              <Card className="rounded-2xl border border-border/60 bg-background/80 shadow-sm p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">Schedules & training</h2>
                </div>
                <p className="text-xs text-muted-foreground">
                  Join weekly refreshers, get notified about supply pick-ups and request additional hands when
                  worksite load increases.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge className="rounded-full bg-primary/10 text-primary px-3 py-1 text-xs">
                    Tool restock: Wednesday
                  </Badge>
                  <Badge className="rounded-full bg-primary/10 text-primary px-3 py-1 text-xs">
                    Safety refresher: Friday
                  </Badge>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <JobChecklistDrawer open={isChecklistOpen} onOpenChange={setIsChecklistOpen} />
      <JobSheetDrawer
        open={isJobSheetOpen}
        onOpenChange={setIsJobSheetOpen}
        jobId={selectedJobId}
      />
    </div>
  )
}

