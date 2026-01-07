import { useMemo, useState } from 'react'
import { AdminLayout } from '@/widgets/admin-layout'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import {
  Building2,
  Users,
  Wrench,
  Eye,
  DollarSign,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Search,
  Sparkles,
} from 'lucide-react'
import { Input } from '@/shared/ui/input'
import { cn } from '@/shared/lib/utils/cn'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/shared/constants/routes'
import { samplePendingApprovals, type PendingApproval } from '@/__mocks__/data/admin.mock'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import toast from 'react-hot-toast'

type FilterType = 'all' | 'property' | 'user' | 'service_provider' | 'homerunner' | 'withdrawal'
type FilterStatus = 'all' | 'pending' | 'under_review' | 'approved' | 'rejected'

export function AdminApprovalsPage() {
  const navigate = useNavigate()
  const [approvals, setApprovals] = useState(samplePendingApprovals)
  const [filterType, setFilterType] = useState<FilterType>('all')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [activePreview, setActivePreview] = useState<PendingApproval | null>(null)

  const filteredApprovals = approvals.filter((approval) => {
    const matchesType = filterType === 'all' || approval.type === filterType
    const matchesStatus = filterStatus === 'all' || approval.status === filterStatus
    const matchesSearch =
      approval.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      approval.submittedBy.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesStatus && matchesSearch
  })

  const getApprovalTypeIcon = (type: PendingApproval['type']) => {
    switch (type) {
      case 'property':
        return <Building2 className="h-5 w-5 text-blue-600" />
      case 'user':
        return <Users className="h-5 w-5 text-purple-600" />
      case 'service_provider':
        return <Wrench className="h-5 w-5 text-amber-600" />
      case 'homerunner':
        return <Eye className="h-5 w-5 text-emerald-600" />
      case 'withdrawal':
        return <DollarSign className="h-5 w-5 text-green-600" />
    }
  }

  const getStatusBadge = (status: PendingApproval['status']) => {
    const styles = {
      pending: 'bg-amber-500/10 text-amber-600',
      under_review: 'bg-blue-500/10 text-blue-600',
      approved: 'bg-emerald-500/10 text-emerald-600',
      rejected: 'bg-red-500/10 text-red-600',
    }
    const labels = {
      pending: 'Pending',
      under_review: 'Under Review',
      approved: 'Approved',
      rejected: 'Rejected',
    }
    return (
      <Badge className={cn('rounded-full px-3 py-1 text-xs font-medium', styles[status])}>
        {labels[status]}
      </Badge>
    )
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

  const typeCounts = useMemo(
    () => ({
      all: approvals.length,
      property: approvals.filter((a) => a.type === 'property').length,
      user: approvals.filter((a) => a.type === 'user').length,
      service_provider: approvals.filter((a) => a.type === 'service_provider').length,
      homerunner: approvals.filter((a) => a.type === 'homerunner').length,
      withdrawal: approvals.filter((a) => a.type === 'withdrawal').length,
    }),
    [approvals]
  )

  const statusCounts = useMemo(
    () => ({
      pending: approvals.filter((a) => a.status === 'pending').length,
      under_review: approvals.filter((a) => a.status === 'under_review').length,
      approved: approvals.filter((a) => a.status === 'approved').length,
      rejected: approvals.filter((a) => a.status === 'rejected').length,
    }),
    [approvals]
  )

  const summaryCards = [
    {
      label: 'Awaiting decision',
      value: statusCounts.pending,
      helper: 'Need quick triage',
      gradient: 'from-amber-500/80 via-orange-500 to-orange-400',
    },
    {
      label: 'In review',
      value: statusCounts.under_review,
      helper: 'Owners currently checking',
      gradient: 'from-blue-500/80 via-indigo-500 to-indigo-400',
    },
    {
      label: 'Today approvals',
      value: statusCounts.approved,
      helper: 'Already greenlit',
      gradient: 'from-emerald-500/80 via-teal-500 to-emerald-400',
    },
  ]

  const handleApprove = (approvalId: string) => {
    setApprovals((prev) =>
      prev.map((item) => (item.id === approvalId ? { ...item, status: 'approved' } : item))
    )
    toast.success('Marked as approved')
    setActivePreview((current) => (current?.id === approvalId ? null : current))
  }

  const handleReject = (approvalId: string) => {
    setApprovals((prev) =>
      prev.map((item) => (item.id === approvalId ? { ...item, status: 'rejected' } : item))
    )
    toast.success('Flagged for follow-up')
    setActivePreview((current) => (current?.id === approvalId ? null : current))
  }

  return (
    <AdminLayout>
      <main className="flex-1">
        {/* Header Section */}
        <section className="border-b border-border/60 bg-gradient-to-br from-amber-500/5 via-background to-background">
          <div className="container mx-auto max-w-7xl px-4 lg:px-6 xl:px-8 py-8 lg:py-10">
            <Button
              variant="ghost"
              className="mb-4 -ml-2 text-muted-foreground hover:text-foreground"
              onClick={() => navigate(ROUTES.ADMIN_DASHBOARD)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-3">
                <Badge className="rounded-full bg-amber-500/10 text-amber-600 px-3 py-1 text-xs font-semibold">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Compliance queue
                </Badge>
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
                  Approvals board
                </h1>
                <p className="text-sm text-muted-foreground max-w-2xl">
                  Track everything that’s waiting on compliance: listings, payouts and talent. Every
                  card below is one tap away from a decision.
                </p>
              </div>

              <div className="grid gap-4 w-full sm:grid-cols-3">
                {summaryCards.map((card) => (
                  <div
                    key={card.label}
                    className={cn(
                      'rounded-2xl p-4 text-white shadow-lg border border-white/10',
                      'bg-gradient-to-br',
                      card.gradient
                    )}
                  >
                    <p className="text-sm text-white/80">{card.label}</p>
                    <p className="text-2xl font-semibold">{card.value}</p>
                    <p className="text-xs text-white/70 mt-1">{card.helper}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Search & Filters */}
        <section className="container mx-auto max-w-7xl px-4 lg:px-6 xl:px-8 py-6">
          <div className="rounded-3xl border border-border/60 bg-surface shadow-sm p-4 lg:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search approvals, landlords, payouts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 rounded-2xl border-none bg-muted/60"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {(['all', 'property', 'user', 'service_provider', 'homerunner', 'withdrawal'] as FilterType[]).map(
                  (type) => (
                    <button
                      key={type}
                      onClick={() => setFilterType(type)}
                      className={cn(
                        'px-3 lg:px-4 py-2 rounded-full text-xs lg:text-sm font-medium transition-all border',
                        filterType === type
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background text-muted-foreground border-border/60 hover:border-primary/40 hover:text-primary'
                      )}
                    >
                      {type === 'all'
                        ? 'All items'
                        : type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}{' '}
                      ({typeCounts[type]})
                    </button>
                  )
                )}
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {(['all', 'pending', 'under_review', 'approved', 'rejected'] as FilterStatus[]).map((status) => (
                <Button
                  key={status}
                  variant={filterStatus === status ? 'default' : 'outline'}
                  size="sm"
                  className="rounded-full"
                  onClick={() => setFilterStatus(status)}
                >
                  {status.replace('_', ' ')} ({status === 'all' ? approvals.length : statusCounts[status]})
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Approvals List */}
        <section className="container mx-auto max-w-7xl px-4 lg:px-6 xl:px-8 pb-8 lg:pb-12">
          <div className="space-y-4">
            {filteredApprovals.map((approval) => (
              <Card
                key={approval.id}
                className="rounded-3xl border border-border/50 bg-background/90 shadow-sm overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    {/* Icon */}
                    <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center shrink-0">
                      {getApprovalTypeIcon(approval.type)}
                    </div>

                    {/* Details */}
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className="rounded-full bg-muted text-muted-foreground text-xs">
                          {approval.type.replace('_', ' ')}
                        </Badge>
                        {getPriorityBadge(approval.priority)}
                        {getStatusBadge(approval.status)}
                      </div>

                      <h3 className="text-lg font-semibold text-foreground">{approval.title}</h3>
                      <p className="text-sm text-muted-foreground">{approval.description}</p>

                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span>
                          Submitted by <strong className="text-foreground">{approval.submittedBy}</strong>
                        </span>
                        <span>{approval.submittedAt}</span>
                      </div>

                      {approval.details && (
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 p-4 bg-muted/50 rounded-xl">
                          {Object.entries(approval.details).map(([key, value]) => (
                            <div key={key}>
                              <p className="text-xs text-muted-foreground capitalize">
                                {key.replace('_', ' ')}
                              </p>
                              <p className="text-sm font-medium text-foreground">{value}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 min-w-[170px]">
                      {approval.status === 'pending' ? (
                        <>
                          <Button
                            className="rounded-xl bg-emerald-600 hover:bg-emerald-700"
                            onClick={() => handleApprove(approval.id)}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            className="rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleReject(approval.id)}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                          <Button
                            variant="ghost"
                            className="rounded-xl"
                            onClick={() => setActivePreview(approval)}
                          >
                            View Details
                          </Button>
                        </>
                      ) : approval.status === 'under_review' ? (
                        <>
                          <Button
                            className="rounded-xl bg-primary text-primary-foreground"
                            onClick={() => setActivePreview(approval)}
                          >
                            Continue Review
                          </Button>
                          <Button
                            variant="outline"
                            className="rounded-xl"
                            onClick={() => setActivePreview(approval)}
                          >
                            View Details
                          </Button>
                        </>
                      ) : (
                        <Badge className="rounded-full bg-muted text-muted-foreground text-[10px]">
                          {approval.status}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {filteredApprovals.length === 0 && (
              <Card className="rounded-2xl border border-border/60 bg-background/80 shadow-sm p-12 text-center">
                <CheckCircle2 className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">All caught up!</h3>
                <p className="text-muted-foreground">
                  No pending approvals matching your filters.
                </p>
              </Card>
            )}
          </div>
        </section>
      </main>

      <Dialog open={Boolean(activePreview)} onOpenChange={(open) => !open && setActivePreview(null)}>
        <DialogContent className="max-w-2xl">
          {activePreview && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span>{activePreview.title}</span>
                  <Badge className="capitalize text-[10px]">
                    {activePreview.type.replace('_', ' ')}
                  </Badge>
                </DialogTitle>
                <DialogDescription>
                  Submitted by {activePreview.submittedBy} • {activePreview.submittedAt}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">{activePreview.description}</p>
                {activePreview.details && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {Object.entries(activePreview.details).map(([key, value]) => (
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

              <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-3">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto text-red-600 border-red-600/30 hover:bg-red-50"
                  onClick={() => handleReject(activePreview.id)}
                >
                  Reject
                </Button>
                <Button
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => handleApprove(activePreview.id)}
                >
                  Approve
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}

