import { useMemo, useState } from 'react'
import { Header } from '@/widgets/header'
import { Sidebar } from '@/widgets/sidebar'
import { Footer } from '@/widgets/footer'
import { AuthDrawer } from '@/widgets/auth-drawer'
import { useAuthStore } from '@/shared/store/auth.store'
import { LandlordNav } from '@/widgets/landlord-nav'
import { earningsSummary, earningSnapshots } from '../data/sample-earnings'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import { cn } from '@/shared/lib/utils/cn'
import type { EarningSnapshot } from '@/shared/types/landlord.types'
import { Sparkles, Wallet, Clock, ArrowUpRight, PieChart, PiggyBank } from 'lucide-react'
import { format } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/shared/constants/routes'
import toast from 'react-hot-toast'
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/shared/ui/sheet'

type FilterState = 'all' | 'received' | 'upcoming' | 'overdue'

const statusTone: Record<EarningSnapshot['status'], string> = {
  received: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/20',
  upcoming: 'bg-primary/10 text-primary border-primary/20',
  overdue: 'bg-destructive/10 text-destructive border-destructive/20',
}

export function LandlordEarningsPage() {
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [filter, setFilter] = useState<FilterState>('all')
  const [selectedEarning, setSelectedEarning] = useState<EarningSnapshot | null>(null)

  const filteredSnapshots = useMemo(() => {
    if (filter === 'all') return earningSnapshots
    return earningSnapshots.filter((earning) => earning.status === filter)
  }, [filter])

  const receivedTotal = earningSnapshots
    .filter((earning) => earning.status === 'received')
    .reduce((sum, earning) => sum + earning.amount, 0)
  const shortletTotal = earningSnapshots
    .filter((earning) => earning.bookingType === 'shortlet')
    .reduce((sum, earning) => sum + earning.amount, 0)
  const payoutSuccessRate = Math.round(
    (earningSnapshots.filter((earning) => earning.status === 'received').length / earningSnapshots.length) * 100
  )
  const nextUpcoming = earningSnapshots
    .filter((earning) => earning.status === 'upcoming')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0]

  const handleMenuClick = () => setIsSidebarOpen(true)
  const handleProfileClick = () => {
    if (!isAuthenticated) {
      setIsDrawerOpen(true)
    } else {
      navigate(ROUTES.PROFILE)
    }
  }

  return (
    <>
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-muted relative">
      <Header onMenuClick={handleMenuClick} onProfileClick={handleProfileClick} />
      <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-br from-primary/15 via-accent/20 to-transparent blur-3xl opacity-80 pointer-events-none" />

      <main className="relative z-10 flex-1 pb-28 lg:pb-16">
        <section className="container mx-auto px-4 lg:px-6 xl:px-8 max-w-6xl py-6 lg:py-10 space-y-8">
          <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary/10 via-background to-surface shadow-xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(34,197,94,0.18),_transparent_45%)]" />
            <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px] p-6 lg:p-8">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 backdrop-blur-lg border border-primary/20 shadow-lg">
                  <Wallet className="h-4 w-4 text-primary" />
                  <p className="text-xs font-semibold text-primary uppercase tracking-[0.25em]">
                    Earning tracker
                  </p>
                </div>
                <h1 className="text-3xl lg:text-4xl font-black text-foreground tracking-tight">Earnings</h1>
                <p className="text-muted-foreground max-w-2xl">
                  Blend long-term rent, shortlet bursts, and concierge fees. Monitor payouts, pending invoices, and conversion rates from a single console.
                </p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-primary/80">
                  <span className="flex items-center gap-2">
                    <PiggyBank className="h-4 w-4" /> ₦{(receivedTotal / 1_000_000).toFixed(1)}M received YTD
                  </span>
                  <span className="flex items-center gap-2">
                    <PieChart className="h-4 w-4" /> Shortlet contribution ₦{(shortletTotal / 1_000_000).toFixed(1)}M
                  </span>
                </div>
              </div>
              <div className="rounded-2xl border border-border/60 bg-background/80 backdrop-blur-xl shadow-lg p-5 space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Next payout</p>
                {nextUpcoming ? (
                  <div className="space-y-2">
                    <p className="text-lg font-semibold text-foreground">{nextUpcoming.propertyName}</p>
                    <p className="text-sm text-muted-foreground">Tenant: {nextUpcoming.tenantName}</p>
                    <p className="text-sm font-bold text-primary">
                      ₦{(nextUpcoming.amount / 1_000_000).toFixed(2)}M • {format(new Date(nextUpcoming.dueDate), 'd MMM, yyyy')}
                    </p>
                    <Button
                      variant="outline"
                      className="w-full rounded-xl border-primary/30 hover:bg-primary/10 hover:text-primary text-xs"
                      onClick={() => navigate(ROUTES.LANDLORD_EARNINGS)}
                    >
                      View payment history
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No upcoming payouts scheduled.</p>
                )}
              </div>
            </div>
          </div>

          {/* Summary grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              {
                label: 'Total this month',
                value: earningsSummary.totalMonth,
                suffix: 'M',
                gradient: 'from-primary/20 via-primary/10 to-transparent',
                icon: <Sparkles className="h-5 w-5 text-primary" />,
              },
              {
                label: 'Upcoming payments',
                value: earningsSummary.upcoming,
                suffix: 'M',
                gradient: 'from-accent/20 via-accent/10 to-transparent',
                icon: <Clock className="h-5 w-5 text-accent" />,
              },
              {
                label: 'Payout success',
                value: payoutSuccessRate,
                suffix: '%',
                gradient: 'from-emerald-500/20 via-emerald-500/10 to-transparent',
                icon: <ArrowUpRight className="h-5 w-5 text-emerald-500" />,
              },
              {
                label: 'Shortlet share',
                value: earningsSummary.shortletShare,
                suffix: 'M',
                gradient: 'from-primary/15 via-primary/5 to-transparent',
                icon: <PiggyBank className="h-5 w-5 text-primary" />,
              },
            ].map((metric) => (
              <div
                key={metric.label}
                className="group relative overflow-hidden rounded-3xl border border-border/60 bg-surface/95 backdrop-blur-xl shadow-lg hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"
              >
                <div className={cn('absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br', metric.gradient)} />
                <div className="relative p-5 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                      {metric.label}
                    </span>
                    <div className="p-3 rounded-2xl bg-background/80 border border-border/50 shadow-inner">
                      {metric.icon}
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    {metric.suffix === '%'
                      ? `${metric.value}${metric.suffix}`
                      : `₦${(metric.value / 1_000_000).toFixed(1)}${metric.suffix}`}
                  </p>
                  <div className="h-1 rounded-full bg-muted/60 overflow-hidden">
                    <div className="h-full w-3/4 rounded-full bg-primary/80 group-hover:w-full transition-all duration-700" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-4 overflow-x-auto">
            {(['all', 'received', 'upcoming', 'overdue'] as FilterState[]).map((tab) => {
              const active = filter === tab
              return (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={cn(
                    'px-4 py-2 rounded-xl text-sm font-semibold transition-all border',
                    active
                      ? 'bg-primary text-primary-foreground border-primary shadow-lg'
                      : 'border-border text-muted-foreground hover:border-primary/40 hover:text-primary'
                  )}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              )
            })}
          </div>

          {/* Earnings list */}
          <div className="space-y-4">
            {filteredSnapshots.map((earning) => (
              <article
                key={earning.id}
                className="relative overflow-hidden rounded-3xl border border-border/60 bg-surface/95 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all group"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-primary/5 via-primary/5 to-transparent" />
                <div className="relative p-5 lg:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-col md:flex-row md:items-center md:gap-3">
                      <h2 className="text-lg font-semibold text-foreground">{earning.propertyName}</h2>
                      <Badge className={cn('rounded-full border px-3 py-1 text-xs font-semibold shadow-sm', statusTone[earning.status])}>
                        {earning.status.charAt(0).toUpperCase() + earning.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-sm text-muted-foreground">
                      <div>
                        <span className="text-xs uppercase tracking-widest text-muted-foreground/80">Tenant</span>
                        <p className="text-foreground font-medium mt-1">{earning.tenantName}</p>
                      </div>
                      <div>
                        <span className="text-xs uppercase tracking-widest text-muted-foreground/80">Amount</span>
                        <p className="text-foreground font-medium mt-1">₦{(earning.amount / 1_000_000).toFixed(1)}M</p>
                      </div>
                      <div>
                        <span className="text-xs uppercase tracking-widest text-muted-foreground/80">Due</span>
                        <p className="text-foreground font-medium mt-1">
                          {format(new Date(earning.dueDate), 'd MMM, yyyy')}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs uppercase tracking-widest text-muted-foreground/80">Type</span>
                        <p className="text-foreground font-medium mt-1">
                          {earning.bookingType === 'annual' ? 'Annual Lease' : 'Shortlet'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      variant="outline"
                      className="rounded-2xl border-border hover:border-primary/40 hover:text-primary"
                      onClick={() => setSelectedEarning(earning)}
                    >
                      View Timeline
                    </Button>
                    <Button
                      className="rounded-2xl bg-primary text-primary-foreground shadow-lg hover:shadow-xl"
                      onClick={() => toast.success(`Reminder sent to ${earning.tenantName}`)}
                    >
                      Send Reminder
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <LandlordNav />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <AuthDrawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} />
      <Footer />
    </div>
    <Sheet open={!!selectedEarning} onOpenChange={(open) => !open && setSelectedEarning(null)}>
      <SheetContent side="bottom" className="w-full h-[65vh] rounded-t-[24px] sm:rounded-t-[30px] overflow-y-auto">
        <SheetHeader className="space-y-1">
          <SheetTitle>Payment Timeline</SheetTitle>
          {selectedEarning && (
            <p className="text-sm text-muted-foreground">
              {selectedEarning.propertyName} • ₦{(selectedEarning.amount / 1_000_000).toFixed(1)}M
            </p>
          )}
        </SheetHeader>
        <div className="mt-6 space-y-5">
          {selectedEarning && (
            <>
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full bg-primary" />
                  <div className="w-px h-12 bg-border/60" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Invoice generated</p>
                  <p className="text-sm text-muted-foreground">{selectedEarning.propertyName} rent invoice issued</p>
                  <p className="text-xs text-muted-foreground/80 mt-1">
                    {format(new Date(selectedEarning.dueDate), 'd MMM yyyy')}
                  </p>
                </div>
              </div>
              {selectedEarning.status !== 'received' && (
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="h-3 w-3 rounded-full bg-primary" />
                    <div className="w-px h-12 bg-border/60" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Upcoming payment</p>
                    <p className="text-sm text-muted-foreground">Reminder scheduled 48 hours before due date</p>
                    <p className="text-xs text-muted-foreground/80 mt-1">
                      {format(new Date(selectedEarning.dueDate), 'd MMM yyyy')}
                    </p>
                  </div>
                </div>
              )}
              {selectedEarning.paidDate && (
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="h-3 w-3 rounded-full bg-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Payment received</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedEarning.tenantName} completed payment
                    </p>
                    <p className="text-xs text-muted-foreground/80 mt-1">
                      {format(new Date(selectedEarning.paidDate), 'd MMM yyyy')}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        <SheetFooter className="mt-6">
          <Button
            className="rounded-2xl bg-primary text-primary-foreground"
            onClick={() => {
              if (selectedEarning) {
                toast.success(`Shared timeline with ${selectedEarning.tenantName}`)
              }
              setSelectedEarning(null)
            }}
          >
            Share timeline
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
    </>
  )
}

