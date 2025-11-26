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
  Home,
  Users,
  TrendingUp,
  Wallet,
  Eye,
  CheckCircle2,
  Clock,
  ArrowRight,
  Building2,
  Star,
} from 'lucide-react'
import { cn } from '@/shared/lib/utils/cn'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/shared/constants/routes'
import {
  sampleInspections,
  sampleViewings,
  sampleEarnings,
  performanceStats,
} from './data/sample-homerunner-data'

export function HomerunnerDashboardPage() {
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleProfileClick = () => {
    navigate(ROUTES.PROFILE)
  }

  const todayInspections = sampleInspections.filter((i) =>
    i.scheduledFor.toLowerCase().includes('today')
  )
  const todayViewings = sampleViewings.filter((v) =>
    v.scheduledFor.toLowerCase().includes('today')
  )

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        onMenuClick={() => setIsSidebarOpen(true)}
        onProfileClick={handleProfileClick}
        className="lg:shadow-sm"
      />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="border-b border-border/60 bg-gradient-to-br from-emerald-500/10 via-background to-background">
          <div className="container mx-auto max-w-6xl px-4 lg:px-6 xl:px-8 py-10 lg:py-14">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="space-y-3">
                <Badge className="rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 text-xs font-semibold">
                  <Home className="h-3 w-3 mr-1" />
                  Homerunner HQ
                </Badge>
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
                  Welcome back, Champion.
                </h1>
                <p className="text-muted-foreground max-w-2xl">
                  Your schedule is filling up! You have {todayInspections.length} inspection
                  {todayInspections.length !== 1 ? 's' : ''} and {todayViewings.length} viewing
                  {todayViewings.length !== 1 ? 's' : ''} lined up for today. Every successful viewing brings you
                  closer to that commission bonus.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button
                    className="rounded-xl h-11 px-5 flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => navigate(ROUTES.HOMERUNNER_INSPECTIONS)}
                  >
                    <ClipboardCheck className="h-4 w-4" />
                    View inspections
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-xl h-11 px-5 flex items-center gap-2"
                    onClick={() => navigate(ROUTES.HOMERUNNER_SCHEDULE)}
                  >
                    <Calendar className="h-4 w-4" />
                    My schedule
                  </Button>
                </div>
              </div>

              {/* Earnings Summary Card */}
              <Card className="w-full max-w-sm rounded-2xl border-border/60 bg-background/80 shadow-lg p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                    <Wallet className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      This month's earnings
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      ₦{sampleEarnings.thisMonthEarnings.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Pending</p>
                    <p className="font-semibold text-amber-600">
                      ₦{sampleEarnings.pendingEarnings.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Commission</p>
                    <p className="font-semibold text-emerald-600">
                      ₦{sampleEarnings.commissionEarnings.toLocaleString()}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  className="w-full rounded-xl text-sm"
                  onClick={() => navigate(ROUTES.HOMERUNNER_EARNINGS)}
                >
                  View earnings breakdown
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Card>
            </div>
          </div>
        </section>

        {/* Performance Stats */}
        <section className="container mx-auto max-w-6xl px-4 lg:px-6 xl:px-8 py-8 lg:py-12">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {performanceStats.map((stat) => (
              <Card
                key={stat.id}
                className="p-5 rounded-2xl border border-border/60 bg-background/80 shadow-sm space-y-2"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    {stat.label}
                  </p>
                  <Badge
                    className={cn(
                      'rounded-full px-2 py-0.5 text-[10px]',
                      stat.trendUp
                        ? 'bg-emerald-500/10 text-emerald-600'
                        : 'bg-red-500/10 text-red-600'
                    )}
                  >
                    {stat.trend}
                  </Badge>
                </div>
                <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Main Content Grid */}
        <section className="container mx-auto max-w-6xl px-4 lg:px-6 xl:px-8 pb-8 lg:pb-12">
          <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
            {/* Today's Schedule */}
            <div className="space-y-6">
              {/* Inspections */}
              <Card className="rounded-2xl border border-border/60 bg-background/80 shadow-sm">
                <div className="p-5 border-b border-border/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                      <ClipboardCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">
                        Property Inspections
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        Upcoming inspections from landlords
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    className="rounded-xl text-sm"
                    onClick={() => navigate(ROUTES.HOMERUNNER_INSPECTIONS)}
                  >
                    View all
                  </Button>
                </div>
                <div className="divide-y divide-border/60">
                  {sampleInspections.slice(0, 3).map((inspection) => (
                    <div
                      key={inspection.id}
                      className="p-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6"
                    >
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge
                            className={cn(
                              'rounded-full px-2.5 py-0.5 text-[11px]',
                              inspection.type === 'new_listing'
                                ? 'bg-emerald-500/10 text-emerald-600'
                                : inspection.type === 'move_out'
                                ? 'bg-amber-500/10 text-amber-600'
                                : 'bg-blue-500/10 text-blue-600'
                            )}
                          >
                            {inspection.type === 'new_listing'
                              ? 'New Listing'
                              : inspection.type === 'move_out'
                              ? 'Move-out'
                              : 'Periodic'}
                          </Badge>
                          <p className="text-xs text-muted-foreground">
                            {inspection.scheduledFor}
                          </p>
                        </div>
                        <h3 className="text-base font-semibold text-foreground">
                          {inspection.propertyTitle}
                        </h3>
                        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-primary" />
                            {inspection.location.split(',')[0]}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Phone className="h-3.5 w-3.5 text-primary" />
                            {inspection.landlordName}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col lg:items-end gap-2">
                        <p className="text-sm font-semibold text-emerald-600">
                          ₦{inspection.earnAmount.toLocaleString()}
                        </p>
                        <Badge
                          className={cn(
                            'rounded-full px-3 py-1 text-xs font-medium',
                            inspection.status === 'confirmed'
                              ? 'bg-emerald-500/10 text-emerald-600'
                              : 'bg-amber-500/10 text-amber-600'
                          )}
                        >
                          {inspection.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Viewings */}
              <Card className="rounded-2xl border border-border/60 bg-background/80 shadow-sm">
                <div className="p-5 border-b border-border/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
                      <Eye className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">
                        Property Viewings
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        Take tenants to view properties
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    className="rounded-xl text-sm"
                    onClick={() => navigate(ROUTES.HOMERUNNER_VIEWINGS)}
                  >
                    View all
                  </Button>
                </div>
                <div className="divide-y divide-border/60">
                  {sampleViewings.slice(0, 3).map((viewing) => (
                    <div
                      key={viewing.id}
                      className="p-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6"
                    >
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge className="rounded-full px-2.5 py-0.5 text-[11px] bg-purple-500/10 text-purple-600">
                            Viewing
                          </Badge>
                          <p className="text-xs text-muted-foreground">
                            {viewing.scheduledFor}
                          </p>
                        </div>
                        <h3 className="text-base font-semibold text-foreground">
                          {viewing.propertyTitle}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Tenant: {viewing.tenantName}
                        </p>
                        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-primary" />
                            {viewing.location.split(',')[0]}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Users className="h-3.5 w-3.5 text-primary" />
                            {viewing.landlordName}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col lg:items-end gap-2">
                        <div className="text-right">
                          <p className="text-sm font-semibold text-emerald-600">
                            ₦{viewing.earnAmount.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            + ₦{viewing.commissionPotential.toLocaleString()} potential
                          </p>
                        </div>
                        <Badge
                          className={cn(
                            'rounded-full px-3 py-1 text-xs font-medium',
                            viewing.status === 'confirmed'
                              ? 'bg-emerald-500/10 text-emerald-600'
                              : 'bg-amber-500/10 text-amber-600'
                          )}
                        >
                          {viewing.status === 'confirmed' ? 'Confirmed' : 'Scheduled'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Side Panel */}
            <div className="space-y-6">
              {/* Commission Tracker */}
              <Card className="rounded-2xl border border-border/60 bg-gradient-to-br from-emerald-500/10 via-background to-background shadow-sm p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                  <h2 className="text-lg font-semibold text-foreground">
                    Commission Tracker
                  </h2>
                </div>
                <p className="text-xs text-muted-foreground">
                  Earn commission when tenants you showed properties to pay their first rent.
                  Your conversion rate: <span className="font-semibold text-emerald-600">{sampleEarnings.conversionRate}%</span>
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total viewings this month</span>
                    <span className="font-semibold">{sampleEarnings.totalViewings}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Converted to rentals</span>
                    <span className="font-semibold text-emerald-600">
                      {Math.round(sampleEarnings.totalViewings * sampleEarnings.conversionRate / 100)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Commission earned</span>
                    <span className="font-semibold text-emerald-600">
                      ₦{sampleEarnings.commissionEarnings.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{ width: `${sampleEarnings.conversionRate}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  🎯 Pro tip: Follow up with tenants 24 hours after viewing to increase conversions!
                </p>
              </Card>

              {/* Quick Actions */}
              <Card className="rounded-2xl border border-border/60 bg-background/80 shadow-sm p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>
                </div>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-between rounded-xl h-12"
                    onClick={() => navigate(ROUTES.HOMERUNNER_INSPECTIONS)}
                  >
                    <span className="flex items-center gap-2">
                      <ClipboardCheck className="h-4 w-4 text-blue-600" />
                      Pending Inspections
                    </span>
                    <Badge className="rounded-full bg-blue-500/10 text-blue-600">
                      {sampleInspections.filter((i) => i.status === 'pending').length}
                    </Badge>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-between rounded-xl h-12"
                    onClick={() => navigate(ROUTES.HOMERUNNER_VIEWINGS)}
                  >
                    <span className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-purple-600" />
                      Scheduled Viewings
                    </span>
                    <Badge className="rounded-full bg-purple-500/10 text-purple-600">
                      {sampleViewings.filter((v) => v.status === 'scheduled').length}
                    </Badge>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-between rounded-xl h-12"
                    onClick={() => navigate(ROUTES.HOMERUNNER_EARNINGS)}
                  >
                    <span className="flex items-center gap-2">
                      <Wallet className="h-4 w-4 text-emerald-600" />
                      View Earnings
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </Card>

              {/* Performance Tips */}
              <Card className="rounded-2xl border border-border/60 bg-background/80 shadow-sm p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-amber-500" />
                  <h2 className="text-lg font-semibold text-foreground">Elite Status</h2>
                </div>
                <p className="text-xs text-muted-foreground">
                  Complete these tasks to maintain your "Julaaz Elite Homerunner" status and
                  get priority access to high-value properties.
                </p>
                <div className="space-y-3">
                  {[
                    { id: 'response', title: 'Quick response time', desc: 'Accept inspections within 2 hours', completed: true },
                    { id: 'rating', title: 'Maintain 4.5+ rating', desc: 'From landlords and tenants', completed: true },
                    { id: 'conversion', title: '30%+ conversion rate', desc: 'Viewings to signed leases', completed: true },
                    { id: 'training', title: 'Complete monthly training', desc: 'Property inspection best practices', completed: false },
                  ].map((item) => (
                    <div
                      key={item.id}
                      className={cn(
                        'rounded-xl border px-3 py-2 text-sm flex items-start gap-3',
                        item.completed ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-border bg-background'
                      )}
                    >
                      {item.completed ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5" />
                      ) : (
                        <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                      )}
                      <div>
                        <p className="font-medium text-foreground">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </div>
  )
}

