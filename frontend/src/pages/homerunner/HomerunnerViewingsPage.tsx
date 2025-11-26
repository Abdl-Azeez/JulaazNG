import { useState } from 'react'
import { Header } from '@/widgets/header'
import { Sidebar } from '@/widgets/sidebar'
import { Footer } from '@/widgets/footer'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import {
  Eye,
  MapPin,
  Phone,
  Calendar,
  ArrowLeft,
  CheckCircle2,
  Clock,
  MessageCircle,
  User,
  Users,
  TrendingUp,
} from 'lucide-react'
import { cn } from '@/shared/lib/utils/cn'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/shared/constants/routes'
import { sampleViewings, type PropertyViewing } from './data/sample-homerunner-data'

type FilterStatus = 'all' | 'scheduled' | 'confirmed' | 'completed'

export function HomerunnerViewingsPage() {
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')

  const filteredViewings = sampleViewings.filter((viewing) => {
    if (filterStatus === 'all') return true
    return viewing.status === filterStatus
  })

  const statusCounts = {
    all: sampleViewings.length,
    scheduled: sampleViewings.filter((v) => v.status === 'scheduled').length,
    confirmed: sampleViewings.filter((v) => v.status === 'confirmed').length,
    completed: sampleViewings.filter((v) => v.status === 'completed').length,
  }

  const totalPotentialCommission = sampleViewings.reduce(
    (sum, v) => sum + v.commissionPotential,
    0
  )

  const getStatusBadge = (status: PropertyViewing['status']) => {
    const styles = {
      scheduled: 'bg-blue-500/10 text-blue-600',
      confirmed: 'bg-emerald-500/10 text-emerald-600',
      in_progress: 'bg-amber-500/10 text-amber-600',
      completed: 'bg-primary/10 text-primary',
      no_show: 'bg-red-500/10 text-red-600',
      cancelled: 'bg-muted text-muted-foreground',
    }
    const labels = {
      scheduled: 'Scheduled',
      confirmed: 'Confirmed',
      in_progress: 'In Progress',
      completed: 'Completed',
      no_show: 'No Show',
      cancelled: 'Cancelled',
    }
    return (
      <Badge className={cn('rounded-full px-3 py-1 text-xs font-medium', styles[status])}>
        {labels[status]}
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
        <section className="border-b border-border/60 bg-gradient-to-br from-purple-500/5 via-background to-background">
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
                  <div className="h-12 w-12 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
                    <Eye className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                      Property Viewings
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      Take potential tenants to view properties and earn commissions
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="px-4 py-2 rounded-xl bg-purple-500/10 text-purple-600 text-sm">
                  <TrendingUp className="h-4 w-4 inline mr-2" />
                  ₦{totalPotentialCommission.toLocaleString()} potential commission
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="container mx-auto max-w-6xl px-4 lg:px-6 xl:px-8 py-6">
          <div className="flex flex-wrap gap-2">
            {(['all', 'scheduled', 'confirmed', 'completed'] as FilterStatus[]).map((status) => (
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

        {/* Viewings List */}
        <section className="container mx-auto max-w-6xl px-4 lg:px-6 xl:px-8 pb-8 lg:pb-12">
          <div className="space-y-4">
            {filteredViewings.map((viewing) => (
              <Card
                key={viewing.id}
                className="rounded-2xl border border-border/60 bg-background/80 shadow-sm overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    {/* Property Image */}
                    <div className="w-full lg:w-48 h-32 rounded-xl bg-muted flex items-center justify-center overflow-hidden">
                      <img
                        src={viewing.propertyImage}
                        alt={viewing.propertyTitle}
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
                        {getStatusBadge(viewing.status)}
                        <span className="text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3 inline mr-1" />
                          {viewing.scheduledFor}
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold text-foreground">
                        {viewing.propertyTitle}
                      </h3>

                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-primary" />
                          {viewing.location}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 p-3 bg-muted/50 rounded-xl">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Tenant</p>
                          <p className="text-sm font-medium flex items-center gap-2">
                            <User className="h-4 w-4 text-purple-600" />
                            {viewing.tenantName}
                          </p>
                          <p className="text-xs text-muted-foreground">{viewing.tenantPhone}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Landlord</p>
                          <p className="text-sm font-medium flex items-center gap-2">
                            <Users className="h-4 w-4 text-blue-600" />
                            {viewing.landlordName}
                          </p>
                        </div>
                      </div>

                      {viewing.notes && (
                        <p className="text-sm text-muted-foreground italic">
                          📝 {viewing.notes}
                        </p>
                      )}
                    </div>

                    {/* Actions & Earnings */}
                    <div className="flex flex-col items-end gap-3 min-w-[160px]">
                      <div className="text-right space-y-1">
                        <div>
                          <p className="text-xs text-muted-foreground">Viewing fee</p>
                          <p className="text-lg font-bold text-foreground">
                            ₦{viewing.earnAmount.toLocaleString()}
                          </p>
                        </div>
                        <div className="border-t border-border/60 pt-1">
                          <p className="text-xs text-muted-foreground">If tenant signs</p>
                          <p className="text-lg font-bold text-emerald-600">
                            +₦{viewing.commissionPotential.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 w-full">
                        {viewing.status === 'scheduled' && (
                          <Button className="rounded-xl w-full bg-emerald-600 hover:bg-emerald-700">
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Confirm
                          </Button>
                        )}
                        {viewing.status === 'confirmed' && (
                          <Button className="rounded-xl w-full">
                            <Eye className="h-4 w-4 mr-2" />
                            Start Viewing
                          </Button>
                        )}
                        <Button variant="outline" className="rounded-xl w-full">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Message Tenant
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {filteredViewings.length === 0 && (
              <Card className="rounded-2xl border border-border/60 bg-background/80 shadow-sm p-12 text-center">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No viewings found</h3>
                <p className="text-muted-foreground">
                  There are no {filterStatus !== 'all' ? filterStatus : ''} viewings at the moment.
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

