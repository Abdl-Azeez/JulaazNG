import { useMemo, useState } from 'react'
import { Header } from '@/widgets/header'
import { Sidebar } from '@/widgets/sidebar'
import { Footer } from '@/widgets/footer'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import {
  BarChart3,
  ArrowLeft,
  TrendingUp,
  Download,
  Activity,
  PieChart,
  Target,
} from 'lucide-react'
import { cn } from '@/shared/lib/utils/cn'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/ui/tooltip'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/shared/constants/routes'
import { sampleAnalytics, sampleUserStats } from './data/sample-admin-data'

type TimeRange = '7d' | '30d' | '90d' | '1y'

type ChartPoint = { label: string; revenue?: number; users?: number }

interface AnalyticsSnapshot {
  metrics: typeof sampleAnalytics
  revenueSeries: ChartPoint[]
  userSeries: ChartPoint[]
}

const weeklyRevenueSeries: ChartPoint[] = [
  { label: 'Mon', revenue: 12_300_000 },
  { label: 'Tue', revenue: 11_800_000 },
  { label: 'Wed', revenue: 13_400_000 },
  { label: 'Thu', revenue: 14_200_000 },
  { label: 'Fri', revenue: 12_900_000 },
  { label: 'Sat', revenue: 10_600_000 },
  { label: 'Sun', revenue: 9_800_000 },
]

const weeklyUserSeries: ChartPoint[] = [
  { label: 'Mon', users: 380 },
  { label: 'Tue', users: 410 },
  { label: 'Wed', users: 390 },
  { label: 'Thu', users: 440 },
  { label: 'Fri', users: 465 },
  { label: 'Sat', users: 350 },
  { label: 'Sun', users: 320 },
]

const monthlyRevenueSeries: ChartPoint[] = [
  { label: 'Week 1', revenue: 32_000_000 },
  { label: 'Week 2', revenue: 34_500_000 },
  { label: 'Week 3', revenue: 36_200_000 },
  { label: 'Week 4', revenue: 39_100_000 },
]

const monthlyUserSeries: ChartPoint[] = [
  { label: 'Week 1', users: 1_250 },
  { label: 'Week 2', users: 1_310 },
  { label: 'Week 3', users: 1_355 },
  { label: 'Week 4', users: 1_420 },
]

const quarterRevenueSeries: ChartPoint[] = [
  { label: 'Jan', revenue: 32_500_000 },
  { label: 'Feb', revenue: 34_200_000 },
  { label: 'Mar', revenue: 36_800_000 },
  { label: 'Apr', revenue: 38_100_000 },
  { label: 'May', revenue: 40_500_000 },
  { label: 'Jun', revenue: 41_800_000 },
]

const quarterUserSeries: ChartPoint[] = [
  { label: 'Jan', users: 18_200 },
  { label: 'Feb', users: 19_100 },
  { label: 'Mar', users: 19_850 },
  { label: 'Apr', users: 20_700 },
  { label: 'May', users: 21_540 },
  { label: 'Jun', users: 22_320 },
]

const yearlyRevenueSeries: ChartPoint[] = [
  { label: 'Jan', revenue: 28_500_000 },
  { label: 'Feb', revenue: 31_200_000 },
  { label: 'Mar', revenue: 29_800_000 },
  { label: 'Apr', revenue: 35_400_000 },
  { label: 'May', revenue: 38_900_000 },
  { label: 'Jun', revenue: 36_200_000 },
  { label: 'Jul', revenue: 39_500_000 },
  { label: 'Aug', revenue: 41_200_000 },
  { label: 'Sep', revenue: 38_700_000 },
  { label: 'Oct', revenue: 40_100_000 },
  { label: 'Nov', revenue: 42_500_000 },
  { label: 'Dec', revenue: 44_300_000 },
]

