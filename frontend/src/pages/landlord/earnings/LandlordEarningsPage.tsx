import { useMemo, useState } from 'react'
import { Header } from '@/widgets/header'
import { Sidebar } from '@/widgets/sidebar'
import { Footer } from '@/widgets/footer'
import { AuthDialog } from '@/widgets/auth-dialog'
import { useAuthStore } from '@/shared/store/auth.store'
import { LandlordNav } from '@/widgets/landlord-nav'
import { earningsSummary, earningSnapshots } from '../data/sample-earnings'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import { cn } from '@/shared/lib/utils/cn'
import type { EarningSnapshot } from '@/shared/types/landlord.types'
import { Sparkles, Wallet, Clock, PiggyBank, TrendingUp, Calendar, DollarSign, Activity, Zap } from 'lucide-react'
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

  const monthlyTrend = useMemo(() => {
    // Simulate monthly data for visualization
    return [
      { month: 'May', amount: 4200000 },
      { month: 'Jun', amount: 4800000 },
      { month: 'Jul', amount: 5100000 },
      { month: 'Aug', amount: 5400000 },
    ]
  }, [])

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
        <section className="container mx-auto px-4 lg:px-6 xl:px-8 max-w-7xl py-6 lg:py-10 space-y-6">
          {/* Hero Dashboard Header */}
          <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary/10 via-background to-surface shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(34,197,94,0.18),_transparent_45%)]" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
            <div className="relative grid gap-6 lg:grid-cols-[1fr_320px] p-6 lg:p-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 backdrop-blur-lg border border-primary/20 shadow-lg">
                  <Wallet className="h-4 w-4 text-primary" />
                  <p className="text-xs font-semibold text-primary uppercase tracking-[0.25em]">
                    Earnings Dashboard
                  </p>
                </div>
                <div className="space-y-2">
                  <h1 className="text-4xl lg:text-5xl font-black text-foreground tracking-tight">
                    ₦{(receivedTotal / 1_000_000).toFixed(1)}M
                    <span className="text-2xl lg:text-3xl text-muted-foreground ml-2">Total Earnings</span>
                  </h1>
                  <p className="text-muted-foreground text-lg max-w-2xl">
                    Track your revenue streams across long-term leases, shortlets, and concierge services in real-time.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                    <span className="font-semibold text-emerald-600">+12%</span>
                    <span className="text-muted-foreground">vs last month</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20">
                    <PiggyBank className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-primary">₦{(shortletTotal / 1_000_000).toFixed(1)}M</span>
                    <span className="text-muted-foreground">from shortlets</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-accent/10 border border-accent/20">
                    <Zap className="h-4 w-4 text-accent" />
                    <span className="font-semibold text-accent">{payoutSuccessRate}%</span>
                    <span className="text-muted-foreground">success rate</span>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-primary/5 via-background/80 to-background backdrop-blur-xl shadow-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Next Payout</p>
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                {nextUpcoming ? (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <p className="text-xl font-bold text-foreground">{nextUpcoming.propertyName}</p>
                      <p className="text-sm text-muted-foreground">{nextUpcoming.tenantName}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                      <p className="text-2xl font-black text-primary mb-1">
                        ₦{(nextUpcoming.amount / 1_000_000).toFixed(2)}M
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Due {format(new Date(nextUpcoming.dueDate), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full rounded-xl border-primary/30 hover:bg-primary/10 hover:text-primary"
                      onClick={() => navigate(ROUTES.LANDLORD_EARNINGS)}
                    >
                      View Timeline
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No upcoming payouts scheduled.</p>
                )}
              </div>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: 'This Month',
                value: earningsSummary.totalMonth,
                suffix: 'M',
                change: '+12%',
                trend: 'up',
                gradient: 'from-primary/20 via-primary/10 to-transparent',
                icon: <DollarSign className="h-5 w-5 text-primary" />,
                bg: 'bg-primary/5',
              },
              {
                label: 'Upcoming',
                value: earningsSummary.upcoming,
                suffix: 'M',
                change: '3 payments',
                trend: 'neutral',
                gradient: 'from-accent/20 via-accent/10 to-transparent',
                icon: <Clock className="h-5 w-5 text-accent" />,
                bg: 'bg-accent/5',
              },
              {
                label: 'Success Rate',
                value: payoutSuccessRate,
                suffix: '%',
                change: '+5%',
                trend: 'up',
                gradient: 'from-emerald-500/20 via-emerald-500/10 to-transparent',
                icon: <Activity className="h-5 w-5 text-emerald-500" />,
                bg: 'bg-emerald-500/5',
              },
              {
                label: 'Shortlet Share',
                value: earningsSummary.shortletShare,
                suffix: 'M',
                change: '18% of total',
                trend: 'neutral',
                gradient: 'from-primary/15 via-primary/5 to-transparent',
                icon: <PiggyBank className="h-5 w-5 text-primary" />,
                bg: 'bg-primary/5',
              },
            ].map((metric) => (
              <div
                key={metric.label}
                className="group relative overflow-hidden rounded-3xl border border-border/60 bg-surface/95 backdrop-blur-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className={cn('absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br', metric.gradient)} />
                <div className="relative p-6 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                      {metric.label}
                    </span>
                    <div className={cn('p-3 rounded-2xl border border-border/50 shadow-inner', metric.bg)}>
                      {metric.icon}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-3xl font-black text-foreground">
                      {metric.suffix === '%'
                        ? `${metric.value}${metric.suffix}`
                        : `₦${(metric.value / 1_000_000).toFixed(1)}${metric.suffix}`}
                    </p>
                    <div className="flex items-center gap-1.5">
                      {metric.trend === 'up' && <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />}
                      <span className={cn(
                        'text-xs font-semibold',
                        metric.trend === 'up' ? 'text-emerald-600' : 'text-muted-foreground'
                      )}>
                        {metric.change}
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted/60 overflow-hidden">
                    <div className={cn(
                      'h-full rounded-full transition-all duration-700',
                      metric.trend === 'up' ? 'bg-emerald-500' : 'bg-primary/80'
                    )} style={{ width: `${Math.min(100, (metric.value / 10_000_000) * 100)}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Monthly Trend Visualization */}
          <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-surface/95 backdrop-blur-xl shadow-xl p-6 lg:p-8">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
            <div className="relative space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-foreground">Monthly Revenue Trend</h3>
                  <p className="text-sm text-muted-foreground">Last 4 months performance</p>
                </div>
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div className="relative">
                {/* Chart Container */}
                <div className="relative h-48 flex items-end gap-6 px-2">
                  {/* Y-axis labels */}
                  <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-muted-foreground pr-2">
                    <span>₦6M</span>
                    <span>₦4.5M</span>
                    <span>₦3M</span>
                    <span>₦1.5M</span>
                    <span>₦0</span>
                  </div>
                  
                  {/* Bars */}
                  <div className="flex-1 flex items-end justify-around gap-4 ml-8">
                    {monthlyTrend.map((data, index) => {
                      const maxAmount = Math.max(...monthlyTrend.map(d => d.amount))
                      const heightPercent = (data.amount / maxAmount) * 100
                      const minHeight = 20 // Minimum 20% height for visibility
                      const barHeight = Math.max(minHeight, heightPercent)
                      const isLatest = index === monthlyTrend.length - 1
                      
                      return (
                        <div key={data.month} className="flex-1 flex flex-col items-center gap-3 group max-w-[120px]">
                          {/* Tooltip */}
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background border border-border rounded-lg px-3 py-1.5 shadow-xl z-10 pointer-events-none">
                            <p className="text-xs font-bold text-foreground whitespace-nowrap">
                              ₦{(data.amount / 1_000_000).toFixed(1)}M
                            </p>
                          </div>
                          
                          {/* Bar */}
                          <div className="relative w-full flex items-end justify-center" style={{ height: '160px' }}>
                            <div
                              className={cn(
                                'w-full rounded-t-xl transition-all duration-500 group-hover:scale-105 shadow-lg',
                                isLatest 
                                  ? 'bg-gradient-to-t from-primary via-primary/80 to-primary/60' 
                                  : 'bg-gradient-to-t from-primary/70 via-primary/60 to-primary/40'
                              )}
                              style={{ 
                                height: `${barHeight}%`,
                                minHeight: '24px'
                              }}
                            />
                          </div>
                          
                          {/* Month label */}
                          <div className="text-center">
                            <p className="text-sm font-bold text-foreground">{data.month}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              ₦{(data.amount / 1_000_000).toFixed(1)}M
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  
                  {/* Grid lines */}
                  <div className="absolute inset-0 left-8 right-0 pointer-events-none">
                    <div className="absolute top-0 left-0 right-0 border-t border-border/30" />
                    <div className="absolute top-1/4 left-0 right-0 border-t border-border/20" />
                    <div className="absolute top-1/2 left-0 right-0 border-t border-border/20" />
                    <div className="absolute top-3/4 left-0 right-0 border-t border-border/20" />
                    <div className="absolute bottom-0 left-0 right-0 border-t border-border/30" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {(['all', 'received', 'upcoming', 'overdue'] as FilterState[]).map((tab) => {
              const active = filter === tab
              const count = tab === 'all' ? earningSnapshots.length : earningSnapshots.filter(e => e.status === tab).length
              return (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={cn(
                    'px-5 py-2.5 rounded-xl text-sm font-semibold transition-all border whitespace-nowrap',
                    active
                      ? 'bg-primary text-primary-foreground border-primary shadow-lg scale-105'
                      : 'border-border text-muted-foreground hover:border-primary/40 hover:text-primary hover:bg-primary/5'
                  )}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  <span className={cn(
                    'ml-2 px-2 py-0.5 rounded-full text-xs',
                    active ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted text-muted-foreground'
                  )}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Earnings Transactions List */}
          <div className="space-y-4">
            {filteredSnapshots.map((earning) => (
              <article
                key={earning.id}
                className="relative overflow-hidden rounded-3xl border border-border/60 bg-surface/95 backdrop-blur-xl shadow-lg hover:shadow-2xl hover:-translate-y-0.5 transition-all group"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-primary/5 via-primary/5 to-transparent" />
                <div className="relative p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                      <h2 className="text-xl font-bold text-foreground">{earning.propertyName}</h2>
                      <Badge className={cn('rounded-full border px-3 py-1 text-xs font-semibold shadow-sm w-fit', statusTone[earning.status])}>
                        {earning.status.charAt(0).toUpperCase() + earning.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <span className="text-xs uppercase tracking-widest text-muted-foreground/80">Tenant</span>
                        <p className="text-foreground font-semibold">{earning.tenantName}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs uppercase tracking-widest text-muted-foreground/80">Amount</span>
                        <p className="text-foreground font-bold text-lg">₦{(earning.amount / 1_000_000).toFixed(1)}M</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs uppercase tracking-widest text-muted-foreground/80">Due Date</span>
                        <p className="text-foreground font-medium">
                          {format(new Date(earning.dueDate), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs uppercase tracking-widest text-muted-foreground/80">Type</span>
                        <p className="text-foreground font-medium">
                          {earning.bookingType === 'annual' ? 'Annual Lease' : 'Shortlet'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      variant="outline"
                      className="rounded-xl border-border hover:border-primary/40 hover:text-primary"
                      onClick={() => setSelectedEarning(earning)}
                    >
                      View Timeline
                    </Button>
                    <Button
                      className="rounded-xl bg-primary text-primary-foreground shadow-lg hover:shadow-xl"
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
      <AuthDialog open={isDrawerOpen} onOpenChange={setIsDrawerOpen} />
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
