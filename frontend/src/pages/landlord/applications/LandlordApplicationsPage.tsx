import { useMemo, useState } from 'react'
import { Header } from '@/widgets/header'
import { Sidebar } from '@/widgets/sidebar'
import { Footer } from '@/widgets/footer'
import { AuthDialog } from '@/widgets/auth-dialog'
import { useAuthStore } from '@/shared/store/auth.store'
import { LandlordNav } from '@/widgets/landlord-nav'
import { landlordApplications as sampleApplications } from '../data/sample-applications'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import { MessageSquare, Check, X, Filter, Users, Gauge, Sparkles, TrendingUp, Clock, DollarSign, Calendar, Zap, AlertCircle } from 'lucide-react'
import { cn } from '@/shared/lib/utils/cn'
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

type ApplicationFilter = 'all' | 'pending' | 'approved' | 'rejected'

const tabs: { label: string; value: ApplicationFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
]

export function LandlordApplicationsPage() {
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [filter, setFilter] = useState<ApplicationFilter>('all')
  const [applications, setApplications] = useState(sampleApplications)
  const [isFilterSheetOpen, setFilterSheetOpen] = useState(false)
  const [isBulkSheetOpen, setBulkSheetOpen] = useState(false)

  const filteredApplications = useMemo(() => {
    if (filter === 'all') return applications
    return applications.filter((application) => application.status === filter)
  }, [applications, filter])

  const handleMenuClick = () => setIsSidebarOpen(true)
  const handleProfileClick = () => {
    if (!isAuthenticated) {
      setIsDrawerOpen(true)
    } else {
      navigate(ROUTES.PROFILE)
    }
  }

  const stats = useMemo(() => {
     const pending = applications.filter((app) => app.status === 'pending')
     const approved = applications.filter((app) => app.status === 'approved')
     const rejected = applications.filter((app) => app.status === 'rejected')
     const totalValue = applications.reduce((sum, app) => sum + app.offerAmount, 0)
     const avgOffer = applications.length > 0 ? totalValue / applications.length : 0
     
     return {
       total: applications.length,
       pending: pending.length,
       approved: approved.length,
       rejected: rejected.length,
       approvalRate:
         applications.length === 0
           ? 0
           : Math.round((approved.length / applications.length) * 100),
       totalValue,
       avgOffer,
       pendingValue: pending.reduce((sum, app) => sum + app.offerAmount, 0),
     }
   }, [applications])

  const updateApplicationStatus = (id: string, status: 'approved' | 'rejected') => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status } : app))
    )
    toast.success(`Application ${status === 'approved' ? 'approved' : 'rejected'}.`)
  }

  const handleBulkAction = (action: 'approve' | 'reject') => {
    const pendingCount = applications.filter((app) => app.status === 'pending').length
    setApplications((prev) =>
      prev.map((app) =>
        app.status === 'pending'
          ? { ...app, status: action === 'approve' ? 'approved' : 'rejected' }
          : app
      )
    )
    toast.success(
      action === 'approve'
        ? `${pendingCount} pending application${pendingCount !== 1 ? 's' : ''} approved!`
        : `${pendingCount} pending application${pendingCount !== 1 ? 's' : ''} rejected.`
    )
    setBulkSheetOpen(false)
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-muted relative">
      <Header onMenuClick={handleMenuClick} onProfileClick={handleProfileClick} />
      <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-br from-primary/20 via-accent/20 to-transparent blur-3xl opacity-80 pointer-events-none" />

      <main className="relative z-10 flex-1 pb-28 lg:pb-16">
        <section className="container mx-auto px-4 lg:px-6 xl:px-8 max-w-7xl py-6 lg:py-10 space-y-6">
          {/* Hero Dashboard Header */}
          <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary/10 via-background to-surface shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.18),_transparent_45%)]" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
            <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 p-6 lg:p-8">
              <div className="space-y-4 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 backdrop-blur-lg border border-primary/20 shadow-lg">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  <p className="text-xs font-semibold text-primary uppercase tracking-[0.25em]">
                    Application Center
                  </p>
                </div>
                <div className="space-y-2">
                  <h1 className="text-4xl lg:text-5xl font-black text-foreground tracking-tight">
                    Applications
                  </h1>
                  <p className="text-muted-foreground text-lg">
                    Review and manage all property viewing requests. Approve applicants, track conversions, and optimize your tenant selection process.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <span className="font-semibold text-amber-600">{stats.pending}</span>
                    <span className="text-muted-foreground">awaiting review</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                    <span className="font-semibold text-emerald-600">{stats.approvalRate}%</span>
                    <span className="text-muted-foreground">approval rate</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-primary">₦{(stats.pendingValue / 1_000_000).toFixed(1)}M</span>
                    <span className="text-muted-foreground">pending value</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  className="rounded-2xl border-border hover:border-primary/40 hover:text-primary gap-2 h-12 px-6"
                  onClick={() => setFilterSheetOpen(true)}
                >
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
                <Button
                  className="h-12 rounded-2xl px-6 bg-primary text-primary-foreground shadow-lg hover:shadow-2xl gap-2"
                  onClick={() => setBulkSheetOpen(true)}
                  disabled={stats.pending === 0}
                >
                  <Zap className="h-4 w-4" />
                  Bulk Actions
                  {stats.pending > 0 && (
                    <Badge className="ml-1 bg-primary-foreground text-primary h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                      {stats.pending}
                    </Badge>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Dashboard Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { 
                label: 'Total Applicants', 
                value: stats.total, 
                subtitle: 'All time',
                accent: 'bg-primary/10 text-primary', 
                icon: <Users className="h-5 w-5" />,
                bg: 'bg-primary/5',
                trend: '+3 this week',
              },
              { 
                label: 'Awaiting Review', 
                value: stats.pending, 
                subtitle: 'Needs action',
                accent: 'bg-amber-500/10 text-amber-600', 
                icon: <MessageSquare className="h-5 w-5" />,
                bg: 'bg-amber-500/5',
                trend: 'High priority',
              },
              { 
                label: 'Approved', 
                value: stats.approved, 
                subtitle: 'Ready to proceed',
                accent: 'bg-emerald-500/10 text-emerald-600', 
                icon: <Check className="h-5 w-5" />,
                bg: 'bg-emerald-500/5',
                trend: `${stats.approvalRate}% success rate`,
              },
              { 
                label: 'Total Value', 
                value: `₦${(stats.totalValue / 1_000_000).toFixed(1)}M`, 
                subtitle: `Avg: ₦${(stats.avgOffer / 1_000_000).toFixed(1)}M`,
                accent: 'bg-primary/10 text-primary', 
                icon: <DollarSign className="h-5 w-5" />,
                bg: 'bg-primary/5',
                trend: 'All applications',
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="group relative overflow-hidden rounded-3xl border border-border/60 bg-surface/95 backdrop-blur-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/5 to-transparent" />
                <div className="relative p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                      {stat.label}
                    </span>
                    <div className={cn('p-3 rounded-2xl border border-border/50 shadow-inner', stat.bg)}>
                      {stat.icon}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-3xl font-black text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
                  </div>
                  <div className="flex items-center gap-1.5 pt-2 border-t border-border/50">
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="text-xs font-semibold text-emerald-600">{stat.trend}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {tabs.map((tab) => {
              const active = filter === tab.value
              const count = tab.value === 'all' 
                ? applications.length 
                : applications.filter(app => app.status === tab.value).length
              return (
                <button
                  key={tab.value}
                  onClick={() => setFilter(tab.value)}
                  className={cn(
                    'px-5 py-2.5 rounded-xl text-sm font-semibold transition-all border whitespace-nowrap',
                    active
                      ? 'bg-primary text-primary-foreground border-primary shadow-lg scale-105'
                      : 'border-border text-muted-foreground hover:border-primary/40 hover:text-primary hover:bg-primary/5'
                  )}
                >
                  {tab.label}
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

          {/* Applications List */}
          <div className="space-y-4">
            {filteredApplications.length === 0 ? (
              <div className="rounded-3xl border border-border/60 bg-surface/95 backdrop-blur-xl shadow-lg p-12 text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-semibold text-foreground mb-2">No applications found</p>
                <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
              </div>
            ) : (
              filteredApplications.map((application) => (
                <article
                  key={application.id}
                  className="relative overflow-hidden rounded-3xl border border-border/60 bg-surface/95 backdrop-blur-xl shadow-lg hover:shadow-2xl hover:-translate-y-0.5 transition-all group"
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-primary/5 via-primary/5 to-transparent" />
                  <div className="relative p-6 flex flex-col lg:flex-row lg:items-start gap-6">
                    <div className="flex items-start gap-4 flex-1">
                      <img
                        src={application.avatar}
                        alt={application.applicantName}
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-border/60 flex-shrink-0"
                      />
                      <div className="flex-1 space-y-3 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                          <div className="space-y-1">
                            <h2 className="text-xl font-bold text-foreground">{application.propertyName}</h2>
                            <p className="text-sm text-muted-foreground">
                              {application.applicantName} • {format(new Date(application.submittedAt), 'MMM d, yyyy • h:mm a')}
                            </p>
                          </div>
                          <Badge
                            className={cn(
                              'rounded-full px-4 py-1.5 text-xs font-bold w-fit',
                              application.status === 'pending' && 'bg-amber-500/10 text-amber-600 border-amber-500/20 border',
                              application.status === 'approved' && 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 border',
                              application.status === 'rejected' && 'bg-destructive/10 text-destructive border-destructive/20 border'
                            )}
                          >
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                          <div className="space-y-1">
                            <span className="text-xs uppercase tracking-widest text-muted-foreground/80">Offer</span>
                            <p className="text-foreground font-bold text-lg">₦{(application.offerAmount / 1_000_000).toFixed(1)}M</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-xs uppercase tracking-widest text-muted-foreground/80">Size</span>
                            <p className="text-foreground font-semibold">{application.sqft} sqft</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-xs uppercase tracking-widest text-muted-foreground/80">Move In</span>
                            <p className="text-foreground font-semibold">
                              {format(new Date(application.moveInDate), 'MMM d')}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-xs uppercase tracking-widest text-muted-foreground/80">Details</span>
                            <p className="text-foreground font-semibold">
                              {application.bedrooms}B • {application.bathrooms}Ba • {application.parking}P
                            </p>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 italic">
                          "{application.messagePreview}"
                        </p>
                        
                        <div className="flex items-center gap-3 pt-2 border-t border-border/50">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-xl gap-2 text-xs text-primary hover:bg-primary/10"
                            onClick={() => navigate(ROUTES.MESSAGING_CHAT(application.propertyId))}
                          >
                            <MessageSquare className="h-4 w-4" />
                            Continue chat
                          </Button>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" />
                            Submitted {format(new Date(application.submittedAt), 'MMM d')}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:min-w-[140px]">
                      {application.status === 'pending' && (
                        <>
                          <Button
                            variant="outline"
                            className="rounded-xl border-border hover:border-destructive/40 hover:text-destructive gap-2"
                            onClick={() => updateApplicationStatus(application.id, 'rejected')}
                          >
                            <X className="h-4 w-4" />
                            Reject
                          </Button>
                          <Button
                            className="rounded-xl bg-primary text-primary-foreground shadow-lg hover:shadow-xl gap-2"
                            onClick={() => updateApplicationStatus(application.id, 'approved')}
                          >
                            <Check className="h-4 w-4" />
                            Approve
                          </Button>
                        </>
                      )}
                      {application.status === 'approved' && (
                        <Badge className="rounded-xl bg-emerald-500/10 text-emerald-600 border-emerald-500/20 border px-4 py-2 text-xs font-semibold w-fit">
                          <Check className="h-3.5 w-3.5 mr-1.5" />
                          Approved
                        </Badge>
                      )}
                      {application.status === 'rejected' && (
                        <Badge className="rounded-xl bg-destructive/10 text-destructive border-destructive/20 border px-4 py-2 text-xs font-semibold w-fit">
                          <X className="h-3.5 w-3.5 mr-1.5" />
                          Rejected
                        </Badge>
                      )}
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </main>

      <LandlordNav />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <AuthDialog open={isDrawerOpen} onOpenChange={setIsDrawerOpen} />
      <Footer />
    </div>

      {/* Filter Sheet */}
      <Sheet open={isFilterSheetOpen} onOpenChange={setFilterSheetOpen}>
        <SheetContent side="bottom" className="w-full h-[60vh] rounded-t-[24px] overflow-y-auto">
          <SheetHeader className="space-y-1">
            <SheetTitle>Filter Applications</SheetTitle>
            <p className="text-sm text-muted-foreground">Quickly scope your pipeline.</p>
          </SheetHeader>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {tabs.map((tab) => {
              const active = filter === tab.value
              return (
                <button
                  key={tab.value}
                  onClick={() => {
                    setFilter(tab.value)
                    setFilterSheetOpen(false)
                  }}
                  className={cn(
                    'px-4 py-3 rounded-2xl text-sm font-semibold border text-left transition-all',
                    active
                      ? 'bg-primary text-primary-foreground border-primary shadow-lg'
                      : 'border-border text-muted-foreground hover:border-primary/40 hover:text-primary'
                  )}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
          <SheetFooter className="mt-6">
            <Button className="rounded-2xl bg-primary text-primary-foreground" onClick={() => setFilterSheetOpen(false)}>
              Done
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Bulk Actions Sheet */}
      <Sheet open={isBulkSheetOpen} onOpenChange={setBulkSheetOpen}>
        <SheetContent side="bottom" className="w-full h-[45vh] rounded-t-[24px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Bulk Actions</SheetTitle>
            <p className="text-sm text-muted-foreground">
              Update all {stats.pending} pending application{stats.pending !== 1 ? 's' : ''} in one tap.
            </p>
          </SheetHeader>
          <div className="mt-8 space-y-3">
            <Button
              className="w-full rounded-2xl bg-primary text-primary-foreground h-12 gap-2"
              onClick={() => handleBulkAction('approve')}
              disabled={stats.pending === 0}
            >
              <Check className="h-4 w-4" />
              Approve all pending
            </Button>
            <Button
              variant="outline"
              className="w-full rounded-2xl h-12 border-border hover:border-destructive/40 hover:text-destructive gap-2"
              onClick={() => handleBulkAction('reject')}
              disabled={stats.pending === 0}
            >
              <X className="h-4 w-4" />
              Reject all pending
            </Button>
          </div>
          <SheetFooter className="mt-6">
            <Button variant="ghost" className="rounded-2xl" onClick={() => setBulkSheetOpen(false)}>
              Close
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  )
}
