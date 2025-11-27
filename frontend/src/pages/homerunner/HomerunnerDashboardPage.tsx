import { useMemo, useState } from 'react'
import { Header } from '@/widgets/header'
import { Sidebar } from '@/widgets/sidebar'
import { Footer } from '@/widgets/footer'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { Input } from '@/shared/ui/input'
import { Textarea } from '@/shared/ui/textarea'
import { Label } from '@/shared/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
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
  MessageCircle,
  BellRing,
  Route,
  NotebookPen,
  ShieldCheck,
  Send,
  Sparkles,
  CalendarCheck,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/shared/lib/utils/cn'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/shared/constants/routes'
import {
  sampleInspections,
  sampleViewings,
  sampleEarnings,
  performanceStats,
  sampleScheduleItems,
  type HomerunnerScheduleItem,
} from './data/sample-homerunner-data'
import toast from 'react-hot-toast'

type QuickAction = {
  id: string
  title: string
  description: string
  ctaLabel: string
  placeholder: string
  referenceLabel: string
  icon: LucideIcon
  accent: string
}

const quickActionShortcuts: QuickAction[] = [
  {
    id: 'log-inspection',
    title: 'Log inspection note',
    description: 'Capture a quick highlight for landlords',
    ctaLabel: 'Save note',
    placeholder: 'e.g. Fixed loose cabinet hinge in the kitchen...',
    referenceLabel: 'Property / landlord contact',
    icon: ClipboardCheck,
    accent: 'bg-emerald-500/10 text-emerald-600',
  },
  {
    id: 'share-update',
    title: 'Send tenant update',
    description: 'Share next steps or arrival times',
    ctaLabel: 'Send message',
    placeholder: 'Let tenant know what to expect...',
    referenceLabel: 'Tenant name or phone',
    icon: MessageCircle,
    accent: 'bg-purple-500/10 text-purple-600',
  },
  {
    id: 'schedule-reminder',
    title: 'Set follow-up reminder',
    description: 'Stay on track with quick reminders',
    ctaLabel: 'Schedule reminder',
    placeholder: 'Reminder details and time...',
    referenceLabel: 'Reminder time / channel',
    icon: BellRing,
    accent: 'bg-amber-500/10 text-amber-600',
  },
  {
    id: 'share-route',
    title: 'Share route with team',
    description: 'Drop a pin so support can assist',
    ctaLabel: 'Share route',
    placeholder: 'Paste map link or directions...',
    referenceLabel: 'Route or location link',
    icon: Route,
    accent: 'bg-blue-500/10 text-blue-600',
  },
]

const scheduleTypeStyles: Record<
  HomerunnerScheduleItem['type'],
  { label: string; badgeClass: string }
> = {
  inspection: { label: 'Inspection', badgeClass: 'bg-emerald-500/10 text-emerald-600' },
  viewing: { label: 'Viewing', badgeClass: 'bg-purple-500/10 text-purple-600' },
  training: { label: 'Training', badgeClass: 'bg-blue-500/10 text-blue-600' },
  follow_up: { label: 'Follow-up', badgeClass: 'bg-amber-500/10 text-amber-600' },
}

