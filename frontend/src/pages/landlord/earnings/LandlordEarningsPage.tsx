import { useMemo, useState } from 'react'
import { Header } from '@/widgets/header'
import { Sidebar } from '@/widgets/sidebar'
import { Footer } from '@/widgets/footer'
import { AuthDialog } from '@/widgets/auth-dialog'
import { useAuthStore } from '@/shared/store/auth.store'
import { LandlordNav } from '@/widgets/landlord-nav'
import { earningsSummary, earningSnapshots, mockIncomeExpenseEntries, mockPropertyFinancialSummary } from '@/__mocks__/data/landlord.mock'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import { cn } from '@/shared/lib/utils/cn'
import type { EarningSnapshot, IncomeExpenseEntry, PropertyFinancialSummary } from '@/shared/types/landlord.types'
import { Sparkles, Wallet, Clock, PiggyBank, TrendingUp, Calendar, DollarSign, Activity, Zap, ArrowUpRight, ArrowDownRight, Filter, BarChart3, Building2 } from 'lucide-react'
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'

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
  const [activeTab, setActiveTab] = useState<'earnings' | 'financials'>('earnings')
  const [propertyFilter, setPropertyFilter] = useState<string>('all')
  const [incomeExpenseEntries] = useState<IncomeExpenseEntry[]>(mockIncomeExpenseEntries)
  const [financialSummary] = useState<PropertyFinancialSummary[]>(mockPropertyFinancialSummary)

  const filteredFinancialSummary = useMemo(() => {
    if (propertyFilter === 'all') return financialSummary
    return financialSummary.filter(p => p.propertyId === propertyFilter)
  }, [financialSummary, propertyFilter])

  const filteredTransactions = useMemo(() => {
    let filtered = incomeExpenseEntries
    if (propertyFilter !== 'all') {
      filtered = filtered.filter(t => t.propertyId === propertyFilter)
    }
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [incomeExpenseEntries, propertyFilter])

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
  
  // Calculate profit margin: profit = revenue - total cost, margin = (profit/revenue) * 100
  const totalCosts = useMemo(() => {
    return financialSummary.reduce((sum, property) => sum + property.totalExpenses, 0)
  }, [financialSummary])
  
  const profitMargin = useMemo(() => {
    if (receivedTotal === 0) return 0
    const profit = receivedTotal - totalCosts
    return Math.round((profit / receivedTotal) * 100)
  }, [receivedTotal, totalCosts])
  
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

  const totalPortfolioStats = useMemo(() => {
    const totalIncome = filteredFinancialSummary.reduce((sum, property) => sum + property.totalIncome, 0)
    const totalExpenses = filteredFinancialSummary.reduce((sum, property) => sum + property.totalExpenses, 0)
    const netProfit = totalIncome - totalExpenses
    const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0
    
    return {
      totalIncome,
      totalExpenses,
      netProfit,
      profitMargin,
      profitableProperties: filteredFinancialSummary.filter(p => p.netProfit > 0).length,
      unprofitableProperties: filteredFinancialSummary.filter(p => p.netProfit <= 0).length,
      totalProperties: filteredFinancialSummary.length
    }
  }, [filteredFinancialSummary])

  const recentTransactions = useMemo(() => {
    return filteredTransactions.slice(0, 10)
  }, [filteredTransactions])

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
                    <span className="font-semibold text-accent">{profitMargin}%</span>
                    <span className="text-muted-foreground">profit margin</span>
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
                label: 'Profit Margin',
                value: profitMargin,
                suffix: '%',
                change: profitMargin >= 0 ? `+${profitMargin}%` : `${profitMargin}%`,
                trend: profitMargin >= 0 ? 'up' : 'down',
                gradient: profitMargin >= 0 
                  ? 'from-emerald-500/20 via-emerald-500/10 to-transparent'
                  : 'from-destructive/20 via-destructive/10 to-transparent',
                icon: profitMargin >= 0 ? (
                  <BarChart3 className="h-5 w-5 text-emerald-500" />
                ) : (
                  <BarChart3 className="h-5 w-5 text-destructive" />
                ),
                bg: profitMargin >= 0 ? 'bg-emerald-500/5' : 'bg-destructive/5',
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
                      {metric.trend === 'down' && <ArrowDownRight className="h-3.5 w-3.5 text-destructive" />}
                      <span className={cn(
                        'text-xs font-semibold',
                        metric.trend === 'up' ? 'text-emerald-600' : metric.trend === 'down' ? 'text-destructive' : 'text-muted-foreground'
                      )}>
                        {metric.change}
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted/60 overflow-hidden">
                    <div className={cn(
                      'h-full rounded-full transition-all duration-700',
                      metric.trend === 'up' ? 'bg-emerald-500' : metric.trend === 'down' ? 'bg-destructive' : 'bg-primary/80'
                    )} style={{ 
                      width: metric.suffix === '%' 
                        ? `${Math.min(100, Math.max(0, Math.abs(metric.value)))}%`
                        : `${Math.min(100, (metric.value / 10_000_000) * 100)}%`
                    }} />
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

          {/* Transaction & Financial Management Section */}
          <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-surface/95 backdrop-blur-xl shadow-xl p-6 lg:p-8 space-y-6">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
            <div className="relative space-y-6">
              {/* Section Header */}
              <div className="flex items-center justify-between pb-4 border-b border-border/60">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-foreground">Transaction Management</h2>
                  <p className="text-sm text-muted-foreground">View and manage your earnings pipeline and financial records</p>
                </div>
                <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20">
                  <BarChart3 className="h-5 w-5 text-primary" />
            </div>
          </div>

          {/* Navigation Tabs */}
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'earnings' | 'financials')} className="w-full">
                <TabsList className="grid w-full grid-cols-2 rounded-2xl bg-background/80 backdrop-blur-lg border-2 border-primary/20 p-1.5 shadow-lg h-auto">
                  <TabsTrigger 
                    value="earnings" 
                    className="rounded-xl px-6 py-4 text-base font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-200 data-[state=inactive]:text-muted-foreground hover:text-foreground"
                  >
                    <div className="flex items-center gap-2">
                      <Wallet className="h-4 w-4" />
                      <span>Earnings Pipeline</span>
                    </div>
              </TabsTrigger>
                  <TabsTrigger 
                    value="financials" 
                    className="rounded-xl px-6 py-4 text-base font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-200 data-[state=inactive]:text-muted-foreground hover:text-foreground"
                  >
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      <span>Income & Expenditure</span>
                    </div>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="earnings" className="mt-8 space-y-6">
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
            </TabsContent>

            <TabsContent value="financials" className="mt-8 space-y-6">
              {/* Property Filter */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-muted/30 border border-border/60">
                <div className="space-y-1">
                <h3 className="text-xl font-bold text-foreground">Financial Overview</h3>
                  <p className="text-sm text-muted-foreground">
                    {propertyFilter === 'all' 
                      ? `Viewing all ${financialSummary.length} properties` 
                      : `Viewing 1 property`}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-background/80 border border-border/60">
                    <Filter className="h-4 w-4 text-primary" />
                  </div>
                  <Select value={propertyFilter} onValueChange={setPropertyFilter}>
                    <SelectTrigger className="w-[240px] h-12 rounded-xl border-2 border-border/60 bg-background/80 backdrop-blur-lg shadow-sm hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all">
                      <SelectValue placeholder="Select a property" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-2 border-border/60 bg-background/95 backdrop-blur-xl shadow-xl">
                      <SelectItem 
                        value="all" 
                        className="rounded-lg px-4 py-3 cursor-pointer focus:bg-primary/10 focus:text-primary"
                      >
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          <span className="font-semibold">All Properties</span>
                          <span className="ml-auto text-xs text-muted-foreground">
                            ({financialSummary.length})
                          </span>
                        </div>
                      </SelectItem>
                    {financialSummary.map(p => (
                        <SelectItem 
                          key={p.propertyId} 
                          value={p.propertyId}
                          className="rounded-lg px-4 py-3 cursor-pointer focus:bg-primary/10 focus:text-primary"
                        >
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-primary/60" />
                            <span className="font-medium">{p.propertyName}</span>
                          </div>
                        </SelectItem>
                    ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Portfolio Financial Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-surface/95 backdrop-blur-xl shadow-lg">
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                        Total Income
                      </span>
                      <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                        <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-3xl font-black text-foreground">
                        ₦{(totalPortfolioStats.totalIncome / 1_000_000).toFixed(1)}M
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 pt-2 border-t border-border/50">
                      <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                      <span className="text-xs font-semibold text-emerald-600">From rent payments</span>
                    </div>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-surface/95 backdrop-blur-xl shadow-lg">
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                        Total Expenses
                      </span>
                      <div className="p-3 rounded-2xl bg-destructive/10 border border-destructive/20">
                        <ArrowDownRight className="h-4 w-4 text-destructive" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-3xl font-black text-foreground">
                        ₦{(totalPortfolioStats.totalExpenses / 1_000_000).toFixed(1)}M
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 pt-2 border-t border-border/50">
                      <Activity className="h-3.5 w-3.5 text-destructive" />
                      <span className="text-xs font-semibold text-destructive">Operating costs</span>
                    </div>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-surface/95 backdrop-blur-xl shadow-lg">
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                        Net Profit
                      </span>
                      <div className={cn(
                        "p-3 rounded-2xl border",
                        totalPortfolioStats.netProfit >= 0 
                          ? "bg-primary/10 border-primary/20" 
                          : "bg-destructive/10 border-destructive/20"
                      )}>
                        <DollarSign className={cn(
                          "h-4 w-4",
                          totalPortfolioStats.netProfit >= 0 ? "text-primary" : "text-destructive"
                        )} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className={cn(
                        "text-3xl font-black",
                        totalPortfolioStats.netProfit >= 0 ? "text-foreground" : "text-destructive"
                      )}>
                        ₦{Math.abs(totalPortfolioStats.netProfit / 1_000_000).toFixed(1)}M
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 pt-2 border-t border-border/50">
                      <BarChart3 className={cn(
                        "h-3.5 w-3.5",
                        totalPortfolioStats.netProfit >= 0 ? "text-primary" : "text-destructive"
                      )} />
                      <span className={cn(
                        "text-xs font-semibold",
                        totalPortfolioStats.netProfit >= 0 ? "text-primary" : "text-destructive"
                      )}>
                        {totalPortfolioStats.profitMargin.toFixed(1)}% margin
                      </span>
                    </div>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-surface/95 backdrop-blur-xl shadow-lg">
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                        Property Performance
                      </span>
                      <div className="p-3 rounded-2xl bg-accent/10 border border-accent/20">
                        <Building2 className="h-4 w-4 text-accent" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-3xl font-black text-foreground">
                        {totalPortfolioStats.profitableProperties}/{totalPortfolioStats.totalProperties}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 pt-2 border-t border-border/50">
                      <TrendingUp className="h-3.5 w-3.5 text-accent" />
                      <span className="text-xs font-semibold text-accent">
                        {totalPortfolioStats.totalProperties === 1 ? 'Property' : 'Properties'} profitable
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Property-by-Property Financial Breakdown */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-foreground">Property Financial Breakdown</h3>
                <div className="space-y-4">
                  {filteredFinancialSummary.map((property) => (
                    <article
                      key={property.propertyId}
                      className="relative overflow-hidden rounded-3xl border border-border/60 bg-surface/95 backdrop-blur-xl shadow-lg"
                    >
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-bold text-foreground">{property.propertyName}</h4>
                          <Badge className={cn(
                            'rounded-full border px-3 py-1 text-xs font-semibold shadow-sm',
                            property.netProfit >= 0
                              ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                              : 'bg-destructive/10 text-destructive border-destructive/20'
                          )}>
                            {property.netProfit >= 0 ? 'Profitable' : 'Loss'}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                          <div className="space-y-1">
                            <span className="text-xs uppercase tracking-widest text-muted-foreground/80">Total Income</span>
                            <p className="text-foreground font-bold text-lg">₦{(property.totalIncome / 1_000_000).toFixed(1)}M</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-xs uppercase tracking-widest text-muted-foreground/80">Total Expenses</span>
                            <p className="text-foreground font-bold text-lg">₦{(property.totalExpenses / 1_000_000).toFixed(1)}M</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-xs uppercase tracking-widest text-muted-foreground/80">Net Profit</span>
                            <p className={cn(
                              "font-bold text-lg",
                              property.netProfit >= 0 ? "text-emerald-600" : "text-destructive"
                            )}>
                              {property.netProfit >= 0 ? '+' : ''}₦{(property.netProfit / 1_000_000).toFixed(1)}M
                            </p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-xs uppercase tracking-widest text-muted-foreground/80">Profit Margin</span>
                            <p className={cn(
                              "font-bold text-lg",
                              property.profitMargin >= 0 ? "text-emerald-600" : "text-destructive"
                            )}>
                              {property.profitMargin.toFixed(1)}%
                            </p>
                          </div>
                        </div>
                        
                        {/* Profit Margin Bar */}
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground font-medium">Profit Margin</span>
                            <span className="font-bold text-foreground">{property.profitMargin.toFixed(1)}%</span>
                          </div>
                          <div className="h-2.5 rounded-full bg-muted/60 overflow-hidden">
                            <div
                              className={cn(
                                'h-full rounded-full transition-all duration-500',
                                property.profitMargin >= 50
                                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                                  : property.profitMargin >= 0
                                    ? 'bg-gradient-to-r from-amber-500 to-amber-400'
                                    : 'bg-gradient-to-r from-destructive to-destructive/80'
                              )}
                              style={{ width: `${Math.min(100, Math.abs(property.profitMargin))}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              {/* Income & Expenditure Table */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-foreground">Income & Expenditure Table</h3>
                  <Button variant="ghost" size="sm" className="text-primary text-xs font-bold uppercase tracking-widest">
                    Export CSV
                  </Button>
                </div>
                <div className="overflow-hidden rounded-3xl border border-border/60 bg-surface/95 backdrop-blur-xl shadow-lg">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-border/60 bg-muted/30">
                          <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Date</th>
                          <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Description</th>
                          <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Property</th>
                          <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Category</th>
                          <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40">
                        {recentTransactions.map((transaction) => (
                          <tr key={transaction.id} className="hover:bg-muted/20 transition-colors">
                            <td className="px-6 py-4 text-sm text-muted-foreground whitespace-nowrap">
                              {format(new Date(transaction.date), 'MMM d, yyyy')}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className={cn(
                                  "p-1.5 rounded-lg",
                                  transaction.type === 'income' 
                                    ? "bg-emerald-500/10 text-emerald-600" 
                                    : "bg-destructive/10 text-destructive"
                                )}>
                                  {transaction.type === 'income' ? (
                                    <ArrowUpRight className="h-3.5 w-3.5" />
                                  ) : (
                                    <ArrowDownRight className="h-3.5 w-3.5" />
                                  )}
                                </div>
                                <span className="text-sm font-semibold text-foreground">{transaction.description}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-muted-foreground whitespace-nowrap">
                              {transaction.propertyName}
                            </td>
                            <td className="px-6 py-4">
                              <Badge variant="outline" className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-muted/50">
                                {transaction.category || 'General'}
                              </Badge>
                            </td>
                            <td className={cn(
                              "px-6 py-4 text-sm font-bold text-right whitespace-nowrap",
                              transaction.type === 'income' ? "text-emerald-600" : "text-destructive"
                            )}>
                              {transaction.type === 'income' ? '+' : '-'}₦{transaction.amount.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                        {recentTransactions.length === 0 && (
                          <tr>
                            <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                              No transactions found for the selected filter.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
            </div>
          </div>
        </section>
      </main>

      <LandlordNav />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <AuthDialog open={isDrawerOpen} onOpenChange={setIsDrawerOpen} />
      <Footer />
    </div>
    <Sheet open={!!selectedEarning} onOpenChange={(open) => !open && setSelectedEarning(null)}>
      <SheetContent 
        side="bottom" 
        className="w-full h-[75vh] max-h-[75vh] rounded-t-[24px] sm:rounded-t-[30px] flex flex-col p-0"
      >
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border/60 flex-shrink-0 space-y-1">
          <SheetTitle>Payment Timeline</SheetTitle>
          {selectedEarning && (
            <p className="text-sm text-muted-foreground">
              {selectedEarning.propertyName} • ₦{(selectedEarning.amount / 1_000_000).toFixed(1)}M
            </p>
          )}
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
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
        <SheetFooter className="px-6 pb-6 pt-4 border-t border-border/60 flex-shrink-0">
          <Button
            className="rounded-2xl bg-primary text-primary-foreground w-full"
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