const yearlyUserSeries: ChartPoint[] = [
  { label: 'Jan', users: 18_200 },
  { label: 'Feb', users: 19_100 },
  { label: 'Mar', users: 19_800 },
  { label: 'Apr', users: 20_500 },
  { label: 'May', users: 21_200 },
  { label: 'Jun', users: 21_900 },
  { label: 'Jul', users: 22_400 },
  { label: 'Aug', users: 23_100 },
  { label: 'Sep', users: 23_600 },
  { label: 'Oct', users: 24_100 },
  { label: 'Nov', users: 24_580 },
  { label: 'Dec', users: 25_050 },
]

const scaleNumber = (value: number, factor: number) => Math.max(1, Math.round(value * factor))

const buildSnapshot = (factor: number): typeof sampleAnalytics => ({
  revenue: {
    total: sampleAnalytics.revenue.total,
    thisMonth: scaleNumber(sampleAnalytics.revenue.thisMonth, factor),
    lastMonth: scaleNumber(sampleAnalytics.revenue.lastMonth, factor * 0.92),
    growth: sampleAnalytics.revenue.growth,
  },
  bookings: {
    total: sampleAnalytics.bookings.total,
    thisMonth: scaleNumber(sampleAnalytics.bookings.thisMonth, factor),
    pending: scaleNumber(sampleAnalytics.bookings.pending, factor),
    completed: scaleNumber(sampleAnalytics.bookings.completed, factor),
    cancelled: scaleNumber(sampleAnalytics.bookings.cancelled, factor),
  },
  users: {
    total: sampleAnalytics.users.total,
    newThisMonth: scaleNumber(sampleAnalytics.users.newThisMonth, factor),
    active: scaleNumber(sampleAnalytics.users.active, factor),
    verified: sampleAnalytics.users.verified,
  },
  properties: {
    total: sampleAnalytics.properties.total,
    active: sampleAnalytics.properties.active,
    pending: scaleNumber(sampleAnalytics.properties.pending, factor),
    rented: sampleAnalytics.properties.rented,
  },
})

const analyticsSnapshots: Record<TimeRange, AnalyticsSnapshot> = {
  '7d': {
    metrics: buildSnapshot(0.25),
    revenueSeries: weeklyRevenueSeries,
    userSeries: weeklyUserSeries,
  },
  '30d': {
    metrics: buildSnapshot(0.55),
    revenueSeries: monthlyRevenueSeries,
    userSeries: monthlyUserSeries,
  },
  '90d': {
    metrics: buildSnapshot(0.75),
    revenueSeries: quarterRevenueSeries,
    userSeries: quarterUserSeries,
  },
  '1y': {
    metrics: buildSnapshot(1),
    revenueSeries: yearlyRevenueSeries,
    userSeries: yearlyUserSeries,
  },
}

