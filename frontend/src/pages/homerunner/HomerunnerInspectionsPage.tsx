import { useState } from 'react'
import { Header } from '@/widgets/header'
import { Sidebar } from '@/widgets/sidebar'
import { Footer } from '@/widgets/footer'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import {
  ClipboardCheck,
  MapPin,
  Phone,
  Calendar,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Camera,
  FileText,
  User,
} from 'lucide-react'
import { cn } from '@/shared/lib/utils/cn'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/shared/constants/routes'
import { sampleInspections, type PropertyInspection } from './data/sample-homerunner-data'

type FilterStatus = 'all' | 'pending' | 'confirmed' | 'completed'

export function HomerunnerInspectionsPage() {
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')

  const filteredInspections = sampleInspections.filter((inspection) => {
    if (filterStatus === 'all') return true
    return inspection.status === filterStatus
  })

  const statusCounts = {
    all: sampleInspections.length,
    pending: sampleInspections.filter((i) => i.status === 'pending').length,
    confirmed: sampleInspections.filter((i) => i.status === 'confirmed').length,
    completed: sampleInspections.filter((i) => i.status === 'completed').length,
  }

  const getStatusBadge = (status: PropertyInspection['status']) => {
    const styles = {
      pending: 'bg-amber-500/10 text-amber-600',
      confirmed: 'bg-emerald-500/10 text-emerald-600',
      in_progress: 'bg-blue-500/10 text-blue-600',
      completed: 'bg-primary/10 text-primary',
      cancelled: 'bg-red-500/10 text-red-600',
    }
    const labels = {
      pending: 'Pending',
      confirmed: 'Confirmed',
      in_progress: 'In Progress',
      completed: 'Completed',
      cancelled: 'Cancelled',
    }
    return (
      <Badge className={cn('rounded-full px-3 py-1 text-xs font-medium', styles[status])}>
        {labels[status]}
      </Badge>
    )
  }

  const getTypeBadge = (type: PropertyInspection['type']) => {
    const styles = {
      new_listing: 'bg-emerald-500/10 text-emerald-600',
      periodic: 'bg-blue-500/10 text-blue-600',
      move_out: 'bg-amber-500/10 text-amber-600',
    }
    const labels = {
      new_listing: 'New Listing',
      periodic: 'Periodic',
      move_out: 'Move-out',
    }
    return (
      <Badge className={cn('rounded-full px-2.5 py-0.5 text-[11px]', styles[type])}>
        {labels[type]}
      </Badge>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        onMenuClick={() => setIsSidebarOpen(true)}
        onProfileClick={() => navigate(ROUTES.PROFILE)}
        className="lg:shadow-sm"
      />

      <main className="flex-1">
        {/* Header Section */}
        <section className="border-b border-border/60 bg-gradient-to-br from-blue-500/5 via-background to-background">
          <div className="container mx-auto max-w-6xl px-4 lg:px-6 xl:px-8 py-8 lg:py-10">
            <Button
              variant="ghost"
              className="mb-4 -ml-2 text-muted-foreground hover:text-foreground"
              onClick={() => navigate(ROUTES.HOMERUNNER_DASHBOARD)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                    <ClipboardCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                      Property Inspections
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      Inspect properties submitted by landlords for listing approval
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <div className="px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-600 font-semibold">
                  ₦{sampleInspections.reduce((sum, i) => sum + i.earnAmount, 0).toLocaleString()} potential
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="container mx-auto max-w-6xl px-4 lg:px-6 xl:px-8 py-6">
          <div className="flex flex-wrap gap-2">
            {(['all', 'pending', 'confirmed', 'completed'] as FilterStatus[]).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-all',
                  filterStatus === status
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                )}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)} ({statusCounts[status]})
              </button>
            ))}
          </div>
        </section>

        {/* Inspections List */}
        <section className="container mx-auto max-w-6xl px-4 lg:px-6 xl:px-8 pb-8 lg:pb-12">
          <div className="space-y-4">
            {filteredInspections.map((inspection) => (
              <Card
                key={inspection.id}
                className="rounded-2xl border border-border/60 bg-background/80 shadow-sm overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    {/* Property Image */}
                    <div className="w-full lg:w-48 h-32 rounded-xl bg-muted flex items-center justify-center overflow-hidden">
                      <img
                        src={inspection.propertyImage}
                        alt={inspection.propertyTitle}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                          e.currentTarget.parentElement!.innerHTML = `<div class="flex flex-col items-center justify-center text-muted-foreground"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg><span class="text-xs mt-2">No image</span></div>`
                        }}
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        {getTypeBadge(inspection.type)}
                        {getStatusBadge(inspection.status)}
                        <span className="text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3 inline mr-1" />
                          {inspection.scheduledFor}
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold text-foreground">
                        {inspection.propertyTitle}
                      </h3>

                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-primary" />
                          {inspection.location}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm">
                        <span className="inline-flex items-center gap-1 text-muted-foreground">
                          <User className="h-4 w-4 text-primary" />
                          {inspection.landlordName}
                        </span>
                        <span className="inline-flex items-center gap-1 text-muted-foreground">
                          <Phone className="h-4 w-4 text-primary" />
                          {inspection.landlordPhone}
                        </span>
                      </div>

                      {inspection.notes && (
                        <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
                          <FileText className="h-4 w-4 inline mr-2 text-primary" />
                          {inspection.notes}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-end gap-3 min-w-[140px]">
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Earn</p>
                        <p className="text-xl font-bold text-emerald-600">
                          ₦{inspection.earnAmount.toLocaleString()}
                        </p>
                      </div>

                      {inspection.status === 'pending' && (
                        <Button className="rounded-xl w-full bg-emerald-600 hover:bg-emerald-700">
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Accept
                        </Button>
                      )}
                      {inspection.status === 'confirmed' && (
                        <Button className="rounded-xl w-full">
                          <Camera className="h-4 w-4 mr-2" />
                          Start Inspection
                        </Button>
                      )}
                      {inspection.status === 'completed' && (
                        <Button variant="outline" className="rounded-xl w-full">
                          View Report
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {filteredInspections.length === 0 && (
              <Card className="rounded-2xl border border-border/60 bg-background/80 shadow-sm p-12 text-center">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No inspections found</h3>
                <p className="text-muted-foreground">
                  There are no {filterStatus !== 'all' ? filterStatus : ''} inspections at the moment.
                </p>
              </Card>
            )}
          </div>
        </section>
      </main>

      <Footer />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </div>
  )
}

