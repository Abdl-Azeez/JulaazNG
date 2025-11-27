import { useMemo, useState } from 'react'
import { Header } from '@/widgets/header'
import { Sidebar } from '@/widgets/sidebar'
import { Footer } from '@/widgets/footer'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import {
  Users,
  Building2,
  DollarSign,
  ArrowUpRight,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Home,
  Wrench,
  Eye,
  UserPlus,
  CreditCard,
  MessageSquare,
  BarChart3,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/shared/lib/utils/cn'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/shared/constants/routes'
import {
  sampleSystemStats,
  sampleUserStats,
  samplePendingApprovals,
  sampleRecentActivities,
  type PendingApproval,
  type RecentActivity,
} from './data/sample-admin-data'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import toast from 'react-hot-toast'

export function AdminDashboardPage() {
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [approvals, setApprovals] = useState(samplePendingApprovals)
  const [reviewApproval, setReviewApproval] = useState<PendingApproval | null>(null)

  const getApprovalTypeIcon = (type: PendingApproval['type']) => {
    switch (type) {
      case 'property':
        return <Building2 className="h-4 w-4 text-blue-600" />
      case 'user':
        return <Users className="h-4 w-4 text-purple-600" />
      case 'service_provider':
        return <Wrench className="h-4 w-4 text-amber-600" />
      case 'homerunner':
        return <Eye className="h-4 w-4 text-emerald-600" />
      case 'withdrawal':
        return <DollarSign className="h-4 w-4 text-green-600" />
    }
  }

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'user_signup':
        return <UserPlus className="h-4 w-4 text-purple-600" />
      case 'property_listed':
        return <Building2 className="h-4 w-4 text-blue-600" />
      case 'booking_completed':
        return <CheckCircle2 className="h-4 w-4 text-emerald-600" />
      case 'payment_received':
        return <CreditCard className="h-4 w-4 text-green-600" />
      case 'dispute_raised':
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case 'approval_needed':
        return <Clock className="h-4 w-4 text-amber-600" />
    }
  }

  const getPriorityBadge = (priority: PendingApproval['priority']) => {
    const styles = {
      low: 'bg-muted text-muted-foreground',
      medium: 'bg-amber-500/10 text-amber-600',
      high: 'bg-red-500/10 text-red-600',
    }
    return (
      <Badge className={cn('rounded-full px-2 py-0.5 text-[10px]', styles[priority])}>
        {priority.toUpperCase()}
      </Badge>
    )
  }

  const pendingApprovals = useMemo(
    () => approvals.filter((approval) => approval.status === 'pending'),
    [approvals]
  )
  const underReviewApprovals = useMemo(
    () => approvals.filter((approval) => approval.status === 'under_review'),
    [approvals]
  )

  const handleQuickApprove = (approvalId: string) => {
    setApprovals((prev) =>
      prev.map((approval) =>
        approval.id === approvalId ? { ...approval, status: 'approved' } : approval
      )
    )
    toast.success('Approval recorded')
    setReviewApproval((current) => (current?.id === approvalId ? null : current))
  }

  const handleQuickReject = (approvalId: string) => {
    setApprovals((prev) =>
      prev.map((approval) =>
        approval.id === approvalId ? { ...approval, status: 'rejected' } : approval
      )
    )
    toast.success('Item flagged for follow-up')
    setReviewApproval((current) => (current?.id === approvalId ? null : current))
  }

  const highlightStats = [
    {
      id: 'gmv',
      label: 'Monthly GMV',
      value: `₦${(sampleSystemStats.totalRevenue / 1000000).toFixed(1)}M`,
      subtext: '+11.3% vs last month',
      icon: DollarSign,
      gradient: 'from-primary/90 via-primary to-primary/70',
    },
    {
      id: 'listings',
      label: 'Active Listings',
      value: sampleSystemStats.activeListings.toLocaleString(),
      subtext: `${sampleSystemStats.pendingApprovals} awaiting updates`,
      icon: Building2,
      gradient: 'from-violet-600 via-indigo-500 to-indigo-400',
    },
    {
      id: 'decisions',
      label: 'Decisions Queue',
      value: (pendingApprovals.length + underReviewApprovals.length).toString(),
      subtext: `${pendingApprovals.length} pending • ${underReviewApprovals.length} in review`,
      icon: Clock,
      gradient: 'from-amber-500 via-orange-500 to-orange-400',
    },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        onMenuClick={() => setIsSidebarOpen(true)}
        onProfileClick={() => navigate(ROUTES.PROFILE)}
        className="lg:shadow-sm"
      />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="border-b border-border/60 bg-gradient-to-br from-violet-500/10 via-background to-background">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="space-y-4 w-full lg:max-w-3xl">
                <Badge className="rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold">
                  <ShieldCheck className="h-3 w-3 mr-1" />
                  Admin Command Center
                </Badge>
                <div className="space-y-2">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                    Operational pulse at a glance
                  </h1>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Stay ahead of approvals, liquidity, and service health. Every card below is
                    wired to a quick action so you can keep the marketplace calm and fast.
                  </p>
                </div>
                <div className="grid gap-4 w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {highlightStats.map((stat) => (
                    <div
                      key={stat.id}
                      className={cn(
                        'rounded-2xl p-4 text-white shadow-lg border border-white/10',
                        'bg-gradient-to-br',
                        stat.gradient
                      )}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-medium text-white/80">{stat.label}</p>
                        <stat.icon className="h-4 w-4 text-white/80" />
                      </div>
                      <p className="text-xl sm:text-2xl font-semibold">{stat.value}</p>
                      <p className="text-xs text-white/80 mt-1">{stat.subtext}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3 w-full lg:w-auto lg:min-w-[220px]">
                <Button
                  className="rounded-xl bg-primary text-primary-foreground shadow-lg w-full lg:w-auto"
                  onClick={() => navigate(ROUTES.ADMIN_ANALYTICS)}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View analytics report
                </Button>
                <Button
                  variant="outline"
                  className="rounded-xl border-primary/40 text-primary hover:bg-primary/10 w-full lg:w-auto"
                  onClick={() => navigate(ROUTES.ADMIN_BACKGROUND_CHECKS)}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Background checks
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Operational Snapshot */}
        <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="grid gap-4 lg:grid-cols-[1.4fr,0.6fr]">
            <Card className="rounded-3xl border-none bg-surface shadow-lg">
              <div className="p-4 sm:p-6 border-b border-border/60">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Engagement</p>
                    <p className="text-lg sm:text-xl font-semibold text-foreground">User velocity</p>
                  </div>
                  <Badge className="bg-primary/10 text-primary w-fit">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    +{sampleSystemStats.monthlyGrowth}%
                  </Badge>
                </div>
              </div>
              <div className="p-4 sm:p-6 grid gap-4 grid-cols-1 sm:grid-cols-2">
                {[
                  {
                    label: 'Active tenants',
                    value: sampleUserStats.tenants.toLocaleString(),
                    change: '+420 this week',
                  },
                  {
                    label: 'Landlord pipeline',
                    value: sampleUserStats.landlords.toLocaleString(),
                    change: '12 onboarding',
                  },
                  {
                    label: 'Service providers',
                    value: sampleUserStats.serviceProviders.toLocaleString(),
                    change: '7 awaiting vetting',
                  },
                  {
                    label: 'Support tickets',
                    value: '34 open',
                    change: 'SLA 92%',
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-border/60 bg-background/70 p-3 sm:p-4"
                  >
                    <p className="text-xs sm:text-sm text-muted-foreground">{item.label}</p>
                    <p className="text-xl sm:text-2xl font-semibold text-foreground">{item.value}</p>
                    <p className="text-xs text-primary mt-1">{item.change}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="rounded-3xl border border-border/60 bg-background/80 shadow-sm">
              <div className="p-4 sm:p-6 border-b border-border/60">
                <p className="text-sm text-muted-foreground">Watchlist</p>
                <p className="text-lg sm:text-xl font-semibold text-foreground">Signals & alerts</p>
              </div>
              <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                {[
                  {
                    title: 'Liquidity buffer',
                    value: '₦12.4M',
                    helper: 'Ready for payouts',
                    state: 'text-emerald-600',
                  },
                  {
                    title: 'Verification queue',
                    value: `${pendingApprovals.length} items`,
                    helper: 'Needs decisions',
                    state: 'text-amber-600',
                  },
                  {
                    title: 'Disputes logged',
                    value: '5 open',
                    helper: 'Avg resolution 18h',
                    state: 'text-primary',
                  },
                ].map((item) => (
                  <div key={item.title} className="rounded-2xl border border-dashed border-border/60 p-3 sm:p-4">
                    <p className="text-xs sm:text-sm text-muted-foreground">{item.title}</p>
                    <p className={cn('text-xl sm:text-2xl font-semibold', item.state)}>{item.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.helper}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </section>

        {/* User Breakdown */}
        <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-6">
          <Card className="rounded-2xl border border-border/60 bg-background/80 shadow-sm p-4 sm:p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">User Distribution</h3>
            <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
              {[
                { label: 'Tenants', value: sampleUserStats.tenants, icon: Users, color: 'text-blue-600 bg-blue-500/10' },
                { label: 'Landlords', value: sampleUserStats.landlords, icon: Home, color: 'text-purple-600 bg-purple-500/10' },
                { label: 'Service Providers', value: sampleUserStats.serviceProviders, icon: Wrench, color: 'text-amber-600 bg-amber-500/10' },
                { label: 'Homerunners', value: sampleUserStats.homerunners, icon: Eye, color: 'text-emerald-600 bg-emerald-500/10' },
                { label: 'Artisans', value: sampleUserStats.artisans, icon: Wrench, color: 'text-orange-600 bg-orange-500/10' },
                { label: 'Handymen', value: sampleUserStats.handymen, icon: Wrench, color: 'text-cyan-600 bg-cyan-500/10' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className={cn('h-9 w-9 rounded-lg flex items-center justify-center', item.color)}>
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-foreground">{item.value.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* Main Grid */}
        <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8 lg:pb-12">
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1.2fr,0.8fr]">
            {/* Pending Approvals */}
            <Card className="rounded-2xl border border-border/60 bg-background/80 shadow-sm">
              <div className="p-4 sm:p-5 border-b border-border/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-semibold text-foreground">Pending Approvals</h2>
                    <p className="text-xs text-muted-foreground">
                      {pendingApprovals.length} items need your attention
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  className="rounded-xl text-sm w-full sm:w-auto"
                  onClick={() => navigate(ROUTES.ADMIN_APPROVALS)}
                >
                  View all
                </Button>
              </div>

              <div className="divide-y divide-border/60">
                {approvals.slice(0, 4).map((approval) => (
                  <div key={approval.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                    <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                      {getApprovalTypeIcon(approval.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <Badge className="rounded-full bg-muted text-muted-foreground text-[10px]">
                          {approval.type.replace('_', ' ')}
                        </Badge>
                        {getPriorityBadge(approval.priority)}
                      </div>
                      <h4 className="text-sm font-semibold text-foreground truncate">
                        {approval.title}
                      </h4>
                      <p className="text-xs text-muted-foreground truncate">
                        {approval.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        by {approval.submittedBy} • {approval.submittedAt}
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0 sm:flex-col sm:items-end">
                      {approval.status === 'pending' ? (
                        <>
                          <Button
                            size="sm"
                            className="rounded-lg h-8 px-3 bg-emerald-600 hover:bg-emerald-700 text-xs sm:text-sm w-full sm:w-auto"
                            onClick={() => handleQuickApprove(approval.id)}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-lg h-8 px-3 text-xs sm:text-sm w-full sm:w-auto"
                            onClick={() => setReviewApproval(approval)}
                          >
                            Review
                          </Button>
                        </>
                      ) : (
                        <Badge className="rounded-full bg-muted text-muted-foreground text-[10px]">
                          {approval.status.replace('_', ' ')}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Right Column */}
            <div className="space-y-4 sm:space-y-6">
              {/* Recent Activity */}
              <Card className="rounded-2xl border border-border/60 bg-background/80 shadow-sm">
                <div className="p-4 sm:p-5 border-b border-border/50">
                  <h2 className="text-base sm:text-lg font-semibold text-foreground">Recent Activity</h2>
                  <p className="text-xs text-muted-foreground">Platform-wide events</p>
                </div>
                <div className="divide-y divide-border/60">
                  {sampleRecentActivities.slice(0, 5).map((activity) => (
                    <div key={activity.id} className="p-3 sm:p-4 flex items-start gap-3">
                      <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-foreground">{activity.title}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {activity.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {activity.timestamp}
                        </p>
                      </div>
                      {activity.amount && (
                        <p className="text-xs sm:text-sm font-semibold text-emerald-600 shrink-0">
                          ₦{activity.amount.toLocaleString()}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </Card>

              {/* Quick Links */}
              <Card className="rounded-2xl border border-border/60 bg-background/80 shadow-sm p-4 sm:p-5">
                <h3 className="text-sm font-semibold text-foreground mb-3 sm:mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { label: 'Users', icon: Users, route: ROUTES.ADMIN_USERS },
                    { label: 'Properties', icon: Building2, route: ROUTES.ADMIN_PROPERTIES },
                    { label: 'Services', icon: Wrench, route: ROUTES.ADMIN_SERVICES },
                    { label: 'Payments', icon: CreditCard, route: ROUTES.ADMIN_PAYMENTS },
                    { label: 'Disputes', icon: MessageSquare, route: ROUTES.ADMIN_DISPUTES },
                    { label: 'Background Checks', icon: ShieldCheck, route: ROUTES.ADMIN_BACKGROUND_CHECKS },
                    { label: 'Analytics', icon: BarChart3, route: ROUTES.ADMIN_ANALYTICS },
                  ].map((item) => (
                    <Button
                      key={item.label}
                      variant="outline"
                      className="rounded-xl h-10 sm:h-12 justify-start text-xs sm:text-sm"
                      onClick={() => navigate(item.route)}
                    >
                      <item.icon className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-primary shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </Button>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <Dialog open={Boolean(reviewApproval)} onOpenChange={(open) => !open && setReviewApproval(null)}>
        <DialogContent className="max-w-2xl">
          {reviewApproval && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span>Review: {reviewApproval.title}</span>
                  <Badge className="text-[10px] capitalize">
                    {reviewApproval.type.replace('_', ' ')}
                  </Badge>
                </DialogTitle>
                <DialogDescription>
                  Submitted by {reviewApproval.submittedBy} • {reviewApproval.submittedAt}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">{reviewApproval.description}</p>
                {reviewApproval.details && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {Object.entries(reviewApproval.details).map(([key, value]) => (
                      <div key={key} className="rounded-2xl border border-border/60 p-3">
                        <p className="text-xs text-muted-foreground capitalize">
                          {key.replace('_', ' ')}
                        </p>
                        <p className="text-sm font-semibold text-foreground">{value}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <DialogFooter className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto text-red-600 border-red-600/30 hover:bg-red-50"
                  onClick={() => handleQuickReject(reviewApproval.id)}
                >
                  Reject request
                </Button>
                <Button
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => handleQuickApprove(reviewApproval.id)}
                >
                  Approve request
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