export function AdminAnalyticsPage() {
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [timeRange, setTimeRange] = useState<TimeRange>('30d')

  const snapshot = analyticsSnapshots[timeRange]
  const maxRevenue = Math.max(...snapshot.revenueSeries.map((point) => point.revenue ?? 0))
  const maxUsers = Math.max(...snapshot.userSeries.map((point) => point.users ?? 0))

  const metricCards = useMemo(
    () => [
      {
        label: 'Revenue This Period',
        value: `₦${(snapshot.metrics.revenue.thisMonth / 1_000_000).toFixed(1)}M`,
        helper: `vs ₦${(snapshot.metrics.revenue.lastMonth / 1_000_000).toFixed(1)}M`,
        trend: `+${snapshot.metrics.revenue.growth}%`,
      },
      {
        label: 'Bookings Logged',
        value: snapshot.metrics.bookings.thisMonth.toLocaleString(),
        helper: `${snapshot.metrics.bookings.pending} pending approvals`,
        trend: '+15%',
      },
      {
        label: 'New Users',
        value: snapshot.metrics.users.newThisMonth.toLocaleString(),
        helper: `${snapshot.metrics.users.active.toLocaleString()} active`,
        trend: '+8%',
      },
      {
        label: 'Active Listings',
        value: snapshot.metrics.properties.total.toLocaleString(),
        helper: `${snapshot.metrics.properties.pending} under review`,
        trend: 'live',
      },
    ],
    [snapshot]
  )

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        onMenuClick={() => setIsSidebarOpen(true)}
        onProfileClick={() => navigate(ROUTES.PROFILE)}
        className="lg:shadow-sm"
      />

      <main className="flex-1">
        {/* Header Section */}
        <section className="border-b border-border/60 bg-gradient-to-br from-primary/5 via-background to-accent/10">
          <div className="container mx-auto max-w-7xl px-4 lg:px-6 xl:px-8 py-8 lg:py-10">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground px-0"
                  onClick={() => navigate(ROUTES.ADMIN_DASHBOARD)}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-foreground">Platform intelligence</h1>
                  <p className="text-sm text-muted-foreground mt-2">
                    Compare liquidity, demand and retention across time windows. Change the range to
                    rerun the dashboard instantly.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-3 min-w-[220px]">
                <div className="flex rounded-2xl bg-muted p-1 shadow-inner">
                  {(['7d', '30d', '90d', '1y'] as TimeRange[]).map((range) => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={cn(
                        'px-4 py-2 rounded-xl text-sm font-medium transition-all',
                        timeRange === range
                          ? 'bg-background text-foreground shadow'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {range}
                    </button>
                  ))}
                </div>
                <Button
                  className="rounded-xl"
                  onClick={() => {
                    console.log('Export snapshot')
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export snapshot
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Key Metrics */}
        <section className="container mx-auto max-w-7xl px-4 lg:px-6 xl:px-8 py-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {metricCards.map((card) => (
              <Card key={card.label} className="p-5 rounded-2xl border border-border/60 bg-background/80 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <BarChart3 className="h-5 w-5" />
                  </div>
                  <Badge className="rounded-full bg-primary/10 text-primary text-[10px] px-2 py-1">
                    {card.trend}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{card.label}</p>
                <p className="text-2xl font-bold text-foreground">{card.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{card.helper}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Charts Section */}
        <section className="container mx-auto max-w-7xl px-4 lg:px-6 xl:px-8 pb-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Revenue Chart */}
            <Card className="rounded-2xl border border-border/60 bg-background/80 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Monthly Revenue</h3>
                  <p className="text-sm text-muted-foreground">Revenue trend over time</p>
                </div>
                <div className="flex items-center gap-2 text-emerald-600 text-sm">
                  <TrendingUp className="h-4 w-4" />
                  <span>+{snapshot.metrics.revenue.growth}%</span>
                </div>
              </div>
              <TooltipProvider delayDuration={0}>
                <div className="flex items-end gap-2">
                  {snapshot.revenueSeries.map((data, index) => {
                    const revenueValue = data.revenue ?? 0
                    const heightPercent = maxRevenue > 0 ? (revenueValue / maxRevenue) * 100 : 0
                    const barHeightPx = Math.max(Math.round((heightPercent / 100) * 180), 12)
                    return (
                      <div key={data.label} className="flex-1 flex flex-col items-center">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              className={cn(
                                'w-full rounded-t-lg transition-all cursor-pointer hover:opacity-80',
                                index === snapshot.revenueSeries.length - 1
                                  ? 'bg-emerald-500'
                                  : 'bg-emerald-500/40'
                              )}
                              style={{ height: `${barHeightPx}px` }}
                            />
                          </TooltipTrigger>
                          <TooltipContent side="top" className="bg-foreground text-background font-medium">
                            <p>₦{(revenueValue / 1_000_000).toFixed(2)}M</p>
                            <p className="text-xs opacity-70">{data.label}</p>
                          </TooltipContent>
                        </Tooltip>
                        <span className="text-[10px] text-muted-foreground mt-2">
                          {data.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </TooltipProvider>
            </Card>

            {/* User Growth Chart */}
            <Card className="rounded-2xl border border-border/60 bg-background/80 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">User Growth</h3>
                  <p className="text-sm text-muted-foreground">Total users over time</p>
                </div>
                <div className="flex items-center gap-2 text-purple-600 text-sm">
                  <TrendingUp className="h-4 w-4" />
                  <span>+12.5%</span>
                </div>
              </div>
              <TooltipProvider delayDuration={0}>
                <div className="flex items-end gap-2">
                  {snapshot.userSeries.map((data, index) => {
                    const userValue = data.users ?? 0
                    const heightPercent = maxUsers > 0 ? (userValue / maxUsers) * 100 : 0
                    const barHeightPx = Math.max(Math.round((heightPercent / 100) * 180), 12)
                    return (
                      <div key={data.label} className="flex-1 flex flex-col items-center">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              className={cn(
                                'w-full rounded-t-lg transition-all cursor-pointer hover:opacity-80',
                                index === snapshot.userSeries.length - 1
                                  ? 'bg-purple-500'
                                  : 'bg-purple-500/40'
                              )}
                              style={{ height: `${barHeightPx}px` }}
                            />
                          </TooltipTrigger>
                          <TooltipContent side="top" className="bg-foreground text-background font-medium">
                            <p>{userValue.toLocaleString()} users</p>
                            <p className="text-xs opacity-70">{data.label}</p>
                          </TooltipContent>
                        </Tooltip>
                        <span className="text-[10px] text-muted-foreground mt-2">
                          {data.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </TooltipProvider>
            </Card>
          </div>
        </section>

        {/* Additional Stats */}
        <section className="container mx-auto max-w-7xl px-4 lg:px-6 xl:px-8 pb-6 lg:pb-10">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Booking Stats */}
            <Card className="rounded-2xl border border-border/60 bg-background/80 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                  <Activity className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Booking Status</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Completed</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{
                          width: `${(snapshot.metrics.bookings.completed / snapshot.metrics.bookings.total) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium">{snapshot.metrics.bookings.completed}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Pending</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{
                          width: `${(snapshot.metrics.bookings.pending / snapshot.metrics.bookings.total) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium">{snapshot.metrics.bookings.pending}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Cancelled</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-500 rounded-full"
                        style={{
                          width: `${(snapshot.metrics.bookings.cancelled / snapshot.metrics.bookings.total) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium">{snapshot.metrics.bookings.cancelled}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* User Distribution */}
            <Card className="rounded-2xl border border-border/60 bg-background/80 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
                  <PieChart className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">User Types</h3>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Tenants', value: sampleUserStats.tenants, color: 'bg-blue-500' },
                  { label: 'Landlords', value: sampleUserStats.landlords, color: 'bg-purple-500' },
                  { label: 'Service Providers', value: sampleUserStats.serviceProviders, color: 'bg-amber-500' },
                  { label: 'Homerunners', value: sampleUserStats.homerunners, color: 'bg-emerald-500' },
                  { label: 'Others', value: sampleUserStats.artisans + sampleUserStats.handymen, color: 'bg-gray-500' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className={cn('h-3 w-3 rounded-full', item.color)} />
                    <span className="text-sm text-muted-foreground flex-1">{item.label}</span>
                    <span className="text-sm font-medium">{item.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Conversion Metrics */}
            <Card className="rounded-2xl border border-border/60 bg-background/80 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <Target className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Conversion Metrics</h3>
              </div>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Viewing to Booking</p>
                  <p className="text-2xl font-bold text-foreground">34.2%</p>
                  <p className="text-xs text-emerald-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +2.5% from last month
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">User Retention</p>
                  <p className="text-2xl font-bold text-foreground">76.8%</p>
                  <p className="text-xs text-emerald-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +4.2% from last month
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">User Verification Rate</p>
                  <p className="text-2xl font-bold text-foreground">
                    {((snapshot.metrics.users.verified / snapshot.metrics.users.total) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </div>
  )
}