export function HomerunnerDashboardPage() {
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false)
  const [activeAction, setActiveAction] = useState<QuickAction | null>(null)
  const [actionForm, setActionForm] = useState({ reference: '', notes: '' })

  const handleProfileClick = () => {
    navigate(ROUTES.PROFILE)
  }

  const todaysAgenda = useMemo(() => sampleScheduleItems.slice(0, 3), [])
  const highPriorityCount = useMemo(
    () => sampleScheduleItems.filter((item) => item.priority === 'high').length,
    []
  )

  const handleOpenAction = (action: QuickAction) => {
    setActionForm({ reference: '', notes: '' })
    setActiveAction(action)
  }

  const handleActionSubmit = () => {
    if (!activeAction) return
    const reference = actionForm.reference.trim()
    toast.success(
      reference
        ? `${activeAction.title} logged for ${reference}`
        : `${activeAction.title} saved!`
    )
    setActionForm({ reference: '', notes: '' })
    setActiveAction(null)
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
                    onClick={() => setIsScheduleDialogOpen(true)}
                  >
                    <Calendar className="h-4 w-4" />
                    My schedule
                  </Button>
                  <Button
                    variant="secondary"
                    className="rounded-xl h-11 px-5 flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary/20"
                    onClick={() => handleOpenAction(quickActionShortcuts[0])}
                  >
                    <NotebookPen className="h-4 w-4" />
                    Quick update
                  </Button>
                </div>
                <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-500/10 px-3 py-2 rounded-2xl w-full lg:w-auto">
                  <Sparkles className="h-4 w-4" />
                  <span>
                    {highPriorityCount > 0
                      ? `${highPriorityCount} high priority task${highPriorityCount > 1 ? 's' : ''} need attention today.`
                      : 'Keep the streak going — no urgent tasks pending!'}
                  </span>
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
        <section className="container mx-auto max-w-7xl px-4 lg:px-6 xl:px-8 pb-8 lg:pb-12">
          <div className="grid gap-4 lg:gap-4 lg:grid-cols-3">
            {/* Left Side - Takes 2 columns */}
            <div className="lg:col-span-2 space-y-4">
              {/* Inspections */}
              <Card className="rounded-2xl border border-border/60 bg-background/80 shadow-sm">
                <div className="p-4 border-b border-border/50 flex items-center justify-between">
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
                      className="p-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4"
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
                <div className="p-4 border-b border-border/50 flex items-center justify-between">
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
                      className="p-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4"
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

              {/* Elite Status - Moved to left side to balance layout */}
              <Card className="rounded-2xl border border-border/60 bg-background/80 shadow-sm p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-amber-500" />
                  <h2 className="text-lg font-semibold text-foreground">Elite Status</h2>
                </div>
                <p className="text-xs text-muted-foreground">
                  Complete these tasks to maintain your "Julaaz Elite Homerunner" status and
                  get priority access to high-value properties.
                </p>
                <div className="space-y-2">
                  {[
                    { id: 'response', title: 'Quick response time', desc: 'Accept inspections within 2 hours', completed: true },
                    { id: 'rating', title: 'Maintain 4.5+ rating', desc: 'From landlords and tenants', completed: true },
                    { id: 'conversion', title: '30%+ conversion rate', desc: 'Viewings to signed leases', completed: true },
                    { id: 'training', title: 'Complete monthly training', desc: 'Property inspection best practices', completed: false },
                  ].map((item) => (
                    <div
                      key={item.id}
                      className={cn(
                        'rounded-lg border px-2.5 py-2 text-xs flex items-start gap-2',
                        item.completed ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-border bg-background'
                      )}
                    >
                      {item.completed ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      ) : (
                        <Clock className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                      )}
                      <div className="min-w-0">
                        <p className="font-medium text-foreground text-xs">{item.title}</p>
                        <p className="text-[10px] text-muted-foreground leading-tight">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Side Panel - Takes 1 column */}
            <div className="space-y-4">
              {/* Commission Tracker */}
              <Card className="rounded-2xl border border-border/60 bg-gradient-to-br from-emerald-500/10 via-background to-background shadow-sm p-4 space-y-3">
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

              {/* Agenda Snapshot */}
              <Card className="rounded-2xl border border-border/60 bg-background/80 shadow-sm p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <CalendarCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Today's agenda</h2>
                    <p className="text-xs text-muted-foreground">
                      {todaysAgenda.length} upcoming task{todaysAgenda.length !== 1 ? 's' : ''} in queue
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  {todaysAgenda.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-border/60 hover:border-primary/40 transition-colors p-3"
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <Badge className={cn('rounded-full px-3 py-0.5 text-[11px]', scheduleTypeStyles[item.type].badgeClass)}>
                          {scheduleTypeStyles[item.type].label}
                        </Badge>
                        <span className="text-muted-foreground">{item.time}</span>
                      </div>
                      <p className="text-sm font-semibold text-foreground">{item.title}</p>
                      <p className="text-xs text-muted-foreground inline-flex items-center gap-1 mt-1">
                        <MapPin className="h-3.5 w-3.5 text-primary" />
                        {item.location}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.details}</p>
                    </div>
                  ))}
                </div>
                <Button
                  variant="ghost"
                  className="rounded-xl w-full justify-between text-sm"
                  onClick={() => setIsScheduleDialogOpen(true)}
                >
                  Open detailed schedule
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Card>

              {/* Navigation & Instant Tools Combined */}
              <Card className="rounded-2xl border border-border/60 bg-background/80 shadow-sm p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">Navigation</h2>
                </div>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-between rounded-xl h-10 text-sm"
                    onClick={() => navigate(ROUTES.HOMERUNNER_INSPECTIONS)}
                  >
                    <span className="flex items-center gap-2">
                      <ClipboardCheck className="h-4 w-4 text-blue-600" />
                      Inspections
                    </span>
                    <Badge className="rounded-full bg-blue-500/10 text-blue-600 text-xs">
                      {sampleInspections.filter((i) => i.status === 'pending').length}
                    </Badge>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-between rounded-xl h-10 text-sm"
                    onClick={() => navigate(ROUTES.HOMERUNNER_VIEWINGS)}
                  >
                    <span className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-purple-600" />
                      Viewings
                    </span>
                    <Badge className="rounded-full bg-purple-500/10 text-purple-600 text-xs">
                      {sampleViewings.filter((v) => v.status === 'scheduled').length}
                    </Badge>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-between rounded-xl h-10 text-sm"
                    onClick={() => navigate(ROUTES.HOMERUNNER_EARNINGS)}
                  >
                    <span className="flex items-center gap-2">
                      <Wallet className="h-4 w-4 text-emerald-600" />
                      Earnings
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="pt-3 border-t border-border/60">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-semibold text-foreground">Quick actions</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {quickActionShortcuts.slice(0, 4).map((action) => {
                      const Icon = action.icon
                      return (
                        <button
                          key={action.id}
                          type="button"
                          className="flex flex-col items-center gap-1.5 rounded-xl border border-border/60 p-2.5 text-center hover:border-primary/40 hover:bg-primary/5 transition-colors"
                          onClick={() => handleOpenAction(action)}
                        >
                          <span className={cn('h-8 w-8 rounded-lg flex items-center justify-center', action.accent)}>
                            <Icon className="h-4 w-4" />
                          </span>
                          <p className="text-[10px] font-medium text-foreground leading-tight">{action.title}</p>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Today&apos;s Playbook</DialogTitle>
            <DialogDescription>
              Keep track of every landlord touch point, tenant viewing, and training session in one view.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto space-y-4 pr-1">
            {sampleScheduleItems.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-border/60 p-4 space-y-2"
              >
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Badge className={cn('rounded-full px-3 py-0.5 text-[11px]', scheduleTypeStyles[item.type].badgeClass)}>
                      {scheduleTypeStyles[item.type].label}
                    </Badge>
                    {item.priority && (
                      <span className={cn('text-xs font-semibold', item.priority === 'high' ? 'text-red-500' : 'text-amber-600')}>
                        {item.priority.toUpperCase()} priority
                      </span>
                    )}
                  </div>
                  <span className="text-muted-foreground">{item.time}</span>
                </div>
                <p className="text-base font-semibold text-foreground">{item.title}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-primary" />
                  {item.location}
                </p>
                <p className="text-sm text-muted-foreground">{item.details}</p>
              </div>
            ))}
          </div>
          <DialogFooter className="pt-2">
            <Button variant="secondary" onClick={() => setIsScheduleDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(activeAction)}
        onOpenChange={(open) => {
          if (!open) {
            setActiveAction(null)
            setActionForm({ reference: '', notes: '' })
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{activeAction?.title}</DialogTitle>
            <DialogDescription>{activeAction?.description}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="action-reference">{activeAction?.referenceLabel}</Label>
              <Input
                id="action-reference"
                placeholder="e.g. Mr Musa (+234 80..)"
                value={actionForm.reference}
                onChange={(event) =>
                  setActionForm((prev) => ({ ...prev, reference: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="action-notes">Details</Label>
              <Textarea
                id="action-notes"
                placeholder={activeAction?.placeholder}
                value={actionForm.notes}
                onChange={(event) => setActionForm((prev) => ({ ...prev, notes: event.target.value }))}
              />
            </div>
          </div>
          <DialogFooter className="pt-2">
            <Button
              variant="outline"
              onClick={() => {
                setActiveAction(null)
                setActionForm({ reference: '', notes: '' })
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="gap-2"
              onClick={handleActionSubmit}
              disabled={!actionForm.reference.trim() || !actionForm.notes.trim()}
            >
              <Send className="h-4 w-4" />
              {activeAction?.ctaLabel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </div>
  )
}

