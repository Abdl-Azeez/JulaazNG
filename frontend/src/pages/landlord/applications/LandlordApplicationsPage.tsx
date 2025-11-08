import { useMemo, useState } from 'react'
import { Header } from '@/widgets/header'
import { Sidebar } from '@/widgets/sidebar'
import { Footer } from '@/widgets/footer'
import { AuthDrawer } from '@/widgets/auth-drawer'
import { useAuthStore } from '@/shared/store/auth.store'
import { LandlordNav } from '@/widgets/landlord-nav'
import { landlordApplications as sampleApplications } from '../data/sample-applications'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import { MessageSquare, Check, X, Filter, Users, Gauge, Sparkles } from 'lucide-react'
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
     return {
       total: applications.length,
       pending: applications.filter((app) => app.status === 'pending').length,
       approved: applications.filter((app) => app.status === 'approved').length,
       approvalRate:
         applications.length === 0
           ? 0
           : Math.round(
               (applications.filter((app) => app.status === 'approved').length / applications.length) * 100
             ),
     }
   }, [applications])

  const updateApplicationStatus = (id: string, status: 'approved' | 'rejected') => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status } : app))
    )
    toast.success(`Application ${status === 'approved' ? 'approved' : 'rejected'}.`)
  }

  const handleBulkAction = (action: 'approve' | 'reject') => {
    setApplications((prev) =>
      prev.map((app) =>
        app.status === 'pending'
          ? { ...app, status: action === 'approve' ? 'approved' : 'rejected' }
          : app
      )
    )
    toast.success(
      action === 'approve'
        ? 'All pending applications approved!'
        : 'All pending applications rejected.'
    )
    setBulkSheetOpen(false)
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-muted relative">
      <Header onMenuClick={handleMenuClick} onProfileClick={handleProfileClick} />
      <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-br from-primary/20 via-accent/20 to-transparent blur-3xl opacity-80 pointer-events-none" />

      <main className="relative z-10 flex-1 pb-28 lg:pb-16">
        <section className="container mx-auto px-4 lg:px-6 xl:px-8 max-w-6xl py-6 lg:py-10 space-y-8">
          <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary/10 via-background to-surface shadow-xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.18),_transparent_45%)]" />
            <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 p-6 lg:p-8">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 backdrop-blur-lg border border-primary/20 shadow-lg">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  <p className="text-xs font-semibold text-primary uppercase tracking-[0.25em]">
                    Application desk
                  </p>
                </div>
                <div className="space-y-2">
                  <h1 className="text-3xl lg:text-4xl font-black text-foreground tracking-tight">Applications</h1>
                  <p className="text-muted-foreground">
                    Monitor every viewing request and convert applicants quickly with instant approvals, filters, and bulk actions.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-primary/80">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4" /> {stats.pending} awaiting response
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Gauge className="h-4 w-4" /> {stats.approvalRate}% approval rate
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  className="rounded-2xl border-border hover:border-primary/40 hover:text-primary gap-2"
                  onClick={() => setFilterSheetOpen(true)}
                >
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
                <Button
                  className="h-12 rounded-2xl px-6 bg-primary text-primary-foreground shadow-lg hover:shadow-2xl"
                  onClick={() => setBulkSheetOpen(true)}
                >
                  Bulk Actions
                </Button>
              </div>
            </div>
          </div>

          {/* Stats pills */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { label: 'Total Applicants', value: stats.total, accent: 'bg-primary/10 text-primary', icon: <Users className="h-4 w-4" /> },
              { label: 'Awaiting Review', value: stats.pending, accent: 'bg-amber-500/10 text-amber-600', icon: <MessageSquare className="h-4 w-4" /> },
              { label: 'Approved', value: stats.approved, accent: 'bg-emerald-500/10 text-emerald-600', icon: <Check className="h-4 w-4" /> },
              { label: 'Approval Rate', value: `${stats.approvalRate}%`, accent: 'bg-primary/10 text-primary', icon: <Gauge className="h-4 w-4" /> },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-3xl border border-border/60 bg-surface/95 backdrop-blur-xl shadow-lg px-5 py-4 flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-2">{stat.value}</p>
                </div>
                <div className={cn('px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1', stat.accent)}>
                  {stat.icon}
                  Live
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-3 overflow-x-auto">
            {tabs.map((tab) => {
              const active = filter === tab.value
              return (
                <button
                  key={tab.value}
                  onClick={() => setFilter(tab.value)}
                  className={cn(
                    'px-5 py-2 rounded-2xl text-sm font-semibold transition-all border',
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

          {/* Applications */}
          <div className="space-y-4">
            {filteredApplications.map((application) => (
              <article
                key={application.id}
                className="relative overflow-hidden rounded-3xl border border-border/60 bg-surface/95 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all group"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent" />
                <div className="relative p-5 lg:p-6 flex flex-col gap-4">
                  <div className="flex items-start gap-3">
                    <img
                      src={application.avatar}
                      alt={application.applicantName}
                      className="w-14 h-14 rounded-2xl object-cover border border-border/60"
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <h2 className="text-base font-semibold text-foreground">{application.propertyName}</h2>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(application.submittedAt), 'd MMM yyyy • h:mm a')}
                          </p>
                        </div>
                        <Badge
                          className={cn(
                            'rounded-full px-3 py-1 text-xs font-semibold',
                            application.status === 'pending' && 'bg-amber-500/10 text-amber-600',
                            application.status === 'approved' && 'bg-emerald-500/10 text-emerald-600',
                            application.status === 'rejected' && 'bg-destructive/10 text-destructive'
                          )}
                        >
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                          <span>{application.applicantName}</span>
                          <span className="flex items-center gap-1">
                            <span className="font-semibold text-foreground">{application.sqft}</span> sqft
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="font-semibold text-foreground">{application.bedrooms}</span> Beds
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="font-semibold text-foreground">{application.bathrooms}</span> Baths
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="font-semibold text-foreground">{application.parking}</span> Parking
                          </span>
                        </div>
                        <div className="text-sm font-semibold text-primary">
                          Offer: ₦{(application.offerAmount / 1_000_000).toFixed(1)}M
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                        “{application.messagePreview}”
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span>
                          Move in: <span className="font-semibold text-foreground">
                            {format(new Date(application.moveInDate), 'd MMM, yyyy')}
                          </span>
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="rounded-xl gap-2 text-xs text-primary hover:bg-primary/10"
                          onClick={() => navigate(ROUTES.MESSAGING_CHAT(application.propertyId))}
                        >
                          Continue chat
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2">
                      {application.status === 'pending' && (
                        <>
                          <Button
                            variant="outline"
                            className="rounded-2xl border-border hover:border-destructive/40 hover:text-destructive gap-2"
                            onClick={() => updateApplicationStatus(application.id, 'rejected')}
                          >
                            <X className="h-4 w-4" />
                            Reject
                          </Button>
                          <Button
                            className="rounded-2xl bg-primary text-primary-foreground shadow-lg hover:shadow-xl gap-2"
                            onClick={() => updateApplicationStatus(application.id, 'approved')}
                          >
                            <Check className="h-4 w-4" />
                            Approve Viewing
                          </Button>
                        </>
                      )}
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

      {/* Sheets */}
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
                  onClick={() => setFilter(tab.value)}
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

      <Sheet open={isBulkSheetOpen} onOpenChange={setBulkSheetOpen}>
        <SheetContent side="bottom" className="w-full h-[45vh] rounded-t-[24px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Bulk actions</SheetTitle>
            <p className="text-sm text-muted-foreground">Update all pending applications in one tap.</p>
          </SheetHeader>
          <div className="mt-8 space-y-3">
            <Button
              className="w-full rounded-2xl bg-primary text-primary-foreground h-12"
              onClick={() => handleBulkAction('approve')}
            >
              Approve all pending
            </Button>
            <Button
              variant="outline"
              className="w-full rounded-2xl h-12 border-border hover:border-destructive/40 hover:text-destructive"
              onClick={() => handleBulkAction('reject')}
            >
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

